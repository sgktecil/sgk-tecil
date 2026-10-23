import React, { useState } from 'react';
import {
  X,
  Clipboard,
  FileText,
  Upload,
  Sparkles,
  Check,
  AlertCircle,
  FileSpreadsheet,
  ArrowRight,
} from 'lucide-react';
import mammoth from 'mammoth';
import { MuvafakatnameBelgeData, TeminatBilgisi } from '../types/muvafakatname';
import { MUVAFAKATNAME_TEMPLATES } from '../data/templates';

interface PasteExampleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyData: (newData: Partial<MuvafakatnameBelgeData>) => void;
}

interface ExamplePreset {
  id: string;
  title: string;
  badge: string;
  desc: string;
  data: Partial<MuvafakatnameBelgeData>;
}

export const PasteExampleModal: React.FC<PasteExampleModalProps> = ({
  isOpen,
  onClose,
  onApplyData,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'paste' | 'file' | 'presets'>('presets');
  const [pastedText, setPastedText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  // Hazır gerçekçi örnek belgeler
  const presets: ExamplePreset[] = [
    {
      id: 'ek9-konut',
      title: 'SGK EK-9 Gayrimenkul (Taşınmaz) Teminat Muvafakatnamesi',
      badge: 'EK-9 Resmi Form',
      desc: '3. Şahıs adına kayıtlı Ordu Altınordu dairesinin SGK prim borcuna 6183/10-5 uyarınca teminat gösterilmesi.',
      data: {
        sablonId: 'ek9-ucuncu-sahis',
        baslik: 'EK-9: ÜÇÜNCÜ ŞAHISLAR TARAFINDAN VERİLECEK MUVAFAKATNAME ÖRNEĞİ',
        ayarlar: {
          formKodu: 'EK-9',
          formKoduGoster: true,
          kurumAdi: 'T.C. SOSYAL GÜVENLİK KURUMU BAŞKANLIĞI',
          altBirimAdi: 'ORDU SOSYAL GÜVENLİK İL MÜDÜRLÜĞÜ / ALTINORDU SOSYAL GÜVENLİK MERKEZİ',
          evrakTarihi: new Date().toLocaleDateString('tr-TR'),
          evrakSayisi: 'E-6183/2026/8421',
          konu: '6183/10-5 Gereğince Teminat Gösterme ve Haciz Muvafakati',
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
          sgkSicilNo: '2 4324 01 01 1055706 052 20-30',
          adres: 'Akyazı Mah. 842. Sok. No:14 D:5 - Ordu Altınordu',
          telefon: '0532 555 12 34',
        },
        asilBorclu: {
          unvan: 'ÖZTÜRK İNŞAAT VE TAAHHÜT TİC. LTD. ŞTİ.',
          tcknVkn: '6480123985',
          sgkSicilNo: '2 4324 01 01 1055706 052 20-30',
          adres: 'Yeni Mah. Atatürk Bulvarı No:88/A Altınordu / Ordu',
          borcDonemi: '2025/Ocak - 2025/Aralık',
          borcTutari: '385.450,00 TL',
          takipNo: '2026/1055706-İCRA',
        },
        teminat: {
          tur: 'gayrimenkul',
          il: 'ORDU',
          ilce: 'ALTINORDU',
          mahalleKoy: 'YENİ MAHALLE',
          ada: '1024',
          parsel: '18',
          bagimsizBolum: '4 (2. Kat Mesken)',
          yuzolcumu: '135 m²',
          nitelik: 'Betonarme Apartman ve Mesken',
          tapuMaliki: 'KEMAL ŞAHİN',
          hisseOrani: 'Tam (1/1)',
        },
        metin: `ÖZTÜRK İNŞAAT VE TAAHHÜT TİC. LTD. ŞTİ.'nin Sosyal Güvenlik Kurumuna olan 2025/1 - 2025/12 dönemi/ayına ilişkin 385.450,00 TL tutarında prim ve idari para cezası borcuna ve bu borca bu tarihten ödenmesine kadar geçecek süre için işleyecek fer’ilerine karşılık;

Aşağıda özellikleri yazılı menkul/gayrimenkul malı 6183 sayılı Kanunun 10 uncu maddesinin beşinci fıkrası gereğince teminat olarak gösteriyor ve söz konusu malların Sosyal Güvenlik Kurumu tarafından haczedilmesine muvafakat ediyorum.

Bu konuda herhangi bir itirazda bulunmayacağımı bila-kaydü şart gayrikabili rücu kabul, beyan ve taahhüt ederim.`,
        imzalayan1: {
          adSoyad: 'KEMAL ŞAHİN',
          unvan: 'Muvafakat Veren (3. Şahıs / Mülk Sahibi)',
        },
        imzalayan2: {
          adSoyad: 'ÜMİT ÖZTÜRK',
          unvan: 'Asıl Borçlu Şirket Müdürü',
        },
      },
    },
    {
      id: 'ek9-arac',
      title: 'SGK EK-9 Taşıt / Ticari Araç Teminat Muvafakatnamesi',
      badge: 'EK-9 Araç',
      desc: 'Borçlunun ticari aracını SGK borcuna 6183/10 kapsamında teminat göstermesi ve hacze muvafakati.',
      data: {
        sablonId: 'ek9-borclu-teminat',
        baslik: 'EK-9: BORÇLUNUN KENDİSİ TARAFINDAN VERİLEN TEMİNAT VE HACİZ MUVAFAKATNAMESİ',
        ayarlar: {
          formKodu: 'EK-9',
          formKoduGoster: true,
          kurumAdi: 'T.C. SOSYAL GÜVENLİK KURUMU BAŞKANLIĞI',
          altBirimAdi: 'ORDU SOSYAL GÜVENLİK İL MÜDÜRLÜĞÜ / ALTINORDU SOSYAL GÜVENLİK MERKEZİ',
          evrakTarihi: new Date().toLocaleDateString('tr-TR'),
          evrakSayisi: 'E-6183/2026/5129',
          konu: 'Taşıt Teminat Gösterme ve Haciz Muvafakatnamesi',
          dosyaNo: '2026/1055706-İCRA',
          borcTutari: '185.000,00 TL',
          borcDonemi: '2025 Yılı Prim Borçları',
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
          sifat: 'borclu',
          adSoyad: 'ÜMİT ÖZTÜRK',
          tcknVkn: '24324010110',
          unvan: 'İşveren / Borçlu',
          sgkSicilNo: '2 4324 01 01 1055706 052 20-30',
          adres: 'Yeni Mah. 328. Sok. Dış Kapı No:8 - Ordu Altınordu',
          telefon: '0544 123 45 67',
        },
        teminat: {
          tur: 'tasit',
          plaka: '52 AB 456',
          markaModel: '2023 Ford Transit Custom 320S',
          modelYili: '2023',
          cinsi: 'Kapalı Kasa Panelvan',
          sasiNo: 'NM0XXXTTFXP89421',
          motorNo: 'BK2X982145',
          ruhsatSahibi: 'ÜMİT ÖZTÜRK',
        },
        imzalayan1: {
          adSoyad: 'ÜMİT ÖZTÜRK',
          unvan: 'Muvafakat Eden Borçlu',
        },
        imzalayan2: {
          adSoyad: 'Sosyal Güvenlik Merkezi Yetkilisi',
          unvan: 'İcra Kabul Yetkilisi',
        },
      },
    },
    {
      id: 'maas-haczi-preset',
      title: 'Maaş Haczi Artırımlı Kesinti Muvafakatnamesi (İİK 83)',
      badge: 'İİK 83 & 6183',
      desc: 'Çalışan borçlunun maaşından 1/4 sınırını aşarak aylık sabit tutar kesilmesine muvafakati.',
      data: {
        sablonId: 'maas-haczi',
        baslik: 'Maaş Haczi Kesinti Muvafakatnamesi (İİK m. 83 & 6183 m. 71)',
        ayarlar: {
          formKodu: 'MUVAFAKAT',
          formKoduGoster: false,
          kurumAdi: 'T.C. SOSYAL GÜVENLİK KURUMU BAŞKANLIĞI',
          altBirimAdi: 'İcra Takip Haciz ve Satış Servisi',
          evrakTarihi: new Date().toLocaleDateString('tr-TR'),
          evrakSayisi: 'E-İCRA/2026/102',
          konu: 'Maaş Haczi ve Kesinti Muvafakati',
          dosyaNo: '2026/89412-İCRA',
          borcTutari: '74.200,00 TL',
          borcDonemi: 'GSS / 4b Prim Borcu',
          amblemTuru: 'tc',
          yaziTipi: 'serif',
          yaziBoyutu: 'base',
          satirAraligi: 'normal',
          antetVarMi: true,
          tarihGoster: true,
          ikinciImzaVarMi: true,
          huzurdaImzaZaptiVarMi: false,
          teminatTablosuGoster: true,
          sayfaFormati: 'genelge_matbu',
        },
        borclu: {
          sifat: 'borclu',
          adSoyad: 'AHMET YILDIRIM',
          tcknVkn: '12345678902',
          unvan: 'Borçlu Sigortalı',
          adres: 'Karşıyaka Mah. 504. Sok. No:12 Altınordu / Ordu',
        },
        teminat: {
          tur: 'maas',
          calistigiYer: 'KARADENİZ NAKLİYAT VE DIŞ TİCARET A.Ş.',
          aylikNetUcret: '42.500 TL Net',
          kesintiTutariOrani: 'Aylık 15.000 TL Kesinti',
        },
      },
    },
    {
      id: 'tecil-48-preset',
      title: '6183/48 Tecil ve Taksitlendirme Taahhütnamesi',
      badge: 'Tecil & Taksit',
      desc: 'Borcun peşinat ve taksitler halinde ödeneceğine ve teminat feragatına ilişkin taahhütname.',
      data: {
        sablonId: '6183-taahhutname',
        baslik: '6183 Sayılı Kanun Madde 48 Tecil ve Taksitlendirme Taahhütnamesi',
        ayarlar: {
          formKodu: 'TAAHHÜT',
          formKoduGoster: false,
          kurumAdi: 'T.C. SOSYAL GÜVENLİK KURUMU BAŞKANLIĞI',
          altBirimAdi: 'ORDU SOSYAL GÜVENLİK İL MÜDÜRLÜĞÜ / TECİL SERVİSİ',
          evrakTarihi: new Date().toLocaleDateString('tr-TR'),
          evrakSayisi: 'E-6183/48-2026/304',
          konu: '6183/48 Tecil ve Taksitlendirme Ödeme Taahhüdü',
          dosyaNo: '2026/1055706-İCRA',
          borcTutari: '385.450,00 TL',
          borcDonemi: '2025 Tüm Dönemler',
          amblemTuru: 'tc',
          yaziTipi: 'serif',
          yaziBoyutu: 'base',
          satirAraligi: 'normal',
          antetVarMi: true,
          tarihGoster: true,
          ikinciImzaVarMi: true,
          huzurdaImzaZaptiVarMi: false,
          teminatTablosuGoster: false,
          sayfaFormati: 'genelge_matbu',
        },
      },
    },
  ];

  // Metin ayrıştırma (Regex & Pattern matcher)
  const parsePastedContent = (text: string) => {
    setIsParsing(true);
    const result: Partial<MuvafakatnameBelgeData> = {};
    const ayarlar: Partial<MuvafakatnameBelgeData['ayarlar']> = {};
    const borclu: Partial<MuvafakatnameBelgeData['borclu']> = { sifat: 'borclu', adSoyad: '', tcknVkn: '', adres: '' };
    const teminat: Partial<TeminatBilgisi> = { tur: 'gayrimenkul' };

    // TCKN / VKN (11 veya 10 haneli rakamlar)
    const tcknMatch = text.match(/\b([1-9][0-9]{10}|[0-9]{10})\b/);
    if (tcknMatch) {
      borclu.tcknVkn = tcknMatch[1];
    }

    // SGK Sicil No (2 4324... veya benzer format)
    const sgkSicilMatch = text.match(/(?:sicil|işyeri\s*sicil|sicil\s*no)[:\s]*([0-9\s-]{15,35})/i);
    if (sgkSicilMatch) {
      borclu.sgkSicilNo = sgkSicilMatch[1].trim();
    }

    // Dosya / Takip No (2026/1055706...)
    const dosyaMatch = text.match(/(?:dosya|takip|esas)\s*(?:no|numarası)?[:\s]*([0-9]{4}\/[0-9\w-]+)/i);
    if (dosyaMatch) {
      ayarlar.dosyaNo = dosyaMatch[1].trim();
    }

    // Plaka (örn: 52 ABC 123, 34 AB 1234)
    const plakaMatch = text.match(/\b(0[1-9]|[1-7][0-9]|8[01])\s*([A-Z]{1,3})\s*([0-9]{2,4})\b/);
    if (plakaMatch) {
      teminat.tur = 'tasit';
      teminat.plaka = plakaMatch[0].trim();
    }

    // Ada / Parsel
    const adaParselMatch = text.match(/ada[:\s]*([0-9]+)[\s,/-]*parsel[:\s]*([0-9]+)/i);
    if (adaParselMatch) {
      teminat.tur = 'gayrimenkul';
      teminat.ada = adaParselMatch[1];
      teminat.parsel = adaParselMatch[2];
    }

    // Tutar (örn: 125.000,00 TL veya 125000 TL)
    const tutarMatch = text.match(/([0-9]{1,3}(?:\.[0-9]{3})*(?:,[0-9]{2})?)\s*(?:TL|Türk Lirası)/i);
    if (tutarMatch) {
      ayarlar.borcTutari = `${tutarMatch[1]} TL`;
    }

    // İl / İlçe
    const ilMatch = text.match(/(?:ORDU|İSTANBUL|ANKARA|İZMİR|SAMSUN|TRABZON|BURSA|ANTALYA|KOCAELİ|GİRESUN)/i);
    if (ilMatch) {
      teminat.il = ilMatch[0].toUpperCase();
    }

    // Ad Soyad tespiti
    const adSoyadMatch = text.match(/(?:adı\s*soyadı|ad\s*soyad|borçlu|muvafakat\s*eden)[:\s]*([A-ZÇĞİÖŞÜa-zçğıöşü\s]{3,35})/i);
    if (adSoyadMatch) {
      borclu.adSoyad = adSoyadMatch[1].trim();
    }

    result.ayarlar = ayarlar as any;
    result.borclu = borclu as any;
    result.teminat = teminat as any;
    result.metin = text.trim();

    setTimeout(() => {
      setIsParsing(false);
      onApplyData(result);
      onClose();
    }, 300);
  };

  // Word (.docx) veya Text (.txt) dosyası yükleme
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError(null);
    setFileLoading(true);

    try {
      if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const res = await mammoth.extractRawText({ arrayBuffer });
        const text = res.value || '';
        if (text.trim().length === 0) {
          throw new Error('Word belgesinde okunabilir metin bulunamadı.');
        }
        setPastedText(text);
        setActiveTab('paste');
      } else if (file.name.endsWith('.txt')) {
        const text = await file.text();
        setPastedText(text);
        setActiveTab('paste');
      } else {
        throw new Error('Lütfen .docx veya .txt formatında bir belge seçin.');
      }
    } catch (err: any) {
      setFileError(err.message || 'Dosya okunurken bir hata oluştu.');
    } finally {
      setFileLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-primary)',
          color: 'var(--text-primary)',
        }}
      >
        {/* Üst Başlık */}
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-elevated)' }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                Örnek Belge Yükle &amp; Akıllı Metin Aktarımı
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Resmî EK-9 şablonlarını yükleyin, Word belgesi aktarın veya kopyalanan metni yapıştırın
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-500/10 transition-colors text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Butonları */}
        <div
          className="px-6 pt-3 border-b flex items-center gap-4 text-xs font-bold"
          style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-elevated)' }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'presets'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Hazır Örnek Belgeler ({presets.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'paste'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Clipboard className="w-4 h-4" />
            <span>Metin / Taslak Yapıştır</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('file')}
            className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'file'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Word (.docx) Dosyası Yükle</span>
          </button>
        </div>

        {/* Tab İçerikleri */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: HAZIR ÖRNEKLER */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 font-medium">
                Aşağıdaki hazır doldurulmuş resmî şablonlardan birini seçerek belgeyi anında oluşturabilirsiniz:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {presets.map((preset) => (
                  <div
                    key={preset.id}
                    className="p-4 rounded-2xl border transition-all hover:border-teal-500/80 hover:shadow-md cursor-pointer flex flex-col justify-between group"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      borderColor: 'var(--border-primary)',
                    }}
                    onClick={() => {
                      onApplyData(preset.data);
                      onClose();
                    }}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                          {preset.badge}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
                      </div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                        {preset.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {preset.desc}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t text-[11px] font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1" style={{ borderColor: 'var(--border-primary)' }}>
                      <span>Bu Örneği Yükle &amp; Uygula</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: METİN YAPIŞTIR */}
          {activeTab === 'paste' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 font-medium">
                Herhangi bir muvafakatname, dilekçe, e-Devlet veya SGK yazısını buraya yapıştırın. Sistem TCKN, ad soyad, dosya no, borç tutarı ve taşınmaz/araç verilerini otomatik ayrıştırır:
              </p>
              <textarea
                rows={9}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Örnek:
T.C. SOSYAL GÜVENLİK KURUMU BAŞKANLIĞI
ORDU SOSYAL GÜVENLİK İL MÜDÜRLÜĞÜNE
Konu: EK-9 Muvafakatname
Dosya No: 2026/1055706-İCRA
Borçlu: ÜMİT ÖZTÜRK (TCKN: 24324010110)
Borç Tutarı: 385.450 TL
Taşınmaz: Ordu Altınordu Yeni Mahalle Ada 1024 Parsel 18..."
                className="form-control-custom text-xs font-mono leading-relaxed"
              />

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-500">
                  {pastedText.length} karakter
                </span>
                <button
                  type="button"
                  disabled={!pastedText.trim() || isParsing}
                  onClick={() => parsePastedContent(pastedText)}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isParsing ? 'Ayrıştırılıyor...' : 'Otomatik Ayrıştır ve Uygula'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: WORD (.DOCX) YÜKLE */}
          {activeTab === 'file' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 font-medium">
                Bilgisayarınızda bulunan mevcut bir .docx formatlı muvafakatname veya taahhütname dosyasını yükleyin:
              </p>

              <label className="border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-teal-500 hover:bg-teal-500/5 transition-all">
                <Upload className="w-10 h-10 text-teal-600 mb-2" />
                <span className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                  Word Belgesi Seçin veya Sürükleyin (.docx)
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Metinler doğrudan çıkarılarak düzenleme paneline aktarılır
                </span>
                <input
                  type="file"
                  accept=".docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {fileLoading && (
                <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-700 dark:text-teal-300 font-bold flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                  <span>Word belgesi okunuyor ve ayrıştırılıyor...</span>
                </div>
              )}

              {fileError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-700 dark:text-rose-300 font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{fileError}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
