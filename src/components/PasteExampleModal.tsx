import React, { useState, useRef } from 'react';
import { MuvafakatnameDocument } from '../types/muvafakatname';
import { FileText, Sparkles, Check, ArrowRight, X, Upload, FileUp, Loader2 } from 'lucide-react';
import mammoth from 'mammoth';

interface PasteExampleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (extracted: Partial<MuvafakatnameDocument>) => void;
  currentDoc: MuvafakatnameDocument;
}

export const PasteExampleModal: React.FC<PasteExampleModalProps> = ({
  isOpen,
  onClose,
  onApply,
  currentDoc,
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'paste'>('upload');
  const [rawText, setRawText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Process a selected DOCX file
  const processDocxFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.docx') && !file.name.toLowerCase().endsWith('.doc')) {
      setFeedbackMsg({
        text: 'Lütfen geçerli bir Microsoft Word (.docx) dosyası seçin.',
        type: 'error',
      });
      return;
    }

    setIsLoadingFile(true);
    setFileName(file.name);
    setFeedbackMsg({
      text: `"${file.name}" dosyası inceleniyor ve metinler ayrıştırılıyor...`,
      type: 'info',
    });

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const extractedText = result.value.trim();

      if (!extractedText) {
        setFeedbackMsg({
          text: 'Dosyada okunabilir metin bulunamadı. Lütfen dosyanın boş veya salt resim olmadığından emin olun.',
          type: 'error',
        });
      } else {
        setRawText(extractedText);
        setFeedbackMsg({
          text: `"${file.name}" belgesi başarıyla okundu! Şimdi aşağıdaki "Akıllı Ayrıştır ve A4'e Yerleştir" butonuna basarak doğrudan resmi A4 formatına dönüştürebilirsiniz.`,
          type: 'success',
        });
      }
    } catch (err) {
      console.error('Docx parse error:', err);
      setFeedbackMsg({
        text: 'Word belgesi okunurken bir hata oluştu. Dosyanın şifreli veya bozuk olmadığını kontrol edin.',
        type: 'error',
      });
    } finally {
      setIsLoadingFile(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processDocxFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processDocxFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Pre-prepared sample drafts the user can try with 1 click
  const sampleDrafts = [
    {
      label: 'Örnek: Anne-Baba Seyahat İzni',
      text: `T.C. İÇİŞLERİ BAKANLIĞI EMNİYET MÜDÜRLÜĞÜNE
MUVAFAKATNAME

Velayetimiz altında bulunan müşterek çocuğumuz Caner YILDIZ'ın (T.C.: 33445566778), 15.07.2026 - 30.08.2026 tarihleri arasında Almanya ve İtalya'ya yapacağı turistik seyahat için pasaport çıkarmasına, vize başvurularını tamamlamasına ve okul kafilesi eşliğinde yurt dışına çıkış yapmasına muvafakat ederiz.

Muvafakat Veren Baba: Murat YILDIZ (TC: 11223344556)
Muvafakat Veren Anne: Sevgi YILDIZ (TC: 99887766554)
Tarih: 21.10.2026 / İstanbul`,
    },
    {
      label: 'Örnek: Nüfus İkametgah İzni',
      text: `NÜFUS VE VATANDAŞLIK İŞLERİ MÜDÜRLÜĞÜNE
MUVAFAKATNAME

Maliki ve kiracısı bulunduğum Çankaya / Ankara adresindeki konutumda, kardeşim Serkan KAYA'nın (T.C.: 44556677889) ikamet etmesine ve adres kaydı yaptırmasına rıza gösteriyorum.

Muvafakat Veren: Ahmet KAYA (TC: 12345678901)
Tarih: 21.10.2026`,
    },
  ];

  const handleSmartParse = () => {
    if (!rawText.trim()) {
      setFeedbackMsg({
        text: 'Lütfen önce bir Word (.docx) dosyası yükleyin veya metin yapıştırın.',
        type: 'error',
      });
      return;
    }

    const updates: Partial<MuvafakatnameDocument> = {};
    const text = rawText;

    // Detect TC Numbers (11 digits)
    const tcMatches = text.match(/\b\d{11}\b/g) || [];

    // Detect Date (DD.MM.YYYY or DD/MM/YYYY)
    const dateMatch = text.match(/\b\d{1,2}[./]\d{1,2}[./]\d{4}\b/);
    if (dateMatch) {
      updates.date = dateMatch[0].replace(/\//g, '.');
    }

    // Detect Institution / Makam
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const institutionLine = lines.find(l => 
      l.toUpperCase().includes('MÜDÜRLÜĞ') || 
      l.toUpperCase().includes('MAKAM') || 
      l.toUpperCase().includes('BAKANLIĞ') ||
      l.toUpperCase().includes('NOTERLİĞ') ||
      l.toUpperCase().includes('KAYMAKAMLIĞI') ||
      l.toUpperCase().includes('VALİLİĞİ')
    );
    if (institutionLine) {
      updates.institution = institutionLine.toUpperCase();
    }

    // Detect Title
    const titleLine = lines.find(l => l.toUpperCase().includes('MUVAFAKAT'));
    if (titleLine) {
      updates.title = titleLine.toUpperCase();
    }

    // Extract Grantor name & TC
    const updatedGrantor = { ...currentDoc.grantor };
    if (tcMatches[0]) {
      updatedGrantor.tcNumber = tcMatches[0];
    }

    // Try to find names around "Muvafakat Veren" or "Baba:" or "Anne:"
    const grantorMatch = text.match(/Muvafakat\s*Veren(?:\s*Baba)?[:\s]+([A-ZÇĞİÖŞÜa-zçğıöşü\s]{3,30})/i);
    if (grantorMatch && grantorMatch[1]) {
      updatedGrantor.fullName = grantorMatch[1].trim();
    }
    updates.grantor = updatedGrantor;

    // Second Grantor (if two TCs or mentions Anne/Baba)
    if (tcMatches.length >= 2 && tcMatches[1] && (text.includes('Anne') || text.includes('Müşterek') || text.includes('Veren (2)'))) {
      const updatedGrantor2 = {
        ...currentDoc.grantor2,
        enabled: true,
        tcNumber: tcMatches[1],
        relation: 'Anne / Yasal Veli',
      };
      const grantor2Match = text.match(/Anne[:\s]+([A-ZÇĞİÖŞÜa-zçğıöşü\s]{3,30})/i);
      if (grantor2Match && grantor2Match[1]) {
        updatedGrantor2.fullName = grantor2Match[1].trim();
      }
      updates.grantor2 = updatedGrantor2;
    }

    // Grantee (child or recipient)
    const lastTc = tcMatches[tcMatches.length - 1];
    if (tcMatches.length >= 3 && lastTc) {
      const updatedGrantee = {
        ...currentDoc.grantee,
        enabled: true,
        tcNumber: lastTc,
      };
      const childMatch = text.match(/çocuğumuz\s+([A-ZÇĞİÖŞÜa-zçğıöşü\s]{3,30})(?:'ın|'in|\s*\()/i);
      if (childMatch && childMatch[1]) {
        updatedGrantee.fullName = childMatch[1].trim();
      }
      updates.grantee = updatedGrantee;
    }

    // Extract main narrative paragraphs (filter out headers and signatures)
    const narrativeLines = lines.filter(l => 
      !l.toUpperCase().includes('MUVAFAKATNAME') &&
      !l.toUpperCase().includes('MÜDÜRLÜĞ') &&
      !l.toUpperCase().includes('MAKAM') &&
      !l.startsWith('Tarih:') &&
      !l.startsWith('Muvafakat Veren')
    );

    if (narrativeLines.length > 0) {
      updates.bodyText = narrativeLines.join('\n\n');
    } else {
      updates.bodyText = text;
    }

    onApply(updates);
    setFeedbackMsg({
      text: 'Belge başarıyla ayrıştırıldı ve resmi A4 sayfasına yerleştirildi!',
      type: 'success',
    });

    setTimeout(() => {
      onClose();
    }, 700);
  };

  const handleDirectTransfer = () => {
    if (!rawText.trim()) {
      setFeedbackMsg({
        text: 'Lütfen önce bir metin girin veya Word dosyası yükleyin.',
        type: 'error',
      });
      return;
    }

    onApply({
      bodyText: rawText.trim(),
    });

    setFeedbackMsg({
      text: 'Metin doğrudan A4 belgesinin hukuki metin alanına aktarıldı.',
      type: 'success',
    });

    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto no-print">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-stone-200 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-stone-800 rounded-md text-amber-400">
              <FileUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base leading-tight">
                Muvafakatname Dosyası veya Metni Yükle
              </h3>
              <p className="text-xs text-stone-300">
                Word (.docx) belgenizi yükleyin veya metni yapıştırın; anında resmi A4 belgesine dönüştürelim
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="px-6 pt-4 pb-2 border-b border-stone-200 bg-stone-50 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeMode === 'upload'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 bg-white border border-stone-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Word (.docx) Dosyası Seç / Bırak</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('paste')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeMode === 'paste'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 bg-white border border-stone-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Metin Yapıştır</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* UPLOAD MODE */}
          {activeMode === 'upload' && (
            <div className="space-y-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".docx,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
                className="hidden"
              />

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-300 hover:border-stone-800 bg-stone-50 hover:bg-stone-100/70 rounded-xl p-8 text-center cursor-pointer transition-all group"
              >
                {isLoadingFile ? (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Loader2 className="w-8 h-8 text-stone-900 animate-spin" />
                    <span className="text-xs font-semibold text-stone-700">Word dosyası okunuyor...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-stone-200/80 group-hover:bg-stone-300 flex items-center justify-center text-stone-700 transition-colors">
                      <FileUp className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="font-semibold text-stone-900 text-sm block">
                        Word (.docx) dosyanızı buraya sürükleyip bırakın
                      </span>
                      <span className="text-xs text-stone-500 mt-0.5 block">
                        veya bilgisayarınızdan dosya seçmek için tıklayın
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-stone-400 bg-white px-2 py-0.5 rounded border border-stone-200">
                      Desteklenen formatlar: .docx, .doc
                    </span>
                  </div>
                )}
              </div>

              {fileName && (
                <div className="flex items-center justify-between p-2.5 bg-stone-100 rounded-lg text-xs font-medium text-stone-800">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-stone-600" />
                    <span className="font-semibold">{fileName}</span>
                  </div>
                  <span className="text-stone-500 text-[11px]">
                    {rawText ? `${rawText.length} karakter okundu` : ''}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* PASTE / PREVIEW TEXTAREA */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                {activeMode === 'upload' ? 'Okunan Belge Metni:' : 'Muvafakatname Metnini Buraya Yapıştırın:'}
              </label>
              {rawText && (
                <button
                  type="button"
                  onClick={() => {
                    setRawText('');
                    setFileName(null);
                    setFeedbackMsg(null);
                  }}
                  className="text-[11px] text-stone-500 hover:text-stone-900 underline"
                >
                  Metni Temizle
                </button>
              )}
            </div>
            <textarea
              rows={6}
              value={rawText}
              onChange={e => {
                setRawText(e.target.value);
                setFeedbackMsg(null);
              }}
              placeholder={`Örnek:\n\nİLGİLİ MAKAMA\nVelayeti altımda bulunan oğlum ...'ın okul gezisine katılmasına muvafakat ederim.\n\nMuvafakat Veren: Ahmet Yılmaz\nT.C.: 12345678901`}
              className="w-full text-xs font-mono p-3.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-stone-900 outline-none leading-relaxed bg-stone-50"
            />
          </div>

          {/* Quick Sample Buttons (if in paste mode) */}
          {activeMode === 'paste' && (
            <div>
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-1.5">
                Hızlı Örnek Yükle:
              </span>
              <div className="flex flex-wrap gap-2">
                {sampleDrafts.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setRawText(sample.text);
                      setFeedbackMsg(null);
                    }}
                    className="px-2.5 py-1 text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md transition-colors border border-stone-200"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {feedbackMsg && (
            <div
              className={`p-3 text-xs rounded-lg flex items-start gap-2 border ${
                feedbackMsg.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : feedbackMsg.type === 'error'
                  ? 'bg-red-50 border-red-200 text-red-900'
                  : 'bg-blue-50 border-blue-200 text-blue-900'
              }`}
            >
              {feedbackMsg.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <Sparkles className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
              )}
              <span className="leading-snug">{feedbackMsg.text}</span>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            Kapat
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDirectTransfer}
              disabled={!rawText.trim()}
              className="px-3.5 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-100 disabled:opacity-50 transition-colors"
            >
              Yalnızca Metin Olarak Aktar
            </button>
            <button
              onClick={handleSmartParse}
              disabled={!rawText.trim()}
              className="px-4 py-2 text-xs font-medium text-white bg-stone-900 rounded-lg hover:bg-stone-800 disabled:opacity-50 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Akıllı Ayrıştır ve A4'e Yerleştir</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
