export type MuvafakatnameKategori =
  | 'maas'
  | 'banka'
  | 'tasinmaz'
  | 'tasit'
  | 'taahhut'
  | 'genel';

export interface MuvafakatnameTemplate {
  id: string;
  baslik: string;
  kategori: MuvafakatnameKategori;
  aciklama: string;
  varsayilanKurum: string;
  varsayilanKonu: string;
  yasalDayanak: string;
  metin: string;
  imzaBaslik1: string;
  imzaBaslik2?: string;
}

export interface MuvafakatEdenBilgileri {
  adSoyad: string;
  tcknVkn: string;
  unvan?: string;
  sgkSicilNo?: string;
  adres: string;
  telefon?: string;
  gorevUnvan?: string;
  isyeriUnvan?: string;
}

export interface BelgeAyarlari {
  kurumAdi: string;
  altBirimAdi: string;
  evrakTarihi: string;
  evrakSayisi: string;
  konu: string;
  dosyaNo: string;
  borcTutari: string;
  hacizliMalBilgisi: string;
  amblemTuru: 'tc' | 'sgk' | 'adalet' | 'yok';
  yaziBoyutu: 'sm' | 'base' | 'lg';
  satirAraligi: 'normal' | 'genis' | 'sik';
  antetVarMi: boolean;
  tarihGoster: boolean;
  ikinciImzaVarMi: boolean;
}

export interface MuvafakatnameBelgeData {
  sablonId: string;
  baslik: string;
  ayarlar: BelgeAyarlari;
  borclu: MuvafakatEdenBilgileri;
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
}
