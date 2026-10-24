export type EmblemType = 'tc' | 'justice' | 'company' | 'none';
export type BorderStyle = 'classic-double' | 'thin-single' | 'modern-corners' | 'none';
export type DocFont = 'serif' | 'garamond' | 'sans';
export type SignatureLayout = 'single' | 'dual_parents' | 'grantor_grantee' | 'notary_block' | 'sgk_icra';

export interface PersonInfo {
  fullName: string;
  tcNumber: string;
  phone?: string;
  address?: string;
  relation?: string; // Anne, Baba, Vasi, Şirket Yetkilisi vb.
  birthDate?: string;
  title?: string; // Ünvanı
  taxNumber?: string; // Vergi Kimlik No
}

export interface SgkEk9Details {
  annexCode: string; // "Ek-9"
  debtorName: string; // Asıl borçlu şahıs / firma (örn: ABC LİMİTED ŞİRKETİ)
  debtPeriod: string; // Borç dönemi / ayı (örn: 2025/12 - 2026/05)
  debtAmount: string; // Tutar (örn: 450.000,00)
  debtType: string; // Borç türü (örn: Sigorta Primi ve İdari Para Cezası)
  propertyType: 'menkul' | 'gayrimenkul' | 'menkul / gayrimenkul' | 'custom'; // "menkul", "gayrimenkul", "menkul / gayrimenkul" veya özel
  customPropertyTypeText?: string; // Cümle içinde geçen mal ibaresi (örn: "menkul malı", "gayrimenkul malı", "menkul / gayrimenkul malı", "taşıt aracını" vb.)
  propertyDetails: string; // Teminat gösterilen malın detayları (Plaka, Ada/Parsel vb.)
  propertyDetailsTitle?: string; // Kutu başlığı örn: "Teminat Gösterilen Malın Özellikleri"

  // Serbest Cümle Düzenleme Modu (Kullanıcı kanuni cümleyi dilediği gibi kelime kelime düzenleyebilir)
  useCustomMainSentence?: boolean;
  customMainSentence?: string;

  // Gayrimenkul Eş Muvafakati (TMK m. 194 uyarınca eş rızası & imzası)
  includeSpouseConsent?: boolean;
  spouseFullName?: string;
  spouseTcNumber?: string;
  spouseTitle?: string; // "Malikin Eşi (TMK m.194 Eş Muvafakati)"
  spouseConsentText?: string; // Eş muvafakat beyan metni
  grantorTitleInBox?: string; // İmza kutusundaki başlık

  // İcra Memurları
  icraOfficer1Title?: string; // "İcra Memuru"
  icraOfficer1Name: string; // İcra Memuru Ad Soyad / Sicil
  icraOfficer2Title?: string; // "Sorumlu İcra Memuru"
  icraOfficer2Name: string; // Sorumlu İcra Memuru Ad Soyad / Sicil
  endorsementNote: string; // "Bu muvafakatname, huzurumuzda imza altına alınmıştır."

  // Boş / Noktalı Mod ve Çizgiler
  showBlankDots: boolean; // Doldurulmamış alanlarda ..................... çizgileri göster
  showPropertyBox?: boolean; // Teminat mal özellikleri kutusunu göster/gizle (Görsel formatında varsayılan kapalı veya isteğe bağlı açılabilir)
  dottedPropertyDetailsLines?: number; // Mal özellikleri boş ise kaç satır noktalı çizgi basılsın (1-4)
  customFreeText?: string; // Belgedeki boş alana (imzalar öncesi veya arası) serbestçe yazılacak ek not, taşınmaz şerhi veya açıklama
}

export interface MuvafakatnameDocument {
  id: string;
  templateType: 'standard' | 'sgk_ek9';
  title: string; // e.g. "ÜÇÜNCÜ ŞAHISLAR TARAFINDAN VERİLECEK MUVAFAKATNAME ÖRNEĞİ"
  subtitle?: string; // e.g. "6183 SAYILI KANUN 10/5 MADDESİ GEREĞİNCE"
  annexCode?: string; // "Ek-9"
  institution: string; // e.g. "İSTANBUL SOSYAL GÜVENLİK İL MÜDÜRLÜĞÜNE"
  documentNo: string; // e.g. "MVF-2026/041"
  date: string; // e.g. "21.10.2026"
  city: string; // e.g. "İstanbul"

  // SGK Ek-9 Özel Alanları
  sgkDetails?: SgkEk9Details;

  // Taraflar
  grantor: PersonInfo; // Muvafakat Veren 3. Şahıs (Maliki)
  grantor2: PersonInfo & { enabled: boolean }; // Varsa 2. Muvafakat Veren
  grantee: PersonInfo & { enabled: boolean; travelCountry?: string; travelDates?: string; companion?: string }; // İzin verilen / Çocuk / Yararlanıcı

  subject: string; // Konu
  bodyText: string; // Hukuki rıza ve taahhüt metni
  additionalClauses: string[]; // Ek özel şartlar / maddeler

  // Onay & İmza
  signatureLayout: SignatureLayout;
  includeNotaryNote: boolean;
  notaryNoteText: string;

  // Tasarım ve Biçimlendirme
  emblem: EmblemType;
  borderStyle: BorderStyle;
  docFont: DocFont;
  fontSize: number; // 12 - 16 pt
  lineSpacing: number; // 1.3 - 1.8
  showQrCode: boolean;
  showBarcode: boolean;
  showDocNo: boolean;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  data: Partial<MuvafakatnameDocument>;
}
