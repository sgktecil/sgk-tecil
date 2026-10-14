export interface TaksitItem {
  no: number;
  vadeTarihi: string;
  anaPara: number;
  kalanAnaPara: number;
  faiz: number;
  toplamTaksit: number;
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
