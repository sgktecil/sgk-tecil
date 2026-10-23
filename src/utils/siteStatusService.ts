import { safeStorage } from './storage';

export interface SiteStatusResponse {
  isOpen: boolean;
  updatedAt: string;
}

/**
 * Sunucudan sitenin canlılık (açık/kapalı) durumunu sorgular.
 * Tüm cihazlar ve ziyaretçiler için geçerli ortak durumu getirir.
 */
export async function fetchSiteStatus(): Promise<boolean> {
  try {
    const res = await fetch('/api/site-status?t=' + Date.now(), {
      headers: { 'Cache-Control': 'no-cache' },
      cache: 'no-store',
    });
    if (res.ok) {
      const data: SiteStatusResponse = await res.json();
      if (typeof data.isOpen === 'boolean') {
        safeStorage.setItem('sgk_site_canli_durumu', data.isOpen ? 'acik' : 'kapali');
        return data.isOpen;
      }
    }
  } catch (err) {
    console.warn('Sunucu site durumu sorgulanamadı, yerel durum kullanılıyor:', err);
  }

  // Yedek yerel kontrol
  const local = safeStorage.getItem('sgk_site_canli_durumu', 'kapali');
  return local === 'acik';
}

/**
 * Sitenin canlılık durumunu hem sunucuya hem de yerel hafızaya yazar.
 * Sunucuya yazılan durum tüm ziyaretçilere anında yansır.
 */
export async function updateSiteStatus(isOpen: boolean): Promise<boolean> {
  safeStorage.setItem('sgk_site_canli_durumu', isOpen ? 'acik' : 'kapali');

  try {
    const res = await fetch('/api/site-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify({ isOpen }),
    });

    if (res.ok) {
      const data: SiteStatusResponse = await res.json();
      return typeof data.isOpen === 'boolean' ? data.isOpen : isOpen;
    }
  } catch (err) {
    console.error('Sunucu site durumu güncellenemedi:', err);
  }

  return isOpen;
}
