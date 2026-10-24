import React, { useState, useRef, useEffect } from 'react';
import { MuvafakatnameDocument } from '../types/muvafakatname';
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
  Sparkles,
  FileSignature
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
  };
}

export const MuvafakatnameModal: React.FC<MuvafakatnameModalProps> = ({
  isOpen,
  onClose,
  initialBorrower,
}) => {
  const [doc, setDoc] = useState<MuvafakatnameDocument>(() => {
    // 1. Priority: localStorage draft
    try {
      const saved = localStorage.getItem('muvafakatname_doc_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.title || parsed.sgkDetails || parsed.templateType)) {
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
      },
      grantor: {
        ...(baseTemplate.grantor || ({} as any)),
        address: initialBorrower?.isyeriAdresi || '',
        tcNumber: initialBorrower?.tcknVkn || '',
      },
    };
  });

  const [zoom, setZoom] = useState<number>(0.85);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('preview');
  const a4Ref = useRef<HTMLDivElement>(null);

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
        const needsGrantorUpdate = !prev.grantor?.address && initialBorrower.isyeriAdresi;

        if (needsDebtorUpdate || needsInstUpdate || needsGrantorUpdate) {
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
            grantor: {
              ...prev.grantor,
              address: prev.grantor?.address || initialBorrower.isyeriAdresi || '',
              tcNumber: prev.grantor?.tcNumber || initialBorrower.tcknVkn || '',
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
    const totalChars = doc.bodyText.length + (doc.additionalClauses?.join(' ').length || 0);

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

  const handleReset = () => {
    if (window.confirm('Belgeyi varsayılan resmi şablona sıfırlamak istiyor musunuz?')) {
      setDoc({
        ...(OFFICIAL_TEMPLATES[0].data as MuvafakatnameDocument),
        id: 'doc-reset-' + Date.now(),
      });
    }
  };

  const totalLength = doc.bodyText.length + (doc.additionalClauses?.reduce((acc, c) => acc + c.length, 0) || 0);
  const isTooLong = totalLength > 1150 && doc.fontSize >= 14;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-stone-100 text-stone-900 font-sans selection:bg-stone-900 selection:text-white overflow-hidden animate-in fade-in duration-150">
      {/* Universal Top Bar with Branding & Actions */}
      <header className="flex items-center justify-between gap-4 px-6 py-3 bg-white border-b border-stone-200 no-print shrink-0 shadow-xs">
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
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-500/10 text-teal-700 border border-teal-500/20">
                SGK EK-9 Matbu Standart
              </span>
            </div>
            <p className="text-[11px] text-stone-500 hidden sm:block">
              6183 sayılı Kanun m. 10/5 üçüncü şahıs teminatı &amp; A4 resmi belge editörü
            </p>
          </div>
        </div>

        {/* Right: Functional Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            className="px-3.5 py-2 text-xs font-bold text-stone-700 bg-white border border-stone-300 rounded-xl hover:bg-stone-50 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
            title="A4 formatında PDF olarak indir"
          >
            <Download className="w-3.5 h-3.5 text-stone-600" />
            <span className="hidden sm:inline">{isDownloadingPdf ? 'İndiriliyor...' : 'PDF İndir'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 shadow-sm cursor-pointer hover:shadow-md"
            title="Belgeyi doğrudan yazıcıya gönder (Ctrl + P)"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>YAZDIR (A4)</span>
          </button>

          {/* Close Modal Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer ml-1"
            title="Kapat ve Tecil Portalına Dön"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Tab Switcher */}
      <div className="md:hidden flex items-center justify-center p-2 bg-stone-200 border-b border-stone-300 gap-2 no-print shrink-0">
        <button
          type="button"
          onClick={() => setMobileView('editor')}
          className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 ${
            mobileView === 'editor'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Girişler &amp; Düzenle</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileView('preview')}
          className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 ${
            mobileView === 'preview'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>A4 Belge Görünümü</span>
        </button>
      </div>

      {/* Main Workspace: Split Pane on Desktop */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* LEFT PANE: Editor & Form Controls (Strictly hidden during print!) */}
        <div
          className={`w-full md:w-[440px] lg:w-[480px] shrink-0 h-full border-r border-stone-200 no-print overflow-hidden ${
            mobileView === 'preview' ? 'hidden md:block' : 'block'
          }`}
        >
          <EditorPanel
            doc={doc}
            onChange={setDoc}
            onOpenPasteModal={() => setIsPasteModalOpen(true)}
            onAutoFit={handleAutoFit}
          />
        </div>

        {/* RIGHT PANE: Live A4 Document Canvas Preview */}
        <div
          className={`flex-1 flex flex-col bg-stone-200/70 overflow-hidden ${
            mobileView === 'editor' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Canvas Toolbar */}
          <div className="px-6 py-2 bg-white border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 shrink-0 no-print">
            {/* Page Fit Status */}
            <div className="flex items-center gap-2 text-xs">
              {isTooLong ? (
                <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Sayfa 1 A4 sınırını aşabilir.</span>
                  <button
                    type="button"
                    onClick={handleAutoFit}
                    className="underline font-bold text-amber-900 hover:text-amber-950 ml-1 cursor-pointer"
                  >
                    Sığdır
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-medium">
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>A4 Formatına Tam Uyumlu (%100 Tek Sayfa)</span>
                </div>
              )}
            </div>

            {/* Canvas Actions: Zoom Controls, Copy & Reset */}
            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <div className="flex items-center gap-0.5 bg-stone-100 rounded-lg p-0.5 border border-stone-200 text-xs">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
                  className="p-1.5 text-stone-600 hover:text-stone-900 rounded hover:bg-stone-200 transition-colors cursor-pointer"
                  title="Uzaklaştır"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 font-mono text-[11px] font-semibold text-stone-700">
                  %{Math.round(zoom * 100)}
                </span>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(1.3, z + 0.1))}
                  className="p-1.5 text-stone-600 hover:text-stone-900 rounded hover:bg-stone-200 transition-colors cursor-pointer"
                  title="Yakınlaştır"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom(0.85)}
                  className="px-1.5 py-1 text-[11px] font-medium text-stone-600 hover:text-stone-900 rounded hover:bg-stone-200 transition-colors cursor-pointer"
                  title="Varsayılan Boyut"
                >
                  Sıfırla
                </button>
              </div>

              {/* Copy Plain Text */}
              <button
                type="button"
                onClick={handleCopyText}
                className="px-2.5 py-1.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-medium rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
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
                className="p-1.5 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                title="Varsayılan Şablona Sıfırla"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Scrollable A4 Viewport */}
          <div
            id="a4-viewport-wrapper"
            ref={a4Ref}
            className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start bg-stone-300/50"
          >
            <div className="py-2 flex flex-col items-center">
              <A4Document doc={doc} zoom={zoom} onChange={setDoc} isEditable={true} />
            </div>
          </div>
        </div>
      </div>

      {/* Explanatory Legislation Footer */}
      <footer id="help" className="border-t border-stone-200 bg-white py-3.5 px-6 no-print shrink-0">
        <div className="max-w-6xl mx-auto space-y-2">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
            <HelpCircle className="w-4 h-4 text-stone-700" />
            <span>Türkiye Cumhuriyeti Hukuk Mevzuatında Muvafakatname Standartları</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] text-stone-600">
            <div className="space-y-0.5">
              <div className="font-semibold text-stone-900">1. SGK Ek-9 &amp; 6183 S.K. m.10/5</div>
              <p className="leading-relaxed">
                Sosyal Güvenlik Kurumuna olan borçlarda 3. şahıs teminatında İcra Takip Haciz Yönetmeliği Ek-9 formu kullanılır.
              </p>
            </div>

            <div className="space-y-0.5">
              <div className="font-semibold text-stone-900">2. Gayrimenkulde TMK m. 194 Eş Rızası</div>
              <p className="leading-relaxed">
                Teminat gösterilen mal gayrimenkul (özellikle mesken/konut) ise eşin açık rıza ve muvafakat imzası kanunen zorunludur.
              </p>
            </div>

            <div className="space-y-0.5">
              <div className="font-semibold text-stone-900">3. Doğrudan A4 Yazdırma &amp; Word Düzenleme</div>
              <p className="leading-relaxed">
                Belge üzerindeki tüm alanlara Word gibi doğrudan tıklayarak yazabilir, boşlukları interaktif kutucukla anında doldurabilirsiniz.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between text-[10px] text-stone-500">
            <span>© {new Date().getFullYear()} Resmi Muvafakatname ve Belge Düzenleyici · A4 Baskı Standardı</span>
            <div className="flex items-center gap-3">
              <span>A4 Boyutu: 210 × 297 mm</span>
              <span>·</span>
              <span>Doğrudan Yazıcı &amp; Islak İmza Formatı</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Paste Example Modal */}
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
