import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STATUS_FILE = path.join(__dirname, 'site_status.json');

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize default site_status.json if it doesn't exist
if (!fs.existsSync(STATUS_FILE)) {
  fs.writeFileSync(
    STATUS_FILE,
    JSON.stringify({ isOpen: true, updatedAt: new Date().toISOString() }, null, 2),
    'utf-8'
  );
}

function getSiteStatus(): { isOpen: boolean; updatedAt: string } {
  try {
    if (fs.existsSync(STATUS_FILE)) {
      const data = JSON.parse(fs.readFileSync(STATUS_FILE, 'utf-8'));
      return {
        isOpen: typeof data.isOpen === 'boolean' ? data.isOpen : true,
        updatedAt: data.updatedAt || new Date().toISOString(),
      };
    }
  } catch (err) {
    console.error('Error reading site status:', err);
  }
  return { isOpen: true, updatedAt: new Date().toISOString() };
}

function setSiteStatus(isOpen: boolean): { isOpen: boolean; updatedAt: string } {
  const status = { isOpen, updatedAt: new Date().toISOString() };
  try {
    fs.writeFileSync(STATUS_FILE, JSON.stringify(status, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing site status:', err);
  }
  return status;
}

// REST API for universal site status
app.get('/api/site-status', (_req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.json(getSiteStatus());
});

app.post('/api/site-status', (req, res) => {
  const { isOpen } = req.body;
  if (typeof isOpen !== 'boolean') {
    return res.status(400).json({ error: 'isOpen boolean is required' });
  }
  const updated = setSiteStatus(isOpen);
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.json(updated);
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const distPath = path.join(__dirname, 'dist');
  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));

  if (isProd || (hasDist && process.env.SERVE_DIST === 'true')) {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
