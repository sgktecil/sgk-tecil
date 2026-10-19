import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  ClipboardPaste,
  Sparkles,
  FileText,
  RefreshCw,
  Edit3,
  Plus,
  Trash2,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Wand2,
  Calendar,
  Coins,
  MapPin,
  Building,
  Zap,
  ExternalLink,
  FileDown,
  Loader2,
  Calculator,
  AlertTriangle
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { formatTL, formatDateTR, parseTL, getTodayDateTR, calculate6183, getTodayDateISO } from '../utils/calculator';

interface TaksitFormuModalProps {
  isOpen: boolean;
  onClose?: () => void;
  isInline?: boolean;
  borc: number;
  taksitSayisi: number;
  onTaksitSayisiChange?: (val: number) => void;
  onBorcChange?: (val: number, newPesinat?: number) => void;
  onPesinatChange?: (val: number) => void;
  pesinatTutari: number;
  pesinatTarihi: string;
  likiditeOrani: number;
  likiditeTab: 'bilanco' | 'isletme';
  bilancoData: { dv: number; stok: number; ky: number };
  isletmeData: { kasa: number; banka: number; alacak: number; borclar: number };
  initialBorclu?: Partial<BorcluBilgileri>;
  pesinatModeProp?: 'taksiteGore' | 'yuzdeOn' | 'manuel';
  onPesinatModeChange?: (mode: 'taksiteGore' | 'yuzdeOn' | 'manuel') => void;
  faizOrani?: number;
}

export interface BorcluBilgileri {
  ilMudurlugu: string;
  sgkMerkezi: string;
  tcknVkn: string;
  unvan: string;
  sigortaNo: string;
  vergiDairesi: string;
  ticaretSicilNo: string;
  isyeriAdresi: string;
  telefon: string;
  faks: string;
  gsm: string;
  eposta: string;
  ikametgahAdresi: string;
  ekSatir?: string;
  ekSatirBaslik?: string;
  ekSatirBirlestir?: boolean;
  ekSatir2?: string;
  ekSatirBaslik2?: string;
  ekSatirBirlestir2?: boolean;
}

// 81 Türkiye İli Listesi, Plaka Haritası ve İl/SGM Ayrıştırma Motoru sgkFormParser modülünden sağlanır
export {
  TURKISH_PROVINCES,
  PLAKA_IL_MAP,
  TURKISH_DISTRICTS_MAP,
  cleanIlName,
  cleanSgmName,
  extractSgimAndSgm,
  formatSgkSicilNo,
  extractSicilSiraNo,
  extractPlateFromSicilNo,
  completeVergiDairesi,
  completeUnvan,
  completeAdres,
  formatPhoneNumber,
  completeDate,
  extractTcknVkn,
  extractFinancialValues,
  extractPhoneNumbers,
} from '../utils/sgkFormParser';

import {
  TURKISH_DISTRICTS_MAP,
  cleanIlName,
  cleanSgmName,
  extractSgimAndSgm,
  formatSgkSicilNo,
  extractSicilSiraNo,
  extractPlateFromSicilNo,
  completeVergiDairesi,
  completeUnvan,
  completeAdres,
  formatPhoneNumber,
  completeDate,
  extractTcknVkn,
  extractFinancialValues,
  extractPhoneNumbers,
} from '../utils/sgkFormParser';

export interface ParsedBadge {
  key: string;
  label: string;
  value: string;
  isComplemented?: boolean;
  complementNote?: string;
}

interface AlacakItem {
  id: string;
  borclununAdi: string;
  tur: string;
  vade: string;
  tutar: string;
}

interface BorcItem {
  id: string;
  alacaklininAdi: string;
  tur: string;
  vade: string;
  tutar: string;
}

interface BankaItem {
  id: string;
  sira: number;
  sube: string;
  hesapNo: string;
  bakiye: string;
}

export const TaksitFormuModal: React.FC<TaksitFormuModalProps> = ({
  isOpen,
  onClose,
  isInline = false,
  borc,
  taksitSayisi,
  onTaksitSayisiChange,
  onBorcChange,
  onPesinatChange,
  pesinatTutari,
  pesinatTarihi,
  likiditeOrani,
  bilancoData,
  isletmeData,
  initialBorclu,
  pesinatModeProp,
  onPesinatModeChange,
  faizOrani = 39,
}) => {
  // Form Seçimi: 'ek1' | 'ek1b' (Ek-1/a muhasebeci doldurduğu için kaldırıldı)
  const [activeForm, setActiveForm] = useState<'ek1' | 'ek1b'>('ek1');

  // Sayfa Seçimi: 'sayfa1' (Ön) | 'sayfa2' (Arka) | 'hepsi' (Arkalı Önlü)
  const [activePage, setActivePage] = useState<'sayfa1' | 'sayfa2' | 'hepsi'>('hepsi');

  // Arkalı Önlü Baskı İpucu Kutusu
  const [showDuplexTip, setShowDuplexTip] = useState(true);

  // Raw paste text input
  const [pasteText, setPasteText] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [printNotification, setPrintNotification] = useState<string | null>(null);

  // Manuel Değiştirilebilir Finansal Parametreler & İşlem Tarihi
  const getIslemTarihi = () => {
    if (pesinatTarihi) {
      return formatDateTR(pesinatTarihi);
    }
    return getTodayDateTR();
  };

  const [customBorc, setCustomBorc] = useState(() => formatTL(borc));
  const [customTaksit, setCustomTaksit] = useState(() => taksitSayisi.toString());
  const [customPesinat, setCustomPesinat] = useState(() => formatTL(pesinatTutari));
  // Peşinat Giriş Modu: 'taksiteGore' (Taksit sayısına göre otomatik 1 taksit) | 'yuzdeOn' (%10) | 'manuel' (Kullanıcının serbest girdiği tutar)
  const [pesinatMode, setPesinatMode] = useState<'taksiteGore' | 'yuzdeOn' | 'manuel'>(pesinatModeProp || 'taksiteGore');

  useEffect(() => {
    if (pesinatModeProp && pesinatModeProp !== pesinatMode) {
      setPesinatMode(pesinatModeProp);
    }
  }, [pesinatModeProp]);

  // Canlı Hesaplanan Tecil İşlem Sonucu
  const liveCalculation = useMemo(() => {
    const numBorc = parseTL(customBorc);
    const cleanedTaksit = customTaksit.replace(/[^\d]/g, '');
    const numTaksit = parseInt(cleanedTaksit, 10) || taksitSayisi || 1;
    const numPesinat = parseTL(customPesinat);
    const faiz = faizOrani || 39;
    return calculate6183(numBorc, numTaksit, numPesinat, getTodayDateISO(), faiz);
  }, [customBorc, customTaksit, customPesinat, faizOrani, taksitSayisi]);

  // Kullanıcı kesin kuralı: Formdaki tarih her zaman işlemin yapıldığı güncel işlem tarihi (işlem günü) olmalıdır
  const [customTarih, setCustomTarih] = useState(() => getIslemTarihi());
  const [customLikidite, setCustomLikidite] = useState(() => (likiditeOrani > 0 ? likiditeOrani.toFixed(2) : '0,45'));

  // Kullanıcı kuralı: Taksit sayısı yazılınca peşinat (ilk taksit) otomatik olarak değişsin!
  const handleCustomTaksitChange = (val: string) => {
    setCustomTaksit(val);
    const cleaned = val.replace(/[^\d]/g, '');
    const num = parseInt(cleaned, 10);
    if (!isNaN(num) && num >= 1 && num <= 72) {
      onTaksitSayisiChange?.(num);
      if (pesinatMode === 'taksiteGore') {
        const numB = parseTL(customBorc);
        if (numB > 0) {
          const autoP = Math.round((numB / num) * 100) / 100;
          setCustomPesinat(formatTL(autoP));
          onPesinatChange?.(autoP);
        }
      }
    }
  };

  const handleCustomTaksitBlur = () => {
    const cleaned = customTaksit.replace(/[^\d]/g, '');
    const num = parseInt(cleaned, 10);
    if (!isNaN(num) && num >= 1) {
      const validNum = Math.min(72, Math.max(1, num));
      setCustomTaksit(validNum.toString());
      onTaksitSayisiChange?.(validNum);
      if (pesinatMode === 'taksiteGore') {
        const numB = parseTL(customBorc);
        if (numB > 0) {
          const autoP = Math.round((numB / validNum) * 100) / 100;
          setCustomPesinat(formatTL(autoP));
          onPesinatChange?.(autoP);
        }
      }
    } else {
      setCustomTaksit(taksitSayisi.toString());
    }
  };

  const handleCustomBorcChange = (val: string) => {
    setCustomBorc(val);
    const num = parseTL(val);
    if (num > 0) {
      if (pesinatMode === 'taksiteGore') {
        const numT = parseInt(customTaksit.replace(/[^\d]/g, ''), 10) || taksitSayisi || 1;
        const autoP = Math.round((num / numT) * 100) / 100;
        setCustomPesinat(formatTL(autoP));
        onBorcChange?.(num, autoP);
        onPesinatChange?.(autoP);
      } else if (pesinatMode === 'yuzdeOn') {
        const autoP = Math.round(num * 0.10 * 100) / 100;
        setCustomPesinat(formatTL(autoP));
        onBorcChange?.(num, autoP);
        onPesinatChange?.(autoP);
      } else {
        const currentP = parseTL(customPesinat);
        onBorcChange?.(num, currentP);
      }
    }
  };

  const handleCustomBorcBlur = () => {
    const num = parseTL(customBorc);
    if (num > 0) {
      const formatted = formatTL(num);
      setCustomBorc(formatted);
      if (pesinatMode === 'taksiteGore') {
        const numT = parseInt(customTaksit.replace(/[^\d]/g, ''), 10) || taksitSayisi || 1;
        const autoP = Math.round((num / numT) * 100) / 100;
        setCustomPesinat(formatTL(autoP));
        onBorcChange?.(num, autoP);
        onPesinatChange?.(autoP);
      } else if (pesinatMode === 'yuzdeOn') {
        const autoP = Math.round(num * 0.10 * 100) / 100;
        setCustomPesinat(formatTL(autoP));
        onBorcChange?.(num, autoP);
        onPesinatChange?.(autoP);
      } else {
        const currentP = parseTL(customPesinat);
        onBorcChange?.(num, currentP);
      }
    }
  };

  const handleCustomPesinatChange = (val: string) => {
    setCustomPesinat(val);
    setPesinatMode('manuel');
    onPesinatModeChange?.('manuel');
    const num = parseTL(val);
    if (num >= 0 && !isNaN(num)) {
      onPesinatChange?.(num);
    }
  };

  const handleCustomPesinatBlur = () => {
    const num = parseTL(customPesinat);
    if (num >= 0 && !isNaN(num)) {
      const formatted = formatTL(num);
      setCustomPesinat(formatted);
      onPesinatChange?.(num);
    }
  };

  // Taksit sayısına göre otomatik ilk taksit (Borç / Taksit Sayısı)
  const setPesinatToTaksit = () => {
    const numB = parseTL(customBorc);
    const numT = parseInt(customTaksit.replace(/[^\d]/g, ''), 10) || taksitSayisi || 1;
    if (numB > 0 && numT > 0) {
      const autoP = Math.round((numB / numT) * 100) / 100;
      setCustomPesinat(formatTL(autoP));
      setPesinatMode('taksiteGore');
      onPesinatModeChange?.('taksiteGore');
      onPesinatChange?.(autoP);
    }
  };

  // Borcun %10'una eşitle
  const setPesinatToYuzdeOn = () => {
    const numB = parseTL(customBorc);
    if (numB > 0) {
      const autoP = Math.round(numB * 0.10 * 100) / 100;
      setCustomPesinat(formatTL(autoP));
      setPesinatMode('yuzdeOn');
      onPesinatModeChange?.('yuzdeOn');
      onPesinatChange?.(autoP);
    }
  };

  // İmza Alanı Bilgileri (Kullanıcı kesin kuralı: Otomatik hiçbir şey yazılmayacak, boş bırakılacak, gerekirse manuel yazılacak)
  const [imzaTarih, setImzaTarih] = useState('');
  const [imzaIsim, setImzaIsim] = useState('');

  // Ek-1/b Mali Durumu Gösterir Değerler Tablosu (Kullanıcı kesin kuralı: Boş gelecek, manuel giriş yapılacak)
  const [maliKasa, setMaliKasa] = useState('');
  const [maliBanka, setMaliBanka] = useState('');
  const [maliAlacak, setMaliAlacak] = useState('');
  const [maliBorclar, setMaliBorclar] = useState('');

  const handleMaliBlur = (val: string, setter: (v: string) => void) => {
    if (!val || !val.trim()) return;
    const num = parseTL(val);
    if (num > 0) {
      setter(formatTL(num));
    }
  };

  // Yazdırma Blob URL'si ve engel bildirimi
  const [printBlobUrl, setPrintBlobUrl] = useState<string | null>(null);
  const [showPrintPrompt, setShowPrintPrompt] = useState(false);
  const [parsedBadges, setParsedBadges] = useState<ParsedBadge[]>([]);

  // Borçlu bilgileri (Başlangıçta tespit edilen veya varsayılan ORDU / ALTINORDU)
  const [borclu, setBorclu] = useState<BorcluBilgileri>(() => ({
    ilMudurlugu: initialBorclu?.ilMudurlugu || 'ORDU',
    sgkMerkezi: initialBorclu?.sgkMerkezi || 'ALTINORDU',
    tcknVkn: initialBorclu?.tcknVkn || '',
    unvan: initialBorclu?.unvan || 'ÜMİT ÖZTÜRK',
    sigortaNo: extractSicilSiraNo(initialBorclu?.sigortaNo || '2 9313 01 01 1088448 052 20-83 000 001'),
    vergiDairesi: initialBorclu?.vergiDairesi || '',
    ticaretSicilNo: initialBorclu?.ticaretSicilNo || '',
    isyeriAdresi: initialBorclu?.isyeriAdresi || 'YENİ MAH.328.SOK. Dış kapı no:8 İç kapı no:B - ORDU ALTINORDU',
    telefon: initialBorclu?.telefon || '',
    faks: initialBorclu?.faks || '',
    gsm: initialBorclu?.gsm || '',
    eposta: initialBorclu?.eposta || '',
    ikametgahAdresi: initialBorclu?.ikametgahAdresi || '',
    ekSatir: initialBorclu?.ekSatir || '',
    ekSatirBaslik: initialBorclu?.ekSatirBaslik || '',
    ekSatirBirlestir: initialBorclu?.ekSatirBirlestir ?? true,
    ekSatir2: initialBorclu?.ekSatir2 || '',
    ekSatirBaslik2: initialBorclu?.ekSatirBaslik2 || '',
    ekSatirBirlestir2: initialBorclu?.ekSatirBirlestir2 ?? true,
  }));

  useEffect(() => {
    if (initialBorclu) {
      setBorclu((prev) => ({
        ...prev,
        ...Object.fromEntries(
          Object.entries(initialBorclu).map(([k, v]) => [
            k,
            k === 'sigortaNo' && typeof v === 'string' ? extractSicilSiraNo(v) : v,
          ]).filter(([_, v]) => Boolean(v))
        ),
      }));
    }
  }, [initialBorclu]);

  // Ek-1/b Arka Sayfası İçin Kısa Vadeli Alacaklar Tablosu (Kullanıcı kesin kuralı: Boş gelsin, doldurulmasın)
  const [alacaklar, setAlacaklar] = useState<AlacakItem[]>([
    { id: '1', borclununAdi: '', tur: '', vade: '', tutar: '' },
    { id: '2', borclununAdi: '', tur: '', vade: '', tutar: '' },
  ]);

  // Ek-1/b Arka Sayfası İçin Kısa Vadeli Borçlar Tablosu (Kullanıcı kesin kuralı: Boş gelsin, doldurulmasın)
  const [borclarList, setBorclarList] = useState<BorcItem[]>([
    { id: '1', alacaklininAdi: '', tur: '', vade: '', tutar: '' },
    { id: '2', alacaklininAdi: '', tur: '', vade: '', tutar: '' },
  ]);

  // Ek-1/b Arka Sayfası İçin Banka Bilgileri Tablosu (Kullanıcı kesin kuralı: Boş gelsin, doldurulmasın)
  const [bankaHesaplari, setBankaHesaplari] = useState<BankaItem[]>([
    { id: '1', sira: 1, sube: '', hesapNo: '', bakiye: '' },
    { id: '2', sira: 2, sube: '', hesapNo: '', bakiye: '' },
  ]);

  useEffect(() => {
    // Sadece prop dışarıdan (örneğin ana ekrandan veya başka bir işlemden) farklı bir değere değiştiğinde güncelle
    const currentNumBorc = parseTL(customBorc);
    if (Math.abs(currentNumBorc - borc) > 0.01) {
      setCustomBorc(formatTL(borc));
      if (pesinatMode === 'taksiteGore') {
        const autoP = Math.round((borc / (taksitSayisi || 1)) * 100) / 100;
        setCustomPesinat(formatTL(autoP));
      } else if (pesinatMode === 'yuzdeOn') {
        const autoP = Math.round(borc * 0.10 * 100) / 100;
        setCustomPesinat(formatTL(autoP));
      }
    }

    const currentNumTaksit = parseInt(customTaksit.replace(/[^\d]/g, ''), 10);
    if (currentNumTaksit !== taksitSayisi) {
      setCustomTaksit(taksitSayisi.toString());
      if (pesinatMode === 'taksiteGore') {
        const numB = parseTL(customBorc);
        if (numB > 0 && taksitSayisi > 0) {
          const autoP = Math.round((numB / taksitSayisi) * 100) / 100;
          setCustomPesinat(formatTL(autoP));
        }
      }
    }

    if (pesinatMode === 'taksiteGore' || pesinatMode === 'yuzdeOn') {
      const currentNumPesinat = parseTL(customPesinat);
      if (Math.abs(currentNumPesinat - pesinatTutari) > 0.01) {
        setCustomPesinat(formatTL(pesinatTutari));
      }
    }
  }, [borc, taksitSayisi, pesinatTutari, isOpen, pesinatMode]);

  // Gelişmiş, Yüksek Hassasiyetli & Kelimeyle Tamamlayıcı Ayrıştırma Motoru
  const parsePastedContent = (text: string) => {
    if (!text || !text.trim()) {
      return;
    }

    const newBorclu = { ...borclu };
    let foundTckn = false;
    let foundUnvan = false;
    let foundVd = false;
    let foundTicaret = false;
    let foundAdres = false;
    let foundIkamet = false;
    let foundTel = false;
    let foundFaks = false;
    let foundGsm = false;
    let foundEposta = false;
    let foundIl = false;
    let foundMerkez = false;

    const cleanVal = (val: string) => {
      if (!val) return '';
      return val.replace(/^[:=\-\t\s]+/, '').replace(/[:=\-\t\s]+$/, '').trim();
    };

    // 1. İL MÜDÜRLÜĞÜ & SOSYAL GÜVENLİK MERKEZİ (SGM)
    const sgkYer = extractSgimAndSgm(text);
    if (sgkYer.il) {
      newBorclu.ilMudurlugu = sgkYer.il;
      foundIl = true;
    }
    if (sgkYer.merkez) {
      newBorclu.sgkMerkezi = sgkYer.merkez;
      foundMerkez = true;
    }

    // 2. TCKN ve VKN Tespiti
    const tcknVknData = extractTcknVkn(text);
    if (tcknVknData) {
      newBorclu.tcknVkn = tcknVknData.value;
      foundTckn = true;
    }

    // 3. SGK İŞYERİ SİCİL / SİGORTA NUMARASI
    const explicitSicil = text.match(
      /(?:işyeri\s*sicil|sicil\s*(?:no|numarası)?|sigorta\s*(?:no|numarası)?|işyeri\s*no|dosya\s*no)[^\w\d]{0,8}([0-9.\-/\s]{10,38})/i
    );
    const rawSgkSicil = text.match(
      /\b([1-4]\s*[-.]?\s*\d{4}\s*[-.]?\s*\d{2}\s*[-.]?\s*\d{2}\s*[-.]?\s*\d{6,7}\s*[-.]?\s*\d{3}\s*[-.]?\s*\d{2}(?:[-/]\d{2})?)\b/
    );
    const digit26 = text.match(/\b(\d{24,26})\b/);

    let rawFoundSicil = '';
    if (explicitSicil && explicitSicil[1].trim().length >= 7) {
      rawFoundSicil = cleanVal(explicitSicil[1]);
    } else if (rawSgkSicil) {
      rawFoundSicil = rawSgkSicil[1].trim();
    } else if (digit26) {
      rawFoundSicil = digit26[1];
    }

    if (rawFoundSicil) {
      const formattedSicil = formatSgkSicilNo(rawFoundSicil);
      const siraNo = extractSicilSiraNo(rawFoundSicil);
      newBorclu.sigortaNo = siraNo || formattedSicil;

      if (!foundIl) {
        const plateIl = extractPlateFromSicilNo(formattedSicil);
        if (plateIl) {
          newBorclu.ilMudurlugu = plateIl;
          foundIl = true;
        }
      }
    }

    // 4. SATIR SATIR ETİKETLİ VERİLER
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let key = '';
      let val = '';

      if (line.includes('\t')) {
        const parts = line.split('\t').map((p) => p.trim()).filter(Boolean);
        if (parts.length >= 2) {
          key = parts[0].toLowerCase();
          val = parts.slice(1).join(' ');
        }
      } else if (line.match(/^([^:=]{2,30})[:=]\s*(.+)$/)) {
        const m = line.match(/^([^:=]{2,30})[:=]\s*(.+)$/);
        if (m) {
          key = m[1].toLowerCase().trim();
          val = m[2].trim();
        }
      } else if (i + 1 < lines.length && line.endsWith(':')) {
        key = line.replace(':', '').toLowerCase().trim();
        val = lines[i + 1].trim();
      }

      // Değerin başındaki gereksiz iki nokta, eşittir, tire işaretlerini arındır
      val = val.replace(/^[:=\s-]+/, '').trim();

      // TCKN / VKN
      if (
        key.includes('tck') ||
        key.includes('vkn') ||
        key.includes('vergi kimlik') ||
        key.includes('kimlik no') ||
        key === 'tc'
      ) {
        const cleanDigits = val.replace(/[^\d]/g, '');
        if (cleanDigits.length === 11 || cleanDigits.length === 10) {
          newBorclu.tcknVkn = cleanDigits;
          foundTckn = true;
        }
      }
      // Ünvan
      else if (
        key.includes('ünvan') ||
        key.includes('unvan') ||
        key.includes('ad soyad') ||
        key.includes('adı soyadı') ||
        key.includes('işyeri adı') ||
        key.includes('isyeri adi') ||
        key.includes('borçlu') ||
        key.includes('mükellef') ||
        key.includes('firma') ||
        key.includes('şirket') ||
        key.includes('işveren')
      ) {
        if (val && !foundUnvan) {
          // Ünvan içine karışmış "VERGİ NO : 0310540975" varsa VKN olarak yakala
          const vknMatch = val.match(/(?:vergi\s*no|vkn|tckn)\s*[:=\s]*(\d{10,11})/i);
          if (vknMatch && (!foundTckn || (newBorclu.tcknVkn && newBorclu.tcknVkn.length === 11 && vknMatch[1].length === 10))) {
            newBorclu.tcknVkn = vknMatch[1];
            foundTckn = true;
          }
          const compUnvan = completeUnvan(val);
          newBorclu.unvan = compUnvan;
          foundUnvan = true;
        }
      }
      // Vergi Dairesi
      else if (key.includes('vergi dairesi') || key === 'v.d.' || key === 'vd') {
        if (val && !foundVd) {
          const compVd = completeVergiDairesi(val);
          newBorclu.vergiDairesi = compVd;
          foundVd = true;
        }
      }
      // Ticaret Sicil No
      else if (key.includes('ticaret sicil') || key.includes('tic. sicil')) {
        if (val && !foundTicaret) {
          newBorclu.ticaretSicilNo = val;
          foundTicaret = true;
        }
      }
      // İşyeri Adresi
      else if (key.includes('işyeri adres') || key.includes('şirket adres') || key === 'adres' || key === 'adresi' || key.includes('işyeri adresi')) {
        if (val && !foundAdres) {
          const compAddr = completeAdres(val, newBorclu.ilMudurlugu, newBorclu.sgkMerkezi);
          newBorclu.isyeriAdresi = compAddr;
          foundAdres = true;
        }
      }
      // İkametgah Adresi
      else if (key.includes('ikamet') || key.includes('ev adres')) {
        if (val && !foundIkamet) {
          const compIkamet = completeAdres(val, newBorclu.ilMudurlugu, newBorclu.sgkMerkezi);
          newBorclu.ikametgahAdresi = compIkamet;
          foundIkamet = true;
        }
      }
      // Telefon & Faks Birleşik veya Ayrı
      else if (key.includes('telefon no, faks no') || key.includes('tel, faks')) {
        const nums = val.match(/0?\s*[2-5]\d{2}[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}/g);
        if (nums && nums.length >= 1) {
          newBorclu.telefon = formatPhoneNumber(nums[0], false);
          foundTel = true;
          if (nums.length >= 2) {
            newBorclu.faks = formatPhoneNumber(nums[1], false);
            foundFaks = true;
          }
        }
      }
      else if (key.includes('telefon') || key === 'tel' || key.includes('santral')) {
        const digits = val.replace(/[^\d]/g, '');
        if (digits.length >= 7 && !foundTel && !val.toLowerCase().includes('posta')) {
          newBorclu.telefon = formatPhoneNumber(val, false);
          foundTel = true;
        }
      }
      else if (key.includes('faks') || key === 'fax') {
        const digits = val.replace(/[^\d]/g, '');
        if (digits.length >= 7 && !foundFaks) {
          newBorclu.faks = formatPhoneNumber(val, false);
          foundFaks = true;
        }
      }
      else if (key.includes('gsm') || key === 'cep' || key === 'mobil') {
        const digits = val.replace(/[^\d]/g, '');
        if (digits.length >= 7 && !foundGsm) {
          newBorclu.gsm = formatPhoneNumber(val, true);
          foundGsm = true;
        }
      }
      else if (key.includes('e-posta') || key.includes('eposta') || key === 'email' || key === 'mail') {
        const cleanEmail = val.replace(/^[:=\s-]+/, '').trim();
        if (cleanEmail && cleanEmail !== '-' && cleanEmail.includes('@') && !foundEposta) {
          newBorclu.eposta = cleanEmail;
          foundEposta = true;
        }
      }
      else if (key.includes('il müdürlüğü') || key.includes('il mudurlugu') || key === 'sgim') {
        if (val && !foundIl) {
          const cIl = cleanIlName(val);
          if (cIl) {
            newBorclu.ilMudurlugu = cIl;
            foundIl = true;
          }
        }
      }
      else if (key.includes('sgm') || key.includes('sosyal güvenlik merkezi') || key.includes('ilçe') || key.includes('ilce')) {
        if (!foundMerkez) {
          const cMerkez = cleanSgmName(val, newBorclu.ilMudurlugu);
          if (cMerkez) {
            newBorclu.sgkMerkezi = cMerkez;
            foundMerkez = true;
            if (TURKISH_DISTRICTS_MAP[cMerkez]) {
              newBorclu.ilMudurlugu = TURKISH_DISTRICTS_MAP[cMerkez];
              foundIl = true;
            }
          }
        }
      }
    }

    // İlçe tespit edildiyse bağlı olduğu ili mutlaka il müdürlüğüne koy
    if (newBorclu.sgkMerkezi && TURKISH_DISTRICTS_MAP[newBorclu.sgkMerkezi]) {
      newBorclu.ilMudurlugu = TURKISH_DISTRICTS_MAP[newBorclu.sgkMerkezi];
    }

    // Kullanıcı kesin kuralı: İl Ordu ise Sosyal Güvenlik Merkezi her zaman ALTINORDU olmalıdır
    if (newBorclu.ilMudurlugu && newBorclu.ilMudurlugu.toLocaleUpperCase('tr-TR').trim() === 'ORDU') {
      newBorclu.sgkMerkezi = 'ALTINORDU';
    }
    if (newBorclu.sgkMerkezi && newBorclu.sgkMerkezi.toLocaleUpperCase('tr-TR').trim() === 'ALTINORDU') {
      newBorclu.ilMudurlugu = 'ORDU';
    }

    // 5. ETİKETSİZ ŞİRKET ÜNVANI TESPİTİ
    if (!foundUnvan) {
      const companyLine = lines.find(
        (l) =>
          /\b(LTD\.?|ŞTİ\.?|TİC\.?|SAN\.?|A\.?Ş\.?|LİMİTED|ANONİM|ŞİRKETİ)\b/i.test(l) &&
          !l.toLowerCase().includes('il müdürlüğü') &&
          !l.toLowerCase().includes('vergi dairesi') &&
          !l.toLowerCase().includes('sosyal güvenlik')
      );
      if (companyLine) {
        const compUnvan = completeUnvan(companyLine);
        newBorclu.unvan = compUnvan;
        foundUnvan = true;
      }
    }

    // 6. ETİKETSİZ VERGİ DAİRESİ TESPİTİ
    if (!foundVd) {
      const vdLine = lines.find((l) => l.toLowerCase().includes('vergi dairesi') || l.toLowerCase().includes(' v.d.'));
      if (vdLine) {
        const compVd = completeVergiDairesi(vdLine);
        if (compVd) {
          newBorclu.vergiDairesi = compVd;
          foundVd = true;
        }
      }
    }

    // 7. ETİKETSİZ ADRES TESPİTİ
    if (!foundAdres) {
      const addressLine = lines.find(
        (l) =>
          (l.toLowerCase().includes('mah.') ||
            l.toLowerCase().includes('mahallesi') ||
            l.toLowerCase().includes('cad.') ||
            l.toLowerCase().includes('caddesi') ||
            l.toLowerCase().includes('sok.') ||
            l.toLowerCase().includes('sokak') ||
            l.toLowerCase().includes('bulv') ||
            l.toLowerCase().includes('bulvarı') ||
            l.toLowerCase().includes('no:') ||
            l.toLowerCase().includes('kat:')) &&
          !l.toLowerCase().includes('ünvan') &&
          !l.toLowerCase().includes('vergi dairesi')
      );
      if (addressLine) {
        const compAddr = completeAdres(addressLine, newBorclu.ilMudurlugu, newBorclu.sgkMerkezi);
        newBorclu.isyeriAdresi = compAddr;
        foundAdres = true;
      }
    }

    // 8. E-POSTA, GSM, TELEFON, FAKS
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch && !foundEposta) {
      newBorclu.eposta = emailMatch[0];
    }

    const phones = extractPhoneNumbers(text);
    if (phones.gsm && !foundGsm) {
      newBorclu.gsm = phones.gsm;
    }
    if (phones.telefon && !foundTel) {
      newBorclu.telefon = phones.telefon;
    }
    if (phones.faks && !foundFaks) {
      newBorclu.faks = phones.faks;
    }

    // 9. FİNANSAL DEĞERLER (BORÇ, PEŞİNAT, TAKSİT, TARİH)
    const fin = extractFinancialValues(text);
    if (fin.borc) {
      const fBorc = formatTL(fin.borc);
      setCustomBorc(fBorc);
    }
    if (fin.pesinat) {
      const fPesinat = formatTL(fin.pesinat);
      setCustomPesinat(fPesinat);
    }
    if (fin.taksit) {
      setCustomTaksit(fin.taksit.toString());
      onTaksitSayisiChange?.(fin.taksit);
    }
    // Kullanıcı kesin kuralı: Formda tarihler daima işin yapıldığı günün / işlem gününün tarihi olmalıdır
    const islemTarihi = getIslemTarihi();
    setCustomTarih(islemTarihi);

    setBorclu(newBorclu);
  };

  // Mevcut Form Alanlarını Kelimeyle Tamamlama & Resmi Biçimlendirme
  const autoCompleteAllFields = () => {
    const updated = { ...borclu };

    // İlçe girilmişse bağlı olduğu ili otomatik tamamla:
    if (updated.sgkMerkezi) {
      const upperMerkez = updated.sgkMerkezi.toLocaleUpperCase('tr-TR');
      if (TURKISH_DISTRICTS_MAP[upperMerkez]) {
        updated.ilMudurlugu = TURKISH_DISTRICTS_MAP[upperMerkez];
      }
    }

    // Kullanıcı kesin kuralı: İl Ordu ise Sosyal Güvenlik Merkezi her zaman ALTINORDU olmalıdır:
    if (updated.ilMudurlugu && updated.ilMudurlugu.toLocaleUpperCase('tr-TR').trim() === 'ORDU') {
      updated.sgkMerkezi = 'ALTINORDU';
    }
    if (updated.sgkMerkezi && updated.sgkMerkezi.toLocaleUpperCase('tr-TR').trim() === 'ALTINORDU') {
      updated.ilMudurlugu = 'ORDU';
    }

    // Vergi Dairesi sonuna "Vergi Dairesi" kelimesini tamamla:
    if (updated.vergiDairesi) {
      updated.vergiDairesi = completeVergiDairesi(updated.vergiDairesi);
    }

    // Ünvan şirket türü eklerini standartlaştır:
    if (updated.unvan) {
      updated.unvan = completeUnvan(updated.unvan);
    }

    // SGK sicil numarasından il plakasını tespit et ve 01 01 ile 052 arasındaki sıra noyu ayıkla:
    if (updated.sigortaNo) {
      if (!updated.ilMudurlugu) {
        const plate = extractPlateFromSicilNo(updated.sigortaNo);
        if (plate) updated.ilMudurlugu = plate;
      }
      updated.sigortaNo = extractSicilSiraNo(updated.sigortaNo);
    }

    // Adrese il/ilçe kelimelerini tamamla:
    if (updated.isyeriAdresi) {
      updated.isyeriAdresi = completeAdres(updated.isyeriAdresi, updated.ilMudurlugu, updated.sgkMerkezi);
    }

    // İkametgah adresi boşsa işyeri adresini aktar:
    if (!updated.ikametgahAdresi && updated.isyeriAdresi) {
      updated.ikametgahAdresi = updated.isyeriAdresi;
    }

    // Telefon ve GSM formatla:
    if (updated.gsm) {
      updated.gsm = formatPhoneNumber(updated.gsm, true);
    }
    if (updated.telefon) {
      updated.telefon = formatPhoneNumber(updated.telefon, false);
    }

    // Tarih daima güncel işlem tarihi (işin yapıldığı tarih) olmalı:
    setCustomTarih(getIslemTarihi());

    // Peşinat boşsa veya asgari %10'un altındaysa SGK mevzuatı %10'unu hesapla:
    const numBorc = parseTL(customBorc);
    const numPesinat = parseTL(customPesinat);
    const minPesinat = Math.round(numBorc * 0.1 * 100) / 100;
    if (numBorc > 0 && (numPesinat <= 0 || numPesinat < minPesinat)) {
      setCustomPesinat(formatTL(minPesinat));
    }

    setBorclu(updated);
  };

  // Hızlı Aksiyon: Borcun %10'u Asgari Peşinatı Hesapla
  const applyMinimumPesinat = () => {
    const numBorc = parseTL(customBorc);
    if (numBorc > 0) {
      const minP = Math.round(numBorc * 0.1 * 100) / 100;
      setCustomPesinat(formatTL(minP));
      onPesinatChange?.(minP);
    }
  };

  // Hızlı Aksiyon: Güncel İşlem Tarihini Yaz
  const applyTodayDate = () => {
    setCustomTarih(getIslemTarihi());
  };

  // Hızlı Aksiyon: İşyeri Adresini İkametgâha Kopyala
  const copyWorkAddressToHome = () => {
    if (borclu.isyeriAdresi) {
      setBorclu({ ...borclu, ikametgahAdresi: borclu.isyeriAdresi });
    }
  };

  const handlePasteChange = (val: string) => {
    setPasteText(val);
    parsePastedContent(val);
  };

  const loadSampleData = () => {
    const currentIslemTarihi = getIslemTarihi();
    const sample = `TCK No / Vergi Kimlik No: 12345678901
Adı Soyadı / Ünvanı: ANADOLU TEKSTİL VE SANAYİ TİCARET LİMİTED ŞİRKETİ
İşyeri / Sigorta Numarası: 2 9313 01 01 1088448 052 20-83 000 001
Toplam Borç Tutarı: 1.200.000,00 TL
İlk Taksit (Peşinat): 120.000,00 TL
Taksit Sayısı: 36 Ay
Başvuru Tarihi: ${currentIslemTarihi}
Vergi Dairesi: Boztepe Vergi Dairesi
Ticaret Sicil No: 987654-5
İşyeri Adresi: Yeni Mah. 328. Sok. Dış Kapı No: 8 İç Kapı No: B Altınordu / ORDU
İşyeri Telefon No, Faks No: 0452 234 56 78 / 0452 234 56 79
GSM Telefon No: 0532 987 65 43
E-posta Adresi: muhasebe@anadolutekstil.com.tr
İkametgâh Adresi: Şahincili Mah. Atatürk Bulvarı No: 18 Altınordu / ORDU
Sosyal Güvenlik İl Müdürlüğü: ORDU SOSYAL GÜVENLİK İL MÜDÜRLÜĞÜ
Sosyal Güvenlik Merkezi: ALTINORDU SOSYAL GÜVENLİK MERKEZİ`;

    setPasteText(sample);
    parsePastedContent(sample);
  };

  const clearForm = () => {
    setPasteText('');
    setParsedBadges([]);
    setBorclu({
      ilMudurlugu: '',
      sgkMerkezi: '',
      tcknVkn: '',
      unvan: '',
      sigortaNo: '',
      vergiDairesi: '',
      ticaretSicilNo: '',
      isyeriAdresi: '',
      telefon: '',
      faks: '',
      gsm: '',
      eposta: '',
      ikametgahAdresi: '',
      ekSatir: '',
      ekSatirBaslik: '',
      ekSatirBirlestir: true,
      ekSatir2: '',
      ekSatirBaslik2: '',
      ekSatirBirlestir2: true,
    });
  };

  // Tablo satır yönetimi
  const addAlacak = () => {
    setAlacaklar([
      ...alacaklar,
      { id: Date.now().toString(), borclununAdi: '', tur: '', vade: '', tutar: '' },
    ]);
  };

  const removeAlacak = (id: string) => {
    setAlacaklar(alacaklar.filter((a) => a.id !== id));
  };

  const addBorc = () => {
    setBorclarList([
      ...borclarList,
      { id: Date.now().toString(), alacaklininAdi: '', tur: '', vade: '', tutar: '' },
    ]);
  };

  const removeBorc = (id: string) => {
    setBorclarList(borclarList.filter((b) => b.id !== id));
  };

  const addBanka = () => {
    setBankaHesaplari([
      ...bankaHesaplari,
      { id: Date.now().toString(), sira: bankaHesaplari.length + 1, sube: '', hesapNo: '', bakiye: '' },
    ]);
  };

  const removeBanka = (id: string) => {
    setBankaHesaplari(bankaHesaplari.filter((b) => b.id !== id));
  };

  useEffect(() => {
    const handleAfterPrint = () => {
      document.body.classList.remove('body-printing-taksit-form');
    };
    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  // Standart A4 Yazdırma HTML'ini Oluştur
  const buildPrintHtml = () => {
    const formElement = document.getElementById('printable-form-container');
    if (!formElement) return '';

    const clone = formElement.cloneNode(true) as HTMLElement;

    // Yazdırılmayacak buton ve kılavuzları klondan temizle
    clone.querySelectorAll('.no-print').forEach((el) => el.remove());

    // Dış kapsayıcının ekran tasarım gölgelerini ve devasa dolgularını kaldır
    clone.style.padding = '0';
    clone.style.margin = '0 auto';
    clone.style.border = 'none';
    clone.style.boxShadow = 'none';
    clone.style.maxWidth = '190mm';
    clone.style.width = '100%';

    // Ek-1 / Ek-1/b 2. sayfasındaki ekran ayracı kesikli çizgiyi baskıda kaldır
    const page2El = clone.querySelector<HTMLElement>('#form-print-page-2');
    if (page2El) {
      page2El.style.borderTop = 'none';
      page2El.style.paddingTop = '0';
      page2El.style.marginTop = '0';
    }

    // Inputları temiz metin span öğelerine dönüştür (taşmaları engeller)
    const originalInputs = formElement.querySelectorAll<HTMLInputElement>('input');
    const cloneInputs = clone.querySelectorAll<HTMLInputElement>('input');
    originalInputs.forEach((inp, i) => {
      if (cloneInputs[i]) {
        const val = inp.value || '';
        const span = document.createElement('span');
        span.textContent = val || ' ';
        span.className = cloneInputs[i].className;
        span.style.cssText = cloneInputs[i].style.cssText;
        
        const isInTable = cloneInputs[i].closest('td') !== null;
        if (isInTable) {
          span.style.borderBottom = 'none';
          span.style.display = 'block';
          span.style.width = '100%';
        } else {
          span.style.borderBottom = '1px solid black';
          span.style.display = 'inline-block';
          span.style.minWidth = '14px';
        }
        span.style.padding = '0 2px';
        span.style.lineHeight = '1.2';
        cloneInputs[i].parentNode?.replaceChild(span, cloneInputs[i]);
      }
    });

    const title = `SGK_${activeForm.toUpperCase()}_${borclu.unvan ? borclu.unvan.substring(0, 20) : 'Tecil_Formu'}`;

    return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm 10mm 8mm 10mm;
    }
    * {
      box-sizing: border-box;
    }
    html, body {
      font-family: 'Times New Roman', Times, serif;
      background: #ffffff !important;
      color: #000000 !important;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    th, td {
      border: 1px solid #000000 !important;
    }
    /* Sayfa 1 (Ön Sayfa): Kesinlikle 1 tam sayfaya sığdırılır, 2. sayfaya ASLA taşmaz */
    #form-print-page-1 {
      page-break-after: always !important;
      break-after: page !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      box-sizing: border-box !important;
      max-height: 280mm !important;
      overflow: hidden !important;
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
    }
    /* Sayfa 2 (Arka Sayfa): Daima yeni sayfada başlar (arkalı önlü çift taraflı baskı için 2. sayfaya oturur) */
    #form-print-page-2 {
      page-break-before: always !important;
      break-before: page !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      box-sizing: border-box !important;
      max-height: 280mm !important;
      overflow: hidden !important;
      margin: 0 !important;
      padding: 0 !important;
      border-top: none !important;
    }
    .page-break-before {
      page-break-before: always !important;
      break-before: page !important;
    }
    .page-break-after {
      page-break-after: always !important;
      break-after: page !important;
    }
    .no-print {
      display: none !important;
    }
    @media print {
      .no-print {
        display: none !important;
      }
      body {
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
      }
      .print-wrapper {
        padding: 0 !important;
        margin: 0 !important;
      }
    }
  </style>
</head>
<body class="bg-gray-100 print:bg-white text-black print:p-0">
  <div class="no-print max-w-3xl mx-auto my-4 p-3 bg-teal-50 border border-teal-300 rounded-xl flex items-center justify-between text-xs text-teal-900 shadow">
    <div class="flex items-center gap-2">
      <span class="text-lg">🖨️</span>
      <span>Arkalı önlü (çift taraflı) form hazır. Yazdırma penceresi otomatik açılmadıysa butona tıklayabilirsiniz.</span>
    </div>
    <button onclick="window.focus(); window.print();" class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg cursor-pointer">
      🖨️ Yazdır (Ctrl + P)
    </button>
  </div>
  <div class="print-wrapper" style="max-width: 190mm; margin: 0 auto; background: white;">
    ${clone.outerHTML}
  </div>
  <script>
    window.addEventListener('load', function() {
      setTimeout(function() {
        window.focus();
        window.print();
      }, 350);
    });
  </script>
</body>
</html>`;
  };

  // Doğrudan Aç ve Yazdır (Yeni Sekme & Blob URL Motoru)
  const handlePrintNewTab = () => {
    setActivePage('hepsi');
    const html = buildPrintHtml();
    if (!html) return;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    setPrintBlobUrl(url);

    let opened = false;
    try {
      const win = window.open(url, '_blank');
      if (win) {
        opened = true;
        setShowPrintPrompt(false);
        setPrintNotification('🖨️ Yazdırma sayfası yeni sekmede doğrudan açıldı!');
        setTimeout(() => setPrintNotification(null), 4000);
      }
    } catch (e) {
      console.warn('Popup açılamadı:', e);
    }

    if (!opened) {
      setShowPrintPrompt(true);
      setPrintNotification('Tarayıcınız açılır pencereyi engelledi. Doğrudan yazdırmak için aşağıdaki "🌐 Yazdırma Ekranını Aç" butonuna tıklayınız.');
    }
  };

  // Doğrudan A4 PDF Dosyası İndirme (jsPDF & html2canvas motoru)
  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    setPrintNotification('A4 Çift Taraflı PDF hazırlanıyor, lütfen bekleyin...');
    try {
      setActivePage('hepsi');
      await new Promise((r) => setTimeout(r, 200));

      const formElement = document.getElementById('printable-form-container');
      if (!formElement) throw new Error('Form öğesi bulunamadı');

      const page1El = formElement.querySelector<HTMLElement>('#form-print-page-1');
      const page2El = formElement.querySelector<HTMLElement>('#form-print-page-2');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pageWidth = 210;
      const margin = 10;
      const printableWidth = pageWidth - margin * 2;

      const renderSection = async (el: HTMLElement) => {
        return await html2canvas(el, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
          onclone: (clonedDoc) => {
            const originalInputs = document.querySelectorAll<HTMLInputElement>('#printable-form-container input');
            const clonedInputs = clonedDoc.querySelectorAll<HTMLInputElement>('#printable-form-container input');
            clonedInputs.forEach((clonedInput, i) => {
              const orig = originalInputs[i];
              const val = orig ? orig.value : clonedInput.value;
              const span = clonedDoc.createElement('span');
              span.textContent = val || ' ';
              span.className = clonedInput.className;
              span.style.cssText = clonedInput.style.cssText;
              const isInTable = clonedInput.closest('td') !== null;
              if (isInTable) {
                span.style.borderBottom = 'none';
                span.style.display = 'block';
                span.style.width = '100%';
              } else {
                span.style.borderBottom = '1px solid black';
                span.style.display = 'inline-block';
                span.style.minWidth = '20px';
              }
              clonedInput.parentNode?.replaceChild(span, clonedInput);
            });
          },
        });
      };

      if (page1El) {
        const c1 = await renderSection(page1El);
        const img1 = c1.toDataURL('image/jpeg', 0.95);
        const h1 = (c1.height * printableWidth) / c1.width;
        pdf.addImage(img1, 'JPEG', margin, 8, printableWidth, Math.min(h1, 281));
      }

      if (page2El) {
        pdf.addPage('a4', 'portrait');
        const c2 = await renderSection(page2El);
        const img2 = c2.toDataURL('image/jpeg', 0.95);
        const h2 = (c2.height * printableWidth) / c2.width;
        pdf.addImage(img2, 'JPEG', margin, 8, printableWidth, Math.min(h2, 281));
      }

      const fileName = `SGK_${activeForm.toUpperCase()}_${borclu.unvan ? borclu.unvan.trim().replace(/\s+/g, '_').substring(0, 20) : 'Tecil_Formu'}.pdf`;
      pdf.save(fileName);
      setPrintNotification('✅ Çift Taraflı (Arkalı Önlü) A4 PDF başarıyla indirildi!');
      setTimeout(() => setPrintNotification(null), 4000);
    } catch (err) {
      console.error('PDF oluşturma hatası:', err);
      setPrintNotification('PDF indirmede sorun oluştu, lütfen tekrar deneyin.');
      setTimeout(() => setPrintNotification(null), 3500);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Arkalı Önlü Yazdır (Doğrudan Yazdırma Ekranı)
  const handlePrint = (forceAllPages: boolean = false) => {
    if (forceAllPages) {
      setActivePage('hepsi');
    }
    document.body.classList.add('body-printing-taksit-form');

    // Standart yazdırma HTML'ini oluştur ve yeni sekmede doğrudan başlat
    const html = buildPrintHtml();
    if (html) {
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      setPrintBlobUrl(url);

      let opened = false;
      try {
        const win = window.open(url, '_blank');
        if (win) {
          opened = true;
          setShowPrintPrompt(false);
          setPrintNotification('🖨️ Yazdırma sayfası yeni sekmede doğrudan açıldı!');
          setTimeout(() => setPrintNotification(null), 4000);
        }
      } catch (e) {
        console.warn('Popup açılamadı:', e);
      }

      if (!opened) {
        setShowPrintPrompt(true);
        setPrintNotification('Tarayıcınız açılır pencereyi engelledi. Doğrudan yazdırmak için aşağıdaki "🌐 Yazdırma Ekranını Aç" butonuna tıklayınız.');
      }
    }

    // Yerel pencere yazdırmayı da tetikle (izinli ortamlar için)
    try {
      window.focus();
      window.print();
    } catch (err) {
      console.warn('Yerel print çağrılamadı:', err);
    }

    setTimeout(() => {
      document.body.classList.remove('body-printing-taksit-form');
    }, 2500);
  };

  // Word (.doc) İndirme
  const downloadWordDoc = () => {
    const formElement = document.getElementById('printable-form-container');
    if (!formElement) return;

    const clone = formElement.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('.no-print').forEach((el) => el.remove());

    const originalInputs = formElement.querySelectorAll<HTMLInputElement>('input');
    const cloneInputs = clone.querySelectorAll<HTMLInputElement>('input');
    originalInputs.forEach((inp, i) => {
      if (cloneInputs[i]) {
        const val = inp.value || '';
        const isInTable = cloneInputs[i].closest('td') !== null;
        const span = document.createElement('span');
        span.textContent = val || (isInTable ? '' : '__________');
        if (!isInTable && val) {
          span.style.textDecoration = 'underline';
          span.style.fontWeight = 'bold';
        }
        cloneInputs[i].parentNode?.replaceChild(span, cloneInputs[i]);
      }
    });

    const html = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>SGK Form</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.3; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; margin-bottom: 8px; table-layout: fixed; }
          th, td { border: 1px solid #000; padding: 5px; font-size: 10pt; text-align: left; word-break: break-word; }
          .center { text-align: center; }
          .bold { font-weight: bold; }
          .right { text-align: right; }
          .page-break { page-break-after: always; }
        </style>
      </head>
      <body>
        ${clone.innerHTML}
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SGK_${activeForm.toUpperCase()}_${borclu.unvan ? borclu.unvan.substring(0, 15) : 'Tecil_Formu'}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyFormText = () => {
    const formElement = document.getElementById('printable-form-container');
    if (!formElement) return;
    navigator.clipboard.writeText(formElement.innerText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderBottomBar = () => (
    <div
      className="no-print p-3 sm:px-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-primary)',
      }}
    >
      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 w-full sm:w-auto">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
        <span>Kutucuklara tıklayarak doğrudan yazabilirsiniz. Çift taraflı A4 çıktısı için birebirdir.</span>
      </div>

      {printNotification && (
        <div className="text-xs px-3 py-1.5 rounded-lg bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 border border-teal-300 dark:border-teal-700 font-semibold animate-pulse">
          {printNotification}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 ml-auto">
        {onClose && (
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-500/10 font-bold text-xs transition-colors cursor-pointer"
          >
            {isInline ? 'Paneli Kapat' : 'Kapat'}
          </button>
        )}

        {/* 1. Doğrudan A4 PDF İndirme (İframe engelinden etkilenmez, tek tıkla indirir) */}
        <button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPdf}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          title="Çift taraflı A4 PDF dosyasını doğrudan bilgisayarınıza indirir"
        >
          {isGeneratingPdf ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>PDF Hazırlanıyor...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>📥 PDF Olarak İndir (.pdf)</span>
            </>
          )}
        </button>

        {/* 2. Yeni Sekmede Aç ve Yazdır (İframe kısıtını aşar, doğrudan tarayıcı yazdırma ekranını açar) */}
        <button
          onClick={handlePrintNewTab}
          className="px-3.5 py-2 rounded-xl border border-teal-500 text-teal-700 dark:text-teal-300 hover:bg-teal-500/10 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Yazdırma ekranını yeni bir sekmede engelsiz olarak açar"
        >
          <ExternalLink className="w-4 h-4 text-teal-600" />
          <span>🌐 Yeni Sekmede Yazdır</span>
        </button>

        {/* 3. Arkalı Önlü Yazdır */}
        <button
          onClick={() => handlePrint(true)}
          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          title="Tarayıcının yerel yazdırma penceresini açar (Iframe engeli varsa otomatik yeni sekmede başlatır)"
        >
          <Printer className="w-4 h-4" />
          <span>🖨️ Arkalı Önlü Yazdır</span>
        </button>
      </div>
    </div>
  );

  const renderFormContent = () => (
    <>
      {/* Arkalı Önlü Baskı Rehberi */}
          {showDuplexTip && (
            <div className="no-print p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/50 flex items-start justify-between gap-3 text-teal-900 dark:text-teal-200">
              <div className="flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <span className="font-bold">📄 Arkalı Önlü (Çift Taraflı) Yazdırma Kılavuzu:</span>
                  <p className="mt-0.5">
                    Sağ alttaki <strong>"🖨️ Arkalı Önlü Yazdır"</strong> butonuna bastığınızda yazdırma ekranı açılır. Tarayıcınız veya iframe ortamı doğrudan yazdırmayı engellerse otomatik olarak <strong>"🌐 Yeni Sekmede Aç"</strong> penceresi devreye girer. Ayrıca doğrudan <strong>"📥 PDF Olarak İndir"</strong> butonuna basarak çift taraflı A4 PDF dosyanızı tek tıkla cihazınıza indirebilirsiniz.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDuplexTip(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                title="Kapat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Doğrudan Yazdırma Ekranı Açma Bildirimi (Açılır pencere engeli durumunda) */}
          {showPrintPrompt && printBlobUrl && (
            <div className="no-print p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/80 border-2 border-teal-500 flex items-center justify-between flex-wrap gap-3 text-teal-950 dark:text-teal-100 shadow-md">
              <div className="flex items-center gap-2.5">
                <Printer className="w-5 h-5 text-teal-600 shrink-0" />
                <div>
                  <div className="font-extrabold text-sm">🖨️ Yazdırma Sayfanız Hazırlandı</div>
                  <div className="text-xs text-teal-800 dark:text-teal-300">
                    Tarayıcınız açılır pencereyi engelledi. PDF indirmeden doğrudan yazdırma ekranını açmak için butona tıklayınız:
                  </div>
                </div>
              </div>
              <a
                href={printBlobUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowPrintPrompt(false)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-black text-xs rounded-xl shadow cursor-pointer inline-flex items-center gap-1.5 transition-all active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                <span>🌐 Yazdırma Ekranını Doğrudan Aç ve Yazdır</span>
              </a>
            </div>
          )}

          {/* ============================================================== */}
          {/* 1. AKILLI YAPIŞTIRMA & HIZLI MANUEL GİRİŞ BÖLÜMÜ                */}
          {/* ============================================================== */}
          <div
            className="no-print p-4 rounded-2xl border space-y-3"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--primary-400)',
            }}
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="font-extrabold text-sm flex items-center gap-2 text-teal-800 dark:text-teal-300">
                <ClipboardPaste className="w-4 h-4 text-teal-600" />
                <span>Borçlu Bilgilerini Buraya Yapıştırın (Akıllı Ayrıştırma)</span>
              </label>

              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => parsePastedContent(pasteText)}
                  className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                  title="Yapıştırılan metni yüksek hassasiyetle analiz ederek form alanlarına dağıtır ve kelimeleri tamamlar"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>⚡ Akıllı Ayrıştır ve Forma Aktar</span>
                </button>
                <button
                  type="button"
                  onClick={autoCompleteAllFields}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                  title="Mevcut formdaki eksik kelimeleri, ilçe-il eşleşmesini, Vergi Dairesi ekini ve SGK sicil bloklarını otomatik tamamlar"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>✨ Kelimeleri Tamamla</span>
                </button>
                <button
                  type="button"
                  onClick={applyMinimumPesinat}
                  className="px-2.5 py-1.5 rounded-lg border border-amber-500/50 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                  title="SGK 6183/48 mevzuatı uyarınca borcun %10'u asgari peşinatı hesaplar"
                >
                  <Coins className="w-3 h-3 text-amber-600" />
                  <span>%10 Peşinat</span>
                </button>
                <button
                  type="button"
                  onClick={copyWorkAddressToHome}
                  className="px-2.5 py-1.5 rounded-lg border border-indigo-500/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/10 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                  title="İşyeri adresini ikametgâh adresine kopyalayarak tamamlar"
                >
                  <MapPin className="w-3 h-3 text-indigo-600" />
                  <span>İkametgâha Aktar</span>
                </button>
                <button
                  type="button"
                  onClick={applyTodayDate}
                  className="px-2.5 py-1.5 rounded-lg border border-sky-500/40 text-sky-700 dark:text-sky-300 hover:bg-sky-500/10 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                  title="Bugünün resmi başvuru tarihini forma yazar"
                >
                  <Calendar className="w-3 h-3 text-sky-600" />
                  <span>Bugün</span>
                </button>
                <button
                  type="button"
                  onClick={loadSampleData}
                  className="px-2.5 py-1.5 rounded-lg border border-teal-500/40 text-teal-700 dark:text-teal-300 hover:bg-teal-500/10 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Örnek Yükle</span>
                </button>
                <button
                  type="button"
                  onClick={clearForm}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-500/10 text-slate-600 dark:text-slate-300 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Temizle</span>
                </button>
              </div>
            </div>

            <textarea
              value={pasteText}
              onChange={(e) => handlePasteChange(e.target.value)}
              placeholder="e-Devlet, MOSİP, Excel, ödeme emri, SGK dönem dökümü, dilekçe veya e-postadan kopyaladığınız metni buraya yapıştırın. TCKN/VKN, Borç Tutarı, Taksit Sayısı, Peşinat, Sicil No, Ünvan, Vergi Dairesi, Adres, Telefon vb. anında yüksek hassasiyetle ayrıştırılarak ve kelimeleri tamamlanarak resmî formlara doldurulur..."
              rows={3}
              className="w-full p-2.5 rounded-xl border font-mono text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              style={{
                backgroundColor: 'var(--bg-input)',
                borderColor: 'var(--border-primary)',
              }}
            />

            {/* Manuel Düzenlenebilir Ana Değerler Çubuğu */}
            <div className="p-3 rounded-xl border space-y-2 bg-slate-500/5" style={{ borderColor: 'var(--border-primary)' }}>
              <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Manuel Parametre Değiştirme (Hücrelere Doğrudan Yazabilirsiniz):</span>
                </span>
                <span className="text-[11px] text-teal-600 font-semibold">
                  Değerler aşağıdaki resmî formlara ve hesaplama motoruna anında yansır
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-1">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">İl Müdürlüğü:</span>
                  <input
                    type="text"
                    value={borclu.ilMudurlugu}
                    onChange={(e) => setBorclu({ ...borclu, ilMudurlugu: e.target.value })}
                    className="w-full px-2 py-1 rounded border font-bold text-xs uppercase"
                    style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-primary)' }}
                    placeholder="Örn: ORDU"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">Sosyal Güvenlik Merkezi:</span>
                  <input
                    type="text"
                    value={borclu.sgkMerkezi}
                    onChange={(e) => setBorclu({ ...borclu, sgkMerkezi: e.target.value })}
                    className="w-full px-2 py-1 rounded border font-bold text-xs uppercase"
                    style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-primary)' }}
                    placeholder="Örn: ALTINORDU"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">Borç Tutarı (TL):</span>
                  <input
                    type="text"
                    value={customBorc}
                    onChange={(e) => handleCustomBorcChange(e.target.value)}
                    onBlur={handleCustomBorcBlur}
                    className="w-full px-2 py-1 rounded border font-mono font-bold text-xs"
                    style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-primary)' }}
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">Taksit Sayısı (Ay):</span>
                  <input
                    type="text"
                    value={customTaksit}
                    onChange={(e) => handleCustomTaksitChange(e.target.value)}
                    onBlur={handleCustomTaksitBlur}
                    className="w-full px-2 py-1 rounded border font-mono font-bold text-xs"
                    style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-primary)' }}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-[10px] text-slate-500 font-bold">Peşinat Tutarı:</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={setPesinatToTaksit}
                        className={`text-[9px] px-1.5 py-0.5 rounded font-black cursor-pointer transition-all ${
                          pesinatMode === 'taksiteGore'
                            ? 'bg-teal-600 text-white shadow-xs'
                            : 'bg-teal-500/10 text-teal-700 dark:text-teal-300 hover:bg-teal-500/20'
                        }`}
                        title="Taksit sayısına göre otomatik ilk taksit (Borç / Taksit Sayısı)"
                      >
                        ⚡ Taksite Göre
                      </button>
                      <button
                        type="button"
                        onClick={setPesinatToYuzdeOn}
                        className={`text-[9px] px-1 py-0.5 rounded font-bold cursor-pointer transition-all ${
                          pesinatMode === 'yuzdeOn'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20'
                        }`}
                        title="Borcun %10'u asgari peşinata eşitle"
                      >
                        %10
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={customPesinat}
                    onChange={(e) => handleCustomPesinatChange(e.target.value)}
                    onBlur={handleCustomPesinatBlur}
                    className="w-full px-2 py-1 rounded border font-mono font-bold text-xs text-amber-700 dark:text-amber-400"
                    style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-primary)' }}
                  />
                  <div className="flex items-center justify-between text-[9px] mt-0.5 px-0.5">
                    <span className={
                      pesinatMode === 'taksiteGore' ? 'text-teal-600 dark:text-teal-400 font-bold' :
                      pesinatMode === 'yuzdeOn' ? 'text-amber-600 dark:text-amber-400 font-bold' :
                      'text-blue-600 dark:text-blue-400 font-bold'
                    }>
                      {pesinatMode === 'taksiteGore' ? `⚡ Otomatik (1/${customTaksit} Taksit)` :
                       pesinatMode === 'yuzdeOn' ? '⚡ %10 Asgari' :
                       '✍️ Manuel Giriş'}
                    </span>
                    <span className="text-slate-500 font-mono">
                      %{parseTL(customBorc) > 0 ? ((parseTL(customPesinat) / parseTL(customBorc)) * 100).toFixed(1) : '10.0'}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">İşlem / Başvuru Tarihi:</span>
                  <input
                    type="text"
                    value={customTarih || getIslemTarihi()}
                    onChange={(e) => setCustomTarih(e.target.value)}
                    className="w-full px-2 py-1 rounded border font-bold text-xs"
                    style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-primary)' }}
                    placeholder={getIslemTarihi()}
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">Likidite Oranı (Rasyo):</span>
                  <input
                    type="text"
                    value={customLikidite}
                    onChange={(e) => setCustomLikidite(e.target.value)}
                    className="w-full px-2 py-1 rounded border font-mono font-bold text-xs text-teal-700 dark:text-teal-400"
                    style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-primary)' }}
                  />
                </div>
              </div>

              {/* Canlı Tecil İşlem Sonucu & Hesaplama Özeti */}
              <div
                className="mt-2 pt-2 border-t flex flex-wrap items-center justify-between gap-2.5 p-2.5 rounded-xl border"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-primary)',
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-teal-600 text-white shadow-xs">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <span>Canlı Tecil İşlem Sonucu (6183/48):</span>
                      <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200 font-mono font-bold">
                        %{faizOrani} Faiz
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Hücreler değiştikçe taksit planı burada anında hesaplanır ve aşağıdaki formlara işlenir.
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* Kalan Tecil Tutarı */}
                  <div className="bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs">
                    <div className="text-[9.5px] text-slate-500 font-bold uppercase tracking-wider">Kalan Tecil Borcu</div>
                    <div className="font-mono font-black text-slate-800 dark:text-slate-200 text-xs">
                      {formatTL(liveCalculation.kalanBorc)} ₺
                    </div>
                  </div>

                  {/* Aylık Taksit Tutarı */}
                  <div className="bg-teal-50 dark:bg-teal-950/40 px-3 py-1 rounded-lg border border-teal-300 dark:border-teal-700 shadow-xs">
                    <div className="text-[9.5px] text-teal-700 dark:text-teal-300 font-bold uppercase tracking-wider">
                      Aylık Sabit Taksit ({customTaksit} Ay)
                    </div>
                    <div className="font-mono font-black text-teal-900 dark:text-teal-100 text-sm">
                      {formatTL(liveCalculation.aylikSabitTaksit)} ₺ / ay
                    </div>
                  </div>

                  {/* Tecil Faizi */}
                  <div className="bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs">
                    <div className="text-[9.5px] text-slate-500 font-bold uppercase tracking-wider">Toplam Tecil Faizi</div>
                    <div className="font-mono font-bold text-slate-700 dark:text-slate-300 text-xs">
                      {formatTL(liveCalculation.toplamFaiz)} ₺
                    </div>
                  </div>

                  {/* Genel Toplam */}
                  <div className="bg-indigo-50 dark:bg-indigo-950/30 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800 shadow-xs">
                    <div className="text-[9.5px] text-indigo-700 dark:text-indigo-300 font-bold uppercase tracking-wider">Genel Toplam (Peşinat Dahil)</div>
                    <div className="font-mono font-black text-indigo-900 dark:text-indigo-100 text-xs">
                      {formatTL(liveCalculation.toplamOdeme)} ₺
                    </div>
                  </div>

                  {/* Peşinat Uygunluk Durumu */}
                  <div className="flex items-center">
                    {parseTL(customPesinat) >= (parseTL(customBorc) * 0.10 - 0.05) ? (
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[10.5px] font-bold shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Asgari %10 Şartı Sağlandı</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-[10.5px] font-bold shadow-xs" title="6183/48 uyarınca peşinat en az borcun %10'u olmalıdır">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Asgari %10'un Altında ({formatTL(parseTL(customBorc) * 0.10)} ₺ olmalı)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 2. FORM VE SAYFA SEÇİM KONTROLLERİ                               */}
          {/* ============================================================== */}
          <div className="no-print flex items-center justify-between flex-wrap gap-3 border-b pb-3">
            {/* Form Seçimi (Yalnızca Ek-1 ve Ek-1/b) */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setActiveForm('ek1')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                  activeForm === 'ek1'
                    ? 'bg-teal-600 text-white shadow-sm ring-2 ring-teal-500/20'
                    : 'bg-slate-500/10 hover:bg-slate-500/20 text-slate-600 dark:text-slate-300'
                }`}
              >
                <span>📄 Ek-1</span>
                <span>Tecil Talep Formu</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveForm('ek1b')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                  activeForm === 'ek1b'
                    ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/20'
                    : 'bg-slate-500/10 hover:bg-slate-500/20 text-slate-600 dark:text-slate-300'
                }`}
              >
                <span>📝 Ek-1/b</span>
                <span>Mali Durum Bildirim Formu</span>
              </button>
            </div>

            {/* Sayfa Seçimi: Ön / Arka / Arkalı Önlü */}
            <div className="flex items-center gap-1 bg-slate-500/10 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActivePage('sayfa1')}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors ${
                  activePage === 'sayfa1' ? 'bg-white dark:bg-slate-800 text-teal-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Ön Sayfa (1/2)
              </button>
              <button
                type="button"
                onClick={() => setActivePage('sayfa2')}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors ${
                  activePage === 'sayfa2' ? 'bg-white dark:bg-slate-800 text-teal-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Arka Sayfa (2/2)
              </button>
              <button
                type="button"
                onClick={() => setActivePage('hepsi')}
                className={`px-3 py-1 rounded-lg font-black text-xs transition-colors ${
                  activePage === 'hepsi' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📑 Arkalı Önlü (1 + 2)
              </button>
            </div>

            {/* Dışa Aktarma Butonları */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={copyFormText}
                className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-500/10 font-bold flex items-center gap-1 transition-colors"
                title="Form metnini kopyala"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
              </button>

              <button
                type="button"
                onClick={downloadWordDoc}
                className="px-2.5 py-1.5 rounded-xl border border-indigo-400 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/10 font-bold flex items-center gap-1 transition-colors"
                title="Word formatında indir"
              >
                <Download className="w-3.5 h-3.5 text-indigo-600" />
                <span>Word (.doc)</span>
              </button>

              {/* Doğrudan A4 PDF İndir */}
              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={isGeneratingPdf}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center gap-1 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                title="Çift taraflı A4 PDF dosyasını tek tıkla doğrudan bilgisayarınıza indirir"
              >
                {isGeneratingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                <span>{isGeneratingPdf ? 'PDF Hazırlanıyor...' : '📥 PDF İndir'}</span>
              </button>

              {/* Yeni Sekmede Yazdır */}
              <button
                type="button"
                onClick={handlePrintNewTab}
                className="px-2.5 py-1.5 rounded-xl border border-teal-500 text-teal-700 dark:text-teal-300 hover:bg-teal-500/10 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                title="Yazdırma ekranı doğrudan açılmazsa yeni sekmede engelsiz yazdırır"
              >
                <ExternalLink className="w-3.5 h-3.5 text-teal-600" />
                <span>🌐 Yeni Sekmede Aç</span>
              </button>

              <button
                type="button"
                onClick={() => handlePrint(true)}
                className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                title="Ek-1 veya Ek-1/b formunun hem ön hem arka sayfasını arkalı önlü yazdırır"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>🖨️ Arkalı Önlü Yazdır</span>
              </button>

              {activePage !== 'hepsi' && (
                <button
                  type="button"
                  onClick={() => handlePrint(false)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-500/10 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  title="Sadece ekranda seçili olan tek sayfayı yazdırır"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Tek Sayfa ({activePage === 'sayfa1' ? '1/2' : '2/2'})</span>
                </button>
              )}
            </div>
          </div>

          {/* ============================================================== */}
          {/* 3. RESMÎ SGK FORM KAĞIDI (Doğrudan Düzenlenebilir A4 Formatı)   */}
          {/* ============================================================== */}
          <div
            id="printable-form-container"
            className="p-6 sm:p-10 rounded-2xl border shadow-md bg-white text-black font-serif leading-normal select-text space-y-8"
            style={{
              fontFamily: "'Times New Roman', Times, serif",
              maxWidth: '820px',
              margin: '0 auto',
            }}
          >
            {/* ============================================================ */}
            {/* FORM 1: EK-1 TECİL TALEP FORMU                               */}
            {/* ============================================================ */}
            {activeForm === 'ek1' && (
              <div className="space-y-6">
                {/* --- EK-1 SAYFA 1 / 2 (ÖN SAYFA) --- */}
                {(activePage === 'sayfa1' || activePage === 'hepsi') && (
                  <div id="form-print-page-1" className="space-y-2 text-[11px] sm:text-[11.5px] leading-normal p-1 sm:p-2 bg-white">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] text-gray-500 font-sans">1/2</span>
                      <span className="font-bold text-xs">Ek-1</span>
                    </div>

                    <div className="text-center font-bold space-y-0.5">
                      <div className="text-[11px] tracking-wide">
                        6183 SAYILI KANUNUN 48. MADDESİ KAPSAMINDA
                      </div>
                      <div className="text-xs sm:text-[13px] tracking-wide underline">
                        TECİL TALEP FORMU
                      </div>
                    </div>

                    <div className="text-center pt-0.5 space-y-0.5 font-bold text-[11px]">
                      <div>T.C.</div>
                      <div>SOSYAL GÜVENLİK KURUMU BAŞKANLIĞI</div>
                      <div className="flex items-center justify-center gap-1.5">
                        <input
                          type="text"
                          value={borclu.ilMudurlugu}
                          onChange={(e) => {
                            const val = e.target.value;
                            const isOrdu = val.trim().toLocaleUpperCase('tr-TR') === 'ORDU';
                            setBorclu({
                              ...borclu,
                              ilMudurlugu: val,
                              ...(isOrdu ? { sgkMerkezi: 'ALTINORDU' } : {})
                            });
                          }}
                          className="border-b border-black text-center font-bold min-w-[130px] px-1 focus:outline-none focus:bg-amber-50 uppercase print:border-b print:border-black"
                          placeholder="........................."
                          title="Sosyal Güvenlik İl Müdürlüğü (Örn: ORDU)"
                        />
                        <span>Sosyal Güvenlik İl Müdürlüğüne</span>
                      </div>
                      <div className="flex items-center justify-center gap-1.5">
                        <input
                          type="text"
                          value={borclu.sgkMerkezi}
                          onChange={(e) => setBorclu({ ...borclu, sgkMerkezi: e.target.value })}
                          className="border-b border-black text-center font-bold min-w-[130px] px-1 focus:outline-none focus:bg-amber-50 uppercase print:border-b print:border-black"
                          placeholder="........................."
                          title="Sosyal Güvenlik Merkezi (Örn: ALTINORDU)"
                        />
                        <span>Sosyal Güvenlik Merkezine</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1 text-justify leading-snug">
                      <p>
                        Müdürlüğünüze/ Merkezinize{' '}
                        <input
                          type="text"
                          value={customTarih || getIslemTarihi()}
                          onChange={(e) => setCustomTarih(e.target.value)}
                          className="border-b border-black font-bold text-center w-20 focus:outline-none focus:bg-amber-50"
                          placeholder={getIslemTarihi()}
                        />{' '}
                        tarihi itibarıyla toplam{' '}
                        <input
                          type="text"
                          value={customBorc}
                          onChange={(e) => handleCustomBorcChange(e.target.value)}
                          onBlur={handleCustomBorcBlur}
                          className="border-b border-black font-bold font-mono text-[12px] text-center w-36 focus:outline-none focus:bg-amber-50"
                          placeholder="....................."
                        />{' '}
                        TL borcum bulunmaktadır.
                      </p>

                      <p>
                        Mali durumumun söz konusu borcu defaten ödemeye uygun olmaması nedeniyle bu borcumun 6183 sayılı
                        Kanunun 48’inci maddesi kapsamında taksitler halinde ödenmek üzere{' '}
                        <input
                          type="text"
                          value={customTaksit}
                          onChange={(e) => handleCustomTaksitChange(e.target.value)}
                          onBlur={handleCustomTaksitBlur}
                          className="border-b border-black font-bold font-mono text-center w-10 focus:outline-none focus:bg-amber-50"
                          placeholder="..."
                        />{' '}
                        ay süre ile ödeme planına bağlanmasını talep ediyorum.
                      </p>

                      <p>
                        <input
                          type="text"
                          value={customTarih || getIslemTarihi()}
                          onChange={(e) => setCustomTarih(e.target.value)}
                          className="border-b border-black font-bold text-center w-20 focus:outline-none focus:bg-amber-50"
                          placeholder={getIslemTarihi()}
                        />{' '}
                        tarihinde ilk taksit (peşinat) olarak{' '}
                        <input
                          type="text"
                          value={customPesinat}
                          onChange={(e) => handleCustomPesinatChange(e.target.value)}
                          onBlur={handleCustomPesinatBlur}
                          className="border-b border-black font-bold font-mono text-[12px] text-center w-32 focus:outline-none focus:bg-amber-50"
                          placeholder="....................."
                        />{' '}
                        TL’yi bankaya ödemiş bulunmaktayım.
                      </p>

                      <p>
                        Tecil şartlarının ihlal edilmesi halinde gösterdiğim teminatın nakde çevrilerek tecile konu bakiye
                        borcumun tahsilini kabul ediyorum.
                      </p>

                      <p>Tecil talebimin değerlendirilerek gerekli işlemlerin yapılmasını arz ederim.</p>
                    </div>

                    {/* İmza Bloğu (Kullanıcı kesin kuralı: Otomatik hiçbir şey yazılmayacak, boş bırakılacak, gerekirse manuel yazılacak) */}
                    <div className="flex justify-end pt-1 pr-4">
                      <div className="text-center space-y-0.5 w-56">
                        <input
                          type="text"
                          value={imzaTarih}
                          onChange={(e) => setImzaTarih(e.target.value)}
                          className="text-center border-b border-transparent hover:border-black focus:border-black focus:outline-none w-full block text-[11px]"
                          placeholder=""
                        />
                        <input
                          type="text"
                          value={imzaIsim}
                          onChange={(e) => setImzaIsim(e.target.value)}
                          className="font-bold text-center border-b border-transparent hover:border-black focus:border-black focus:outline-none w-full block text-xs"
                          placeholder=""
                        />
                        <div className="text-[10px] text-gray-500">İmza, Kaşe</div>
                        <div className="h-6"></div>
                      </div>
                    </div>

                    {/* Ekler Listesi (Kompakt yatay satırlar) */}
                    <div className="text-[10px] leading-tight pt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 border-t pt-1">
                      <span className="font-bold">EKLER:</span>
                      <span>1- Makbuz</span>
                      <span>2- Mali durum bildirim formu / Çok zor durum raporu</span>
                      <span>3- Bilanço</span>
                      <span>4- Teminatın değer tespit raporu</span>
                    </div>

                    {/* Borçluya Ait Bilgiler Tablosu */}
                    <div className="pt-1">
                      <table className="w-full border-collapse border border-black text-[10.5px] font-sans table-fixed">
                        <colgroup>
                          <col className="w-[34%]" />
                          <col className="w-[66%]" />
                        </colgroup>
                        <thead>
                          <tr>
                            <th
                              colSpan={2}
                              className="border border-black p-0.5 text-center font-bold bg-gray-100 uppercase tracking-wider text-[10.5px]"
                            >
                              BORÇLUYA AİT BİLGİLER
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-black px-1.5 py-0.5 font-bold">TCK No / Vergi Kimlik No</td>
                            <td className="border border-black p-0">
                              <input
                                type="text"
                                value={borclu.tcknVkn}
                                onChange={(e) => setBorclu({ ...borclu, tcknVkn: e.target.value })}
                                className="w-full px-1 py-0.5 font-mono focus:bg-amber-50 focus:outline-none text-[10.5px]"
                                placeholder="10 veya 11 haneli numara"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-black px-1.5 py-0.5 font-bold">Adı Soyadı / Ünvanı</td>
                            <td className="border border-black p-0">
                              <input
                                type="text"
                                value={borclu.unvan}
                                onChange={(e) => setBorclu({ ...borclu, unvan: e.target.value })}
                                className="w-full px-1 py-0.5 font-bold focus:bg-amber-50 focus:outline-none text-[10.5px]"
                                placeholder="Borçlu Kişi veya Şirket Ünvanı"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-black px-1.5 py-0.5 font-bold">İşyeri Sicil Numarası</td>
                            <td className="border border-black p-0">
                              <input
                                type="text"
                                value={extractSicilSiraNo(borclu.sigortaNo)}
                                onChange={(e) => setBorclu({ ...borclu, sigortaNo: extractSicilSiraNo(e.target.value) })}
                                onBlur={(e) => setBorclu({ ...borclu, sigortaNo: extractSicilSiraNo(e.target.value) })}
                                className="w-full px-1 py-0.5 font-mono text-left focus:bg-amber-50 focus:outline-none text-[10.5px]"
                                placeholder="İşyeri sıra / sicil no..."
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-black px-1.5 py-0.5 font-bold">Vergi Dairesi</td>
                            <td className="border border-black p-0">
                              <input
                                type="text"
                                value={borclu.vergiDairesi}
                                onChange={(e) => setBorclu({ ...borclu, vergiDairesi: e.target.value })}
                                className="w-full px-1 py-0.5 focus:bg-amber-50 focus:outline-none text-[10.5px]"
                                placeholder="Vergi Dairesi adı"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-black px-1.5 py-0.5 font-bold">Ticaret Sicil No</td>
                            <td className="border border-black p-0">
                              <input
                                type="text"
                                value={borclu.ticaretSicilNo}
                                onChange={(e) => setBorclu({ ...borclu, ticaretSicilNo: e.target.value })}
                                className="w-full px-1 py-0.5 font-mono focus:bg-amber-50 focus:outline-none text-[10.5px]"
                                placeholder="Ticaret sicil numarası"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-black px-1.5 py-0.5 font-bold">İşyeri Adresi</td>
                            <td className="border border-black p-0">
                              <input
                                type="text"
                                value={borclu.isyeriAdresi}
                                onChange={(e) => setBorclu({ ...borclu, isyeriAdresi: e.target.value })}
                                className="w-full px-1 py-0.5 focus:bg-amber-50 focus:outline-none text-[10.5px]"
                                placeholder="İşyeri tam adresi"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-black px-1.5 py-0.5 font-bold">İşyeri Telefon No, Faks No</td>
                            <td className="border border-black p-0">
                              <div className="flex gap-2 w-full">
                                <input
                                  type="text"
                                  value={borclu.telefon}
                                  onChange={(e) => setBorclu({ ...borclu, telefon: e.target.value })}
                                  className="w-1/2 px-1 py-0.5 focus:bg-amber-50 focus:outline-none text-[10.5px]"
                                  placeholder="Telefon"
                                />
                                <input
                                  type="text"
                                  value={borclu.faks}
                                  onChange={(e) => setBorclu({ ...borclu, faks: e.target.value })}
                                  className="w-1/2 px-1 py-0.5 focus:bg-amber-50 focus:outline-none text-[10.5px]"
                                  placeholder="Faks"
                                />
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-black px-1.5 py-0.5 font-bold">E-posta Adresi</td>
                            <td className="border border-black p-0">
                              <input
                                type="text"
                                value={borclu.eposta}
                                onChange={(e) => setBorclu({ ...borclu, eposta: e.target.value })}
                                className="w-full px-1 py-0.5 focus:bg-amber-50 focus:outline-none text-[10.5px]"
                                placeholder="E-posta adresi"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-black px-1.5 py-0.5 font-bold">İkametgâh Adresi</td>
                            <td className="border border-black p-0">
                              <input
                                type="text"
                                value={borclu.ikametgahAdresi}
                                onChange={(e) => setBorclu({ ...borclu, ikametgahAdresi: e.target.value })}
                                className="w-full px-1 py-0.5 focus:bg-amber-50 focus:outline-none text-[10.5px]"
                                placeholder="İkametgâh adresi"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-black px-1.5 py-0.5 font-bold">GSM Telefon No</td>
                            <td className="border border-black p-0">
                              <input
                                type="text"
                                value={borclu.gsm}
                                onChange={(e) => setBorclu({ ...borclu, gsm: e.target.value })}
                                className="w-full px-1.5 py-0.5 font-mono border-0 border-none outline-none ring-0 focus:ring-0 focus:outline-none bg-transparent shadow-none text-[10.5px]"
                                placeholder="05xx xxx xx xx"
                              />
                            </td>
                          </tr>
                          {/* GSM Telefon No Altındaki Kullanıcı 1. Satırı (Kesinlikle 'Not' yazılmaz, çerçevesiz) */}
                          <tr>
                            {borclu.ekSatirBirlestir !== false ? (
                              <td colSpan={2} className="border border-black p-0 relative group">
                                <div className="flex items-center w-full">
                                  <input
                                    type="text"
                                    id="ek-satir-1-input"
                                    value={borclu.ekSatir || ''}
                                    onChange={(e) => setBorclu({ ...borclu, ekSatir: e.target.value })}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        document.getElementById('ek-satir-2-input')?.focus();
                                      }
                                    }}
                                    className="w-full px-1.5 py-0.5 border-0 border-none outline-none ring-0 focus:ring-0 focus:outline-none bg-transparent shadow-none text-[10.5px]"
                                    placeholder=""
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setBorclu({ ...borclu, ekSatirBirlestir: false })}
                                    className="print:hidden hidden group-hover:inline-flex items-center px-1.5 py-0.5 text-[9px] text-gray-400 hover:text-blue-700 bg-gray-50 hover:bg-blue-50 border-l border-gray-200 shrink-0 select-none cursor-pointer"
                                    title="Sütunlara böl"
                                  >
                                    ⊞ Böl
                                  </button>
                                </div>
                              </td>
                            ) : (
                              <>
                                <td className="border border-black p-0">
                                  <input
                                    type="text"
                                    value={borclu.ekSatirBaslik || ''}
                                    onChange={(e) => setBorclu({ ...borclu, ekSatirBaslik: e.target.value })}
                                    className="w-full px-1.5 py-0.5 font-bold border-0 border-none outline-none ring-0 focus:ring-0 focus:outline-none bg-transparent shadow-none text-[10.5px]"
                                    placeholder=""
                                  />
                                </td>
                                <td className="border border-black p-0 relative group">
                                  <div className="flex items-center w-full">
                                    <input
                                      type="text"
                                      id="ek-satir-1-input"
                                      value={borclu.ekSatir || ''}
                                      onChange={(e) => setBorclu({ ...borclu, ekSatir: e.target.value })}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          document.getElementById('ek-satir-2-input')?.focus();
                                        }
                                      }}
                                      className="w-full px-1 py-0.5 border-0 border-none outline-none ring-0 focus:ring-0 focus:outline-none bg-transparent shadow-none text-[10.5px]"
                                      placeholder=""
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setBorclu({ ...borclu, ekSatirBirlestir: true })}
                                      className="print:hidden hidden group-hover:inline-flex items-center px-1.5 py-0.5 text-[9px] text-gray-400 hover:text-blue-700 bg-gray-50 hover:bg-blue-50 border-l border-gray-200 shrink-0 select-none cursor-pointer"
                                      title="Tek satır olarak birleştir"
                                    >
                                      ⊟ Birleştir
                                    </button>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                          {/* GSM Telefon No Altındaki Kullanıcı 2. Satırı (Kesinlikle 'Not' yazılmaz, çerçevesiz) */}
                          <tr>
                            {borclu.ekSatirBirlestir2 !== false ? (
                              <td colSpan={2} className="border border-black p-0 relative group">
                                <div className="flex items-center w-full">
                                  <input
                                    type="text"
                                    id="ek-satir-2-input"
                                    value={borclu.ekSatir2 || ''}
                                    onChange={(e) => setBorclu({ ...borclu, ekSatir2: e.target.value })}
                                    className="w-full px-1.5 py-0.5 border-0 border-none outline-none ring-0 focus:ring-0 focus:outline-none bg-transparent shadow-none text-[10.5px]"
                                    placeholder=""
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setBorclu({ ...borclu, ekSatirBirlestir2: false })}
                                    className="print:hidden hidden group-hover:inline-flex items-center px-1.5 py-0.5 text-[9px] text-gray-400 hover:text-blue-700 bg-gray-50 hover:bg-blue-50 border-l border-gray-200 shrink-0 select-none cursor-pointer"
                                    title="Sütunlara böl"
                                  >
                                    ⊞ Böl
                                  </button>
                                </div>
                              </td>
                            ) : (
                              <>
                                <td className="border border-black p-0">
                                  <input
                                    type="text"
                                    value={borclu.ekSatirBaslik2 || ''}
                                    onChange={(e) => setBorclu({ ...borclu, ekSatirBaslik2: e.target.value })}
                                    className="w-full px-1.5 py-0.5 font-bold border-0 border-none outline-none ring-0 focus:ring-0 focus:outline-none bg-transparent shadow-none text-[10.5px]"
                                    placeholder=""
                                  />
                                </td>
                                <td className="border border-black p-0 relative group">
                                  <div className="flex items-center w-full">
                                    <input
                                      type="text"
                                      id="ek-satir-2-input"
                                      value={borclu.ekSatir2 || ''}
                                      onChange={(e) => setBorclu({ ...borclu, ekSatir2: e.target.value })}
                                      className="w-full px-1 py-0.5 border-0 border-none outline-none ring-0 focus:ring-0 focus:outline-none bg-transparent shadow-none text-[10.5px]"
                                      placeholder=""
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setBorclu({ ...borclu, ekSatirBirlestir2: true })}
                                      className="print:hidden hidden group-hover:inline-flex items-center px-1.5 py-0.5 text-[9px] text-gray-400 hover:text-blue-700 bg-gray-50 hover:bg-blue-50 border-l border-gray-200 shrink-0 select-none cursor-pointer"
                                      title="Tek satır olarak birleştir"
                                    >
                                      ⊟ Birleştir
                                    </button>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* --- EK-1 SAYFA 2 / 2 (ARKA SAYFA) --- */}
                {(activePage === 'sayfa2' || activePage === 'hepsi') && (
                  <div id="form-print-page-2" className="space-y-2 text-[10.5px] sm:text-[11px] leading-snug pt-3 sm:pt-4 border-t-2 border-dashed border-gray-300 page-break-before p-1 sm:p-2 bg-white">
                    <div className="flex justify-between items-start font-bold">
                      <span className="text-gray-500 font-sans text-[10px]">2/2</span>
                      <span className="text-xs">Ek-1 Arka Sayfa</span>
                    </div>

                    <div className="text-center font-bold text-xs sm:text-[12px] tracking-wide border-b pb-0.5">
                      ÇOK ZOR DURUM VE TEMİNAT DEĞER TESPİT ESASLARI
                    </div>

                    <div className="space-y-1.5 text-justify">
                      <div className="font-bold text-[11px]">1.1. Borç türü bazında belirlenen limit üzerinde borcu olanlar için çok zor durum tespiti</div>
                      <p>
                        Tecil talebinde bulunan borçluların çok zor durumda olup olmadıkları, aşağıda belirtilen likidite oranlarına göre tespit edilecektir:
                      </p>
                      <ul className="list-disc pl-4 space-y-0.5">
                        <li>
                          <strong>Bilanço esasına göre:</strong> Likidite oranı; <em>“Dönen Varlıklar – Stoklar / Kısa Vadeli Yabancı Kaynaklar”</em> formülüne göre hesaplanacaktır.
                        </li>
                        <li>
                          <strong>İşletme hesabı esasına göre:</strong> Likidite oranı; <em>“Kasa + Banka + Kısa Vadeli Alacaklar / Kısa Vadeli Borçlar”</em> formülüne göre hesaplanacaktır.
                        </li>
                      </ul>
                      <p>
                        Çok zor durum tespiti, 3568 sayılı Kanuna göre ruhsat almış serbest muhasebeci mali müşavirler veya yeminli mali müşavirler tarafından tespit edilerek çok zor durum raporu ile belgelendirilecektir.
                      </p>

                      <div className="font-bold pt-0.5 text-[11px]">1.2. Borç türü bazında belirlenen limiti aşmayan borcu olanlar için çok zor durum tespiti</div>
                      <p>
                        Borç türü bazında belirlenen limiti aşmayan borcu olanlar için çok zor durum tespiti, <strong>mali durum bildirim formu (Ek-1/b)</strong> ile beyan edecekleri bilgiler esas alınarak Kurum tarafından yapılacaktır.
                      </p>

                      <div className="font-bold pt-0.5 text-[11px]">1.3. Likidite oranı ve tecil süresi</div>
                      <p>
                        Likidite oranının; <strong>"1,00" ve altında</strong> olması halinde çok zor durum kabul edilir, <strong>"1,01" ve üzerinde</strong> olması halinde tecil talebi reddedilir.
                      </p>
                      <p>
                        Likidite oranının <strong>"0,51" ila "1,00"</strong> aralığında olması halinde <strong>azami 36 aya kadar</strong>, <strong>"0,50" ve altında</strong> olması durumunda ise <strong>azami 72 aya kadar</strong> eşit taksitler halinde tecil yapılabilir. Likidite oranında virgülden sonraki ilk iki rakam dikkate alınır, yuvarlama yapılmaz.
                      </p>

                      <div className="font-bold pt-1 border-t text-[11px]">
                        Tecil işlemlerinde teminat olarak gösterilen taşınır ve taşınmazların değer tespitlerinin yapılması
                      </div>
                      <p><strong>A)</strong> Taşınmaz değer tespitlerinde SPK lisanslı değerleme uzmanları, TMMOB, bankalar ve sigorta şirketleri veya mahkemelerce düzenlenen raporlar esas alınır.</p>
                      <p><strong>B)</strong> Raporu düzenleyen kişilerin yetki ve ruhsat belgeleri rapora eklenmelidir.</p>
                      <p><strong>C)</strong> Taşınır mallarda değer tespiti sosyal güvenlik icra memuru tarafından yapılır.</p>
                      <p><strong>D)</strong> Teminat olarak üzerinde takyidat bulunmayan ve satışı kolay mallar tercih edilir.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ============================================================ */}
            {/* FORM 2: EK-1/B MALİ DURUM BİLDİRİM FORMU                     */}
            {/* ============================================================ */}
            {activeForm === 'ek1b' && (
              <div className="space-y-6">
                {/* --- EK-1/B SAYFA 1 / 2 (ÖN SAYFA) --- */}
                {(activePage === 'sayfa1' || activePage === 'hepsi') && (
                  <div id="form-print-page-1" className="space-y-2 text-[11px] sm:text-[11.5px] leading-normal p-1 sm:p-2 bg-white">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] text-gray-500 font-sans">1/2</span>
                      <span className="font-bold text-xs">Ek-1/b</span>
                    </div>

                    <div className="text-center font-bold space-y-0.5">
                      <div className="text-xs sm:text-[13px] tracking-wide underline">
                        MALİ DURUM BİLDİRİM FORMU
                      </div>
                      <div className="text-[10px] font-normal italic">
                        (Borçlu Tarafından Doldurulacaktır - 900.000 TL ve Altındaki Borçlar İçin)
                      </div>
                    </div>

                    <div className="text-center pt-0.5 space-y-0.5 font-bold text-[11px]">
                      <div>T.C.</div>
                      <div>SOSYAL GÜVENLİK KURUMU BAŞKANLIĞI</div>
                      <div className="flex items-center justify-center gap-1.5">
                        <input
                          type="text"
                          value={borclu.ilMudurlugu}
                          onChange={(e) => {
                            const val = e.target.value;
                            const isOrdu = val.trim().toLocaleUpperCase('tr-TR') === 'ORDU';
                            setBorclu({
                              ...borclu,
                              ilMudurlugu: val,
                              ...(isOrdu ? { sgkMerkezi: 'ALTINORDU' } : {})
                            });
                          }}
                          className="border-b border-black text-center font-bold min-w-[130px] px-1 focus:outline-none focus:bg-amber-50 uppercase print:border-b print:border-black"
                          placeholder="........................."
                          title="Sosyal Güvenlik İl Müdürlüğü (Örn: ORDU)"
                        />
                        <span>Sosyal Güvenlik İl Müdürlüğüne</span>
                      </div>
                      <div className="flex items-center justify-center gap-1.5">
                        <input
                          type="text"
                          value={borclu.sgkMerkezi}
                          onChange={(e) => setBorclu({ ...borclu, sgkMerkezi: e.target.value })}
                          className="border-b border-black text-center font-bold min-w-[130px] px-1 focus:outline-none focus:bg-amber-50 uppercase print:border-b print:border-black"
                          placeholder="........................."
                          title="Sosyal Güvenlik Merkezi (Örn: ALTINORDU)"
                        />
                        <span>Sosyal Güvenlik Merkezine</span>
                      </div>
                    </div>

                    <div className="space-y-1 pt-1 text-justify leading-snug">
                      <p>
                        Müdürlüğünüzde/ Merkezinizde işlem gören{' '}
                        <input
                          type="text"
                          value={extractSicilSiraNo(borclu.sigortaNo)}
                          onChange={(e) => setBorclu({ ...borclu, sigortaNo: extractSicilSiraNo(e.target.value) })}
                          onBlur={(e) => setBorclu({ ...borclu, sigortaNo: extractSicilSiraNo(e.target.value) })}
                          className="border-b border-black font-bold font-mono text-center w-32 focus:outline-none text-[11px]"
                          placeholder="İşyeri sıra no"
                        />{' '}
                        nolu işyerimden / sigortalılığımdan kaynaklanan ve{' '}
                        <input
                          type="text"
                          value={customTarih || getIslemTarihi()}
                          onChange={(e) => setCustomTarih(e.target.value)}
                          className="border-b border-black font-bold text-center w-20 focus:outline-none text-[11px]"
                          placeholder={getIslemTarihi()}
                        />{' '}
                        tarihi itibarıyla gecikme cezası ve zammı dahil toplam{' '}
                        <input
                          type="text"
                          value={customBorc}
                          onChange={(e) => handleCustomBorcChange(e.target.value)}
                          onBlur={handleCustomBorcBlur}
                          className="border-b border-black font-bold font-mono text-[12px] text-center w-36 focus:outline-none"
                        />{' '}
                        TL tutarındaki borcumun 6183 sayılı Kanunun 48’inci maddesi kapsamında tecili için{' '}
                        <input
                          type="text"
                          value={customTarih || getIslemTarihi()}
                          onChange={(e) => setCustomTarih(e.target.value)}
                          className="border-b border-black font-bold text-center w-20 focus:outline-none text-[11px]"
                          placeholder={getIslemTarihi()}
                        />{' '}
                        tarihi itibarıyla mali durumumun tespitine ilişkin bilgiler aşağıda belirtilmiştir.
                      </p>
                      <p>Beyan ettiğim bilgilerin doğru olduğunu kabul ve taahhüt ederim.</p>
                    </div>

                    {/* İmza Bloğu (Kullanıcı kesin kuralı: Otomatik hiçbir şey yazılmayacak, boş bırakılacak, gerekirse manuel yazılacak) */}
                    <div className="flex justify-end pt-1 pr-4">
                      <div className="text-center space-y-0.5 w-56">
                        <input
                          type="text"
                          value={imzaTarih}
                          onChange={(e) => setImzaTarih(e.target.value)}
                          className="text-center border-b border-transparent hover:border-black focus:border-black focus:outline-none w-full block text-[11px]"
                          placeholder=""
                        />
                        <input
                          type="text"
                          value={imzaIsim}
                          onChange={(e) => setImzaIsim(e.target.value)}
                          className="font-bold text-center border-b border-transparent hover:border-black focus:border-black focus:outline-none w-full block text-xs"
                          placeholder=""
                        />
                        <div className="text-[10px] text-gray-500">İmza, Kaşe</div>
                        <div className="h-6"></div>
                      </div>
                    </div>

                    {/* Borçluya Ait Bilgiler Tablosu */}
                    <div className="pt-1">
                      <table className="w-full border-collapse border border-black text-[10.5px] font-sans table-fixed">
                        <colgroup>
                          <col className="w-[34%]" />
                          <col className="w-[66%]" />
                        </colgroup>
                        <thead>
                          <tr>
                            <th colSpan={2} className="border border-black p-0.5 text-center font-bold bg-gray-100 uppercase text-[10.5px]">
                              BORÇLUYA AİT BİLGİLER
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-black px-1.5 py-0.5 font-bold">TCK No / Vergi Kimlik No</td>
                            <td className="border border-black p-0">
                              <input
                                type="text"
                                value={borclu.tcknVkn}
                                onChange={(e) => setBorclu({ ...borclu, tcknVkn: e.target.value })}
                                className="w-full px-1 py-0.5 font-mono focus:outline-none text-[10.5px]"
                                placeholder="10 veya 11 haneli numara"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-black px-1.5 py-0.5 font-bold">Adı Soyadı / Ünvanı</td>
                            <td className="border border-black p-0">
                              <input
                                type="text"
                                value={borclu.unvan}
                                onChange={(e) => setBorclu({ ...borclu, unvan: e.target.value })}
                                className="w-full px-1 py-0.5 font-bold focus:outline-none text-[10.5px]"
                                placeholder="Borçlu Kişi veya Şirket Ünvanı"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-black px-1.5 py-0.5 font-bold">İşyeri Sicil Numarası</td>
                            <td className="border border-black p-0">
                              <input
                                type="text"
                                value={extractSicilSiraNo(borclu.sigortaNo)}
                                onChange={(e) => setBorclu({ ...borclu, sigortaNo: extractSicilSiraNo(e.target.value) })}
                                onBlur={(e) => setBorclu({ ...borclu, sigortaNo: extractSicilSiraNo(e.target.value) })}
                                className="w-full px-1 py-0.5 font-mono text-left focus:outline-none text-[10.5px]"
                                placeholder="İşyeri sıra no..."
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-black px-1.5 py-0.5 font-bold">Vergi Dairesi</td>
                            <td className="border border-black p-0">
                              <input
                                type="text"
                                value={borclu.vergiDairesi}
                                onChange={(e) => setBorclu({ ...borclu, vergiDairesi: e.target.value })}
                                className="w-full px-1 py-0.5 focus:outline-none text-[10.5px]"
                                placeholder="Vergi Dairesi adı"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-black px-1.5 py-0.5 font-bold">Ticaret Sicil No</td>
                            <td className="border border-black p-0">
                              <input
                                type="text"
                                value={borclu.ticaretSicilNo}
                                onChange={(e) => setBorclu({ ...borclu, ticaretSicilNo: e.target.value })}
                                className="w-full px-1 py-0.5 font-mono focus:outline-none text-[10.5px]"
                                placeholder="Ticaret sicil numarası"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-black px-1.5 py-0.5 font-bold">İşyeri Adresi</td>
                            <td className="border border-black p-0">
                              <input
                                type="text"
                                value={borclu.isyeriAdresi}
                                onChange={(e) => setBorclu({ ...borclu, isyeriAdresi: e.target.value })}
                                className="w-full px-1 py-0.5 focus:outline-none text-[10.5px]"
                                placeholder="İşyeri tam adresi"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-black px-1.5 py-0.5 font-bold">İşyeri Telefon No, Faks No</td>
                            <td className="border border-black p-0">
                              <div className="flex gap-2 w-full">
                                <input
                                  type="text"
                                  value={borclu.telefon}
                                  onChange={(e) => setBorclu({ ...borclu, telefon: e.target.value })}
                                  className="w-1/2 px-1 py-0.5 focus:outline-none text-[10.5px]"
                                  placeholder="Telefon"
                                />
                                <input
                                  type="text"
                                  value={borclu.faks}
                                  onChange={(e) => setBorclu({ ...borclu, faks: e.target.value })}
                                  className="w-1/2 px-1 py-0.5 focus:outline-none text-[10.5px]"
                                  placeholder="Faks"
                                />
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-black px-1.5 py-0.5 font-bold">GSM Telefon No</td>
                            <td className="border border-black p-0">
                              <input
                                type="text"
                                value={borclu.gsm}
                                onChange={(e) => setBorclu({ ...borclu, gsm: e.target.value })}
                                className="w-full px-1.5 py-0.5 font-mono border-0 border-none outline-none ring-0 focus:ring-0 focus:outline-none bg-transparent shadow-none text-[10.5px]"
                                placeholder="05xx xxx xx xx"
                              />
                            </td>
                          </tr>
                          {/* GSM Telefon No Altındaki Kullanıcı 1. Satırı (Kesinlikle 'Not' yazılmaz, çerçevesiz) */}
                          <tr>
                            {borclu.ekSatirBirlestir !== false ? (
                              <td colSpan={2} className="border border-black p-0 relative group">
                                <div className="flex items-center w-full">
                                  <input
                                    type="text"
                                    id="ek1b-satir-1-input"
                                    value={borclu.ekSatir || ''}
                                    onChange={(e) => setBorclu({ ...borclu, ekSatir: e.target.value })}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        document.getElementById('ek1b-satir-2-input')?.focus();
                                      }
                                    }}
                                    className="w-full px-1.5 py-0.5 border-0 border-none outline-none ring-0 focus:ring-0 focus:outline-none bg-transparent shadow-none text-[10.5px]"
                                    placeholder=""
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setBorclu({ ...borclu, ekSatirBirlestir: false })}
                                    className="print:hidden hidden group-hover:inline-flex items-center px-1.5 py-0.5 text-[9px] text-gray-400 hover:text-blue-700 bg-gray-50 hover:bg-blue-50 border-l border-gray-200 shrink-0 select-none cursor-pointer"
                                    title="Sütunlara böl"
                                  >
                                    ⊞ Böl
                                  </button>
                                </div>
                              </td>
                            ) : (
                              <>
                                <td className="border border-black p-0">
                                  <input
                                    type="text"
                                    value={borclu.ekSatirBaslik || ''}
                                    onChange={(e) => setBorclu({ ...borclu, ekSatirBaslik: e.target.value })}
                                    className="w-full px-1.5 py-0.5 font-bold border-0 border-none outline-none ring-0 focus:ring-0 focus:outline-none bg-transparent shadow-none text-[10.5px]"
                                    placeholder=""
                                  />
                                </td>
                                <td className="border border-black p-0 relative group">
                                  <div className="flex items-center w-full">
                                    <input
                                      type="text"
                                      id="ek1b-satir-1-input"
                                      value={borclu.ekSatir || ''}
                                      onChange={(e) => setBorclu({ ...borclu, ekSatir: e.target.value })}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          document.getElementById('ek1b-satir-2-input')?.focus();
                                        }
                                      }}
                                      className="w-full px-1 py-0.5 border-0 border-none outline-none ring-0 focus:ring-0 focus:outline-none bg-transparent shadow-none text-[10.5px]"
                                      placeholder=""
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setBorclu({ ...borclu, ekSatirBirlestir: true })}
                                      className="print:hidden hidden group-hover:inline-flex items-center px-1.5 py-0.5 text-[9px] text-gray-400 hover:text-blue-700 bg-gray-50 hover:bg-blue-50 border-l border-gray-200 shrink-0 select-none cursor-pointer"
                                      title="Tek satır olarak birleştir"
                                    >
                                      ⊟ Birleştir
                                    </button>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                          {/* GSM Telefon No Altındaki Kullanıcı 2. Satırı (Kesinlikle 'Not' yazılmaz, çerçevesiz) */}
                          <tr>
                            {borclu.ekSatirBirlestir2 !== false ? (
                              <td colSpan={2} className="border border-black p-0 relative group">
                                <div className="flex items-center w-full">
                                  <input
                                    type="text"
                                    id="ek1b-satir-2-input"
                                    value={borclu.ekSatir2 || ''}
                                    onChange={(e) => setBorclu({ ...borclu, ekSatir2: e.target.value })}
                                    className="w-full px-1.5 py-0.5 border-0 border-none outline-none ring-0 focus:ring-0 focus:outline-none bg-transparent shadow-none text-[10.5px]"
                                    placeholder=""
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setBorclu({ ...borclu, ekSatirBirlestir2: false })}
                                    className="print:hidden hidden group-hover:inline-flex items-center px-1.5 py-0.5 text-[9px] text-gray-400 hover:text-blue-700 bg-gray-50 hover:bg-blue-50 border-l border-gray-200 shrink-0 select-none cursor-pointer"
                                    title="Sütunlara böl"
                                  >
                                    ⊞ Böl
                                  </button>
                                </div>
                              </td>
                            ) : (
                              <>
                                <td className="border border-black p-0">
                                  <input
                                    type="text"
                                    value={borclu.ekSatirBaslik2 || ''}
                                    onChange={(e) => setBorclu({ ...borclu, ekSatirBaslik2: e.target.value })}
                                    className="w-full px-1.5 py-0.5 font-bold border-0 border-none outline-none ring-0 focus:ring-0 focus:outline-none bg-transparent shadow-none text-[10.5px]"
                                    placeholder=""
                                  />
                                </td>
                                <td className="border border-black p-0 relative group">
                                  <div className="flex items-center w-full">
                                    <input
                                      type="text"
                                      id="ek1b-satir-2-input"
                                      value={borclu.ekSatir2 || ''}
                                      onChange={(e) => setBorclu({ ...borclu, ekSatir2: e.target.value })}
                                      className="w-full px-1 py-0.5 border-0 border-none outline-none ring-0 focus:ring-0 focus:outline-none bg-transparent shadow-none text-[10.5px]"
                                      placeholder=""
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setBorclu({ ...borclu, ekSatirBirlestir2: true })}
                                      className="print:hidden hidden group-hover:inline-flex items-center px-1.5 py-0.5 text-[9px] text-gray-400 hover:text-blue-700 bg-gray-50 hover:bg-blue-50 border-l border-gray-200 shrink-0 select-none cursor-pointer"
                                      title="Tek satır olarak birleştir"
                                    >
                                      ⊟ Birleştir
                                    </button>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                          <tr>
                            <td className="border border-black px-1.5 py-0.5 font-bold">E-posta Adresi</td>
                            <td className="border border-black p-0">
                              <input
                                type="text"
                                value={borclu.eposta}
                                onChange={(e) => setBorclu({ ...borclu, eposta: e.target.value })}
                                className="w-full px-1 py-0.5 focus:outline-none text-[10.5px]"
                                placeholder="E-posta adresi"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-black px-1.5 py-0.5 font-bold">İkametgâh Adresi</td>
                            <td className="border border-black p-0">
                              <input
                                type="text"
                                value={borclu.ikametgahAdresi}
                                onChange={(e) => setBorclu({ ...borclu, ikametgahAdresi: e.target.value })}
                                className="w-full px-1 py-0.5 focus:outline-none text-[10.5px]"
                                placeholder="İkametgâh adresi"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Mali Durumu Gösterir Değerler Tablosu (Toplam) - Boş ve Manuel Giriş */}
                    <div className="pt-1">
                      <div className="font-bold text-[10px] mb-0.5">
                        {customTarih || getIslemTarihi()} Tarihi İtibarıyla Mali Durumu Gösterir Değerler (Toplam):
                      </div>
                      <table className="w-full border-collapse border border-black text-[10.5px] font-mono text-center table-fixed">
                        <colgroup>
                          <col className="w-1/4" />
                          <col className="w-1/4" />
                          <col className="w-1/4" />
                          <col className="w-1/4" />
                        </colgroup>
                        <thead>
                          <tr className="bg-gray-100 font-bold">
                            <th className="border border-black p-0.5">Kasa</th>
                            <th className="border border-black p-0.5">Banka</th>
                            <th className="border border-black p-0.5">Kısa Vadeli Alacaklar</th>
                            <th className="border border-black p-0.5">Kısa Vadeli Borçlar</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-black p-0">
                              <input
                                type="text"
                                value={maliKasa}
                                onChange={(e) => setMaliKasa(e.target.value)}
                                onBlur={() => handleMaliBlur(maliKasa, setMaliKasa)}
                                className="w-full px-1 py-0.5 text-center font-bold font-mono focus:outline-none focus:bg-amber-50 text-[10.5px]"
                                placeholder=""
                              />
                            </td>
                            <td className="border border-black p-0">
                              <input
                                type="text"
                                value={maliBanka}
                                onChange={(e) => setMaliBanka(e.target.value)}
                                onBlur={() => handleMaliBlur(maliBanka, setMaliBanka)}
                                className="w-full px-1 py-0.5 text-center font-bold font-mono focus:outline-none focus:bg-amber-50 text-[10.5px]"
                                placeholder=""
                              />
                            </td>
                            <td className="border border-black p-0">
                              <input
                                type="text"
                                value={maliAlacak}
                                onChange={(e) => setMaliAlacak(e.target.value)}
                                onBlur={() => handleMaliBlur(maliAlacak, setMaliAlacak)}
                                className="w-full px-1 py-0.5 text-center font-bold font-mono focus:outline-none focus:bg-amber-50 text-[10.5px]"
                                placeholder=""
                              />
                            </td>
                            <td className="border border-black p-0">
                              <input
                                type="text"
                                value={maliBorclar}
                                onChange={(e) => setMaliBorclar(e.target.value)}
                                onBlur={() => handleMaliBlur(maliBorclar, setMaliBorclar)}
                                className="w-full px-1 py-0.5 text-center font-bold font-mono focus:outline-none focus:bg-amber-50 text-[10.5px]"
                                placeholder=""
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* --- EK-1/B SAYFA 2 / 2 (ARKA SAYFA - ALACAKLAR, BORÇLAR VE BANKA DÖKÜMÜ) --- */}
                {(activePage === 'sayfa2' || activePage === 'hepsi') && (
                  <div id="form-print-page-2" className="space-y-2 text-[10.5px] sm:text-[11px] leading-snug pt-3 sm:pt-4 border-t-2 border-dashed border-gray-300 page-break-before p-1 sm:p-2 bg-white">
                    <div className="flex justify-between items-start font-bold">
                      <span className="text-gray-500 font-sans text-[10px]">2/2</span>
                      <span className="text-xs">Ek-1/b Arka Sayfa</span>
                    </div>

                    {/* Tablo 1: Kısa Vadeli Alacaklar */}
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold uppercase text-[10px] sm:text-[10.5px]">
                          KISA VADELİ ALACAKLAR (TİCARİ ALACAKLAR + DİĞER ALACAKLAR) HAKKINDA BİLGİ
                        </span>
                        <button
                          type="button"
                          onClick={addAlacak}
                          className="no-print text-[10px] px-2 py-0.5 rounded bg-teal-600 text-white font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" /> Satır Ekle
                        </button>
                      </div>

                      <table className="w-full border-collapse border border-black text-[10.5px] font-sans">
                        <thead>
                          <tr className="bg-gray-100 font-bold text-center">
                            <th className="border border-black p-0.5">Borçlunun Adı</th>
                            <th className="border border-black p-0.5">Alacağın Türü</th>
                            <th className="border border-black p-0.5">Ödeme Vadesi</th>
                            <th className="border border-black p-0.5">Toplam Tutarı (TL)</th>
                            <th className="border border-black p-0.5 no-print w-8">İşlem</th>
                          </tr>
                        </thead>
                        <tbody>
                          {alacaklar.map((a, idx) => (
                            <tr key={a.id}>
                              <td className="border border-black p-0">
                                <input
                                  type="text"
                                  value={a.borclununAdi}
                                  onChange={(e) => {
                                    const updated = [...alacaklar];
                                    updated[idx].borclununAdi = e.target.value;
                                    setAlacaklar(updated);
                                  }}
                                  className="w-full px-1 py-0.5 focus:outline-none text-[10.5px]"
                                  placeholder="Borçlu Adı..."
                                />
                              </td>
                              <td className="border border-black p-0">
                                <input
                                  type="text"
                                  value={a.tur}
                                  onChange={(e) => {
                                    const updated = [...alacaklar];
                                    updated[idx].tur = e.target.value;
                                    setAlacaklar(updated);
                                  }}
                                  className="w-full px-1 py-0.5 focus:outline-none text-[10.5px]"
                                />
                              </td>
                              <td className="border border-black p-0">
                                <input
                                  type="text"
                                  value={a.vade}
                                  onChange={(e) => {
                                    const updated = [...alacaklar];
                                    updated[idx].vade = e.target.value;
                                    setAlacaklar(updated);
                                  }}
                                  className="w-full px-1 py-0.5 text-center focus:outline-none text-[10.5px]"
                                />
                              </td>
                              <td className="border border-black p-0">
                                <input
                                  type="text"
                                  value={a.tutar}
                                  onChange={(e) => {
                                    const updated = [...alacaklar];
                                    updated[idx].tutar = e.target.value;
                                    setAlacaklar(updated);
                                  }}
                                  className="w-full px-1 py-0.5 font-mono font-bold text-right focus:outline-none text-[10.5px]"
                                />
                              </td>
                              <td className="border border-black p-0.5 text-center no-print">
                                <button
                                  type="button"
                                  onClick={() => removeAlacak(a.id)}
                                  className="text-red-600 hover:text-red-800 p-0.5 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Tablo 2: Kısa Vadeli Borçlar */}
                    <div className="pt-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold uppercase text-[10px] sm:text-[10.5px]">
                          KISA VADELİ BORÇLAR HAKKINDA BİLGİ
                        </span>
                        <button
                          type="button"
                          onClick={addBorc}
                          className="no-print text-[10px] px-2 py-0.5 rounded bg-teal-600 text-white font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" /> Satır Ekle
                        </button>
                      </div>

                      <table className="w-full border-collapse border border-black text-[10.5px] font-sans">
                        <thead>
                          <tr className="bg-gray-100 font-bold text-center">
                            <th className="border border-black p-0.5">Alacaklının Adı</th>
                            <th className="border border-black p-0.5">Borcun Türü</th>
                            <th className="border border-black p-0.5">Ödeme Vadesi</th>
                            <th className="border border-black p-0.5">Toplam Tutarı (TL)</th>
                            <th className="border border-black p-0.5 no-print w-8">İşlem</th>
                          </tr>
                        </thead>
                        <tbody>
                          {borclarList.map((b, idx) => (
                            <tr key={b.id}>
                              <td className="border border-black p-0">
                                <input
                                  type="text"
                                  value={b.alacaklininAdi}
                                  onChange={(e) => {
                                    const updated = [...borclarList];
                                    updated[idx].alacaklininAdi = e.target.value;
                                    setBorclarList(updated);
                                  }}
                                  className="w-full px-1 py-0.5 focus:outline-none text-[10.5px]"
                                  placeholder="Alacaklı Adı..."
                                />
                              </td>
                              <td className="border border-black p-0">
                                <input
                                  type="text"
                                  value={b.tur}
                                  onChange={(e) => {
                                    const updated = [...borclarList];
                                    updated[idx].tur = e.target.value;
                                    setBorclarList(updated);
                                  }}
                                  className="w-full px-1 py-0.5 focus:outline-none text-[10.5px]"
                                />
                              </td>
                              <td className="border border-black p-0">
                                <input
                                  type="text"
                                  value={b.vade}
                                  onChange={(e) => {
                                    const updated = [...borclarList];
                                    updated[idx].vade = e.target.value;
                                    setBorclarList(updated);
                                  }}
                                  className="w-full px-1 py-0.5 text-center focus:outline-none text-[10.5px]"
                                />
                              </td>
                              <td className="border border-black p-0">
                                <input
                                  type="text"
                                  value={b.tutar}
                                  onChange={(e) => {
                                    const updated = [...borclarList];
                                    updated[idx].tutar = e.target.value;
                                    setBorclarList(updated);
                                  }}
                                  className="w-full px-1 py-0.5 font-mono font-bold text-right focus:outline-none text-[10.5px]"
                                />
                              </td>
                              <td className="border border-black p-0.5 text-center no-print">
                                <button
                                  type="button"
                                  onClick={() => removeBorc(b.id)}
                                  className="text-red-600 hover:text-red-800 p-0.5 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Tablo 3: Banka Bilgileri */}
                    <div className="pt-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold uppercase text-[10px] sm:text-[10.5px]">BANKA BİLGİLERİ</span>
                        <button
                          type="button"
                          onClick={addBanka}
                          className="no-print text-[10px] px-2 py-0.5 rounded bg-teal-600 text-white font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" /> Hesap Ekle
                        </button>
                      </div>

                      <table className="w-full border-collapse border border-black text-[10.5px] font-sans">
                        <thead>
                          <tr className="bg-gray-100 font-bold text-center">
                            <th className="border border-black p-0.5 w-8">Sıra</th>
                            <th className="border border-black p-0.5">Banka Şubesi</th>
                            <th className="border border-black p-0.5">Hesap Numarası</th>
                            <th className="border border-black p-0.5">Bakiye Tutarı (TL)</th>
                            <th className="border border-black p-0.5 no-print w-8">İşlem</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bankaHesaplari.map((b, idx) => (
                            <tr key={b.id}>
                              <td className="border border-black p-0.5 text-center font-bold">{idx + 1}</td>
                              <td className="border border-black p-0">
                                <input
                                  type="text"
                                  value={b.sube}
                                  onChange={(e) => {
                                    const updated = [...bankaHesaplari];
                                    updated[idx].sube = e.target.value;
                                    setBankaHesaplari(updated);
                                  }}
                                  className="w-full px-1 py-0.5 focus:outline-none text-[10.5px]"
                                  placeholder="Banka ve Şube adı"
                                />
                              </td>
                              <td className="border border-black p-0">
                                <input
                                  type="text"
                                  value={b.hesapNo}
                                  onChange={(e) => {
                                    const updated = [...bankaHesaplari];
                                    updated[idx].hesapNo = e.target.value;
                                    setBankaHesaplari(updated);
                                  }}
                                  className="w-full px-1 py-0.5 font-mono focus:outline-none text-[10.5px]"
                                  placeholder="IBAN veya Hesap No"
                                />
                              </td>
                              <td className="border border-black p-0">
                                <input
                                  type="text"
                                  value={b.bakiye}
                                  onChange={(e) => {
                                    const updated = [...bankaHesaplari];
                                    updated[idx].bakiye = e.target.value;
                                    setBankaHesaplari(updated);
                                  }}
                                  className="w-full px-1 py-0.5 font-mono font-bold text-right focus:outline-none text-[10.5px]"
                                />
                              </td>
                              <td className="border border-black p-0.5 text-center no-print">
                                <button
                                  type="button"
                                  onClick={() => removeBanka(b.id)}
                                  className="text-red-600 hover:text-red-800 p-0.5 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Açıklamalar Bölümü */}
                    <div className="pt-1 text-[9.5px] sm:text-[10px] leading-tight space-y-0.5 text-justify">
                      <div className="font-bold text-[10.5px]">Açıklamalar</div>
                      <div>
                        <strong>KASA:</strong> Borçlunun VUK gereği tutmak zorunda olduğu ticari defterlerine göre mevcut kasa yekununu ifade eder. Hiçbir şekilde alacak bakiyesi vermez.
                      </div>
                      <div>
                        <strong>BANKA BİLGİLERİ:</strong> Borçlunun yurt içi ve yurt dışı finans kurumlarındaki mevduatlarını kapsar. Şube, hesap numarası ve bakiyeleri yazılacaktır.
                      </div>
                      <div>
                        <strong>KISA VADELİ ALACAKLAR:</strong> En çok bir yıl veya normal faaliyet dönemi sonunda tahsil edilecek ticari alacaklar toplamıdır.
                      </div>
                      <div>
                        <strong>KISA VADELİ BORÇLAR:</strong> En çok bir yıl içinde ödenecek yabancı kaynaklar (mali borçlar, ticari borçlar, ödenecek vergi ve yükümlülükler) toplamıdır.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      );

  if (isInline) {
    return (
      <section
        id="taksit-formu-section"
        className="rounded-3xl border shadow-xl overflow-hidden transition-all duration-200"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-primary)',
        }}
      >
        {/* Akordeon Başlık Çubuğu */}
        <button
          type="button"
          onClick={onClose}
          className="no-print w-full p-4 sm:px-6 flex items-center justify-between text-left transition-colors cursor-pointer group"
          style={{
            backgroundColor: isOpen ? 'var(--bg-elevated)' : 'var(--bg-secondary)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-600/10 text-teal-600 dark:text-teal-400 group-hover:bg-teal-600 group-hover:!text-white group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-slate-100">
                  Resmî SGK Taksit Formları (Ek-1 &amp; Ek-1/b)
                </h2>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-teal-600 text-white font-bold tracking-wide">
                  Açılır / Kapanır Panel
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 font-bold">
                  Arkalı Önlü Baskı &amp; Manuel Düzenleme
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                6183/48 tecil başvurusu için resmi Ek-1 Başvuru Formu ve Ek-1/b Mali Durum Bildirim Formunu doldurun, doğrudan kâğıt üzerinde düzenleyin ve arkalı önlü yazdırın.
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

        {/* Akordeon Açılır İçerik */}
        {isOpen && (
          <div className="border-t" style={{ borderColor: 'var(--border-primary)' }}>
            <div className="p-4 sm:p-6 space-y-5 text-xs">
              {renderFormContent()}
            </div>
            {renderBottomBar()}
          </div>
        )}
      </section>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div
        className="w-full max-w-5xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200"
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderColor: 'var(--border-primary)',
          color: 'var(--text-primary)',
        }}
      >
        {/* Modal Top Bar */}
        <div
          className="p-4 sm:px-6 border-b flex items-center justify-between gap-3 shrink-0"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)',
          }}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-teal-600/10 text-teal-600 dark:text-teal-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                <span>Resmî SGK Taksit Formları (Ek-1 &amp; Ek-1/b)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-600 text-white font-mono font-bold">
                  Arkalı Önlü Baskı &amp; Manuel Düzenleme
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Verileri yapıştırabilir veya doğrudan kâğıt üzerindeki kutucuklara tıklayarak elle dilediğiniz gibi yazabilirsiniz.
              </p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-500/10 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {renderFormContent()}
        </div>

        {renderBottomBar()}
      </div>
    </div>
  );
};
