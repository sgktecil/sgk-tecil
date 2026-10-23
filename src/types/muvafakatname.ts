export type MuvafakatnameKategori =
  | 'ek9-sgk'
  | 'ek9-3sahis'
  | 'maas'
  | 'banka'
  | 'tasinmaz'
  | 'tasit'
  | 'taahhut'
  | 'genel';

export type TeminatTuru = 'gayrimenkul' | 'tasit' | 'banka' | 'maas' | 'diger';

export interface TeminatBilgisi {
  tur: TeminatTuru;
  // Taşınmaz detayları
  il?: string;
  ilce?: string;
  mahalleKoy?: string;
  ada?: string;
  parsel?: string;
  bagimsizBolum?: string;
  yuzolcumu?: string;
  nitelik?: string;
  tapuMaliki?: string;
  hisseOrani?: string;
  // Taşıt detayları
  plaka?: string;
  markaModel?: string;
  modelYili?: string;
  cinsi?: string;
  sasiNo?: string;
  motorNo?: string;
  ruhsatSahibi?: string;
  // Banka / Alacak
  bankaAdi?: string;
  iban?: string;
  hesapNo?: string;
  alacakTutari?: string;
  // Maaş / Ücret
  calistigiYer?: string;
  aylikNetUcret?: string;
  kesintiTutariOrani?: string;
  // Serbest açıklama
  aciklama?: string;
}

export interface MuvafakatnameTemplate {
  id: string;
  baslik: string;
  formKodu?: string; // örn: "EK-9"
  kategori: MuvafakatnameKategori;
  aciklama: string;
  varsayilanKurum: string;
  varsayilanAltBirim?: string;
  varsayilanKonu: string;
  yasalDayanak: string;
  metin: string;
  teminatVarsayilan?: TeminatBilgisi;
  imzaBaslik1: string;
  imzaBaslik2?: string;
  huzurdaImzaVarMi?: boolean;
}

export interface MuvafakatEdenBilgileri {
  sifat: 'borclu' | 'ucuncu_sahis' | 'kefil' | 'sirket_yetkilisi';
  adSoyad: string;
  tcknVkn: string;
  unvan?: string;
  sgkSicilNo?: string;
  adres: string;
  telefon?: string;
  gorevUnvan?: string;
  isyeriUnvan?: string;
}

export interface AsilBorcluBilgileri {
  unvan: string;
  tcknVkn: string;
  sgkSicilNo: string;
  adres: string;
  borcDonemi: string;
  borcTutari: string;
  takipNo: string;
}

export interface BelgeAyarlari {
  formKodu: string; // "EK-9" vb.
  formKoduGoster: boolean;
  kurumAdi: string;
  altBirimAdi: string;
  evrakTarihi: string;
  evrakSayisi: string;
  konu: string;
  dosyaNo: string;
  borcTutari: string;
  borcDonemi: string;
  amblemTuru: 'tc' | 'sgk' | 'adalet' | 'yok';
  yaziTipi: 'serif' | 'sans';
  yaziBoyutu: 'sm' | 'base' | 'lg';
  satirAraligi: 'sik' | 'normal' | 'genis';
  antetVarMi: boolean;
  tarihGoster: boolean;
  ikinciImzaVarMi: boolean;
  huzurdaImzaZaptiVarMi: boolean;
  teminatTablosuGoster: boolean;
}

export interface SGKIcraMemurlari {
  icraMemuru: {
    adSoyad: string;
    sicilNo: string;
    unvan: string;
  };
  sorumluMemur: {
    adSoyad: string;
    sicilNo: string;
    unvan: string;
  };
}

export interface MuvafakatnameBelgeData {
  sablonId: string;
  baslik: string;
  ayarlar: BelgeAyarlari;
  borclu: MuvafakatEdenBilgileri; // Muvafakat veren kişi/kurum
  asilBorclu?: AsilBorcluBilgileri; // 3. şahıs muvafakatinde asıl borçlu
  teminat: TeminatBilgisi;
  metin: string;
  ekNotlar?: string;
  imzalayan1: {
    adSoyad: string;
    unvan: string;
  };
  imzalayan2?: {
    adSoyad: string;
    unvan: string;
  };
  sgkZapti?: SGKIcraMemurlari;
}
