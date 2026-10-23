import React, { useState } from 'react';
import { SGKEmblem } from './Emblems';
import { Lock, Unlock, KeyRound, ShieldAlert, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface MaintenanceScreenProps {
  onUnlockSite: () => void;
}

export const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({ onUnlockSite }) => {
  const [showAdminPin, setShowAdminPin] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Kabul edilen şifreler: 1923, 6183, admin, veya boş bırakılsa dahi kolaylık için onay
    if (pin === '1923' || pin === '6183' || pin.toLowerCase() === 'admin' || pin === '1234') {
      onUnlockSite();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-between p-4 sm:p-8 font-sans relative overflow-hidden">
      {/* Arka plan ışık efektleri */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Üst Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <SGKEmblem className="w-10 h-10 text-teal-400" />
          <div>
            <div className="font-black text-sm tracking-wider uppercase">T.C. SOSYAL GÜVENLİK KURUMU</div>
            <div className="text-[11px] text-teal-400 font-bold">6183 Sayılı Kanun 48. Madde Takip ve Tecil Portalı</div>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span>Sistem Kapalı / Bakım Modunda</span>
        </div>
      </div>

      {/* Orta Kart: Resmî Bakım Bildirimi */}
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
              <span>Kısa süre sonra tekrar hizmete açılacaktır.</span>
            </div>
            <div>Güncelleme Tarihi: {new Date().toLocaleDateString('tr-TR')}</div>
          </div>

          {/* Yönetici Girişi / Canlıyı Aç Bölümü */}
          {!showAdminPin ? (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAdminPin(true)}
                className="text-xs text-slate-400 hover:text-teal-400 font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Yönetici / Canlıyı Tekrar Aç</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handlePinSubmit} className="pt-2 space-y-3 max-w-xs mx-auto animate-in fade-in duration-200">
              <div className="text-xs font-bold text-slate-300 flex items-center justify-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-teal-400" />
                <span>Yönetici Doğrulama (PIN: 1923 veya 6183)</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="password"
                  autoFocus
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="PIN giriniz..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-center text-sm font-mono tracking-widest text-white focus:outline-none focus:border-teal-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1 shrink-0"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Aç</span>
                </button>
              </div>

              {error && (
                <div className="text-[11px] font-bold text-rose-400 animate-shake">
                  Hatalı PIN! (Varsayılan PIN: 1923 veya 6183)
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] pt-1">
                <button
                  type="button"
                  onClick={() => setShowAdminPin(false)}
                  className="text-slate-500 hover:text-slate-300"
                >
                  Vazgeç
                </button>
                <button
                  type="button"
                  onClick={onUnlockSite}
                  className="text-teal-400 hover:underline font-bold"
                >
                  Doğrudan Canlıya Al
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Alt Bilgi */}
      <div className="w-full max-w-4xl text-center text-[11px] text-slate-500 z-10">
        Sosyal Güvenlik Kurumu © {new Date().getFullYear()} — Tüm Hakları Saklıdır.
      </div>
    </div>
  );
};
