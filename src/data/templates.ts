import { MuvafakatnameTemplate } from '../types/muvafakatname';

export const MUVAFAKATNAME_TEMPLATES: MuvafakatnameTemplate[] = [
  {
    id: 'ek9-ucuncu-sahis',
    baslik: 'EK-9: ÜÇÜNCÜ ŞAHISLAR TARAFINDAN VERİLECEK MUVAFAKATNAME ÖRNEĞİ',
    formKodu: 'EK-9',
    kategori: 'ek9-3sahis',
    aciklama: 'SGK 2024/12 sayılı Genelgesi uyarınca üçüncü şahısların borçlu adına menkul/gayrimenkul mallarını teminat göstermesi ve haczedilmesine muvafakat vermesine ilişkin resmî form.',
    varsayilanKurum: 'T.C. SOSYAL GÜVENLİK KURUMU BAŞKANLIĞI',
    varsayilanAltBirim: 'ORDU SOSYAL GÜVENLİK İL MÜDÜRLÜĞÜ / ALTINORDU SOSYAL GÜVENLİK MERKEZİ',
    varsayilanKonu: '6183/10-5 Gereğince Teminat Gösterme ve Haciz Muvafakati',
    yasalDayanak: '6183 sayılı AATUHK m. 10/5 ve SGK 2024/12 sayılı Genelgesi',
    metin: `[BORCLU_UNVAN]'nin Sosyal Güvenlik Kurumuna olan [BORC_DONEMI] dönemi/ayına ilişkin [BORC_TUTARI] TL tutarında prim ve idari para cezası borcuna ve bu borca bu tarihten ödenmesine kadar geçecek süre için işleyecek fer’ilerine karşılık;

Aşağıda özellikleri yazılı menkul/gayrimenkul malı 6183 sayılı Kanunun 10 uncu maddesinin beşinci fıkrası gereğince teminat olarak gösteriyor ve söz konusu malların Sosyal Güvenlik Kurumu tarafından haczedilmesine muvafakat ediyorum.

Bu konuda herhangi bir itirazda bulunmayacağımı bila-kaydü şart gayrikabili rücu kabul, beyan ve taahhüt ederim.`,
    teminatVarsayilan: {
      tur: 'gayrimenkul',
      il: 'ORDU',
      ilce: 'ALTINORDU',
      mahalleKoy: 'YENİ MAHALLE',
      ada: '1024',
      parsel: '18',
      bagimsizBolum: '4',
      yuzolcumu: '125 m²',
      nitelik: 'Mesken (Daire)',
      tapuMaliki: 'KEMAL ŞAHİN',
      hisseOrani: 'Tam (1/1)',
    },
    imzaBaslik1: 'Muvafakat Veren (3. Şahıs / Mülk Sahibi)',
    imzaBaslik2: 'Asıl Borçlu / Kefil',
    huzurdaImzaVarMi: true,
  },
  {
    id: 'ek9-borclu-teminat',
    baslik: 'EK-9: BORÇLUNUN KENDİSİ TARAFINDAN VERİLEN TEMİNAT VE HACİZ MUVAFAKATNAMESİ',
    formKodu: 'EK-9',
    kategori: 'ek9-sgk',
    aciklama: 'Borçlunun kendi adına kayıtlı taşınmaz, araç veya haklarını 6183 sayılı Kanun m. 10 uyarınca SGK borcuna teminat gösterip hacze rıza gösterdiğine dair resmî form.',
    varsayilanKurum: 'T.C. SOSYAL GÜVENLİK KURUMU BAŞKANLIĞI',
    varsayilanAltBirim: 'ORDU SOSYAL GÜVENLİK İL MÜDÜRLÜĞÜ / ALTINORDU SOSYAL GÜVENLİK MERKEZİ',
    varsayilanKonu: 'Borçlu Teminat Gösterme ve İhtiyati/Cebri Haciz Muvafakatnamesi',
    yasalDayanak: '6183 sayılı Kanun m. 10, 48 ve SGK 2024/12 sayılı Genelgesi',
    metin: `Kurumunuz nezdinde [DOSYA_NO] takip dosyası ile adıma/işyerimize tahakkuk ettirilen [BORC_DONEMI] dönemine ait [BORC_TUTARI] TL tutarındaki Kurum alacağı ve fer'ilerine teminat teşkil etmek üzere;

Mülkiyeti tarafıma ait aşağıda kayıt ve tescil bilgileri yazılı menkul/gayrimenkul malların, 6183 sayılı Kanunun ilgili hükümleri ve SGK 2024/12 sayılı Genelgesi dairesinde teminat olarak kabul edilmesine ve Kurumunuzca haciz şerhi işlenmesine kendi hür irademle muvafakat ediyorum.

Bahse konu mallar üzerindeki haciz işlemine ve teminat kaydına karşı hiçbir merci nezdinde itiraz etmeyeceğimi beyan ve taahhüt ederim.`,
    teminatVarsayilan: {
      tur: 'tasit',
      plaka: '52 ABC 123',
      markaModel: '2022 Ford Transit 350M',
      modelYili: '2022',
      cinsi: 'Kamyonet',
      sasiNo: 'NM0XXXTTFX123456',
      motorNo: 'DRFA1234567',
      ruhsatSahibi: 'ÜMİT ÖZTÜRK',
    },
    imzaBaslik1: 'Muvafakat Eden Borçlu',
    imzaBaslik2: 'Sosyal Güvenlik Merkezi Kabul Yetkilisi',
    huzurdaImzaVarMi: true,
  },
  {
    id: 'maas-haczi',
    baslik: 'Maaş Haczi Kesinti Muvafakatnamesi (İİK m. 83 & 6183 m. 71)',
    formKodu: 'MUVAFAKAT',
    kategori: 'maas',
    aciklama: 'Borçlunun maaşından yasal 1/4 oranını aşan tutarda kesinti yapılmasına izin veren resmî muvafakat belgesi.',
    varsayilanKurum: 'T.C. SOSYAL GÜVENLİK KURUMU BAŞKANLIĞI',
    varsayilanAltBirim: 'İcra Takip Haciz ve Satış Servisi',
    varsayilanKonu: 'Maaş Haczi ve Artırımlı Kesinti Muvafakati',
    yasalDayanak: '2004 sayılı İİK m. 83 ve 6183 sayılı Kanun m. 71',
    metin: `Kurumunuz nezdinde [DOSYA_NO] takip numarası ile aleyhime başlatılmış bulunan kamu alacağına mahsuben;

Halen çalışmakta olduğum işyerimden almakta olduğum aylık net maaş, ücret ve her türlü yan haklarımdan (ikramiye, prim, kıdem/ihbar tazminatı vb. dahil olmak üzere), 2004 sayılı İcra ve İflas Kanunu'nun 83. maddesindeki yasal 1/4 kesinti sınırına bağlı kalınmaksızın, borcun tamamı fer'ileriyle birlikte tasfiye edilinceye kadar aylık [KESINTI_TUTARI] kesinti yapılarak Kurumunuza ödenmesine kendi hür irademle rıza ve muvafakat ediyorum.

İşbu muvafakatnameyi hiçbir baskı ve tesir altında kalmaksızın imzaladığımı, yapılan kesintilere karşı hiçbir itirazda bulunmayacağımı beyan ve taahhüt ederim.`,
    teminatVarsayilan: {
      tur: 'maas',
      calistigiYer: 'ÖZTÜRK NAKLİYAT VE TİCARET LTD. ŞTİ.',
      aylikNetUcret: '45.000 TL',
      kesintiTutariOrani: 'Aylık 15.000 TL (%33.3)',
    },
    imzaBaslik1: 'Muvafakat Eden (Borçlu Çalışan)',
    imzaBaslik2: 'İşveren Yetkilisi / Muhasebe Müdürü',
    huzurdaImzaVarMi: false,
  },
  {
    id: 'emekli-maas',
    baslik: 'Emekli Maaşı Haczi Muvafakatnamesi (5510 s.K. m. 93)',
    formKodu: 'MUVAFAKAT',
    kategori: 'maas',
    aciklama: '5510 sayılı Kanun Madde 93 gereğince emekli aylığından borca mahsuben haciz ve kesinti yapılmasına dair açık muvafakat formu.',
    varsayilanKurum: 'T.C. SOSYAL GÜVENLİK KURUMU BAŞKANLIĞI',
    varsayilanAltBirim: 'Emeklilik Hizmetleri / İcra Takip Servisi',
    varsayilanKonu: 'Emekli Aylığından Haciz Kesintisi Yapılmasına İlişkin Açık Muvafakat',
    yasalDayanak: '5510 sayılı Kanun m. 93 ve 6183 sayılı Kanun hükümleri',
    metin: `Kurumunuzdan almakta olduğum emekli aylığımdan (Emekli Sicil / Tahsis No: [TAHSIS_NO]), Kurumunuza olan [DOSYA_NO] sayılı prim ve kamu borcuma mahsuben;

5510 sayılı Sosyal Sigortalar ve Genel Sağlık Sigortası Kanunu'nun 93. maddesi uyarınca emekli aylıklarının haczedilemeyeceği kuralını bilerek ve bu hakkımdan feragat ederek; borcum tamamen ödenip kapanıncaya kadar her ay emekli aylığımdan [KESINTI_TUTARI] tutarında kesinti yapılarak Kurumunuz ilgili hesabına aktarılmasına açıkça ve bila-kaydü şart muvafakat ediyorum.

Yapılacak kesintilere karşı hiçbir hukuki ve idari itirazda bulunmayacağımı, kesintilerin aksamadan devam etmesini talep ederim.`,
    teminatVarsayilan: {
      tur: 'maas',
      calistigiYer: 'SGK Emeklilik Hizmetleri Genel Müdürlüğü',
      aylikNetUcret: '28.500 TL (Emekli Maaşı)',
      kesintiTutariOrani: 'Aylık 7.000 TL',
    },
    imzaBaslik1: 'Muvafakat Eden (Emekli Borçlu)',
    imzaBaslik2: 'SGK Kabul ve Teslim Alan Yetkili',
    huzurdaImzaVarMi: false,
  },
  {
    id: 'banka-bloke',
    baslik: 'Banka Hesabı Bloke Kaldırma ve Mahsup Muvafakatnamesi',
    formKodu: 'TALEP-MUVAFAKAT',
    kategori: 'banka',
    aciklama: 'Bankalardaki hacizli hesaplardan borcun tahsili ve kalan tutar üzerindeki blokenin kaldırılması talebi.',
    varsayilanKurum: 'T.C. SOSYAL GÜVENLİK KURUMU BAŞKANLIĞI',
    varsayilanAltBirim: 'İcra Takip ve Haciz Servisi',
    varsayilanKonu: 'Banka Haczi / Bloke Kaldırma ve Mahsup Talebi',
    yasalDayanak: '6183 sayılı Kanun m. 62 ve 79',
    metin: `Kurumunuz nezdindeki [DOSYA_NO] takip dosyası kapsamında [BANKA_ADI] nezdinde bulunan [IBAN_HESAP] numaralı hesabım üzerine tatbik edilen e-haciz işlemine istinaden;

Hesabımda bulunan bakiyeden toplam [BORC_TUTARI] tutarındaki kısmın dosya borcuma mahsuben Kurumunuz hesaplarına aktarılmasını, aktarım sağlandıktan sonra kalan bakiye ile hesap üzerindeki e-haciz ve blokelerin ivedilikle fekkedilmesini saygılarımla arz ve talep ederim.`,
    teminatVarsayilan: {
      tur: 'banka',
      bankaAdi: 'T.C. Ziraat Bankası A.Ş.',
      iban: 'TR33 0001 0001 2345 6789 0050 01',
      hesapNo: '12345678-5001',
      alacakTutari: '85.450,00 TL',
    },
    imzaBaslik1: 'Hesap Sahibi / Borçlu',
    imzaBaslik2: 'İcra Takip Servisi Şefi',
    huzurdaImzaVarMi: false,
  },
  {
    id: 'tasinmaz-satis',
    baslik: 'Taşınmaz (Gayrimenkul) Rızaen Satış ve Haciz Fekki Muvafakatnamesi',
    formKodu: 'EK-9/G',
    kategori: 'tasinmaz',
    aciklama: 'Hacizli taşınmazın üçüncü şahsa rızaen satılması ve satış bedelinden SGK borcunun kapatılması için verilen resmî muvafakat.',
    varsayilanKurum: 'T.C. SOSYAL GÜVENLİK KURUMU BAŞKANLIĞI',
    varsayilanAltBirim: 'Gayrimenkul Satış Servisi',
    varsayilanKonu: 'Taşınmazın Rızaen Satışı ve Haciz Fekki Muvafakatnamesi',
    yasalDayanak: '6183 sayılı Kanun m. 74 ve İİK m. 111/a',
    metin: `Maliki bulunduğum [IL_ILCE] sınırları dahilinde bulunan, Tapu Sicil Müdürlüğü'nün [ADA_PARSEL] ada/parsel sayısında kayıtlı [TASINMAZ_NITELIGI] niteliğindeki gayrimenkulüm üzerine Kurumunuzca [DOSYA_NO] dosya kapsamında tatbik edilen haczin fekki amacıyla;

Söz konusu taşınmazın üçüncü kişiye rızaen satışının gerçekleştirilmesi, satış bedelinden Kurumunuz asıl alacak, gecikme zammı ve takip masrafları toplamı olan [BORC_TUTARI] tutarın doğrudan tapu devri esnasında veya Kurum veznesine/hesabına peşinen ödenmesi koşuluyla haczin kaldırılmasına muvafakat ettiğimi beyan ve taahhüt ederim.`,
    teminatVarsayilan: {
      tur: 'gayrimenkul',
      il: 'ORDU',
      ilce: 'ALTINORDU',
      mahalleKoy: 'ŞİRİNEVLER MAH.',
      ada: '412',
      parsel: '9',
      bagimsizBolum: '2. Kat No:6',
      yuzolcumu: '140 m²',
      nitelik: 'Daire / Mesken',
      tapuMaliki: 'ÜMİT ÖZTÜRK',
      hisseOrani: '1/1 (Tam Pay)',
    },
    imzaBaslik1: 'Taşınmaz Maliki (Borçlu)',
    imzaBaslik2: 'Gayrimenkul Satış Komisyon Başkanı',
    huzurdaImzaVarMi: false,
  },
  {
    id: 'arac-muvafakat',
    baslik: 'Araç / Taşıt Noter Satış İzni ve Devir Muvafakatnamesi',
    formKodu: 'EK-9/A',
    kategori: 'tasit',
    aciklama: 'Hacizli veya yakalamalı aracın noterlik nezdinde satışı ve bedelinin SGK alacağına aktarılması için verilen devir muvafakati.',
    varsayilanKurum: 'T.C. SOSYAL GÜVENLİK KURUMU BAŞKANLIĞI',
    varsayilanAltBirim: 'İcra Menkul Satış Servisi',
    varsayilanKonu: 'Araç Satış İzni ve Noter Devir Muvafakatnamesi',
    yasalDayanak: '6183 sayılı Kanun m. 70 ve 84',
    metin: `Mülkiyeti adıma/şirketimize ait olan [PLAKA_NO] plakalı, [SASI_NO] şasi numaralı [MARKA_MODEL] aracım üzerine [DOSYA_NO] takip dosyası kapsamında konulmuş olan haciz ve yakalama şerhinin;

Aracın noterlik nezdinde üçüncü şahsa devri karşılığında elde edilecek bedelden Kurumunuzun [BORC_TUTARI] tutarındaki borcunun def'aten ödenmesi kaydıyla, noter satışına muvafakat edildiğinin ilgili Noterlikler Birliği (ARTES) sistemine bildirilmesini ve haczin fekkedilmesini saygılarımla arz ederim.`,
    teminatVarsayilan: {
      tur: 'tasit',
      plaka: '52 AB 456',
      markaModel: '2021 Renault Megane Sedan 1.5 dCi',
      modelYili: '2021',
      cinsi: 'Otomobil',
      sasiNo: 'VF1RFB00812345678',
      motorNo: 'K9K65612345',
      ruhsatSahibi: 'ÜMİT ÖZTÜRK',
    },
    imzaBaslik1: 'Araç Ruhsat Sahibi (Borçlu)',
    imzaBaslik2: 'Araç Satış Servisi Yetkilisi',
    huzurdaImzaVarMi: false,
  },
  {
    id: '6183-taahhutname',
    baslik: '6183 Sayılı Kanun Madde 48 Tecil ve Taksitlendirme Taahhütnamesi',
    formKodu: 'TAAHHÜT',
    kategori: 'taahhut',
    aciklama: 'Borcun belirlenen tecil planına göre peşinat ve taksitlerle ödeneceğine ilişkin resmî taahhütname.',
    varsayilanKurum: 'T.C. SOSYAL GÜVENLİK KURUMU BAŞKANLIĞI',
    varsayilanAltBirim: 'İcra ve Tecil Servisi',
    varsayilanKonu: '6183/48 Tecil ve Taksitlendirme Ödeme Taahhüdü',
    yasalDayanak: '6183 sayılı AATUHK Madde 48 ve SGK 2024/12 Genelgesi',
    metin: `Kurumunuza olan [DOSYA_NO] sicil/dosya numaralı prim, idari para cezası ve fer'ilerinden oluşan toplam [BORC_TUTARI] borcumu;

6183 sayılı Amme Alacaklarının Tahsil Usulü Hakkında Kanun'un 48. maddesi ve SGK 2024/12 sayılı Genelgesi çerçevesinde belirlenen peşinat tutarını derhal ödemek kaydıyla, bakiye borcumu tecil planı dahilinde tecil faiziyle birlikte eksiksiz ve süresinde ödeyeceğimi;

Taksitlerden birini veya cari ay primlerimi yasal süresinde ödemediğim takdirde tecil ve taksitlendirmemin ihlal olacağını, gösterilen teminatların derhal paraya çevrileceğini ve cebri icra işlemlerine kalındığı yerden devam edileceğini gayrikabili rücu kabul, beyan ve taahhüt ederim.`,
    imzaBaslik1: 'Borçlu / Taahhüt Eden',
    imzaBaslik2: 'Müşterek Borçlu / Müteselsil Kefil',
    huzurdaImzaVarMi: false,
  },
  {
    id: 'genel-dilekce',
    baslik: 'Genel Resmî Muvafakat ve İzin Belgesi',
    formKodu: 'DİLEKÇE',
    kategori: 'genel',
    aciklama: 'Her türlü resmî başvuru, kurum izni, feragat veya beyan için düzenlenebilir genel format.',
    varsayilanKurum: 'T.C. SOSYAL GÜVENLİK KURUMU BAŞKANLIĞI',
    varsayilanAltBirim: 'Sosyal Güvenlik Merkezi Müdürlüğüne',
    varsayilanKonu: 'Resmî Muvafakat ve İzin Beyanı',
    yasalDayanak: '6183 sayılı Kanun ve ilgili mevzuat',
    metin: `Kurumunuz nezdinde kayıtlı [DOSYA_NO] numaralı işlem ve dosyaya ilişkin olarak;

Aşağıda kimlik ve iletişim bilgileri bulunan tarafımca, ilgili mevzuat çerçevesinde gerekli idari ve hukuki işlemlerin tesis edilmesine hiçbir tazyik altında kalmaksızın, hür irademle rıza ve muvafakat ettiğimi bildirir, gereğini saygılarımla arz ve talep ederim.`,
    imzaBaslik1: 'Muvafakat Eden',
    imzaBaslik2: 'Kurum Yetkilisi',
    huzurdaImzaVarMi: false,
  },
];
