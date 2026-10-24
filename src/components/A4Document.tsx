import React from 'react';
import { MuvafakatnameDocument } from '../types/muvafakatname';
import { Emblem } from './Emblems';
import { AnimatedSlot } from './AnimatedSlot';
import { Edit3 } from 'lucide-react';

interface InlineEditableProps {
  value: string;
  onChange?: (val: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  tagName?: 'span' | 'div' | 'h1' | 'h2' | 'p';
  title?: string;
  disabled?: boolean;
}

export const InlineEditable: React.FC<InlineEditableProps> = ({
  value,
  onChange,
  className = '',
  placeholder = '',
  multiline = false,
  tagName: Tag = 'span',
  title = 'Word gibi tıklayıp doğrudan yazabilirsiniz',
  disabled = false,
}) => {
  const ref = React.useRef<HTMLElement>(null);
  const isComposingRef = React.useRef(false);

  React.useEffect(() => {
    if (ref.current && document.activeElement !== ref.current) {
      if (ref.current.innerText !== (value || '')) {
        ref.current.innerText = value || '';
      }
    }
  }, [value]);

  if (disabled || !onChange) {
    return (
      <Tag className={className}>
        {value || placeholder}
      </Tag>
    );
  }

  const handleInput = (e: React.FormEvent<HTMLElement>) => {
    if (isComposingRef.current) return;
    const text = e.currentTarget.innerText;
    onChange(text);
  };

  const handleFocus = (e: React.FocusEvent<HTMLElement>) => {
    const currentText = e.currentTarget.innerText.trim();
    // If the text is purely dots or underscores (e.g. "....."), auto select all so typing immediately replaces it
    if (/^[._\-…·]{2,}$/.test(currentText)) {
      setTimeout(() => {
        try {
          const range = document.createRange();
          range.selectNodeContents(e.currentTarget);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
        } catch {
          // ignore
        }
      }, 15);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  return (
    <Tag
      ref={ref as any}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      onInput={handleInput}
      onFocus={handleFocus}
      onCompositionStart={() => {
        isComposingRef.current = true;
      }}
      onCompositionEnd={(e) => {
        isComposingRef.current = false;
        onChange(e.currentTarget.innerText);
      }}
      onKeyDown={handleKeyDown}
      onBlur={(e) => {
        onChange(e.currentTarget.innerText);
      }}
      title={title}
      data-placeholder={placeholder}
      className={`outline-none transition-all duration-150 empty:before:content-[attr(data-placeholder)] empty:before:text-stone-400 empty:before:pointer-events-none hover:bg-blue-50/50 hover:outline-dashed hover:outline-1 hover:outline-blue-400 focus:bg-blue-50/30 focus:outline-solid focus:outline-2 focus:outline-blue-600 rounded-xs print:hover:bg-transparent print:hover:outline-none print:focus:outline-none print:focus:bg-transparent ${className}`}
    >
      {value}
    </Tag>
  );
};

interface A4DocumentProps {
  doc: MuvafakatnameDocument;
  zoom?: number;
  isPrintPreview?: boolean;
  onChange?: (updated: MuvafakatnameDocument) => void;
  isEditable?: boolean;
}

export const A4Document: React.FC<A4DocumentProps> = ({
  doc,
  zoom = 1,
  isPrintPreview = false,
  onChange,
  isEditable = true,
}) => {
  const isWordMode = isEditable && !isPrintPreview && Boolean(onChange);

  const updateField = <K extends keyof MuvafakatnameDocument>(field: K, value: MuvafakatnameDocument[K]) => {
    if (!onChange) return;
    onChange({ ...doc, [field]: value });
  };

  const updateGrantor = (field: string, value: string) => {
    if (!onChange) return;
    onChange({
      ...doc,
      grantor: { ...doc.grantor, [field]: value },
    });
  };

  const updateSgk = (field: string, value: any) => {
    if (!onChange) return;
    onChange({
      ...doc,
      sgkDetails: {
        annexCode: 'Ek-9',
        debtorName: '',
        debtPeriod: '',
        debtAmount: '',
        debtType: 'sigorta primi',
        propertyType: 'menkul / gayrimenkul',
        propertyDetails: '',
        icraOfficer1Name: '',
        icraOfficer2Name: '',
        endorsementNote: 'Bu muvafakatname, huzurumuzda imza altına alınmıştır.',
        showBlankDots: true,
        ...(doc.sgkDetails || {}),
        [field]: value,
      },
    });
  };

  const getStandardEk9Sentence = () => {
    const debtor = doc.sgkDetails?.debtorName ? `${doc.sgkDetails.debtorName}’nin` : '...................................’nin';
    const period = doc.sgkDetails?.debtPeriod ? `${doc.sgkDetails.debtPeriod}` : '.................';
    const amount = doc.sgkDetails?.debtAmount ? `${doc.sgkDetails.debtAmount} TL` : '...................................... TL';
    const debtType = doc.sgkDetails?.debtType ? `${doc.sgkDetails.debtType}` : '.........................';
    const propType =
      doc.sgkDetails?.customPropertyTypeText ||
      (doc.sgkDetails?.propertyType === 'menkul'
        ? 'menkul malı'
        : doc.sgkDetails?.propertyType === 'gayrimenkul'
        ? 'gayrimenkul malı'
        : 'menkul /gayrimenkul malı');

    return `${debtor} Sosyal Güvenlik Kurumuna olan ${period} dönemi/ayına ilişkin ${amount} tutarında ${debtType} borcuna ve bu borca bu tarihten ödenmesine kadar geçecek süre için işleyecek fer’ilerine karşılık aşağıda özellikleri yazılı ${propType} 6183 sayılı Kanunun 10 uncu maddesinin beşinci fıkrası gereğince teminat olarak gösteriyor ve söz konusu malların Sosyal Güvenlik Kurumu tarafından haczedilmesine muvafakat ediyorum. Bu konuda herhangi bir itirazda bulunmayacağımı beyan ve taahhüt ederim.`;
  };

  const getFontFamilyClass = () => {
    switch (doc.docFont) {
      case 'garamond':
        return 'font-garamond-doc';
      case 'sans':
        return 'font-sans-doc';
      case 'serif':
      default:
        return 'font-serif-doc';
    }
  };

  const isSgkEk9 = doc.templateType === 'sgk_ek9';

  const paragraphs = doc.bodyText
    .split('\n')
    .map(p => p.trim())
    .filter(p => p.length > 0);

  return (
    <div
      style={{
        transform: isPrintPreview ? 'none' : `scale(${zoom})`,
        transformOrigin: 'top center',
      }}
      className="transition-transform duration-200"
    >
      <div
        id="a4-sheet"
        className={`bg-white text-stone-900 ${getFontFamilyClass()} relative mx-auto box-border flex flex-col justify-between overflow-hidden ${
          isPrintPreview ? '' : 'a4-paper-shadow border border-stone-200'
        }`}
        style={{
          width: '210mm',
          height: '297mm',
          minHeight: '297mm',
          maxHeight: '297mm',
          padding: isSgkEk9 ? '18mm 22mm 18mm 22mm' : '16mm 20mm 15mm 20mm',
          fontSize: `${doc.fontSize}px`,
          lineHeight: doc.lineSpacing,
        }}
      >
        {/* Border Styles */}
        {doc.borderStyle === 'classic-double' && (
          <div className="pointer-events-none absolute inset-[7mm] border-[1.5px] border-stone-800 p-[2.5mm]">
            <div className="h-full w-full border-[0.6px] border-stone-700" />
            <div className="absolute -top-[5px] -left-[5px] h-2.5 w-2.5 border-t-2 border-l-2 border-stone-800" />
            <div className="absolute -top-[5px] -right-[5px] h-2.5 w-2.5 border-t-2 border-r-2 border-stone-800" />
            <div className="absolute -bottom-[5px] -left-[5px] h-2.5 w-2.5 border-b-2 border-l-2 border-stone-800" />
            <div className="absolute -bottom-[5px] -right-[5px] h-2.5 w-2.5 border-b-2 border-r-2 border-stone-800" />
          </div>
        )}

        {doc.borderStyle === 'thin-single' && (
          <div className="pointer-events-none absolute inset-[9mm] border-[0.8px] border-stone-400" />
        )}

        {doc.borderStyle === 'modern-corners' && (
          <div className="pointer-events-none absolute inset-[9mm]">
            <div className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-stone-800" />
            <div className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-stone-800" />
            <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-stone-800" />
            <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-stone-800" />
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* CASE 1: SGK EK-9 EXACT FORMAT (Matching User Attachment)     */}
        {/* ------------------------------------------------------------- */}
        {isSgkEk9 ? (
          <div className="relative z-10 flex h-full flex-col justify-between">
            {/* Top Area */}
            <div>
              {/* Ek-9 (Top Right) */}
              <div className="flex justify-end items-start mb-6">
                <InlineEditable
                  value={doc.annexCode || doc.sgkDetails?.annexCode || 'Ek-9'}
                  onChange={(val) => {
                    updateField('annexCode', val);
                    updateSgk('annexCode', val);
                  }}
                  disabled={!isWordMode}
                  className="font-bold text-base md:text-lg text-stone-950 font-serif cursor-text"
                  placeholder="Ek-9"
                />
              </div>

              {/* Title Centered */}
              <div className="text-center mb-8 px-4">
                <InlineEditable
                  tagName="h1"
                  multiline={false}
                  value={doc.title || 'ÜÇÜNCÜ ŞAHISLAR TARAFINDAN VERİLECEK MUVAFAKATNAME ÖRNEĞİ'}
                  onChange={(val) => updateField('title', val)}
                  disabled={!isWordMode}
                  className="text-base md:text-lg font-bold tracking-tight text-stone-950 font-serif uppercase block text-center cursor-text"
                  placeholder="ÜÇÜNCÜ ŞAHISLAR TARAFINDAN VERİLECEK MUVAFAKATNAME ÖRNEĞİ"
                />
              </div>

              {/* Authority / Institution Centered */}
              <div className="text-center mb-8">
                <AnimatedSlot
                  label="Sosyal Güvenlik İl Müdürlüğü / Merkez Adı"
                  description="Muvafakatnamenin sunulacağı SGK İl Müdürlüğü veya Sosyal Güvenlik Merkezi"
                  example="ANKARA SOSYAL GÜVENLİK İL MÜDÜRLÜĞÜNE"
                  placeholder="........................ SOSYAL GÜVENLİK İL MÜDÜRLÜĞÜNE"
                  value={doc.institution || ''}
                  onConfirm={(val) => updateField('institution', val)}
                  isEditable={isWordMode}
                  className="text-sm md:text-base font-bold tracking-wide uppercase text-stone-950 font-serif inline-block text-center"
                  sentencePreview={(val) => val}
                />
              </div>

              {/* Main Legal Sentence with Animated Spring-Forward Interactive Slots */}
              <div className="relative group text-justify leading-relaxed text-stone-950 mb-5 font-serif text-[13px] rounded-sm transition-colors">
                {/* Discreet mode switcher button (hidden on print) */}
                {isWordMode && (
                  <div className="no-print absolute -top-5 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 z-10">
                    <button
                      type="button"
                      onClick={() => {
                        updateSgk('useCustomMainSentence', !doc.sgkDetails?.useCustomMainSentence);
                      }}
                      className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded bg-stone-900 text-white hover:bg-stone-800 shadow-xs flex items-center gap-1 cursor-pointer"
                      title={
                        doc.sgkDetails?.useCustomMainSentence
                          ? 'Akıllı Boşluk Doldurma Moduna Geç'
                          : 'Serbest Word Yazma Moduna Geç'
                      }
                    >
                      <Edit3 className="w-2.5 h-2.5 text-amber-300" />
                      <span>
                        {doc.sgkDetails?.useCustomMainSentence
                          ? 'Boşluk Doldurma Modu'
                          : 'Word Serbest Yazım Modu'}
                      </span>
                    </button>
                  </div>
                )}

                {doc.sgkDetails?.useCustomMainSentence ? (
                  <InlineEditable
                    tagName="p"
                    multiline={true}
                    value={
                      doc.sgkDetails?.customMainSentence || getStandardEk9Sentence()
                    }
                    onChange={(val) => {
                      if (!onChange) return;
                      onChange({
                        ...doc,
                        sgkDetails: {
                          ...(doc.sgkDetails || ({} as any)),
                          useCustomMainSentence: true,
                          customMainSentence: val,
                        },
                      });
                    }}
                    disabled={!isWordMode}
                    className="p-1 min-h-[60px] w-full block text-justify leading-relaxed cursor-text"
                    title="Word gibi doğrudan metne tıklayıp yazabilir, silebilir ve düzenleyebilirsiniz"
                    placeholder="Kanuni muvafakat ve teminat metnini buraya yazınız..."
                  />
                ) : (
                  <p className="text-justify leading-relaxed block select-text">
                    <AnimatedSlot
                      label="Borçlu Adı Soyadı / Şirket Ünvanı"
                      description="Sosyal Güvenlik Kurumuna borcu olan asıl borçlu şahıs veya şirket ünvanı"
                      example="CEMİL DURSUN"
                      placeholder="..................................."
                      suffix="’nin"
                      value={doc.sgkDetails?.debtorName || ''}
                      onConfirm={(val) => updateSgk('debtorName', val)}
                      isEditable={isWordMode}
                      sentencePreview={(val) => `${val}’nin Sosyal Güvenlik Kurumuna olan borcuna...`}
                    />
                    {' '}Sosyal Güvenlik Kurumuna olan{' '}
                    <AnimatedSlot
                      label="Borç Dönemi / Ayı"
                      description="Borcun ait olduğu yıl ve ay/dönem bilgisi (Örn: 2024 Yılı veya 2024/01-06)"
                      example="2024/01-06"
                      placeholder="................."
                      suffix=" dönemi/ayına"
                      value={doc.sgkDetails?.debtPeriod || ''}
                      onConfirm={(val) => updateSgk('debtPeriod', val)}
                      isEditable={isWordMode}
                      sentencePreview={(val) => `... Kurumuna olan ${val} dönemi/ayına ilişkin ...`}
                    />
                    {' '}ilişkin{' '}
                    <AnimatedSlot
                      label="Borç Tutarı (TL)"
                      description="Teminat gösterilen borcun toplam TL tutarı"
                      example="150.000 TL"
                      placeholder="......................................"
                      suffix=" tutarında"
                      value={
                        doc.sgkDetails?.debtAmount
                          ? `${doc.sgkDetails.debtAmount}${doc.sgkDetails.debtAmount.toLowerCase().includes('tl') ? '' : ' TL'}`
                          : ''
                      }
                      onConfirm={(val) => {
                        const clean = val.replace(/\s*TL$/i, '').trim();
                        updateSgk('debtAmount', clean);
                      }}
                      isEditable={isWordMode}
                      sentencePreview={(val) => `... ilişkin ${val} tutarında ...`}
                    />
                    {' '}
                    <AnimatedSlot
                      label="Borç Türü"
                      description="Kuruma olan borcun kanuni cinsi (Örn: sigorta primi, işsizlik sigortası primi, idari para cezası)"
                      example="sigorta primi"
                      placeholder="........................."
                      suffix=" borcuna"
                      value={doc.sgkDetails?.debtType || ''}
                      onConfirm={(val) => updateSgk('debtType', val)}
                      isEditable={isWordMode}
                      sentencePreview={(val) => `... tutarında ${val} borcuna ve bu borca ...`}
                    />
                    {' '}ve bu borca bu tarihten ödenmesine kadar geçecek süre için işleyecek fer’ilerine karşılık aşağıda özellikleri yazılı{' '}
                    <AnimatedSlot
                      label="Teminat Malının Cinsi"
                      description="Teminat olarak gösterilen menkul veya gayrimenkul mal türü"
                      example="gayrimenkul malı"
                      placeholder="menkul / gayrimenkul malı"
                      value={
                        doc.sgkDetails?.customPropertyTypeText ||
                        (doc.sgkDetails?.propertyType === 'menkul'
                          ? 'menkul malı'
                          : doc.sgkDetails?.propertyType === 'gayrimenkul'
                          ? 'gayrimenkul malı'
                          : '')
                      }
                      onConfirm={(val) => updateSgk('customPropertyTypeText', val)}
                      isEditable={isWordMode}
                      sentencePreview={(val) => `... özellikleri yazılı ${val} 6183 sayılı Kanunun ...`}
                    />
                    {' '}6183 sayılı Kanunun 10 uncu maddesinin beşinci fıkrası gereğince teminat olarak gösteriyor ve söz konusu malların Sosyal Güvenlik Kurumu tarafından haczedilmesine muvafakat ediyorum. Bu konuda herhangi bir itirazda bulunmayacağımı beyan ve taahhüt ederim.
                  </p>
                )}
              </div>

              {/* Date & Signer Area */}
              {doc.sgkDetails?.includeSpouseConsent ? (
                /* Dual Signatures: Malik + Eş (Gayrimenkul TMK m.194) */
                <div className="grid grid-cols-2 gap-4 px-2 mb-4 font-serif text-stone-950">
                  {/* Malik */}
                  <div className="text-center p-2.5 border border-stone-300 bg-stone-50/50 rounded-xs">
                    <InlineEditable
                      value={doc.sgkDetails?.grantorTitleInBox || 'Muvafakat Veren (Gayrimenkul Maliki)'}
                      onChange={(val) => updateSgk('grantorTitleInBox', val)}
                      disabled={!isWordMode}
                      className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-700 mb-0.5 block cursor-text"
                    />
                    <InlineEditable
                      value={doc.date || '..../...../.....'}
                      onChange={(val) => updateField('date', val)}
                      disabled={!isWordMode}
                      className="text-xs font-mono mb-1 block cursor-text"
                    />
                    <div className="font-bold text-sm min-h-[20px]">
                      <InlineEditable
                        value={doc.grantor.fullName || 'Adı Soyadı'}
                        onChange={(val) => updateGrantor('fullName', val)}
                        disabled={!isWordMode}
                        className="block cursor-text"
                        placeholder="Adı Soyadı"
                      />
                    </div>
                    <div className="text-xs text-stone-700 mt-0.5">
                      <InlineEditable
                        value={doc.grantor.title || 'Malik'}
                        onChange={(val) => updateGrantor('title', val)}
                        disabled={!isWordMode}
                        className="block cursor-text"
                        placeholder="Malik"
                      />
                    </div>
                    <div className="h-9 flex items-end justify-center">
                      <span className="text-[10px] text-stone-400 italic font-sans">(Malikin İmzası)</span>
                    </div>
                  </div>

                  {/* Eş */}
                  <div className="text-center p-2.5 border border-stone-300 bg-stone-50/50 rounded-xs">
                    <InlineEditable
                      value={doc.sgkDetails?.spouseTitle || 'Malikin Eşi (TMK m.194 Eş Muvafakati)'}
                      onChange={(val) => updateSgk('spouseTitle', val)}
                      disabled={!isWordMode}
                      className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-700 mb-0.5 block cursor-text"
                    />
                    <InlineEditable
                      value={doc.date || '..../...../.....'}
                      onChange={(val) => updateField('date', val)}
                      disabled={!isWordMode}
                      className="text-xs font-mono mb-1 block cursor-text"
                    />
                    <div className="font-bold text-sm min-h-[20px]">
                      <InlineEditable
                        value={doc.sgkDetails?.spouseFullName || 'Eşin Adı Soyadı'}
                        onChange={(val) => updateSgk('spouseFullName', val)}
                        disabled={!isWordMode}
                        className="block cursor-text"
                        placeholder="Eşin Adı Soyadı"
                      />
                    </div>
                    <div className="text-xs font-mono text-stone-700 mt-0.5 flex items-center justify-center gap-1">
                      <span>TC:</span>
                      <InlineEditable
                        value={doc.sgkDetails?.spouseTcNumber || '................................'}
                        onChange={(val) => updateSgk('spouseTcNumber', val)}
                        disabled={!isWordMode}
                        className="cursor-text"
                        placeholder="TC Kimlik No"
                      />
                    </div>
                    <div className="h-9 flex items-end justify-center">
                      <span className="text-[10px] text-stone-400 italic font-sans">(Eşin İmzası)</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Single Signer (Menkul / Standart) */
                <div className="flex justify-end pr-4 mb-4">
                  <div className="text-center w-56 font-serif text-stone-950">
                    <div className="mb-2 font-mono">
                      <InlineEditable
                        value={doc.date || '..../...../.....'}
                        onChange={(val) => updateField('date', val)}
                        disabled={!isWordMode}
                        className="block cursor-text"
                        placeholder="..../...../....."
                      />
                    </div>
                    <div className="font-bold text-sm min-h-[20px]">
                      <InlineEditable
                        value={doc.grantor.fullName || 'Adı Soyadı'}
                        onChange={(val) => updateGrantor('fullName', val)}
                        disabled={!isWordMode}
                        className="block cursor-text"
                        placeholder="Adı Soyadı"
                      />
                    </div>
                    <div className="text-xs text-stone-700 mt-0.5">
                      <InlineEditable
                        value={doc.grantor.title || 'Ünvanı'}
                        onChange={(val) => updateGrantor('title', val)}
                        disabled={!isWordMode}
                        className="block cursor-text"
                        placeholder="Ünvanı"
                      />
                    </div>
                    <div className="h-10 flex items-end justify-center">
                      <span className="text-[11px] text-stone-400 italic font-sans">(İmza)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Left Details Block (Adres, TC, Vergi No) with Animated Slots */}
              <div className="space-y-1.5 text-xs font-serif text-stone-950 pl-2 mb-3">
                <div className="flex items-start">
                  <span className="w-28 font-medium shrink-0">Adres</span>
                  <span className="mr-2">:</span>
                  <div className="flex-1">
                    <AnimatedSlot
                      label="Muvafakat Veren Adresi"
                      description="Malikin veya vekilinin güncel resmi tebligat adresi"
                      example="Kızılay Mah. Atatürk Bulvarı No:12/4 Çankaya / ANKARA"
                      placeholder="...................................................................................................."
                      value={doc.grantor.address || ''}
                      onConfirm={(val) => updateGrantor('address', val)}
                      isEditable={isWordMode}
                      className="font-sans text-xs"
                      sentencePreview={(val) => `Adres : ${val}`}
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="w-28 font-medium shrink-0">TC Kimlik No</span>
                  <span className="mr-2">:</span>
                  <div className="flex-1">
                    <AnimatedSlot
                      label="T.C. Kimlik Numarası"
                      description="Muvafakat veren malikin 11 haneli T.C. kimlik numarası"
                      example="12345678901"
                      placeholder="................................"
                      value={doc.grantor.tcNumber || ''}
                      onConfirm={(val) => updateGrantor('tcNumber', val)}
                      isEditable={isWordMode}
                      className="font-mono text-xs"
                      sentencePreview={(val) => `TC Kimlik No : ${val}`}
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="w-28 font-medium shrink-0">Vergi Kimlik No</span>
                  <span className="mr-2">:</span>
                  <div className="flex-1">
                    <AnimatedSlot
                      label="Vergi Kimlik Numarası"
                      description="Tüzel kişi veya şahıs vergi kimlik numarası (varsa)"
                      example="9876543210"
                      placeholder="................................"
                      value={doc.grantor.taxNumber || ''}
                      onConfirm={(val) => updateGrantor('taxNumber', val)}
                      isEditable={isWordMode}
                      className="font-mono text-xs"
                      sentencePreview={(val) => `Vergi Kimlik No : ${val}`}
                    />
                  </div>
                </div>
              </div>

              {/* Optional Spouse Legal Consent Clause */}
              {doc.sgkDetails?.includeSpouseConsent && (
                <div className="p-2 border border-stone-300 bg-stone-50/70 text-[11px] font-serif rounded-xs mb-3 text-stone-900 leading-snug">
                  <strong className="block font-sans text-[10px] uppercase tracking-wider text-stone-800 mb-0.5">
                    <InlineEditable
                      value={doc.sgkDetails?.spouseTitle || 'Eşin Muvafakat ve Rıza Şerhi (Türk Medeni Kanunu m. 194):'}
                      onChange={(val) => updateSgk('spouseTitle', val)}
                      disabled={!isWordMode}
                      className="block cursor-text"
                    />
                  </strong>
                  <InlineEditable
                    tagName="p"
                    multiline={true}
                    value={
                      doc.sgkDetails?.spouseConsentText ||
                      'Türk Medeni Kanunu ve ilgili mevzuat uyarınca; yukarıda kimlik ve adres bilgileri yer alan eşim tarafından Sosyal Güvenlik Kurumuna olan borcuna karşılık teminat olarak gösterilen yukarıda özellikleri yazılı gayrimenkulün haczedilmesine ve teminat gösterilmesine serbest irademle açıkça muvafakat ediyorum.'
                    }
                    onChange={(val) => updateSgk('spouseConsentText', val)}
                    disabled={!isWordMode}
                    className="text-justify block w-full cursor-text"
                  />
                </div>
              )}

              {/* Teminat Gösterilen Malın Özellikleri Bölümü (Dolu veya Noktalı Çizgili) */}
              {doc.sgkDetails?.showPropertyBox !== false && (
                <div className="border border-stone-300 bg-stone-50/70 p-2.5 rounded-xs text-xs font-serif mb-3">
                  <span className="font-bold block uppercase text-[10px] font-sans text-stone-800 mb-1">
                    <InlineEditable
                      value={
                        doc.sgkDetails?.propertyDetailsTitle ||
                        (doc.sgkDetails?.propertyType === 'gayrimenkul'
                          ? 'Teminat Gösterilen Gayrimenkulün (Taşınmazın) Özellikleri:'
                          : doc.sgkDetails?.propertyType === 'menkul'
                          ? 'Teminat Gösterilen Menkul Malın (Taşıt / Aracın) Özellikleri:'
                          : 'Teminat Gösterilen Menkul / Gayrimenkul Malın Özellikleri:')
                      }
                      onChange={(val) => updateSgk('propertyDetailsTitle', val)}
                      disabled={!isWordMode}
                      className="block cursor-text"
                    />
                  </span>
                  <InlineEditable
                    tagName="p"
                    multiline={true}
                    value={
                      doc.sgkDetails?.propertyDetails?.trim()
                        ? doc.sgkDetails.propertyDetails
                        : '..........................................................................................................................................'
                    }
                    onChange={(val) => updateSgk('propertyDetails', val)}
                    disabled={!isWordMode}
                    className="text-stone-900 leading-snug font-sans text-[11px] block whitespace-pre-wrap cursor-text"
                    placeholder="Teminat gösterilen malın özelliklerini yazınız..."
                  />
                </div>
              )}

              {/* Boş Alana Serbest Metin / Açıklama / Ek Şerh Yazma Bölümü */}
              <div className="mt-2 mb-2 font-serif text-stone-900">
                <InlineEditable
                  tagName="div"
                  multiline={true}
                  value={doc.sgkDetails?.customFreeText || ''}
                  onChange={(val) => updateSgk('customFreeText', val)}
                  disabled={!isWordMode}
                  className={`w-full text-justify text-[11.5px] leading-relaxed rounded-xs cursor-text ${
                    doc.sgkDetails?.customFreeText?.trim()
                      ? 'p-1 text-stone-900 min-h-[20px]'
                      : 'p-2 border border-dashed border-stone-300 text-stone-400 bg-stone-50/50 hover:border-blue-400 hover:text-stone-700 hover:bg-blue-50/40 print:hidden'
                  }`}
                  placeholder="✍️ Bu boş alana tıklayarak ek açıklama, gayrimenkul/menkul mal şerhi veya dilediğiniz serbest bir not yazabilirsiniz..."
                  title="Sayfadaki bu boş alana dilediğiniz gibi ek metin veya şerh yazabilirsiniz"
                />
              </div>
            </div>

            {/* Bottom Official Endorsement & Execution Officers */}
            <div className="pt-2 font-serif">
              {/* Endorsement statement */}
              <div className="text-center font-medium text-stone-950 text-xs md:text-sm mb-6">
                <InlineEditable
                  value={
                    doc.sgkDetails?.endorsementNote ||
                    (doc.sgkDetails?.includeSpouseConsent
                      ? 'Bu muvafakatname, malik ve eşi huzurumuzda imza altına alınmıştır.'
                      : 'Bu muvafakatname, huzurumuzda imza altına alınmıştır.')
                  }
                  onChange={(val) => updateSgk('endorsementNote', val)}
                  disabled={!isWordMode}
                  className="inline-block cursor-text"
                  placeholder="Bu muvafakatname, huzurumuzda imza altına alınmıştır."
                />
              </div>

              {/* Two Officer Columns */}
              <div className="grid grid-cols-2 gap-12 px-8 text-center text-stone-950">
                <div>
                  <div className="font-bold text-sm">
                    <InlineEditable
                      value={doc.sgkDetails?.icraOfficer1Title || 'İcra Memuru'}
                      onChange={(val) => updateSgk('icraOfficer1Title', val)}
                      disabled={!isWordMode}
                      className="block cursor-text"
                      placeholder="İcra Memuru"
                    />
                  </div>
                  <div className="text-xs text-stone-700 font-sans mt-0.5 min-h-[16px]">
                    <InlineEditable
                      value={doc.sgkDetails?.icraOfficer1Name || (doc.sgkDetails?.showBlankDots ? '................................' : '')}
                      onChange={(val) => updateSgk('icraOfficer1Name', val)}
                      disabled={!isWordMode}
                      className="block cursor-text"
                      placeholder="Memur Adı ve Sicil No"
                    />
                  </div>
                  <div className="h-10 flex items-end justify-center">
                    <span className="text-[11px] text-stone-400 italic font-sans">(İmza & Mühür)</span>
                  </div>
                </div>

                <div>
                  <div className="font-bold text-sm">
                    <InlineEditable
                      value={doc.sgkDetails?.icraOfficer2Title || 'Sorumlu İcra Memuru'}
                      onChange={(val) => updateSgk('icraOfficer2Title', val)}
                      disabled={!isWordMode}
                      className="block cursor-text"
                      placeholder="Sorumlu İcra Memuru"
                    />
                  </div>
                  <div className="text-xs text-stone-700 font-sans mt-0.5 min-h-[16px]">
                    <InlineEditable
                      value={doc.sgkDetails?.icraOfficer2Name || (doc.sgkDetails?.showBlankDots ? '................................' : '')}
                      onChange={(val) => updateSgk('icraOfficer2Name', val)}
                      disabled={!isWordMode}
                      className="block cursor-text"
                      placeholder="Sorumlu Memur Adı ve Sicil No"
                    />
                  </div>
                  <div className="h-10 flex items-end justify-center">
                    <span className="text-[11px] text-stone-400 italic font-sans">(İmza & Mühür)</span>
                  </div>
                </div>
              </div>

              {/* Footer Verification Bar (Quiet) */}
              {doc.showQrCode && (
                <div className="border-t border-stone-200 mt-6 pt-2 flex items-center justify-between text-[10px] font-sans text-stone-400">
                  <span>SGK Amme Alacakları Teminat Muvafakat Formu (6183 S.K. m.10/5)</span>
                  <span>Sayfa 1 / 1</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ------------------------------------------------------------- */
          /* CASE 2: STANDARD LEGAL MUVAFAKATNAME (Passport, Notary, etc.) */
          /* ------------------------------------------------------------- */
          <div className="relative z-10 flex h-full flex-col justify-between">
            {/* TOP SECTION */}
            <div>
              {/* Header: Emblem + Document Meta */}
              <div className="flex items-start justify-between border-b border-stone-200 pb-2 mb-3">
                <div className="flex items-center gap-3">
                  <Emblem type={doc.emblem} className="w-11 h-11" />
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-sans font-semibold text-stone-500 block">
                      T.C. Resmi Belge Formatı
                    </span>
                    <span className="text-xs font-semibold text-stone-700 tracking-wider">
                      {doc.city || 'TÜRKİYE'}
                    </span>
                  </div>
                </div>

                {/* Meta: Tarih & Sayı */}
                <div className="text-right text-[11px] font-sans text-stone-700 leading-tight">
                  {doc.showDocNo && doc.documentNo && (
                    <div>
                      <span className="text-stone-400 mr-1">Belge No:</span>
                      <span className="font-semibold font-mono">{doc.documentNo}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-stone-400 mr-1">Tarih:</span>
                    <span className="font-medium font-mono">{doc.date || new Date().toLocaleDateString('tr-TR')}</span>
                  </div>
                  {doc.city && (
                    <div>
                      <span className="text-stone-400 mr-1">Düzenleme Yeri:</span>
                      <span className="font-medium">{doc.city}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Institution Header */}
              <div className="text-center my-2">
                <InlineEditable
                  tagName="h2"
                  multiline={false}
                  value={doc.institution}
                  onChange={(val) => updateField('institution', val)}
                  disabled={!isWordMode}
                  className="text-sm md:text-base font-bold tracking-wide uppercase text-stone-900 leading-snug block text-center cursor-text"
                  placeholder="İLGİLİ MAKAMA / KURUMA"
                />
              </div>

              {/* Main Document Title */}
              <div className="text-center my-3">
                <InlineEditable
                  tagName="h1"
                  multiline={false}
                  value={doc.title}
                  onChange={(val) => updateField('title', val)}
                  disabled={!isWordMode}
                  className="text-xl md:text-2xl font-black tracking-widest uppercase text-stone-950 underline underline-offset-4 decoration-stone-400 block text-center cursor-text"
                  placeholder="MUVAFAKATNAME"
                />
                {doc.subtitle && (
                  <InlineEditable
                    tagName="p"
                    multiline={false}
                    value={doc.subtitle}
                    onChange={(val) => updateField('subtitle', val)}
                    disabled={!isWordMode}
                    className="text-[11px] font-sans font-medium uppercase tracking-wider text-stone-600 mt-1 block text-center cursor-text"
                    placeholder="Alt Başlık"
                  />
                )}
              </div>

              {/* Parties Info Block */}
              <div className="border border-stone-300 bg-stone-50/50 rounded-sm mb-3 text-[12px] font-sans divide-y divide-stone-200">
                {/* Muvafakat Veren 1 */}
                <div className="p-2 grid grid-cols-12 gap-1 items-start">
                  <div className="col-span-3 font-semibold text-stone-800">
                    Muvafakat Veren{doc.grantor2?.enabled ? ' (1)' : ''}:
                  </div>
                  <div className="col-span-9 text-stone-900 leading-snug">
                    <div className="font-bold flex items-center justify-between">
                      <span>{doc.grantor.fullName || '...........................................'}</span>
                      <span className="text-xs font-mono font-medium text-stone-600">
                        T.C. No: {doc.grantor.tcNumber || '...........'}
                      </span>
                    </div>
                    {doc.grantor.relation && (
                      <div className="text-[11px] text-stone-600">
                        Sıfatı / Yakınlığı: <span className="text-stone-800">{doc.grantor.relation}</span>
                        {doc.grantor.phone && (
                          <span className="ml-3 font-mono">Tel: {doc.grantor.phone}</span>
                        )}
                      </div>
                    )}
                    {doc.grantor.address && (
                      <div className="text-[11px] text-stone-600 mt-0.5">
                        Adres: <span className="text-stone-800">{doc.grantor.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Muvafakat Veren 2 */}
                {doc.grantor2?.enabled && (
                  <div className="p-2 grid grid-cols-12 gap-1 items-start bg-stone-100/40">
                    <div className="col-span-3 font-semibold text-stone-800">
                      Muvafakat Veren (2):
                    </div>
                    <div className="col-span-9 text-stone-900 leading-snug">
                      <div className="font-bold flex items-center justify-between">
                        <span>{doc.grantor2.fullName || '...........................................'}</span>
                        <span className="text-xs font-mono font-medium text-stone-600">
                          T.C. No: {doc.grantor2.tcNumber || '...........'}
                        </span>
                      </div>
                      {doc.grantor2.relation && (
                        <div className="text-[11px] text-stone-600">
                          Sıfatı / Yakınlığı: <span className="text-stone-800">{doc.grantor2.relation}</span>
                          {doc.grantor2.phone && (
                            <span className="ml-3 font-mono">Tel: {doc.grantor2.phone}</span>
                          )}
                        </div>
                      )}
                      {doc.grantor2.address && (
                        <div className="text-[11px] text-stone-600 mt-0.5">
                          Adres: <span className="text-stone-800">{doc.grantor2.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Lehine Muvafakat Edilen */}
                {doc.grantee?.enabled && (
                  <div className="p-2 grid grid-cols-12 gap-1 items-start">
                    <div className="col-span-3 font-semibold text-stone-800">
                      Muvafakat Edilen:
                    </div>
                    <div className="col-span-9 text-stone-900 leading-snug">
                      <div className="font-bold flex items-center justify-between">
                        <span>{doc.grantee.fullName || '...........................................'}</span>
                        <span className="text-xs font-mono font-medium text-stone-600">
                          T.C. No: {doc.grantee.tcNumber || '...........'}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-600 flex flex-wrap gap-x-4">
                        {doc.grantee.relation && (
                          <span>Yakınlık / Durum: <strong className="text-stone-800">{doc.grantee.relation}</strong></span>
                        )}
                        {doc.grantee.birthDate && (
                          <span>Doğum Tarihi: <strong className="font-mono text-stone-800">{doc.grantee.birthDate}</strong></span>
                        )}
                      </div>
                      {doc.grantee.travelCountry && (
                        <div className="text-[11px] text-stone-700 mt-0.5">
                          Gidilecek Yer / Kapsam: <span className="font-medium text-stone-900">{doc.grantee.travelCountry}</span>
                          {doc.grantee.travelDates && (
                            <span className="ml-2 font-mono text-stone-600">({doc.grantee.travelDates})</span>
                          )}
                        </div>
                      )}
                      {doc.grantee.companion && (
                        <div className="text-[11px] text-stone-700">
                          Refakatçi / Sorumlu: <span className="font-medium">{doc.grantee.companion}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Subject (Konu) */}
              {doc.subject && (
                <div className="mb-3 text-[12.5px] font-sans">
                  <span className="font-bold uppercase tracking-wider text-stone-900 mr-2">
                    KONU:
                  </span>
                  <InlineEditable
                    tagName="span"
                    value={doc.subject}
                    onChange={(val) => updateField('subject', val)}
                    disabled={!isWordMode}
                    className="font-semibold text-stone-800 cursor-text"
                    placeholder="Muvafakat konusu..."
                  />
                </div>
              )}

              {/* Legal Body Text */}
              <div className="text-justify leading-relaxed space-y-2.5 text-stone-950 font-normal">
                {isWordMode ? (
                  <InlineEditable
                    tagName="div"
                    multiline={true}
                    value={doc.bodyText}
                    onChange={(val) => updateField('bodyText', val)}
                    disabled={!isWordMode}
                    className="w-full min-h-[100px] block leading-relaxed whitespace-pre-wrap cursor-text"
                    placeholder="Muvafakat metnini buraya yazınız..."
                  />
                ) : (
                  paragraphs.map((p, idx) => (
                    <p key={idx} className="indent-6 leading-relaxed">
                      {p}
                    </p>
                  ))
                )}
              </div>

              {/* Additional Clauses */}
              {doc.additionalClauses && doc.additionalClauses.length > 0 && (
                <div className="mt-3 space-y-1 text-[12.5px]">
                  <div className="font-bold uppercase tracking-wider text-[11px] text-stone-800 font-sans">
                    Özel Hükümler ve Şartlar:
                  </div>
                  <ol className="list-decimal pl-5 space-y-0.5 text-stone-900">
                    {doc.additionalClauses.map((clause, idx) => (
                      <li key={idx} className="leading-snug">
                        {clause}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            {/* BOTTOM SECTION: Signatures & Verification */}
            <div className="mt-4 pt-2">
              {/* Signatures Area */}
              {doc.signatureLayout === 'single' && (
                <div className="flex justify-end pr-8 mb-2">
                  <div className="text-center w-64">
                    <div className="text-[11px] font-sans text-stone-500 mb-0.5">
                      {doc.date}
                    </div>
                    <div className="text-[12px] font-sans font-bold uppercase tracking-wider text-stone-800">
                      Muvafakat Veren
                    </div>
                    <div className="font-bold text-sm text-stone-950 mt-0.5">
                      {doc.grantor.fullName}
                    </div>
                    <div className="text-[11px] font-mono text-stone-600">
                      T.C. {doc.grantor.tcNumber}
                    </div>
                    <div className="h-14 flex items-end justify-center">
                      <div className="w-48 border-b border-dashed border-stone-400 text-[10px] text-stone-400 pb-0.5">
                        (Islak İmza)
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {doc.signatureLayout === 'dual_parents' && (
                <div className="grid grid-cols-2 gap-8 px-6 mb-2">
                  <div className="text-center">
                    <div className="text-[11px] font-sans text-stone-500 mb-0.5">
                      {doc.date}
                    </div>
                    <div className="text-[12px] font-sans font-bold uppercase tracking-wider text-stone-800">
                      Muvafakat Veren (1) / {doc.grantor.relation || 'Veli'}
                    </div>
                    <div className="font-bold text-sm text-stone-950 mt-0.5">
                      {doc.grantor.fullName}
                    </div>
                    <div className="text-[11px] font-mono text-stone-600">
                      T.C. {doc.grantor.tcNumber}
                    </div>
                    <div className="h-12 flex items-end justify-center">
                      <div className="w-40 border-b border-dashed border-stone-400 text-[10px] text-stone-400 pb-0.5">
                        (İmza)
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-[11px] font-sans text-stone-500 mb-0.5">
                      {doc.date}
                    </div>
                    <div className="text-[12px] font-sans font-bold uppercase tracking-wider text-stone-800">
                      Muvafakat Veren (2) / {doc.grantor2.relation || 'Veli'}
                    </div>
                    <div className="font-bold text-sm text-stone-950 mt-0.5">
                      {doc.grantor2.fullName || '...............................'}
                    </div>
                    <div className="text-[11px] font-mono text-stone-600">
                      T.C. {doc.grantor2.tcNumber || '...........'}
                    </div>
                    <div className="h-12 flex items-end justify-center">
                      <div className="w-40 border-b border-dashed border-stone-400 text-[10px] text-stone-400 pb-0.5">
                        (İmza)
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {doc.signatureLayout === 'grantor_grantee' && (
                <div className="grid grid-cols-2 gap-8 px-6 mb-2">
                  <div className="text-center">
                    <div className="text-[12px] font-sans font-bold uppercase tracking-wider text-stone-800">
                      Muvafakat Veren
                    </div>
                    <div className="font-bold text-sm text-stone-950 mt-0.5">
                      {doc.grantor.fullName}
                    </div>
                    <div className="text-[11px] font-mono text-stone-600">
                      T.C. {doc.grantor.tcNumber}
                    </div>
                    <div className="h-12 flex items-end justify-center">
                      <div className="w-40 border-b border-dashed border-stone-400 text-[10px] text-stone-400 pb-0.5">
                        (İmza)
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-[12px] font-sans font-bold uppercase tracking-wider text-stone-800">
                      Muvafakat Edilen / Kabul Eden
                    </div>
                    <div className="font-bold text-sm text-stone-950 mt-0.5">
                      {doc.grantee.fullName || '...............................'}
                    </div>
                    <div className="text-[11px] font-mono text-stone-600">
                      T.C. {doc.grantee.tcNumber || '...........'}
                    </div>
                    <div className="h-12 flex items-end justify-center">
                      <div className="w-40 border-b border-dashed border-stone-400 text-[10px] text-stone-400 pb-0.5">
                        (İmza)
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notary Block */}
              {doc.includeNotaryNote && (
                <div className="border border-stone-400 bg-stone-50/70 p-2 text-[10.5px] font-sans text-stone-800 mb-2 rounded-xs">
                  <div className="flex justify-between items-start font-bold uppercase tracking-wider text-[10px] text-stone-700 border-b border-stone-300 pb-0.5 mb-1">
                    <span>RESMİ TASDİK / NOTERLİK ŞERHİ</span>
                    <span>YEVMİYE NO: ....................</span>
                  </div>
                  <p className="italic text-stone-700 leading-snug">
                    {doc.notaryNoteText || 'İşbu muvafakatname ilgililerin hüviyet tespiti yapılarak huzurumda tanzim ve imza edilmiştir.'}
                  </p>
                  <div className="flex justify-between items-center mt-2 text-[10px] text-stone-600">
                    <div>Tarih / Mühür: ......................</div>
                    <div>Yetkili İmza & Kaşe: .......................................</div>
                  </div>
                </div>
              )}

              {/* Official Document Footer Bar */}
              <div className="border-t border-stone-300 pt-1.5 flex items-center justify-between text-[10px] font-sans text-stone-500">
                <div className="flex items-center gap-3">
                  {doc.showQrCode && (
                    <div className="flex items-center gap-1.5" title="Resmi Belge Doğrulama Kodu">
                      <svg viewBox="0 0 33 33" className="w-7 h-7 text-stone-900 fill-current">
                        <rect x="0" y="0" width="9" height="9" fill="currentColor" />
                        <rect x="2" y="2" width="5" height="5" fill="#fff" />
                        <rect x="3.5" y="3.5" width="2" height="2" fill="currentColor" />
                        <rect x="24" y="0" width="9" height="9" fill="currentColor" />
                        <rect x="26" y="2" width="5" height="5" fill="#fff" />
                        <rect x="27.5" y="3.5" width="2" height="2" fill="currentColor" />
                        <rect x="0" y="24" width="9" height="9" fill="currentColor" />
                        <rect x="2" y="26" width="5" height="5" fill="#fff" />
                        <rect x="3.5" y="27.5" width="2" height="2" fill="currentColor" />
                        <rect x="12" y="3" width="3" height="3" fill="currentColor" />
                        <rect x="18" y="4" width="3" height="2" fill="currentColor" />
                        <rect x="14" y="10" width="5" height="4" fill="currentColor" />
                        <rect x="4" y="14" width="3" height="5" fill="currentColor" />
                        <rect x="12" y="16" width="4" height="4" fill="currentColor" />
                        <rect x="18" y="14" width="4" height="6" fill="currentColor" />
                        <rect x="25" y="14" width="4" height="4" fill="currentColor" />
                        <rect x="12" y="24" width="4" height="3" fill="currentColor" />
                        <rect x="18" y="23" width="5" height="5" fill="currentColor" />
                        <rect x="25" y="22" width="4" height="4" fill="currentColor" />
                        <rect x="25" y="28" width="5" height="3" fill="currentColor" />
                      </svg>
                      <div>
                        <div className="font-semibold text-stone-700">Evrak Doğrulama Kodu</div>
                        <div className="font-mono text-[9px] text-stone-500">
                          TR-MVF-{doc.grantor.tcNumber ? doc.grantor.tcNumber.slice(-4) : '2026'}-SEC
                        </div>
                      </div>
                    </div>
                  )}

                  {doc.showBarcode && (
                    <div className="hidden sm:block">
                      <div className="font-mono text-[8px] text-stone-400 tracking-wider">
                        ||| | |||| | ||| || |||| | |||||
                      </div>
                      <div className="font-mono text-[8px] text-stone-600">
                        *{doc.documentNo || 'MVF-2026'}*
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-stone-400">Resmi Belge Standardı</span>
                  <span className="mx-1.5">·</span>
                  <span className="font-medium text-stone-700">Sayfa 1 / 1</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
