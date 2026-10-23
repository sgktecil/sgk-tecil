import React, { useState, useEffect, useRef } from 'react';
import {
  Wrench,
  ChevronDown,
  Scale,
  Building2,
  Send,
  BookOpen,
  Sun,
  Moon,
  Sparkles,
  Check,
  Palette,
  FileSignature
} from 'lucide-react';

interface HeaderProps {
  onOpenDrawer: (sectionId: 'maasTab' | 'bankaTab' | 'tebligatTab' | 'bilgiTab', title: string) => void;
  onOpenTaksitFormu?: () => void;
  onOpenMuvafakatname?: () => void;
  theme: 'light' | 'dark' | 'amoled';
  onSelectTheme: (theme: 'light' | 'dark' | 'amoled') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDrawer,
  onOpenTaksitFormu,
  onOpenMuvafakatname,
  theme = 'light',
  onSelectTheme,
}) => {
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [toolsOpen, setToolsOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);

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
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setThemeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getThemeInfo = (t: 'light' | 'dark' | 'amoled') => {
    switch (t) {
      case 'light':
        return { label: 'Aydınlık', icon: Sun, color: 'text-amber-500' };
      case 'dark':
        return { label: 'Karanlık', icon: Moon, color: 'text-indigo-400' };
      case 'amoled':
        return { label: 'AMOLED', icon: Sparkles, color: 'text-purple-400' };
    }
  };

  const currentThemeInfo = getThemeInfo(theme);
  const CurrentThemeIcon = currentThemeInfo.icon;

  return (
    <>
      {/* Floating Toolbar (Top-Right) */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 no-print">
        {/* Tema Seçim Menüsü */}
        <div className="relative" ref={themeRef}>
          <button
            onClick={() => {
              setThemeOpen(!themeOpen);
              setToolsOpen(false);
            }}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-full shadow-lg border transition-all duration-200 cursor-pointer hover:scale-[1.02]"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-primary)',
            }}
            aria-label="Tema Seçimi"
            title="Görünüm & Tema Seçenekleri (Aydınlık, Karanlık, AMOLED)"
          >
            <CurrentThemeIcon className={`w-3.5 h-3.5 ${currentThemeInfo.color}`} />
            <span>{currentThemeInfo.label}</span>
            <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${themeOpen ? 'rotate-180' : ''}`} />
          </button>

          {themeOpen && (
            <div
              className="absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl border p-2 text-xs z-50 animate-in fade-in zoom-in-95 duration-150"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-primary)',
                color: 'var(--text-primary)',
              }}
            >
              <div className="px-3 py-2 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-primary)' }}>
                <span className="font-extrabold flex items-center gap-1.5 text-slate-800 dark:text-slate-100">
                  <Palette className="w-3.5 h-3.5 text-teal-600" />
                  Görünüm &amp; Tema
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold">
                  3 Mod
                </span>
              </div>

              <div className="p-1 space-y-1">
                {/* 1. Aydınlık */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectTheme('light');
                    setThemeOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-left cursor-pointer ${
                    theme === 'light'
                      ? 'bg-amber-500/15 border border-amber-500/40 text-amber-900 dark:text-amber-100'
                      : 'hover:bg-slate-500/10 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-500">
                      <Sun className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        <span>Aydınlık</span>
                        {theme === 'light' && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500 text-white font-bold">
                            Aktif
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        Yüksek kontrastlı açık tema
                      </div>
                    </div>
                  </div>
                  {theme === 'light' && <Check className="w-4 h-4 text-amber-600" />}
                </button>

                {/* 2. Karanlık */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectTheme('dark');
                    setThemeOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-left cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-indigo-500/15 border border-indigo-500/40 text-indigo-900 dark:text-indigo-100'
                      : 'hover:bg-slate-500/10 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                      <Moon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        <span>Karanlık</span>
                        {theme === 'dark' && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-600 text-white font-bold">
                            Aktif
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        Koyu slate gri zemin
                      </div>
                    </div>
                  </div>
                  {theme === 'dark' && <Check className="w-4 h-4 text-indigo-400" />}
                </button>

                {/* 3. AMOLED */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectTheme('amoled');
                    setThemeOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-left cursor-pointer ${
                    theme === 'amoled'
                      ? 'bg-purple-500/15 border border-purple-500/40 text-purple-900 dark:text-purple-100'
                      : 'hover:bg-slate-500/10 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        <span>AMOLED</span>
                        {theme === 'amoled' && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-600 text-white font-bold">
                            Aktif
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        Saf siyah (#000000) OLED
                      </div>
                    </div>
                  </div>
                  {theme === 'amoled' && <Check className="w-4 h-4 text-purple-400" />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tools Menu */}
        <div className="relative" ref={toolsRef}>
          <button
            onClick={() => {
              setToolsOpen(!toolsOpen);
              setThemeOpen(false);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-full shadow-lg border transition-all duration-200 cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-primary)',
            }}
          >
            <Wrench className="w-3.5 h-3.5 text-indigo-400" />
            <span>Araçlar</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${toolsOpen ? 'rotate-180' : ''}`} />
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
              {/* Resmî Muvafakatname ve Belge Düzenleyici */}
              <button
                type="button"
                onClick={() => {
                  onOpenMuvafakatname?.();
                  setToolsOpen(false);
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-500/10 transition-colors text-left cursor-pointer border border-rose-500/30 bg-rose-500/10 mb-1.5"
              >
                <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-600 dark:text-rose-400">
                  <FileSignature className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <span>Muvafakatname &amp; Belge</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-rose-600 text-white font-black">
                      A4
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                    Resmî muvafakat ve izin belgeleri
                  </div>
                </div>
              </button>

              <button
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

              <button
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

              <button
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

              <button
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
