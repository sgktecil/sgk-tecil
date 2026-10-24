import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Check, ArrowRight } from 'lucide-react';

interface AnimatedSlotProps {
  value: string;
  placeholder?: string;
  suffix?: string;
  prefix?: string;
  label: string;
  description?: string;
  example?: string;
  onConfirm: (val: string) => void;
  isEditable?: boolean;
  sentencePreview?: (currentVal: string) => string;
  className?: string;
  emptyDisplay?: string;
}

export const AnimatedSlot: React.FC<AnimatedSlotProps> = ({
  value,
  placeholder = '...................................',
  suffix = '',
  prefix = '',
  label,
  description,
  example,
  onConfirm,
  isEditable = true,
  sentencePreview,
  className = '',
  emptyDisplay,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [tempVal, setTempVal] = useState(value);
  const [isJustUpdated, setIsJustUpdated] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync internal temp value when opened or when value changes
  useEffect(() => {
    if (isOpen) {
      setTempVal(value || '');
      setIsClosing(false);
      // Auto focus input
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 50);
    }
  }, [isOpen, value]);

  const handleOpen = (e: React.MouseEvent) => {
    if (!isEditable) return;
    e.stopPropagation();
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 180);
  };

  const handleSave = () => {
    const trimmed = tempVal.trim();
    onConfirm(trimmed);
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      // Trigger a brief pulse animation to show it smoothly settled into place
      setIsJustUpdated(true);
      setTimeout(() => setIsJustUpdated(false), 1200);
    }, 180);
  };

  const hasValue = Boolean(value && value.trim() && !/^[._\-…·]{2,}$/.test(value.trim()));
  const displayText = hasValue ? value : (emptyDisplay || placeholder);

  return (
    <>
      {/* Inline Slot in the Document Text */}
      <span
        onClick={handleOpen}
        title={isEditable ? `${label} - Tıklayıp kutucukta düzenleyin` : undefined}
        className={`relative inline cursor-pointer transition-all duration-200 select-text ${
          isJustUpdated ? 'animate-slot-pulse rounded-xs px-1 font-bold' : ''
        } ${
          hasValue
            ? 'font-bold text-stone-950 underline decoration-blue-400 decoration-1 underline-offset-4 hover:bg-blue-50/80 hover:decoration-blue-600 px-1 py-0.5 rounded-xs'
            : 'text-stone-800 font-mono tracking-tight hover:bg-amber-100/80 hover:text-stone-950 border-b-2 border-dashed border-amber-500/80 px-1 py-0.5 rounded-xs group'
        } ${className}`}
      >
        {prefix && <span className="mr-0.5">{prefix}</span>}
        <span>{displayText}</span>
        {suffix && <span className="font-serif font-normal">{suffix}</span>}

        {/* Quiet visual badge on hover (no-print) */}
        {!hasValue && isEditable && (
          <span className="no-print pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[9px] font-sans font-semibold px-1.5 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
            Tıkla & Doldur
          </span>
        )}
      </span>

      {/* Spring-Forward Floating Pop-Up Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/45 backdrop-blur-xs no-print transition-opacity duration-200"
          onClick={handleClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`bg-white rounded-2xl shadow-2xl border border-stone-200/90 max-w-md w-full overflow-hidden transition-all transform ${
              isClosing ? 'animate-spring-backward' : 'animate-spring-forward'
            }`}
          >
            {/* Header */}
            <div className="px-5 py-3.5 bg-gradient-to-r from-stone-900 to-stone-800 text-white flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-amber-400/20 text-amber-300">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-white">
                    {label}
                  </h3>
                  <span className="text-[10px] text-stone-300 block -mt-0.5">
                    A4 Resmi Belge Boşluk Doldurma
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                title="Kapat (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 space-y-4">
              {description && (
                <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-2.5 rounded-lg border border-stone-200/60">
                  {description}
                </p>
              )}

              {/* Input Area */}
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Buraya Yazınız:
                </label>
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={tempVal}
                    onChange={(e) => setTempVal(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSave();
                      } else if (e.key === 'Escape') {
                        e.preventDefault();
                        handleClose();
                      }
                    }}
                    placeholder={example ? `Örn: ${example}` : 'Ad Soyad veya metin giriniz...'}
                    className="w-full px-3.5 py-3 text-sm font-bold text-stone-950 bg-stone-50 border-2 border-stone-300 rounded-xl focus:border-stone-900 focus:bg-white focus:outline-none transition-all shadow-inner"
                  />
                  {tempVal && (
                    <button
                      type="button"
                      onClick={() => setTempVal('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-800 text-xs px-2 py-0.5 rounded-md bg-stone-200 hover:bg-stone-300 transition-colors cursor-pointer"
                      title="Metni Temizle"
                    >
                      ✕ Temizle
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Fill Suggestion */}
              {example && !tempVal && (
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-[11px] text-stone-500 font-medium">Hızlı Örnek:</span>
                  <button
                    type="button"
                    onClick={() => setTempVal(example)}
                    className="text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>"{example}"</span>
                    <ArrowRight className="w-3 h-3 text-blue-500" />
                  </button>
                </div>
              )}

              {/* Live Sentence Preview Strip */}
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/70 text-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-900 tracking-wider block">
                  Cümledeki Canlı Görünüm (Önizleme)
                </span>
                <p className="font-serif text-stone-900 italic leading-relaxed text-[13px]">
                  "{sentencePreview ? (
                    sentencePreview(tempVal || placeholder)
                  ) : (
                    <span>
                      ... <strong className="text-amber-950 underline decoration-amber-500 not-italic">{tempVal || placeholder}</strong>{suffix} ...
                    </span>
                  )}"
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-5 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setTempVal('');
                  onConfirm('');
                  setIsClosing(true);
                  setTimeout(() => {
                    setIsOpen(false);
                    setIsClosing(false);
                  }, 180);
                }}
                className="text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors cursor-pointer underline underline-offset-2"
                title="Boş bırakıp noktalı alan olarak tut"
              >
                Boş Bırak (Noktalı Yap)
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-3.5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-200/60 transition-colors cursor-pointer"
                >
                  Vazgeç (Esc)
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer hover:shadow-md"
                >
                  <Check className="w-3.5 h-3.5 text-amber-300" />
                  <span>Onayla & Yerleştir (Enter)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
