import React, { useState, useEffect, useRef } from 'react';
import {
  Wrench,
  Scale,
  Building2,
  Send,
  BookOpen,
  Sun,
  Moon,
  Sparkles,
  Palette,
  FileSignature,
  BarChart3
} from 'lucide-react';

interface HeaderProps {
  onOpenDrawer: (sectionId: 'maasTab' | 'bankaTab' | 'tebligatTab' | 'bilgiTab', title: string) => void;
  onOpenTaksitFormu?: () => void;
  onOpenMuvafakatname?: () => void;
  theme: 'light' | 'dark' | 'amoled';
  onSelectTheme: (theme: 'light' | 'dark' | 'amoled') => void;
  isSiteOpen?: boolean;
  onOpenSiteStatusModal?: () => void;
  onOpenAnalytics?: () => void;
  isAdmin?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDrawer,
  onOpenMuvafakatname,
  theme = 'light',
  onSelectTheme,
  onOpenAnalytics,
  isAdmin = false,
}) => {
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('tr-TR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const timeStr = now.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setCurrentDateTime(`${dateStr} | ${timeStr}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Floating Toolbar (Top-Right): Yalnızca Araçlar Simgesi */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 no-print">
        <div className="relative" ref={toolsRef}>
          <button
            type="button"
            onClick={() => setToolsOpen(!toolsOpen)}
            className="flex items-center justify-center w-9 h-9 rounded-full shadow-lg border transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-primary)',
            }}
            aria-label="Araçlar & Görünüm Menüsü"
            title="Araçlar & Görünüm (Aydınlık / Karanlık Tema)"
          >
            <Wrench className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          </button>

          {toolsOpen && (
            <div
              className="absolute right-0 mt-2 w-72 rounded-2xl shadow-2xl border p-2 text-xs z-50 animate-in fade-in zoom-in-95 duration-150"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-primary)',
                color: 'var(--text-primary)',
              }}
            >
              {/* Aydınlık / Karanlık / AMOLED Tema Seçim Bölümü (Araçlar içine taşındı) */}
              <div className="p-2 border-b mb-1" style={{ borderColor: 'var(--border-primary)' }}>
                <div className="flex items-center justify-between mb-1.5 px-1">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    Görünüm &amp; Tema
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono font-medium">
                    {theme === 'light' ? 'Aydınlık' : theme === 'dark' ? 'Karanlık' : 'AMOLED'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => onSelectTheme('light')}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      theme === 'light'
                        ? 'bg-white dark:bg-slate-700 text-amber-600 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                    title="Aydınlık tema"
                  >
                    <Sun className="w-3 h-3 text-amber-500" />
                    <span>Aydınlık</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectTheme('dark')}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                    title="Karanlık tema"
                  >
                    <Moon className="w-3 h-3 text-indigo-400" />
                    <span>Karanlık</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectTheme('amoled')}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      theme === 'amoled'
                        ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                    title="AMOLED saf siyah tema"
                  >
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span>AMOLED</span>
                  </button>
                </div>
              </div>

              {/* Araçlar Başlığı */}
              <div className="px-3 py-1 text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                Resmî Yardımcı Araçlar
              </div>

              {/* 1. Maaş Haczi Hesaplama */}
              <button
                type="button"
                onClick={() => {
                  onOpenDrawer('maasTab', '⚖️ Maaş Haczi Hesaplama');
                  setToolsOpen(false);
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-500/10 transition-colors text-left cursor-pointer"
              >
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">Maaş Haczi</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">1/10 ve 1/3 yasal kesinti</div>
                </div>
              </button>

              {/* 2. Banka Rehberi */}
              <button
                type="button"
                onClick={() => {
                  onOpenDrawer('bankaTab', '🏦 Banka Rehberi & DETSİS/KEP');
                  setToolsOpen(false);
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-500/10 transition-colors text-left cursor-pointer"
              >
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">Banka Rehberi</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">VKN, DETSİS, KEP bilgileri</div>
                </div>
              </button>

              {/* 3. Tebligat Süre Hesaplama */}
              <button
                type="button"
                onClick={() => {
                  onOpenDrawer('tebligatTab', '📨 Tebligat Süre Hesaplama');
                  setToolsOpen(false);
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-500/10 transition-colors text-left cursor-pointer"
              >
                <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-500">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">Tebligat Süre</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">6183/48 ve 7201/7-a geri sayım</div>
                </div>
              </button>

              {/* 4. Resmî Muvafakatname ve Belge Düzenleyici (Aşağıdan ikinci) */}
              <button
                type="button"
                onClick={() => {
                  onOpenMuvafakatname?.();
                  setToolsOpen(false);
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-500/10 transition-colors text-left cursor-pointer"
              >
                <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  <FileSignature className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <span>Muvafakatname Düzenleyici</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-teal-600 text-white font-extrabold">
                      A4
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                    SGK Ek-9 &amp; Resmî Teminat Belgeleri
                  </div>
                </div>
              </button>

              {/* 5. Bilgi Portalı & 2024/12 Genelge (En alttaki araç) */}
              <button
                type="button"
                onClick={() => {
                  onOpenDrawer('bilgiTab', '📖 Bilgi Portalı & 2024/12 (2026/15) Genelge');
                  setToolsOpen(false);
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-500/10 transition-colors text-left cursor-pointer"
              >
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">Bilgi Portalı</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">2024/12 &amp; 2026/15 Mevzuat</div>
                </div>
              </button>

              {/* 6. Ziyaretçi İstatistikleri & Giriş Sayacı (Yalnızca Yönetici Oturumu Açıkken Görünür) */}
              {isAdmin && onOpenAnalytics && (
                <div className="pt-1 mt-1 border-t" style={{ borderColor: 'var(--border-primary)' }}>
                  <button
                    type="button"
                    onClick={() => {
                      onOpenAnalytics();
                      setToolsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-indigo-500/10 transition-colors text-left cursor-pointer group"
                  >
                    <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <span>Ziyaretçi Sayacı</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-indigo-600 text-white font-extrabold">
                          Yönetici
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">Girişler ve analitik veriler</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Header Banner */}
      <header
        className="border-b transition-colors duration-200 shadow-sm pt-8 pb-6 px-4 sm:px-6"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-primary)',
        }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 px-3 py-1.5 rounded-2xl bg-white flex items-center justify-center shadow-md border border-slate-200 dark:border-slate-700/60 shrink-0">
              <img
                src="./sgk-logo.svg"
                alt="SGK Logosu"
                className="h-8 w-auto max-w-[110px] object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
                <span>SGK 6183/48 Tecil ve Taksitlendirme</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold border border-teal-500/20">
                  2026/15 Genelge
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                Kamu alacaklarının 48. madde kapsamında eşit taksit, faiz, teminat ve yetki hesaplaması
              </p>
            </div>
          </div>

          {/* Sağ Alan: Saat & Tarih */}
          <div className="flex items-center gap-2">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-500/5 px-3.5 py-2 rounded-xl border border-slate-500/10">
              {currentDateTime}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
