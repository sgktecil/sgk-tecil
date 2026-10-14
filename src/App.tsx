import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ToolsDrawer } from './components/ToolsDrawer';
import { TaksitTablosu } from './components/TaksitTablosu';
import { VadeKarsilastirma } from './components/VadeKarsilastirma';
import { TaksitFormuModal } from './components/TaksitFormuModal';
import { DonemBorcDokumu } from './components/DonemBorcDokumu';
import {
  formatTL,
  parseTL,
  calculate6183,
  getYetkiBilgisi,
  getTodayDateISO
} from './utils/calculator';
import { extractSgimAndSgm, cleanSgmName, extractSicilSiraNo } from './utils/sgkFormParser';
import {
  Coins,
  Calculator,
  Calendar,
  Percent,
  ShieldCheck,
  Building,
  Layers,
  ChevronDown,
  Sparkles,
  Scale,
  CheckCircle2,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { safeStorage } from './utils/storage';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'amoled'>(() => {
    return (safeStorage.getItem('theme', 'light') as 'light' | 'dark' | 'amoled') || 'light';
  });
  const [colorTheme, setColorTheme] = useState<string>(() => {
    return safeStorage.getItem('themeColor', 'sgk') || 'sgk';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    safeStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-color', colorTheme);
    safeStorage.setItem('themeColor', colorTheme);
  }, [colorTheme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : prev === 'dark' ? 'amoled' : 'light'));
  };

  // Tools Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<'maasTab' | 'bankaTab' | 'tebligatTab' | 'bilgiTab'>('bilgiTab');
  const [drawerTitle, setDrawerTitle] = useState('Bilgi Portalı');

  const openDrawer = (tab: 'maasTab' | 'bankaTab' | 'tebligatTab' | 'bilgiTab', title: string) => {
    setDrawerTab(tab);
    setDrawerTitle(title);
    setDrawerOpen(true);
  };

  // Taksit Formu Modal state
  const [taksitFormuOpen, setTaksitFormuOpen] = useState(false);

  // Form Inputs
  const [borcInput, setBorcInput] = useState('12.000.000,00');
  const [taksitSayisi, setTaksitSayisi] = useState(36);
  const [pesinatTarihi, setPesinatTarihi] = useState(() => getTodayDateISO());
  const [faizOraniInput, setFaizOraniInput] = useState('39');
  const [teminatLimitiInput, setTeminatLimitiInput] = useState('10.000.000,00');
  const [pesinatInput, setPesinatInput] = useState('1.200.000,00');

  // Accordion toggles
  const [likiditeOpen, setLikiditeOpen] = useState(false);
  const [teminatOpen, setTeminatOpen] = useState(false);

  // Likidite inputs
  const [likiditeTab, setLikiditeTab] = useState<'bilanco' | 'isletme'>('bilanco');
  const [bilancoDv, setBilancoDv] = useState('100.000,00');
  const [bilancoStok, setBilancoStok] = useState('10.000,00');
  const [bilancoKy, setBilancoKy] = useState('200.000,00');

  const [isletmeKasa, setIsletmeKasa] = useState('10.000,00');
  const [isletmeBanka, setIsletmeBanka] = useState('20.000,00');
  const [isletmeAlacak, setIsletmeAlacak] = useState('30.000,00');
  const [isletmeBorclar, setIsletmeBorclar] = useState('150.000,00');

  // Hesaplama sonucu
  const [hesapSonucu, setHesapSonucu] = useState(() => {
    const borc = parseTL(borcInput);
    const pesinat = parseTL(pesinatInput);
    const faiz = parseFloat(faizOraniInput) || 39;
    return calculate6183(borc, taksitSayisi, pesinat, pesinatTarihi, faiz);
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBorcChange = (val: string) => {
    setBorcInput(val);
  };

  const handleBorcBlur = () => {
    const numeric = parseTL(borcInput);
    if (numeric > 0) {
      setBorcInput(formatTL(numeric));
      // SGK 6183/48 gereği zorunlu asgari %10 peşinat
      const autoPesinat = Math.round(numeric * 0.10 * 100) / 100;
      setPesinatInput(formatTL(autoPesinat));
    }
  };

  const runCalculation = () => {
    const borc = parseTL(borcInput);
    const pesinat = parseTL(pesinatInput);
    const faiz = parseFloat(faizOraniInput) || 39;
    const res = calculate6183(borc, taksitSayisi, pesinat, pesinatTarihi, faiz);
    setHesapSonucu(res);
    showToast('Hesaplama başarıyla güncellendi.');
  };

  const handleSelectAlternativeVade = (newVade: number) => {
    setTaksitSayisi(newVade);
    const borc = parseTL(borcInput);
    const autoPesinat = Math.round(borc * 0.10 * 100) / 100;
    setPesinatInput(formatTL(autoPesinat));
    const faiz = parseFloat(faizOraniInput) || 39;
    const res = calculate6183(borc, newVade, autoPesinat, pesinatTarihi, faiz);
    setHesapSonucu(res);
    showToast(`${newVade} aylık vade seçildi ve hesaplama güncellendi.`);
  };

  const handleTaksitSayisiChange = (newVade: number) => {
    if (isNaN(newVade) || newVade <= 0) return;
    setTaksitSayisi(newVade);
    const borc = parseTL(borcInput);
    const pesinat = parseTL(pesinatInput);
    const faiz = parseFloat(faizOraniInput) || 39;
    const res = calculate6183(borc, newVade, pesinat, pesinatTarihi, faiz);
    setHesapSonucu(res);
  };

  const handleBorcChangeFromModal = (newBorc: number, newPesinat?: number) => {
    if (isNaN(newBorc) || newBorc <= 0) return;
    setBorcInput(formatTL(newBorc));
    const pesinatVal = newPesinat !== undefined ? newPesinat : parseTL(pesinatInput);
    if (newPesinat !== undefined) {
      setPesinatInput(formatTL(newPesinat));
    }
    const faiz = parseFloat(faizOraniInput) || 39;
    const res = calculate6183(newBorc, taksitSayisi, pesinatVal, pesinatTarihi, faiz);
    setHesapSonucu(res);
  };

  const handlePesinatChangeFromModal = (newPesinat: number) => {
    if (isNaN(newPesinat) || newPesinat < 0) return;
    setPesinatInput(formatTL(newPesinat));
    const borc = parseTL(borcInput);
    const faiz = parseFloat(faizOraniInput) || 39;
    const res = calculate6183(borc, taksitSayisi, newPesinat, pesinatTarihi, faiz);
    setHesapSonucu(res);
  };

  // Borçlu bilgileri state
  const [borcluInfo, setBorcluInfo] = useState<{
    unvan?: string;
    sigortaNo?: string;
    isyeriAdresi?: string;
    ilMudurlugu?: string;
    sgkMerkezi?: string;
    tcknVkn?: string;
    vergiDairesi?: string;
    ticaretSicilNo?: string;
    telefon?: string;
    faks?: string;
    gsm?: string;
    eposta?: string;
    ikametgahAdresi?: string;
    ekSatir?: string;
    ekSatirBaslik?: string;
    ekSatirBirlestir?: boolean;
    ekSatir2?: string;
    ekSatirBaslik2?: string;
    ekSatirBirlestir2?: boolean;
  }>({
    ilMudurlugu: 'ORDU',
    sgkMerkezi: 'ALTINORDU',
    unvan: 'ÜMİT ÖZTÜRK',
    sigortaNo: '1088448',
    isyeriAdresi: 'YENİ MAH.328.SOK. Dış kapı no:8 İç kapı no:B - ORDU ALTINORDU',
    tcknVkn: '12345678901',
    vergiDairesi: 'Boztepe Vergi Dairesi',
    ticaretSicilNo: '52-12345',
    telefon: '0 (452) 234 56 78',
    faks: '0 (452) 234 56 79',
    gsm: '0 (532) 987 65 43',
    eposta: 'umitozturk@gmail.com',
    ikametgahAdresi: 'YENİ MAH.328.SOK. Dış kapı no:8 İç kapı no:B - ORDU ALTINORDU',
    ekSatir: '',
    ekSatirBaslik: '',
    ekSatirBirlestir: true,
    ekSatir2: '',
    ekSatirBaslik2: '',
    ekSatirBirlestir2: true,
  });

  const handleTransferFromDokum = (
    amount: number,
    unvan?: string,
    sicilNo?: string,
    adres?: string,
    sgm?: string
  ) => {
    if (amount > 0) {
      const formatted = formatTL(amount);
      setBorcInput(formatted);
      const autoPesinat = Math.round(amount * 0.10 * 100) / 100;
      setPesinatInput(formatTL(autoPesinat));
      const faiz = parseFloat(faizOraniInput) || 39;
      const res = calculate6183(amount, taksitSayisi, autoPesinat, pesinatTarihi, faiz);
      setHesapSonucu(res);
      showToast(`SGK dökümündeki Genel Toplam (${formatted} ₺) Borç Tutarı (Prim Aslı) alanına aktarıldı ve tecil taksit planı güncellendi.`);
    }

    if (unvan || sicilNo || adres || sgm) {
      const parsedLocation = extractSgimAndSgm(`${sgm || ''} ${adres || ''} ${sicilNo || ''}`);
      setBorcluInfo((prev) => {
        let nextIl = parsedLocation.il || prev.ilMudurlugu || '';
        let nextMerkez = parsedLocation.merkez || '';

        // Kullanıcı kesin kuralı: İl Ordu ise Sosyal Güvenlik Merkezi her zaman ALTINORDU olmalıdır
        if (nextIl.toLocaleUpperCase('tr-TR').trim() === 'ORDU') {
          nextMerkez = 'ALTINORDU';
        } else if (!nextMerkez && sgm) {
          nextMerkez = cleanSgmName(sgm, nextIl);
        }

        return {
          ...prev,
          ...(unvan ? { unvan } : {}),
          ...(sicilNo ? { sigortaNo: extractSicilSiraNo(sicilNo) } : {}),
          ...(adres ? { isyeriAdresi: adres } : {}),
          ...(nextIl ? { ilMudurlugu: nextIl } : {}),
          ...(nextMerkez ? { sgkMerkezi: nextMerkez } : {}),
        };
      });
    }
  };

  // Dinamik Teminat ve Yetki Hesaplamaları
  const currentBorc = parseTL(borcInput);
  const currentTeminatLimit = parseTL(teminatLimitiInput);
  const currentTeminatGerekli = currentBorc > currentTeminatLimit;
  const currentAsanKisim = Math.max(0, currentBorc - currentTeminatLimit);
  const currentGerekenTeminat = currentTeminatGerekli ? currentAsanKisim / 2 : 0;
  const currentYetki = getYetkiBilgisi(currentBorc);

  // Bilanço likidite
  const bDv = parseTL(bilancoDv);
  const bStok = parseTL(bilancoStok);
  const bKy = parseTL(bilancoKy);
  const bilancoOrani = bKy > 0 ? (bDv - bStok) / bKy : 0;

  // İşletme likidite
  const iKasa = parseTL(isletmeKasa);
  const iBanka = parseTL(isletmeBanka);
  const iAlacak = parseTL(isletmeAlacak);
  const iBorc = parseTL(isletmeBorclar);
  const isletmeOrani = iBorc > 0 ? (iKasa + iBanka + iAlacak) / iBorc : 0;

  return (
    <div
      className="min-h-screen flex flex-col antialiased selection:bg-teal-500 selection:text-white text-slate-900 dark:text-slate-100"
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Header & Tools Navbar */}
      <Header
        onOpenDrawer={openDrawer}
        theme={theme}
        onSelectTheme={(t) => setTheme(t)}
      />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-8 w-full flex-1 space-y-8">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-bottom duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* SGK Dönem Borç Dökümü Açılır / Kapanır Panel */}
        <div id="donem-borc-dokumu-section">
          <DonemBorcDokumu onTransferToTecil={handleTransferFromDokum} />
        </div>

        {/* Resmî SGK Taksit Formları Açılır / Kapanır Panel (Ek-1 & Ek-1/b) */}
        <TaksitFormuModal
          isInline={true}
          isOpen={taksitFormuOpen}
          onClose={() => setTaksitFormuOpen(!taksitFormuOpen)}
          borc={currentBorc}
          taksitSayisi={taksitSayisi}
          onTaksitSayisiChange={handleTaksitSayisiChange}
          onBorcChange={handleBorcChangeFromModal}
          onPesinatChange={handlePesinatChangeFromModal}
          pesinatTutari={parseTL(pesinatInput)}
          pesinatTarihi={pesinatTarihi}
          likiditeOrani={likiditeTab === 'bilanco' ? bilancoOrani : isletmeOrani}
          likiditeTab={likiditeTab}
          bilancoData={{ dv: bDv, stok: bStok, ky: bKy }}
          isletmeData={{ kasa: iKasa, banka: iBanka, alacak: iAlacak, borclar: iBorc }}
          initialBorclu={borcluInfo}
          faizOrani={parseFloat(faizOraniInput) || 39}
        />

        {/* Calculation Input Card */}
        <section
          id="hesaplama-input-section"
          className="rounded-3xl border shadow-xl p-6 sm:p-8 space-y-6 group"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)',
          }}
        >
          <div className="flex items-center justify-between pb-4 border-b flex-wrap gap-3 cursor-default" style={{ borderColor: 'var(--border-primary)' }}>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-teal-600/10 text-teal-600 dark:text-teal-400 group-hover:bg-teal-600 group-hover:!text-white group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                  Borç ve Tecil Parametreleri
                </h2>
              </div>
            </div>
          </div>

          {/* Form Grid */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              runCalculation();
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Borç Tutarı */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                  <span>Borç Tutarı (Prim Aslı) *</span>
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Nokta kullanmadan yazın</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={borcInput}
                    onChange={(e) => handleBorcChange(e.target.value)}
                    onBlur={handleBorcBlur}
                    className="form-control-custom pr-9 font-bold"
                    placeholder="12.000.000,00"
                    required
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">₺</span>
                </div>
              </div>

              {/* Taksit Sayısı */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Taksit Sayısı (Ay) *
                </label>
                <select
                  value={taksitSayisi}
                  onChange={(e) => {
                    const newV = Number(e.target.value);
                    handleTaksitSayisiChange(newV);
                  }}
                  className="form-control-custom font-bold"
                >
                  <option value={6}>6 Ay</option>
                  <option value={9}>9 Ay</option>
                  <option value={12}>12 Ay (1 Yıl)</option>
                  <option value={18}>18 Ay</option>
                  <option value={24}>24 Ay (2 Yıl)</option>
                  <option value={30}>30 Ay</option>
                  <option value={36}>36 Ay (3 Yıl - Standart)</option>
                  <option value={48}>48 Ay (Likidite ≤ 0.50)</option>
                  <option value={60}>60 Ay (Likidite ≤ 0.50)</option>
                  <option value={72}>72 Ay (Likidite ≤ 0.50 - Azami)</option>
                  {![6, 9, 12, 18, 24, 30, 36, 48, 60, 72].includes(taksitSayisi) && (
                    <option value={taksitSayisi}>{taksitSayisi} Ay (Özel Seçim)</option>
                  )}
                </select>
              </div>

              {/* Yasal Teminat Muafiyet Limiti */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Yasal Teminat Muafiyet Limiti
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={teminatLimitiInput}
                    onChange={(e) => setTeminatLimitiInput(e.target.value)}
                    className="form-control-custom pr-9 font-mono"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">₺</span>
                </div>
              </div>

              {/* Peşinat Tarihi */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Başlangıç / Peşinat Tarihi
                </label>
                <input
                  type="date"
                  value={pesinatTarihi}
                  onChange={(e) => setPesinatTarihi(e.target.value)}
                  className="form-control-custom font-bold"
                />
              </div>

              {/* Yıllık Faiz Oranı */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Yıllık Tecil Faizi Oranı (%)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={faizOraniInput}
                    onChange={(e) => setFaizOraniInput(e.target.value)}
                    className="form-control-custom pr-9 font-bold text-teal-600"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">%</span>
                </div>
              </div>

              {/* İlk Taksit / Peşinat */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                  <span>İlk Taksit / Peşinat *</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={pesinatInput}
                    onChange={(e) => setPesinatInput(e.target.value)}
                    onBlur={() => {
                      const num = parseTL(pesinatInput);
                      if (num >= 0) setPesinatInput(formatTL(num));
                    }}
                    className="form-control-custom pr-9 font-bold text-amber-700 dark:text-amber-400"
                    placeholder="333.333,33"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">₺</span>
                </div>
              </div>
            </div>

            {/* 36 Ayı Aşan Tecillerde Kademeli Tecil Uyarısı */}
            {taksitSayisi > 36 && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  <span className="font-extrabold block text-sm">
                    ⚠️ 36 Ayı Aşan Tecillerde Kademeli Tecil Uygulanamaz!
                  </span>
                  <p>
                    SGK 2024/12 ve 2026/15 Genelgeleri uyarınca, <strong>{taksitSayisi} ay</strong> gibi 36 ayı aşan tecillerde kademeli taksitlendirme uygulaması yapılamaz. Yalnızca <strong>eşit taksitler</strong> halinde ödeme planı düzenlenebilir ve borçlunun likidite oranının <strong>0,50 ve altında</strong> olması şarttır.
                  </p>
                </div>
              </div>
            )}

            {/* Accordion 1: Teminat Değerlendirmesi */}
            <div className="border rounded-2xl overflow-hidden" style={{ borderColor: 'var(--border-primary)' }}>
              <button
                type="button"
                onClick={() => setTeminatOpen(!teminatOpen)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-500/5 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 font-bold text-xs">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:!text-white group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-slate-800 dark:text-slate-100">Teminat Durumu &amp; Yetki Makamı İncelemesi</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${teminatOpen ? 'rotate-180' : ''}`} />
              </button>

              {teminatOpen && (
                <div className="p-4 border-t space-y-3 text-xs bg-slate-500/5" style={{ borderColor: 'var(--border-primary)' }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl border bg-white dark:bg-slate-800 space-y-1" style={{ borderColor: 'var(--border-primary)' }}>
                      <span className="font-bold text-slate-500 text-[11px] block">Teminat Durumu:</span>
                      {currentTeminatGerekli ? (
                        <div className="text-amber-600 dark:text-amber-400 font-bold">
                          ⚠️ Teminat Gereklidir (Aşan Kısmın %50'si)
                          <div className="font-mono text-sm mt-1 text-slate-900 dark:text-slate-100">
                            Gereken Teminat: {formatTL(currentGerekenTeminat)} ₺
                          </div>
                        </div>
                      ) : (
                        <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                          ✓ 10.000.000 TL altında kaldığından teminat aranmaz.
                        </div>
                      )}
                    </div>

                    <div className="p-3 rounded-xl border bg-white dark:bg-slate-800 space-y-1" style={{ borderColor: 'var(--border-primary)' }}>
                      <span className="font-bold text-slate-500 text-[11px] block">Tecile Yetkili Makam:</span>
                      <div className="font-bold text-teal-700 dark:text-teal-400 text-sm">
                        {currentYetki.makam}
                      </div>
                      <p className="text-[11px] text-slate-500">{currentYetki.aciklama}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 2: Likidite Oranı Hesaplama */}
            <div className="border rounded-2xl overflow-hidden" style={{ borderColor: 'var(--border-primary)' }}>
              <button
                type="button"
                onClick={() => setLikiditeOpen(!likiditeOpen)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-500/5 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 font-bold text-xs">
                  <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:!text-white group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <span className="text-slate-800 dark:text-slate-100">Çok Zor Durum &amp; Likidite Rasyosu Hesaplayıcı (Bilanço / İşletme)</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${likiditeOpen ? 'rotate-180' : ''}`} />
              </button>

              {likiditeOpen && (
                <div className="p-4 border-t space-y-4 text-xs bg-slate-500/5" style={{ borderColor: 'var(--border-primary)' }}>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setLikiditeTab('bilanco')}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                        likiditeTab === 'bilanco' ? 'bg-indigo-600 text-white' : 'bg-slate-500/10'
                      }`}
                    >
                      Bilanço Esası (Dönen Varlıklar - Stoklar / Kısa Vadeli Kaynaklar)
                    </button>
                    <button
                      type="button"
                      onClick={() => setLikiditeTab('isletme')}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                        likiditeTab === 'isletme' ? 'bg-indigo-600 text-white' : 'bg-slate-500/10'
                      }`}
                    >
                      İşletme Hesabı (Kasa + Banka + Alacaklar / Borçlar)
                    </button>
                  </div>

                  {likiditeTab === 'bilanco' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-bold block mb-1">Dönen Varlıklar (TL):</label>
                        <input
                          type="text"
                          value={bilancoDv}
                          onChange={(e) => setBilancoDv(e.target.value)}
                          className="form-control-custom font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold block mb-1">Stoklar (TL):</label>
                        <input
                          type="text"
                          value={bilancoStok}
                          onChange={(e) => setBilancoStok(e.target.value)}
                          className="form-control-custom font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold block mb-1">Kısa Vadeli Yabancı Kaynaklar (TL):</label>
                        <input
                          type="text"
                          value={bilancoKy}
                          onChange={(e) => setBilancoKy(e.target.value)}
                          className="form-control-custom font-mono"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="text-[11px] font-bold block mb-1">Kasa (TL):</label>
                        <input
                          type="text"
                          value={isletmeKasa}
                          onChange={(e) => setIsletmeKasa(e.target.value)}
                          className="form-control-custom font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold block mb-1">Banka (TL):</label>
                        <input
                          type="text"
                          value={isletmeBanka}
                          onChange={(e) => setIsletmeBanka(e.target.value)}
                          className="form-control-custom font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold block mb-1">Kısa Vadeli Alacaklar (TL):</label>
                        <input
                          type="text"
                          value={isletmeAlacak}
                          onChange={(e) => setIsletmeAlacak(e.target.value)}
                          className="form-control-custom font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold block mb-1">Kısa Vadeli Borçlar (TL):</label>
                        <input
                          type="text"
                          value={isletmeBorclar}
                          onChange={(e) => setIsletmeBorclar(e.target.value)}
                          className="form-control-custom font-mono"
                        />
                      </div>
                    </div>
                  )}

                  <div className="p-3 rounded-xl border bg-white dark:bg-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-500">Hesaplanan Likidite Oranı:</span>
                      <div className="font-black text-lg font-mono text-indigo-600 dark:text-indigo-400">
                        {(likiditeTab === 'bilanco' ? bilancoOrani : isletmeOrani).toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right text-[11px]">
                      {(likiditeTab === 'bilanco' ? bilancoOrani : isletmeOrani) <= 0.5 ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-bold">
                          ✓ Çok Zor Durum: Azami 72 Aya Kadar Tecil Edilebilir
                        </span>
                      ) : (likiditeTab === 'bilanco' ? bilancoOrani : isletmeOrani) <= 1.0 ? (
                        <span className="px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-600 font-bold">
                          ✓ Çok Zor Durum: Azami 36 Aya Kadar Tecil Edilebilir
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 font-bold">
                          ✕ Likidite &gt; 1.01 Olduğundan Tecil Talebi Reddedilir
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Calculate Button */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Calculator className="w-4 h-4" />
                <span>Hesapla ve Planı Güncelle</span>
              </button>
            </div>
          </form>
        </section>

        {/* Results Overview Grid */}
        {hesapSonucu && (
          <section id="sonuc-ozeti-section" className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* Toplam Borç */}
              <div
                className="p-4 rounded-2xl border shadow-sm space-y-1"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
              >
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">Toplam Borç (Asıl)</span>
                <span className="text-sm sm:text-base font-black font-mono text-slate-900 dark:text-slate-100">
                  {formatTL(hesapSonucu.anaPara)} ₺
                </span>
              </div>

              {/* Peşinat */}
              <div
                className="p-4 rounded-2xl border shadow-sm space-y-1"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
              >
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 block">İlk Taksit (Peşinat)</span>
                <span className="text-sm sm:text-base font-black font-mono text-amber-700 dark:text-amber-400">
                  {formatTL(hesapSonucu.pesinat)} ₺
                </span>
              </div>

              {/* Kalan Borç */}
              <div
                className="p-4 rounded-2xl border shadow-sm space-y-1"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
              >
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">Tecile Konu Borç</span>
                <span className="text-sm sm:text-base font-black font-mono text-slate-900 dark:text-slate-100">
                  {formatTL(hesapSonucu.kalanBorc)} ₺
                </span>
              </div>

              {/* Taksit Sayısı */}
              <div
                className="p-4 rounded-2xl border shadow-sm space-y-1"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
              >
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">Vade Süresi</span>
                <span className="text-sm sm:text-base font-black font-mono text-teal-700 dark:text-teal-400">
                  {hesapSonucu.taksitSayisi} Ay
                </span>
              </div>

              {/* Toplam Tecil Faizi */}
              <div
                className="p-4 rounded-2xl border shadow-sm space-y-1"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
              >
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 block">Toplam Tecil Faizi</span>
                <span className="text-sm sm:text-base font-black font-mono text-amber-700 dark:text-amber-400">
                  {formatTL(hesapSonucu.toplamFaiz)} ₺
                </span>
              </div>

              {/* Aylık Taksit Tutarı */}
              <div
                className="p-4 rounded-2xl border shadow-sm space-y-1 bg-teal-500/10 border-teal-500/30"
              >
                <span className="text-[11px] font-black text-teal-800 dark:text-teal-300 block">
                  Aylık Sabit Taksit
                </span>
                <span className="text-sm sm:text-base font-black font-mono text-teal-900 dark:text-teal-200">
                  {formatTL(hesapSonucu.aylikSabitTaksit)} ₺
                </span>
              </div>
            </div>

            {/* Alternatif Vade Karşılaştırması */}
            <VadeKarsilastirma
              anaBorc={hesapSonucu.anaPara}
              pesinatTarihi={pesinatTarihi}
              faizOrani={hesapSonucu.faizOrani}
              onSelectVade={handleSelectAlternativeVade}
            />

            {/* Taksit Tablosu */}
            <TaksitTablosu
              taksitler={hesapSonucu.taksitler}
              toplamBorc={hesapSonucu.anaPara}
              toplamFaiz={hesapSonucu.toplamFaiz}
              toplamOdeme={hesapSonucu.toplamOdeme}
              taksitSayisi={hesapSonucu.taksitSayisi}
            />
          </section>
        )}
      </main>

      {/* Tools Drawer */}
      <ToolsDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeSection={drawerTab}
        drawerTitle={drawerTitle}
      />
    </div>
  );
}
