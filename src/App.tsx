import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ToolsDrawer } from './components/ToolsDrawer';
import { TaksitTablosu } from './components/TaksitTablosu';
import { VadeKarsilastirma } from './components/VadeKarsilastirma';
import { TaksitFormuModal } from './components/TaksitFormuModal';
import { DonemBorcDokumu } from './components/DonemBorcDokumu';
import { MuvafakatnameModal } from './components/MuvafakatnameModal';
import { SiteStatusModal } from './components/SiteStatusModal';
import { AnalyticsModal } from './components/AnalyticsModal';
import { AdminAuthModal } from './components/AdminAuthModal';
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
  FileText,
  FileCheck,
  FileSignature,
  Lock,
  BarChart3
} from 'lucide-react';
import { safeStorage } from './utils/storage';
import { fetchSiteStatus, updateSiteStatus } from './utils/siteStatusService';
import { initAnalytics, trackEvent } from './utils/analytics';

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
  const [muvafakatnameOpen, setMuvafakatnameOpen] = useState(false);

  // Canlı Yayın Durumu - Varsayılan açık (sunucudan dinamik sorgulanır)
  const [isSiteOpen, setIsSiteOpen] = useState<boolean>(true);
  const [siteStatusModalOpen, setSiteStatusModalOpen] = useState(false);
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);

  // Google Analytics ve Ziyaretçi Sayacını Başlat
  useEffect(() => {
    initAnalytics();
  }, []);

  // Geliştirici çalışma ortamı tespiti (bu önizleme penceresinde rahatça çalışabilmeniz için)
  const isDevHost = typeof window !== 'undefined' && (
    window.location.hostname.includes('-dev-') ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  );

  // Canlı bağlantıda (ais-pre-...) PIN ile yönetici girişi yapılmış mı?
  const [adminUnlockedSession, setAdminUnlockedSession] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('sgk_admin_unlocked') === 'true';
    } catch {
      return false;
    }
  });
  const [previewVisitorView, setPreviewVisitorView] = useState(false);

  // Sunucudan site durumunu ilk yüklemede ve periyodik olarak sorgula
  useEffect(() => {
    let isMounted = true;
    const syncStatus = async () => {
      const open = await fetchSiteStatus();
      if (isMounted) {
        setIsSiteOpen(open);
      }
    };

    // İlk açılışta hemen sunucuya sor
    syncStatus();

    // 4 saniyede bir ve sekme aktifleşince durumu senkronize et
    const interval = setInterval(syncStatus, 4000);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        syncStatus();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      isMounted = false;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const [adminAuthModalOpen, setAdminAuthModalOpen] = useState(false);
  const [pendingAdminAction, setPendingAdminAction] = useState<'status' | 'analytics' | null>(null);

  // Yönetici bölümlerine erişim kontrolü (Yalnızca PIN doğrulamalı)
  const handleOpenAdminSection = (section: 'status' | 'analytics') => {
    if (adminUnlockedSession) {
      if (section === 'status') {
        setSiteStatusModalOpen(true);
      } else {
        setAnalyticsModalOpen(true);
      }
    } else {
      setPendingAdminAction(section);
      setAdminAuthModalOpen(true);
    }
  };

  const handleAdminAuthSuccess = () => {
    setAdminUnlockedSession(true);
    try {
      sessionStorage.setItem('sgk_admin_unlocked', 'true');
    } catch {}
    setAdminAuthModalOpen(false);
    if (pendingAdminAction === 'status') {
      setSiteStatusModalOpen(true);
    } else if (pendingAdminAction === 'analytics') {
      setAnalyticsModalOpen(true);
    }
    setPendingAdminAction(null);
  };

  const handleToggleSiteStatus = async (open: boolean) => {
    setIsSiteOpen(open);
    if (open) {
      setAdminUnlockedSession(true);
      setPreviewVisitorView(false);
      try {
        sessionStorage.setItem('sgk_admin_unlocked', 'true');
        safeStorage.setItem('sgk_site_canli_durumu', 'acik');
      } catch {}
    } else {
      try {
        safeStorage.setItem('sgk_site_canli_durumu', 'kapali');
      } catch {}
    }
    await updateSiteStatus(open);
    showToast(open ? 'Site canlıya açıldı. Tüm ziyaretçiler artık erişebilir.' : 'Site kapatıldı. Ziyaretçiler artık bakım ekranını görecek.');
  };

  // Sadece yöneticinin bildiği gizli kısayol: Alt + K veya Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.altKey && (e.key === 'k' || e.key === 'K')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a'))
      ) {
        e.preventDefault();
        handleOpenAdminSection('status');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDevHost, adminUnlockedSession]);

  // Form Inputs - Kullanıcı giriş yapıncaya kadar tamamen boş başlatılır
  const [borcInput, setBorcInput] = useState('');
  const [taksitSayisi, setTaksitSayisi] = useState(36);
  const [taksitInput, setTaksitInput] = useState('36');
  const [pesinatTarihi, setPesinatTarihi] = useState(() => getTodayDateISO());
  const [faizOraniInput, setFaizOraniInput] = useState('39');
  const [teminatLimitiInput, setTeminatLimitiInput] = useState('10.000.000,00');
  // Peşinat modu: 'taksiteGore' (Borç / Taksit Sayısı) | 'yuzdeOn' (Borç * 0.10) | 'manuel'
  const [pesinatMode, setPesinatMode] = useState<'taksiteGore' | 'yuzdeOn' | 'manuel'>('taksiteGore');
  const [pesinatInput, setPesinatInput] = useState('');

  // Accordion toggles
  const [likiditeOpen, setLikiditeOpen] = useState(false);
  const [teminatOpen, setTeminatOpen] = useState(false);

  // Likidite inputs (Kullanıcı girmeden önce tutar olmaması için boş başlatılır)
  const [likiditeTab, setLikiditeTab] = useState<'bilanco' | 'isletme'>('bilanco');
  const [bilancoDv, setBilancoDv] = useState('');
  const [bilancoStok, setBilancoStok] = useState('');
  const [bilancoKy, setBilancoKy] = useState('');

  const [isletmeKasa, setIsletmeKasa] = useState('');
  const [isletmeBanka, setIsletmeBanka] = useState('');
  const [isletmeAlacak, setIsletmeAlacak] = useState('');
  const [isletmeBorclar, setIsletmeBorclar] = useState('');

  // Plan Tipi: 'kanuni' (6183 m.48 Artan Faizli - SGK Resmî Usulü) | 'esit' (Eşit Sabit Taksit)
  const [planTipi, setPlanTipi] = useState<'kanuni' | 'esit'>('kanuni');
  const [pesinatDahilMi, setPesinatDahilMi] = useState(false);

  // Hesaplama sonucu - Borç girilmeden önce boş cetvel
  const [hesapSonucu, setHesapSonucu] = useState(() => {
    return calculate6183(0, taksitSayisi, 0, pesinatTarihi, 39, 'kanuni', false);
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePlanTipiChange = (newPlan: 'kanuni' | 'esit') => {
    setPlanTipi(newPlan);
    const borc = parseTL(borcInput);
    const pesinat = parseTL(pesinatInput);
    const faiz = parseFloat(faizOraniInput) || 39;
    const res = calculate6183(borc, taksitSayisi, pesinat, pesinatTarihi, faiz, newPlan, pesinatDahilMi);
    setHesapSonucu(res);
    showToast(newPlan === 'kanuni' ? '6183 m.48 Resmî Kanuni Plan (artan faizli) seçildi.' : 'Eşit sabit taksitli plan seçildi.');
  };

  const handlePesinatDahilMiChange = (newPd: boolean) => {
    setPesinatDahilMi(newPd);
    const borc = parseTL(borcInput);
    const pesinat = parseTL(pesinatInput);
    const faiz = parseFloat(faizOraniInput) || 39;
    const res = calculate6183(borc, taksitSayisi, pesinat, pesinatTarihi, faiz, planTipi, newPd);
    setHesapSonucu(res);
    showToast(newPd ? 'Peşinat tablonun 1. sırasına dahil edildi.' : 'Peşinat tablodan ayrıldı.');
  };

  const handleBorcChange = (val: string) => {
    setBorcInput(val);
  };

  const handleBorcBlur = () => {
    const numeric = parseTL(borcInput);
    if (numeric > 0) {
      setBorcInput(formatTL(numeric));
      const autoPesinat = Math.round((numeric / taksitSayisi) * 100) / 100;
      setPesinatInput(formatTL(autoPesinat));
      const faiz = parseFloat(faizOraniInput) || 39;
      const res = calculate6183(numeric, taksitSayisi, autoPesinat, pesinatTarihi, faiz, planTipi, pesinatDahilMi);
      setHesapSonucu(res);
    }
  };

  const handlePesinatChange = (val: string) => {
    setPesinatInput(val);
    const num = parseTL(val);
    if (!isNaN(num) && num >= 0) {
      const borc = parseTL(borcInput);
      const faiz = parseFloat(faizOraniInput) || 39;
      const res = calculate6183(borc, taksitSayisi, num, pesinatTarihi, faiz, planTipi, pesinatDahilMi);
      setHesapSonucu(res);
    }
  };

  const runCalculation = () => {
    const borc = parseTL(borcInput);
    const pesinat = parseTL(pesinatInput);
    const faiz = parseFloat(faizOraniInput) || 39;
    const res = calculate6183(borc, taksitSayisi, pesinat, pesinatTarihi, faiz, planTipi, pesinatDahilMi);
    setHesapSonucu(res);
    trackEvent('tecil_hesaplama_yapildi', {
      borc_tutari: borc,
      vade: taksitSayisi,
      pesinat: pesinat,
      plan_tipi: planTipi,
    });
    showToast('Hesaplama başarıyla güncellendi.');
  };

  const handleSelectAlternativeVade = (newVade: number) => {
    setTaksitSayisi(newVade);
    setTaksitInput(newVade.toString());
    const borc = parseTL(borcInput);
    const autoPesinat = Math.round((borc / newVade) * 100) / 100;
    setPesinatInput(formatTL(autoPesinat));
    const faiz = parseFloat(faizOraniInput) || 39;
    const res = calculate6183(borc, newVade, autoPesinat, pesinatTarihi, faiz, planTipi, pesinatDahilMi);
    setHesapSonucu(res);
    showToast(`${newVade} aylık vade seçildi ve ilk taksit otomatik hesaplandı.`);
  };

  const handleTaksitSayisiChange = (newVade: number) => {
    if (isNaN(newVade) || newVade <= 0) return;
    const validVade = Math.min(72, Math.max(1, newVade));
    setTaksitSayisi(validVade);
    setTaksitInput(validVade.toString());
    const borc = parseTL(borcInput);
    // Taksit sayısı girilince peşinatı doğrudan otomatik hesapla (Borç / Taksit Sayısı)
    const autoPesinat = Math.round((borc / validVade) * 100) / 100;
    setPesinatInput(formatTL(autoPesinat));
    const faiz = parseFloat(faizOraniInput) || 39;
    const res = calculate6183(borc, validVade, autoPesinat, pesinatTarihi, faiz, planTipi, pesinatDahilMi);
    setHesapSonucu(res);
  };

  const handleBorcChangeFromModal = (newBorc: number, newPesinat?: number) => {
    if (isNaN(newBorc) || newBorc <= 0) return;
    setBorcInput(formatTL(newBorc));
    const pesinatVal = newPesinat !== undefined ? newPesinat : Math.round((newBorc / taksitSayisi) * 100) / 100;
    setPesinatInput(formatTL(pesinatVal));
    const faiz = parseFloat(faizOraniInput) || 39;
    const res = calculate6183(newBorc, taksitSayisi, pesinatVal, pesinatTarihi, faiz, planTipi, pesinatDahilMi);
    setHesapSonucu(res);
  };

  const handlePesinatChangeFromModal = (newPesinat: number) => {
    if (isNaN(newPesinat) || newPesinat < 0) return;
    setPesinatInput(formatTL(newPesinat));
    const borc = parseTL(borcInput);
    const faiz = parseFloat(faizOraniInput) || 39;
    const res = calculate6183(borc, taksitSayisi, newPesinat, pesinatTarihi, faiz, planTipi, pesinatDahilMi);
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
    ilMudurlugu: '',
    sgkMerkezi: '',
    unvan: '',
    sigortaNo: '',
    isyeriAdresi: '',
    tcknVkn: '',
    vergiDairesi: '',
    ticaretSicilNo: '',
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
      const autoPesinat = Math.round((amount / taksitSayisi) * 100) / 100;
      setPesinatInput(formatTL(autoPesinat));
      const faiz = parseFloat(faizOraniInput) || 39;
      const res = calculate6183(amount, taksitSayisi, autoPesinat, pesinatTarihi, faiz, planTipi, pesinatDahilMi);
      setHesapSonucu(res);
      showToast(`SGK dökümündeki tutar (${formatted} ₺) aktarıldı. İlk taksit (${formatTL(autoPesinat)} ₺) tecil planına yansıtıldı.`);
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
  const hasBilancoData = bilancoDv.trim() !== '' || bilancoStok.trim() !== '' || bilancoKy.trim() !== '';
  const bilancoOrani = bKy > 0 ? (bDv - bStok) / bKy : 0;

  // İşletme likidite
  const iKasa = parseTL(isletmeKasa);
  const iBanka = parseTL(isletmeBanka);
  const iAlacak = parseTL(isletmeAlacak);
  const iBorc = parseTL(isletmeBorclar);
  const hasIsletmeData = isletmeKasa.trim() !== '' || isletmeBanka.trim() !== '' || isletmeAlacak.trim() !== '' || isletmeBorclar.trim() !== '';
  const isletmeOrani = iBorc > 0 ? (iKasa + iBanka + iAlacak) / iBorc : 0;

  const isLikiditeCalculated = likiditeTab === 'bilanco' ? (hasBilancoData && bKy > 0) : (hasIsletmeData && iBorc > 0);
  const currentLikiditeRasyosu = likiditeTab === 'bilanco' ? bilancoOrani : isletmeOrani;


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
        onOpenMuvafakatname={() => setMuvafakatnameOpen(true)}
        theme={theme}
        onSelectTheme={(t) => setTheme(t)}
        isSiteOpen={isSiteOpen}
        onOpenSiteStatusModal={() => handleOpenAdminSection('status')}
        onOpenAnalytics={() => handleOpenAdminSection('analytics')}
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
          pesinatModeProp={pesinatMode}
          onPesinatModeChange={setPesinatMode}
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
                    placeholder="Örn: 100.000,00"
                    required
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">₺</span>
                </div>
              </div>

              {/* Taksit Sayısı */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Taksit Sayısı (Ay) *
                  </label>
                  <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">
                    1 - 72 Ay Doğrudan Giriş
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={taksitInput}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^\d]/g, '');
                      setTaksitInput(val);
                      const num = parseInt(val, 10);
                      if (!isNaN(num) && num >= 1 && num <= 72) {
                        handleTaksitSayisiChange(num);
                      }
                    }}
                    onBlur={() => {
                      const num = parseInt(taksitInput.replace(/[^\d]/g, ''), 10);
                      if (isNaN(num) || num < 1) {
                        handleTaksitSayisiChange(1);
                        setTaksitInput('1');
                      } else if (num > 72) {
                        handleTaksitSayisiChange(72);
                        setTaksitInput('72');
                      } else {
                        handleTaksitSayisiChange(num);
                        setTaksitInput(num.toString());
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const num = parseInt(taksitInput.replace(/[^\d]/g, ''), 10);
                        if (!isNaN(num) && num >= 1 && num <= 72) {
                          handleTaksitSayisiChange(num);
                        }
                      }
                    }}
                    className="form-control-custom font-black text-slate-900 dark:text-slate-100 pr-9 text-base w-full"
                    placeholder="Örn: 59"
                    required
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">Ay</span>
                </div>

                {/* Hızlı Vade Seçimi - Tek Satır (Asla 2 satıra taşmaz) */}
                <div className="flex items-center justify-between gap-1 pt-0.5 flex-nowrap text-[10px]">
                  <span className="text-slate-400 font-bold shrink-0">Hızlı:</span>
                  {[12, 24, 36, 48, 59, 72].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleTaksitSayisiChange(m)}
                      className={`px-1.5 py-0.5 rounded font-extrabold text-[10px] transition-all cursor-pointer shrink-0 ${
                        taksitSayisi === m
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-slate-500/10 hover:bg-slate-500/20 text-slate-700 dark:text-slate-300'
                      }`}
                      title={`${m} ay vadeyi doğrudan seç`}
                    >
                      {m} Ay
                    </button>
                  ))}
                </div>
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
                <div className="flex items-center justify-between flex-wrap gap-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <span>İlk Taksit / Peşinat *</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 font-bold border border-teal-500/20">
                      ⚡ Otomatik (1/{taksitSayisi})
                    </span>
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Taksit sayısına göre otomatik hesaplanır
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={pesinatInput}
                    onChange={(e) => handlePesinatChange(e.target.value)}
                    onBlur={() => {
                      const num = parseTL(pesinatInput);
                      if (num >= 0) setPesinatInput(formatTL(num));
                    }}
                    className="form-control-custom pr-9 font-bold text-amber-700 dark:text-amber-400"
                    placeholder="Otomatik hesaplanır"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">₺</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                  <span>
                    Taksit sayısı ({taksitSayisi} ay) girilince ilk taksit / peşinat doğrudan eşit bölünerek güncellenir.
                  </span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    %{parseTL(borcInput) > 0 ? ((parseTL(pesinatInput) / parseTL(borcInput)) * 100).toFixed(1) : '0.0'}
                  </span>
                </div>
              </div>
            </div>

            {/* 36 Ayı Aşan Tecillerde Uygulama Kuralları ve Gerekli Belgeler Rehberi */}
            {taksitSayisi > 36 && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-950 dark:text-amber-100 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-extrabold block text-sm text-amber-900 dark:text-amber-200">
                      ⚠️ {taksitSayisi} Ay Tecil İçin Uygulama Kuralları ve Kullanılacak Resmî Belgeler
                    </span>
                    <p className="text-xs text-amber-800 dark:text-amber-300/90 leading-relaxed">
                      SGK 2024/12 ve 2026/15 sayılı Genelgeleri uyarınca, <strong>36 ayı aşan ({taksitSayisi} ay)</strong> tecil taleplerinde <strong>kademeli taksitlendirme yapılamaz</strong>; yalnızca eşit taksitler halinde ödeme planı düzenlenebilir.
                    </p>
                  </div>
                </div>

                {/* Kullanılacak Resmî Belgeler ve Koşullar */}
                <div className="pt-2 border-t border-amber-500/20 grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                  {/* 1. Zor Durum Belgesi: Ek 1-a veya Ek 1-b */}
                  <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-amber-500/20 space-y-1.5 shadow-xs">
                    <div className="font-bold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
                      <FileCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>1. Zor Durum Tespit Belgesi:</span>
                    </div>
                    {currentBorc > 900000 ? (
                      <div className="text-[11px] text-slate-700 dark:text-slate-300 leading-normal">
                        Toplam borç <strong>{formatTL(currentBorc)} ₺</strong> (900.000 TL üzeri) olduğundan, borçludan <strong>SMMM veya YMM onaylı Çok Zor Durum Raporu (Ek 1-a)</strong> alınması zorunludur.
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-700 dark:text-slate-300 leading-normal">
                        Toplam borç <strong>{formatTL(currentBorc)} ₺</strong> (900.000 TL ve altı) olduğundan, borçlunun bizzat dolduracağı <strong>Mali Durum Bildirim Formu (Ek 1-b)</strong> yeterlidir.
                      </div>
                    )}
                  </div>

                  {/* 2. Rasyo / Likidite Oranı Şartı */}
                  <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-amber-500/20 space-y-1.5 shadow-xs">
                    <div className="font-bold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
                      <Scale className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span>2. Rasyo / Likidite Oranı Şartı:</span>
                    </div>
                    <div className="text-[11px] text-slate-700 dark:text-slate-300 leading-normal">
                      36 ayı aşan ({taksitSayisi} ay) tecil verilebilmesi için Ek 1-a / Ek 1-b formunda tespit edilecek likidite oranının mutlaka <strong>0,50 ve altında</strong> olması şarttır. <em>(0,51 - 1,00 arası ise azami 36 ay verilebilir).</em>
                    </div>
                  </div>

                  {/* 3. Teminat Belgesi */}
                  <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-amber-500/20 space-y-1.5 shadow-xs">
                    <div className="font-bold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>3. Teminat Belgesi (10 Milyon TL Sınırı):</span>
                    </div>
                    <div className="text-[11px] text-slate-700 dark:text-slate-300 leading-normal">
                      {currentTeminatGerekli ? (
                        <>Borç 10 Milyon TL'yi aştığından aşan tutarın %50'si (<strong>{formatTL(currentGerekenTeminat)} ₺</strong>) için <strong>Banka Teminat Mektubu veya Ek-9 Haciz Muvafakatnamesi</strong> aranır.</>
                      ) : (
                        <>Borç 10.000.000 TL altında kaldığından <strong>teminat aranmaz</strong>.</>
                      )}
                    </div>
                  </div>

                  {/* 4. Resmî Talep Formu */}
                  <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-amber-500/20 flex flex-col justify-between gap-2 shadow-xs">
                    <div>
                      <div className="font-bold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
                        <FileText className="w-4 h-4 text-teal-600 shrink-0" />
                        <span>4. Resmî Başvuru Formu:</span>
                      </div>
                      <div className="text-[11px] text-slate-700 dark:text-slate-300 leading-normal">
                        Borçlunun imzalı <strong>SGK Tecil ve Taksitlendirme Talep Formu</strong> (Ek-1) eksiksiz düzenlenmelidir.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTaksitFormuOpen(true)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px] cursor-pointer shadow-xs transition-all self-start"
                    >
                      <FileSignature className="w-3.5 h-3.5" />
                      <span>Resmî Formu Aç ve Düzenle</span>
                    </button>
                  </div>
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
                          placeholder="0,00"
                          onChange={(e) => setBilancoDv(e.target.value)}
                          className="form-control-custom font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold block mb-1">Stoklar (TL):</label>
                        <input
                          type="text"
                          value={bilancoStok}
                          placeholder="0,00"
                          onChange={(e) => setBilancoStok(e.target.value)}
                          className="form-control-custom font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold block mb-1">Kısa Vadeli Yabancı Kaynaklar (TL):</label>
                        <input
                          type="text"
                          value={bilancoKy}
                          placeholder="0,00"
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
                          placeholder="0,00"
                          onChange={(e) => setIsletmeKasa(e.target.value)}
                          className="form-control-custom font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold block mb-1">Banka (TL):</label>
                        <input
                          type="text"
                          value={isletmeBanka}
                          placeholder="0,00"
                          onChange={(e) => setIsletmeBanka(e.target.value)}
                          className="form-control-custom font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold block mb-1">Kısa Vadeli Alacaklar (TL):</label>
                        <input
                          type="text"
                          value={isletmeAlacak}
                          placeholder="0,00"
                          onChange={(e) => setIsletmeAlacak(e.target.value)}
                          className="form-control-custom font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold block mb-1">Kısa Vadeli Borçlar (TL):</label>
                        <input
                          type="text"
                          value={isletmeBorclar}
                          placeholder="0,00"
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
                        {isLikiditeCalculated ? currentLikiditeRasyosu.toFixed(2) : '-'}
                      </div>
                    </div>
                    <div className="text-right text-[11px]">
                      {!isLikiditeCalculated ? (
                        <span className="px-2.5 py-1 rounded-full bg-slate-500/10 text-slate-500 dark:text-slate-400 font-bold">
                          ℹ️ Rasyo için lütfen yukarıdaki tutarları giriniz
                        </span>
                      ) : currentLikiditeRasyosu <= 0.5 ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-bold">
                          ✓ Çok Zor Durum: Azami 72 Aya Kadar Tecil Edilebilir
                        </span>
                      ) : currentLikiditeRasyosu <= 1.0 ? (
                        <span className="px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-600 font-bold">
                          ✓ Çok Zor Durum: Azami 36 Aya Kadar Tecil Edilebilir
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 font-bold">
                          ✕ Likidite &gt; 1,00 Olduğundan Tecil Talebi Reddedilir
                        </span>
                      )}
                    </div>
                  </div>

                  {/* İstenen Zor Durum Formu (900.000 TL Kuralı) */}
                  <div className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2" style={{ borderColor: 'var(--border-primary)' }}>
                    <div>
                      <span className="font-bold text-slate-700 dark:text-slate-200 block text-xs">
                        Zor Durum Tespit Belgesi (2024/12 &amp; 2026/15 Genelgeleri):
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {currentBorc > 900000
                          ? `Borç tutarı 900.000 TL'yi aştığından (${formatTL(currentBorc)} ₺)`
                          : `Borç tutarı 900.000 TL ve altında olduğundan (${formatTL(currentBorc)} ₺)`}
                      </span>
                    </div>
                    <div>
                      {currentBorc > 900000 ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-extrabold text-[11px] border border-amber-500/30">
                          📄 Ek 1-a: SMMM / YMM Onaylı Çok Zor Durum Raporu
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-300 font-extrabold text-[11px] border border-teal-500/30">
                          📝 Ek 1-b: Borçlu Beyanına Dayalı Mali Durum Bildirim Formu
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
                <span className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100">
                  {formatTL(hesapSonucu.anaPara)} ₺
                </span>
              </div>

              {/* Peşinat */}
              <div
                className="p-4 rounded-2xl border shadow-sm space-y-1"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
              >
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 block">İlk Taksit (Peşinat)</span>
                <span className="text-sm sm:text-base font-black text-amber-700 dark:text-amber-400">
                  {formatTL(hesapSonucu.pesinat)} ₺
                </span>
              </div>

              {/* Kalan Borç */}
              <div
                className="p-4 rounded-2xl border shadow-sm space-y-1"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
              >
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">Tecile Konu Borç</span>
                <span className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100">
                  {formatTL(hesapSonucu.kalanBorc)} ₺
                </span>
              </div>

              {/* Taksit Sayısı */}
              <div
                className="p-4 rounded-2xl border shadow-sm space-y-1"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
              >
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">Vade Süresi</span>
                <span className="text-sm sm:text-base font-black text-teal-700 dark:text-teal-400">
                  {hesapSonucu.taksitSayisi} Ay
                </span>
              </div>

              {/* Toplam Tecil Faizi */}
              <div
                className="p-4 rounded-2xl border shadow-sm space-y-1"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
              >
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 block">Toplam Tecil Faizi</span>
                <span className="text-sm sm:text-base font-black text-amber-700 dark:text-amber-400">
                  {formatTL(hesapSonucu.toplamFaiz)} ₺
                </span>
              </div>

              {/* Aylık Taksit Tutarı */}
              <div
                className="p-4 rounded-2xl border shadow-sm space-y-1 bg-teal-500/10 border-teal-500/30"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-teal-800 dark:text-teal-300 block">
                    {planTipi === 'kanuni' ? 'Taksit Aralığı (6183 m.48)' : 'Aylık Sabit Taksit'}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-teal-600 text-white font-bold">
                    {planTipi === 'kanuni' ? 'Yasal' : 'Eşit'}
                  </span>
                </div>
                {planTipi === 'kanuni' ? (
                  <div>
                    <div className="text-xs sm:text-sm font-black text-teal-900 dark:text-teal-200">
                      {formatTL(hesapSonucu.ilkTaksitTutari)} ₺ → {formatTL(hesapSonucu.sonTaksitTutari)} ₺
                    </div>
                    <div className="text-[10px] text-teal-700 dark:text-teal-400 font-medium">
                      Ort: {formatTL(hesapSonucu.aylikSabitTaksit)} ₺ / ay
                    </div>
                  </div>
                ) : (
                  <span className="text-sm sm:text-base font-black text-teal-900 dark:text-teal-200">
                    {formatTL(hesapSonucu.aylikSabitTaksit)} ₺
                  </span>
                )}
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
              kalanBorc={hesapSonucu.kalanBorc}
              pesinat={hesapSonucu.pesinat}
              toplamFaiz={hesapSonucu.toplamFaiz}
              toplamOdeme={hesapSonucu.toplamOdeme}
              taksitSayisi={hesapSonucu.taksitSayisi}
              faizOrani={hesapSonucu.faizOrani}
              planTipi={planTipi}
              onPlanTipiChange={handlePlanTipiChange}
              pesinatDahilMi={pesinatDahilMi}
              onPesinatDahilMiChange={handlePesinatDahilMiChange}
              ilkTaksitTutari={hesapSonucu.ilkTaksitTutari}
              sonTaksitTutari={hesapSonucu.sonTaksitTutari}
              aylikSabitTaksit={hesapSonucu.aylikSabitTaksit}
            />
          </section>
        )}
      </main>

      {/* Kurumsal Alt Bilgi, Yasal Sorumluluk Reddi ve Gizli Yönetici Tetikleyicisi */}
      <footer className="mt-auto py-5 border-t text-xs text-slate-500 no-print" style={{ borderColor: 'var(--border-primary)' }}>
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] leading-relaxed">
          <p className="text-slate-500 dark:text-slate-400 text-left max-w-4xl">
            <strong className="text-slate-700 dark:text-slate-300 font-bold">Yasal Sorumluluk Reddi:</strong>{' '}
            Bu programın kullanımı tamamen kullanıcının kendi sorumluluğundadır. Program sağlayıcıları; doğruluk, eksiksizlik, güncellik veya belirli bir amaca uygunluk konusunda hiçbir garanti vermemektedir. Kullanıcı, yürürlükteki mevzuata uymakla ve programın kullanımından doğabilecek tüm sorumluluğu kabul etmekle yükümlüdür. Program üzerinden sunulan içerikler hukuki, mali veya profesyonel danışmanlık niteliği taşımaz.
          </p>
          <div className="flex items-center gap-2.5 text-slate-400 shrink-0 self-end md:self-center">
            {/* Yönetici Oturumu Açıkken Görünen Kontroller (YALNIZCA PIN İLE GİRİŞ YAPILDIKTAN SONRA GÖRÜNÜR) */}
            {adminUnlockedSession && (
              <>
                <button
                  type="button"
                  onClick={() => handleOpenAdminSection('analytics')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 text-[11px] font-bold border border-teal-500/25 transition-all cursor-pointer shadow-xs"
                  title="Yalnızca Yetkili Yönetici Görür: Canlı Ziyaretçi Sayacı ve Google Analytics"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Ziyaretçi Sayacı</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenAdminSection('status')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                    isSiteOpen
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20'
                  }`}
                  title="Yönetici Paneli (Canlı / Bakım Ayarı)"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isSiteOpen ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
                  <span>{isSiteOpen ? 'Site: Canlı' : 'Site: Kapalı'}</span>
                </button>

                {/* Oturumu Kapat / Gizle Butonu */}
                <button
                  type="button"
                  onClick={() => {
                    setAdminUnlockedSession(false);
                    try {
                      sessionStorage.removeItem('sgk_admin_unlocked');
                      sessionStorage.removeItem('sgk_admin_pin');
                    } catch {}
                    showToast('Yönetici oturumu kapatıldı. Kontroller gizlendi.');
                  }}
                  className="px-2 py-0.5 rounded-full bg-slate-500/10 hover:bg-rose-500/15 text-slate-400 hover:text-rose-500 text-[10px] font-medium transition-all cursor-pointer"
                  title="Yönetici oturumunu kapat ve kontrolleri gizle"
                >
                  Çıkış
                </button>
              </>
            )}

            {/* Telif Yazısı: Çift tıklandığında yalnızca yöneticinin bildiği gizli doğrulama penceresini açar */}
            <span
              onDoubleClick={() => handleOpenAdminSection('status')}
              className="font-mono cursor-default select-none text-slate-400 dark:text-slate-500"
              title="T.C. Sosyal Güvenlik Kurumu"
            >
              © {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </footer>

      {/* Tools Drawer */}
      <ToolsDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeSection={drawerTab}
        drawerTitle={drawerTitle}
        onOpenMuvafakatname={() => setMuvafakatnameOpen(true)}
      />

      {/* Resmî Muvafakatname ve Belge Düzenleyici Modalı */}
      <MuvafakatnameModal
        isOpen={muvafakatnameOpen}
        onClose={() => setMuvafakatnameOpen(false)}
        initialBorrower={borcluInfo}
      />

      {/* Site Canlı Durumu (Açık / Kapalı) Ayar Modalı */}
      <SiteStatusModal
        isOpen={siteStatusModalOpen}
        onClose={() => setSiteStatusModalOpen(false)}
        isSiteOpen={isSiteOpen}
        onToggleSiteStatus={handleToggleSiteStatus}
        onPreviewMaintenance={() => setPreviewVisitorView(true)}
        onOpenAnalytics={() => setAnalyticsModalOpen(true)}
        onOpenChangePin={() => setAdminAuthModalOpen(true)}
      />

      {/* Ziyaretçi Sayacı ve Google Analytics Modalı */}
      <AnalyticsModal
        isOpen={analyticsModalOpen}
        onClose={() => setAnalyticsModalOpen(false)}
      />

      {/* Yönetici Doğrulama (PIN / Email) Modalı */}
      <AdminAuthModal
        isOpen={adminAuthModalOpen}
        onClose={() => setAdminAuthModalOpen(false)}
        onSuccess={handleAdminAuthSuccess}
      />
    </div>
  );
}
