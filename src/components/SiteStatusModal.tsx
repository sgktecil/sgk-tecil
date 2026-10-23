import React, { useState } from 'react';
import { X, Globe, Lock, ShieldCheck, Power, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';

interface SiteStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSiteOpen: boolean;
  onToggleSiteStatus: (isOpen: boolean) => Promise<void> | void;
}

export const SiteStatusModal: React.FC<SiteStatusModalProps> = ({
  isOpen,
  onClose,
  isSiteOpen,
  onToggleSiteStatus,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen) return null;

  const handleToggle = async (targetOpen: boolean) => {
    setIsUpdating(true);
    try {
      await onToggleSiteStatus(targetOpen);
    } finally {
      setIsUpdating(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-md rounded-3xl border shadow-2xl p-6 space-y-5"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-primary)',
          color: 'var(--text-primary)',
        }}
      >
        {/* Üst Başlık */}
        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-primary)' }}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${isSiteOpen ? 'bg-emerald-500/15 text-emerald-600' : 'bg-rose-500/15 text-rose-600'}`}>
              <Power className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                Canlı Yayın &amp; Erişim Durumu
              </h3>
              <p className="text-[11px] text-slate-500">
                Tüm ziyaretçiler için anında geçerli olur (Sunucu Senkronlu)
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

        {/* Mevcut Durum Kartı */}
        <div className={`p-4 rounded-2xl border ${
          isSiteOpen
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-200'
        } space-y-2`}>
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs uppercase tracking-wider">Şu Anki Durum:</span>
            <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${
              isSiteOpen ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
            }`}>
              {isSiteOpen ? 'CANLI / AÇIK' : 'KAPALI / BAKIMDA'}
            </span>
          </div>
          <p className="text-xs leading-relaxed">
            {isSiteOpen
              ? 'Web sitesi şu anda tüm kullanıcılara açıktır. Hesaplama ve belge düzenleme modülleri aktiftir.'
              : 'Web sitesi şu anda tüm ziyaretçilere kapalıdır. Siteye canlı linkten giren herkes SGK bakım ekranı ile karşılaşır.'}
          </p>
        </div>

        {/* Değiştirme Butonları */}
        <div className="space-y-2 pt-1">
          {isSiteOpen ? (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => handleToggle(false)}
              className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              <span>{isUpdating ? 'Sunucu Güncelleniyor...' : 'Siteyi Kapat (Bakım Moduna Al)'}</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => handleToggle(true)}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
              <span>{isUpdating ? 'Sunucu Güncelleniyor...' : 'Siteyi Canlıya Aç (Yayına Al)'}</span>
            </button>
          )}

          <div className="text-[11px] text-slate-500 text-center leading-normal pt-1">
            Site kapalıyken yönetim için PIN kodu <strong>1923</strong> veya <strong>6183</strong> olarak ayarlanmıştır.
          </div>
        </div>
      </div>
    </div>
  );
};
