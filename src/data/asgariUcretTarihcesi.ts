export interface AsgariUcretDonemi {
  id: string;
  yil: number;
  donem: string; // örn: "01.01.2026 - Günümüz", "01.07.2000 - 31.12.2000"
  netTL: number;
  brutTL: number;
  netFormatli: string;
  brutFormatli: string;
  aciklama?: string;
  eskiTL?: string; // 2005 öncesi 6 sıfırlı tutar
}

// 2000 yılından günümüze (2026) Resmi Net ve Brüt Asgari Ücret Verileri
export const ASGARI_UCRET_TARIHCESI: AsgariUcretDonemi[] = [
  {
    id: '2026-1',
    yil: 2026,
    donem: '01.01.2026 - Günümüz',
    netTL: 28000.75,
    brutTL: 33030.00,
    netFormatli: '28.000,75 ₺',
    brutFormatli: '33.030,00 ₺',
    aciklama: 'Yürürlükteki güncel net asgari ücret'
  },
  {
    id: '2025-1',
    yil: 2025,
    donem: '01.01.2025 - 31.12.2025',
    netTL: 22104.67,
    brutTL: 26005.50,
    netFormatli: '22.104,67 ₺',
    brutFormatli: '26.005,50 ₺',
    aciklama: '2025 Yılı Tam Dönem'
  },
  {
    id: '2024-1',
    yil: 2024,
    donem: '01.01.2024 - 31.12.2024',
    netTL: 17002.12,
    brutTL: 20002.50,
    netFormatli: '17.002,12 ₺',
    brutFormatli: '20.002,50 ₺',
    aciklama: '2024 Yılı Tek Dönem'
  },
  {
    id: '2023-2',
    yil: 2023,
    donem: '01.07.2023 - 31.12.2023 (2. Dönem)',
    netTL: 11402.32,
    brutTL: 13414.50,
    netFormatli: '11.402,32 ₺',
    brutFormatli: '13.414,50 ₺',
    aciklama: '2023 Yıl Ortası Artışı'
  },
  {
    id: '2023-1',
    yil: 2023,
    donem: '01.01.2023 - 30.06.2023 (1. Dönem)',
    netTL: 8506.80,
    brutTL: 10008.00,
    netFormatli: '8.506,80 ₺',
    brutFormatli: '10.008,00 ₺',
    aciklama: '2023 Yıl Başı'
  },
  {
    id: '2022-2',
    yil: 2022,
    donem: '01.07.2022 - 31.12.2022 (2. Dönem)',
    netTL: 5500.35,
    brutTL: 6471.00,
    netFormatli: '5.500,35 ₺',
    brutFormatli: '6.471,00 ₺',
    aciklama: '2022 Ara Zam'
  },
  {
    id: '2022-1',
    yil: 2022,
    donem: '01.01.2022 - 30.06.2022 (1. Dönem)',
    netTL: 4253.40,
    brutTL: 5004.00,
    netFormatli: '4.253,40 ₺',
    brutFormatli: '5.004,00 ₺',
    aciklama: '2022 Yıl Başı (Asgari Ücret Vergi Muafiyeti Başlangıcı)'
  },
  {
    id: '2021-1',
    yil: 2021,
    donem: '01.01.2021 - 31.12.2021',
    netTL: 2825.90,
    brutTL: 3577.50,
    netFormatli: '2.825,90 ₺',
    brutFormatli: '3.577,50 ₺',
    aciklama: '2021 Yılı (AGİ Dahil)'
  },
  {
    id: '2020-1',
    yil: 2020,
    donem: '01.01.2020 - 31.12.2020',
    netTL: 2324.70,
    brutTL: 2943.00,
    netFormatli: '2.324,70 ₺',
    brutFormatli: '2.943,00 ₺',
    aciklama: '2020 Yılı (AGİ Dahil)'
  },
  {
    id: '2019-1',
    yil: 2019,
    donem: '01.01.2019 - 31.12.2019',
    netTL: 2020.90,
    brutTL: 2558.40,
    netFormatli: '2.020,90 ₺',
    brutFormatli: '2.558,40 ₺',
    aciklama: '2019 Yılı (AGİ Dahil)'
  },
  {
    id: '2018-1',
    yil: 2018,
    donem: '01.01.2018 - 31.12.2018',
    netTL: 1603.12,
    brutTL: 2029.50,
    netFormatli: '1.603,12 ₺',
    brutFormatli: '2.029,50 ₺',
    aciklama: '2018 Yılı (AGİ Dahil)'
  },
  {
    id: '2017-1',
    yil: 2017,
    donem: '01.01.2017 - 31.12.2017',
    netTL: 1404.06,
    brutTL: 1777.50,
    netFormatli: '1.404,06 ₺',
    brutFormatli: '1.777,50 ₺',
    aciklama: '2017 Yılı'
  },
  {
    id: '2016-1',
    yil: 2016,
    donem: '01.01.2016 - 31.12.2016',
    netTL: 1300.99,
    brutTL: 1647.00,
    netFormatli: '1.300,99 ₺',
    brutFormatli: '1.647,00 ₺',
    aciklama: '2016 Yılı (Net 1.300 TL Dönemi)'
  },
  {
    id: '2015-2',
    yil: 2015,
    donem: '01.07.2015 - 31.12.2015 (2. Dönem)',
    netTL: 1000.54,
    brutTL: 1273.50,
    netFormatli: '1.000,54 ₺',
    brutFormatli: '1.273,50 ₺',
    aciklama: '2015 Yılının İkinci Yarısı'
  },
  {
    id: '2015-1',
    yil: 2015,
    donem: '01.01.2015 - 30.06.2015 (1. Dönem)',
    netTL: 949.07,
    brutTL: 1201.50,
    netFormatli: '949,07 ₺',
    brutFormatli: '1.201,50 ₺',
    aciklama: '2015 Yılının İlk Yarısı'
  },
  {
    id: '2014-2',
    yil: 2014,
    donem: '01.07.2014 - 31.12.2014 (2. Dönem)',
    netTL: 891.03,
    brutTL: 1134.00,
    netFormatli: '891,03 ₺',
    brutFormatli: '1.134,00 ₺',
    aciklama: '2014 2. Dönem'
  },
  {
    id: '2014-1',
    yil: 2014,
    donem: '01.01.2014 - 30.06.2014 (1. Dönem)',
    netTL: 846.00,
    brutTL: 1071.00,
    netFormatli: '846,00 ₺',
    brutFormatli: '1.071,00 ₺',
    aciklama: '2014 1. Dönem'
  },
  {
    id: '2013-2',
    yil: 2013,
    donem: '01.07.2013 - 31.12.2013 (2. Dönem)',
    netTL: 803.68,
    brutTL: 1021.50,
    netFormatli: '803,68 ₺',
    brutFormatli: '1.021,50 ₺',
    aciklama: '2013 2. Dönem'
  },
  {
    id: '2013-1',
    yil: 2013,
    donem: '01.01.2013 - 30.06.2013 (1. Dönem)',
    netTL: 773.01,
    brutTL: 978.60,
    netFormatli: '773,01 ₺',
    brutFormatli: '978,60 ₺',
    aciklama: '2013 1. Dönem'
  },
  {
    id: '2012-2',
    yil: 2012,
    donem: '01.07.2012 - 31.12.2012 (2. Dönem)',
    netTL: 739.79,
    brutTL: 940.50,
    netFormatli: '739,79 ₺',
    brutFormatli: '940,50 ₺',
    aciklama: '2012 2. Dönem'
  },
  {
    id: '2012-1',
    yil: 2012,
    donem: '01.01.2012 - 30.06.2012 (1. Dönem)',
    netTL: 701.14,
    brutTL: 886.50,
    netFormatli: '701,14 ₺',
    brutFormatli: '886,50 ₺',
    aciklama: '2012 1. Dönem'
  },
  {
    id: '2011-2',
    yil: 2011,
    donem: '01.07.2011 - 31.12.2011 (2. Dönem)',
    netTL: 655.57,
    brutTL: 837.00,
    netFormatli: '655,57 ₺',
    brutFormatli: '837,00 ₺',
    aciklama: '2011 2. Dönem'
  },
  {
    id: '2011-1',
    yil: 2011,
    donem: '01.01.2011 - 30.06.2011 (1. Dönem)',
    netTL: 629.96,
    brutTL: 796.50,
    netFormatli: '629,96 ₺',
    brutFormatli: '796,50 ₺',
    aciklama: '2011 1. Dönem'
  },
  {
    id: '2010-2',
    yil: 2010,
    donem: '01.07.2010 - 31.12.2010 (2. Dönem)',
    netTL: 599.12,
    brutTL: 760.50,
    netFormatli: '599,12 ₺',
    brutFormatli: '760,50 ₺',
    aciklama: '2010 2. Dönem'
  },
  {
    id: '2010-1',
    yil: 2010,
    donem: '01.01.2010 - 30.06.2010 (1. Dönem)',
    netTL: 576.57,
    brutTL: 729.00,
    netFormatli: '576,57 ₺',
    brutFormatli: '729,00 ₺',
    aciklama: '2010 1. Dönem'
  },
  {
    id: '2009-2',
    yil: 2009,
    donem: '01.07.2009 - 31.12.2009 (2. Dönem)',
    netTL: 546.48,
    brutTL: 693.00,
    netFormatli: '546,48 ₺',
    brutFormatli: '693,00 ₺',
    aciklama: '2009 2. Dönem'
  },
  {
    id: '2009-1',
    yil: 2009,
    donem: '01.01.2009 - 30.06.2009 (1. Dönem)',
    netTL: 527.13,
    brutTL: 666.00,
    netFormatli: '527,13 ₺',
    brutFormatli: '666,00 ₺',
    aciklama: '2009 1. Dönem'
  },
  {
    id: '2008-2',
    yil: 2008,
    donem: '01.07.2008 - 31.12.2008 (2. Dönem)',
    netTL: 503.26,
    brutTL: 638.70,
    netFormatli: '503,26 ₺',
    brutFormatli: '638,70 ₺',
    aciklama: '2008 2. Dönem'
  },
  {
    id: '2008-1',
    yil: 2008,
    donem: '01.01.2008 - 30.06.2008 (1. Dönem)',
    netTL: 481.55,
    brutTL: 608.40,
    netFormatli: '481,55 ₺',
    brutFormatli: '608,40 ₺',
    aciklama: '2008 1. Dönem'
  },
  {
    id: '2007-2',
    yil: 2007,
    donem: '01.07.2007 - 31.12.2007 (2. Dönem)',
    netTL: 419.15,
    brutTL: 585.00,
    netFormatli: '419,15 ₺',
    brutFormatli: '585,00 ₺',
    aciklama: '2007 2. Dönem'
  },
  {
    id: '2007-1',
    yil: 2007,
    donem: '01.01.2007 - 30.06.2007 (1. Dönem)',
    netTL: 403.03,
    brutTL: 562.50,
    netFormatli: '403,03 ₺',
    brutFormatli: '562,50 ₺',
    aciklama: '2007 1. Dönem'
  },
  {
    id: '2006-1',
    yil: 2006,
    donem: '01.01.2006 - 31.12.2006',
    netTL: 380.46,
    brutTL: 531.00,
    netFormatli: '380,46 ₺',
    brutFormatli: '531,00 ₺',
    aciklama: '2006 Yılı'
  },
  {
    id: '2005-1',
    yil: 2005,
    donem: '01.01.2005 - 31.12.2005',
    netTL: 350.15,
    brutTL: 488.70,
    netFormatli: '350,15 YTL',
    brutFormatli: '488,70 YTL',
    aciklama: 'Yeni Türk Lirası (6 Sıfır Atıldı: 1 YTL = 1.000.000 TL)'
  },
  {
    id: '2004-2',
    yil: 2004,
    donem: '01.07.2004 - 31.12.2004 (2. Dönem)',
    netTL: 318.23,
    brutTL: 444.15,
    netFormatli: '318,23 ₺',
    brutFormatli: '444,15 ₺',
    eskiTL: 'Net: 318.233.743 TL | Brüt: 444.150.000 TL',
    aciklama: '6 sıfırlı eski TL karşılığı: 318,23 Milyon TL'
  },
  {
    id: '2004-1',
    yil: 2004,
    donem: '01.01.2004 - 30.06.2004 (1. Dönem)',
    netTL: 303.08,
    brutTL: 423.00,
    netFormatli: '303,08 ₺',
    brutFormatli: '423,00 ₺',
    eskiTL: 'Net: 303.079.500 TL | Brüt: 423.000.000 TL',
    aciklama: '6 sıfırlı eski TL karşılığı: 303,08 Milyon TL'
  },
  {
    id: '2003-1',
    yil: 2003,
    donem: '01.01.2003 - 31.12.2003',
    netTL: 226.00,
    brutTL: 306.00,
    netFormatli: '226,00 ₺',
    brutFormatli: '306,00 ₺',
    eskiTL: 'Net: 225.999.000 TL | Brüt: 306.000.000 TL',
    aciklama: '6 sıfırlı eski TL karşılığı: 226 Milyon TL'
  },
  {
    id: '2002-2',
    yil: 2002,
    donem: '01.07.2002 - 31.12.2002 (2. Dönem)',
    netTL: 184.25,
    brutTL: 250.88,
    netFormatli: '184,25 ₺',
    brutFormatli: '250,88 ₺',
    eskiTL: 'Net: 184.252.000 TL | Brüt: 250.875.000 TL',
    aciklama: '6 sıfırlı eski TL: 184,25 Milyon TL'
  },
  {
    id: '2002-1',
    yil: 2002,
    donem: '01.01.2002 - 30.06.2002 (1. Dönem)',
    netTL: 163.56,
    brutTL: 222.00,
    netFormatli: '163,56 ₺',
    brutFormatli: '222,00 ₺',
    eskiTL: 'Net: 163.563.000 TL | Brüt: 222.000.000 TL',
    aciklama: '6 sıfırlı eski TL: 163,56 Milyon TL'
  },
  {
    id: '2001-2',
    yil: 2001,
    donem: '01.07.2001 - 31.12.2001 (2. Dönem)',
    netTL: 122.19,
    brutTL: 167.94,
    netFormatli: '122,19 ₺',
    brutFormatli: '167,94 ₺',
    eskiTL: 'Net: 122.187.000 TL | Brüt: 167.940.000 TL',
    aciklama: '6 sıfırlı eski TL: 122,19 Milyon TL'
  },
  {
    id: '2001-1',
    yil: 2001,
    donem: '01.01.2001 - 30.06.2001 (1. Dönem)',
    netTL: 102.37,
    brutTL: 146.95,
    netFormatli: '102,37 ₺',
    brutFormatli: '146,95 ₺',
    eskiTL: 'Net: 102.369.000 TL | Brüt: 146.947.500 TL',
    aciklama: '6 sıfırlı eski TL: 102,37 Milyon TL'
  },
  {
    id: '2000-2',
    yil: 2000,
    donem: '01.07.2000 - 31.12.2000 (2. Dönem)',
    netTL: 86.92,
    brutTL: 118.80,
    netFormatli: '86,92 ₺',
    brutFormatli: '118,80 ₺',
    eskiTL: 'Net: 86.922.000 TL | Brüt: 118.800.000 TL',
    aciklama: '2000 Yılı 2. Yarı (Eski TL ile Net 86 Milyon 922 Bin TL)'
  },
  {
    id: '2000-1',
    yil: 2000,
    donem: '01.01.2000 - 30.06.2000 (1. Dönem)',
    netTL: 80.60,
    brutTL: 109.80,
    netFormatli: '80,60 ₺',
    brutFormatli: '109,80 ₺',
    eskiTL: 'Net: 80.598.000 TL | Brüt: 109.800.000 TL',
    aciklama: '2000 Yılı 1. Yarı (Eski TL ile Net 80 Milyon 598 Bin TL)'
  }
];
