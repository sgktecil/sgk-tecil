import { HesaplamaSonucu, TaksitItem } from '../types';

export function formatTL(val?: number | null): string {
  if (val === undefined || val === null || isNaN(val)) return '0,00';
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

export function getEndOfMonth(baseDateStr: string, monthOffset: number): string {
  const parts = baseDateStr.split('-');
  if (parts.length < 3) return baseDateStr;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const dt = new Date(y, m + monthOffset, 0);
  const resY = dt.getFullYear();
  const resM = String(dt.getMonth() + 1).padStart(2, '0');
  const resD = String(dt.getDate()).padStart(2, '0');
  return `${resY}-${resM}-${resD}`;
}

export function getDaysBetween(startDateStr: string, endDateStr: string): number {
  const [sy, sm, sd] = startDateStr.split('-').map(Number);
  const [ey, em, ed] = endDateStr.split('-').map(Number);
  const s = Date.UTC(sy, sm - 1, sd);
  const e = Date.UTC(ey, em - 1, ed);
  return Math.max(0, Math.round((e - s) / (1000 * 60 * 60 * 24)));
}

export function calculate6183(
  borc: number,
  taksitSayisi: number,
  pesinat: number,
  baslangicTarihi: string,
  faizOraniYillik: number = 39,
  planTipi: 'kanuni' | 'esit' = 'kanuni',
  _unused?: boolean
): HesaplamaSonucu {
  const kalanBorc = Math.max(0, borc - pesinat);
  const n = taksitSayisi;

  if (n <= 0 || (borc <= 0 && pesinat <= 0)) {
    return {
      anaPara: borc,
      pesinat,
      kalanBorc,
      taksitSayisi: n,
      faizOrani: faizOraniYillik,
      toplamFaiz: 0,
      toplamOdeme: borc,
      aylikSabitTaksit: 0,
      ilkTaksitTutari: 0,
      sonTaksitTutari: 0,
      planTipi,
      taksitler: [],
    };
  }

  const taksitler: TaksitItem[] = [];
  let toplamFaiz = 0;

  if (pesinat > 0) {
    // 1. Satır: Peşinat (Ödeme Tarihi: Başlangıç/Müracaat Tarihi, Faizsiz)
    taksitler.push({
      no: 'Peşinat',
      vadeTarihi: formatDateTR(baslangicTarihi),
      gunSayisi: 0,
      ayNo: 0,
      anaPara: pesinat,
      kalanAnaPara: kalanBorc,
      faiz: 0,
      toplamTaksit: pesinat,
      isPesinat: true,
    });

    const vadeliTaksitSayisi = n > 1 ? n - 1 : 0;
    if (vadeliTaksitSayisi > 0 && kalanBorc > 0) {
      const tabanAnaPara = Math.floor((kalanBorc / vadeliTaksitSayisi) * 100) / 100;
      const kurusFarki = Math.round((kalanBorc - tabanAnaPara * vadeliTaksitSayisi) * 100) / 100;
      let mevcutKalan = kalanBorc;

      for (let i = 1; i <= vadeliTaksitSayisi; i++) {
        const taksitNo = i + 1; // 2, 3, 4, ... n
        const vadeISO = getEndOfMonth(baslangicTarihi, i); // Takip eden ayların son günü
        const gunSayisi = getDaysBetween(baslangicTarihi, vadeISO);
        const anaParaPayi = i === vadeliTaksitSayisi ? Math.round((tabanAnaPara + kurusFarki) * 100) / 100 : tabanAnaPara;

        let taksitFaizi = 0;
        if (planTipi === 'kanuni') {
          // 6183 m.48 Resmî SGK Gün Formülü: (Ana Para * Faiz Oranı * Gün Sayısı) / 36.000
          taksitFaizi = Math.round((anaParaPayi * faizOraniYillik * gunSayisi / 36000) * 100) / 100;
        } else {
          // Eşit taksitli model: Ortalama taksit
          const formulToplamFaiz = kalanBorc * (faizOraniYillik / 100) * ((vadeliTaksitSayisi + 1) / 24);
          taksitFaizi = Math.round((formulToplamFaiz / vadeliTaksitSayisi) * 100) / 100;
        }

        toplamFaiz += taksitFaizi;
        mevcutKalan = Math.max(0, Math.round((mevcutKalan - anaParaPayi) * 100) / 100);
        const toplamTaksit = Math.round((anaParaPayi + taksitFaizi) * 100) / 100;

        taksitler.push({
          no: taksitNo,
          vadeTarihi: formatDateTR(vadeISO),
          gunSayisi,
          ayNo: i,
          anaPara: anaParaPayi,
          kalanAnaPara: mevcutKalan,
          faiz: taksitFaizi,
          toplamTaksit,
          isPesinat: false,
        });
      }
    }
  } else {
    // Peşinatsız Tecil: 1'den n'e kadar vadeli taksitler
    const tabanAnaPara = Math.floor((borc / n) * 100) / 100;
    const kurusFarki = Math.round((borc - tabanAnaPara * n) * 100) / 100;
    let mevcutKalan = borc;

    for (let i = 1; i <= n; i++) {
      const taksitNo = i;
      const vadeISO = getEndOfMonth(baslangicTarihi, i);
      const gunSayisi = getDaysBetween(baslangicTarihi, vadeISO);
      const anaParaPayi = i === n ? Math.round((tabanAnaPara + kurusFarki) * 100) / 100 : tabanAnaPara;

      let taksitFaizi = 0;
      if (planTipi === 'kanuni') {
        taksitFaizi = Math.round((anaParaPayi * faizOraniYillik * gunSayisi / 36000) * 100) / 100;
      } else {
        const formulToplamFaiz = borc * (faizOraniYillik / 100) * ((n + 1) / 24);
        taksitFaizi = Math.round((formulToplamFaiz / n) * 100) / 100;
      }

      toplamFaiz += taksitFaizi;
      mevcutKalan = Math.max(0, Math.round((mevcutKalan - anaParaPayi) * 100) / 100);
      const toplamTaksit = Math.round((anaParaPayi + taksitFaizi) * 100) / 100;

      taksitler.push({
        no: taksitNo,
        vadeTarihi: formatDateTR(vadeISO),
        gunSayisi,
        ayNo: i,
        anaPara: anaParaPayi,
        kalanAnaPara: mevcutKalan,
        faiz: taksitFaizi,
        toplamTaksit,
        isPesinat: false,
      });
    }
  }

  const nihaiToplamFaiz = Math.round(toplamFaiz * 100) / 100;
  const vadeliTaksitler = taksitler.filter((t) => !t.isPesinat);
  const ilkTaksitTutari = vadeliTaksitler[0]?.toplamTaksit || pesinat;
  const sonTaksitTutari = vadeliTaksitler[vadeliTaksitler.length - 1]?.toplamTaksit || pesinat;
  const aylikSabitTaksit = vadeliTaksitler.length > 0
    ? Math.round(((kalanBorc + nihaiToplamFaiz) / vadeliTaksitSayisiOrN(n, pesinat)) * 100) / 100
    : 0;

  return {
    anaPara: borc,
    pesinat,
    kalanBorc,
    taksitSayisi: n,
    faizOrani: faizOraniYillik,
    toplamFaiz: nihaiToplamFaiz,
    toplamOdeme: borc + nihaiToplamFaiz,
    aylikSabitTaksit,
    ilkTaksitTutari,
    sonTaksitTutari,
    planTipi,
    taksitler,
  };
}

function vadeliTaksitSayisiOrN(n: number, pesinat: number): number {
  if (pesinat > 0) {
    return Math.max(1, n - 1);
  }
  return Math.max(1, n);
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
