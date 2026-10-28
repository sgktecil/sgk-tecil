import React, { useState } from 'react';
import {
  X,
  Lock,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Settings,
  ArrowRight,
  Loader2,
  RefreshCw,
  Info
} from 'lucide-react';
import { verifyAdminPin, changeAdminPin } from '../utils/adminAuthService';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  targetActionName?: string;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [tab, setTab] = useState<'login' | 'changePin'>('login');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // PIN Değiştirme Formu
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [newPinConfirm, setNewPinConfirm] = useState('');
  const [changeSuccessMsg, setChangeSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const isValid = await verifyAdminPin(pin);
      if (isValid) {
        setPin('');
        onSuccess();
      } else {
        setErrorMsg('Hatalı PIN kodu! Lütfen tekrar deneyin.');
        setTimeout(() => setErrorMsg(''), 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setChangeSuccessMsg('');

    if (newPin.trim().length < 4) {
      setErrorMsg('Yeni PIN kodu en az 4 haneli olmalıdır.');
      return;
    }

    if (newPin !== newPinConfirm) {
      setErrorMsg('Girdiğiniz yeni PIN kodları birbiriyle eşleşmiyor.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await changeAdminPin(currentPin, newPin);
      if (res.success) {
        setChangeSuccessMsg(res.message);
        setCurrentPin('');
        setNewPin('');
        setNewPinConfirm('');
        setTimeout(() => {
          setTab('login');
          setChangeSuccessMsg('');
        }, 2500);
      } else {
        setErrorMsg(res.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm rounded-3xl border shadow-2xl p-6 space-y-4"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-primary)',
          color: 'var(--text-primary)',
        }}
      >
        {/* Üst Başlık */}
        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-primary)' }}>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                Yönetici Doğrulaması
              </h3>
              <p className="text-[11px] text-slate-500">
                Yalnızca yetkili yönetici erişebilir
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-500/10 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sekmeler */}
        <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              tab === 'login'
                ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Giriş Yap
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('changePin');
              setErrorMsg('');
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              tab === 'changePin'
                ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            PIN Değiştir
          </button>
        </div>

        {/* Güvenlik Hatırlatması */}
        <div className="p-2.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-900 dark:text-teal-100 flex items-start gap-2 text-[11px] leading-relaxed">
          <Info className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
          <p>
            Güvenliğiniz için <strong>Gmail şifreniz istenmez</strong>. Yalnızca siteye özel belirlediğiniz PIN kodu kullanılır.
          </p>
        </div>

        {tab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  Yönetici PIN Kodu:
                </label>
              </div>
              <div className="relative">
                <input
                  type="password"
                  autoFocus
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="PIN Kodunu Girin..."
                  className="w-full px-3.5 py-2.5 rounded-xl text-center text-base tracking-widest font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <KeyRound className="w-4 h-4 absolute right-3 top-3 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer transition-all"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-extrabold text-xs cursor-pointer shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Doğrula &amp; Aç</span>}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleChangePinSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                Mevcut PIN Kodu:
              </label>
              <input
                type="password"
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value)}
                placeholder="Örn: 1923"
                className="w-full px-3 py-2 rounded-xl text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                Yeni Belirleyeceğiniz PIN (En az 4 hane):
              </label>
              <input
                type="password"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="Yeni PIN..."
                className="w-full px-3 py-2 rounded-xl text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                Yeni PIN Tekrar:
              </label>
              <input
                type="password"
                value={newPinConfirm}
                onChange={(e) => setNewPinConfirm(e.target.value)}
                placeholder="Yeni PIN Tekrar..."
                className="w-full px-3 py-2 rounded-xl text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {changeSuccessMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{changeSuccessMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-extrabold text-xs cursor-pointer shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Yeni PIN'i Kaydet</span>}
            </button>
          </form>
        )}

        <p className="text-[10px] text-slate-400 text-center leading-relaxed">
          Ziyaretçiler bu bilgileri ve istatistikleri kesinlikle göremez. Yalnızca yetkili yönetici şifre ile giriş yapabilir.
        </p>
      </div>
    </div>
  );
};
