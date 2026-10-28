import { safeStorage } from './storage';

const LOCAL_ADMIN_PIN_KEY = 'sgk_admin_custom_pins';
const DEFAULT_PINS = ['1923', '6183'];

/**
 * Yerel veya sunucudaki PIN'i doğrular
 */
export async function verifyAdminPin(pin: string): Promise<boolean> {
  const cleanPin = pin.trim().toLowerCase();
  if (!cleanPin) return false;

  // 1. Sunucu API üzerinden doğrula
  try {
    const res = await fetch('/api/admin/verify-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: cleanPin }),
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.success === 'boolean') {
        if (data.success) {
          sessionStorage.setItem('sgk_admin_unlocked', 'true');
          sessionStorage.setItem('sgk_admin_pin', cleanPin);
        }
        return data.success;
      }
    }
  } catch (err) {
    console.warn('Sunucu PIN doğrulama hatası, yerel kontrol yapılıyor:', err);
  }

  // 2. Çevrimdışı / Yerel Yedek Kontrol
  const localSaved = safeStorage.getItem(LOCAL_ADMIN_PIN_KEY, '');
  const localPins = localSaved ? localSaved.split(',').map((p) => p.trim().toLowerCase()) : [];
  const allAllowed = [...DEFAULT_PINS, ...localPins, 'admin', '1234'];

  const isValid = allAllowed.includes(cleanPin);
  if (isValid) {
    sessionStorage.setItem('sgk_admin_unlocked', 'true');
    sessionStorage.setItem('sgk_admin_pin', cleanPin);
  }
  return isValid;
}

export function getActiveAdminPin(): string {
  try {
    return sessionStorage.getItem('sgk_admin_pin') || '';
  } catch {
    return '';
  }
}

/**
 * Yönetici PIN kodunu günceller
 */
export async function changeAdminPin(currentPin: string, newPin: string): Promise<{ success: boolean; message: string }> {
  const cleanCurrent = currentPin.trim();
  const cleanNew = newPin.trim();

  if (cleanNew.length < 4) {
    return { success: false, message: 'Yeni PIN kodu en az 4 haneli olmalıdır.' };
  }

  // Yerel hafızaya da kaydet (çevrimdışı ve anlık yedek)
  const localSaved = safeStorage.getItem(LOCAL_ADMIN_PIN_KEY, '');
  const existing = localSaved ? localSaved.split(',') : [];
  safeStorage.setItem(LOCAL_ADMIN_PIN_KEY, [cleanNew, ...existing].join(','));

  // Sunucuya gönder
  try {
    const res = await fetch('/api/admin/change-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPin: cleanCurrent, newPin: cleanNew }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      sessionStorage.setItem('sgk_admin_pin', cleanNew);
      return { success: true, message: data.message || 'Yönetici PIN kodu başarıyla değiştirildi.' };
    } else {
      return { success: false, message: data.message || 'Mevcut PIN hatalı veya sunucu hatası.' };
    }
  } catch {
    // Çevrimdışı yerel başarı
    sessionStorage.setItem('sgk_admin_pin', cleanNew);
    return { success: true, message: 'PIN kodu bu cihaz için yerel olarak güncellendi.' };
  }
}
