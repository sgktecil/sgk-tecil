import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, X, Check, ArrowRight, Edit3 } from 'lucide-react';

export type SlotEditStyle = 'modal';

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
  // Yazı ve cümle içeriğini doğrudan değiştirme imkanı
  fullTextContent?: string;
  onSaveFullText?: (newText: string) => void;
  fullTextLabel?: string;
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
  fullTextContent,
  onSaveFullText,
  fullTextLabel = 'Cümle / Metin İçeriği',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [tempVal, setTempVal] = useState(value);
  const [tempFullText, setTempFullText] = useState(fullTextContent || '');
  const [activeTab, setActiveTab] = useState<'slot' | 'fulltext'>('slot');
  const [isJustUpdated, setIsJustUpdated] = useState(false);

  const slotRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus and select input on open
  useEffect(() => {
    if (isOpen) {
      setTempVal(value || '');
      setTempFullText(fullTextContent || '');
      setActiveTab('slot');
      setIsClosing(false);

      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 60);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, value, fullTextContent]);

  // Focus textarea when switching to fulltext tab
  useEffect(() => {
    if (activeTab === 'fulltext') {
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

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
      setIsJustUpdated(true);
      setTimeout(() => setIsJustUpdated(false), 1200);
    }, 180);
  };

  const handleSaveFullText = () => {
    if (onSaveFullText) {
      onSaveFullText(tempFullText);
    }
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      setIsJustUpdated(true);
      setTimeout(() => setIsJustUpdated(false), 1200);
    }, 180);
  };

  const hasValue = Boolean(value && value.trim() && !/^[._\-…·]{2,}$/.test(value.trim()));
  const displayText = hasValue ? value : emptyDisplay || placeholder;

  return (
    <>
      {/* Inline Slot in Document */}
      <span
        ref={slotRef}
        onClick={handleOpen}
        title={isEditable ? `${label} - Tıklayıp yay animasyonlu pencerede düzenleyin` : undefined}
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

        {/* Hover label for empty fields (hidden on print) */}
        {!hasValue && isEditable && (
          <span className="no-print pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[9px] font-sans font-semibold px-1.5 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
            Tıkla &amp; Doldur
          </span>
        )}
      </span>

      {/* MODAL PORTAL: Classic Spring-Forward Animation */}
      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/50 backdrop-blur-xs no-print transition-opacity duration-200"
            onClick={handleClose}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={`bg-white rounded-2xl shadow-2xl border border-stone-200/90 max-w-lg w-full overflow-hidden transition-all transform ${
                isClosing ? 'animate-spring-backward' : 'animate-spring-forward'
              }`}
            >
              {/* Header */}
              <div className="px-5 py-3.5 bg-gradient-to-r from-stone-900 to-stone-800 text-white flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="font-bold text-xs uppercase tracking-wider text-white">
                      {label}
                    </h3>
                    <span className="text-[10px] text-stone-300 block -mt-0.5">
                      A4 Resmi Belge Alanı Düzenleme · Yay Animasyonu
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-700/60 transition-colors cursor-pointer"
                  title="Kapat (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Sub-tab switcher: Slot vs Full Text Editing (only if onSaveFullText available) */}
              {onSaveFullText && (
                <div className="px-5 pt-2.5 bg-stone-100 border-b border-stone-200 flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab('slot')}
                    className={`px-3 py-1.5 rounded-t-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'slot'
                        ? 'bg-white text-stone-900 border-t border-x border-stone-200 shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <span>⚡ Alanı Doldur</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('fulltext')}
                    className={`px-3 py-1.5 rounded-t-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'fulltext'
                        ? 'bg-white text-stone-900 border-t border-x border-stone-200 shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                    <span>✏️ Cümle / Metin İçeriğini Düzenle</span>
                  </button>
                </div>
              )}

              {/* Modal Body */}
              <div className="p-5 space-y-4">
                {activeTab === 'fulltext' && onSaveFullText ? (
                  /* FULL TEXT CONTENT EDITING VIEW */
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-stone-600">
                      <span className="font-bold text-stone-800">{fullTextLabel}:</span>
                      <span className="text-[11px] text-stone-500">Doğrudan tüm cümleyi düzenleyebilirsiniz</span>
                    </div>
                    <textarea
                      ref={textareaRef}
                      rows={6}
                      value={tempFullText}
                      onChange={(e) => setTempFullText(e.target.value)}
                      placeholder="Muvafakat cümlesini buraya serbestçe yazabilirsiniz..."
                      className="w-full p-3 text-xs font-serif leading-relaxed text-stone-950 bg-stone-50 border border-stone-300 rounded-xl focus:border-stone-900 focus:bg-white focus:outline-none transition-all shadow-inner"
                    />
                  </div>
                ) : (
                  /* SINGLE SLOT EDITING VIEW */
                  <>
                    {description && (
                      <p className="text-xs text-stone-600 leading-relaxed font-sans">
                        {description}
                      </p>
                    )}

                    {/* Main Input */}
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
                          }
                        }}
                        placeholder={example ? `Örn: ${example}` : 'Metin veya isim giriniz...'}
                        className="w-full pl-3.5 pr-10 py-2.5 text-sm font-bold text-stone-950 bg-stone-50 border-2 border-stone-300 rounded-xl focus:border-stone-900 focus:bg-white focus:outline-none transition-all shadow-inner"
                      />
                      {tempVal && (
                        <button
                          type="button"
                          onClick={() => setTempVal('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs font-bold p-1 rounded cursor-pointer"
                          title="Temizle"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Quick Example Pill */}
                    {example && !tempVal && (
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="text-xs text-stone-500">Örnek:</span>
                        <button
                          type="button"
                          onClick={() => setTempVal(example)}
                          className="text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                          title="Örnek değeri alana doldur"
                        >
                          <span>"{example}"</span>
                          <ArrowRight className="w-3 h-3 text-blue-500" />
                        </button>
                      </div>
                    )}

                    {/* Live Sentence Preview */}
                    <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-amber-900 tracking-wider block">
                          Cümledeki Canlı Önizleme
                        </span>
                        {onSaveFullText && (
                          <button
                            type="button"
                            onClick={() => setActiveTab('fulltext')}
                            className="text-[10px] text-amber-900 underline font-semibold cursor-pointer"
                          >
                            Metni Özelleştir
                          </button>
                        )}
                      </div>
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
                  </>
                )}
              </div>

              {/* Footer Actions */}
              <div className="px-5 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
                {activeTab === 'fulltext' ? (
                  <button
                    type="button"
                    onClick={() => setTempFullText(fullTextContent || '')}
                    className="text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors cursor-pointer underline underline-offset-2"
                    title="İlk metne geri döndür"
                  >
                    Orijinale Sıfırla
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setTempVal('');
                      onConfirm('');
                      handleClose();
                    }}
                    className="text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors cursor-pointer underline underline-offset-2"
                    title="Boş bırakıp noktalı alan olarak tut"
                  >
                    Boş Bırak (Noktalı Yap)
                  </button>
                )}

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
                    onClick={activeTab === 'fulltext' ? handleSaveFullText : handleSave}
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer hover:shadow-md"
                  >
                    <Check className="w-3.5 h-3.5 text-amber-300" />
                    <span>{activeTab === 'fulltext' ? 'Metni Güncelle & Kaydet' : 'Onayla & Yerleştir (Enter)'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
