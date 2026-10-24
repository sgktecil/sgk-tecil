import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, X, Check, ArrowRight, Maximize2, Minimize2, Edit3, AlignLeft } from 'lucide-react';

export type SlotEditStyle = 'popover' | 'modal';

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
  
  // Slot edit style: 'popover' (kompakt baloncuk) | 'modal' (klasik yay animasyonlu büyük pencere)
  const [editStyle, setEditStyle] = useState<SlotEditStyle>(() => {
    try {
      const saved = localStorage.getItem('sgk_slot_style');
      if (saved === 'modal' || saved === 'popover') return saved;
    } catch {
      // ignore
    }
    return 'popover'; // Default to compact non-intrusive popover
  });

  // Position state for compact popover
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    placeAbove: boolean;
    arrowLeft: number;
  } | null>(null);

  const slotRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Synchronize slot style with global events & localStorage
  useEffect(() => {
    const handleStyleChange = (e: Event) => {
      const customEvent = e as CustomEvent<SlotEditStyle>;
      if (customEvent.detail && (customEvent.detail === 'modal' || customEvent.detail === 'popover')) {
        setEditStyle(customEvent.detail);
      }
    };

    window.addEventListener('sgk_slot_style_change', handleStyleChange);
    return () => {
      window.removeEventListener('sgk_slot_style_change', handleStyleChange);
    };
  }, []);

  const changeStyle = (newStyle: SlotEditStyle) => {
    setEditStyle(newStyle);
    try {
      localStorage.setItem('sgk_slot_style', newStyle);
    } catch {
      // ignore
    }
    window.dispatchEvent(new CustomEvent('sgk_slot_style_change', { detail: newStyle }));
  };

  const updatePopoverPosition = useCallback(() => {
    if (!slotRef.current) return;
    const rect = slotRef.current.getBoundingClientRect();
    const popoverWidth = activeTab === 'fulltext' ? 380 : 330;
    const estimatedHeight = activeTab === 'fulltext' ? 340 : 250;

    // Check vertical space
    const spaceBelow = window.innerHeight - rect.bottom;
    const placeAbove = spaceBelow < estimatedHeight && rect.top > estimatedHeight;

    const top = placeAbove ? rect.top - 8 : rect.bottom + 8;

    // Center horizontally relative to slot center, clamp within viewport
    const slotCenterX = rect.left + rect.width / 2;
    let left = slotCenterX - popoverWidth / 2;
    left = Math.max(12, Math.min(window.innerWidth - popoverWidth - 12, left));

    // Arrow anchor position relative to popover box
    const arrowLeft = Math.max(16, Math.min(popoverWidth - 16, slotCenterX - left));

    setCoords({
      top,
      left,
      placeAbove,
      arrowLeft,
    });
  }, [activeTab]);

  // Update position and focus on open
  useEffect(() => {
    if (isOpen) {
      setTempVal(value || '');
      setTempFullText(fullTextContent || '');
      setActiveTab('slot');
      setIsClosing(false);
      updatePopoverPosition();

      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 50);

      window.addEventListener('resize', updatePopoverPosition);
      window.addEventListener('scroll', updatePopoverPosition, true);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', updatePopoverPosition);
        window.removeEventListener('scroll', updatePopoverPosition, true);
      };
    }
  }, [isOpen, value, fullTextContent, updatePopoverPosition]);

  // Auto focus textarea when switching to fulltext tab
  useEffect(() => {
    if (activeTab === 'fulltext') {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
      updatePopoverPosition();
    }
  }, [activeTab, updatePopoverPosition]);

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
      {/* Inline Slot in the Document Text */}
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

        {/* Quiet visual badge on hover (no-print) */}
        {!hasValue && isEditable && (
          <span className="no-print pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[9px] font-sans font-semibold px-1.5 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
            Tıkla & Doldur
          </span>
        )}
      </span>

      {/* PORTAL RENDERING: All modes feature the fluid spring bounce animation */}
      {isOpen &&
        createPortal(
          editStyle === 'popover' ? (
            /* ========================================================= */
            /* STYLE 1: KOMPAKT BALONCUK (Yay Animasyonlu, Ekranı Kaplamaz) */
            /* ========================================================= */
            <div
              className="fixed inset-0 z-50 no-print"
              onClick={handleClose}
            >
              {/* Ultra-light transparent backdrop to capture outside clicks without darkening screen */}
              <div className="absolute inset-0 bg-stone-900/10 transition-opacity" />

              {/* Anchored Popover Box with Spring Animation */}
              {coords && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: 'fixed',
                    top: `${coords.top}px`,
                    left: `${coords.left}px`,
                    width: activeTab === 'fulltext' ? '380px' : '330px',
                    transform: coords.placeAbove ? 'translateY(-100%)' : 'none',
                  }}
                  className={`z-50 bg-white rounded-xl shadow-2xl border border-stone-200/95 overflow-visible transition-all ${
                    isClosing ? 'animate-spring-backward' : 'animate-spring-forward'
                  }`}
                >
                  {/* Directional Arrow pointing to slot */}
                  <div
                    style={{ left: `${coords.arrowLeft}px` }}
                    className={`absolute -translate-x-1/2 w-3 h-3 bg-stone-900 rotate-45 pointer-events-none ${
                      coords.placeAbove ? '-bottom-1.5' : '-top-1.5'
                    }`}
                  />

                  {/* Header */}
                  <div className="px-3.5 py-2.5 bg-gradient-to-r from-stone-900 to-stone-800 text-white rounded-t-xl flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-1.5 min-w-0 pr-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      <span className="font-bold text-[11px] uppercase tracking-wide truncate text-stone-100">
                        {label}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {/* Switch to large modal */}
                      <button
                        type="button"
                        onClick={() => changeStyle('modal')}
                        className="p-1 text-stone-300 hover:text-white hover:bg-stone-700/60 rounded-md transition-colors cursor-pointer"
                        title="Klasik Büyük Yay Animasyonlu Modala Geç"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Close button */}
                      <button
                        type="button"
                        onClick={handleClose}
                        className="p-1 text-stone-300 hover:text-white hover:bg-stone-700/60 rounded-md transition-colors cursor-pointer"
                        title="Kapat (Esc)"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Sub-tab switcher: Slot vs Full Text Editing */}
                  {onSaveFullText && (
                    <div className="px-3 pt-2 bg-stone-100 border-b border-stone-200 flex items-center gap-1 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setActiveTab('slot')}
                        className={`px-2.5 py-1 rounded-t-md font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
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
                        className={`px-2.5 py-1 rounded-t-md font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                          activeTab === 'fulltext'
                            ? 'bg-white text-stone-900 border-t border-x border-stone-200 shadow-2xs'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        <Edit3 className="w-3 h-3 text-amber-600" />
                        <span>✏️ Metin İçeriğini Düzenle</span>
                      </button>
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="p-3 space-y-2.5">
                    {activeTab === 'fulltext' && onSaveFullText ? (
                      /* FULL TEXT CONTENT EDITING VIEW */
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] text-stone-500">
                          <span className="font-semibold text-stone-700">{fullTextLabel}:</span>
                          <span>İstediğiniz gibi serbestçe yazıp değiştirebilirsiniz</span>
                        </div>
                        <textarea
                          ref={textareaRef}
                          rows={6}
                          value={tempFullText}
                          onChange={(e) => setTempFullText(e.target.value)}
                          placeholder="Belgedeki metin veya cümleyi buraya serbestçe yazınız..."
                          className="w-full p-2.5 text-xs font-serif leading-relaxed text-stone-950 bg-stone-50 border border-stone-300 rounded-lg focus:border-stone-900 focus:bg-white focus:outline-none transition-all shadow-inner"
                        />
                      </div>
                    ) : (
                      /* SINGLE SLOT EDITING VIEW */
                      <>
                        {description && (
                          <p className="text-[11px] text-stone-500 leading-snug">
                            {description}
                          </p>
                        )}

                        {/* Compact Input */}
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
                            placeholder={example ? `Örn: ${example}` : 'Metin veya isim giriniz...'}
                            className="w-full pl-2.5 pr-8 py-2 text-xs font-bold text-stone-950 bg-stone-50 border border-stone-300 rounded-lg focus:border-stone-900 focus:bg-white focus:outline-none transition-all shadow-inner"
                          />
                          {tempVal && (
                            <button
                              type="button"
                              onClick={() => setTempVal('')}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-[11px] font-bold p-0.5 rounded cursor-pointer"
                              title="Temizle"
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        {/* Quick Example Pill */}
                        {example && !tempVal && (
                          <div className="flex items-center gap-1.5 pt-0.5">
                            <span className="text-[10px] text-stone-400">Örnek:</span>
                            <button
                              type="button"
                              onClick={() => setTempVal(example)}
                              className="text-[10px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-md transition-colors cursor-pointer truncate max-w-[220px]"
                              title="Örneği doldur"
                            >
                              "{example}"
                            </button>
                          </div>
                        )}

                        {/* Live Sentence Preview */}
                        <div className="p-2 bg-amber-50/70 rounded-lg border border-amber-200/80 text-[11px] text-stone-800">
                          <div className="text-[9px] uppercase tracking-wider font-bold text-amber-900 mb-0.5 flex items-center justify-between">
                            <span>Canlı Cümle Önizleme:</span>
                            {onSaveFullText && (
                              <button
                                type="button"
                                onClick={() => setActiveTab('fulltext')}
                                className="text-amber-800 underline hover:text-amber-950 text-[10px] font-semibold"
                              >
                                Metni Değiştir
                              </button>
                            )}
                          </div>
                          <p className="font-serif italic text-stone-900 line-clamp-2 leading-relaxed">
                            "{sentencePreview ? (
                              sentencePreview(tempVal || placeholder)
                            ) : (
                              <span>
                                ... <strong className="text-amber-950 not-italic">{tempVal || placeholder}</strong>{suffix} ...
                              </span>
                            )}"
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-3 py-2 bg-stone-50 border-t border-stone-200 rounded-b-xl flex items-center justify-between gap-2">
                    {activeTab === 'fulltext' ? (
                      <button
                        type="button"
                        onClick={() => {
                          setTempFullText(fullTextContent || '');
                        }}
                        className="text-[10px] text-stone-500 hover:text-stone-800 underline underline-offset-2 cursor-pointer"
                        title="Orijinal metne sıfırla"
                      >
                        Sıfırla
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setTempVal('');
                          onConfirm('');
                          handleClose();
                        }}
                        className="text-[10px] text-stone-500 hover:text-stone-800 underline underline-offset-2 cursor-pointer"
                        title="Noktalı boşluk olarak bırak"
                      >
                        Boş Bırak
                      </button>
                    )}

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="px-2.5 py-1 text-[11px] font-medium text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer"
                      >
                        Vazgeç
                      </button>
                      <button
                        type="button"
                        onClick={activeTab === 'fulltext' ? handleSaveFullText : handleSave}
                        className="px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white font-bold text-[11px] rounded-lg shadow-xs flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Check className="w-3 h-3 text-amber-300" />
                        <span>{activeTab === 'fulltext' ? 'Metni Güncelle' : 'Uygula'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ========================================================= */
            /* STYLE 2: KLASİK YAY ANİMASYONLU BÜYÜK MODAL               */
            /* ========================================================= */
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/45 backdrop-blur-xs no-print transition-opacity duration-200"
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
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-amber-400/20 text-amber-300">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="font-bold text-xs uppercase tracking-wider text-white">
                        {label}
                      </h3>
                      <span className="text-[10px] text-stone-300 block -mt-0.5">
                        A4 Resmi Belge Boşluk &amp; Metin Düzenleme (Yay Animasyonlu)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Switch to compact popover */}
                    <button
                      type="button"
                      onClick={() => changeStyle('popover')}
                      className="flex items-center gap-1 text-[10px] font-semibold text-amber-300 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                      title="Kompakt Baloncuk Moduna Geç (Ekranı kaplamaz)"
                    >
                      <Minimize2 className="w-3.5 h-3.5" />
                      <span>Kompakt Baloncuk</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleClose}
                      className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                      title="Kapat (Esc)"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sub-tab switcher in Modal */}
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
                      <AlignLeft className="w-3.5 h-3.5 text-amber-600" />
                      <span>✏️ Metin / Cümle İçeriğini Değiştir</span>
                    </button>
                  </div>
                )}

                {/* Content Body */}
                <div className="p-5 space-y-4">
                  {activeTab === 'fulltext' && onSaveFullText ? (
                    /* FULL TEXT CONTENT EDITING VIEW */
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                          {fullTextLabel} (Serbestçe Değiştirebilirsiniz):
                        </label>
                        <span className="text-[11px] text-stone-500">
                          {tempFullText.length} karakter
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-2.5 rounded-lg border border-stone-200/60">
                        Bu alanda yazılan metin belgedeki kanuni cümle veya paragrafın yerine doğrudan basılacaktır. İster kelimeleri düzeltin, ister tamamen özel kendi cümlenizi yazın.
                      </p>
                      <textarea
                        ref={textareaRef}
                        rows={7}
                        value={tempFullText}
                        onChange={(e) => setTempFullText(e.target.value)}
                        placeholder="Kanuni beyan ve muvafakat metnini dilediğiniz gibi yazınız..."
                        className="w-full px-3.5 py-3 text-sm font-serif leading-relaxed text-stone-950 bg-white border-2 border-stone-300 rounded-xl focus:border-stone-900 focus:outline-none transition-all shadow-inner"
                      />
                    </div>
                  ) : (
                    /* SINGLE SLOT EDITING VIEW */
                    <>
                      {description && (
                        <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-2.5 rounded-lg border border-stone-200/60">
                          {description}
                        </p>
                      )}

                      {/* Input Area */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                            Buraya Yazınız:
                          </label>
                          {onSaveFullText && (
                            <button
                              type="button"
                              onClick={() => setActiveTab('fulltext')}
                              className="text-[11px] text-amber-800 hover:text-amber-950 font-semibold underline flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Cümle İçeriğini Değiştir</span>
                            </button>
                          )}
                        </div>
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
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-amber-900 tracking-wider block">
                            Cümledeki Canlı Görünüm (Önizleme)
                          </span>
                          {onSaveFullText && (
                            <button
                              type="button"
                              onClick={() => setActiveTab('fulltext')}
                              className="text-[10px] text-amber-900 underline font-semibold"
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
            </div>
          ),
          document.body
        )}
    </>
  );
};
