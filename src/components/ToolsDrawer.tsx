import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Scale,
  Building2,
  Send,
  BookOpen,
  Copy,
  Check,
  Search,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  AlertTriangle,
  FileText,
  Save,
  CheckCircle2,
  FileSignature,
  ChevronDown,
  Info
} from 'lucide-react';
import { INITIAL_BANKALAR } from '../data/bankalar';
import { KNOWLEDGE_BASE } from '../data/knowledge';
import { formatTL, formatDateTR } from '../utils/calculator';
import { safeStorage } from '../utils/storage';
import { Banka } from '../types';

const TOOL_CONFIG: Record<
  'maasTab' | 'bankaTab' | 'tebligatTab' | 'bilgiTab',
  {
    title: string;
    subtitle: string;
    icon: React.ElementType;
    badgeColor: string;
    iconColor: string;
  }
> = {
  maasTab: {
    title: 'Maaş Haczi Hesaplama',
    subtitle: 'İİK Md. 83 & 6183 Md. 71 yasal kesinti hesaplama aracı',
    icon: Scale,
    badgeColor: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-700 dark:text-indigo-300',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
  },
  bankaTab: {
    title: 'Banka Rehberi & DETSİS/KEP',
    subtitle: 'Bankaların resmi VKN, DETSİS ve KEP tebligat adresleri',
    icon: Building2,
    badgeColor: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  tebligatTab: {
    title: 'Tebligat Süre Hesaplama',
    subtitle: '7201 s.K. 7/a elektronik & fiziki tebligat yasal süre sayacı',
    icon: Send,
    badgeColor: 'bg-sky-500/10 border-sky-500/20 text-sky-700 dark:text-sky-300',
    iconColor: 'text-sky-600 dark:text-sky-400',
  },
  bilgiTab: {
    title: 'Bilgi Portalı & Mevzuat Notları',
    subtitle: '2024/12 & 2026/15 Genelgeler, 6183 & 5510 kanun maddeleri',
    icon: BookOpen,
    badgeColor: 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
};

interface ToolsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: 'maasTab' | 'bankaTab' | 'tebligatTab' | 'bilgiTab';
  drawerTitle: string;
  onOpenMuvafakatname?: () => void;
}

export const ToolsDrawer: React.FC<ToolsDrawerProps> = ({
  isOpen,
  onClose,
  activeSection,
  drawerTitle,
  onOpenMuvafakatname,
}) => {
  const [currentTab, setCurrentTab] = useState<'maasTab' | 'bankaTab' | 'tebligatTab' | 'bilgiTab'>(
    activeSection
  );
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setSwitcherOpen(false);
      }
    };
    if (switcherOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [switcherOpen]);

  useEffect(() => {
    setCurrentTab(activeSection);
  }, [activeSection]);

  // Toast message
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  // -------------------------------------------------------------
  // 1. MAAŞ HACZİ HESAPLAMA STATE (6183 S.K. Md. 71 & Değişken Asgari Ücret)
  // -------------------------------------------------------------
  const [asgariUcretInput, setAsgariUcretInput] = useState(() => {
    return safeStorage.getItem('sgk_asgari_ucret', '28.000,75');
  });
  const [maasInput, setMaasInput] = useState('30.000,00');
  const [asgariUstuSecim, setAsgariUstuSecim] = useState<'1/4' | '1/3'>('1/4');
  const [maasCopied, setMaasCopied] = useState(false);

  const maasNum = parseFloat(maasInput.replace(/\./g, '').replace(',', '.')) || 0;
  const asgariUcretNum = parseFloat(asgariUcretInput.replace(/\./g, '').replace(',', '.')) || 28000.75;
  const toplamNetGelir = maasNum;

  // 6183 S.K. Md. 71 değerlendirmesi: Gelir asgari ücret veya altında mı?
  const isAsgariUcretAltiVeyaEsit = toplamNetGelir <= asgariUcretNum;

  // 1/10 Kesintisi (Asgari ücret ve altı için kanuni azami kesinti)
  const kesinti10 = Math.round((toplamNetGelir / 10) * 100) / 100;
  const kalan10 = Math.round((toplamNetGelir - kesinti10) * 100) / 100;

  // 1/4 Kesintisi (Asgari ücret üstü için standart tavsiye edilen kesinti - İİK 83)
  const kesinti4 = Math.round((toplamNetGelir / 4) * 100) / 100;
  const kalan4 = Math.round((toplamNetGelir - kesinti4) * 100) / 100;

  // 1/3 Kesintisi (Asgari ücret üstü için kanuni üst tavan - 6183 Md. 71)
  const kesinti3 = Math.round((toplamNetGelir / 3) * 100) / 100;
  const kalan3 = Math.round((toplamNetGelir - kesinti3) * 100) / 100;

  // Nihai seçilen/uygulanan kesinti ve borçluya kalan maaş
  const aktifKesintiTutari = isAsgariUcretAltiVeyaEsit
    ? kesinti10
    : asgariUstuSecim === '1/3'
    ? kesinti3
    : kesinti4;

  const aktifKalanMaas = Math.round((toplamNetGelir - aktifKesintiTutari) * 100) / 100;

  const handleAsgariUcretChange = (val: string) => {
    setAsgariUcretInput(val);
    safeStorage.setItem('sgk_asgari_ucret', val);
  };

  const handleCopyMaasSonuc = () => {
    const text = `
6183 SAYILI KANUN MD. 71 & İİK MD. 83 MAAŞ HACZİ KESİNTİ HESAPLAMASI
-----------------------------------------------------------------
• Dikkate Alınan Net Asgari Ücret: ${formatTL(asgariUcretNum)} TL
• Borçlunun Aylık Net Maaşı       : ${formatTL(maasNum)} TL
• Hukuki Durum                    : ${isAsgariUcretAltiVeyaEsit ? 'Asgari Ücret ve Altında (Azami 1/10 Kesinti Zorunlu)' : `Asgari Ücretin Üzerinde (${asgariUstuSecim} Kesinti Seçildi)`}
• Haczedilecek Aylık Kesinti Tutarı: ${formatTL(aktifKesintiTutari)} TL (${isAsgariUcretAltiVeyaEsit ? '1/10' : asgariUstuSecim})
• Borçluya Bırakılacak Kalan Maaş : ${formatTL(aktifKalanMaas)} TL
-----------------------------------------------------------------
Yasal Dayanak: 6183 S.K. Md. 71 uyarınca asgari ücreti aşmayan gelir için 1/10'dan az, aşan kısım için 1/3'ten çok haciz yapılamaz.
    `.trim();

    navigator.clipboard.writeText(text);
    setMaasCopied(true);
    setTimeout(() => setMaasCopied(false), 2000);
  };

  // -------------------------------------------------------------
  // 2. BANKA REHBERİ STATE
  // -------------------------------------------------------------
  const [bankalar, setBankalar] = useState<Banka[]>(() => {
    try {
      const saved = safeStorage.getItem('sgk_bankalar');
      return saved ? JSON.parse(saved) : INITIAL_BANKALAR;
    } catch {
      return INITIAL_BANKALAR;
    }
  });
  const [bankSearch, setBankSearch] = useState('');
  const [selectedBankIdx, setSelectedBankIdx] = useState<number | null>(null);

  const filteredBanks = bankalar.filter(
    (b) =>
      b.n.toLowerCase().includes(bankSearch.toLowerCase()) ||
      b.v.includes(bankSearch) ||
      b.k.toLowerCase().includes(bankSearch.toLowerCase()) ||
      b.d.includes(bankSearch)
  );

  // -------------------------------------------------------------
  // 3. TEBLİGAT SÜRE HESAPLAMA STATE
  // -------------------------------------------------------------
  const [tebligatTuru, setTebligatTuru] = useState<'fiziki' | 'elektronik'>('elektronik');
  const [tebligatTarihi, setTebligatTarihi] = useState(() => new Date().toISOString().split('T')[0]);
  const [sureGun, setSureGun] = useState<number>(15);

  const calculateTebligatSonu = () => {
    const base = new Date(tebligatTarihi);
    if (isNaN(base.getTime())) return { tebligTarihi: '', sonGun: '' };

    let tebligEdilmisSayilanTarih = new Date(base);
    if (tebligatTuru === 'elektronik') {
      // 7201 s.K. 7/a maddesi gereğince iletildiği tarihi izleyen 5. günün sonunda tebliğ edilmiş sayılır
      tebligEdilmisSayilanTarih.setDate(base.getDate() + 5);
    }

    const sonGunTarihi = new Date(tebligEdilmisSayilanTarih);
    sonGunTarihi.setDate(tebligEdilmisSayilanTarih.getDate() + sureGun);

    return {
      tebligTarihi: formatDateTR(tebligEdilmisSayilanTarih.toISOString().split('T')[0]),
      sonGun: formatDateTR(sonGunTarihi.toISOString().split('T')[0]),
    };
  };

  const tebligatSonuc = calculateTebligatSonu();

  // -------------------------------------------------------------
  // 4. BİLGİ PORTALI STATE (Yalnızca Mevzuat, Genelge ve Notlar!)
  // -------------------------------------------------------------
  const [bilgiSubTab, setBilgiSubTab] = useState<'genelge' | '6183' | '5510' | 'notlar'>('genelge');
  const [bilgiSearch, setBilgiSearch] = useState('');
  const [kisiselNot, setKisiselNot] = useState(() => safeStorage.getItem('sgk_kisisel_not', ''));
  const [notKaydedildi, setNotKaydedildi] = useState(false);

  const saveNote = (val: string) => {
    setKisiselNot(val);
    safeStorage.setItem('sgk_kisisel_not', val);
    setNotKaydedildi(true);
    setTimeout(() => setNotKaydedildi(false), 2000);
  };

  const filteredKnowledge = KNOWLEDGE_BASE.filter(
    (k) =>
      (bilgiSubTab === 'genelge' ? k.category === 'genelge' : k.category === bilgiSubTab) &&
      (k.title.toLowerCase().includes(bilgiSearch.toLowerCase()) ||
        k.summary.toLowerCase().includes(bilgiSearch.toLowerCase()) ||
        k.content.toLowerCase().includes(bilgiSearch.toLowerCase()))
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-2xl h-full shadow-2xl border-l flex flex-col animate-in slide-in-from-right duration-200"
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderColor: 'var(--border-primary)',
          color: 'var(--text-primary)',
        }}
      >
        {/* Drawer Header: Dedicated to Active Tool (No redundant nested tab bar!) */}
        {(() => {
          const activeTool = TOOL_CONFIG[currentTab];
          const ActiveIcon = activeTool.icon;

          return (
            <div
              className="p-4 sm:px-6 border-b flex items-center justify-between gap-3 shrink-0"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-primary)',
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`p-2.5 rounded-xl border shrink-0 ${activeTool.badgeColor}`}>
                  <ActiveIcon className={`w-5 h-5 ${activeTool.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black tracking-tight truncate text-slate-900 dark:text-white">
                      {activeTool.title}
                    </h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-600 dark:text-slate-300 hidden sm:inline-block">
                      Yardımcı Araç
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate hidden sm:block">
                    {activeTool.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Fast Switcher Dropdown (Tucked away, doesn't clutter the page) */}
                <div className="relative" ref={switcherRef}>
                  <button
                    type="button"
                    onClick={() => setSwitcherOpen(!switcherOpen)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer hover:bg-slate-500/10"
                    style={{ borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
                    title="Diğer araçlara geçiş yap"
                  >
                    <span>Diğer Araçlar</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${switcherOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {switcherOpen && (
                    <div
                      className="absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl border p-1.5 text-xs z-50 animate-in fade-in zoom-in-95 duration-150"
                      style={{
                        backgroundColor: 'var(--bg-elevated)',
                        borderColor: 'var(--border-primary)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b mb-1" style={{ borderColor: 'var(--border-primary)' }}>
                        Yardımcı Araç Değiştir
                      </div>

                      {(Object.keys(TOOL_CONFIG) as Array<keyof typeof TOOL_CONFIG>).map((key) => {
                        const t = TOOL_CONFIG[key];
                        const Icon = t.icon;
                        const isSelected = currentTab === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => {
                              setCurrentTab(key);
                              setSwitcherOpen(false);
                            }}
                            className={`w-full flex items-center gap-2.5 p-2 rounded-xl transition-colors text-left cursor-pointer ${
                              isSelected
                                ? 'bg-slate-500/15 font-bold text-slate-900 dark:text-white'
                                : 'hover:bg-slate-500/10 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <div className={`p-1.5 rounded-lg border ${t.badgeColor}`}>
                              <Icon className={`w-3.5 h-3.5 ${t.iconColor}`} />
                            </div>
                            <div className="truncate flex-1">
                              <div className="font-semibold text-xs truncate">{t.title}</div>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />}
                          </button>
                        );
                      })}

                      {onOpenMuvafakatname && (
                        <div className="pt-1 mt-1 border-t" style={{ borderColor: 'var(--border-primary)' }}>
                          <button
                            type="button"
                            onClick={() => {
                              onOpenMuvafakatname();
                              onClose();
                            }}
                            className="w-full flex items-center gap-2.5 p-2 rounded-xl transition-colors text-left cursor-pointer bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold"
                          >
                            <FileSignature className="w-3.5 h-3.5 text-amber-600" />
                            <span>EK-9 Muvafakatname</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-slate-500/10 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                  title="Kapat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })()}

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* ============================================================== */}
          {/* 1. MAAŞ HACZİ                                                  */}
          {/* ============================================================== */}
          {currentTab === 'maasTab' && (
            <div className="space-y-4">
              {/* Main Inputs Card */}
              <div
                className="p-4 sm:p-5 rounded-2xl border space-y-4 shadow-xs"
                style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-primary)' }}
              >
                <div className="flex items-center justify-between gap-2 border-b pb-3" style={{ borderColor: 'var(--border-primary)' }}>
                  <div className="font-bold text-sm text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
                    <Scale className="w-4 h-4" />
                    <span>6183 S.K. Md. 71 &amp; İİK Md. 83 Maaş Haczi Hesaplama</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                    Otomatik Yasal Kural
                  </span>
                </div>

                {/* 1. ASGARİ ÜCRET GİRİŞ ALANI (Kullanıcı istediği zaman güncelleyebilir) */}
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-[11px] font-extrabold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                      <span>📌 Yürürlükteki Net Asgari Ücret (TL):</span>
                    </label>
                    <span className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold hidden sm:inline">
                      (Değişken — dilediğiniz gibi güncelleyebilirsiniz)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={asgariUcretInput}
                        onChange={(e) => handleAsgariUcretChange(e.target.value)}
                        onBlur={() => {
                          const num = parseFloat(asgariUcretInput.replace(/\./g, '').replace(',', '.')) || 0;
                          if (num > 0) handleAsgariUcretChange(formatTL(num));
                        }}
                        placeholder="28.000,75"
                        className="form-control-custom font-mono font-bold text-amber-900 dark:text-amber-100 bg-white dark:bg-stone-900 pr-8"
                      />
                      <span className="absolute right-3 top-2.5 text-stone-400 font-bold text-xs pointer-events-none">₺</span>
                    </div>

                    {/* Hızlı Hazır Değer Butonları */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleAsgariUcretChange('28.000,75')}
                        className="px-2 py-1.5 rounded-lg border text-[10px] font-bold bg-white dark:bg-stone-900 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 hover:bg-amber-100/60 cursor-pointer transition-colors"
                        title="2026 Net Asgari Ücreti (28.000,75 TL)"
                      >
                        28.000,75 ₺
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAsgariUcretChange('30.000,00')}
                        className="px-2 py-1.5 rounded-lg border text-[10px] font-bold bg-white dark:bg-stone-900 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 hover:bg-amber-100/60 cursor-pointer transition-colors"
                        title="30.000,00 TL"
                      >
                        30.000 ₺
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-amber-800/80 dark:text-amber-300/80 leading-relaxed">
                    Sistem borçlunun aylık gelirini bu tutarla kıyaslayarak kanunen <strong>1/10</strong> mu yoksa <strong>1/4 - 1/3</strong> kuralının mı uygulanacağını otomatik belirler.
                  </p>
                </div>

                {/* 2. MAAŞ VE EK GELİR GİRİŞLERİ */}
                {/* 2. MAAŞ GİRİŞİ */}
                <div>
                  <label className="text-[11px] font-bold block mb-1">Borçlunun Aylık Net Maaşı (TL) *</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={maasInput}
                      onChange={(e) => setMaasInput(e.target.value)}
                      onBlur={() => {
                        const num = parseFloat(maasInput.replace(/\./g, '').replace(',', '.')) || 0;
                        if (num > 0) setMaasInput(formatTL(num));
                      }}
                      placeholder="0,00"
                      className="form-control-custom font-mono font-bold text-sm pr-8"
                    />
                    <span className="absolute right-3 top-2.5 text-stone-400 font-bold text-xs pointer-events-none">₺</span>
                  </div>
                </div>

                {/* 3. DİNAMİK SONUÇ KARTLARI (Html dosyasındaki gibi akıllı tespit) */}
                {toplamNetGelir > 0 && (
                  <div className="space-y-3 pt-2 border-t" style={{ borderColor: 'var(--border-primary)' }}>
                    {isAsgariUcretAltiVeyaEsit ? (
                      /* DURUM 1: Maaş <= Asgari Ücret -> 1/10 Kuralı Zorunlu */
                      <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500/60 text-emerald-950 dark:text-emerald-100 space-y-2.5 shadow-2xs">
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-extrabold text-sm text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>✅ 1/10 Kuralı Uygulanır (Asgari Ücret ve Altı)</span>
                          </div>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-200/80 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200">
                            6183 S.K. Md. 71
                          </span>
                        </div>

                        <p className="text-xs text-emerald-900/90 dark:text-emerald-200 leading-relaxed">
                          Toplam aylık net gelir (<strong>{formatTL(toplamNetGelir)} TL</strong>), belirlenen asgari ücretin (<strong>{formatTL(asgariUcretNum)} TL</strong>) altında veya eşit olduğundan kanunen azami kesinti oranı <strong>1/10 (%10)</strong> ile sınırlandırılmıştır.
                        </p>

                        <div className="pt-2 border-t border-emerald-300/60 dark:border-emerald-800/60 flex flex-wrap items-baseline justify-between gap-2">
                          <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                            Maksimum Yasal Kesinti (1/10):
                          </span>
                          <span className="font-mono font-black text-xl text-emerald-700 dark:text-emerald-300">
                            {formatTL(kesinti10)} TL
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-[11px] text-emerald-800/80 dark:text-emerald-300/80 pt-0.5">
                          <span>Borçluya Bırakılacak Kalan Maaş:</span>
                          <span className="font-mono font-bold text-xs">{formatTL(kalan10)} TL</span>
                        </div>
                      </div>
                    ) : (
                      /* DURUM 2: Maaş > Asgari Ücret -> 1/4 Standart & 1/3 Azami Sınır */
                      <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border-2 border-blue-500/50 text-blue-950 dark:text-blue-100 space-y-3 shadow-2xs">
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-extrabold text-sm text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                            <Info className="w-4 h-4 text-blue-600" />
                            <span>ℹ️ Asgari Ücret Üstü Gelir</span>
                          </div>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-200/80 dark:bg-blue-900/60 text-blue-900 dark:text-blue-200">
                            İİK 83 &amp; 6183 Md. 71
                          </span>
                        </div>

                        <p className="text-xs text-blue-900/90 dark:text-blue-200 leading-relaxed">
                          Toplam aylık net gelir (<strong>{formatTL(toplamNetGelir)} TL</strong>), asgari ücretin (<strong>{formatTL(asgariUcretNum)} TL</strong>) üzerindedir. Kanunen standart tavsiye edilen kesinti <strong>1/4 (%25)</strong>, yasal azami üst tavan ise <strong>1/3 (%33.33)</strong>'tür.
                        </p>

                        {/* Seçim Butonları */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setAsgariUstuSecim('1/4')}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                              asgariUstuSecim === '1/4'
                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                : 'bg-white dark:bg-stone-900 border-blue-200 dark:border-blue-800 hover:bg-blue-100/50 text-stone-800 dark:text-stone-200'
                            }`}
                          >
                            <div className="text-[10px] font-bold uppercase opacity-80">Standart Öneri</div>
                            <div className="text-xs font-extrabold">1/4 Kesinti (%25)</div>
                            <div className="font-mono font-black text-sm mt-0.5">{formatTL(kesinti4)} ₺</div>
                            <div className="text-[10px] opacity-75 mt-0.5">Kalan: {formatTL(kalan4)} ₺</div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setAsgariUstuSecim('1/3')}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                              asgariUstuSecim === '1/3'
                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                : 'bg-white dark:bg-stone-900 border-blue-200 dark:border-blue-800 hover:bg-blue-100/50 text-stone-800 dark:text-stone-200'
                            }`}
                          >
                            <div className="text-[10px] font-bold uppercase opacity-80">Yasal Üst Tavan</div>
                            <div className="text-xs font-extrabold">1/3 Kesinti (%33.3)</div>
                            <div className="font-mono font-black text-sm mt-0.5">{formatTL(kesinti3)} ₺</div>
                            <div className="text-[10px] opacity-75 mt-0.5">Kalan: {formatTL(kalan3)} ₺</div>
                          </button>
                        </div>

                        <div className="pt-2 border-t border-blue-200 dark:border-blue-800 flex justify-between items-baseline">
                          <span className="text-xs font-bold text-blue-900 dark:text-blue-200">
                            Uygulanacak Kesinti ({asgariUstuSecim}):
                          </span>
                          <span className="font-mono font-black text-xl text-blue-700 dark:text-blue-300">
                            {formatTL(aktifKesintiTutari)} TL
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-[11px] text-blue-800/80 dark:text-blue-300/80">
                          <span>Borçluya Kalan Tutar:</span>
                          <span className="font-mono font-bold text-xs">{formatTL(aktifKalanMaas)} TL</span>
                        </div>
                      </div>
                    )}

                    {/* Kopyala Butonu */}
                    <button
                      type="button"
                      onClick={handleCopyMaasSonuc}
                      className="w-full py-2.5 px-4 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
                    >
                      {maasCopied ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Maaş Haczi Bilgisi Kopyalandı!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-stone-500" />
                          <span>Haciz Hesap Sonucunu Kopyala</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* 4. YASAL MEVZUAT BİLGİLENDİRME NOTU (Html dosyasındaki gibi) */}
                <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/60 space-y-1 text-[11px] text-stone-600 dark:text-stone-300">
                  <div className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                    <span>📚 6183 S.K. Md. 71 &amp; İİK Md. 83 Yasal Dayanak:</span>
                  </div>
                  <p className="leading-relaxed">
                    6183 sayılı Kanun m. 71 uyarınca borçlunun maaş ve ücretleri kısmen haczedilebilir. Ancak haczolunacak miktar <strong>asgari ücreti aşmayan kısım için 1/10'dan az olamaz</strong>. Gelir asgari ücreti aştığında ise İİK Md. 83 uyarınca <strong>1/4 standart</strong>, 6183 Md. 71 uyarınca <strong>1/3 yasal üst sınır</strong> kabul edilir.
                  </p>
                  <div className="pt-1 text-[10px] text-stone-500 dark:text-stone-400 font-medium">
                    Aktif dikkate alınan asgari ücret: <span className="font-mono font-bold text-stone-700 dark:text-stone-300">{formatTL(asgariUcretNum)} TL</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 2. BANKA REHBERİ                                               */}
          {/* ============================================================== */}
          {currentTab === 'bankaTab' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={bankSearch}
                  onChange={(e) => setBankSearch(e.target.value)}
                  placeholder="Banka adı, VKN, DETSİS veya KEP ara..."
                  className="form-control-custom pl-9"
                />
              </div>

              <div className="space-y-2.5">
                {filteredBanks.map((b, idx) => (
                  <div
                    key={b.c + idx}
                    className="p-3.5 rounded-2xl border transition-all"
                    style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-primary)' }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">{b.n}</div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-500/10 font-mono font-bold">
                        Kod: {b.c}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2.5 text-[11px]">
                      <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-500/5">
                        <span className="text-slate-500">VKN:</span>
                        <div className="flex items-center gap-1 font-mono font-bold">
                          <span>{b.v}</span>
                          <button
                            onClick={() => handleCopy(b.v, `vkn-${idx}`)}
                            className="p-1 hover:text-emerald-600"
                            title="Kopyala"
                          >
                            {copiedKey === `vkn-${idx}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-500/5">
                        <span className="text-slate-500">DETSİS:</span>
                        <div className="flex items-center gap-1 font-mono font-bold">
                          <span>{b.d}</span>
                          <button
                            onClick={() => handleCopy(b.d, `detsis-${idx}`)}
                            className="p-1 hover:text-emerald-600"
                            title="Kopyala"
                          >
                            {copiedKey === `detsis-${idx}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 p-1.5 rounded-lg bg-slate-500/5 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">KEP Adresi:</span>
                      <div className="flex items-center gap-1 font-mono font-semibold truncate">
                        <span className="truncate">{b.k}</span>
                        <button
                          onClick={() => handleCopy(b.k, `kep-${idx}`)}
                          className="p-1 hover:text-emerald-600"
                          title="Kopyala"
                        >
                          {copiedKey === `kep-${idx}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 3. TEBLİGAT SÜRE HESAPLAMA                                      */}
          {/* ============================================================== */}
          {currentTab === 'tebligatTab' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl border space-y-4" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-primary)' }}>
                <div className="font-bold text-sm text-sky-700 dark:text-sky-400 flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  <span>Tebligat ve Yasal Süre Takibi (7201 s.K. 7/a &amp; 6183)</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTebligatTuru('elektronik')}
                    className={`p-2.5 rounded-xl border font-bold text-center transition-all ${
                      tebligatTuru === 'elektronik' ? 'bg-sky-600 text-white border-sky-600' : 'hover:bg-slate-500/10'
                    }`}
                  >
                    Elektronik Tebligat (UETS)
                    <span className="block text-[10px] font-normal opacity-80">+5 Gün Sonunda Tebliğ Sayılır</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTebligatTuru('fiziki')}
                    className={`p-2.5 rounded-xl border font-bold text-center transition-all ${
                      tebligatTuru === 'fiziki' ? 'bg-sky-600 text-white border-sky-600' : 'hover:bg-slate-500/10'
                    }`}
                  >
                    Fiziki Tebligat (Posta/Elden)
                    <span className="block text-[10px] font-normal opacity-80">Teslim Günü Tebliğ Sayılır</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold block mb-1">
                      {tebligatTuru === 'elektronik' ? 'UETS İleti Tarihi:' : 'Tebliğ / Teslim Tarihi:'}
                    </label>
                    <input
                      type="date"
                      value={tebligatTarihi}
                      onChange={(e) => setTebligatTarihi(e.target.value)}
                      className="form-control-custom font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold block mb-1">Yasal İtiraz / Ödeme Süresi (Gün):</label>
                    <select
                      value={sureGun}
                      onChange={(e) => setSureGun(Number(e.target.value))}
                      className="form-control-custom font-bold"
                    >
                      <option value={7}>7 Gün (Ödeme Emri İtiraz / Mal Bildirimi)</option>
                      <option value={15}>15 Gün (Standart İtiraz / Dava Açma)</option>
                      <option value={30}>30 Gün (Genel Başvuru / Uzlaşma)</option>
                      <option value={60}>60 Gün (İdari Yargı Dava Açma Süresi)</option>
                    </select>
                  </div>
                </div>

                {/* Sonuç Özeti */}
                <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/50 space-y-2">
                  <div className="flex justify-between items-center text-sky-900 dark:text-sky-200">
                    <span>Hukuken Tebliğ Edilmiş Sayılan Tarih:</span>
                    <span className="font-bold font-mono">{tebligatSonuc.tebligTarihi}</span>
                  </div>
                  <div className="flex justify-between items-center text-sky-900 dark:text-sky-200 border-t border-sky-200 dark:border-sky-900/50 pt-2">
                    <span className="font-bold text-sm">Süre Sonu (Son İşlem Günü):</span>
                    <span className="font-mono font-black text-base text-sky-600 dark:text-sky-400">
                      {tebligatSonuc.sonGun}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 4. BİLGİ PORTALI (YALNIZCA MEVZUAT, GENELGELER VE NOTLAR!)       */}
          {/* ============================================================== */}
          {currentTab === 'bilgiTab' && (
            <div className="space-y-4">
              {/* Bilgi Portalı Alt Sekmeleri */}
              <div className="flex items-center gap-1.5 flex-wrap border-b pb-2">
                <button
                  type="button"
                  onClick={() => setBilgiSubTab('genelge')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                    bilgiSubTab === 'genelge' ? 'bg-amber-600 text-white' : 'bg-slate-500/10 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  2024/12 &amp; 2026/15 Genelgeler
                </button>
                <button
                  type="button"
                  onClick={() => setBilgiSubTab('6183')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                    bilgiSubTab === '6183' ? 'bg-amber-600 text-white' : 'bg-slate-500/10 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  6183 Sayılı Kanun
                </button>
                <button
                  type="button"
                  onClick={() => setBilgiSubTab('5510')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                    bilgiSubTab === '5510' ? 'bg-amber-600 text-white' : 'bg-slate-500/10 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  5510 Sayılı Kanun
                </button>
                <button
                  type="button"
                  onClick={() => setBilgiSubTab('notlar')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                    bilgiSubTab === 'notlar' ? 'bg-amber-600 text-white' : 'bg-slate-500/10 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  📝 Kişisel Notlarım
                </button>
              </div>

              {bilgiSubTab !== 'notlar' ? (
                <>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={bilgiSearch}
                      onChange={(e) => setBilgiSearch(e.target.value)}
                      placeholder="Mevzuat maddesi, kademeli tecil kuralı veya anahtar kelime ara..."
                      className="form-control-custom pl-9"
                    />
                  </div>

                  <div className="space-y-3">
                    {filteredKnowledge.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl border space-y-2.5"
                        style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-primary)' }}
                      >
                        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          <span>{item.title}</span>
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{item.summary}</p>
                        <div className="p-3 rounded-xl bg-slate-500/5 font-mono text-[11px] whitespace-pre-line border border-slate-500/10 text-slate-700 dark:text-slate-300">
                          {item.content}
                        </div>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {item.tags.map((tag) => (
                            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 font-medium">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 dark:text-slate-200">
                      Kişisel Çalışma ve Mevzuat Notlarınız:
                    </label>
                    {notKaydedildi && (
                      <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Kaydedildi
                      </span>
                    )}
                  </div>
                  <textarea
                    value={kisiselNot}
                    onChange={(e) => saveNote(e.target.value)}
                    rows={12}
                    placeholder="Dosya numaraları, tecil notları, kurum içi uygulamalar ve hatırlatıcılarınızı buraya yazın. Tarayıcınızda otomatik ve güvenle saklanır..."
                    className="w-full p-3.5 rounded-2xl border font-sans text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-primary)' }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
