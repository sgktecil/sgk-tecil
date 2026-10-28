import React, { useState, useRef, useEffect } from 'react';
import { MuvafakatnameDocument, DocFont, BorderStyle } from '../types/muvafakatname';
import { OFFICIAL_TEMPLATES } from '../data/templates';
import { A4Document } from './A4Document';
import { EditorPanel } from './EditorPanel';
import { PasteExampleModal } from './PasteExampleModal';
import { printDirectDocument, exportToPdf } from '../utils/pdfExport';
import {
  ZoomIn,
  ZoomOut,
  Copy,
  RotateCcw,
  Check,
  Eye,
  Edit3,
  HelpCircle,
  FileCheck2,
  AlertCircle,
  Printer,
  Download,
  X,
  FileSignature,
  ChevronDown,
  Sliders,
  Type,
  FileText,
  PanelLeftClose,
  PanelLeft,
  UploadCloud,
  CheckCircle2,
  Maximize2
} from 'lucide-react';

interface MuvafakatnameModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBorrower?: {
    unvan?: string;
    sigortaNo?: string;
    isyeriAdresi?: string;
    ilMudurlugu?: string;
    sgkMerkezi?: string;
    tcknVkn?: string;
    [key: string]: any;
  };
}

export const MuvafakatnameModal: React.FC<MuvafakatnameModalProps> = ({
  isOpen,
  onClose,
  initialBorrower,
}) => {
  const [doc, setDoc] = useState<MuvafakatnameDocument>(() => {
    // 1. Priority: localStorage draft (eski sahte/örnek veri içeriyorsa temizle)
    try {
      const saved = localStorage.getItem('muvafakatname_doc_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed?.grantor?.fullName?.includes('ÜMİT') ||
          parsed?.grantor?.fullName?.includes('ÖZDEMİR') ||
          parsed?.grantor?.tcNumber === '12345678901' ||
          parsed?.grantor?.address?.includes('ALTINORDU') ||
          parsed?.sgkDetails?.debtorName?.includes('ÜMİT') ||
          parsed?.sgkDetails?.debtorName?.includes('ÖZDEMİR')
        ) {
          localStorage.removeItem('muvafakatname_doc_draft');
        } else if (parsed && (parsed.title || parsed.sgkDetails || parsed.templateType)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Draft load error:', e);
    }

    const baseTemplate = OFFICIAL_TEMPLATES[0].data as MuvafakatnameDocument;

    // Prefill with initialBorrower if available
    const initialInstitution = initialBorrower?.ilMudurlugu
      ? `${initialBorrower.ilMudurlugu.toUpperCase()} SOSYAL GÜVENLİK İL MÜDÜRLÜĞÜ${initialBorrower.sgkMerkezi ? ' / ' + initialBorrower.sgkMerkezi.toUpperCase() + ' SOSYAL GÜVENLİK MERKEZİNE' : 'NE'}`
      : baseTemplate.institution;

    return {
      ...baseTemplate,
      id: 'doc-initial',
      institution: initialInstitution,
      sgkDetails: {
        ...(baseTemplate.sgkDetails || ({} as any)),
        debtorName: initialBorrower?.unvan || '',
        debtPeriod: '',
        debtAmount: '',
        debtType: '',
        propertyDetails: '',
        spouseFullName: '',
        spouseTcNumber: '',
        icraOfficer1Name: '',
        icraOfficer2Name: '',
      },
      grantor: {
        fullName: '',
        tcNumber: '',
        address: '',
        phone: '',
        title: '',
        taxNumber: '',
      },
      grantor2: {
        enabled: false,
        fullName: '',
        tcNumber: '',
      },
    };
  });

  const [zoom, setZoom] = useState<number>(0.85);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  
  // Left sidebar is now closed by default - document takes center stage!
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Toolbar dropdown menus
  const [templateMenuOpen, setTemplateMenuOpen] = useState(false);
  const [formatMenuOpen, setFormatMenuOpen] = useState(false);

  const templateMenuRef = useRef<HTMLDivElement>(null);
  const formatMenuRef = useRef<HTMLDivElement>(null);
  const a4Ref = useRef<HTMLDivElement>(null);


  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (templateMenuRef.current && !templateMenuRef.current.contains(e.target as Node)) {
        setTemplateMenuOpen(false);
      }
      if (formatMenuRef.current && !formatMenuRef.current.contains(e.target as Node)) {
        setFormatMenuOpen(false);
      }
    };
    if (templateMenuOpen || formatMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [templateMenuOpen, formatMenuOpen]);


  // Sync active document state to localStorage
  useEffect(() => {
    if (isOpen) {
      try {
        localStorage.setItem('muvafakatname_doc_draft', JSON.stringify(doc));
      } catch (e) {
        console.warn('Draft save error:', e);
      }
    }
  }, [doc, isOpen]);

  // Update debtor info if borrower changes and doc is empty
  useEffect(() => {
    if (isOpen && initialBorrower) {
      setDoc((prev) => {
        const needsDebtorUpdate = !prev.sgkDetails?.debtorName && initialBorrower.unvan;
        const needsInstUpdate = (!prev.institution || prev.institution === 'SOSYAL GÜVENLİK İL MÜDÜRLÜĞÜNE') && initialBorrower.ilMudurlugu;

        if (needsDebtorUpdate || needsInstUpdate) {
          const newInst = initialBorrower.ilMudurlugu
            ? `${initialBorrower.ilMudurlugu.toUpperCase()} SOSYAL GÜVENLİK İL MÜDÜRLÜĞÜ${initialBorrower.sgkMerkezi ? ' / ' + initialBorrower.sgkMerkezi.toUpperCase() + ' SOSYAL GÜVENLİK MERKEZİNE' : 'NE'}`
            : prev.institution;

          return {
            ...prev,
            institution: needsInstUpdate ? newInst : prev.institution,
            sgkDetails: {
              ...(prev.sgkDetails || ({} as any)),
              debtorName: prev.sgkDetails?.debtorName || initialBorrower.unvan || '',
            },
          };
        }
        return prev;
      });
    }
  }, [isOpen, initialBorrower]);

  if (!isOpen) return null;

  const handlePrint = () => {
    printDirectDocument('a4-sheet');
  };

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      const filename = `SGK_Ek9_Muvafakatname_${doc.grantor?.fullName ? doc.grantor.fullName.replace(/\s+/g, '_') : 'Belgesi'}.pdf`;
      await exportToPdf('a4-sheet', filename);
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleCopyText = () => {
    let textOutput = '';
    if (doc.templateType === 'sgk_ek9') {
      const spouseBlock = doc.sgkDetails?.includeSpouseConsent
        ? `\nMALİKİN EŞİ (TMK m.194 EŞ MUVAFAKATİ):\nAdı Soyadı: ${doc.sgkDetails?.spouseFullName || '................................'}\nTC Kimlik No: ${doc.sgkDetails?.spouseTcNumber || '................................'}\nİmza: (İmza)\n\nEŞİNİN MUVAFAKAT BEYANI (TMK m. 194):\n${doc.sgkDetails?.spouseConsentText || 'Yukarıda kimlik ve adres bilgileri yer alan eşim tarafından Sosyal Güvenlik Kurumuna olan borcuna karşılık teminat olarak gösterilen gayrimenkulün haczedilmesine ve teminat gösterilmesine serbest irademle açıkça muvafakat ediyorum.'}\n`
        : '';

      textOutput = `
                                                                           ${doc.annexCode || 'Ek-9'}
        ${doc.title || 'ÜÇÜNCÜ ŞAHISLAR TARAFINDAN VERİLECEK MUVAFAKATNAME ÖRNEĞİ'}

                      ${doc.institution || '........................... SOSYAL GÜVENLİK İL MÜDÜRLÜĞÜNE'}

${doc.sgkDetails?.debtorName ? doc.sgkDetails.debtorName + "’nin" : "..................................’nin"} Sosyal Güvenlik Kurumuna olan ${doc.sgkDetails?.debtPeriod || "..............."} dönemi/ayına ilişkin ${doc.sgkDetails?.debtAmount ? doc.sgkDetails.debtAmount + " TL" : ".................................. TL"} tutarında ${doc.sgkDetails?.debtType || "........................."} borcuna ve bu borca bu tarihten ödenmesine kadar geçecek süre için işleyecek fer’ilerine karşılık aşağıda özellikleri yazılı menkul /gayrimenkul malı 6183 sayılı Kanunun 10 uncu maddesinin beşinci fıkrası gereğince teminat olarak gösteriyor ve söz konusu malların Sosyal Güvenlik Kurumu tarafından haczedilmesine muvafakat ediyorum. Bu konuda herhangi bir itirazda bulunmayacağımı beyan ve taahhüt ederim.

                                                                 ${doc.date || '..../...../.....'}
                                                                 ${doc.grantor.fullName || 'Adı Soyadı'}
                                                                 ${doc.grantor.title || 'Ünvanı'}
                                                                 (İmza)

Adres           : ${doc.grantor.address || '....................................................................'}
TC Kimlik No    : ${doc.grantor.tcNumber || '................................'}
Vergi Kimlik No : ${doc.grantor.taxNumber || '................................'}
${doc.sgkDetails?.propertyDetails ? `\nTeminat Malı    : ${doc.sgkDetails.propertyDetails}` : ''}
${spouseBlock}
${doc.sgkDetails?.includeSpouseConsent ? 'Bu muvafakatname, malik ve eşi huzurumuzda imza altına alınmıştır.' : 'Bu muvafakatname, huzurumuzda imza altına alınmıştır.'}

İcra Memuru                                            Sorumlu İcra Memuru
${doc.sgkDetails?.icraOfficer1Name || ''}                              ${doc.sgkDetails?.icraOfficer2Name || ''}
(İmza)                                                 (İmza)
      `.trim();
    } else {
      textOutput = `
${doc.institution}

${doc.title}
${doc.subtitle ? doc.subtitle + '\n' : ''}
Belge No: ${doc.documentNo} | Tarih: ${doc.date} | Yer: ${doc.city}

MUVAFAKAT VEREN:
Ad Soyad: ${doc.grantor.fullName} (T.C.: ${doc.grantor.tcNumber})
Sıfatı / Yakınlığı: ${doc.grantor.relation || '-'}
Adres: ${doc.grantor.address || '-'}

${doc.grantor2?.enabled ? `MUVAFAKAT VEREN (2):\nAd Soyad: ${doc.grantor2.fullName} (T.C.: ${doc.grantor2.tcNumber})\nSıfatı: ${doc.grantor2.relation || '-'}\n` : ''}
${doc.grantee?.enabled ? `LEHİNE MUVAFAKAT EDİLEN:\nAd Soyad: ${doc.grantee.fullName} (T.C.: ${doc.grantee.tcNumber})\nDoğum Tarihi: ${doc.grantee.birthDate || '-'}\n` : ''}

KONU: ${doc.subject}

BEYAN VE TAAHHÜT:
${doc.bodyText}

${doc.additionalClauses && doc.additionalClauses.length > 0 ? '\nÖZEL HÜKÜMLER:\n' + doc.additionalClauses.map((c, i) => `${i + 1}. ${c}`).join('\n') : ''}

İşbu muvafakatname yetkili resmi mercilere ibraz edilmek üzere tanzim edilmiştir.
      `.trim();
    }

    navigator.clipboard.writeText(textOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAutoFit = () => {
    const totalChars = (doc.bodyText?.length || 0) + (doc.additionalClauses?.join(' ').length || 0);

    if (totalChars > 900) {
      setDoc((prev) => ({
        ...prev,
        fontSize: 12.5,
        lineSpacing: 1.35,
      }));
    } else if (totalChars > 600) {
      setDoc((prev) => ({
        ...prev,
        fontSize: 13.5,
        lineSpacing: 1.42,
      }));
    } else {
      setDoc((prev) => ({
        ...prev,
        fontSize: 14,
        lineSpacing: 1.5,
      }));
    }
  };

  const handleSelectTemplate = (templateData: Partial<MuvafakatnameDocument>) => {
    setDoc((prev) => ({
      ...prev,
      ...templateData,
      id: 'doc-' + Date.now(),
      // Preserve grantor/debtor details if already entered
      grantor: {
        ...(templateData.grantor || ({} as any)),
        fullName: prev.grantor?.fullName || templateData.grantor?.fullName || '',
        tcNumber: prev.grantor?.tcNumber || templateData.grantor?.tcNumber || '',
        address: prev.grantor?.address || templateData.grantor?.address || '',
      },
      sgkDetails: templateData.sgkDetails
        ? {
            ...templateData.sgkDetails,
            debtorName: prev.sgkDetails?.debtorName || templateData.sgkDetails.debtorName || '',
            debtAmount: prev.sgkDetails?.debtAmount || templateData.sgkDetails.debtAmount || '',
            debtPeriod: prev.sgkDetails?.debtPeriod || templateData.sgkDetails.debtPeriod || '',
            debtType: prev.sgkDetails?.debtType || templateData.sgkDetails.debtType || '',
          }
        : prev.sgkDetails,
    }));
    setTemplateMenuOpen(false);
  };

  const handleReset = () => {
    if (window.confirm('Belgeyi varsayılan resmi şablona sıfırlamak istiyor musunuz?')) {
      setDoc({
        ...(OFFICIAL_TEMPLATES[0].data as MuvafakatnameDocument),
        id: 'doc-reset-' + Date.now(),
      });
    }
  };

  // Find active template name for display
  const currentTemplate = OFFICIAL_TEMPLATES.find((t) => {
    if (t.data.templateType === 'sgk_ek9' && doc.templateType === 'sgk_ek9') {
      if (t.id === 'sgk-ek9-gayrimenkul') {
        return doc.sgkDetails?.includeSpouseConsent === true;
      }
      if (t.id === 'sgk-ek9-tasit') {
        return doc.sgkDetails?.customPropertyTypeText?.includes('taşıt') || (doc.sgkDetails?.propertyType === 'menkul' && Boolean(doc.sgkDetails?.propertyDetails?.includes('Plaka')));
      }
      return doc.sgkDetails?.includeSpouseConsent !== true && !doc.sgkDetails?.customPropertyTypeText?.includes('taşıt');
    }
    return t.data.subject === doc.subject || t.data.title === doc.title;
  }) || OFFICIAL_TEMPLATES[0];

  const totalLength = (doc.bodyText?.length || 0) + (doc.additionalClauses?.reduce((acc, c) => acc + c.length, 0) || 0);
  const isTooLong = totalLength > 1150 && doc.fontSize >= 14;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-stone-100 text-stone-900 font-sans selection:bg-stone-900 selection:text-white overflow-hidden animate-in fade-in duration-150">
      {/* Universal Top Bar with Branding & Primary Actions */}
      <header className="flex items-center justify-between gap-3 px-4 sm:px-6 py-2.5 bg-white border-b border-stone-200 no-print shrink-0 shadow-xs z-30">
        {/* Left: Brand title & badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-2 rounded-xl bg-teal-600 text-white shadow-xs">
            <FileSignature className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight text-stone-900 whitespace-nowrap">
                Resmi Muvafakatname ve Belge Düzenleyici
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-500/10 text-teal-700 border border-teal-500/20 hidden sm:inline-flex">
                Doğrudan A4 Modu
              </span>
            </div>
            <p className="text-[11px] text-stone-500 hidden md:block">
              Belgeye tıklayarak doğrudan düzenleyin · Sol form alanına gerek kalmadan yay animasyonuyla anında doldurun
            </p>
          </div>
        </div>

        {/* Right: Functional Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Optional Sidebar Toggle Button for those who still want the old raw form */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
              isSidebarOpen
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100'
            }`}
            title={isSidebarOpen ? 'Gereksiz Sol Form Panelini Gizle' : 'İsteğe Bağlı Klasik Form Panelini Aç'}
          >
            {isSidebarOpen ? (
              <>
                <PanelLeftClose className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Form Paneli (Açık)</span>
              </>
            ) : (
              <>
                <PanelLeft className="w-3.5 h-3.5 text-stone-500" />
                <span className="hidden sm:inline">Form Paneli</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            className="px-3 py-1.5 text-xs font-bold text-stone-700 bg-white border border-stone-300 rounded-xl hover:bg-stone-50 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
            title="A4 formatında PDF olarak indir"
          >
            <Download className="w-3.5 h-3.5 text-stone-600" />
            <span className="hidden sm:inline">{isDownloadingPdf ? 'İndiriliyor...' : 'PDF İndir'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 shadow-sm cursor-pointer hover:shadow-md"
            title="Belgeyi doğrudan yazıcıya gönder (Ctrl + P)"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>YAZDIR (A4)</span>
          </button>

          {/* Close Modal Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer ml-1"
            title="Kapat ve Tecil Portalına Dön"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* DOCUMENT-FIRST CANVAS TOOLBAR (Elevated Quick Controls replacing the bulky left panel) */}
      <div className="px-4 sm:px-6 py-2 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2.5 shrink-0 no-print z-20">
        {/* Left Controls: Template Switcher & Design Settings & Word Upload */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 1. Official Template Selector Dropdown */}
          <div className="relative" ref={templateMenuRef}>
            <button
              type="button"
              onClick={() => {
                setTemplateMenuOpen(!templateMenuOpen);
                setFormatMenuOpen(false);
              }}
              className="px-3 py-1.5 bg-white border border-stone-300 hover:border-stone-400 rounded-xl text-xs font-bold text-stone-800 flex items-center gap-2 shadow-2xs hover:bg-stone-50 transition-colors cursor-pointer"
              title="Resmi Şablon Değiştir"
            >
              <FileText className="w-3.5 h-3.5 text-teal-600" />
              <span className="max-w-[200px] sm:max-w-[280px] truncate">
                {currentTemplate.name.replace(/SGK Ek-9:\s*/, 'SGK Ek-9: ')}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${templateMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Template Dropdown Menu */}
            {templateMenuOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 border-b border-stone-100">
                  <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
                    SGK Resmi Muvafakatname Şablonları
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto py-1">
                  {OFFICIAL_TEMPLATES.map((tmpl) => {
                    const isSelected = tmpl.id === currentTemplate.id;
                    return (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => handleSelectTemplate(tmpl.data)}
                        className={`w-full text-left px-3.5 py-2.5 hover:bg-stone-50 flex items-start gap-2.5 transition-colors cursor-pointer ${
                          isSelected ? 'bg-teal-50/70 border-l-4 border-teal-600' : ''
                        }`}
                      >
                        <div className="mt-0.5">
                          {isSelected ? (
                            <CheckCircle2 className="w-4 h-4 text-teal-600" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-stone-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className={`text-xs font-bold truncate ${isSelected ? 'text-teal-900' : 'text-stone-800'}`}>
                              {tmpl.name}
                            </span>
                            <span className="text-[10px] text-stone-400 shrink-0 font-medium">
                              {tmpl.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5 leading-snug">
                            {tmpl.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 2. Format & Typography Settings Dropdown */}
          <div className="relative" ref={formatMenuRef}>
            <button
              type="button"
              onClick={() => {
                setFormatMenuOpen(!formatMenuOpen);
                setTemplateMenuOpen(false);
              }}
              className="px-3 py-1.5 bg-white border border-stone-300 hover:border-stone-400 rounded-xl text-xs font-bold text-stone-800 flex items-center gap-1.5 shadow-2xs hover:bg-stone-50 transition-colors cursor-pointer"
              title="A4 Yazı Tipi, Boyut, Satır Aralığı ve Kenarlık Ayarları"
            >
              <Type className="w-3.5 h-3.5 text-stone-600" />
              <span>Biçimlendirme &amp; Font</span>
              <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${formatMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Format Dropdown Menu */}
            {formatMenuOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-stone-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-4">
                {/* Font Family */}
                <div>
                  <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
                    Yazı Tipi (Font)
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'serif', label: 'Times', sub: 'Resmi' },
                      { id: 'garamond', label: 'Garamond', sub: 'Klasik' },
                      { id: 'sans', label: 'Arial', sub: 'Düz' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setDoc((prev) => ({ ...prev, docFont: f.id as DocFont }))}
                        className={`p-2 rounded-lg text-center border text-xs font-bold transition-all cursor-pointer ${
                          doc.docFont === f.id
                            ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        <div>{f.label}</div>
                        <div className="text-[10px] opacity-75 font-normal">{f.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Size & Line Spacing */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
                      Punto: {doc.fontSize} pt
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setDoc((prev) => ({ ...prev, fontSize: Math.max(11, prev.fontSize - 0.5) }))}
                        className="flex-1 py-1 px-2 bg-stone-100 hover:bg-stone-200 rounded-md font-bold text-xs cursor-pointer"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => setDoc((prev) => ({ ...prev, fontSize: Math.min(16, prev.fontSize + 0.5) }))}
                        className="flex-1 py-1 px-2 bg-stone-100 hover:bg-stone-200 rounded-md font-bold text-xs cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
                      Satır Aralığı
                    </label>
                    <select
                      value={doc.lineSpacing}
                      onChange={(e) => setDoc((prev) => ({ ...prev, lineSpacing: parseFloat(e.target.value) }))}
                      className="w-full text-xs font-semibold py-1.5 px-2 bg-stone-50 border border-stone-300 rounded-lg cursor-pointer"
                    >
                      <option value="1.2">1.2 (Sıkı)</option>
                      <option value="1.4">1.4 (Orta)</option>
                      <option value="1.6">1.6 (Geniş/Standart)</option>
                      <option value="1.8">1.8 (Ferah)</option>
                    </select>
                  </div>
                </div>

                {/* Border Style */}
                <div>
                  <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
                    Kenarlık Stili
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'none', label: 'Yok (Resmi)' },
                      { id: 'thin-single', label: 'İnce Çerçeve' },
                      { id: 'classic-double', label: 'Çift Çizgi' },
                    ].map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setDoc((prev) => ({ ...prev, borderStyle: b.id as BorderStyle }))}
                        className={`p-1.5 rounded-lg text-center border text-[11px] font-semibold transition-all cursor-pointer ${
                          doc.borderStyle === b.id
                            ? 'bg-stone-900 text-white border-stone-900'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auto-Fit Action */}
                <div className="pt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => {
                      handleAutoFit();
                      setFormatMenuOpen(false);
                    }}
                    className="w-full py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Tek Sayfaya Otomatik Sığdır</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3. Word (.docx) & Paste Modal Trigger */}
          <button
            type="button"
            onClick={() => setIsPasteModalOpen(true)}
            className="px-3 py-1.5 bg-white border border-stone-300 hover:border-stone-400 rounded-xl text-xs font-bold text-stone-800 flex items-center gap-1.5 shadow-2xs hover:bg-stone-50 transition-colors cursor-pointer"
            title="Word (.docx) yükle veya mevcut metin yapıştırarak A4 belgesine dönüştür"
          >
            <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Word / Metin Yükle</span>
          </button>
        </div>

        {/* Right Controls: Slot Style, Zoom, Reset & Copy */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Page Fit Badge */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs">
            {isTooLong ? (
              <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 text-[11px]">
                <AlertCircle className="w-3 h-3" />
                <span>Sayfa aşabilir</span>
                <button
                  type="button"
                  onClick={handleAutoFit}
                  className="underline font-bold text-amber-900 ml-0.5 cursor-pointer"
                >
                  Sığdır
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 text-[11px] font-medium">
                <FileCheck2 className="w-3 h-3 text-emerald-600" />
                <span>Tek Sayfa Uyumlu</span>
              </div>
            )}
          </div>


          {/* Zoom Controls */}
          <div className="flex items-center gap-0.5 bg-stone-200/70 rounded-xl p-0.5 border border-stone-300/80 text-xs">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
              className="p-1.5 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-white transition-colors cursor-pointer"
              title="Uzaklaştır"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 font-mono text-[11px] font-bold text-stone-700">
              %{Math.round(zoom * 100)}
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(1.3, z + 0.1))}
              className="p-1.5 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-white transition-colors cursor-pointer"
              title="Yakınlaştır"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoom(0.85)}
              className="px-1.5 py-0.5 text-[10px] font-semibold text-stone-600 hover:text-stone-900 rounded hover:bg-white transition-colors cursor-pointer"
              title="Varsayılan Boyut"
            >
              %85
            </button>
          </div>

          {/* Copy Plain Text */}
          <button
            type="button"
            onClick={handleCopyText}
            className="px-2.5 py-1.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-xl flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
            title="Metni Panoya Kopyala"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold hidden sm:inline">Kopyalandı</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Kopyala</span>
              </>
            )}
          </button>

          {/* Reset to template */}
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 text-stone-500 hover:text-stone-800 rounded-xl hover:bg-stone-200/80 transition-colors cursor-pointer"
            title="Varsayılan Şablona Sıfırla"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Workspace: Document-First with Spacious Canvas & Optional Slide-over Sidebar */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* OPTIONAL SLIDE-OVER SIDEBAR (Accessible only if user clicks "Form Paneli") */}
        {isSidebarOpen && (
          <aside className="absolute inset-y-0 left-0 z-40 w-full sm:w-[460px] bg-white shadow-2xl border-r border-stone-200 flex flex-col no-print animate-in slide-in-from-left duration-200">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 bg-stone-50 shrink-0">
              <div className="flex items-center gap-2">
                <PanelLeft className="w-4 h-4 text-teal-600" />
                <span className="text-xs font-black text-stone-900">Klasik Form Girişleri</span>
              </div>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
                title="Paneli Kapat (Belge üzerinden doğrudan yazabilirsiniz)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto">
              <EditorPanel
                doc={doc}
                onChange={setDoc}
                onOpenPasteModal={() => setIsPasteModalOpen(true)}
                onAutoFit={handleAutoFit}
              />
            </div>
          </aside>
        )}

        {/* Backing Backdrop when sidebar is open on small screens */}
        {isSidebarOpen && (
          <div
            className="absolute inset-0 bg-stone-900/20 backdrop-blur-xs z-30 sm:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* CENTER / FULL WIDTH: Spacious Live A4 Document Canvas Preview */}
        <main
          id="a4-viewport-wrapper"
          ref={a4Ref}
          className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start bg-stone-200/80"
        >
          <div className="py-2 flex flex-col items-center">
            <A4Document doc={doc} zoom={zoom} onChange={setDoc} isEditable={true} />
          </div>
        </main>
      </div>

      {/* Explanatory Legislation Footer */}
      <footer id="help" className="border-t border-stone-200 bg-white py-2.5 px-6 no-print shrink-0 z-20">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[11px] text-stone-500">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-teal-600" />
            <span className="font-semibold text-stone-800">
              6183 S.K. m.10/5 &amp; TMK m.194 Eş Muvafakati Matbu Standartı
            </span>
            <span className="text-stone-300">|</span>
            <span className="hidden sm:inline">
              Tüm alanları Word gibi doğrudan düzenleyebilir veya kelimeye tıklayarak yay animasyonuyla doldurabilirsiniz.
            </span>
          </div>

          <div className="flex items-center gap-3 text-[10px]">
            <span>A4: 210 × 297 mm</span>
            <span>·</span>
            <span>Islak İmza &amp; Memur Tasdik Formatı</span>
          </div>
        </div>
      </footer>

      {/* Paste & Word Example Import Modal */}
      <PasteExampleModal
        isOpen={isPasteModalOpen}
        onClose={() => setIsPasteModalOpen(false)}
        onApply={(extracted) => {
          setDoc((prev) => ({
            ...prev,
            ...extracted,
          }));
        }}
        currentDoc={doc}
      />
    </div>
  );
};
