import React, { useState, useEffect } from 'react';
import { SGKEmblem } from './Emblems';
import { Lock, Unlock, ShieldAlert, Sparkles, AlertCircle, Wrench, Loader2 } from 'lucide-react';
import { verifyAdminPin } from '../utils/adminAuthService';

interface MaintenanceScreenProps {
  onUnlockSite: () => void;
  onContinueDevelopment?: () => void;
}

export const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({
  onUnlockSite,
  onContinueDevelopment,
}) => {
  const [showAdminPin, setShowAdminPin] = useState(false);
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;

    setIsLoading(true);
    try {
      const isValid = await verifyAdminPin(pin);
      if (isValid) {
        try {
          sessionStorage.setItem('sgk_admin_unlocked', 'true');
          sessionStorage.setItem('sgk_admin_pin', pin.trim());
          localStorage.setItem('sgk_site_canli_durumu', 'acik');
        } catch {}
        onUnlockSite();
      } else {
        setError(true);
        setTimeout(() => setError(false), 2500);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Yalnızca yöneticinin bildiği gizli kısayol: Alt + K veya Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.altKey && (e.key === 'k' || e.key === 'K')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'a' || e.key === 'A'))
      ) {
        e.preventDefault();
        setShowAdminPin((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-between p-4 sm:p-8 font-sans relative overflow-hidden select-none">
      {/* Arka plan ışık efektleri */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Üst Bar: Logoya çift tıklandığında yalnızca yöneticinin bildiği gizli tetikleyici */}
      <div className="w-full max-w-4xl flex items-center justify-between z-10 flex-wrap gap-2">
        <div
          className="flex items-center gap-3 cursor-default"
          onDoubleClick={() => setShowAdminPin((prev) => !prev)}
          title="T.C. Sosyal Güvenlik Kurumu"
        >
          <SGKEmblem className="w-10 h-10 text-teal-400" />
          <div>
            <div className="font-black text-sm tracking-wider uppercase">T.C. SOSYAL GÜVENLİK KURUMU</div>
            <div className="text-[11px] text-teal-400 font-bold">6183 Sayılı Kanun 48. Madde Takip ve Tecil Portalı</div>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Sistem Bakım Çalışması</span>
        </div>
      </div>

      {/* Orta Kart: Resmî Bakım Bildirimi (Ziyaretçiler YALNIZCA BU BİLDİRİMİ GÖRÜR) */}
      <div className="w-full max-w-xl my-auto z-10 py-8">
        <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Sistem Geçici Olarak Erişime Kapatılmıştır
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
              SGK 6183 sayılı Kanun 48. madde tecil, taksitlendirme ve resmî muvafakatname hesaplama portalımız planlı bakım ve mevzuat güncelleme çalışmaları nedeniyle geçici süreyle ziyarete kapatılmıştır.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="flex items-center justify-center gap-2 text-teal-400 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Geliştirme ve bakım sonrasında tekrar hizmete açılacaktır.</span>
            </div>
            <div>Güncelleme Tarihi: {new Date().toLocaleDateString('tr-TR')}</div>
          </div>

          {/* Siteyi Doğrudan Canlıya Açma / Yönetici Giriş Butonu */}
          {!showAdminPin ? (
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setShowAdminPin(true)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                <span>Siteyi Canlıya Aç (Yönetici Girişi)</span>
              </button>
              {onContinueDevelopment && (
                <button
                  type="button"
                  onClick={onContinueDevelopment}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Wrench className="w-4 h-4" />
                  <span>Geliştirmeye Devam Et</span>
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={handlePinSubmit} className="pt-2 space-y-3 max-w-xs w-full mx-auto animate-in fade-in duration-200">
              <div className="text-xs font-bold text-slate-300 flex items-center justify-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-teal-400" />
                <span>Yönetici PIN Doğrulama</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="password"
                  autoFocus
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="PIN Kodunu Girin (1923)"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-center text-sm font-mono tracking-widest text-white focus:outline-none focus:border-teal-500"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1 shrink-0"
                >
                  {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>Aç</span>
                </button>
              </div>

              {error && (
                <div className="text-[11px] font-bold text-rose-400 animate-shake">
                  Hatalı PIN! Lütfen tekrar deneyin.
                </div>
              )}

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setShowAdminPin(false)}
                  className="text-[11px] text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  Vazgeç / Kapat
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Alt Telif ve Yönetici Giriş Tetikleyicisi */}
      <div className="w-full max-w-4xl text-center text-[11px] text-slate-500 z-10 flex flex-col items-center gap-1">
        <span
          onDoubleClick={() => setShowAdminPin(true)}
          className="cursor-default select-none hover:text-slate-400 transition-colors"
          title="Yönetici Girişi için çift tıklayın"
        >
          T.C. Sosyal Güvenlik Kurumu © {new Date().getFullYear()} — Tüm Hakları Saklıdır
        </span>
        {!showAdminPin && (
          <button
            type="button"
            onClick={() => setShowAdminPin(true)}
            className="text-[10px] text-slate-600 hover:text-teal-400 underline underline-offset-2 transition-colors cursor-pointer"
          >
            Yönetici Girişi (Yayını Aç)
          </button>
        )}
      </div>
    </div>
  );
};
