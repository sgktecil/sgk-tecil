// SGK Resmî Formları İçin Gelişmiş, Akıllı ve Kelimeyle Tamamlayıcı Ayrıştırma Motoru
// 6183 sayılı Kanun 48. Madde Kapsamında Ek-1 ve Ek-1/b Formları İçin Optimize Edilmiştir

export const TURKISH_PROVINCES = [
  'ADANA', 'ADIYAMAN', 'AFYONKARAHİSAR', 'AĞRI', 'AKSARAY', 'AMASYA', 'ANKARA', 'ANTALYA', 
  'ARDAHAN', 'ARTVİN', 'AYDIN', 'BALIKESİR', 'BARTIN', 'BATMAN', 'BAYBURT', 'BİLECİK', 
  'BİNGÖL', 'BİTLİS', 'BOLU', 'BURDUR', 'BURSA', 'ÇANAKKALE', 'ÇANKIRI', 'ÇORUM', 
  'DENİZLİ', 'DİYARBAKIR', 'DÜZCE', 'EDİRNE', 'ELAZIĞ', 'ERZİNCAN', 'ERZURUM', 'ESKİŞEHİR', 
  'GAZİANTEP', 'GİRESUN', 'GÜMÜŞHANE', 'HAKKARİ', 'HATAY', 'IĞDIR', 'ISPARTA', 'İSTANBUL', 
  'İZMİR', 'KAHRAMANMARAŞ', 'KARABÜK', 'KARAMAN', 'KARS', 'KASTAMONU', 'KAYSERİ', 'KIRIKKALE', 
  'KIRKLARELİ', 'KIRŞEHİR', 'KİLİS', 'KOCAELİ', 'KONYA', 'KÜTAHYA', 'MALATYA', 'MANİSA', 
  'MARDİN', 'MERSİN', 'MUĞLA', 'MUŞ', 'NEVŞEHİR', 'NİĞDE', 'ORDU', 'OSMANİYE', 'RİZE', 
  'SAKARYA', 'SAMSUN', 'SİİRT', 'SİNOP', 'SİVAS', 'ŞANLIURFA', 'ŞIRNAK', 'TEKİRDAĞ', 
  'TOKAT', 'TRABZON', 'TUNCELİ', 'UŞAK', 'VAN', 'YALOVA', 'YOZGAT', 'ZONGULDAK'
];

export const PLAKA_IL_MAP: Record<string, string> = {
  '01': 'ADANA', '02': 'ADIYAMAN', '03': 'AFYONKARAHİSAR', '04': 'AĞRI', '05': 'AMASYA',
  '06': 'ANKARA', '07': 'ANTALYA', '08': 'ARTVİN', '09': 'AYDIN', '10': 'BALIKESİR',
  '11': 'BİLECİK', '12': 'BİNGÖL', '13': 'BİTLİS', '14': 'BOLU', '15': 'BURDUR',
  '16': 'BURSA', '17': 'ÇANAKKALE', '18': 'ÇANKIRI', '19': 'ÇORUM', '20': 'DENİZLİ',
  '21': 'DİYARBAKIR', '22': 'EDİRNE', '23': 'ELAZIĞ', '24': 'ERZİNCAN', '25': 'ERZURUM',
  '26': 'ESKİŞEHİR', '27': 'GAZİANTEP', '28': 'GİRESUN', '29': 'GÜMÜŞHANE', '30': 'HAKKARİ',
  '31': 'HATAY', '32': 'ISPARTA', '33': 'MERSİN', '34': 'İSTANBUL', '35': 'İZMİR',
  '36': 'KARS', '37': 'KASTAMONU', '38': 'KAYSERİ', '39': 'KIRKLARELİ', '40': 'KIRŞEHİR',
  '41': 'KOCAELİ', '42': 'KONYA', '43': 'KÜTAHYA', '44': 'MALATYA', '45': 'MANİSA',
  '46': 'KAHRAMANMARAŞ', '47': 'MARDİN', '48': 'MUĞLA', '49': 'MUŞ', '50': 'NEVŞEHİR',
  '51': 'NİĞDE', '52': 'ORDU', '53': 'RİZE', '54': 'SAKARYA', '55': 'SAMSUN',
  '56': 'SİİRT', '57': 'SİNOP', '58': 'SİVAS', '59': 'TEKİRDAĞ', '60': 'TOKAT',
  '61': 'TRABZON', '62': 'TUNCELİ', '63': 'ŞANLIURFA', '64': 'UŞAK', '65': 'VAN',
  '66': 'YOZGAT', '67': 'ZONGULDAK', '68': 'AKSARAY', '69': 'BAYBURT', '70': 'KARAMAN',
  '71': 'KIRIKKALE', '72': 'BATMAN', '73': 'ŞIRNAK', '74': 'BARTIN', '75': 'ARDAHAN',
  '76': 'IĞDIR', '77': 'YALOVA', '78': 'KARABÜK', '79': 'KİLİS', '80': 'OSMANİYE',
  '81': 'DÜZCE'
};

// Türkiye Geneli İlçe -> İl Sözlüğü (Kelimeyle Tamamlayıcı Eşleme İçin)
export const TURKISH_DISTRICTS_MAP: Record<string, string> = {
  // ORDU
  'ALTINORDU': 'ORDU', 'ÜNYE': 'ORDU', 'UNYE': 'ORDU', 'FATSA': 'ORDU', 'GÜLYALI': 'ORDU', 'PERŞEMBE': 'ORDU',
  'KUMRU': 'ORDU', 'KORGAN': 'ORDU', 'AYBASTI': 'ORDU', 'GÖLKÖY': 'ORDU', 'GOLKOY': 'ORDU', 'MESUDİYE': 'ORDU', 'MESUDIYE': 'ORDU',
  'AKKUŞ': 'ORDU', 'AKKUS': 'ORDU', 'ULUBEY': 'ORDU', 'İKİZCE': 'ORDU', 'IKIZCE': 'ORDU', 'ÇAMAŞ': 'ORDU', 'CAMAS': 'ORDU',
  'ÇATALPINAR': 'ORDU', 'CATALPINAR': 'ORDU', 'ÇAYBAŞI': 'ORDU', 'CAYBASI': 'ORDU', 'GÜRGENTEPE': 'ORDU', 'GURGENTEPE': 'ORDU', 'KABATAŞ': 'ORDU', 'KABATAS': 'ORDU',

  // İSTANBUL
  'KADIKÖY': 'İSTANBUL', 'BEŞİKTAŞ': 'İSTANBUL', 'ŞİŞLİ': 'İSTANBUL', 'BAKIRKÖY': 'İSTANBUL',
  'ÜSKÜDAR': 'İSTANBUL', 'FATİH': 'İSTANBUL', 'BEYOĞLU': 'İSTANBUL', 'ÜMRANİYE': 'İSTANBUL',
  'PENDİK': 'İSTANBUL', 'KARTAL': 'İSTANBUL', 'MALTEPE': 'İSTANBUL', 'TUZLA': 'İSTANBUL',
  'ESENYURT': 'İSTANBUL', 'BAĞCILAR': 'İSTANBUL', 'KÜÇÜKÇEKMECE': 'İSTANBUL', 'BÜYÜKÇEKMECE': 'İSTANBUL',
  'BAŞAKŞEHİR': 'İSTANBUL', 'BEYLİKDÜZÜ': 'İSTANBUL', 'AVCILAR': 'İSTANBUL', 'BAHÇELİEVLER': 'İSTANBUL',
  'ZEYTİNBURNU': 'İSTANBUL', 'GÜNGÖREN': 'İSTANBUL', 'BAYRAMPAŞA': 'İSTANBUL', 'ESENLER': 'İSTANBUL',
  'GAZİOSMANPAŞA': 'İSTANBUL', 'SULTANGAZİ': 'İSTANBUL', 'EYÜP': 'İSTANBUL', 'EYÜPSULTAN': 'İSTANBUL',
  'SARIYER': 'İSTANBUL', 'BEYKOZ': 'İSTANBUL', 'ÇEKMEKÖY': 'İSTANBUL', 'SANCAKTEPE': 'İSTANBUL',
  'SULTANBEYLİ': 'İSTANBUL', 'ŞİLE': 'İSTANBUL', 'SİLİVRİ': 'İSTANBUL', 'ÇATALCA': 'İSTANBUL',
  'ADALAR': 'İSTANBUL', 'ARNAVUTKÖY': 'İSTANBUL', 'ATAŞEHİR': 'İSTANBUL', 'KAĞITHANE': 'İSTANBUL',

  // ANKARA
  'ÇANKAYA': 'ANKARA', 'KEÇİÖREN': 'ANKARA', 'YENİMAHALLE': 'ANKARA', 'MAMAK': 'ANKARA',
  'ETİMESGUT': 'ANKARA', 'SİNCAN': 'ANKARA', 'ALTINDAĞ': 'ANKARA', 'PURSAKLAR': 'ANKARA',
  'GÖLBAŞI': 'ANKARA', 'POLATLI': 'ANKARA', 'ÇUBUK': 'ANKARA', 'KAHRAMANKAZAN': 'ANKARA',
  'BEYPAZARI': 'ANKARA', 'ELMADAĞ': 'ANKARA', 'ŞEREFLİKOÇHİSAR': 'ANKARA', 'AKYURT': 'ANKARA',
  'HAYMANA': 'ANKARA', 'AYAŞ': 'ANKARA', 'KIZILCAHAMAM': 'ANKARA', 'NALLIHAN': 'ANKARA',

  // İZMİR
  'KONAK': 'İZMİR', 'BORNOVA': 'İZMİR', 'BUCA': 'İZMİR', 'KARŞIYAKA': 'İZMİR',
  'BAYRAKLI': 'İZMİR', 'ÇİĞLİ': 'İZMİR', 'KARABAĞLAR': 'İZMİR', 'GAZİEMİR': 'İZMİR',
  'TORBALI': 'İZMİR', 'MENEMEN': 'İZMİR', 'ALİAĞA': 'İZMİR', 'BERGAMA': 'İZMİR',
  'ÖDEMİŞ': 'İZMİR', 'KEMALPAŞA': 'İZMİR', 'MENDERES': 'İZMİR', 'TİRE': 'İZMİR',
  'BALÇOVA': 'İZMİR', 'NARLIDERE': 'İZMİR', 'URLA': 'İZMİR', 'ÇEŞME': 'İZMİR',
  'SEFERİHİSAR': 'İZMİR', 'DİKİLİ': 'İZMİR', 'FOÇA': 'İZMİR', 'SELÇUK': 'İZMİR',

  // BURSA
  'OSMANGAZİ': 'BURSA', 'NİLÜFER': 'BURSA', 'YILDIRIM': 'BURSA', 'İNEGÖL': 'BURSA',
  'GEMLİK': 'BURSA', 'MUDANYA': 'BURSA', 'GÜRSU': 'BURSA', 'KESTEL': 'BURSA',
  'MUSTAFAKEMALPAŞA': 'BURSA', 'KARACABEY': 'BURSA', 'ORHANGAZİ': 'BURSA', 'BURSA YENİŞEHİR': 'BURSA',

  // ANTALYA
  'MURATPAŞA': 'ANTALYA', 'KEPEZ': 'ANTALYA', 'KONYAALTI': 'ANTALYA', 'ALANYA': 'ANTALYA',
  'MANAVGAT': 'ANTALYA', 'SERİK': 'ANTALYA', 'AKSU': 'ANTALYA', 'DÖŞEMEALTI': 'ANTALYA',
  'KUMLUCA': 'ANTALYA', 'KAŞ': 'ANTALYA', 'KORKUTELİ': 'ANTALYA', 'GAZİPAŞA': 'ANTALYA',
  'FİNİKE': 'ANTALYA', 'KEMER': 'ANTALYA', 'ELMALI': 'ANTALYA', 'DEMRE': 'ANTALYA',

  // KOCAELİ
  'İZMİT': 'KOCAELİ', 'GEBZE': 'KOCAELİ', 'DARICA': 'KOCAELİ', 'GÖLCÜK': 'KOCAELİ',
  'KÖRFEZ': 'KOCAELİ', 'DERİNCE': 'KOCAELİ', 'ÇAYIROVA': 'KOCAELİ', 'KARTEPE': 'KOCAELİ',
  'BAŞİSKELE': 'KOCAELİ', 'KARAMÜRSEL': 'KOCAELİ', 'KANDIRA': 'KOCAELİ', 'DİLOVASI': 'KOCAELİ',

  // ADANA
  'SEYHAN': 'ADANA', 'YÜREĞİR': 'ADANA', 'ÇUKUROVA': 'ADANA', 'SARIÇAM': 'ADANA',
  'CEYHAN': 'ADANA', 'KOZAN': 'ADANA', 'İMAMOĞLU': 'ADANA', 'KARATAŞ': 'ADANA',

  // GAZİANTEP
  'ŞAHİNBEY': 'GAZİANTEP', 'ŞEHİTKAMİL': 'GAZİANTEP', 'NİZİP': 'GAZİANTEP', 'İSLAHİYE': 'GAZİANTEP',

  // KONYA
  'SELÇUKLU': 'KONYA', 'MERAM': 'KONYA', 'KARATAY': 'KONYA', 'KONYA EREĞLİ': 'KONYA',
  'AKŞEHİR': 'KONYA', 'BEYŞEHİR': 'KONYA', 'CİHANBEYLİ': 'KONYA', 'KULU': 'KONYA',

  // SAMSUN
  'İLKADIM': 'SAMSUN', 'ATAKUM': 'SAMSUN', 'CANİK': 'SAMSUN', 'BAFRA': 'SAMSUN',
  'ÇARŞAMBA': 'SAMSUN', 'VEZİRKÖPRÜ': 'SAMSUN', 'TEKKEKÖY': 'SAMSUN', 'TERME': 'SAMSUN',
  'HAVZA': 'SAMSUN', 'ONDOKUZMAYIS': 'SAMSUN', 'ALACAM': 'SAMSUN',

  // TRABZON
  'ORTAHİSAR': 'TRABZON', 'AKÇAABAT': 'TRABZON', 'ARAKLI': 'TRABZON', 'OF': 'TRABZON',
  'YOMRA': 'TRABZON', 'ARSİN': 'TRABZON', 'VAKFIKEBİR': 'TRABZON', 'SÜRMENE': 'TRABZON',

  // TEKİRDAĞ
  'SÜLEYMANPAŞA': 'TEKİRDAĞ', 'ÇORLU': 'TEKİRDAĞ', 'ÇERKEZKÖY': 'TEKİRDAĞ', 'KAPAKLI': 'TEKİRDAĞ',
  'ERGENE': 'TEKİRDAĞ', 'MALKARA': 'TEKİRDAĞ', 'SARAY': 'TEKİRDAĞ', 'HAYRABOLU': 'TEKİRDAĞ',

  // KAYSERİ
  'MELİKGAZİ': 'KAYSERİ', 'KOCASİNAN': 'KAYSERİ', 'TALAS': 'KAYSERİ', 'DEVELİ': 'KAYSERİ',

  // ESKİŞEHİR
  'ODUNPAZARI': 'ESKİŞEHİR', 'TEPEBAŞI': 'ESKİŞEHİR', 'SİVRİHİSAR': 'ESKİŞEHİR',

  // DENİZLİ
  'PAMUKKALE': 'DENİZLİ', 'MERKEZEFENDİ': 'DENİZLİ', 'ÇİVRİL': 'DENİZLİ', 'ACIPAYAM': 'DENİZLİ',

  // AYDIN
  'EFELER': 'AYDIN', 'NAZİLLİ': 'AYDIN', 'SÖKE': 'AYDIN', 'KUŞADASI': 'AYDIN', 'DİDİM': 'AYDIN',

  // BALIKESİR
  'KARESİ': 'BALIKESİR', 'ALTIEYLÜL': 'BALIKESİR', 'BANDIRMA': 'BALIKESİR', 'EDREMİT': 'BALIKESİR',
  'GÖNEN': 'BALIKESİR', 'AYVALIK': 'BALIKESİR', 'BURHANİYE': 'BALIKESİR',

  // MUĞLA
  'BODRUM': 'MUĞLA', 'FETHİYE': 'MUĞLA', 'MİLAS': 'MUĞLA', 'MENTEŞE': 'MUĞLA',
  'MARMARİS': 'MUĞLA', 'SEYDİKEMER': 'MUĞLA', 'ORTACA': 'MUĞLA', 'DALAMAN': 'MUĞLA',

  // SAKARYA
  'ADAPAZARI': 'SAKARYA', 'SERDİVAN': 'SAKARYA', 'AKYAZI': 'SAKARYA', 'ERENLER': 'SAKARYA',
  'HENDEK': 'SAKARYA', 'KARASU': 'SAKARYA', 'GEYVE': 'SAKARYA',

  // HATAY
  'ANTAKYA': 'HATAY', 'İSKENDERUN': 'HATAY', 'DEFNE': 'HATAY', 'DÖRTYOL': 'HATAY', 'SAMANDAĞ': 'HATAY',

  // MERSİN
  'AKDENİZ': 'MERSİN', 'TOROSLAR': 'MERSİN', 'YENİŞEHİR': 'MERSİN', 'MEZİTLİ': 'MERSİN',
  'TARSUS': 'MERSİN', 'ERDEMLİ': 'MERSİN', 'SİLİFKE': 'MERSİN',

  // MANİSA
  'YUNUSEMRE': 'MANİSA', 'ŞEHZADELER': 'MANİSA', 'AKHİSAR': 'MANİSA', 'TURGUTLU': 'MANİSA', 'SALİHLİ': 'MANİSA',

  // MALATYA
  'BATTALGAZİ': 'MALATYA', 'YEŞİLYURT': 'MALATYA',

  // KAHRAMANMARAŞ
  'ONİKİŞUBAT': 'KAHRAMANMARAŞ', 'DULKADİROĞLU': 'KAHRAMANMARAŞ', 'ELBİSTAN': 'KAHRAMANMARAŞ',

  // ŞANLIURFA
  'EYYÜBİYE': 'ŞANLIURFA', 'HALİLİYE': 'ŞANLIURFA', 'KARAKÖPRÜ': 'ŞANLIURFA', 'SİVEREK': 'ŞANLIURFA',

  // DİYARBAKIR
  'BAĞLAR': 'DİYARBAKIR', 'KAYAPINAR': 'DİYARBAKIR', 'DİYARBAKIR YENİŞEHİR': 'DİYARBAKIR', 'SUR': 'DİYARBAKIR',

  // ERZURUM
  'YAKUTİYE': 'ERZURUM', 'PALANDÖKEN': 'ERZURUM', 'AZİZİYE': 'ERZURUM',

  // VAN
  'İPEKYOLU': 'VAN', 'TUŞBA': 'VAN', 'VAN EDREMİT': 'VAN', 'ERCİŞ': 'VAN',

  // ZONGULDAK
  'EREĞLİ': 'ZONGULDAK', 'KDZ EREĞLİ': 'ZONGULDAK', 'ÇAYCUMA': 'ZONGULDAK', 'DEVREK': 'ZONGULDAK', 'KOZLU': 'ZONGULDAK',

  // GİRESUN
  'BULANCAK': 'GİRESUN', 'ESPİYE': 'GİRESUN', 'GÖRELE': 'GİRESUN', 'TİREBOLU': 'GİRESUN',

  // RİZE
  'ÇAYELİ': 'RİZE', 'ARDEŞEN': 'RİZE', 'PAZAR': 'RİZE', 'FINDIKLI': 'RİZE'
};

// 1. İl İsmini Temizleme & Standartlaştırma (Sadece geçerli 81 ilden birini döndürür)
export function cleanIlName(raw: string): string {
  if (!raw) return '';
  let str = raw.toLocaleUpperCase('tr-TR').trim();
  str = str
    .replace(/T\.?C\.?/g, '')
    .replace(/SOSYAL\s+GÜVENLİK\s+KURUMU\s+(?:BAŞKANLIĞI)?/g, '')
    .replace(/SOSYAL\s+GÜVENLİK\s+İL\s+MÜDÜRLÜĞ[ÜU](?:'?[Nn][Ee])?/g, '')
    .replace(/İL\s+MÜDÜRLÜĞ[ÜU](?:'?[Nn][Ee])?/g, '')
    .replace(/SGİM/g, '')
    .replace(/[:=\-\t\n\r/]+/g, ' ')
    .trim();

  // 1. 81 il listesinde birebir veya sınır kelime ara
  for (const prov of TURKISH_PROVINCES) {
    const reg = new RegExp(`\\b${prov}\\b`, 'i');
    if (reg.test(str)) {
      return prov;
    }
  }

  // 2. Metin içinde ilçe adı geçiyorsa (Örn: "ALTINORDU"), bağlı olduğu ili döndür
  for (const [district, parentProvince] of Object.entries(TURKISH_DISTRICTS_MAP)) {
    const reg = new RegExp(`\\b${district}\\b`, 'i');
    if (reg.test(str)) {
      return parentProvince;
    }
  }

  // 3. Kod içindeki plaka kodunu ara (Örn: "520101" -> 52 -> "ORDU")
  const mPlate = str.match(/\b([0-8]\d)(?:01\d{2}|\d{4})?\b/);
  if (mPlate && PLAKA_IL_MAP[mPlate[1]]) {
    return PLAKA_IL_MAP[mPlate[1]];
  }

  return '';
}

// 2. Sosyal Güvenlik Merkezi (SGM) İsmini Temizleme & Standartlaştırma (Yalnızca SGM/İlçe Adını Döndürür)
export function cleanSgmName(raw: string, detectedIl?: string): string {
  if (!raw) return '';
  let str = raw.toLocaleUpperCase('tr-TR').trim();

  // MOSİP etiketlerini temizle
  str = str
    .replace(/SGM\s*KODU?[-–\s]*AD\s*[:=\t]*/gi, ' ')
    .replace(/İLÇE\s*KODU?[-–\s]*AD\s*[:=\t]*/gi, ' ')
    .replace(/İL\s*KODU?[-–\s]*AD\s*[:=\t]*/gi, ' ')
    .replace(/T\.?C\.?/g, '')
    .replace(/SOSYAL\s+GÜVENLİK\s+MERKEZ[İI](?:'?[Nn][Ee])?/gi, ' ')
    .replace(/MERKEZ\s+MÜDÜRLÜĞ[ÜU](?:'?[Nn][Ee])?/gi, ' ')
    .replace(/\bS\.?G\.?M\.?\b/gi, ' ')
    .replace(/\bSGK\b/gi, ' ')
    .replace(/\bKODU?\b/gi, ' ')
    .replace(/\bİLÇE\b/gi, ' ')
    .replace(/\bILCE\b/gi, ' ')
    .replace(/\bAD\b/gi, ' ')
    .replace(/\b\d{4,8}\b/g, ' ') // 520101 gibi kodları temizle
    .replace(/\b\d{1,3}\s*[-–/.]\s*/g, ' ') // 21-, 11-, 01- temizle
    .replace(/[:=\-\t\n\r/]+/g, ' ')
    .trim();

  // Kullanıcı kesin kuralı: İl Ordu ise Sosyal Güvenlik Merkezi her zaman ALTINORDU olmalıdır
  if (detectedIl && detectedIl.toLocaleUpperCase('tr-TR').trim() === 'ORDU') {
    return 'ALTINORDU';
  }

  // 1. Bilinen ilçe haritasında birebir veya kelime olarak var mı kontrol et (Örn: "ÜNYE", "ALTINORDU", "FATSA")
  for (const district of Object.keys(TURKISH_DISTRICTS_MAP)) {
    const reg = new RegExp(`\\b${district}\\b`, 'i');
    if (reg.test(str)) {
      if (TURKISH_DISTRICTS_MAP[district] === 'ORDU') {
        return 'ALTINORDU';
      }
      return district;
    }
  }

  // 2. Eğer il adı da geçiyorsa (Örn: "ORDU ALTINORDU"), ilçeyi izole etmek için ili temizle
  if (detectedIl) {
    const ilReg = new RegExp(`\\b${detectedIl}\\b`, 'gi');
    const withoutIl = str.replace(ilReg, '').trim();
    if (withoutIl.length >= 3) {
      for (const district of Object.keys(TURKISH_DISTRICTS_MAP)) {
        const reg = new RegExp(`\\b${district}\\b`, 'i');
        if (reg.test(withoutIl)) {
          if (TURKISH_DISTRICTS_MAP[district] === 'ORDU') {
            return 'ALTINORDU';
          }
          return district;
        }
      }
      str = withoutIl;
    }
  }

  const words = str.split(/\s+/).filter((w) => w.length > 1 && !/^(NO|KOD|KODU|AD|MERKEZ|SGK|SGM|İLÇE|ILCE)$/i.test(w));
  return words.join(' ').trim();
}

// 3. SGK Sicil No Blok Formatlama & Kelimeyle Tamamlama
// Örn: 24324010110557060522030000001 -> 2 4324 01 01 1055706 052 20-30 000 001
// Örn: 2 9313 01 01 1088448 052 20-83 000 001
export function formatSgkSicilNo(raw: string): string {
  if (!raw) return '';
  const digits = raw.replace(/[^\d]/g, '');
  
  // 29 haneli tam SGK işyeri sicil numarası
  if (digits.length === 29) {
    const mahiyet = digits.slice(0, 1);
    const iskolu = digits.slice(1, 5);
    const il = digits.slice(5, 7);
    const ilce = digits.slice(7, 9);
    const sira = digits.slice(9, 16);
    const ilKod3 = digits.slice(16, 19);
    const kontrol = digits.slice(19, 21) + '-' + digits.slice(21, 23);
    const araci = digits.slice(23, 26);
    const altIsveren = digits.slice(26, 29);
    return `${mahiyet} ${iskolu} ${il} ${ilce} ${sira} ${ilKod3} ${kontrol} ${araci} ${altIsveren}`;
  }

  // 26 haneli tam SGK işyeri sicil numarası
  if (digits.length === 26) {
    const mahiyet = digits.slice(0, 1);
    const iskolu = digits.slice(1, 5);
    const il = digits.slice(5, 7);
    const ilce = digits.slice(7, 9);
    const sira = digits.slice(9, 16);
    const ilKod3 = digits.slice(16, 19);
    const kontrol = digits.slice(19, 21) + '-' + digits.slice(21, 23);
    const altIsveren = digits.slice(23, 26);
    return `${mahiyet} ${iskolu} ${il} ${ilce} ${sira} ${ilKod3} ${kontrol} ${altIsveren}`;
  }

  // 24 haneli
  if (digits.length === 24) {
    return `${digits.slice(0, 1)} ${digits.slice(1, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)} ${digits.slice(9, 16)} ${digits.slice(16, 19)} ${digits.slice(19, 21)}-${digits.slice(21, 24)}`;
  }

  // Eğer zaten tireli veya aralıklıysa temizle ve boşlukları tekilleştir
  return raw.replace(/\s+/g, ' ').trim();
}

/**
 * SGK İşyeri Sicil Numarasından 01 01 ve 052 arasındaki (veya il/ünite ile ilKod arasındaki)
 * 7 haneli işyeri sıra numarasını ayıklar.
 * Kullanıcı kuralı: 29 haneli sicil no yerine daima bu sayı konur ve tablolarda sola dayalı yazılır.
 * Örn: "2 9313 01 01 1088448 052 20-83 000 001" -> "1088448"
 * Örn: "2 4324 01 01 1055706 052 20-30 000 001" -> "1055706"
 */
export function extractSicilSiraNo(raw: string): string {
  if (!raw) return '';
  const trimmed = raw.trim();

  // 1. "01 01" (veya iki 2 basamaklı sayı) ile "052" (veya 3 basamaklı sayı) arasındaki sayıyı yakala
  const matchBetween = trimmed.match(/(?:01\s+01|\b\d{2}\s+\d{2})[\s.-]+(\d{6,8})[\s.-]+(?:\d{3}|052)\b/i) ||
                       trimmed.match(/01\s*01\s*[-.\s]*(\d{6,8})\s*[-.\s]*052/i) ||
                       trimmed.match(/\b\d{2}[\s.-]+\d{2}[\s.-]+(\d{6,8})[\s.-]+\d{3}\b/);
  if (matchBetween) {
    return matchBetween[1];
  }

  // 2. Boşluksuz bitişik rakamlar (24, 26 veya 29 haneli tam sicil no)
  // Mahiyet (1) + İşkolu (4) + İl (2) + İlçe (2) = 9 basamak
  // Sıra No (7 basamak) = slice(9, 16)
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length >= 24) {
    return digits.slice(9, 16);
  }

  // 3. Kullanıcı zaten sadece sıra numarasını (6-8 basamak) girmişse
  if (/^\d{6,8}$/.test(trimmed)) {
    return trimmed;
  }

  return trimmed;
}

// SGK Sicil Numarasından Plaka Kodu Çıkarma
export function extractPlateFromSicilNo(sicil: string): string | null {
  if (!sicil) return null;
  // Bloklu formatta 3 haneli il plaka kodu (Örn: "... 052 ...")
  const m3 = sicil.match(/\b0?([0-8]\d)\b/);
  const mFull = sicil.match(/\b\d{1,4}\s*[-.]?\s*\d{4}\s*[-.]?\s*\d{2}\s*[-.]?\s*\d{2}\s*[-.]?\s*\d{6,7}\s*[-.]?\s*(\d{3})\b/);
  
  if (mFull) {
    const p3 = mFull[1];
    const p2 = p3.replace(/^0+/, '').padStart(2, '0');
    if (PLAKA_IL_MAP[p2]) return PLAKA_IL_MAP[p2];
  }

  // Doğrudan 2 basamaklı il kodu (3. blok)
  const mBlock = sicil.match(/^[1-4]\s+\d{4}\s+(\d{2})\s+/);
  if (mBlock && PLAKA_IL_MAP[mBlock[1]]) {
    return PLAKA_IL_MAP[mBlock[1]];
  }

  return null;
}

// 4. Vergi Dairesi Kelime Tamamlayıcı
// "52101 - Akkuş Malmüdürlüğü Defter Tipi : Bilanço" -> "Akkuş Malmüdürlüğü"
// "Boztepe" -> "Boztepe Vergi Dairesi", "Boztepe VD" -> "Boztepe Vergi Dairesi"
export function completeVergiDairesi(raw: string): string {
  if (!raw) return '';
  let str = raw.trim();

  // Baştaki iki nokta, tire ve boşlukları temizle
  str = str.replace(/^[:=\s-]+/, '');

  // Baştaki vergi dairesi kodunu temizle (Örn: "52101 - Akkuş Malmüdürlüğü" -> "Akkuş Malmüdürlüğü")
  str = str.replace(/^\d{4,6}\s*[-/]\s*/, '');

  // Sondaki veya aradaki "Defter Tipi : Bilanço..." gibi muhasebe türü eklerini temizle
  str = str.replace(/\s*defter\s*tipi\s*[:=].*$/i, '');

  // Başlık ve son ek kalıntılarını temizle
  str = str
    .replace(/^(?:vergi\s*dairesi|v\.?d\.?)[:=\s-]+/i, '')
    .replace(/(?:vergi\s*dairesi\s*müdürlüğü|v\.?d\.?\s*müdürlüğü)$/i, '')
    .replace(/(?:v\.?d\.?|vd)$/i, '')
    .trim();

  if (!str) return '';

  // Eğer zaten "Malmüdürlüğü" ise sonuna tekrar "Vergi Dairesi" ekleme!
  if (/malmüdürlüğü|malmudurlugu/i.test(str)) {
    const words = str.split(/\s+/).map((w) => {
      if (w.length <= 1) return w.toLocaleUpperCase('tr-TR');
      return w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1).toLocaleLowerCase('tr-TR');
    });
    return words.join(' ');
  }

  // Eğer sonunda zaten "Vergi Dairesi" yoksa tamamla
  if (!/vergi\s*dairesi$/i.test(str)) {
    const words = str.split(/\s+/).map((w) => {
      if (w.length <= 1) return w.toLocaleUpperCase('tr-TR');
      return w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1).toLocaleLowerCase('tr-TR');
    });
    return `${words.join(' ')} Vergi Dairesi`;
  }

  return str;
}

// 5. Ünvan Kelime Tamamlayıcı & Şirket Türü Standartlaştırıcı
// "AKKUŞ ARC TEKSTİL LTD.ŞTİ. VERGİ NO : 0310540975" -> "AKKUŞ ARC TEKSTİL LTD. ŞTİ."
export function completeUnvan(raw: string): string {
  if (!raw) return '';
  let str = raw.trim();

  // Baştaki iki nokta, tire ve boşlukları temizle
  str = str.replace(/^[:=\s-]+/, '');

  // Başlık etiketlerini temizle
  str = str
    .replace(/^(?:ünvan|unvan|mükellef|borçlu|işyeri\s*ünvanı|firma|şirket)[:=\s-]+/i, '')
    .trim();

  // Sondaki "VERGİ NO : 0310540975" veya "VKN : ..." gibi vergi numarası kalıntılarını temizle!
  str = str.replace(/\s*(?:vergi\s*no|vkn|tckn)\s*[:=\s]*\d{10,11}.*$/i, '').trim();

  // Kısaltmaları resmi standart kelimelerle tamamla
  str = str
    .replace(/\bLTD\s+ŞTİ\b/gi, 'LTD. ŞTİ.')
    .replace(/\bLTD\s+STI\b/gi, 'LTD. ŞTİ.')
    .replace(/\bLTD\b(?!\.)/gi, 'LTD.')
    .replace(/\bŞTİ\b(?!\.)/gi, 'ŞTİ.')
    .replace(/\bSTI\b(?!\.)/gi, 'ŞTİ.')
    .replace(/\bAŞ\b(?!\.)/gi, 'A.Ş.')
    .replace(/\bAS\b(?!\.)/gi, 'A.Ş.')
    .replace(/\bTIC\b(?!\.)/gi, 'TİC.')
    .replace(/\bSAN\b(?!\.)/gi, 'SAN.');

  return str.toLocaleUpperCase('tr-TR');
}

// 6. Adres Kelime Tamamlayıcı (Kısaltmaları düzelt & Şehir yoksa tamamla)
export function completeAdres(raw: string, detectedIl?: string, detectedMerkez?: string): string {
  if (!raw) return '';
  let str = raw.trim();

  // Baştaki iki nokta, tire ve boşlukları temizle
  str = str.replace(/^[:=\s-]+/, '');

  // Başlık etiketlerini temizle
  str = str.replace(/^(?:adres|işyeri\s*adresi|şirket\s*adresi)[:=\s-]+/i, '').trim();

  // Standart kısaltma kelime tamamlamaları
  str = str
    .replace(/\bmah\b\.?/gi, 'Mah.')
    .replace(/\bmahallesi\b/gi, 'Mah.')
    .replace(/\bcad\b\.?/gi, 'Cad.')
    .replace(/\bcaddesi\b/gi, 'Cad.')
    .replace(/\bsok\b\.?/gi, 'Sok.')
    .replace(/\bsokak\b/gi, 'Sok.')
    .replace(/\bbulv\b\.?/gi, 'Bulv.')
    .replace(/\bbulvarı\b/gi, 'Bulv.')
    .replace(/\bno\s*:\s*/gi, 'No: ')
    .replace(/\bkat\s*:\s*/gi, 'Kat: ')
    .replace(/\bdış\s*kapı\s*no\s*:\s*/gi, 'Dış Kapı No: ')
    .replace(/\biç\s*kapı\s*no\s*:\s*/gi, 'İç Kapı No: ');

  // Eğer adres zaten başka bir il/ilçe içeriyorsa (Örn: HALKALI/İST, İSTANBUL, ANKARA, İZMİR vb.) kesinlikle başka il ekleme!
  const hasExistingCity = /\b(?:İST\b|İSTANBUL|ANKARA|İZMİR|BURSA|ANTALYA|ADANA|KOCAELİ|KONYA|GAZİANTEP|KAYSERİ|TRABZON|SAMSUN|ORDU|GİRESUN)\b/i.test(str);
  
  if (!hasExistingCity) {
    const hasIl = detectedIl && new RegExp(`\\b${detectedIl}\\b`, 'i').test(str);
    const hasMerkez = detectedMerkez && new RegExp(`\\b${detectedMerkez}\\b`, 'i').test(str);

    if (detectedIl && !hasIl) {
      if (detectedMerkez && !hasMerkez) {
        str = `${str} ${detectedMerkez} / ${detectedIl}`;
      } else {
        str = `${str} / ${detectedIl}`;
      }
    } else if (detectedMerkez && !hasMerkez && detectedIl) {
      str = `${str} ${detectedMerkez}`;
    }
  }

  return str.trim();
}

// 7. Telefon & GSM Ulusal Format Tamamlayıcı
// 05321234567 -> 0 (532) 123 45 67
export function formatPhoneNumber(raw: string, isGsm: boolean = false): string {
  if (!raw) return '';
  const digits = raw.replace(/[^\d]/g, '');
  
  // 10 hane (5xx xxx xx xx) veya 11 hane (05xx xxx xx xx)
  let clean10 = digits;
  if (digits.length === 11 && digits.startsWith('0')) {
    clean10 = digits.slice(1);
  }

  if (clean10.length === 10) {
    const alan = clean10.slice(0, 3);
    const b1 = clean10.slice(3, 6);
    const b2 = clean10.slice(6, 8);
    const b3 = clean10.slice(8, 10);
    return `0 (${alan}) ${b1} ${b2} ${b3}`;
  }

  return raw;
}

// 8. Tarih Tamamlayıcı & GG.AA.YYYY Formatlayıcı
export function completeDate(raw: string): string {
  if (!raw) return '';
  const clean = raw.trim();

  // GG.AA.YYYY veya GG/AA/YYYY veya GG-AA-YYYY
  const m = clean.match(/\b(\d{1,2})[./-](\d{1,2})[./-](\d{4})\b/);
  if (m) {
    const day = m[1].padStart(2, '0');
    const month = m[2].padStart(2, '0');
    const year = m[3];
    return `${day}.${month}.${year}`;
  }

  // YYYY-AA-GG (ISO)
  const mIso = clean.match(/\b(\d{4})[./-](\d{1,2})[./-](\d{1,2})\b/);
  if (mIso) {
    const year = mIso[1];
    const month = mIso[2].padStart(2, '0');
    const day = mIso[3].padStart(2, '0');
    return `${day}.${month}.${year}`;
  }

  return clean;
}

// 9. İl Müdürlüğü ve SGM Çıkarımı (Gelişmiş Çift Yönlü & İlçe Sözlüğü Destekli)
export function extractSgimAndSgm(rawText: string): {
  il: string;
  merkez: string;
  autoCompletedIlFromDistrict?: boolean;
  autoCompletedFromPlate?: boolean;
} {
  let detectedIl = '';
  let detectedMerkez = '';
  let autoCompletedIlFromDistrict = false;
  let autoCompletedFromPlate = false;

  if (!rawText) return { il: '', merkez: '' };

  // 0. MOSİP / e-Devlet "Sgm Kodu-Ad : ... İlçe Kodu-Ad : ..." Formatı
  // Örn: "Sgm Kodu-Ad	:	21-SGK ÜNYE SOSYAL GÜVENLİK MERKEZİ	İlçe Kodu-Ad	:	11-ÜNYE"
  const mosipSgmRegex = /Sgm\s*Kodu?[-–\s]*Ad\s*[:=\t]+([^\r\n]+)/i;
  const mosipMatch = rawText.match(mosipSgmRegex);
  if (mosipMatch) {
    const fullSgmLine = mosipMatch[1];

    // İlçe Kodu-Ad varsa doğrudan ilçeyi yakala
    const ilceMatch = rawText.match(/İlçe\s*Kodu?[-–\s]*Ad\s*[:=\t]+([^\r\n\t]+)/i);
    if (ilceMatch) {
      const cleanIlce = cleanSgmName(ilceMatch[1]);
      if (cleanIlce) {
        detectedMerkez = cleanIlce;
        if (TURKISH_DISTRICTS_MAP[cleanIlce]) {
          detectedIl = TURKISH_DISTRICTS_MAP[cleanIlce];
          autoCompletedIlFromDistrict = true;
        }
      }
    }

    if (!detectedMerkez) {
      const sgmOnly = fullSgmLine.split(/İlçe\s*Kodu?[-–\s]*Ad/i)[0];
      const cleanCenter = cleanSgmName(sgmOnly);
      if (cleanCenter) {
        detectedMerkez = cleanCenter;
        if (TURKISH_DISTRICTS_MAP[cleanCenter]) {
          detectedIl = TURKISH_DISTRICTS_MAP[cleanCenter];
          autoCompletedIlFromDistrict = true;
        }
      }
    }
  }

  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  // 1. Satır Satır Form Başlığı ve SGK İbareleri
  for (const line of lines) {
    const lineUpper = line.toLocaleUpperCase('tr-TR');

    if (
      lineUpper.includes('SOSYAL GÜVENLİK İL MÜDÜRLÜĞ') ||
      lineUpper.includes('İL MÜDÜRLÜĞÜ') ||
      lineUpper.includes('SGİM')
    ) {
      const il = cleanIlName(line);
      if (il) detectedIl = il;
    }

    if (
      lineUpper.includes('SOSYAL GÜVENLİK MERKEZ') ||
      lineUpper.includes('SGM') ||
      lineUpper.includes('S.G.M') ||
      lineUpper.includes('MERKEZ MÜDÜRLÜĞ')
    ) {
      const merkez = cleanSgmName(line, detectedIl);
      if (merkez) detectedMerkez = merkez;
    }
  }

  // 2. Açık Regex Kalıpları
  if (!detectedIl) {
    const ilMudRegex = /([a-zA-ZğüşıöçĞÜŞİÖÇ\s]{2,35})\s+(?:SOSYAL\s+GÜVENLİK\s+İL\s+MÜDÜRLÜĞ[ÜU]|İL\s+MÜDÜRLÜĞ[ÜU]|SGİM)(?:'?[Nn][Ee])?/i;
    const m = rawText.match(ilMudRegex);
    if (m) {
      const il = cleanIlName(m[1]);
      if (il) detectedIl = il;
    }
  }

  if (!detectedMerkez) {
    const sgmRegex = /([a-zA-ZğüşıöçĞÜŞİÖÇ\s]{2,35})\s+(?:SOSYAL\s+GÜVENLİK\s+MERKEZ[İI]|MERKEZ\s+MÜDÜRLÜĞ[ÜU]|S\.?G\.?M\.?)(?:'?[Nn][Ee])?/i;
    const m = rawText.match(sgmRegex);
    if (m) {
      const merkez = cleanSgmName(m[1], detectedIl);
      if (merkez) detectedMerkez = merkez;
    }
  }

  // 3. MOSİP "SGM Kod - Ad" Satırı
  const sgmLineMatch = rawText.match(/(?:sgm\s*(?:kod[-–\s]*ad)?|sosyal\s*güvenlik\s*merkezi)[:=\s]+([^\r\n]+)/i);
  if (sgmLineMatch) {
    const rawVal = sgmLineMatch[1];
    if (!detectedIl) {
      const il = cleanIlName(rawVal);
      if (il) detectedIl = il;
    }
    const merkez = cleanSgmName(rawVal, detectedIl);
    if (merkez) detectedMerkez = merkez;
  }

  // 4. Kapsamlı İlçe Sözlüğü Taraması (Kelimeyle Tamamlayıcı: İlçe Bulununca İl'i Otomatik Doldur!)
  if (detectedMerkez && !detectedIl && TURKISH_DISTRICTS_MAP[detectedMerkez]) {
    detectedIl = TURKISH_DISTRICTS_MAP[detectedMerkez];
    autoCompletedIlFromDistrict = true;
  }

  const upperText = rawText.toLocaleUpperCase('tr-TR');
  for (const [district, parentProvince] of Object.entries(TURKISH_DISTRICTS_MAP)) {
    const reg = new RegExp(`\\b${district}\\b`, 'i');
    if (reg.test(upperText)) {
      if (!detectedMerkez) {
        detectedMerkez = district;
      }
      if (!detectedIl) {
        detectedIl = parentProvince;
        autoCompletedIlFromDistrict = true;
      }
      break;
    }
  }

  // 5. SGK Sicil No Plaka Kodu Taraması
  if (!detectedIl) {
    const plateIl = extractPlateFromSicilNo(rawText);
    if (plateIl) {
      detectedIl = plateIl;
      autoCompletedFromPlate = true;
    }
  }

  // 6. 81 İl Taraması (Genel)
  if (!detectedIl) {
    for (const prov of TURKISH_PROVINCES) {
      const reg = new RegExp(`\\b${prov}\\b`, 'i');
      if (reg.test(upperText)) {
        detectedIl = prov;
        break;
      }
    }
  }

  // 7. İl bulundu ama Merkez boşsa: İlin ilçesini ara veya ili merkez yap
  if (detectedIl && !detectedMerkez) {
    for (const [district, parentProvince] of Object.entries(TURKISH_DISTRICTS_MAP)) {
      if (parentProvince === detectedIl) {
        const reg = new RegExp(`\\b${district}\\b`, 'i');
        if (reg.test(upperText)) {
          detectedMerkez = district;
          break;
        }
      }
    }
    if (!detectedMerkez) {
      detectedMerkez = detectedIl;
    }
  }

  // Kullanıcı kesin kuralı: İl Ordu ise Sosyal Güvenlik Merkezi her zaman ALTINORDU olmalıdır
  if (detectedIl && detectedIl.toLocaleUpperCase('tr-TR').trim() === 'ORDU') {
    detectedMerkez = 'ALTINORDU';
  }
  if (detectedMerkez && detectedMerkez.toLocaleUpperCase('tr-TR').trim() === 'ALTINORDU') {
    detectedIl = 'ORDU';
  }
  if (detectedMerkez && TURKISH_DISTRICTS_MAP[detectedMerkez] === 'ORDU') {
    detectedIl = 'ORDU';
    detectedMerkez = 'ALTINORDU';
  }

  return {
    il: detectedIl,
    merkez: detectedMerkez,
    autoCompletedIlFromDistrict,
    autoCompletedFromPlate,
  };
}

// 10. TCKN ve VKN Ayıklama (Boşluk, tire, nokta temizleyerek en yüksek hassasiyet)
export function extractTcknVkn(text: string): { value: string; type: 'TCKN' | 'VKN' } | null {
  if (!text) return null;

  // 1. Birleşik ve Açık Etiketler (Form hücre başlığı dahil: "TCK No / Vergi Kimlik No")
  const explicitPatterns = [
    /(?:tck\s*no\s*[\/\-]\s*vergi\s*kimlik\s*no|tc\s*no\s*[\/\-]\s*vergi\s*no|tckn\s*[\/\-]\s*vkn)[:=\s\t]+([0-9\s.-]{10,20})/i,
    /(?:t\.?c\.?(?:\s*kimlik)?(?:\s*no|\s*numarası)?|tckn|borçlu\s*t\.?c\.?)[:=\s\t]+([0-9\s.-]{11,20})/i,
    /(?:v\.?k\.?n|vergi\s*(?:kimlik)?(?:\s*no|\s*numarası)?|vergi\s*no)[:=\s\t]+([0-9\s.-]{10,20})/i,
    /(?:t\.?c\.?(?:\s*kimlik)?(?:\s*no)?|tckn)[^\d]{0,25}([0-9\s.-]{11,16})/i,
    /(?:v\.?k\.?n|vergi\s*(?:kimlik)?(?:\s*no)?)[^\d]{0,25}([0-9\s.-]{10,15})/i,
  ];

  for (const pat of explicitPatterns) {
    const match = text.match(pat);
    if (match) {
      const clean = match[1].replace(/[^\d]/g, '');
      if (clean.length === 11 && !clean.startsWith('0')) {
        return { value: clean, type: 'TCKN' };
      }
      if (clean.length === 10) {
        return { value: clean, type: 'VKN' };
      }
    }
  }

  // 2. Satır bazlı arama
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (
      lower.includes('tck') ||
      lower.includes('kimlik') ||
      lower.includes('vkn') ||
      lower.includes('vergi no')
    ) {
      const digitsOnly = line.replace(/[^\d]/g, '');
      if (digitsOnly.length === 11 && !digitsOnly.startsWith('0')) {
        return { value: digitsOnly, type: 'TCKN' };
      }
      if (digitsOnly.length === 10) {
        return { value: digitsOnly, type: 'VKN' };
      }
    }

    // 11 haneli standart TCKN (0 ile başlayamaz)
    const m11 = line.match(/\b([1-9]\d{10})\b/);
    if (m11) {
      return { value: m11[1], type: 'TCKN' };
    }

    // 10 haneli VKN (5 ile başlayamaz, cep telefonunu hariç tut)
    const m10 = line.match(/\b([1-46-9]\d{9})\b/);
    if (m10) {
      return { value: m10[1], type: 'VKN' };
    }
  }

  return null;
}

// 11. Finansal Değerler Ayrıştırma (Borç, Peşinat, Taksit, Faiz, Tarih)
// Türkçe para birimi metinlerini sayıya dönüştürme (Örn: "97.970,11" -> 97970.11, "1.200.000,00" -> 1200000)
export function parseTurkishCurrency(str: string): number {
  if (!str) return 0;
  let clean = str.replace(/[^\d.,]/g, '').trim();
  if (!clean) return 0;

  // Format: 97.970,11 (Nokta binlik, virgül ondalık)
  if (clean.includes('.') && clean.includes(',')) {
    clean = clean.replace(/\./g, '').replace(',', '.');
    const val = parseFloat(clean);
    return isNaN(val) ? 0 : val;
  }
  // Format: 97970,11 (Virgüllü ondalık)
  if (clean.includes(',')) {
    clean = clean.replace(',', '.');
    const val = parseFloat(clean);
    return isNaN(val) ? 0 : val;
  }
  // Format: 97.970 veya 97.970.000 (Binlik noktalı)
  if (clean.includes('.')) {
    const parts = clean.split('.');
    if (parts.slice(1).every((p) => p.length === 3)) {
      const val = parseFloat(parts.join(''));
      return isNaN(val) ? 0 : val;
    }
    const val = parseFloat(clean);
    return isNaN(val) ? 0 : val;
  }

  const val = parseFloat(clean);
  return isNaN(val) ? 0 : val;
}

export function extractFinancialValues(text: string): {
  borc?: number;
  pesinat?: number;
  taksit?: number;
  tarih?: string;
  isPesinatAutoCalculated?: boolean;
} {
  let borc: number | undefined;
  let pesinat: number | undefined;
  let taksit: number | undefined;
  let tarih: string | undefined;
  let isPesinatAutoCalculated = false;

  if (!text || !text.trim()) {
    return { borc, pesinat, taksit, tarih, isPesinatAutoCalculated };
  }

  const isYear = (n: number) => n >= 1980 && n <= 2099 && Math.floor(n) === n;
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  // 1. ADIM: "Genel Toplam", "Toplam Borç", "Toplam Borç Tutarı" gibi doğrudan Genel Toplam satırları
  // SGK ve MOSİP dökümlerinde Genel Toplam genellikle dökümün en altında veya özet başlığında yer alır.
  const highPriorityLabels = [
    /genel\s*toplam/i,
    /toplam\s*borç\s*(?:tutarı)?/i,
    /toplam\s*asıl\s*borç/i,
    /borç\s*(?:tutarı|miktarı)/i,
    /ödenecek\s*(?:toplam\s*)?tutar/i,
    /asıl\s*alacak/i,
    /bakiye\s*borç/i,
    /amme\s*alacağı/i,
    /toplam\s*tutar/i,
  ];

  // Türk para birimi deseni: 97.970,11 veya 97970,11 veya 97.970
  // Negatif önleme: arkasından / gelmemeli (2021/07 gibi dönemleri ve 6183/48'i ele)
  const currencyRegex = /\b(\d{1,3}(?:\.\d{3})+(?:,\d{1,2})|\d{1,9},\d{2}|\d{1,3}(?:\.\d{3})+(?!\d|\/))\b/g;

  // Öncelikli etiketli satırları metnin sonundan yukarı doğru tara (Genel Toplam en altta olur)
  for (const prioPat of highPriorityLabels) {
    if (borc) break;
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i];
      if (prioPat.test(line)) {
        // Dönem yılı ibaresini (2021/07 vb.) ve kanun maddesini temizle
        const sanitizedLine = line
          .replace(/\b(?:19|20)\d{2}\/(?:0[1-9]|1[0-2])\b/g, '')
          .replace(/6183[\/.]48/g, '');

        const matches = Array.from(sanitizedLine.matchAll(currencyRegex));
        if (matches.length > 0) {
          // Satırda birden fazla tutar varsa (örn: Prim Aslı, Gecikme Zammı, Genel Toplam),
          // en sağdaki veya en büyük tutar Genel Toplam'dır (Örn: 97.970,11)
          let bestVal = 0;
          for (let mIdx = matches.length - 1; mIdx >= 0; mIdx--) {
            const parsed = parseTurkishCurrency(matches[mIdx][1]);
            if (parsed > 0 && !isYear(parsed)) {
              if (parsed > bestVal) bestVal = parsed;
            }
          }
          if (bestVal > 0) {
            borc = bestVal;
            break;
          }
        }
      }
    }
  }

  // 2. ADIM: "TL" veya "₺" ibaresiyle biten tutarları ara (Örn: "97.970,11 TL")
  if (!borc) {
    const tlMatches = Array.from(
      text.matchAll(/\b(\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?|\d{1,9},\d{2})\s*(?:tl|₺)\b/gi)
    );
    if (tlMatches.length > 0) {
      let maxVal = 0;
      for (const m of tlMatches) {
        const val = parseTurkishCurrency(m[1]);
        if (val > maxVal && !isYear(val)) {
          maxVal = val;
        }
      }
      if (maxVal > 0) {
        borc = maxVal;
      }
    }
  }

  // 3. ADIM: "Toplam" kelimesi geçen herhangi bir satırdaki tutarlar
  if (!borc) {
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i];
      if (/toplam/i.test(line)) {
        const sanitizedLine = line
          .replace(/\b(?:19|20)\d{2}\/(?:0[1-9]|1[0-2])\b/g, '')
          .replace(/6183[\/.]48/g, '');
        const matches = Array.from(sanitizedLine.matchAll(currencyRegex));
        if (matches.length > 0) {
          let maxVal = 0;
          for (const m of matches) {
            const val = parseTurkishCurrency(m[1]);
            if (val > maxVal && !isYear(val)) maxVal = val;
          }
          if (maxVal > 0) {
            borc = maxVal;
            break;
          }
        }
      }
    }
  }

  // 4. ADIM: Peşinat Tutarı Tespiti
  const pesinatMatch = text.match(
    /(?:peşinat\s*(?:tutarı)?|ilk\s*taksit(?:\s*tutarı)?|ön\s*ödeme)[^\d]{0,12}(\d{1,3}(?:\.\d{3})+(?:,\d{1,2})|\d{1,9},\d{2}|\d{1,3}(?:\.\d{3})+|\d+)\s*(?:tl|₺)?/i
  );
  if (pesinatMatch) {
    const valP = parseTurkishCurrency(pesinatMatch[1]);
    if (valP > 0 && !isYear(valP)) {
      pesinat = valP;
    }
  }

  // 5. ADIM: Taksit Sayısı Tespiti
  const taksitMatch =
    text.match(/(?:taksit\s*(?:sayısı|süresi)?|vade\s*(?:süresi)?|taksit|vade)[^\d]{0,8}(\d{1,2})\b/i) ||
    text.match(/\b(\d{1,2})\s*ay(?:lık)?(?:\s*vade|\s*taksit)?\b/i);
  if (taksitMatch) {
    const taksitNum = parseInt(taksitMatch[1], 10);
    if (taksitNum >= 1 && taksitNum <= 72) {
      taksit = taksitNum;
    }
  } else {
    // Standart yasal azami vade 36 ay
    taksit = 36;
  }

  // SGK 6183/48 Mevzuatı Gereği:
  // İlk taksit (peşinat) tutarı toplam borcun en az %10'u olmak zorundadır!
  if (borc) {
    const minPesinat = Math.round(borc * 0.1 * 100) / 100;
    if (!pesinat || pesinat < minPesinat) {
      pesinat = minPesinat;
      isPesinatAutoCalculated = true;
    }
  }

  // Kullanıcı kesin kuralı: Formda tarihler daima günün resmi işlem tarihi olmalıdır
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  tarih = `${dd}.${mm}.${yyyy}`;

  return { borc, pesinat, taksit, tarih, isPesinatAutoCalculated };
}

// 12. Telefon, GSM ve Faks Ayıklama Motoru
export function extractPhoneNumbers(text: string): {
  telefon?: string;
  faks?: string;
  gsm?: string;
} {
  let telefon: string | undefined;
  let faks: string | undefined;
  let gsm: string | undefined;

  // Birleşik satır: "İşyeri Telefon No, Faks No : 0452 234 56 78 / 0452 234 56 79"
  const comboMatch = text.match(/(?:telefon\s*no\s*,\s*faks\s*no|tel\s*[\/\-]\s*faks)[:=\s\t]+([^\r\n]+)/i);
  if (comboMatch) {
    const rawVal = comboMatch[1];
    const nums = rawVal.match(/0?\s*[2-5]\d{2}[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}/g);
    if (nums && nums.length >= 1) {
      telefon = formatPhoneNumber(nums[0], false);
      if (nums.length >= 2) {
        faks = formatPhoneNumber(nums[1], false);
      }
    }
  }

  if (!gsm) {
    const gsmMatch = text.match(/(?:(?:gsm|cep|mobil)[^\d]{0,6})?(0?\s*5\d{2}[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2})/i);
    if (gsmMatch) {
      gsm = formatPhoneNumber(gsmMatch[1], true);
    }
  }

  if (!telefon) {
    const telMatch = text.match(/(?:(?:tel(?:efon)?|santral)[^\d]{0,6})?(0?\s*[2-4]\d{2}[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2})/i);
    if (telMatch) {
      telefon = formatPhoneNumber(telMatch[1], false);
    }
  }

  if (!faks) {
    const faksMatch = text.match(/(?:faks|fax)[^\d]{0,6}(0?\s*[2-4]\d{2}[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2})/i);
    if (faksMatch) {
      faks = formatPhoneNumber(faksMatch[1], false);
    }
  }

  return { telefon, faks, gsm };
}
