import React, { useState } from 'react';
import {
  MuvafakatnameDocument,
  EmblemType,
  BorderStyle,
  DocFont,
  SignatureLayout,
} from '../types/muvafakatname';
import { OFFICIAL_TEMPLATES } from '../data/templates';
import {
  Users,
  FileText,
  Sliders,
  BookmarkCheck,
  Plus,
  Trash2,
  Sparkles,
  Maximize2,
  CheckCircle2,
  FileCheck,
  Building2,
} from 'lucide-react';

interface EditorPanelProps {
  doc: MuvafakatnameDocument;
  onChange: (updated: MuvafakatnameDocument) => void;
  onOpenPasteModal: () => void;
  onAutoFit: () => void;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  doc,
  onChange,
  onOpenPasteModal,
  onAutoFit,
}) => {
  const [activeTab, setActiveTab] = useState<'parties' | 'content' | 'design' | 'templates'>('parties');
  const isSgkEk9 = doc.templateType === 'sgk_ek9';

  const updateField = <K extends keyof MuvafakatnameDocument>(field: K, value: MuvafakatnameDocument[K]) => {
    onChange({ ...doc, [field]: value });
  };

  const updateGrantor = (field: string, value: string) => {
    onChange({
      ...doc,
      grantor: { ...doc.grantor, [field]: value },
    });
  };

  const updateSgk = (field: string, value: any) => {
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

  const handleFillOfficialEk9ImageSample = () => {
    const officialImageSentence =
      '...................................’nin Sosyal Güvenlik Kurumuna olan.................dönemi/ayına ilişkin...................................... TL tutarında ......................... borcuna ve bu borca bu tarihten ödenmesine kadar geçecek süre için işleyecek fer’ilerine karşılık aşağıda özellikleri yazılı menkul /gayrimenkul malı 6183 sayılı Kanunun 10 uncu maddesinin beşinci fıkrası gereğince teminat olarak gösteriyor ve söz konusu malların Sosyal Güvenlik Kurumu tarafından haczedilmesine muvafakat ediyorum. Bu konuda herhangi bir itirazda bulunmayacağımı beyan ve taahhüt ederim.';

    onChange({
      ...doc,
      templateType: 'sgk_ek9',
      title: 'ÜÇÜNCÜ ŞAHISLAR TARAFINDAN VERİLECEK MUVAFAKATNAME ÖRNEĞİ',
      annexCode: 'Ek-9',
      institution: 'SOSYAL GÜVENLİK İL MÜDÜRLÜĞÜNE',
      date: '..../...../.....',
      borderStyle: 'none',
      emblem: 'none',
      showQrCode: false,
      showBarcode: false,
      docFont: 'serif',
      sgkDetails: {
        annexCode: 'Ek-9',
        debtorName: '',
        debtPeriod: '',
        debtAmount: '',
        debtType: '',
        propertyType: 'menkul / gayrimenkul',
        customPropertyTypeText: 'menkul /gayrimenkul malı',
        propertyDetails: '',
        propertyDetailsTitle: 'Teminat Gösterilen Menkul / Gayrimenkul Malın Özellikleri:',
        showPropertyBox: false, // Görselde kutu yer almadığı için doğrudan metin ve imzalar basılır
        includeSpouseConsent: false,
        spouseFullName: '',
        spouseTcNumber: '',
        spouseTitle: 'Malikin Eşi (TMK m.194 Eş Muvafakati)',
        grantorTitleInBox: 'Ünvanı',
        icraOfficer1Title: 'İcra Memuru',
        icraOfficer1Name: '',
        icraOfficer2Title: 'Sorumlu İcra Memuru',
        icraOfficer2Name: '',
        endorsementNote: 'Bu muvafakatname, huzurumuzda imza altına alınmıştır.',
        showBlankDots: true,
        useCustomMainSentence: true,
        customMainSentence: officialImageSentence,
      },
      grantor: {
        fullName: '',
        title: '',
        tcNumber: '',
        taxNumber: '',
        address: '',
      },
    });
  };

  const handleFillSampleSgk = () => {
    onChange({
      ...doc,
      templateType: 'sgk_ek9',
      title: 'ÜÇÜNCÜ ŞAHISLAR TARAFINDAN VERİLECEK MUVAFAKATNAME ÖRNEĞİ',
      annexCode: 'Ek-9',
      institution: 'İSTANBUL SOSYAL GÜVENLİK İL MÜDÜRLÜĞÜNE',
      date: new Date().toLocaleDateString('tr-TR'),
      borderStyle: 'none',
      emblem: 'none',
      showQrCode: false,
      showBarcode: false,
      docFont: 'serif',
      sgkDetails: {
        annexCode: 'Ek-9',
        debtorName: 'ÖZDEMİR İNŞAAT VE TAAHHÜT LİMİTED ŞİRKETİ',
        debtPeriod: '2025/10 - 2026/04',
        debtAmount: '385.450,00',
        debtType: 'sigorta primi ve gecikme zammı',
        propertyType: 'menkul',
        customPropertyTypeText: 'menkul malı',
        propertyDetails: '34 AB 9876 Plakalı 2023 Model Mercedes-Benz Çekici ve Dorse',
        propertyDetailsTitle: 'Teminat Gösterilen Menkul Malın (Taşıt / Aracın) Özellikleri:',
        showPropertyBox: true,
        includeSpouseConsent: false,
        spouseFullName: '',
        spouseTcNumber: '',
        spouseTitle: 'Malikin Eşi (TMK m.194 Eş Muvafakati)',
        grantorTitleInBox: 'Muvafakat Veren',
        icraOfficer1Title: 'İcra Memuru',
        icraOfficer1Name: 'Memur Ali KILIÇ (Sicil: 48921)',
        icraOfficer2Title: 'Sorumlu İcra Memuru',
        icraOfficer2Name: 'Sorumlu Şef Kemal AYDIN (Sicil: 31204)',
        endorsementNote: 'Bu muvafakatname, huzurumuzda imza altına alınmıştır.',
        showBlankDots: false,
        useCustomMainSentence: false,
      },
      grantor: {
        fullName: 'Mustafa ÖZDEMİR',
        title: 'Muvafakat Veren / Şirket Müdürü',
        tcNumber: '24681012141',
        taxNumber: '6850123490',
        address: 'Barbaros Bulvarı No:102 Kat:4 Beşiktaş / İstanbul',
      },
    });
  };

  const handleFillSampleGayrimenkulSgk = () => {
    onChange({
      ...doc,
      templateType: 'sgk_ek9',
      title: 'ÜÇÜNCÜ ŞAHISLAR TARAFINDAN VERİLECEK MUVAFAKATNAME ÖRNEĞİ',
      annexCode: 'Ek-9',
      institution: 'İSTANBUL SOSYAL GÜVENLİK İL MÜDÜRLÜĞÜNE',
      date: new Date().toLocaleDateString('tr-TR'),
      borderStyle: 'none',
      emblem: 'none',
      showQrCode: false,
      showBarcode: false,
      docFont: 'serif',
      sgkDetails: {
        annexCode: 'Ek-9',
        debtorName: 'ÖZDEMİR İNŞAAT VE TAAHHÜT LİMİTED ŞİRKETİ',
        debtPeriod: '2025/10 - 2026/04',
        debtAmount: '850.000,00',
        debtType: 'sigorta primi ve gecikme cezası',
        propertyType: 'gayrimenkul',
        customPropertyTypeText: 'gayrimenkul malı',
        propertyDetails: 'İstanbul İli, Kadıköy İlçesi, Caferağa Mah., 245 Ada, 12 Parsel, 4 Nolu Bağımsız Bölüm (Mesken/Konut)',
        propertyDetailsTitle: 'Teminat Gösterilen Gayrimenkulün (Taşınmazın) Özellikleri:',
        showPropertyBox: true,
        includeSpouseConsent: true,
        spouseFullName: 'Emine ÖZDEMİR',
        spouseTcNumber: '98765432108',
        spouseTitle: 'Malikin Eşi (TMK m.194 Eş Muvafakati)',
        spouseConsentText: 'Türk Medeni Kanunu m. 194 ve ilgili mevzuat uyarınca; yukarıda kimlik ve adres bilgileri yer alan eşim Mustafa ÖZDEMİR tarafından Sosyal Güvenlik Kurumuna olan borcuna karşılık teminat olarak gösterilen ve aile konutu niteliğindeki yukarıda yazılı gayrimenkulün haczedilmesine ve teminat gösterilmesine serbest irademle açıkça muvafakat ediyorum.',
        grantorTitleInBox: 'Muvafakat Veren (Gayrimenkul Maliki)',
        icraOfficer1Title: 'İcra Memuru',
        icraOfficer1Name: 'Memur Ali KILIÇ (Sicil: 48921)',
        icraOfficer2Title: 'Sorumlu İcra Memuru',
        icraOfficer2Name: 'Sorumlu Şef Kemal AYDIN (Sicil: 31204)',
        endorsementNote: 'Bu muvafakatname, malik ve eşi huzurumuzda imza altına alınmıştır.',
        showBlankDots: false,
        useCustomMainSentence: false,
      },
      grantor: {
        fullName: 'Mustafa ÖZDEMİR',
        title: 'Gayrimenkul Maliki',
        tcNumber: '24681012141',
        taxNumber: '6850123490',
        address: 'Caferağa Mah. Moda Cad. No:44 D:4 Kadıköy / İstanbul',
      },
    });
  };

  const handleMakeBlankSgk = () => {
    onChange({
      ...doc,
      templateType: 'sgk_ek9',
      title: 'ÜÇÜNCÜ ŞAHISLAR TARAFINDAN VERİLECEK MUVAFAKATNAME ÖRNEĞİ',
      annexCode: 'Ek-9',
      institution: 'SOSYAL GÜVENLİK İL MÜDÜRLÜĞÜNE',
      date: '..../...../.....',
      borderStyle: 'none',
      emblem: 'none',
      showQrCode: false,
      showBarcode: false,
      docFont: 'serif',
      sgkDetails: {
        annexCode: 'Ek-9',
        debtorName: '',
        debtPeriod: '',
        debtAmount: '',
        debtType: '',
        propertyType: 'menkul / gayrimenkul',
        customPropertyTypeText: 'menkul / gayrimenkul malı',
        propertyDetails: '',
        propertyDetailsTitle: 'Teminat Gösterilen Menkul / Gayrimenkul Malın Özellikleri:',
        showPropertyBox: true,
        includeSpouseConsent: false,
        spouseFullName: '',
        spouseTcNumber: '',
        spouseTitle: 'Malikin Eşi (TMK m.194 Eş Muvafakati)',
        grantorTitleInBox: 'Muvafakat Veren',
        icraOfficer1Title: 'İcra Memuru',
        icraOfficer1Name: '',
        icraOfficer2Title: 'Sorumlu İcra Memuru',
        icraOfficer2Name: '',
        endorsementNote: 'Bu muvafakatname, huzurumuzda imza altına alınmıştır.',
        showBlankDots: true,
        useCustomMainSentence: false,
      },
      grantor: {
        fullName: '',
        title: '',
        tcNumber: '',
        taxNumber: '',
        address: '',
      },
    });
  };

  const updateGrantor2 = (field: string, value: any) => {
    onChange({
      ...doc,
      grantor2: { ...doc.grantor2, [field]: value },
    });
  };

  const updateGrantee = (field: string, value: any) => {
    onChange({
      ...doc,
      grantee: { ...doc.grantee, [field]: value },
    });
  };

  const addClause = () => {
    const clauses = doc.additionalClauses || [];
    onChange({
      ...doc,
      additionalClauses: [...clauses, 'Yeni resmi taahhüt ve özel şart maddesi...'],
    });
  };

  const updateClause = (index: number, text: string) => {
    const clauses = [...(doc.additionalClauses || [])];
    clauses[index] = text;
    onChange({ ...doc, additionalClauses: clauses });
  };

  const removeClause = (index: number) => {
    const clauses = (doc.additionalClauses || []).filter((_, i) => i !== index);
    onChange({ ...doc, additionalClauses: clauses });
  };

  const handleSelectTemplate = (templateId: string) => {
    const found = OFFICIAL_TEMPLATES.find(t => t.id === templateId);
    if (found) {
      onChange({
        ...doc,
        ...found.data,
      } as MuvafakatnameDocument);
    }
  };

  return (
    <div className="bg-white border-r border-stone-200 flex flex-col h-full overflow-hidden no-print">
      {/* Editor Tab Navigation */}
      <div className="border-b border-stone-200 bg-stone-50/80 p-2 shrink-0">
        <div className="grid grid-cols-4 gap-1 p-0.5 bg-stone-200/70 rounded-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('parties')}
            className={`py-1.5 px-2 rounded-md transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'parties'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span>{isSgkEk9 ? 'SGK Bilgileri' : 'Kişiler & Kurum'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('content')}
            className={`py-1.5 px-2 rounded-md transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'content'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span>Metin & Şartlar</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('design')}
            className={`py-1.5 px-2 rounded-md transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'design'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 shrink-0" />
            <span>Tasarım & A4</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('templates')}
            className={`py-1.5 px-2 rounded-md transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'templates'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5 shrink-0" />
            <span>Şablonlar</span>
          </button>
        </div>
      </div>

      {/* Editor Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TAB 1: PARTIES & INSTITUTION */}
        {activeTab === 'parties' && (
          <div className="space-y-4 text-xs">
            {/* Quick Action: Word (.docx) & Paste */}
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Elinizde hazır Word (.docx) belgesi veya taslak mı var?
                </div>
                <div className="text-[11px] text-stone-600 mt-0.5">
                  Dosyayı yükleyin veya metni yapıştırın; otomatik ayrıştırıp A4 formatına yerleştirelim.
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenPasteModal}
                className="px-2.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-md text-[11px] shrink-0 transition-colors"
              >
                Word / Metin Yükle
              </button>
            </div>

            {/* -------------------------------------------------------- */}
            {/* SGK EK-9 SPECIFIC FORM FIELDS (Matching User Attachment) */}
            {/* -------------------------------------------------------- */}
            {isSgkEk9 ? (
              <div className="space-y-4">
                {/* Format Action Switcher (4 DOLDURMA MODU) */}
                <div className="p-3 bg-stone-100/95 rounded-lg border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Ek-9 Doldurma Modu:
                    </span>
                    <span className="text-[10px] text-stone-500 font-medium">Hızlı Şablon Değiştirici</span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={handleFillOfficialEk9ImageSample}
                      className={`px-2 py-1.5 rounded-md text-[11px] font-bold border transition-all text-left flex items-center gap-1.5 ${
                        doc.sgkDetails?.showPropertyBox === false && !doc.sgkDetails?.includeSpouseConsent && !doc.sgkDetails?.debtorName
                          ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                          : 'bg-white text-blue-900 border-blue-200 hover:border-blue-500 hover:bg-blue-50'
                      }`}
                      title="Resmi SGK Ek-9 görselindeki asıl metin ve düzen. Tıklayıp doğrudan A4 sayfasında Word gibi yazabilirsiniz."
                    >
                      <FileCheck className="w-3.5 h-3.5 shrink-0" />
                      <div className="truncate">
                        <div className="leading-tight">Resimdeki Format</div>
                        <div className="text-[9px] font-normal opacity-80 truncate">Word gibi doğrudan yaz</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={handleFillSampleSgk}
                      className={`px-2 py-1.5 rounded-md text-[11px] font-semibold border transition-all text-left flex items-center gap-1.5 ${
                        doc.sgkDetails?.propertyType === 'menkul' && doc.sgkDetails?.debtorName
                          ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                          : 'bg-white text-stone-800 border-stone-300 hover:border-stone-600 hover:bg-stone-50'
                      }`}
                      title="Menkul (Araç / Taşıt) Teminatı Örneği"
                    >
                      <span className="text-xs">🚗</span>
                      <div className="truncate">
                        <div className="leading-tight">Menkul (Araç)</div>
                        <div className="text-[9px] font-normal opacity-80 truncate">Plakalı Araç Teminatı</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={handleFillSampleGayrimenkulSgk}
                      className={`px-2 py-1.5 rounded-md text-[11px] font-semibold border transition-all text-left flex items-center gap-1.5 ${
                        doc.sgkDetails?.includeSpouseConsent
                          ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                          : 'bg-white text-amber-950 border-amber-300 hover:border-amber-600 hover:bg-amber-50'
                      }`}
                      title="Gayrimenkul ve TMK m. 194 Eş Muvafakati Örneği (Çift İmzalı)"
                    >
                      <span className="text-xs">🏢</span>
                      <div className="truncate">
                        <div className="leading-tight">Gayrimenkul + Eş</div>
                        <div className="text-[9px] font-normal opacity-80 truncate">TMK m.194 Eş İmzalı</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={handleMakeBlankSgk}
                      className={`px-2 py-1.5 rounded-md text-[11px] font-semibold border transition-all text-left flex items-center gap-1.5 ${
                        doc.sgkDetails?.showPropertyBox !== false && !doc.sgkDetails?.debtorName && doc.sgkDetails?.showBlankDots
                          ? 'bg-stone-800 text-white border-stone-900 shadow-xs'
                          : 'bg-white text-stone-700 border-stone-300 hover:border-stone-600 hover:bg-stone-50'
                      }`}
                      title="Tüm alanları noktalı hatlı boş resmi forma çevir (El yazısıyla doldurma)"
                    >
                      <span className="text-xs">✍️</span>
                      <div className="truncate">
                        <div className="leading-tight">Boş / Noktalı Yap</div>
                        <div className="text-[9px] font-normal opacity-80 truncate">El Yazısı İçin Çizgili</div>
                      </div>
                    </button>
                  </div>

                  <div className="text-[10px] text-stone-600 leading-tight bg-white p-1.5 rounded border border-stone-200">
                    💡 <strong>Tüm Alanlar Düzenlenebilir:</strong> Seçtiğiniz mod fark etmeksizin aşağıdaki tüm alanları değiştirebilir veya <strong>"Metin & Şartlar"</strong> sekmesinde ana cümleyi kelime kelime serbestçe yazabilirsiniz.
                  </div>
                </div>

                {/* 1. SGK Authority & Annex Code */}
                <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase tracking-wider text-stone-800 text-[11px] flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-stone-600" />
                      1. Ek Numarası ve İlgili SGK Müdürlüğü
                    </span>
                    <span className="font-bold font-mono text-stone-900 px-2 py-0.5 bg-stone-200 rounded text-[11px]">
                      {doc.annexCode || 'Ek-9'}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-stone-600 font-medium">
                        Sosyal Güvenlik İl / Merkez Müdürlüğü
                      </label>
                      <button
                        type="button"
                        onClick={() => updateField('institution', 'SOSYAL GÜVENLİK İL MÜDÜRLÜĞÜNE')}
                        className="text-[10px] text-stone-500 hover:text-stone-800 underline"
                      >
                        Noktalı Başlık Yap
                      </button>
                    </div>
                    <input
                      type="text"
                      value={doc.institution}
                      onChange={e => updateField('institution', e.target.value)}
                      placeholder="Örn: İSTANBUL SOSYAL GÜVENLİK İL MÜDÜRLÜĞÜNE"
                      className="w-full p-2 bg-white border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-900 outline-none font-semibold text-stone-900"
                    />
                    <span className="text-[10px] text-stone-400 mt-0.5 block">
                      Boş bırakırsanız belgede "........................... SOSYAL GÜVENLİK İL MÜDÜRLÜĞÜNE" şeklinde görünür.
                    </span>
                  </div>
                </div>

                {/* 2. Asıl Borçlu & Borç Bilgileri */}
                <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 space-y-2.5">
                  <span className="font-bold uppercase tracking-wider text-stone-800 text-[11px] block">
                    2. Asıl Borçlu & SGK Borç Bilgileri
                  </span>

                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="text-stone-600 font-medium">
                        Borçlu Şahıs veya Şirket Adı (......’nin)
                      </label>
                      <button
                        type="button"
                        onClick={() => updateSgk('debtorName', '')}
                        className="text-[10px] text-stone-500 hover:text-stone-800 underline"
                      >
                        Noktalı Yap
                      </button>
                    </div>
                    <input
                      type="text"
                      value={doc.sgkDetails?.debtorName || ''}
                      onChange={e => updateSgk('debtorName', e.target.value)}
                      placeholder="Örn: ABC İNŞAAT TİCARET LTD. ŞTİ. veya Ad Soyad"
                      className="w-full p-2 bg-white border border-stone-300 rounded-md font-medium text-stone-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <label className="text-stone-600 font-medium">
                          Borç Dönemi / Ayı
                        </label>
                        <button
                          type="button"
                          onClick={() => updateSgk('debtPeriod', '')}
                          className="text-[10px] text-stone-500 hover:text-stone-800 underline"
                        >
                          Noktalı
                        </button>
                      </div>
                      <input
                        type="text"
                        value={doc.sgkDetails?.debtPeriod || ''}
                        onChange={e => updateSgk('debtPeriod', e.target.value)}
                        placeholder="Örn: 2025/11 - 2026/04"
                        className="w-full p-1.5 bg-white border border-stone-300 rounded-md font-mono"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <label className="text-stone-600 font-medium">
                          Borç Tutarı (TL)
                        </label>
                        <button
                          type="button"
                          onClick={() => updateSgk('debtAmount', '')}
                          className="text-[10px] text-stone-500 hover:text-stone-800 underline"
                        >
                          Noktalı
                        </button>
                      </div>
                      <input
                        type="text"
                        value={doc.sgkDetails?.debtAmount || ''}
                        onChange={e => updateSgk('debtAmount', e.target.value)}
                        placeholder="Örn: 250.000,00"
                        className="w-full p-1.5 bg-white border border-stone-300 rounded-md font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="text-stone-600 font-medium">
                        Borç Türü (...... borcuna)
                      </label>
                      <button
                        type="button"
                        onClick={() => updateSgk('debtType', '')}
                        className="text-[10px] text-stone-500 hover:text-stone-800 underline"
                      >
                        Noktalı Yap
                      </button>
                    </div>
                    <input
                      type="text"
                      value={doc.sgkDetails?.debtType || ''}
                      onChange={e => updateSgk('debtType', e.target.value)}
                      placeholder="Örn: sigorta primi / idari para cezası"
                      className="w-full p-1.5 bg-white border border-stone-300 rounded-md"
                    />
                  </div>
                </div>

                {/* 3. Muvafakat Veren Üçüncü Şahıs */}
                <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 space-y-2.5">
                  <span className="font-bold uppercase tracking-wider text-stone-800 text-[11px] block">
                    3. Muvafakat Veren Üçüncü Şahıs (Maliki)
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <label className="text-stone-600 font-medium">Adı Soyadı</label>
                        <button
                          type="button"
                          onClick={() => updateGrantor('fullName', '')}
                          className="text-[10px] text-stone-500 hover:text-stone-800 underline"
                        >
                          Noktalı / Boş
                        </button>
                      </div>
                      <input
                        type="text"
                        value={doc.grantor.fullName}
                        onChange={e => updateGrantor('fullName', e.target.value)}
                        placeholder="Ad Soyad (Boşsa 'Adı Soyadı' yazar)"
                        className="w-full p-1.5 bg-white border border-stone-300 rounded-md font-semibold text-stone-900"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <label className="text-stone-600 font-medium">Ünvanı / Sıfatı</label>
                        <button
                          type="button"
                          onClick={() => updateGrantor('title', 'Ünvanı')}
                          className="text-[10px] text-stone-500 hover:text-stone-800 underline"
                        >
                          'Ünvanı' Yap
                        </button>
                      </div>
                      <input
                        type="text"
                        value={doc.grantor.title || ''}
                        onChange={e => updateGrantor('title', e.target.value)}
                        placeholder="Örn: Ünvanı / Şirket Müdürü"
                        className="w-full p-1.5 bg-white border border-stone-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <label className="text-stone-600 font-medium">TC Kimlik No</label>
                        <button
                          type="button"
                          onClick={() => updateGrantor('tcNumber', '')}
                          className="text-[10px] text-stone-500 hover:text-stone-800 underline"
                        >
                          Noktalı
                        </button>
                      </div>
                      <input
                        type="text"
                        maxLength={11}
                        value={doc.grantor.tcNumber}
                        onChange={e => updateGrantor('tcNumber', e.target.value)}
                        placeholder="11 haneli T.C."
                        className="w-full p-1.5 bg-white border border-stone-300 rounded-md font-mono"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <label className="text-stone-600 font-medium">Vergi Kimlik No</label>
                        <button
                          type="button"
                          onClick={() => updateGrantor('taxNumber', '')}
                          className="text-[10px] text-stone-500 hover:text-stone-800 underline"
                        >
                          Noktalı
                        </button>
                      </div>
                      <input
                        type="text"
                        maxLength={10}
                        value={doc.grantor.taxNumber || ''}
                        onChange={e => updateGrantor('taxNumber', e.target.value)}
                        placeholder="10 haneli Vergi No"
                        className="w-full p-1.5 bg-white border border-stone-300 rounded-md font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="text-stone-600 font-medium">Tebligat / İkametgah Adresi</label>
                      <button
                        type="button"
                        onClick={() => updateGrantor('address', '')}
                        className="text-[10px] text-stone-500 hover:text-stone-800 underline"
                      >
                        Noktalı Çizgi Yap
                      </button>
                    </div>
                    <input
                      type="text"
                      value={doc.grantor.address || ''}
                      onChange={e => updateGrantor('address', e.target.value)}
                      placeholder="Mahalle, Cadde, No, İlçe / İl"
                      className="w-full p-1.5 bg-white border border-stone-300 rounded-md"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="text-stone-600 font-medium">Düzenleme Tarihi</label>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateField('date', '..../...../.....')}
                          className="text-[10px] text-stone-500 hover:text-stone-800 underline"
                        >
                          ..../...../.....
                        </button>
                        <span className="text-stone-300">|</span>
                        <button
                          type="button"
                          onClick={() => updateField('date', new Date().toLocaleDateString('tr-TR'))}
                          className="text-[10px] text-blue-700 hover:text-blue-900 underline"
                        >
                          Bugün
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={doc.date}
                      onChange={e => updateField('date', e.target.value)}
                      placeholder="GG.AA.YYYY veya ..../...../....."
                      className="w-full p-1.5 bg-white border border-stone-300 rounded-md font-mono"
                    />
                  </div>
                </div>

                {/* 4. Teminat Malının Özellikleri & Eş Muvafakati */}
                <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase tracking-wider text-stone-800 text-[11px] block">
                      4. Teminat Mal Türü & Mal Detayları (Menkul / Gayrimenkul)
                    </span>
                    <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-semibold">
                      Serbest Düzenlenebilir
                    </span>
                  </div>

                  {/* Mal Türü Seçimi: 4 Seçenek */}
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">
                      Teminat Gösterilecek Mal Türü:
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 mb-2">
                      <button
                        type="button"
                        onClick={() => {
                          updateSgk('propertyType', 'menkul');
                          updateSgk('customPropertyTypeText', 'menkul malı');
                          updateSgk('propertyDetailsTitle', 'Teminat Gösterilen Menkul Malın (Taşıt / Aracın) Özellikleri:');
                          updateSgk('showPropertyBox', true);
                          updateSgk('includeSpouseConsent', false);
                        }}
                        className={`py-1.5 px-2 rounded-md border text-center font-medium transition-colors text-[11px] ${
                          doc.sgkDetails?.propertyType === 'menkul' && !doc.sgkDetails?.includeSpouseConsent
                            ? 'bg-stone-900 text-white border-stone-900 shadow-xs font-semibold'
                            : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                        }`}
                      >
                        🚗 Menkul (Araç / Taşıt)
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          updateSgk('propertyType', 'gayrimenkul');
                          updateSgk('customPropertyTypeText', 'gayrimenkul malı');
                          updateSgk('propertyDetailsTitle', 'Teminat Gösterilen Gayrimenkulün (Taşınmazın) Özellikleri:');
                          updateSgk('showPropertyBox', true);
                          updateSgk('includeSpouseConsent', true);
                        }}
                        className={`py-1.5 px-2 rounded-md border text-center font-medium transition-colors text-[11px] ${
                          doc.sgkDetails?.propertyType === 'gayrimenkul' || doc.sgkDetails?.includeSpouseConsent
                            ? 'bg-amber-700 text-white border-amber-800 font-semibold shadow-xs'
                            : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                        }`}
                      >
                        🏢 Gayrimenkul + Eş İmzası
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          updateSgk('propertyType', 'menkul / gayrimenkul');
                          updateSgk('customPropertyTypeText', 'menkul /gayrimenkul malı');
                          updateSgk('propertyDetailsTitle', 'Teminat Gösterilen Menkul / Gayrimenkul Malın Özellikleri:');
                        }}
                        className={`py-1.5 px-2 rounded-md border text-center font-medium transition-colors text-[11px] ${
                          doc.sgkDetails?.propertyType === 'menkul / gayrimenkul'
                            ? 'bg-stone-800 text-white border-stone-800 font-semibold shadow-xs'
                            : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                        }`}
                      >
                        📋 Menkul / Gayrimenkul (Genel)
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          updateSgk('propertyType', 'custom');
                        }}
                        className={`py-1.5 px-2 rounded-md border text-center font-medium transition-colors text-[11px] ${
                          doc.sgkDetails?.propertyType === 'custom'
                            ? 'bg-stone-800 text-white border-stone-800 font-semibold shadow-xs'
                            : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                        }`}
                      >
                        ✍️ Özel İbare Tanımla
                      </button>
                    </div>

                    {/* Cümle İçinde Geçen Mal İbaresi (Her türlü düzenlenebilir!) */}
                    <div className="bg-white p-2 border border-stone-300 rounded-md mb-2">
                      <label className="block text-stone-700 font-semibold mb-0.5 text-[11px]">
                        Kanuni Cümle İçindeki Mal İbaresi:
                      </label>
                      <input
                        type="text"
                        value={
                          doc.sgkDetails?.customPropertyTypeText !== undefined
                            ? doc.sgkDetails.customPropertyTypeText
                            : (doc.sgkDetails?.propertyType === 'menkul'
                                ? 'menkul malı'
                                : doc.sgkDetails?.propertyType === 'gayrimenkul'
                                ? 'gayrimenkul malı'
                                : 'menkul /gayrimenkul malı')
                        }
                        onChange={e => updateSgk('customPropertyTypeText', e.target.value)}
                        placeholder="Örn: menkul malı / gayrimenkul malı / menkul /gayrimenkul malı / 34 AB 1234 plakalı aracı"
                        className="w-full p-1.5 bg-stone-50 border border-stone-300 rounded text-xs font-semibold text-stone-900"
                      />
                      <span className="text-[10px] text-stone-500 mt-0.5 block">
                        Belgedeki "...aşağıda özellikleri yazılı <strong>[buraya yazılan metin]</strong> 6183 sayılı Kanunun..." cümlesinde yer alır.
                      </span>
                    </div>
                  </div>

                  {/* Mal Özellikleri Bölümü Aç / Kapa & Başlık / Detay */}
                  <div className="p-2.5 bg-white border border-stone-300 rounded-md space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-900 text-[11px]">
                      <input
                        type="checkbox"
                        checked={doc.sgkDetails?.showPropertyBox !== false}
                        onChange={e => updateSgk('showPropertyBox', e.target.checked)}
                        className="rounded text-stone-900 focus:ring-0"
                      />
                      <span>Teminat Mal Özellikleri Kutusunu Belgede Göster</span>
                    </label>

                    {doc.sgkDetails?.showPropertyBox !== false ? (
                      <div className="space-y-2 pt-1 border-t border-stone-200">
                        <div className="flex items-center justify-between">
                          <label className="text-stone-700 font-semibold text-[11px]">
                            Teminat Malı Kutu Başlığı
                          </label>
                          <button
                            type="button"
                            onClick={() => updateSgk('propertyDetails', '')}
                            className="text-[10px] text-stone-500 hover:text-stone-800 underline"
                          >
                            Boş Noktalı Satır Yap
                          </button>
                        </div>
                        <input
                          type="text"
                          value={
                            doc.sgkDetails?.propertyDetailsTitle ||
                            (doc.sgkDetails?.propertyType === 'gayrimenkul'
                              ? 'Teminat Gösterilen Gayrimenkulün (Taşınmazın) Özellikleri:'
                              : doc.sgkDetails?.propertyType === 'menkul'
                              ? 'Teminat Gösterilen Menkul Malın (Taşıt / Aracın) Özellikleri:'
                              : 'Teminat Gösterilen Menkul / Gayrimenkul Malın Özellikleri:')
                          }
                          onChange={e => updateSgk('propertyDetailsTitle', e.target.value)}
                          className="w-full p-1.5 bg-white border border-stone-300 rounded-md text-xs font-medium"
                        />

                        <label className="block text-stone-600 font-medium text-[11px]">
                          Malın Özellikleri (Plaka / Ada, Parsel, Bağımsız Bölüm vb.)
                        </label>
                        <textarea
                          rows={3}
                          value={doc.sgkDetails?.propertyDetails || ''}
                          onChange={e => updateSgk('propertyDetails', e.target.value)}
                          placeholder={
                            doc.sgkDetails?.propertyType === 'gayrimenkul'
                              ? 'Örn: İstanbul İli, Kadıköy İlçesi, Caferağa Mah., 245 Ada, 12 Parsel, 4 Nolu Bağımsız Bölüm (Mesken/Konut)... (Boş bırakırsanız belgede noktalı satırlar basılır)'
                              : 'Örn: 34 AB 1234 Plakalı 2023 Model Ford Focus Araç... (Boş bırakırsanız belgede noktalı satırlar basılır)'
                          }
                          className="w-full p-2 bg-stone-50 border border-stone-300 rounded-md text-xs leading-relaxed"
                        />
                        <div className="text-[10px] text-stone-500">
                          Boş bırakıldığında belgede 3 satır resmi noktalı hat basılır.
                        </div>
                      </div>
                    ) : (
                      <div className="text-[10px] text-stone-500 italic bg-stone-50 p-1.5 rounded">
                        Kutu gizlendi. Resimdeki asıl matbu form gibi metin doğrudan imza ve memur alanına akar.
                      </div>
                    )}
                  </div>

                  {/* Gayrimenkul Eş Muvafakat Alanı */}
                  <div className="pt-2 border-t border-stone-200">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-900 text-[11px] mb-2">
                      <input
                        type="checkbox"
                        checked={doc.sgkDetails?.includeSpouseConsent || false}
                        onChange={e => updateSgk('includeSpouseConsent', e.target.checked)}
                        className="rounded text-amber-700 focus:ring-0"
                      />
                      <span>
                        Gayrimenkulde Eş Muvafakatini ve İmzasını Ekle (TMK m. 194 Eş Rızası)
                      </span>
                    </label>

                    {doc.sgkDetails?.includeSpouseConsent && (
                      <div className="bg-amber-50/80 p-3 rounded-md border border-amber-200 space-y-2.5">
                        <span className="text-[10px] text-amber-950 font-bold block uppercase tracking-wider">
                          Gayrimenkul Maliki Eşinin Bilgileri & İmzası (Tüm Alanlar Düzenlenebilir):
                        </span>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="flex items-center justify-between mb-0.5">
                              <label className="text-stone-600 font-medium">Eşin Adı Soyadı</label>
                              <button
                                type="button"
                                onClick={() => updateSgk('spouseFullName', '')}
                                className="text-[10px] text-amber-800 underline"
                              >
                                Noktalı Yap
                              </button>
                            </div>
                            <input
                              type="text"
                              value={doc.sgkDetails?.spouseFullName || ''}
                              onChange={e => updateSgk('spouseFullName', e.target.value)}
                              placeholder="Eşin Adı Soyadı (Boşsa noktalı çıkar)"
                              className="w-full p-1.5 bg-white border border-stone-300 rounded-md font-semibold text-stone-900"
                            />
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-0.5">
                              <label className="text-stone-600 font-medium">Eşin T.C. Kimlik No</label>
                              <button
                                type="button"
                                onClick={() => updateSgk('spouseTcNumber', '')}
                                className="text-[10px] text-amber-800 underline"
                              >
                                Noktalı Yap
                              </button>
                            </div>
                            <input
                              type="text"
                              maxLength={11}
                              value={doc.sgkDetails?.spouseTcNumber || ''}
                              onChange={e => updateSgk('spouseTcNumber', e.target.value)}
                              placeholder="11 haneli T.C. (Boşsa noktalı çıkar)"
                              className="w-full p-1.5 bg-white border border-stone-300 rounded-md font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-stone-600 font-medium mb-0.5">
                              Malik İmza Kutusu Başlığı
                            </label>
                            <input
                              type="text"
                              value={doc.sgkDetails?.grantorTitleInBox || 'Muvafakat Veren (Gayrimenkul Maliki)'}
                              onChange={e => updateSgk('grantorTitleInBox', e.target.value)}
                              className="w-full p-1.5 bg-white border border-stone-300 rounded-md text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-600 font-medium mb-0.5">
                              Eş İmza Kutusu Başlığı
                            </label>
                            <input
                              type="text"
                              value={doc.sgkDetails?.spouseTitle || 'Malikin Eşi (TMK m.194 Eş Muvafakati)'}
                              onChange={e => updateSgk('spouseTitle', e.target.value)}
                              className="w-full p-1.5 bg-white border border-stone-300 rounded-md text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-stone-600 font-medium mb-0.5">
                            Eş Muvafakat Beyan Metni (İstediğiniz gibi düzenleyebilirsiniz):
                          </label>
                          <textarea
                            rows={3}
                            value={
                              doc.sgkDetails?.spouseConsentText ||
                              'Türk Medeni Kanunu ve ilgili mevzuat uyarınca; yukarıda kimlik ve adres bilgileri yer alan eşim tarafından Sosyal Güvenlik Kurumuna olan borcuna karşılık teminat olarak gösterilen yukarıda özellikleri yazılı gayrimenkulün haczedilmesine ve teminat gösterilmesine serbest irademle açıkça muvafakat ediyorum.'
                            }
                            onChange={e => updateSgk('spouseConsentText', e.target.value)}
                            className="w-full p-1.5 bg-white border border-stone-300 rounded-md text-[11px] leading-snug"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. SGK İcra Memurları ve Tasdik Şerhi */}
                <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 space-y-2.5">
                  <span className="font-bold uppercase tracking-wider text-stone-800 text-[11px] block">
                    5. SGK İcra Memurları & Tasdik Şerhi
                  </span>

                  <div>
                    <label className="block text-stone-600 font-medium mb-0.5">
                      Tasdik Şerhi / İmzalanma Notu
                    </label>
                    <input
                      type="text"
                      value={
                        doc.sgkDetails?.endorsementNote ||
                        (doc.sgkDetails?.includeSpouseConsent
                          ? 'Bu muvafakatname, malik ve eşi huzurumuzda imza altına alınmıştır.'
                          : 'Bu muvafakatname, huzurumuzda imza altına alınmıştır.')
                      }
                      onChange={e => updateSgk('endorsementNote', e.target.value)}
                      className="w-full p-1.5 bg-white border border-stone-300 rounded-md text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white p-2 rounded border border-stone-200 space-y-1">
                      <label className="block text-stone-500 font-medium text-[10px]">1. Memur Başlığı</label>
                      <input
                        type="text"
                        value={doc.sgkDetails?.icraOfficer1Title || 'İcra Memuru'}
                        onChange={e => updateSgk('icraOfficer1Title', e.target.value)}
                        className="w-full p-1 bg-stone-50 border border-stone-300 rounded text-xs font-semibold mb-1"
                      />
                      <div className="flex items-center justify-between">
                        <label className="text-stone-500 font-medium text-[10px]">Ad Soyad / Sicil No</label>
                        <button
                          type="button"
                          onClick={() => updateSgk('icraOfficer1Name', '')}
                          className="text-[10px] text-stone-500 hover:text-stone-800 underline"
                        >
                          Noktalı
                        </button>
                      </div>
                      <input
                        type="text"
                        value={doc.sgkDetails?.icraOfficer1Name || ''}
                        onChange={e => updateSgk('icraOfficer1Name', e.target.value)}
                        placeholder="Örn: Ali KILIÇ (Sicil: 48921)"
                        className="w-full p-1 bg-stone-50 border border-stone-300 rounded text-xs"
                      />
                    </div>

                    <div className="bg-white p-2 rounded border border-stone-200 space-y-1">
                      <label className="block text-stone-500 font-medium text-[10px]">2. Memur Başlığı</label>
                      <input
                        type="text"
                        value={doc.sgkDetails?.icraOfficer2Title || 'Sorumlu İcra Memuru'}
                        onChange={e => updateSgk('icraOfficer2Title', e.target.value)}
                        className="w-full p-1 bg-stone-50 border border-stone-300 rounded text-xs font-semibold mb-1"
                      />
                      <div className="flex items-center justify-between">
                        <label className="text-stone-500 font-medium text-[10px]">Ad Soyad / Sicil No</label>
                        <button
                          type="button"
                          onClick={() => updateSgk('icraOfficer2Name', '')}
                          className="text-[10px] text-stone-500 hover:text-stone-800 underline"
                        >
                          Noktalı
                        </button>
                      </div>
                      <input
                        type="text"
                        value={doc.sgkDetails?.icraOfficer2Name || ''}
                        onChange={e => updateSgk('icraOfficer2Name', e.target.value)}
                        placeholder="Örn: Kemal AYDIN (Sicil: 31204)"
                        className="w-full p-1 bg-stone-50 border border-stone-300 rounded text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* -------------------------------------------------------- */
              /* STANDARD LEGAL MUVAFAKATNAME FORM FIELDS                 */
              /* -------------------------------------------------------- */
              <div className="space-y-4">
                {/* Institution / Makam */}
                <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 space-y-2.5">
                  <span className="font-bold uppercase tracking-wider text-stone-700 text-[11px] block">
                    İlgili Makam & Belge Başlığı
                  </span>
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">
                      Hitap Edilen Makam / Kurum
                    </label>
                    <input
                      type="text"
                      value={doc.institution}
                      onChange={e => updateField('institution', e.target.value)}
                      placeholder="Örn: T.C. İÇİŞLERİ BAKANLIĞI EMNİYET MÜDÜRLÜĞÜNE"
                      className="w-full p-2 bg-white border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-900 outline-none font-semibold text-stone-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-stone-600 font-medium mb-1">
                        Belge Başlığı
                      </label>
                      <input
                        type="text"
                        value={doc.title}
                        onChange={e => updateField('title', e.target.value)}
                        placeholder="MUVAFAKATNAME"
                        className="w-full p-2 bg-white border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-900 outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 font-medium mb-1">
                        Alt Başlık / Kapsam
                      </label>
                      <input
                        type="text"
                        value={doc.subtitle || ''}
                        onChange={e => updateField('subtitle', e.target.value)}
                        placeholder="Örn: YURT DIŞI SEYAHAT İZNİ"
                        className="w-full p-2 bg-white border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-900 outline-none text-stone-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <div>
                      <label className="block text-stone-500 font-medium mb-0.5">Tarih</label>
                      <input
                        type="text"
                        value={doc.date}
                        onChange={e => updateField('date', e.target.value)}
                        className="w-full p-1.5 bg-white border border-stone-300 rounded-md outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-500 font-medium mb-0.5">Şehir / Yer</label>
                      <input
                        type="text"
                        value={doc.city}
                        onChange={e => updateField('city', e.target.value)}
                        className="w-full p-1.5 bg-white border border-stone-300 rounded-md outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-500 font-medium mb-0.5">Evrak No</label>
                      <input
                        type="text"
                        value={doc.documentNo}
                        onChange={e => updateField('documentNo', e.target.value)}
                        className="w-full p-1.5 bg-white border border-stone-300 rounded-md outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Grantor 1 */}
                <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 space-y-2.5">
                  <span className="font-bold uppercase tracking-wider text-stone-800 text-[11px] block">
                    Muvafakat Veren Kişi / Temsilci
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-stone-600 font-medium mb-0.5">Adı Soyadı</label>
                      <input
                        type="text"
                        value={doc.grantor.fullName}
                        onChange={e => updateGrantor('fullName', e.target.value)}
                        placeholder="Ad Soyad"
                        className="w-full p-2 bg-white border border-stone-300 rounded-md font-semibold text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 font-medium mb-0.5">T.C. Kimlik No</label>
                      <input
                        type="text"
                        maxLength={11}
                        value={doc.grantor.tcNumber}
                        onChange={e => updateGrantor('tcNumber', e.target.value)}
                        placeholder="11 haneli T.C."
                        className="w-full p-2 bg-white border border-stone-300 rounded-md font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-stone-500 font-medium mb-0.5">Sıfatı / Yakınlığı</label>
                      <input
                        type="text"
                        value={doc.grantor.relation || ''}
                        onChange={e => updateGrantor('relation', e.target.value)}
                        placeholder="Baba, Anne, Vasi vb."
                        className="w-full p-1.5 bg-white border border-stone-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-500 font-medium mb-0.5">Telefon</label>
                      <input
                        type="text"
                        value={doc.grantor.phone || ''}
                        onChange={e => updateGrantor('phone', e.target.value)}
                        placeholder="0532 000 00 00"
                        className="w-full p-1.5 bg-white border border-stone-300 rounded-md font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-500 font-medium mb-0.5">İkametgah Adresi</label>
                    <input
                      type="text"
                      value={doc.grantor.address || ''}
                      onChange={e => updateGrantor('address', e.target.value)}
                      placeholder="Mahalle, Cadde, Sokak No, İlçe / İl"
                      className="w-full p-1.5 bg-white border border-stone-300 rounded-md"
                    />
                  </div>
                </div>

                {/* Grantee */}
                <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase tracking-wider text-stone-800 text-[11px]">
                      Lehine Muvafakat Edilen (Çocuk / Şahıs)
                    </span>
                    <label className="flex items-center gap-1.5 cursor-pointer text-stone-700">
                      <input
                        type="checkbox"
                        checked={doc.grantee?.enabled}
                        onChange={e => updateGrantee('enabled', e.target.checked)}
                        className="rounded text-stone-900 focus:ring-0"
                      />
                      <span className="text-[11px] font-medium">Tabloda Göster</span>
                    </label>
                  </div>

                  {doc.grantee?.enabled && (
                    <div className="space-y-2 pt-1 border-t border-stone-200">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-stone-600 font-medium mb-0.5">Adı Soyadı</label>
                          <input
                            type="text"
                            value={doc.grantee.fullName}
                            onChange={e => updateGrantee('fullName', e.target.value)}
                            placeholder="Çocuk veya İlgili Adı"
                            className="w-full p-1.5 bg-white border border-stone-300 rounded-md font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-600 font-medium mb-0.5">T.C. Kimlik No</label>
                          <input
                            type="text"
                            maxLength={11}
                            value={doc.grantee.tcNumber}
                            onChange={e => updateGrantee('tcNumber', e.target.value)}
                            placeholder="T.C. No"
                            className="w-full p-1.5 bg-white border border-stone-300 rounded-md font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CONTENT & CLAUSES */}
        {activeTab === 'content' && (
          <div className="space-y-4 text-xs">
            {isSgkEk9 ? (
              <div className="space-y-4">
                {/* Belge Başlığı ve Ek Numarası */}
                <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 space-y-2.5">
                  <span className="font-bold uppercase tracking-wider text-stone-800 text-[11px] block">
                    Belge Başlığı & Ek Tanımı
                  </span>

                  <div className="grid grid-cols-4 gap-2">
                    <div className="col-span-3">
                      <label className="block text-stone-600 font-medium mb-0.5">Resmi Belge Başlığı</label>
                      <input
                        type="text"
                        value={doc.title || 'ÜÇÜNCÜ ŞAHISLAR TARAFINDAN VERİLECEK MUVAFAKATNAME ÖRNEĞİ'}
                        onChange={e => updateField('title', e.target.value)}
                        className="w-full p-2 bg-white border border-stone-300 rounded-md font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 font-medium mb-0.5">Ek Kodu</label>
                      <input
                        type="text"
                        value={doc.annexCode || doc.sgkDetails?.annexCode || 'Ek-9'}
                        onChange={e => {
                          updateField('annexCode', e.target.value);
                          updateSgk('annexCode', e.target.value);
                        }}
                        className="w-full p-2 bg-white border border-stone-300 rounded-md font-mono font-bold text-xs text-center"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-600 font-medium mb-0.5">Hitap Edilen Sosyal Güvenlik Müdürlüğü</label>
                    <input
                      type="text"
                      value={doc.institution}
                      onChange={e => updateField('institution', e.target.value)}
                      placeholder="Örn: İSTANBUL SOSYAL GÜVENLİK İL MÜDÜRLÜĞÜNE"
                      className="w-full p-2 bg-white border border-stone-300 rounded-md font-semibold text-xs"
                    />
                  </div>
                </div>

                {/* Kanuni Hukuki Cümle: Serbest veya Alan Bazlı Düzenleme */}
                <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase tracking-wider text-stone-800 text-[11px] block">
                      Kanuni Rıza ve Teminat Muvafakat Metni
                    </span>
                    <label className="flex items-center gap-1.5 cursor-pointer text-amber-900 bg-amber-100 px-2 py-0.5 rounded font-semibold text-[10px]">
                      <input
                        type="checkbox"
                        checked={doc.sgkDetails?.useCustomMainSentence || false}
                        onChange={e => {
                          const checked = e.target.checked;
                          if (checked && !doc.sgkDetails?.customMainSentence) {
                            const defaultSentence = `${doc.sgkDetails?.debtorName ? doc.sgkDetails.debtorName + "’nin" : "..................................’nin"} Sosyal Güvenlik Kurumuna olan ${doc.sgkDetails?.debtPeriod || "..............."} dönemi/ayına ilişkin ${doc.sgkDetails?.debtAmount ? doc.sgkDetails.debtAmount + " TL" : ".................................. TL"} tutarında ${doc.sgkDetails?.debtType || "........................."} borcuna ve bu borca bu tarihten ödenmesine kadar geçecek süre için işleyecek fer’ilerine karşılık aşağıda özellikleri yazılı ${doc.sgkDetails?.customPropertyTypeText || (doc.sgkDetails?.propertyType === 'menkul' ? 'menkul malı' : doc.sgkDetails?.propertyType === 'gayrimenkul' ? 'gayrimenkul malı' : 'menkul / gayrimenkul malı')} 6183 sayılı Kanunun 10 uncu maddesinin beşinci fıkrası gereğince teminat olarak gösteriyor ve söz konusu malların Sosyal Güvenlik Kurumu tarafından haczedilmesine muvafakat ediyorum. Bu konuda herhangi bir itirazda bulunmayacağımı beyan ve taahhüt ederim.`;
                            updateSgk('customMainSentence', defaultSentence);
                          }
                          updateSgk('useCustomMainSentence', checked);
                        }}
                        className="rounded text-amber-800 focus:ring-0"
                      />
                      <span>Serbest Metin Düzenleme</span>
                    </label>
                  </div>

                  {doc.sgkDetails?.useCustomMainSentence ? (
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-1.5 text-[11px] text-stone-600">
                        <span>Aşağıdaki metin belgede doğrudan görünecektir; her kelimeyi dilediğiniz gibi değiştirebilirsiniz:</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const officialImageSentence = "...................................’nin Sosyal Güvenlik Kurumuna olan.................dönemi/ayına ilişkin...................................... TL tutarında ......................... borcuna ve bu borca bu tarihten ödenmesine kadar geçecek süre için işleyecek fer’ilerine karşılık aşağıda özellikleri yazılı menkul /gayrimenkul malı 6183 sayılı Kanunun 10 uncu maddesinin beşinci fıkrası gereğince teminat olarak gösteriyor ve söz konusu malların Sosyal Güvenlik Kurumu tarafından haczedilmesine muvafakat ediyorum. Bu konuda herhangi bir itirazda bulunmayacağımı beyan ve taahhüt ederim.";
                              updateSgk('customMainSentence', officialImageSentence);
                            }}
                            className="text-blue-700 underline font-medium hover:text-blue-900"
                            title="Resimdeki birebir noktalı matbu SGK Ek-9 metnini yükle"
                          >
                            Resimdeki Orijinal Metni Yükle
                          </button>
                          <span className="text-stone-300">|</span>
                          <button
                            type="button"
                            onClick={() => {
                              const generated = `${doc.sgkDetails?.debtorName ? doc.sgkDetails.debtorName + "’nin" : "..................................’nin"} Sosyal Güvenlik Kurumuna olan ${doc.sgkDetails?.debtPeriod || "..............."} dönemi/ayına ilişkin ${doc.sgkDetails?.debtAmount ? doc.sgkDetails.debtAmount + " TL" : ".................................. TL"} tutarında ${doc.sgkDetails?.debtType || "........................."} borcuna ve bu borca bu tarihten ödenmesine kadar geçecek süre için işleyecek fer’ilerine karşılık aşağıda özellikleri yazılı ${doc.sgkDetails?.customPropertyTypeText || (doc.sgkDetails?.propertyType === 'menkul' ? 'menkul malı' : doc.sgkDetails?.propertyType === 'gayrimenkul' ? 'gayrimenkul malı' : 'menkul /gayrimenkul malı')} 6183 sayılı Kanunun 10 uncu maddesinin beşinci fıkrası gereğince teminat olarak gösteriyor ve söz konusu malların Sosyal Güvenlik Kurumu tarafından haczedilmesine muvafakat ediyorum. Bu konuda herhangi bir itirazda bulunmayacağımı beyan ve taahhüt ederim.`;
                              updateSgk('customMainSentence', generated);
                            }}
                            className="text-amber-800 underline font-medium hover:text-amber-950"
                          >
                            Alanlardan Üret
                          </button>
                        </div>
                      </div>
                      <textarea
                        rows={7}
                        value={doc.sgkDetails?.customMainSentence || ''}
                        onChange={e => updateSgk('customMainSentence', e.target.value)}
                        placeholder="Kanuni beyan ve muvafakat metnini dilediğiniz gibi yazınız..."
                        className="w-full p-2.5 bg-white border border-stone-300 rounded-md font-serif text-xs leading-relaxed text-stone-950 focus:ring-1 focus:ring-stone-900 outline-none"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2 bg-white p-3 rounded border border-stone-200 text-xs">
                      <div className="text-[11px] text-stone-500 mb-1">
                        Metin içindeki alanlar otomatik olarak canlı biçimlendirilir (boş bırakılan yerler noktalı hat olarak basılır):
                      </div>
                      <div className="p-2.5 bg-stone-50 border border-stone-200 rounded font-serif text-[12px] leading-relaxed text-stone-900">
                        <strong>{doc.sgkDetails?.debtorName ? doc.sgkDetails.debtorName + '’nin' : '..................................’nin'}</strong>{' '}
                        Sosyal Güvenlik Kurumuna olan{' '}
                        <strong>{doc.sgkDetails?.debtPeriod || '...............'}</strong> dönemi/ayına ilişkin{' '}
                        <strong>{doc.sgkDetails?.debtAmount ? doc.sgkDetails.debtAmount + ' TL' : '.................................. TL'}</strong> tutarında{' '}
                        <strong>{doc.sgkDetails?.debtType || '.........................'}</strong> borcuna ve bu borca bu tarihten ödenmesine kadar geçecek süre için işleyecek fer’ilerine karşılık aşağıda özellikleri yazılı{' '}
                        <strong className="text-amber-900 underline">
                          {doc.sgkDetails?.customPropertyTypeText ||
                            (doc.sgkDetails?.propertyType === 'menkul'
                              ? 'menkul malı'
                              : doc.sgkDetails?.propertyType === 'gayrimenkul'
                              ? 'gayrimenkul malı'
                              : 'menkul /gayrimenkul malı')}
                        </strong>{' '}
                        6183 sayılı Kanunun 10 uncu maddesinin beşinci fıkrası gereğince teminat olarak gösteriyor ve söz konusu malların Sosyal Güvenlik Kurumu tarafından haczedilmesine muvafakat ediyorum. Bu konuda herhangi bir itirazda bulunmayacağımı beyan ve taahhüt ederim.
                      </div>
                      <div className="pt-1 flex items-center justify-between text-[11px] text-stone-600">
                        <span>Bu metinde değişiklik yapmak isterseniz yukarıdaki <strong>"Serbest Metin Düzenleme"</strong> kutucuğunu işaretleyebilirsiniz.</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Boş Alan Serbest Metni / Açıklama / Ek Şerh */}
                <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase tracking-wider text-stone-800 text-[11px] block">
                      Boş Alan Serbest Metni / Ek Şerh & Not
                    </span>
                    <span className="text-[10px] text-stone-500 font-medium">İsteğe Bağlı</span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-snug">
                    Belgedeki adres/bilgiler ile alt icra imzaları arasındaki boş alana doğrudan A4 üzerinde tıklayarak veya buradan serbest ek açıklama, gayrimenkul şerhi ya da özel şart yazabilirsiniz. Boş bırakırsanız basılmaz.
                  </p>
                  <textarea
                    rows={3}
                    value={doc.sgkDetails?.customFreeText || ''}
                    onChange={e => updateSgk('customFreeText', e.target.value)}
                    placeholder="Örn: Teminat gösterilen taşınmaz üzerinde aile konutu şerhi bulunmamakta olup, borcun fer'ileriyle birlikte tahsiline muvafakat olunur..."
                    className="w-full p-2 bg-white border border-stone-300 rounded-md font-serif text-xs leading-relaxed text-stone-900 outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                    Konu (Resmi Başlık Satırı)
                  </label>
                  <input
                    type="text"
                    value={doc.subject}
                    onChange={e => updateField('subject', e.target.value)}
                    placeholder="Örn: 18 Yaşından Küçük Çocuğumuzun Yurt Dışı Seyahati ve Pasaport İzni"
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-900 outline-none font-medium"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-stone-700 font-semibold uppercase tracking-wider text-[11px]">
                      Hukuki Beyan ve Muvafakat Metni
                    </label>
                    <button
                      type="button"
                      onClick={onOpenPasteModal}
                      className="text-stone-600 hover:text-stone-900 underline font-medium"
                    >
                      Dışarıdan Metin Yapıştır
                    </button>
                  </div>
                  <textarea
                    rows={10}
                    value={doc.bodyText}
                    onChange={e => updateField('bodyText', e.target.value)}
                    placeholder="Muvafakat ve taahhüt beyanınızı bu alana yazın veya düzenleyin..."
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-md font-sans text-xs leading-relaxed focus:ring-1 focus:ring-stone-900 outline-none"
                  />
                </div>

                <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase tracking-wider text-stone-800 text-[11px]">
                      Ek Şartlar ve Maddeler ({doc.additionalClauses?.length || 0})
                    </span>
                    <button
                      type="button"
                      onClick={addClause}
                      className="px-2 py-1 bg-stone-900 text-white rounded text-[11px] font-medium flex items-center gap-1 hover:bg-stone-800"
                    >
                      <Plus className="w-3 h-3" />
                      Madde Ekle
                    </button>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {doc.additionalClauses?.map((clause, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="font-bold text-stone-500 w-4 text-right">{idx + 1}.</span>
                        <input
                          type="text"
                          value={clause}
                          onChange={e => updateClause(idx, e.target.value)}
                          className="flex-1 p-1.5 bg-white border border-stone-300 rounded-md text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => removeClause(idx)}
                          className="p-1.5 text-stone-400 hover:text-red-600 rounded transition-colors"
                          title="Maddeyi Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 3: DESIGN & A4 STYLING */}
        {activeTab === 'design' && (
          <div className="space-y-4 text-xs">
            {/* 1-Click Auto Fit */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Tek Sayfa A4 Sığdırma Kontrolü
                </div>
                <div className="text-[11px] text-emerald-800 mt-0.5">
                  Yazı boyutunu ve satır aralığını A4 sayfasına tam sığacak şekilde dengeler.
                </div>
              </div>
              <button
                type="button"
                onClick={onAutoFit}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-md text-[11px] shrink-0 transition-colors flex items-center gap-1 shadow-xs"
              >
                <Maximize2 className="w-3 h-3" />
                Otomatik Sığdır
              </button>
            </div>

            {/* Typography & Sizing */}
            <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 space-y-3">
              <span className="font-bold uppercase tracking-wider text-stone-800 text-[11px] block">
                Yazı Karakteri & Boyutları
              </span>

              {/* Font Family */}
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'serif', label: 'Resmi Serif (Times)' },
                  { id: 'garamond', label: 'Garamond (Hukuki)' },
                  { id: 'sans', label: 'Modern Sans' },
                ].map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => updateField('docFont', f.id as DocFont)}
                    className={`py-1.5 px-1.5 text-center rounded-md border text-[11px] transition-colors ${
                      doc.docFont === f.id
                        ? 'border-stone-900 bg-stone-900 text-white font-medium'
                        : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Font Size Slider */}
              <div>
                <div className="flex justify-between items-center text-stone-600 mb-1">
                  <span>Yazı Boyutu</span>
                  <span className="font-mono font-bold text-stone-900">{doc.fontSize} pt</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="16"
                  step="0.5"
                  value={doc.fontSize}
                  onChange={e => updateField('fontSize', parseFloat(e.target.value))}
                  className="w-full accent-stone-900 cursor-pointer"
                />
              </div>

              {/* Line Spacing */}
              <div>
                <div className="flex justify-between items-center text-stone-600 mb-1">
                  <span>Satır Aralığı</span>
                  <span className="font-mono font-bold text-stone-900">{doc.lineSpacing}</span>
                </div>
                <input
                  type="range"
                  min="1.3"
                  max="1.75"
                  step="0.05"
                  value={doc.lineSpacing}
                  onChange={e => updateField('lineSpacing', parseFloat(e.target.value))}
                  className="w-full accent-stone-900 cursor-pointer"
                />
              </div>
            </div>

            {/* Border Style */}
            <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 space-y-2">
              <span className="font-bold uppercase tracking-wider text-stone-800 text-[11px] block">
                Sayfa Kenarlık Stili
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'none', label: 'Çerçevesiz (SGK Ek-9 Standardı)' },
                  { id: 'classic-double', label: 'Klasik Noter (Çift Çizgi)' },
                  { id: 'thin-single', label: 'Tek İnce Çerçeve' },
                  { id: 'modern-corners', label: 'Modern Köşe İmleri' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => updateField('borderStyle', opt.id as BorderStyle)}
                    className={`py-2 px-2.5 text-left rounded-md border text-[11px] transition-colors ${
                      doc.borderStyle === opt.id
                        ? 'border-stone-900 bg-stone-900 text-white font-medium'
                        : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TEMPLATES SELECTOR */}
        {activeTab === 'templates' && (
          <div className="space-y-3 text-xs">
            <p className="text-stone-600 text-xs">
              Mevzuata ve resmi kurumlara uygun hazır standart şablonlardan birini seçebilirsiniz:
            </p>

            <div className="space-y-2">
              {OFFICIAL_TEMPLATES.map(tpl => (
                <div
                  key={tpl.id}
                  onClick={() => handleSelectTemplate(tpl.id)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    (tpl.id === 'sgk-ek9' && isSgkEk9) || (!isSgkEk9 && tpl.id === doc.id)
                      ? 'border-stone-900 bg-stone-100 shadow-xs'
                      : 'border-stone-200 hover:border-stone-800 bg-stone-50/50 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 flex items-center gap-1.5">
                      {tpl.id === 'sgk-ek9' && <FileCheck className="w-4 h-4 text-emerald-700" />}
                      {tpl.name}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 bg-stone-200 text-stone-700 rounded font-medium">
                      {tpl.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-1 leading-snug">
                    {tpl.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
