import React, { useState } from 'react';
import {
  X,
  Printer,
  Copy,
  Check,
  FileSignature,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Download,
  Eye,
  Edit3,
  FileText,
  RotateCcw,
} from 'lucide-react';
import {
  MuvafakatnameBelgeData,
  MuvafakatnameTemplate,
} from '../types/muvafakatname';
import { MUVAFAKATNAME_TEMPLATES } from '../data/templates';
import { EditorPanel } from './EditorPanel';
import { A4Document } from './A4Document';
import { PasteExampleModal } from './PasteExampleModal';
import { exportToWord } from '../utils/pdfExport';

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
  if (!isOpen) return null;

  // Varsayılan şablon: EK-9 (SGK 2024/12 Genelgesi)
  const defaultTemplate = MUVAFAKATNAME_TEMPLATES[0];

  const [documentData, setDocumentData] = useState<MuvafakatnameBelgeData>(() => ({
    sablonId: defaultTemplate.id,
    baslik: defaultTemplate.baslik,
    ayarlar: {
      formKodu: defaultTemplate.formKodu || 'EK-9',
      formKoduGoster: true,
      kurumAdi: 'T.C. SOSYAL GÜVENLİK KURUMU BAŞKANLIĞI',
      altBirimAdi: `${initialBorrower?.ilMudurlugu || 'ORDU'} SOSYAL GÜVENLİK İL MÜDÜRLÜĞÜ / ${initialBorrower?.sgkMerkezi || 'ALTINORDU'} SOSYAL GÜVENLİK MERKEZİ`,
      evrakTarihi: new Date().toLocaleDateString('tr-TR'),
      evrakSayisi: 'E-6183/2026/1024',
      konu: defaultTemplate.varsayilanKonu,
      dosyaNo: '2026/1055706-İCRA',
      borcTutari: '385.450,00 TL',
      borcDonemi: '2025/1 - 2025/12',
      amblemTuru: 'tc',
      yaziTipi: 'serif',
      yaziBoyutu: 'base',
      satirAraligi: 'normal',
      antetVarMi: true,
      tarihGoster: true,
      ikinciImzaVarMi: true,
      huzurdaImzaZaptiVarMi: true,
      teminatTablosuGoster: true,
      sayfaFormati: 'genelge_matbu',
    },
    borclu: {
      sifat: 'ucuncu_sahis',
      adSoyad: 'KEMAL ŞAHİN',
      tcknVkn: '48920154812',
      unvan: 'Taşınmaz Maliki (3. Şahıs)',
      sgkSicilNo: initialBorrower?.sigortaNo || '2 4324 01 01 1055706 052 20-30',
      adres: 'Akyazı Mah. 842. Sok. No:14 D:5 - Ordu Altınordu',
      telefon: '0532 555 12 34',
    },
    asilBorclu: {
      unvan: initialBorrower?.unvan || 'ÖZTÜRK İNŞAAT VE TAAHHÜT TİC. LTD. ŞTİ.',
      tcknVkn: initialBorrower?.tcknVkn || '24324010110',
      sgkSicilNo: initialBorrower?.sigortaNo || '2 4324 01 01 1055706 052 20-30',
      adres: initialBorrower?.isyeriAdresi || 'Yeni Mah. Atatürk Bulvarı No:88/A Altınordu / Ordu',
      borcDonemi: '2025/Ocak - 2025/Aralık',
      borcTutari: '385.450,00 TL',
      takipNo: '2026/1055706-İCRA',
    },
    teminat: defaultTemplate.teminatVarsayilan || {
      tur: 'gayrimenkul',
      il: 'ORDU',
      ilce: 'ALTINORDU',
      mahalleKoy: 'YENİ MAHALLE',
      ada: '1024',
      parsel: '18',
      bagimsizBolum: '4',
      yuzolcumu: '125 m²',
      nitelik: 'Mesken (Daire)',
      tapuMaliki: 'KEMAL ŞAHİN',
      hisseOrani: 'Tam (1/1)',
    },
    metin: defaultTemplate.metin,
    ekNotlar: '',
    imzalayan1: {
      adSoyad: 'KEMAL ŞAHİN',
      unvan: defaultTemplate.imzaBaslik1,
    },
    imzalayan2: {
      adSoyad: initialBorrower?.unvan || 'ÜMİT ÖZTÜRK',
      unvan: defaultTemplate.imzaBaslik2 || 'Asıl Borçlu Şirket Yetkilisi',
    },
    sgkZapti: {
      icraMemuru: {
        adSoyad: 'İcra Memuru',
        sicilNo: '18452',
        unvan: 'İcra Memuru',
      },
      sorumluMemur: {
        adSoyad: 'Sorumlu Şef / Yetkili',
        sicilNo: '12904',
        unvan: 'Sorumlu İcra Memuru',
      },
    },
  }));

  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const [copied, setCopied] = useState(false);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);

  // Şablon yükleme
  const handleLoadTemplate = (template: MuvafakatnameTemplate) => {
    setDocumentData((prev) => ({
      ...prev,
      sablonId: template.id,
      baslik: template.baslik,
      metin: template.metin,
      ayarlar: {
        ...prev.ayarlar,
        formKodu: template.formKodu || 'EK-9',
        formKoduGoster: !!template.formKodu,
        konu: template.varsayilanKonu,
        huzurdaImzaZaptiVarMi: template.huzurdaImzaVarMi ?? prev.ayarlar.huzurdaImzaZaptiVarMi,
      },
      teminat: template.teminatVarsayilan || prev.teminat,
      imzalayan1: {
        ...prev.imzalayan1,
        unvan: template.imzaBaslik1,
      },
      imzalayan2: {
        adSoyad: prev.imzalayan2?.adSoyad || prev.asilBorclu?.unvan || 'Yetkili Makam Onayı',
        unvan: template.imzaBaslik2 || 'Yetkili Makam Onayı',
      },
    }));
  };

  // Aktif SGK Borçlusunu forma aktar
  const handleLoadSampleBorrower = () => {
    if (!initialBorrower) return;
    setDocumentData((prev) => ({
      ...prev,
      asilBorclu: {
        unvan: initialBorrower.unvan || prev.asilBorclu?.unvan || '',
        tcknVkn: initialBorrower.tcknVkn || prev.asilBorclu?.tcknVkn || '',
        sgkSicilNo: initialBorrower.sigortaNo || prev.asilBorclu?.sgkSicilNo || '',
        adres: initialBorrower.isyeriAdresi || prev.asilBorclu?.adres || '',
        borcDonemi: prev.asilBorclu?.borcDonemi || '2025 Yılı',
        borcTutari: prev.ayarlar.borcTutari || '385.450,00 TL',
        takipNo: prev.ayarlar.dosyaNo || '2026/1055706-İCRA',
      },
      ayarlar: {
        ...prev.ayarlar,
        altBirimAdi: `${initialBorrower.ilMudurlugu || 'ORDU'} SOSYAL GÜVENLİK İL MÜDÜRLÜĞÜ / ${initialBorrower.sgkMerkezi || 'ALTINORDU'} SOSYAL GÜVENLİK MERKEZİ`,
      },
      imzalayan2: {
        adSoyad: initialBorrower.unvan || prev.imzalayan2?.adSoyad || '',
        unvan: 'Asıl Borçlu Yetkilisi',
      },
    }));
  };

  // Harici veri / Örnek uygulama
  const handleApplyImportedData = (partial: Partial<MuvafakatnameBelgeData>) => {
    setDocumentData((prev) => ({
      ...prev,
      ...partial,
      ayarlar: {
        ...prev.ayarlar,
        ...(partial.ayarlar || {}),
      },
      borclu: {
        ...prev.borclu,
        ...(partial.borclu || {}),
      },
      asilBorclu: {
        ...(prev.asilBorclu || {
          unvan: '',
          tcknVkn: '',
          sgkSicilNo: '',
          adres: '',
          borcDonemi: '',
          borcTutari: '',
          takipNo: '',
        }),
        ...(partial.asilBorclu || {}),
      },
      teminat: {
        ...prev.teminat,
        ...(partial.teminat || {}),
      },
      imzalayan1: {
        ...prev.imzalayan1,
        ...(partial.imzalayan1 || {}),
      },
      imzalayan2: {
        ...(prev.imzalayan2 || { adSoyad: '', unvan: '' }),
        ...(partial.imzalayan2 || {}),
      },
    }));
  };

  // Metin kopyalama
  const handleCopyText = () => {
    const fullText = `
${documentData.ayarlar.formKoduGoster ? `[${documentData.ayarlar.formKodu}]\n` : ''}${documentData.ayarlar.kurumAdi}
${documentData.ayarlar.altBirimAdi}

Tarih: ${documentData.ayarlar.evrakTarihi}
Dosya / Takip No: ${documentData.ayarlar.dosyaNo}
Konu: ${documentData.ayarlar.konu}

${documentData.baslik}

${documentData.metin}

Muvafakat Veren:
${documentData.borclu.adSoyad} (${documentData.borclu.tcknVkn})
İmza: _______________________
    `.trim();

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Word (.doc) olarak indirme
  const handleDownloadWord = () => {
    const filename = `${documentData.ayarlar.formKodu || 'EK-9'}_${(documentData.borclu.adSoyad || 'muvafakatname').replace(/\s+/g, '_')}.doc`;
    exportToWord(documentData, filename);
  };

  // Yazdırma (Ctrl+P / Doğrudan A4 Print)
  const handlePrint = () => {
    document.body.classList.add('body-printing-muvafakatname');
    window.print();
    setTimeout(() => {
      document.body.classList.remove('body-printing-muvafakatname');
    }, 1000);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm overflow-hidden animate-in fade-in duration-200">
        <div
          className="w-full max-w-7xl h-[94vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)',
            color: 'var(--text-primary)',
          }}
        >
          {/* MODAL ÜST ÇUBUK */}
          <div
            className="px-6 py-4 border-b flex items-center justify-between flex-wrap gap-3 shrink-0"
            style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-elevated)' }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <FileSignature className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
                    Resmî Muvafakatname ve EK-9 Belge Düzenleyici
                  </h2>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full font-black uppercase bg-teal-500/15 text-teal-800 dark:text-teal-300 border border-teal-500/30">
                    SGK 2024/12 EK-9
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  SGK 6183/10-5 EK-9 3. şahıs muvafakatnamesi, borçlu taşınmaz/araç teminatı, maaş haczi ve taahhüt belgeleri
                </p>
              </div>
            </div>

            {/* EYLEMLER VE BUTONLAR */}
            <div className="flex items-center gap-2">
              {/* Mobil Tab Seçici */}
              <div className="lg:hidden inline-flex p-1 rounded-xl border bg-slate-100 dark:bg-slate-800" style={{ borderColor: 'var(--border-primary)' }}>
                <button
                  type="button"
                  onClick={() => setMobileTab('editor')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1 ${
                    mobileTab === 'editor' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Düzenle</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMobileTab('preview')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1 ${
                    mobileTab === 'preview' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>A4 Önizle</span>
                </button>
              </div>

              {/* Sayfa Formatı Seçici (Genelge vs Tablolu) */}
              <div className="hidden md:inline-flex p-1 rounded-xl border bg-slate-100 dark:bg-slate-800" style={{ borderColor: 'var(--border-primary)' }}>
                <button
                  type="button"
                  onClick={() => setDocumentData((prev) => ({
                    ...prev,
                    ayarlar: { ...prev.ayarlar, sayfaFormati: 'genelge_matbu' },
                  }))}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                    documentData.ayarlar.sayfaFormati === 'genelge_matbu'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                  title="SGK 2024/12 Genelgesi EK-9 Orijinal Metin Formatı"
                >
                  Resmî Genelge
                </button>
                <button
                  type="button"
                  onClick={() => setDocumentData((prev) => ({
                    ...prev,
                    ayarlar: { ...prev.ayarlar, sayfaFormati: 'tablolu_modern' },
                  }))}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                    documentData.ayarlar.sayfaFormati === 'tablolu_modern'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                  title="Detaylı Yapılandırılmış Tablo Formatı"
                >
                  Tablolu
                </button>
              </div>

              {/* Yakınlaştır / Uzaklaştır */}
              <div className="hidden sm:flex items-center border rounded-xl overflow-hidden" style={{ borderColor: 'var(--border-primary)' }}>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(65, z - 10))}
                  className="p-1.5 hover:bg-slate-500/10 transition-colors text-slate-600 dark:text-slate-300 cursor-pointer"
                  title="Uzaklaştır"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 text-[11px] font-bold text-slate-500 font-mono">%{zoomLevel}</span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                  className="p-1.5 hover:bg-slate-500/10 transition-colors text-slate-600 dark:text-slate-300 cursor-pointer"
                  title="Yakınlaştır"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Hazır Örnekler & İçe Aktar Butonu */}
              <button
                type="button"
                onClick={() => setIsPasteModalOpen(true)}
                className="px-3 py-2 rounded-xl border border-teal-500/40 bg-teal-500/5 hover:bg-teal-500/15 text-teal-700 dark:text-teal-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Hazır örnekler yükleyin, Word belgesi aktarın veya kopyalanan metni yapıştırın"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Örnekler &amp; İçe Aktar</span>
              </button>

              {/* Word (.doc) Olarak İndir */}
              <button
                type="button"
                onClick={handleDownloadWord}
                className="px-3 py-2 rounded-xl border border-blue-500/40 bg-blue-500/5 hover:bg-blue-500/15 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Word (.doc) formatında bilgisayarınıza indirin"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Word İndir</span>
              </button>

              {/* Metni Kopyala */}
              <button
                type="button"
                onClick={handleCopyText}
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-500/10 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Tüm belge metnini panoya kopyala"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? 'Kopyalandı' : 'Kopyala'}</span>
              </button>

              {/* Yazdır / PDF İndir */}
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                title="A4 Belgeyi Doğrudan Yazdır veya PDF Olarak Kaydet"
              >
                <Printer className="w-4 h-4" />
                <span>Yazdır / PDF</span>
              </button>

              {/* Kapat Butonu */}
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-slate-500/10 transition-colors text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer ml-1"
                title="Pencereyi Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* MODAL GÖVDE: SOLDA EDİTÖR, SAĞDA A4 CANLI ÖNİZLEME */}
          <div className="flex-1 flex overflow-hidden">
            {/* SOL PANEL: DÜZENLEME PANELİ */}
            <div
              className={`w-full lg:w-[460px] xl:w-[500px] p-4 sm:p-5 overflow-y-auto border-r shrink-0 ${
                mobileTab === 'preview' ? 'hidden lg:block' : 'block'
              }`}
              style={{
                borderColor: 'var(--border-primary)',
                backgroundColor: 'var(--bg-secondary)',
              }}
            >
              <EditorPanel
                data={documentData}
                onChange={setDocumentData}
                onLoadTemplate={handleLoadTemplate}
                onLoadSampleBorrower={handleLoadSampleBorrower}
                onOpenPasteModal={() => setIsPasteModalOpen(true)}
              />
            </div>

            {/* SAĞ PANEL: A4 CANLI GÖRÜNÜM & BASKI ALANI */}
            <div
              className={`flex-1 overflow-auto bg-slate-200/90 dark:bg-slate-950/90 p-4 sm:p-8 flex justify-center items-start ${
                mobileTab === 'editor' ? 'hidden lg:flex' : 'flex'
              }`}
            >
              <div
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.15s ease',
                }}
              >
                <A4Document data={documentData} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hazır Örnekler, Word Belgesi Yükleme ve Akıllı Metin Modal */}
      <PasteExampleModal
        isOpen={isPasteModalOpen}
        onClose={() => setIsPasteModalOpen(false)}
        onApplyData={handleApplyImportedData}
      />
    </>
  );
};
