/**
 * SGK Tecil ve Taksitlendirme - Ziyaretçi ve Google Analytics (GA4) Servisi
 * Hem resmî Google Analytics 4 (GA4) entegrasyonunu hem de yerel/sunucu tabanlı
 * canlı ziyaretçi sayacını yönetir.
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export interface VisitorStats {
  totalVisits: number;
  todayVisits: number;
  totalCalculations: number;
  lastVisitAt: string;
}

import { getActiveAdminPin } from './adminAuthService';

const GA_STORAGE_KEY = 'sgk_ga_measurement_id';
const LOCAL_STATS_KEY = 'sgk_visitor_stats_cache';
export const DEFAULT_GA_ID = 'G-2E98K2XJTQ';

let isGaInitialized = false;

/**
 * Kayıtlı veya ortam değişkenindeki GA4 Ölçüm Kimliğini (Measurement ID) döner
 */
export function getGaMeasurementId(): string {
  try {
    const saved = localStorage.getItem(GA_STORAGE_KEY);
    if (saved && saved.trim().startsWith('G-')) {
      return saved.trim();
    }
  } catch {
    // ignore
  }

  const envId = (import.meta as any).env?.VITE_GA_MEASUREMENT_ID;
  if (typeof envId === 'string' && envId.trim().startsWith('G-')) {
    return envId.trim();
  }

  return DEFAULT_GA_ID;
}

/**
 * Kullanıcının girdiği GA4 Ölçüm Kimliğini kaydeder ve GA4'ü başlatır
 */
export function setGaMeasurementId(id: string): boolean {
  const cleaned = id.trim().toUpperCase();
  if (cleaned && !cleaned.startsWith('G-')) {
    return false;
  }

  try {
    if (cleaned) {
      localStorage.setItem(GA_STORAGE_KEY, cleaned);
    } else {
      localStorage.removeItem(GA_STORAGE_KEY);
    }
  } catch {
    // ignore
  }

  if (cleaned) {
    loadGoogleAnalytics(cleaned);
  }
  return true;
}

/**
 * Google Analytics (gtag.js) scriptini sayfaya dinamik olarak ekler
 */
export function loadGoogleAnalytics(measurementId: string): void {
  if (typeof window === 'undefined' || !measurementId.startsWith('G-')) return;

  // Mevcut gtag scripti var mı?
  const existingScript = document.getElementById('sgk-ga4-script');
  if (existingScript) {
    existingScript.remove();
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer?.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    page_title: document.title,
    page_location: window.location.href,
    anonymize_ip: true,
  });

  const script = document.createElement('script');
  script.id = 'sgk-ga4-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);

  isGaInitialized = true;
}

/**
 * Uygulama açılışında analitiği başlatır
 */
export function initAnalytics(): void {
  const measurementId = getGaMeasurementId();
  if (measurementId) {
    loadGoogleAnalytics(measurementId);
  }

  // Ziyareti sunucuya ve yerel sayaca bildir
  recordVisit();
}

/**
 * Özel bir kullanıcı hareketini (event) GA4'e gönderir
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try {
      window.gtag('event', eventName, params);
    } catch (e) {
      console.warn('GA4 event gönderilemedi:', e);
    }
  }

  // Hesaplama eventi ise sunucu istatistiğine de yansıt
  if (eventName.includes('hesaplama')) {
    recordCalculation();
  }
}

/**
 * Sayfa görüntüleme takibi
 */
export function trackPageView(title?: string): void {
  const measurementId = getGaMeasurementId();
  if (!measurementId || typeof window === 'undefined' || typeof window.gtag !== 'function') return;

  window.gtag('event', 'page_view', {
    page_title: title || document.title,
    page_location: window.location.href,
  });
}

/**
 * Test sinyali gönderir (kullanıcının GA4 Canlı panosunda hemen test edebilmesi için)
 */
export function sendTestEvent(): boolean {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'test_baglanti', {
      test_zamani: new Date().toLocaleTimeString('tr-TR'),
      aciklama: 'SGK Tecil Sistemi Test Sinyali',
    });
    return true;
  }
  return false;
}

/**
 * Ziyareti sunucuya kaydeder
 */
export async function recordVisit(): Promise<VisitorStats | null> {
  try {
    const res = await fetch('/api/stats/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      const data: VisitorStats = await res.json();
      localStorage.setItem(LOCAL_STATS_KEY, JSON.stringify(data));
      return data;
    }
  } catch {
    // Çevrimdışı / statik moddaysa yerel sayaç artır
    return updateLocalFallbackStats('visit');
  }
  return null;
}

/**
 * Yapılan hesaplamayı sunucu istatistiğine işler
 */
export async function recordCalculation(): Promise<void> {
  try {
    await fetch('/api/stats/calculation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    updateLocalFallbackStats('calculation');
  }
}

/**
 * Güncel ziyaret istatistiklerini çeker
 */
export async function fetchVisitorStats(): Promise<VisitorStats> {
  const adminPin = getActiveAdminPin();
  try {
    const res = await fetch('/api/stats?t=' + Date.now(), {
      headers: {
        'Cache-Control': 'no-cache',
        ...(adminPin ? { 'x-admin-pin': adminPin } : {}),
      },
      cache: 'no-store',
    });
    if (res.ok) {
      const data: VisitorStats = await res.json();
      localStorage.setItem(LOCAL_STATS_KEY, JSON.stringify(data));
      return data;
    }
  } catch {
    // Çevrimdışı durumunda önbellekten al
  }

  try {
    const cached = localStorage.getItem(LOCAL_STATS_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {
    // ignore
  }

  return {
    totalVisits: 1,
    todayVisits: 1,
    totalCalculations: 0,
    lastVisitAt: new Date().toISOString(),
  };
}

function updateLocalFallbackStats(type: 'visit' | 'calculation'): VisitorStats {
  let stats: VisitorStats = {
    totalVisits: 0,
    todayVisits: 0,
    totalCalculations: 0,
    lastVisitAt: new Date().toISOString(),
  };

  try {
    const cached = localStorage.getItem(LOCAL_STATS_KEY);
    if (cached) {
      stats = JSON.parse(cached);
    }
  } catch {
    // ignore
  }

  if (type === 'visit') {
    stats.totalVisits = (stats.totalVisits || 0) + 1;
    stats.todayVisits = (stats.todayVisits || 0) + 1;
    stats.lastVisitAt = new Date().toISOString();
  } else if (type === 'calculation') {
    stats.totalCalculations = (stats.totalCalculations || 0) + 1;
  }

  try {
    localStorage.setItem(LOCAL_STATS_KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }

  return stats;
}
