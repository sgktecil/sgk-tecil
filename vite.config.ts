import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function siteStatusPlugin(): Plugin {
  const statusFile = path.resolve(__dirname, 'site_status.json');
  return {
    name: 'site-status-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith('/api/site-status')) {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

          if (req.method === 'GET') {
            try {
              if (fs.existsSync(statusFile)) {
                return res.end(fs.readFileSync(statusFile, 'utf-8'));
              }
            } catch (err) {
              console.error('Error reading site_status.json:', err);
            }
            return res.end(JSON.stringify({ isOpen: false, updatedAt: new Date().toISOString() }));
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                const parsed = JSON.parse(body || '{}');
                const isOpen = typeof parsed.isOpen === 'boolean' ? parsed.isOpen : false;
                const data = { isOpen, updatedAt: new Date().toISOString() };
                fs.writeFileSync(statusFile, JSON.stringify(data, null, 2), 'utf-8');
                return res.end(JSON.stringify(data));
              } catch (err) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: 'Invalid JSON body' }));
              }
            });
            return;
          }
        }
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), siteStatusPlugin()],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});
