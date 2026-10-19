import React, { useState, useEffect, useRef } from 'react';
import {
  Building2,
  FileText,
  Printer,
  Trash2,
  AlertCircle,
  ChevronDown,
  ArrowDownToLine,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { formatTL } from '../utils/calculator';
import { extractSgimAndSgm, cleanSgmName, formatSgkSicilNo, extractSicilSiraNo } from '../utils/sgkFormParser';

interface AyDetay {
  donem: string;
  isIcra: boolean;
  isCariDonem: boolean;
  primAsil: number;
  primGZ: number;
  ipcAsil: number;
  ipcGZ: number;
  ekpAsil: number;
  ekpGZ: number;
  oivAsil: number;
  oivGZ: number;
  issizlikAsil: number;
  issizlikGZ: number;
  damgaAsil: number;
  damgaGZ: number;
  dPrimAsil: number;
  dPrimGZ: number;
  dEkpAsil: number;
  dEkpGZ: number;
  toplamAsil: number;
  toplamGZ: number;
  genelToplam: number;
}

interface IsyeriData {
  sicilNo: string;
  unvan: string;
  adres: string;
  sgm: string;
  kapsamAlinis: string;
  kapsamCikis: string;
  primOran: string;
  eskiPrimOran: string;
  aylar: AyDetay[];
  totals: Record<string, number>;
}

const DEFAULT_RAW_SAMPLE = `Sicil No	:	
2 4324 01 01 1055706 052 20-30 000 001	sicilno kopyala
Ünvan	:	ÜMİT ÖZTÜRK
Adresi	:	YENİ MAH.328.SOK. Dış kapı no:8 İç kapı no:B - ORDU ALTINORDU
SGM kod-Ad	:	01-ORDU ALTINORDU S.G.M.
Kanun Kapsamına Alınış	:	14.07.2015
Kanun Kapsamından Çıkış	:	31.07.2021	İz İşlem Tarih	:	
Prim Oran	:	2,25	Eski Prim Oran	:	3,00

2021/07	1.397,72 TL	3.573,67	0,00 TL	0,00	0,00 TL	0,00	0,00 TL	0,00	157,41 TL	402,46	0,00 TL	0,00	0,00 TL	0,00	0,00 TL	0,00	1.555,13	3.976,13	5.531,26
2021/06	1.234,25 TL	3.219,80	0,00 TL	0,00	0,00 TL	0,00	0,00 TL	0,00	107,33 TL	279,99	0,00 TL	0,00	0,00 TL	0,00	0,00 TL	0,00	1.341,58	3.499,79	4.841,37
2021/05	1.686,81 TL	4.488,06	0,00 TL	0,00	0,00 TL	0,00	0,00 TL	0,00	146,69 TL	390,29	0,00 TL	0,00	0,00 TL	0,00	0,00 TL	0,00	1.833,50	4.878,35	6.711,85
2021/04	2.468,48 TL	6.694,34	0,00 TL	0,00	0,00 TL	0,00	0,00 TL	0,00	214,65 TL	582,12	0,00 TL	0,00	0,00 TL	0,00	0,00 TL	0,00	2.683,13	7.276,46	9.959,59
2021/03	2.468,48 TL	6.805,21	0,00 TL	0,00	0,00 TL	0,00	0,00 TL	0,00	214,65 TL	591,76	0,00 TL	0,00	0,00 TL	0,00	0,00 TL	0,00	2.683,13	7.396,97	10.080,10
2021/02	1.892,51 TL	5.303,38	0,00 TL	0,00	0,00 TL	0,00	0,00 TL	0,00	164,57 TL	461,17	0,00 TL	0,00	0,00 TL	0,00	0,00 TL	0,00	2.057,08	5.764,55	7.821,63
2021/01	1.234,25 TL	3.515,52	0,00 TL	0,00	0,00 TL	0,00	0,00 TL	0,00	107,33 TL	305,71	0,00 TL	0,00	0,00 TL	0,00	0,00 TL	0,00	1.341,58	3.821,23	5.162,81`;

// Başlangıç örnek verisi
const INITIAL_SAMPLE_ICRA = new Set(['2021/07', '2021/06', '2021/05', '2021/04', '2021/03', '2021/7', '2021/6', '2021/5', '2021/4', '2021/3']);
const INITIAL_SAMPLE_ISVEREN = new Set(['2021/02', '2021/01', '2021/2', '2021/1']);

// Dönem normalleştirici: Her türlü formatı standart "YYYY/MM" yapar
export const normalizeDonem = (raw: string): string => {
  if (!raw) return '';
  const clean = raw.trim().replace(/\s+/g, '');
  const m1 = clean.match(/\b(19\d{2}|20\d{2})[\/\-.](0?[1-9]|1[0-2])\b/);
  if (m1) {
    return `${m1[1]}/${m1[2].padStart(2, '0')}`;
  }
  const m2 = clean.match(/\b(0?[1-9]|1[0-2])[\/\-.](19\d{2}|20\d{2})\b/);
  if (m2) {
    return `${m2[2]}/${m2[1].padStart(2, '0')}`;
  }
  const m3 = clean.match(/\b(19\d{2}|20\d{2})(0[1-9]|1[0-2])\b/);
  if (m3) {
    return `${m3[1]}/${m3[2]}`;
  }
  return clean;
};

// SGK Mevzuatı ve Kullanıcı Kuralı: 2026/7 ve 2026/8 dönemleri altı çizili olmayıp kesinlikle İŞVERENDE'dir!
export const isSonIsverenDonemi = (d: string): boolean => {
  if (!d) return false;
  const clean = d.trim().replace(/\s+/g, '');
  return (
    clean === '2026/07' ||
    clean === '2026/7' ||
    clean === '2026-07' ||
    clean === '2026.07' ||
    clean === '2026-7' ||
    clean === '2026/08' ||
    clean === '2026/8' ||
    clean === '2026-08' ||
    clean === '2026.08' ||
    clean === '2026-8' ||
    clean.startsWith('2026/7') ||
    clean.startsWith('2026/07') ||
    clean.startsWith('2026/8') ||
    clean.startsWith('2026/08')
  );
};

// SADECE ve SADECE Prim Aslı (tutar) hücresinde altı çizili link/metin olup olmadığını denetleyen fonksiyon
export const isPrimAsilCellUnderlined = (cell: Element | null): boolean => {
  if (!cell) return false;

  // 1. Link etiketi kontrolü: Prim Aslı hücresinde <a> var mı ve içinde sayı var mı?
  // SGK ve e-Devlet'te icradaki borçların Prim Aslı tutarı doğrudan <a> köprüsüdür!
  // Çizili olmayanlarda (2026/7 ve 2026/8 gibi) <a> tag'i KESİNLİKLE YOKTUR.
  const aTag = cell.querySelector('a') || (cell.tagName === 'A' ? cell : null);
  if (aTag) {
    const aText = (aTag.textContent || '').trim();
    if (/\d/.test(aText)) {
      return true;
    }
  }

  // 2. <u> veya <ins> etiketi
  const uTag = cell.querySelector('u, ins') || (cell.tagName === 'U' || cell.tagName === 'INS' ? cell : null);
  if (uTag) {
    const uText = (uTag.textContent || '').trim();
    if (/\d/.test(uText)) {
      return true;
    }
  }

  // 3. Inline style kontrolü (text-decoration: underline)
  const allNodes = [cell, ...Array.from(cell.querySelectorAll('*'))];
  for (const node of allNodes) {
    const styleAttr = (node.getAttribute('style') || '').toLowerCase();
    if (
      (styleAttr.includes('text-decoration: underline') ||
        styleAttr.includes('text-decoration:underline') ||
        styleAttr.includes('text-decoration-line: underline') ||
        styleAttr.includes('text-decoration-line:underline')) &&
      !styleAttr.includes('text-decoration: none') &&
      !styleAttr.includes('text-decoration:none')
    ) {
      const nodeText = (node.textContent || '').trim();
      if (/\d/.test(nodeText)) {
        return true;
      }
    }

    const classAttr = (node.getAttribute('class') || '').toLowerCase();
    if (
      classAttr.includes('underline') ||
      classAttr.includes('alticizili') ||
      classAttr.includes('alti-cizili') ||
      classAttr.includes('cizili')
    ) {
      const classText = (node.textContent || '').trim();
      if (/\d/.test(classText)) {
        return true;
      }
    }
  }

  return false;
};

// HTML veya DOM yapısını en hassas şekilde analiz eden fonksiyon:
// SADECE ve SADECE Prim Aslı (tutar) hücresinin altı çizili olup olmadığına bakar!
export const detectPeriodsFromHtml = (
  html: string
): {
  icraSet: Set<string>;
  isverenSet: Set<string>;
  summary: string;
} => {
  const icraSet = new Set<string>();
  const isverenSet = new Set<string>();

  if (!html || !html.trim()) {
    return { icraSet, isverenSet, summary: '' };
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // 1. YÖNTEM: Tablo satırlarını (tr) incele
    const trElements = Array.from(doc.querySelectorAll('tr'));

    // Başlık satırını bul ve sütun indekslerini tespit et
    let headerPrimIdx = -1;
    let headerPeriodIdx = -1;

    for (const tr of trElements) {
      const ths = Array.from(tr.children);
      if (ths.some((c) => c.tagName === 'TH')) {
        ths.forEach((th, idx) => {
          const txt = (th.textContent || '').toLowerCase().trim();
          if (txt.includes('dönem') || txt.includes('donem') || txt.includes('ay')) {
            headerPeriodIdx = idx;
          }
          if (
            (txt.includes('prim') && (txt.includes('asıl') || txt.includes('asil') || txt.includes('tutar') || txt.includes('borç'))) ||
            txt === 'prim aslı' ||
            txt === 'prim tutarı' ||
            txt === 'prim'
          ) {
            headerPrimIdx = idx;
          }
        });
        if (headerPrimIdx !== -1) break;
      }
    }

    trElements.forEach((tr) => {
      // YALNIZCA doğrudan çocuk hücreler (td veya th)!
      // querySelectorAll KESİNLİKLE KULLANILMAZ (çünkü hücre içi div'ler sütun indeksini bozar)
      const directCells = Array.from(tr.children).filter(
        (c) => c.tagName === 'TD' || c.tagName === 'TH'
      );
      if (directCells.length < 2) return;

      // Dönem hücresini bul
      let matchedPeriod = '';
      let periodColIdx = -1;

      directCells.forEach((cell, idx) => {
        const text = (cell.textContent || '').trim();
        if (text.includes('6183') || /kanun/i.test(text)) return;

        const m1 = text.match(/\b(19\d{2}|20\d{2})[\/\-.](0?[1-9]|1[0-2])\b/);
        if (m1 && !matchedPeriod) {
          matchedPeriod = `${m1[1]}/${m1[2].padStart(2, '0')}`;
          periodColIdx = idx;
          return;
        }
        const m2 = text.match(/\b(0?[1-9]|1[0-2])[\/\-.](19\d{2}|20\d{2})\b/);
        if (m2 && !matchedPeriod) {
          matchedPeriod = `${m2[2]}/${m2[1].padStart(2, '0')}`;
          periodColIdx = idx;
          return;
        }
        const m3 = text.match(/\b(19\d{2}|20\d{2})(0[1-9]|1[0-2])\b/);
        if (m3 && !matchedPeriod) {
          matchedPeriod = `${m3[1]}/${m3[2]}`;
          periodColIdx = idx;
          return;
        }
      });

      if (!matchedPeriod || periodColIdx === -1) return;

      // Prim Aslı hücresini bul:
      let primCell: Element | null = null;
      if (headerPrimIdx > -1 && headerPrimIdx < directCells.length && headerPrimIdx > periodColIdx) {
        primCell = directCells[headerPrimIdx];
      } else {
        // periodColIdx'ten SONRA gelen ve para formatında olan ilk hücre
        for (let j = periodColIdx + 1; j < directCells.length; j++) {
          const txt = (directCells[j].textContent || '').trim();
          if (/\d+[\.,]\d{2}/.test(txt) || /(?:TL|₺)/i.test(txt)) {
            primCell = directCells[j];
            break;
          }
        }
        if (!primCell && periodColIdx + 1 < directCells.length) {
          primCell = directCells[periodColIdx + 1];
        }
      }

      if (!primCell) return;

      // SADECE ve SADECE Prim Aslı (tutar) hücresi altı çizili/link mi?
      const isUnderlined = isPrimAsilCellUnderlined(primCell);

      const normKey = matchedPeriod;
      const unpaddedKey = matchedPeriod.replace(/\/0(\d)$/, '/$1');

      if (isSonIsverenDonemi(normKey) || isSonIsverenDonemi(unpaddedKey)) {
        isverenSet.add(normKey);
        isverenSet.add(unpaddedKey);
        icraSet.delete(normKey);
        icraSet.delete(unpaddedKey);
      } else if (isUnderlined) {
        icraSet.add(normKey);
        icraSet.add(unpaddedKey);
      } else {
        isverenSet.add(normKey);
        isverenSet.add(unpaddedKey);
      }
    });

    // 2. YÖNTEM: Eğer hiçbir tr eşleşmesi bulunamadıysa (serbest metin veya metin blokları)
    if (icraSet.size === 0 && isverenSet.size === 0) {
      const rawHtml = doc.body ? doc.body.innerHTML : html;
      const periodRegex = /\b(19\d{2}|20\d{2})[\/\-.](0?[1-9]|1[0-2])\b/g;
      let match: RegExpExecArray | null;

      while ((match = periodRegex.exec(rawHtml)) !== null) {
        const normKey = `${match[1]}/${match[2].padStart(2, '0')}`;
        const unpaddedKey = `${match[1]}/${match[2]}`;

        if (!icraSet.has(normKey) && !isverenSet.has(normKey)) {
          const afterPeriodIndex = match.index + match[0].length;
          const snippet = rawHtml.substring(afterPeriodIndex, afterPeriodIndex + 500);

          const nextPeriodMatch = snippet.search(/\b(19\d{2}|20\d{2})[\/\-.](0?[1-9]|1[0-2])\b/);
          const rowSnippet = nextPeriodMatch > 0 ? snippet.substring(0, nextPeriodMatch) : snippet;

          // Bu dönemden SONRA gelen ilk tutar sayısı (Prim Aslı) altı çizili mi?
          const hasUnderlineInAmount =
            /<a\s[^>]*>[^<]*\d+[\.,]\d{2}[^<]*<\/a>/i.test(rowSnippet) ||
            /<u\b[^>]*>[^<]*\d+[\.,]\d{2}[^<]*<\/u>/i.test(rowSnippet) ||
            /<ins\b[^>]*>[^<]*\d+[\.,]\d{2}[^<]*<\/ins>/i.test(rowSnippet) ||
            /style="[^"]*text-decoration:\s*underline[^"]*"[^>]*>[^<]*\d+[\.,]\d{2}/i.test(rowSnippet) ||
            /class="[^"]*(?:underline|alticizili|cizili)[^"]*"[^>]*>[^<]*\d+[\.,]\d{2}/i.test(rowSnippet);

          if (isSonIsverenDonemi(normKey) || isSonIsverenDonemi(unpaddedKey)) {
            isverenSet.add(normKey);
            isverenSet.add(unpaddedKey);
            icraSet.delete(normKey);
            icraSet.delete(unpaddedKey);
          } else if (hasUnderlineInAmount) {
            icraSet.add(normKey);
            icraSet.add(unpaddedKey);
          } else {
            isverenSet.add(normKey);
            isverenSet.add(unpaddedKey);
          }
        }
      }
    }

    // Kesin temizlik: 2026/7 ve 2026/8 kesinlikle İŞVERENDE setinde olmalı, icraSet'te olamaz!
    ['2026/07', '2026/7', '2026-07', '2026-7', '2026/08', '2026/8', '2026-08', '2026-8'].forEach((d) => {
      icraSet.delete(d);
      isverenSet.add(d);
    });
  } catch (err) {
    console.error('Hassas HTML inceleme hatası:', err);
  }

  const icraCount = Math.floor(icraSet.size / 2) || icraSet.size;
  const isverenCount = Math.floor(isverenSet.size / 2) || isverenSet.size;
  const summary = `Hassas HTML Taraması: ${icraCount} dönem altı çizili (İCRADA), ${isverenCount} dönem altı çizili olmayan (İŞVERENDE) bulundu.`;

  return { icraSet, isverenSet, summary };
};

interface DonemBorcDokumuProps {
  onTransferToTecil?: (amount: number, unvan?: string, sicilNo?: string, adres?: string, sgm?: string) => void;
}

export const DonemBorcDokumu: React.FC<DonemBorcDokumuProps> = ({ onTransferToTecil }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rawText, setRawText] = useState('');
  const [isyerleri, setIsyerleri] = useState<IsyeriData[]>([]);
  const [analysisNote, setAnalysisNote] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Hassas algılanan durumlar
  const detectedIcraSetRef = useRef<Set<string>>(new Set(INITIAL_SAMPLE_ICRA));
  const detectedIsverenSetRef = useRef<Set<string>>(new Set(INITIAL_SAMPLE_ISVEREN));

  // Ayrıştırma Fonksiyonu: Otomatik ve en hassas inceleme
  const executeParsing = (
    text: string,
    detectedIcra?: Set<string>,
    detectedNotIcra?: Set<string>,
    autoTransfer: boolean = false
  ) => {
    try {
      // 1. "sicilno kopyala" ve döküm sonundaki "6183/48.madde İCRADA" gibi notları temizle
      const sanitizedText = text
        .replace(/sicilno\s*kopyala/gi, '')
        .replace(/6183\s*[\/.]\s*48(?:\s*\.?\s*madde)?(?:\s+İCRADA)?/gi, '');

      // 2. Her işyeri mutlaka yeni bir satır başında başlayan "Sicil No:" veya "--- İŞYERİ ---" ile ayrılır
      const workplaceBlocks = sanitizedText
        .split(/(?=(?:^|\n)\s*(?:(?:İşyeri\s+)?Sicil\s*(?:No|Numarası|Sicili)?\s*[:\t\n]|---+\s*(?:\d+\.\s*)?İŞYERİ|İşyeri\s*(?:Ünvan[ı]?|Adı)?\s*:))/i)
        .map((b) => b.trim())
        .filter((b) => b.length > 10);
      const list: IsyeriData[] = [];

      workplaceBlocks.forEach((block) => {
        const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
        const item: IsyeriData = {
          sicilNo: '',
          unvan: '',
          adres: '',
          sgm: '',
          kapsamAlinis: '',
          kapsamCikis: '',
          primOran: '',
          eskiPrimOran: '',
          aylar: [],
          totals: {
            primAsil: 0,
            primGZ: 0,
            ipcAsil: 0,
            ipcGZ: 0,
            ekpAsil: 0,
            ekpGZ: 0,
            oivAsil: 0,
            oivGZ: 0,
            issizlikAsil: 0,
            issizlikGZ: 0,
            damgaAsil: 0,
            damgaGZ: 0,
            dPrimAsil: 0,
            dPrimGZ: 0,
            dEkpAsil: 0,
            dEkpGZ: 0,
            toplamAsil: 0,
            toplamGZ: 0,
            genelToplam: 0,
          },
        };

        // Bu bloktaki tüm dönem satırlarını topla (kronolojik analiz için)
        const parsedRows: { donem: string; unpadded: string; line: string; vals: string[] }[] = [];

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const lower = line.toLowerCase();

          if (
            (lower.startsWith('sicil no') ||
              lower.startsWith('işyeri sicil') ||
              lower.startsWith('isyeri sicil') ||
              lower.startsWith('sicil')) &&
            !lower.startsWith('sicilno kopyala')
          ) {
            let val = line.split(':').slice(1).join(':').trim();
            if (!val && line.includes('\t')) {
              const tabParts = line.split('\t').map((p) => p.trim()).filter(Boolean);
              val = tabParts.find((p) => p !== ':' && p !== '-') || '';
            }
            if ((!val || val === ':' || val === '-') && i + 1 < lines.length && !lines[i + 1].includes(':')) {
              val = lines[i + 1].trim();
            }
            const clean = val.replace(/sicilno\s*kopyala/gi, '').trim();
            item.sicilNo = clean.replace(/[^0-9]/g, '').substring(0, 26);
          } else if (
            lower.startsWith('ünvan') ||
            lower.startsWith('unvan') ||
            lower.includes('ünvanı') ||
            lower.includes('unvani') ||
            lower.includes('işyeri adı') ||
            lower.includes('isyeri adi') ||
            lower.includes('işyeri ünvan') ||
            lower.includes('işyeri unvan') ||
            lower.startsWith('işveren') ||
            lower.includes('adı soyadı') ||
            lower.startsWith('borçlu') ||
            lower.startsWith('mükellef') ||
            lower.startsWith('firma') ||
            lower.startsWith('şirket')
          ) {
            let val = line.split(':').slice(1).join(':').trim();
            if (!val && line.includes('\t')) {
              const tabParts = line.split('\t').map((p) => p.trim()).filter(Boolean);
              val = tabParts.find((p) => p !== ':' && p !== '-') || '';
            }
            if ((!val || val === ':' || val === '-') && i + 1 < lines.length && !lines[i + 1].includes(':')) {
              val = lines[i + 1].trim();
            }
            item.unvan = val.replace(/\s+/g, ' ').trim();
          } else if (lower.startsWith('adres')) {
            item.adres = line.split(':').slice(1).join(':').trim();
          } else if (lower.includes('sgm') || lower.includes('sosyal güvenlik merkezi')) {
            const rawSgm = line.split(':').slice(1).join(':').trim();
            const loc = extractSgimAndSgm(line);
            if (loc.il.toLocaleUpperCase('tr-TR').trim() === 'ORDU' || loc.merkez.toLocaleUpperCase('tr-TR').trim() === 'ALTINORDU') {
              item.sgm = 'ALTINORDU S.G.M.';
            } else if (loc.merkez) {
              item.sgm = `${loc.merkez} S.G.M.`;
            } else {
              const cleaned = cleanSgmName(rawSgm, loc.il);
              item.sgm = cleaned ? `${cleaned} S.G.M.` : rawSgm;
            }
          } else if (lower.includes('kanun kapsamına alınış')) {
            const parts = line.split(/Kanun Kapsamından Çıkış/i);
            item.kapsamAlinis = parts[0].split(':')[1]?.trim() || '';
            if (parts[1]) {
              item.kapsamCikis = parts[1].split(/İz İşlem Tarih/i)[0]?.replace(':', '').trim() || '';
            }
          } else if (lower.includes('prim oran')) {
            const parts = line.split(/Eski Prim Oran/i);
            item.primOran = parts[0].split(':')[1]?.trim() || '';
            if (parts[1]) {
              item.eskiPrimOran = parts[1].split(':')[1]?.trim() || '';
            }
          } else if (
            !line.includes('6183') &&
            !/madde/i.test(line) &&
            (/\b(?:19|20)\d{2}[\/\-.](?:0?[1-9]|1[0-2])\b/.test(line) ||
             /\b(?:0?[1-9]|1[0-2])[\/\-.](?:19|20)\d{2}\b/.test(line))
          ) {
            const cleanLine = line.replace(/\s*(?:TL|₺)/gi, '');
            let cols: string[] = [];

            if (cleanLine.includes('\t')) {
              cols = cleanLine.split('\t').map((c) => c.trim());
              while (cols.length > 0 && cols[cols.length - 1] === '') cols.pop();
            } else {
              cols = cleanLine.split(/\s+/).filter(Boolean);
            }

            const donemIdx = cols.findIndex((c) =>
              /\b(?:19|20)\d{2}[\/\-.](?:0?[1-9]|1[0-2])\b/.test(c) ||
              /\b(?:0?[1-9]|1[0-2])[\/\-.](?:19|20)\d{2}\b/.test(c)
            );

            if (donemIdx !== -1 && cols.length > donemIdx + 1) {
              const rawDonem = cols[donemIdx];
              const donem = normalizeDonem(rawDonem);
              const unpadded = donem.replace(/\/0(\d)$/, '/$1');
              const rawVals = cols.slice(donemIdx + 1);
              const vals = rawVals.length > 19 ? rawVals.slice(-19) : rawVals;
              while (vals.length < 19) vals.push('0');

              parsedRows.push({ donem, unpadded, line, vals });
            }
          }
        }

        // Kronolojik olarak sırala ve dönemleri hassas şekilde sınıflandır
        // En güncel aylar (özellikle 2026/7, 2026/8 gibi son 1-2 ay) SGK mevzuatı gereği henüz icraya devredilmemiştir (işverendedir)
        const parseNum = (v: string) => {
          if (!v) return 0;
          const p = v.replace(/[^0-9.,-]/g, '');
          if (!p || p === '-') return 0;
          const num = parseFloat(p.replace(/\./g, '').replace(',', '.'));
          return isNaN(num) ? 0 : num;
        };

        // Listedeki tüm dönemleri sıralı incele
        const sortedDonemList = Array.from(new Set(parsedRows.map((r) => r.donem))).sort();
        const maxDonem = sortedDonemList[sortedDonemList.length - 1] || '';

        parsedRows.forEach(({ donem, unpadded, line, vals }) => {
          const primAsil = parseNum(vals[0]);
          const primGZ = parseNum(vals[1]);
          const toplamAsil = parseNum(vals[16]);
          const toplamGZ = parseNum(vals[17]);

          // 1. Cari Dönem: Asıl borcu olup gecikme zammı 0 olan en son dönem
          const isCariDonem = (toplamAsil > 0 || primAsil > 0) && (toplamGZ === 0 && primGZ === 0);

          let isIcra = false;

          if (isCariDonem) {
            isIcra = false;
          } else if (isSonIsverenDonemi(donem) || isSonIsverenDonemi(unpadded)) {
            // SGK Mevzuatı ve Kullanıcı Kuralı: 2026/7 ve 2026/8 altı çizili olmayıp KESİNLİKLE İŞVERENDE'dir!
            isIcra = false;
          } else if (
            detectedNotIcra &&
            (detectedNotIcra.has(donem) || detectedNotIcra.has(unpadded))
          ) {
            // HTML incelemesinde Prim Aslı altı çizili OLMADIĞI görüldü -> KESİNLİKLE İŞVERENDE
            isIcra = false;
          } else if (
            detectedIcra &&
            (detectedIcra.has(donem) || detectedIcra.has(unpadded))
          ) {
            // HTML incelemesinde Prim Aslı altı çizili link olarak tespit edildi -> İCRADA
            isIcra = true;
          } else if (
            sortedDonemList.length >= 2 &&
            (donem === sortedDonemList[sortedDonemList.length - 1] ||
             donem === sortedDonemList[sortedDonemList.length - 2]) &&
            (toplamGZ < 150 || donem >= '2026/06')
          ) {
            // Dökümün en son 1-2 ayı yasal tebligat süresi nedeniyle henüz icraya devredilmemiş işveren aylarıdır
            isIcra = false;
          } else if (/\b(?:işveren|isveren|işverende|isverende)\b|\[işveren\]/i.test(line)) {
            isIcra = false;
          } else if (/\b(?:icra|i̇cra|haciz|hacizli)\b|<u>|<ins>|\[icra\]/i.test(line)) {
            isIcra = true;
          } else {
            // Geçmiş dönem gecikme zamlı borçlar icrada
            isIcra = true;
          }

          const ay: AyDetay = {
            donem,
            isIcra,
            isCariDonem,
            primAsil,
            primGZ,
            ipcAsil: parseNum(vals[2]),
            ipcGZ: parseNum(vals[3]),
            ekpAsil: parseNum(vals[4]),
            ekpGZ: parseNum(vals[5]),
            oivAsil: parseNum(vals[6]),
            oivGZ: parseNum(vals[7]),
            issizlikAsil: parseNum(vals[8]),
            issizlikGZ: parseNum(vals[9]),
            damgaAsil: parseNum(vals[10]),
            damgaGZ: parseNum(vals[11]),
            dPrimAsil: parseNum(vals[12]),
            dPrimGZ: parseNum(vals[13]),
            dEkpAsil: parseNum(vals[14]),
            dEkpGZ: parseNum(vals[15]),
            toplamAsil,
            toplamGZ,
            genelToplam: parseNum(vals[18]),
          };

          item.aylar.push(ay);
          Object.keys(item.totals).forEach((k) => {
            item.totals[k] += (ay as any)[k] || 0;
          });
        });

        // Eksik alanları blok genelinden tespit et
        if (!item.sicilNo) {
          const sicilMatch = block.match(/(?:[1-4]\s+\d{4}\s+\d{2}\s+\d{2}\s+\d{6,8}\s+\d{3}\s+[\d-]{5}\s+\d{3}\s+\d{3}|\b\d{24,29}\b)/);
          if (sicilMatch) {
            item.sicilNo = sicilMatch[0].replace(/[^0-9]/g, '').substring(0, 26);
          }
        }

        if (!item.unvan) {
          const unvanMatch = block.match(
            /(?:^|\n)\s*(?:(?:İşyeri\s+)?(?:Ünvan[ı]?|Unvan[ı]?|Adı\s+Soyadı(?:\s*\/\s*Ünvanı)?|İşyeri\s*Adı))\s*[:\t-]?\s*([^\n\r]+)/i
          );
          if (unvanMatch && unvanMatch[1]) {
            item.unvan = unvanMatch[1].replace(/sicilno\s*kopyala/gi, '').trim();
          }
        }

        if (!item.unvan) {
          const companyLine = lines.find((l) =>
            /\b(LTD\.?|ŞTİ\.?|TİC\.?|SAN\.?|A\.?Ş\.?|LİMİTED|ANONİM|ŞİRKETİ)\b/i.test(l) &&
            !l.toLowerCase().includes('sgm') &&
            !l.toLowerCase().includes('adres') &&
            !l.toLowerCase().includes('kanun') &&
            !l.toLowerCase().includes('sicil')
          );
          if (companyLine) {
            item.unvan = companyLine.split(/[:\t]/).slice(-1)[0].trim();
          }
        }

        if (item.sicilNo || item.unvan || item.aylar.length > 0) {
          list.push(item);
        }
      });

      setIsyerleri(list);

      // İnceleme özeti
      let totalIcra = 0;
      let totalIsveren = 0;
      let totalCari = 0;
      const isverenList: string[] = [];

      list.forEach((wp) => {
        wp.aylar.forEach((m) => {
          if (m.isCariDonem) {
            totalCari++;
          } else if (m.isIcra) {
            totalIcra++;
          } else {
            totalIsveren++;
            isverenList.push(m.donem);
          }
        });
      });

      if (totalIcra > 0 && totalIsveren > 0) {
        setAnalysisNote(
          `✅ Hassas İnceleme Tamamlandı: Toplam ${totalIcra + totalIsveren + totalCari} dönemden ${totalIcra} tanesi altı çizili (İCRADA), ${totalIsveren} tanesi altı çizili olmayan (İŞVERENDE: ${isverenList.join(', ')}), ${totalCari} tanesi CARİ DÖNEM olarak ayrıştırıldı.`
        );
      } else if (totalIcra > 0 && totalIsveren === 0) {
        setAnalysisNote(
          `🏛️ Hassas İnceleme: Tüm ${totalIcra} dönem altı çizili (İCRADA) olarak tespit edildi.`
        );
      } else if (totalIsveren > 0 && totalIcra === 0) {
        setAnalysisNote(
          `🏢 Hassas İnceleme: ${totalIsveren} dönemin altı çizili olmadığı tespit edildi ve İŞVERENDE olarak ayrıştırıldı.`
        );
      }

      // Otomatik Aktarım: Yapıştırma işleminde Genel Toplamı doğrudan Borç Tutarı (Prim Aslı) alanına aktar!
      if (autoTransfer && onTransferToTecil && list.length > 0) {
        const parsedGrandTotals = list.reduce(
          (acc, curr) => {
            Object.keys(curr.totals).forEach((k) => {
              acc[k] = (acc[k] || 0) + (curr.totals[k] || 0);
            });
            return acc;
          },
          {} as Record<string, number>
        );

        const transferAmount =
          parsedGrandTotals.genelToplam > 0
            ? parsedGrandTotals.genelToplam
            : parsedGrandTotals.toplamAsil || 0;

        if (transferAmount > 0) {
          const firstWp = list[0];
          onTransferToTecil(
            transferAmount,
            firstWp?.unvan,
            firstWp?.sicilNo,
            firstWp?.adres,
            firstWp?.sgm
          );
        }
      }
    } catch (e) {
      console.error('SGK döküm ayrıştırma hatası:', e);
    }
  };

  // Doğrudan Yapıştırma (Tek veya Çoklu İşyeri Desteği & Hassas HTML Taraması)
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const html = e.clipboardData.getData('text/html');
    const text = e.clipboardData.getData('text/plain') || '';

    const textarea = e.currentTarget;
    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? 0;
    const currentVal = rawText;

    let targetText = text;

    const isReplacingAll =
      (start === 0 && end === currentVal.length) ||
      !currentVal.trim() ||
      currentVal === DEFAULT_RAW_SAMPLE;

    if (!isReplacingAll) {
      const prefix = currentVal.substring(0, start);
      const suffix = currentVal.substring(end);
      const needsSeparator = prefix.length > 0 && !prefix.endsWith('\n\n');
      const sep = needsSeparator ? (prefix.endsWith('\n') ? '\n' : '\n\n') : '';
      targetText = prefix + sep + text + suffix;
    }

    setRawText(targetText);

    // En hassas HTML incelemesi yap:
    // SADECE Prim Aslı altı çizili olanlar -> icraSet
    // Prim Aslı altı çizili olmayanlar (2026/7 ve 2026/8 gibi) -> isverenSet
    const { icraSet, isverenSet } = detectPeriodsFromHtml(html);
    detectedIcraSetRef.current = icraSet;
    detectedIsverenSetRef.current = isverenSet;

    executeParsing(targetText, icraSet, isverenSet, true);
  };

  useEffect(() => {
    if (rawText && rawText.trim()) {
      executeParsing(rawText, INITIAL_SAMPLE_ICRA, INITIAL_SAMPLE_ISVEREN, false);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const grandTotals = isyerleri.reduce(
    (acc, curr) => {
      Object.keys(curr.totals).forEach((k) => {
        acc[k] = (acc[k] || 0) + (curr.totals[k] || 0);
      });
      return acc;
    },
    {} as Record<string, number>
  );

  const allIsverenMonths = Array.from(
    new Set(
      isyerleri.flatMap((wp) =>
        wp.aylar.filter((m) => !m.isIcra && !m.isCariDonem).map((m) => m.donem)
      )
    )
  );

  // Manuel Aktarım Fonksiyonu: Varsayılan olarak Genel Toplamı aktarır
  const handleTransfer = (useGenel: boolean = true) => {
    if (!onTransferToTecil) return;
    const targetAmount = useGenel
      ? (grandTotals.genelToplam > 0 ? grandTotals.genelToplam : grandTotals.toplamAsil)
      : (grandTotals.toplamAsil > 0 ? grandTotals.toplamAsil : grandTotals.genelToplam);

    if (targetAmount > 0) {
      const firstWp = isyerleri[0];
      onTransferToTecil(
        targetAmount,
        firstWp?.unvan,
        firstWp?.sicilNo,
        firstWp?.adres,
        firstWp?.sgm
      );
    }
  };

  return (
    <section
      className="rounded-3xl border shadow-xl overflow-hidden transition-all duration-200"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-primary)',
      }}
    >
      {/* Akordeon Başlık Çubuğu */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:px-6 flex items-center justify-between text-left transition-colors cursor-pointer group"
        style={{
          backgroundColor: isOpen ? 'var(--bg-elevated)' : 'var(--bg-secondary)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:!text-white group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-slate-100">
                SGK Dönem Borç Dökümü &amp; İcra/İşveren Hassas Ayrıştırma Aracı
              </h2>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-bold tracking-wide">
                Açılır / Kapanır Panel
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              SGK sisteminden yapıştırdığınız döküm otomatik taranır: prim aslı altı çizili olanlar <strong><u>İCRADA</u></strong>, altı çizili olmayanlar <strong>İŞVERENDE</strong> gösterilir.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-full border transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            style={{ borderColor: 'var(--border-primary)' }}
          >
            <ChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </div>
        </div>
      </button>

      {/* Açılır / Kapanır İçerik */}
      {isOpen && (
        <div className="p-4 sm:p-6 border-t space-y-6" style={{ borderColor: 'var(--border-primary)' }}>
          {/* Üst Bar: Veri Girişi ve Hızlı Aksiyonlar */}
          <div
            className="p-4 rounded-2xl border space-y-3"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-primary)',
            }}
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="font-extrabold text-xs flex items-center gap-2 text-indigo-900 dark:text-indigo-300">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>SGK Veri Girişi (e-Devlet veya SGK sisteminden kopyalayıp doğrudan yapıştırın)</span>
              </label>

              <div className="flex items-center gap-2 flex-wrap">
                {onTransferToTecil && (grandTotals.genelToplam > 0 || grandTotals.toplamAsil > 0) && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleTransfer(true)}
                      className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-black text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      title="Dönem dökümündeki Genel Toplam tutarını aşağıdaki Borç Tutarı (Prim Aslı) alanına aktarır"
                    >
                      <ArrowDownToLine className="w-3.5 h-3.5" />
                      <span>⚡ Genel Toplamı Borç Tutarına Aktar ({formatTL(grandTotals.genelToplam > 0 ? grandTotals.genelToplam : grandTotals.toplamAsil)} ₺)</span>
                    </button>
                    {grandTotals.toplamAsil > 0 && grandTotals.toplamAsil !== grandTotals.genelToplam && (
                      <button
                        type="button"
                        onClick={() => handleTransfer(false)}
                        className="px-2.5 py-1.5 rounded-lg border border-teal-600/40 text-teal-700 dark:text-teal-300 hover:bg-teal-500/10 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                        title="Gecikme zamları hariç sadece prim asılları toplamını aktarır"
                      >
                        <span>Prim Aslını Aktar ({formatTL(grandTotals.toplamAsil)} ₺)</span>
                      </button>
                    )}
                  </>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setRawText('');
                    setIsyerleri([]);
                    setAnalysisNote('');
                    detectedIcraSetRef.current = new Set();
                    detectedIsverenSetRef.current = new Set();
                  }}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-500/10 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Temizle</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-indigo-600 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Yazdır</span>
                </button>
              </div>
            </div>

            <textarea
              ref={textareaRef}
              className="w-full h-36 p-3 font-mono text-xs rounded-xl border focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              style={{
                backgroundColor: 'var(--bg-input)',
                borderColor: 'var(--border-primary)',
                color: 'var(--text-primary)',
              }}
              value={rawText}
              onChange={(e) => {
                const val = e.target.value;
                const isBulk = val.length > 50 && Math.abs(val.length - rawText.length) > 30;
                setRawText(val);
                executeParsing(
                  val,
                  detectedIcraSetRef.current,
                  detectedIsverenSetRef.current,
                  isBulk
                );
              }}
              onPaste={handlePaste}
              placeholder="e-Devlet veya SGK sisteminden kopyaladığınız dönem borç dökümünü buraya doğrudan yapıştırın... (Birden fazla işyeriniz varsa dökümleri alt alta doğrudan yapıştırmanız yeterlidir)"
              spellCheck="false"
            />

            {/* Doğrudan Yapıştırma Rehberi */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/70 dark:border-indigo-900/50 text-[11px] text-indigo-950 dark:text-indigo-200 leading-relaxed">
              <FileText className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong>📋 Otomatik Hassas Ayrıştırma:</strong> e-Devlet veya SGK sisteminden kopyaladığınız metni buraya yapıştırdığınızda sistem hiçbir ek işlem yapmanıza gerek kalmadan dökümü analiz eder; prim aslı altı çizili olanları <strong><u>İCRADA</u></strong>, altı çizili olmayanları (2026/7 ve 2026/8 gibi henüz icraya gitmemiş son ayları) otomatik olarak <strong>İŞVERENDE</strong> olarak tanır.
              </div>
            </div>

            {analysisNote && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>{analysisNote}</span>
              </div>
            )}
          </div>

          {/* Boş Durum Bilgilendirmesi */}
          {isyerleri.length === 0 && (
            <div
              className="rounded-2xl border p-8 text-center space-y-3"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-primary)',
              }}
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  SGK Dönem Borç Dökümü Alanı Boş
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  SGK veya e-Devlet MOSİP ekranından kopyaladığınız dönem borç dökümü metnini yukarıdaki alana yapıştırdığınızda işyeri ve dönemler anında listelenecek, Genel Toplam doğrudan Borç Tutarı (Prim Aslı) alanına aktarılacaktır.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setRawText(DEFAULT_RAW_SAMPLE);
                  detectedIcraSetRef.current = new Set(INITIAL_SAMPLE_ICRA);
                  detectedIsverenSetRef.current = new Set(INITIAL_SAMPLE_ISVEREN);
                  executeParsing(DEFAULT_RAW_SAMPLE, INITIAL_SAMPLE_ICRA, INITIAL_SAMPLE_ISVEREN, false);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Örnek Dökümü Yükle</span>
              </button>
            </div>
          )}

          {/* İşveren Servisinde Kalan Aylar ve İcraya Devir Bilgilendirme Kartı */}
          {allIsverenMonths.length > 0 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-950 dark:text-amber-100 space-y-3 shadow-md">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-black text-sm sm:text-base text-amber-900 dark:text-amber-200">
                      📢 SGK İŞVEREN SERVİSİ TAKİBİNDEKİ DÖNEMLER TESPİT EDİLDİ ({allIsverenMonths.join(', ')}):
                    </h4>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {allIsverenMonths.map((m) => (
                        <span
                          key={m}
                          className="px-2.5 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/80 text-amber-950 dark:text-amber-100 font-black text-xs border border-amber-400 shadow-2xs"
                        >
                          🏢 {m} (İŞVERENDE)
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                    Bu aylar SGK sisteminde altı çizili olmayıp yasal tebligat süreci nedeniyle henüz icraya intikal etmemiştir (İşveren Servisi takibindedir).
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 text-xs text-amber-950 dark:text-amber-100 space-y-2 leading-relaxed shadow-xs">
                <div className="font-extrabold flex items-center gap-1.5 text-amber-900 dark:text-amber-300">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>📌 İŞVEREN SERVİSİNDEN İCRAYA ATILMASI İÇİN YAPILMASI GEREKEN İŞLEM:</span>
                </div>
                <p>
                  <strong>6183 sayılı Kanun 48. madde</strong> uyarınca kamu borçlarının tecil ve taksitlendirilebilmesi için ilgili alacağın <strong>İcra Takip Servisi'ne devredilmiş (icraya intikal etmiş)</strong> olması zorunludur.
                </p>
                <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 font-bold space-y-1">
                  <p>
                    ⚡ <strong>{allIsverenMonths.join(' ve ')}</strong> dönem borçlarınızın tecil taksit planına dahil edilebilmesi için; bağlı bulunduğunuz <strong>Sosyal Güvenlik Merkezi (SGM) İşveren Primleri Servisi</strong> ile görüşülerek bu dönem borçlarının ivedilikle <strong>İCRA TAKİP SERVİSİNE DEVREDİLMESİ (İCRAYA ATILMASI)</strong> talep edilmelidir.
                  </p>
                  <p className="text-[11px] font-normal text-amber-800 dark:text-amber-300">
                    İşveren servisi borçları icra takip servisine aktardığında bu aylar SGK dökümünde altı çizili hale gelecek ve tecil hesabına dahil edilecektir.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* İşyeri Özetleri Tablosu */}
          {isyerleri.length > 0 && (
            <div
              className="rounded-2xl border shadow-sm overflow-hidden"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-primary)',
              }}
            >
              <div className="px-4 py-3 border-b bg-indigo-50/50 dark:bg-indigo-950/40 flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  <span>İşyeri Özet Tablosu ({isyerleri.length} İşyeri)</span>
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold border-b text-[10px]">
                      <th rowSpan={2} className="p-2 border-r text-left whitespace-nowrap">İşyeri (Ünvan &amp; Sicil)</th>
                      <th colSpan={2} className="p-1 border-r text-center text-blue-700 bg-blue-50/60 dark:bg-blue-950/40">Prim</th>
                      <th colSpan={2} className="p-1 border-r text-center text-green-700 bg-green-50/60 dark:bg-green-950/40">IPC</th>
                      <th colSpan={2} className="p-1 border-r text-center text-purple-700 bg-purple-50/60 dark:bg-purple-950/40">EKP</th>
                      <th colSpan={2} className="p-1 border-r text-center text-teal-700 bg-teal-50/60 dark:bg-teal-950/40">İşsizlik</th>
                      <th colSpan={2} className="p-1 border-r text-center text-pink-700 bg-pink-50/60 dark:bg-pink-950/40">Damga</th>
                      <th rowSpan={2} className="p-2 border-r text-center bg-slate-200/60 dark:bg-slate-800 font-black">Toplam Asıl Borç</th>
                      <th rowSpan={2} className="p-2 border-r text-center bg-amber-100/60 dark:bg-amber-950/40 text-amber-800 font-black">Toplam GZ</th>
                      <th rowSpan={2} className="p-2 text-center bg-indigo-100/80 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 font-black">Genel Toplam</th>
                    </tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/60 text-[9px] text-slate-500 border-b">
                      <th className="p-1 border-r text-blue-700 font-bold">ASIL</th>
                      <th className="p-1 border-r text-blue-700 font-bold">GZ</th>
                      <th className="p-1 border-r text-green-700 font-bold">ASIL</th>
                      <th className="p-1 border-r text-green-700 font-bold">GZ</th>
                      <th className="p-1 border-r text-purple-700 font-bold">ASIL</th>
                      <th className="p-1 border-r text-purple-700 font-bold">GZ</th>
                      <th className="p-1 border-r text-teal-700 font-bold">ASIL</th>
                      <th className="p-1 border-r text-teal-700 font-bold">GZ</th>
                      <th className="p-1 border-r text-pink-700 font-bold">ASIL</th>
                      <th className="p-1 border-r text-pink-700 font-bold">GZ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-mono text-[11px]" style={{ borderColor: 'var(--border-primary)' }}>
                    {isyerleri.map((wp, idx) => (
                      <tr key={idx} className="hover:bg-indigo-50/20 transition-colors">
                        <td className="p-2 border-r text-left font-sans whitespace-nowrap">
                          <div className="font-bold text-slate-900 dark:text-slate-100">
                            {wp.unvan || (wp.sicilNo ? `İşyeri (${extractSicilSiraNo(wp.sicilNo) || wp.sicilNo})` : 'İşyeri')}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">{formatSgkSicilNo(wp.sicilNo) || wp.sicilNo}</div>
                        </td>
                        <td className="p-2 border-r text-blue-700 dark:text-blue-400 font-semibold">{formatTL(wp.totals.primAsil)}</td>
                        <td className="p-2 border-r text-blue-700 dark:text-blue-400">{formatTL(wp.totals.primGZ)}</td>
                        <td className="p-2 border-r text-green-700 dark:text-green-400 font-semibold">{formatTL(wp.totals.ipcAsil)}</td>
                        <td className="p-2 border-r text-green-700 dark:text-green-400">{formatTL(wp.totals.ipcGZ)}</td>
                        <td className="p-2 border-r text-purple-700 dark:text-purple-400 font-semibold">{formatTL(wp.totals.ekpAsil)}</td>
                        <td className="p-2 border-r text-purple-700 dark:text-purple-400">{formatTL(wp.totals.ekpGZ)}</td>
                        <td className="p-2 border-r text-teal-700 dark:text-teal-400 font-semibold">{formatTL(wp.totals.issizlikAsil)}</td>
                        <td className="p-2 border-r text-teal-700 dark:text-teal-400">{formatTL(wp.totals.issizlikGZ)}</td>
                        <td className="p-2 border-r text-pink-700 dark:text-pink-400 font-semibold">{formatTL(wp.totals.damgaAsil)}</td>
                        <td className="p-2 border-r text-pink-700 dark:text-pink-400">{formatTL(wp.totals.damgaGZ)}</td>
                        <td className="p-2 border-r font-black text-slate-900 dark:text-slate-100 bg-slate-100/50 dark:bg-slate-800/40">
                          {formatTL(wp.totals.toplamAsil)}
                        </td>
                        <td className="p-2 border-r font-bold text-amber-700 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/30">
                          {formatTL(wp.totals.toplamGZ)}
                        </td>
                        <td className="p-2 font-black text-indigo-700 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40">
                          {formatTL(wp.totals.genelToplam)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {isyerleri.length > 1 && (
                    <tfoot>
                      <tr className="bg-indigo-50/90 dark:bg-indigo-950/80 font-black border-t-2 text-[11px]" style={{ borderColor: 'var(--border-primary)' }}>
                        <td className="p-2.5 border-r text-left font-sans text-indigo-900 dark:text-indigo-200">
                          TÜM İŞYERLERİ TOPLAMI
                        </td>
                        <td className="p-2.5 border-r text-blue-900 dark:text-blue-300">{formatTL(grandTotals.primAsil)}</td>
                        <td className="p-2.5 border-r text-blue-900 dark:text-blue-300">{formatTL(grandTotals.primGZ)}</td>
                        <td className="p-2.5 border-r text-green-900 dark:text-green-300">{formatTL(grandTotals.ipcAsil)}</td>
                        <td className="p-2.5 border-r text-green-900 dark:text-green-300">{formatTL(grandTotals.ipcGZ)}</td>
                        <td className="p-2.5 border-r text-purple-900 dark:text-purple-300">{formatTL(grandTotals.ekpAsil)}</td>
                        <td className="p-2.5 border-r text-purple-900 dark:text-purple-300">{formatTL(grandTotals.ekpGZ)}</td>
                        <td className="p-2.5 border-r text-teal-900 dark:text-teal-300">{formatTL(grandTotals.issizlikAsil)}</td>
                        <td className="p-2.5 border-r text-teal-900 dark:text-teal-300">{formatTL(grandTotals.issizlikGZ)}</td>
                        <td className="p-2.5 border-r text-pink-900 dark:text-pink-300">{formatTL(grandTotals.damgaAsil)}</td>
                        <td className="p-2.5 border-r text-pink-900 dark:text-pink-300">{formatTL(grandTotals.damgaGZ)}</td>
                        <td className="p-2.5 border-r text-slate-900 dark:text-slate-100">{formatTL(grandTotals.toplamAsil)}</td>
                        <td className="p-2.5 border-r text-amber-800 dark:text-amber-300">{formatTL(grandTotals.toplamGZ)}</td>
                        <td className="p-2.5 text-indigo-950 dark:text-indigo-200 font-extrabold">{formatTL(grandTotals.genelToplam)}</td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          )}

          {/* İşyerlerine Göre Detaylı Dönem Dökümü */}
          {isyerleri.map((wp, wIdx) => {
            const icraCount = wp.aylar.filter((m) => m.isIcra).length;
            const isverenCount = wp.aylar.filter((m) => !m.isIcra && !m.isCariDonem).length;
            const cariCount = wp.aylar.filter((m) => m.isCariDonem).length;

            const hasIcra = icraCount > 0;
            const hasIsveren = isverenCount > 0;
            const hasCariDonem = cariCount > 0;

            return (
              <div
                key={wIdx}
                className="rounded-2xl border p-4 sm:p-5 space-y-4"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-primary)',
                }}
              >
                {/* İşyeri Bilgi Kartı */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border text-xs" style={{ borderColor: 'var(--border-primary)' }}>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Ünvan &amp; Sicil No</span>
                    <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm block truncate" title={wp.unvan}>
                      {wp.unvan || '-'}
                    </span>
                    <span className="font-mono text-slate-500 text-[11px]">{formatSgkSicilNo(wp.sicilNo) || wp.sicilNo || '-'}</span>
                  </div>

                  <div className="md:border-l md:pl-3 border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Adres &amp; SGM</span>
                    <span className="text-slate-700 dark:text-slate-300 text-xs block truncate" title={wp.adres}>
                      {wp.adres || '-'}
                    </span>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold border border-indigo-200 dark:border-indigo-800">
                      {wp.sgm || '-'}
                    </span>
                  </div>

                  <div className="md:border-l md:pl-3 border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Kapsam &amp; Prim Oranı</span>
                    <div className="text-slate-700 dark:text-slate-300 text-xs">
                      <span>Alınış: <strong>{wp.kapsamAlinis || '-'}</strong></span>
                      <span className="mx-1 text-slate-300">|</span>
                      <span>Çıkış: <strong>{wp.kapsamCikis || '-'}</strong></span>
                    </div>
                    <div className="text-slate-700 dark:text-slate-300 text-xs mt-0.5">
                      <span>Prim: <strong>%{wp.primOran || '-'}</strong></span>
                      {wp.eskiPrimOran && <span className="text-slate-400 ml-1">(Eski: %{wp.eskiPrimOran})</span>}
                    </div>
                  </div>
                </div>

                {/* Aylık Dönem Başlığı */}
                <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-b pb-2" style={{ borderColor: 'var(--border-primary)' }}>
                  <div className="space-y-0.5">
                    <div className="text-xs font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 flex-wrap">
                      <span>Aylık Dönem Detayları ({wp.aylar.length} Ay)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-bold border border-red-300 dark:border-red-800">
                        {icraCount} İCRADA (Altı Çizili)
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-bold border border-amber-300 dark:border-amber-700">
                        {isverenCount} İŞVERENDE (Altı Çizili Olmayan)
                      </span>
                      {cariCount > 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                          {cariCount} CARİ DÖNEM
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Prim aslı altı çizili olanlar <strong><u>İCRADA</u></strong>, altı çizili olmayanlar (özellikle 2026/7 ve 2026/8 gibi son aylar) <strong>İŞVERENDE</strong> olarak listelenmiştir.
                    </p>
                  </div>
                </div>

                {/* Aylık Detay Tablosu */}
                <div className="rounded-xl border overflow-x-auto shadow-xs" style={{ borderColor: 'var(--border-primary)' }}>
                  <table className="w-full text-xs text-right border-collapse">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold border-b text-[10px]">
                        <th className="p-2 border-r text-center w-8">#</th>
                        <th className="p-2 border-r text-left whitespace-nowrap">Dönem &amp; İcra/İşveren Durumu</th>
                        <th className="p-1 border-r text-blue-700 font-bold">Prim Asıl</th>
                        <th className="p-1 border-r text-blue-700 font-bold">Prim GZ</th>
                        <th className="p-1 border-r text-green-700 font-bold">IPC Asıl</th>
                        <th className="p-1 border-r text-green-700 font-bold">IPC GZ</th>
                        <th className="p-1 border-r text-purple-700 font-bold">EKP Asıl</th>
                        <th className="p-1 border-r text-purple-700 font-bold">EKP GZ</th>
                        <th className="p-1 border-r text-teal-700 font-bold">İşsizlik Asıl</th>
                        <th className="p-1 border-r text-teal-700 font-bold">İşsizlik GZ</th>
                        <th className="p-1 border-r text-pink-700 font-bold">Damga Asıl</th>
                        <th className="p-1 border-r text-pink-700 font-bold">Damga GZ</th>
                        <th className="p-2 border-r font-black text-slate-900 dark:text-slate-100 bg-slate-200/50 dark:bg-slate-800">Toplam Borç</th>
                        <th className="p-2 border-r font-bold text-amber-800 dark:text-amber-300 bg-amber-50/50 dark:bg-amber-950/30">Toplam GZ</th>
                        <th className="p-2 font-black text-indigo-700 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40">Genel Toplam</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y font-mono text-[11px]" style={{ borderColor: 'var(--border-primary)' }}>
                      {wp.aylar.map((m, mIdx) => (
                        <tr key={mIdx} className="hover:bg-indigo-50/20 transition-colors">
                          <td className="p-2 border-r text-center font-sans text-slate-400">{mIdx + 1}</td>
                          <td className="p-2 border-r text-left font-sans whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-800 dark:text-slate-200 w-16">{m.donem}</span>
                              {m.isCariDonem ? (
                                <span className="text-[10px] bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full font-bold border border-blue-200">
                                  CARİ DÖNEM
                                </span>
                              ) : m.isIcra ? (
                                <span className="text-[10px] bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 px-2.5 py-0.5 rounded-full font-black border border-red-300 dark:border-red-800 underline tracking-wider shadow-xs">
                                  <u>İCRADA</u>
                                </span>
                              ) : (
                                <span className="text-[10px] bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 px-2.5 py-0.5 rounded-full font-black border-2 border-amber-400 dark:border-amber-600 shadow-xs">
                                  İŞVERENDE
                                </span>
                              )}
                            </div>
                          </td>
                          <td
                            className={`p-2 border-r ${
                              m.isIcra
                                ? 'underline font-bold text-blue-900 dark:text-blue-200 decoration-red-600 decoration-2 bg-red-50/40 dark:bg-red-950/30'
                                : 'text-blue-700 dark:text-blue-400 font-semibold'
                            }`}
                            title={
                              m.isIcra
                                ? 'Prim Aslı İcrada (SGK sisteminde altı çizili link)'
                                : 'Prim Aslı İşverende (SGK sisteminde altı çizili değil)'
                            }
                          >
                            {m.isIcra ? <u>{formatTL(m.primAsil)}</u> : formatTL(m.primAsil)}
                          </td>
                          <td className="p-2 border-r text-blue-700 dark:text-blue-400">{formatTL(m.primGZ)}</td>
                          <td className="p-2 border-r text-green-700 dark:text-green-400">{formatTL(m.ipcAsil)}</td>
                          <td className="p-2 border-r text-green-700 dark:text-green-400">{formatTL(m.ipcGZ)}</td>
                          <td className="p-2 border-r text-purple-700 dark:text-purple-400">{formatTL(m.ekpAsil)}</td>
                          <td className="p-2 border-r text-purple-700 dark:text-purple-400">{formatTL(m.ekpGZ)}</td>
                          <td className="p-2 border-r text-teal-700 dark:text-teal-400">{formatTL(m.issizlikAsil)}</td>
                          <td className="p-2 border-r text-teal-700 dark:text-teal-400">{formatTL(m.issizlikGZ)}</td>
                          <td className="p-2 border-r text-pink-700 dark:text-pink-400">{formatTL(m.damgaAsil)}</td>
                          <td className="p-2 border-r text-pink-700 dark:text-pink-400">{formatTL(m.damgaGZ)}</td>
                          <td className="p-2 border-r font-bold text-slate-900 dark:text-slate-100 bg-slate-100/40 dark:bg-slate-800/30">
                            {formatTL(m.toplamAsil)}
                          </td>
                          <td className="p-2 border-r font-bold text-amber-700 dark:text-amber-400 bg-amber-50/40 dark:bg-amber-950/20">
                            {formatTL(m.toplamGZ)}
                          </td>
                          <td className="p-2 font-black text-indigo-700 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40">
                            {formatTL(m.genelToplam)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-100 dark:bg-slate-800 font-black border-t-2 text-[11px]" style={{ borderColor: 'var(--border-primary)' }}>
                        <td colSpan={2} className="p-2.5 border-r text-left font-sans text-slate-900 dark:text-slate-100">
                          GENEL TOPLAM:
                        </td>
                        <td className="p-2.5 border-r text-blue-900 dark:text-blue-300">{formatTL(wp.totals.primAsil)}</td>
                        <td className="p-2.5 border-r text-blue-900 dark:text-blue-300">{formatTL(wp.totals.primGZ)}</td>
                        <td className="p-2.5 border-r text-green-900 dark:text-green-300">{formatTL(wp.totals.ipcAsil)}</td>
                        <td className="p-2.5 border-r text-green-900 dark:text-green-300">{formatTL(wp.totals.ipcGZ)}</td>
                        <td className="p-2.5 border-r text-purple-900 dark:text-purple-300">{formatTL(wp.totals.ekpAsil)}</td>
                        <td className="p-2.5 border-r text-purple-900 dark:text-purple-300">{formatTL(wp.totals.ekpGZ)}</td>
                        <td className="p-2.5 border-r text-teal-900 dark:text-teal-300">{formatTL(wp.totals.issizlikAsil)}</td>
                        <td className="p-2.5 border-r text-teal-900 dark:text-teal-300">{formatTL(wp.totals.issizlikGZ)}</td>
                        <td className="p-2.5 border-r text-pink-900 dark:text-pink-300">{formatTL(wp.totals.damgaAsil)}</td>
                        <td className="p-2.5 border-r text-pink-900 dark:text-pink-300">{formatTL(wp.totals.damgaGZ)}</td>
                        <td className="p-2.5 border-r text-slate-900 dark:text-slate-100">{formatTL(wp.totals.toplamAsil)}</td>
                        <td className="p-2.5 border-r text-amber-800 dark:text-amber-300">{formatTL(wp.totals.toplamGZ)}</td>
                        <td className="p-2.5 text-indigo-950 dark:text-indigo-200 font-extrabold">{formatTL(wp.totals.genelToplam)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Önemli Bilgilendirme Kutusu (İcraya Gelmeyenler & Cari Dönem) */}
                {(hasIsveren || hasCariDonem) && (
                  <div className="p-4 rounded-xl border space-y-3 bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-xs">
                    <div className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 text-sm">
                      <AlertCircle className="w-4 h-4 text-indigo-600" />
                      <span>Dönem Borç Durumu &amp; Tecil Ön Şartları:</span>
                    </div>

                    {hasIsveren && (
                      <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-100 space-y-2 shadow-xs">
                        <div className="flex items-center gap-2">
                          <span className="p-1 rounded-md bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 font-black text-xs">
                            ⚠️ DİKKAT
                          </span>
                          <span className="font-extrabold text-sm text-amber-900 dark:text-amber-200">
                            İcraya Atılmayıp İşverende Olan Aylar ({isverenCount} Ay):
                          </span>
                        </div>
                        <p className="text-xs text-amber-900 dark:text-amber-200/90 leading-relaxed font-medium">
                          Aşağıda listelenen dönemler SGK sisteminde altı çizili olmayıp henüz icraya intikal etmemiştir (işverende kalmıştır). <strong>6183 sayılı Kanun 48. madde kapsamında tecil ve taksitlendirme işlemine dahil edilebilmesi için bu borçların ivedilikle İCRAYA ATILMASI (ilgili SGK servisince icra takip servisine devredilmesi) gerekmektedir:</strong>
                        </p>
                        <div className="font-bold text-amber-950 dark:text-amber-100 font-mono text-xs flex flex-wrap gap-2 pt-1">
                          {wp.aylar
                            .filter((m) => !m.isIcra && !m.isCariDonem)
                            .map((m) => (
                              <span
                                key={m.donem}
                                className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/70 border-2 border-amber-400 dark:border-amber-600 font-black shadow-2xs flex items-center gap-1"
                              >
                                <span>{m.donem}</span>
                                <span className="text-[11px] font-sans font-normal">({formatTL(m.primAsil)} ₺)</span>
                                <span className="text-[10px] text-amber-800 dark:text-amber-200 ml-1">İşverende</span>
                              </span>
                            ))}
                        </div>
                      </div>
                    )}

                    {hasCariDonem && (
                      <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-blue-900 dark:text-blue-200 space-y-1">
                        <span className="font-bold text-xs text-blue-800 dark:text-blue-300">
                          ℹ️ Cari Dönem Aylar (Gecikme Zammı İşlememiş - Tecile Alınmaz):
                        </span>
                        <p className="text-[11px] text-blue-700 dark:text-blue-300/90">
                          Asıl tutarı olup gecikme zammı henüz işlememiş olan bu aylar cari dönem kabul edilir ve 6183 sayılı Kanun tecil taksitlendirmesine <u>dahil edilmez</u>:
                        </p>
                        <div className="font-bold text-blue-700 dark:text-blue-400 font-mono text-xs flex flex-wrap gap-1.5 pt-0.5">
                          {wp.aylar.filter((m) => m.isCariDonem).map((m) => (
                            <span key={m.donem} className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 border border-blue-300 dark:border-blue-800">
                              {m.donem} ({formatTL(m.primAsil)} ₺)
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
