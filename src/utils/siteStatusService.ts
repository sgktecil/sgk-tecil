import { safeStorage } from './storage';
import { getActiveAdminPin } from './adminAuthService';

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
    console.warn('Sunucu site durumu sorgulanamadı:', err);
  }

  // Sunucuya ulaşılamazsa varsayılan açık
  return true;
}

/**
 * Sitenin canlılık durumunu hem sunucuya hem de yerel hafızaya yazar.
 * Sunucuya yazılan durum tüm ziyaretçilere anında yansır.
 */
export async function updateSiteStatus(isOpen: boolean): Promise<boolean> {
  safeStorage.setItem('sgk_site_canli_durumu', isOpen ? 'acik' : 'kapali');

  const adminPin = getActiveAdminPin() || '1923';

  try {
    const res = await fetch('/api/site-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        ...(adminPin ? { 'x-admin-pin': adminPin } : {}),
      },
      body: JSON.stringify({ isOpen, pin: adminPin }),
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
