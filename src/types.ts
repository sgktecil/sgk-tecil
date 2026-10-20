export interface TaksitItem {
  no: number | string;
  vadeTarihi: string;
  gunSayisi?: number;
  ayNo?: number;
  anaPara: number;
  kalanAnaPara: number;
  faiz: number;
  toplamTaksit: number;
  isPesinat?: boolean;
}

export interface HesaplamaSonucu {
  anaPara: number;
  pesinat: number;
  kalanBorc: number;
  taksitSayisi: number;
  faizOrani: number;
  toplamFaiz: number;
  toplamOdeme: number;
  aylikSabitTaksit: number;
  ilkTaksitTutari: number;
  sonTaksitTutari: number;
  planTipi?: 'kanuni' | 'esit';
  taksitler: TaksitItem[];
}

export interface Banka {
  c: string; // Kod
  n: string; // Ad
  v: string; // VKN
  k: string; // KEP
  d: string; // DETSİS
  a: string; // Adres
  t: string; // Telefon
}
