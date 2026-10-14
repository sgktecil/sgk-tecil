import { HesaplamaSonucu, TaksitItem } from '../types';

export function formatTL(val: number): string {
  if (isNaN(val) || val === null || val === undefined) return '0,00';
  return val.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function parseTL(val: string): number {
  if (!val) return 0;
  const clean = val.replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, '');
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
}

export function getTodayDateISO(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayDateTR(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${day}.${month}.${year}`;
}

export function formatDateTR(dateStr: string): string {
  if (!dateStr) return '';
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateStr)) return dateStr;

  const parts = dateStr.split('-');
  if (parts.length === 3 && parts[0].length === 4) {
    const [y, m, d] = parts;
    return `${d.padStart(2, '0')}.${m.padStart(2, '0')}.${y}`;
  }

  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

export function addMonthsToDate(dateStr: string, months: number): string {
  const parts = dateStr.split('-');
  if (parts.length === 3 && parts[0].length === 4) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    const dt = new Date(y, m + months, d);
    const resY = dt.getFullYear();
    const resM = String(dt.getMonth() + 1).padStart(2, '0');
    const resD = String(dt.getDate()).padStart(2, '0');
    return `${resY}-${resM}-${resD}`;
  }
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  d.setMonth(d.getMonth() + months);
  const resY = d.getFullYear();
  const resM = String(d.getMonth() + 1).padStart(2, '0');
  const resD = String(d.getDate()).padStart(2, '0');
  return `${resY}-${resM}-${resD}`;
}

export function calculate6183(
  borc: number,
  taksitSayisi: number,
  pesinat: number,
  baslangicTarihi: string,
  faizOraniYillik: number = 39
): HesaplamaSonucu {
  const kalanBorc = Math.max(0, borc - pesinat);
  const n = taksitSayisi;

  if (n <= 0 || kalanBorc <= 0) {
    return {
      anaPara: borc,
      pesinat,
      kalanBorc,
      taksitSayisi: n,
      faizOrani: faizOraniYillik,
      toplamFaiz: 0,
      toplamOdeme: borc,
      aylikSabitTaksit: 0,
      taksitler: [],
    };
  }

  // 6183 sayılı Kanun 48. madde formülü:
  // Toplam Tecil Faizi = Kalan Borç * (Faiz Oranı / 100) * ((Taksit Sayısı + 1) / 24)
  const toplamFaiz = kalanBorc * (faizOraniYillik / 100) * ((n + 1) / 24);
  const toplamGeriOdeme = kalanBorc + toplamFaiz;
  const aylikSabitTaksit = toplamGeriOdeme / n;

  const taksitler: TaksitItem[] = [];
  let mevcutKalanAnaPara = kalanBorc;
  const aylikAnaParaPayi = kalanBorc / n;
  const aylikFaizPayi = toplamFaiz / n;

  for (let i = 1; i <= n; i++) {
    const vade = addMonthsToDate(baslangicTarihi, i);
    mevcutKalanAnaPara = Math.max(0, mevcutKalanAnaPara - aylikAnaParaPayi);

    taksitler.push({
      no: i,
      vadeTarihi: formatDateTR(vade),
      anaPara: aylikAnaParaPayi,
      kalanAnaPara: mevcutKalanAnaPara,
      faiz: aylikFaizPayi,
      toplamTaksit: aylikSabitTaksit,
    });
  }

  return {
    anaPara: borc,
    pesinat,
    kalanBorc,
    taksitSayisi: n,
    faizOrani: faizOraniYillik,
    toplamFaiz,
    toplamOdeme: pesinat + toplamGeriOdeme,
    aylikSabitTaksit,
    taksitler,
  };
}

export function getYetkiBilgisi(borc: number): { makam: string; aciklama: string } {
  // SGK 2024/12 ve 2026/15 Genelgeleri yetki limitleri
  if (borc <= 3500000) {
    return {
      makam: 'Sosyal Güvenlik Merkezi Müdürü',
      aciklama: '3.500.000 TL ve altındaki borçlarda SGM Müdürü yetkilidir.',
    };
  } else if (borc <= 10000000) {
    return {
      makam: 'Sosyal Güvenlik İl Müdürü',
      aciklama: '3.500.000 TL - 10.000.000 TL arasındaki borçlarda İl Müdürü yetkilidir.',
    };
  } else if (borc <= 35000000) {
    return {
      makam: 'Sigorta Primleri Genel Müdürü',
      aciklama: '10.000.000 TL - 35.000.000 TL arasındaki borçlarda Genel Müdür yetkilidir.',
    };
  } else {
    return {
      makam: 'SGK Yönetim Kurulu / Başkanlık',
      aciklama: '35.000.000 TL üzerindeki borçlarda Başkanlık ve Yönetim Kurulu yetkilidir.',
    };
  }
}
