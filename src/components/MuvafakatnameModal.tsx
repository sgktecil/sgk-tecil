import React, { useState } from 'react';
import {
  X,
  Printer,
  Copy,
  Check,
  FileSignature,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Download,
  Eye,
  Edit3
} from 'lucide-react';
import {
  MuvafakatnameBelgeData,
  MuvafakatnameTemplate,
} from '../types/muvafakatname';
import { MUVAFAKATNAME_TEMPLATES } from '../data/templates';
import { EditorPanel } from './EditorPanel';
import { A4Document } from './A4Document';

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

  const defaultTemplate = MUVAFAKATNAME_TEMPLATES[0];

  const [documentData, setDocumentData] = useState<MuvafakatnameBelgeData>(() => ({
    sablonId: defaultTemplate.id,
    baslik: defaultTemplate.baslik,
    ayarlar: {
      kurumAdi: 'T.C. SOSYAL GÜVENLİK KURUMU BAŞKANLIĞI',
      altBirimAdi: `${initialBorrower?.ilMudurlugu || 'ORDU'} SOSYAL GÜVENLİK İL MÜDÜRLÜĞÜ / ${initialBorrower?.sgkMerkezi || 'ALTINORDU'} SGM`,
      evrakTarihi: new Date().toLocaleDateString('tr-TR'),
      evrakSayisi: 'E-6183/2026',
      konu: defaultTemplate.varsayilanKonu,
      dosyaNo: '2026/1055706-İCRA',
      borcTutari: '',
      hacizliMalBilgisi: '',
      amblemTuru: 'tc',
      yaziBoyutu: 'base',
      satirAraligi: 'normal',
      antetVarMi: true,
      tarihGoster: true,
      ikinciImzaVarMi: true,
    },
    borclu: {
      adSoyad: initialBorrower?.unvan || 'ÜMİT ÖZTÜRK',
      tcknVkn: initialBorrower?.tcknVkn || '24324010110',
      sgkSicilNo: initialBorrower?.sigortaNo || '2 4324 01 01 1055706 052 20-30',
      adres: initialBorrower?.isyeriAdresi || 'YENİ MAH. 328. SOK. DIŞ KAPI NO:8 - ORDU ALTINORDU',
      isyeriUnvan: initialBorrower?.unvan || 'ÜMİT ÖZTÜRK',
    },
    metin: defaultTemplate.metin,
    ekNotlar: '',
    imzalayan1: {
      adSoyad: initialBorrower?.unvan || 'ÜMİT ÖZTÜRK',
      unvan: defaultTemplate.imzaBaslik1,
    },
    imzalayan2: {
      adSoyad: 'İcra Takip Yetkilisi',
      unvan: defaultTemplate.imzaBaslik2 || 'Yetkili Makam Onayı',
    },
  }));

  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const [copied, setCopied] = useState(false);

  // Şablon yükleme
  const handleLoadTemplate = (template: MuvafakatnameTemplate) => {
    setDocumentData((prev) => ({
      ...prev,
      sablonId: template.id,
      baslik: template.baslik,
      metin: template.metin,
      ayarlar: {
        ...prev.ayarlar,
        konu: template.varsayilanKonu,
      },
      imzalayan1: {
        ...prev.imzalayan1,
        unvan: template.imzaBaslik1,
      },
      imzalayan2: {
        adSoyad: prev.imzalayan2?.adSoyad || 'İcra Takip Yetkilisi',
        unvan: template.imzaBaslik2 || 'Yetkili Makam Onayı',
      },
    }));
  };

  // Aktif SGK Borçlusunu forma aktar
  const handleLoadSampleBorrower = () => {
    if (!initialBorrower) return;
    setDocumentData((prev) => ({
      ...prev,
      borclu: {
        ...prev.borclu,
        adSoyad: initialBorrower.unvan || prev.borclu.adSoyad,
        sgkSicilNo: initialBorrower.sigortaNo || prev.borclu.sgkSicilNo,
        adres: initialBorrower.isyeriAdresi || prev.borclu.adres,
        tcknVkn: initialBorrower.tcknVkn || prev.borclu.tcknVkn,
        isyeriUnvan: initialBorrower.unvan || prev.borclu.isyeriUnvan,
      },
      imzalayan1: {
        ...prev.imzalayan1,
        adSoyad: initialBorrower.unvan || prev.imzalayan1.adSoyad,
      },
      ayarlar: {
        ...prev.ayarlar,
        altBirimAdi: `${initialBorrower.ilMudurlugu || 'ORDU'} SOSYAL GÜVENLİK İL MÜDÜRLÜĞÜ / ${initialBorrower.sgkMerkezi || 'ALTINORDU'} SGM`,
      },
    }));
  };

  // Metin kopyalama
  const handleCopyText = () => {
    const fullText = `
${documentData.ayarlar.kurumAdi}
${documentData.ayarlar.altBirimAdi}

Tarih: ${documentData.ayarlar.evrakTarihi}
Sayı: ${documentData.ayarlar.evrakSayisi}
Dosya No: ${documentData.ayarlar.dosyaNo}
Konu: ${documentData.ayarlar.konu}

${documentData.baslik}

${documentData.metin}

Muvafakat Eden:
${documentData.borclu.adSoyad} (${documentData.borclu.tcknVkn})
İmza: _______________
    `.trim();

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <FileSignature className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
                  Resmî Muvafakatname ve Belge Düzenleyici
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20">
                  A4 Resmî Format
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Maaş haczi, banka blokesi, taşınmaz/araç satışı ve 6183 taahhütname belgelerini düzenleyin ve yazdırın
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

            {/* Yakınlaştır / Uzaklaştır */}
            <div className="hidden sm:flex items-center border rounded-xl overflow-hidden" style={{ borderColor: 'var(--border-primary)' }}>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(65, z - 10))}
                className="p-1.5 hover:bg-slate-500/10 transition-colors text-slate-600 dark:text-slate-300"
                title="Uzaklaştır"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-[11px] font-bold text-slate-500 font-mono">%{zoomLevel}</span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                className="p-1.5 hover:bg-slate-500/10 transition-colors text-slate-600 dark:text-slate-300"
                title="Yakınlaştır"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Metni Kopyala */}
            <button
              type="button"
              onClick={handleCopyText}
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-500/10 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
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
            className={`w-full lg:w-[440px] xl:w-[480px] p-4 sm:p-6 overflow-y-auto border-r shrink-0 ${
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
            />
          </div>

          {/* SAĞ PANEL: A4 CANLI GÖRÜNÜM & BASKI ALANI */}
          <div
            className={`flex-1 overflow-auto bg-slate-200/80 dark:bg-slate-950/80 p-4 sm:p-8 flex justify-center items-start ${
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
  );
};
