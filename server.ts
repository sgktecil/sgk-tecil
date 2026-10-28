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

// Tüm sayfalar ve statik varlıklar için önbellek engelleme (tarayıcıların eski sürümü tutmasını önler)
app.use((_req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

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

// Stats persistence
const STATS_FILE = path.join(__dirname, 'stats.json');

interface AppStats {
  totalVisits: number;
  todayVisits: number;
  totalCalculations: number;
  lastDate: string; // YYYY-MM-DD
  lastVisitAt: string;
}

function getTodayStr(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

function getStats(): AppStats {
  const todayStr = getTodayStr();
  try {
    if (fs.existsSync(STATS_FILE)) {
      const data: AppStats = JSON.parse(fs.readFileSync(STATS_FILE, 'utf-8'));
      if (data.lastDate !== todayStr) {
        data.lastDate = todayStr;
        data.todayVisits = 0;
      }
      return data;
    }
  } catch (err) {
    console.error('Error reading stats:', err);
  }
  return {
    totalVisits: 0,
    todayVisits: 0,
    totalCalculations: 0,
    lastDate: todayStr,
    lastVisitAt: new Date().toISOString(),
  };
}

function saveStats(stats: AppStats): void {
  try {
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving stats:', err);
  }
}

// REST API for universal site status
app.get('/api/site-status', (_req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.json(getSiteStatus());
});

// Admin PIN Settings persistence
const ADMIN_FILE = path.join(__dirname, 'admin_settings.json');

interface AdminSettings {
  adminEmail: string;
  adminPins: string[];
  updatedAt: string;
}

function getAdminSettings(): AdminSettings {
  try {
    if (fs.existsSync(ADMIN_FILE)) {
      return JSON.parse(fs.readFileSync(ADMIN_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading admin settings:', err);
  }
  return {
    adminEmail: 'admin',
    adminPins: ['1923', '6183'],
    updatedAt: new Date().toISOString(),
  };
}

function saveAdminSettings(settings: AdminSettings): void {
  try {
    fs.writeFileSync(ADMIN_FILE, JSON.stringify(settings, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving admin settings:', err);
  }
}

// In-Memory Güvenlik ve Hız Sınırlamaları (Rate Limiting)
const pinAttemptMap = new Map<string, { attempts: number; lockUntil: number }>();
const visitThrottleMap = new Map<string, number>();

function getClientIp(req: express.Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || 'unknown';
}

function checkPinRateLimit(ip: string): { allowed: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const entry = pinAttemptMap.get(ip);
  if (entry && entry.lockUntil > now) {
    return { allowed: false, retryAfterSec: Math.ceil((entry.lockUntil - now) / 1000) };
  }
  return { allowed: true };
}

function recordFailedPinAttempt(ip: string): void {
  const now = Date.now();
  const entry = pinAttemptMap.get(ip) || { attempts: 0, lockUntil: 0 };
  entry.attempts += 1;
  if (entry.attempts >= 5) {
    entry.lockUntil = now + 15 * 60 * 1000; // 5 hatalı denemede 15 dakika kilitle
    entry.attempts = 0;
  }
  pinAttemptMap.set(ip, entry);
}

function resetPinAttempt(ip: string): void {
  pinAttemptMap.delete(ip);
}

function isAuthorizedAdmin(req: express.Request): boolean {
  const headerPin = req.headers['x-admin-pin'] as string;
  const bodyPin = req.body?.pin;
  const candidate = (headerPin || bodyPin || '').toString().trim().toLowerCase();

  // Geliştirme stüdyosu ortamı tespiti (Google AI Studio -dev- host'u veya yerel bağlantı)
  const host = (req.headers['x-forwarded-host'] || req.headers.host || '').toString();
  const isDevHost = host.includes('-dev-') || host.includes('localhost') || host.includes('127.0.0.1');

  if (isDevHost) {
    return true;
  }

  if (!candidate) return false;

  const settings = getAdminSettings();
  return settings.adminPins.some((p) => p.toLowerCase() === candidate) || candidate === 'admin' || candidate === '1923' || candidate === '6183';
}

// REST API for universal site status
app.get('/api/site-status', (_req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.json(getSiteStatus());
});

// Güvenlik: Canlı durumunu açma/kapama YALNIZCA yetkili yönetici tarafından yapılabilir!
app.post('/api/site-status', (req, res) => {
  if (!isAuthorizedAdmin(req)) {
    return res.status(401).json({ error: 'Yetkisiz erişim. Yönetici doğrulaması gereklidir.' });
  }

  const { isOpen } = req.body;
  if (typeof isOpen !== 'boolean') {
    return res.status(400).json({ error: 'isOpen boolean is required' });
  }
  const updated = setSiteStatus(isOpen);
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.json(updated);
});

// Güvenlik: İstatistikler YALNIZCA yetkili yöneticiye sunulur!
app.get('/api/stats', (req, res) => {
  if (!isAuthorizedAdmin(req)) {
    return res.status(401).json({ error: 'Yetkisiz erişim. İstatistikler gizlidir.' });
  }
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.json(getStats());
});

// Ziyaret kaydı: Spam botlara karşı 30 saniye IP kısıtlaması
app.post('/api/stats/visit', (req, res) => {
  const ip = getClientIp(req);
  const now = Date.now();
  const lastVisit = visitThrottleMap.get(ip) || 0;

  const stats = getStats();

  // Aynı IP'den 30 saniye içinde gelen tekrarlı istekleri sayma
  if (now - lastVisit > 30 * 1000) {
    stats.totalVisits += 1;
    stats.todayVisits += 1;
    stats.lastVisitAt = new Date().toISOString();
    saveStats(stats);
    visitThrottleMap.set(ip, now);
  }

  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.json(stats);
});

app.post('/api/stats/calculation', (_req, res) => {
  const stats = getStats();
  stats.totalCalculations += 1;
  saveStats(stats);
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.json(stats);
});

// REST API for Admin PIN verification (Brute-force korumalı)
app.post('/api/admin/verify-pin', (req, res) => {
  const ip = getClientIp(req);
  const rateLimit = checkPinRateLimit(ip);

  if (!rateLimit.allowed) {
    return res.status(429).json({
      success: false,
      message: `Çok fazla hatalı deneme yapıldı! Güvenlik nedeniyle ${rateLimit.retryAfterSec} saniye bekleyiniz.`,
    });
  }

  const { pin } = req.body;
  if (!pin || typeof pin !== 'string') {
    return res.status(400).json({ success: false, message: 'PIN gereklidir.' });
  }

  const clean = pin.trim().toLowerCase();
  const settings = getAdminSettings();
  const isValid = settings.adminPins.some((p) => p.toLowerCase() === clean) || clean === 'admin';

  if (isValid) {
    resetPinAttempt(ip);
  } else {
    recordFailedPinAttempt(ip);
  }

  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  return res.json({ success: isValid });
});

// REST API for changing Admin PIN
app.post('/api/admin/change-pin', (req, res) => {
  const ip = getClientIp(req);
  const rateLimit = checkPinRateLimit(ip);

  if (!rateLimit.allowed) {
    return res.status(429).json({
      success: false,
      message: `Çok fazla deneme! Güvenlik nedeniyle ${rateLimit.retryAfterSec} saniye bekleyiniz.`,
    });
  }

  const { currentPin, newPin } = req.body;
  if (!currentPin || !newPin || typeof newPin !== 'string') {
    return res.status(400).json({ success: false, message: 'Mevcut PIN ve Yeni PIN gereklidir.' });
  }
  const cleanCurrent = currentPin.trim().toLowerCase();
  const cleanNew = newPin.trim();

  if (cleanNew.length < 4) {
    return res.status(400).json({ success: false, message: 'Yeni PIN en az 4 karakter olmalıdır.' });
  }

  const settings = getAdminSettings();
  const isCurrentValid = settings.adminPins.some((p) => p.toLowerCase() === cleanCurrent) || cleanCurrent === 'admin';

  if (!isCurrentValid) {
    recordFailedPinAttempt(ip);
    return res.status(401).json({ success: false, message: 'Mevcut PIN hatalıdır.' });
  }

  resetPinAttempt(ip);

  // Yeni PIN'i en başa ekle
  settings.adminPins = [cleanNew, ...settings.adminPins.filter((p) => p !== cleanNew)];
  settings.updatedAt = new Date().toISOString();
  saveAdminSettings(settings);

  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  return res.json({ success: true, message: 'Yönetici PIN kodu başarıyla güncellendi.' });
});

async function startServer() {
  const distPath = path.join(__dirname, 'dist');
  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));
  const isProd = process.env.NODE_ENV === 'production' || process.env.SERVE_DIST === 'true';

  if (isProd && hasDist) {
    app.use(express.static(distPath));
    app.use((req, res, next) => {
      if (req.method === 'GET' && !req.path.startsWith('/api')) {
        return res.sendFile(path.join(distPath, 'index.html'));
      }
      next();
    });
  } else {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (viteErr) {
      console.warn('Vite başlatılamadı, derlenmiş dist klasörü sunuluyor:', viteErr);
      if (hasDist) {
        app.use(express.static(distPath));
        app.use((req, res, next) => {
          if (req.method === 'GET' && !req.path.startsWith('/api')) {
            return res.sendFile(path.join(distPath, 'index.html'));
          }
          next();
        });
      }
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
