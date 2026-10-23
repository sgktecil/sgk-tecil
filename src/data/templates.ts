import { MuvafakatnameTemplate } from '../types/muvafakatname';

export const MUVAFAKATNAME_TEMPLATES: MuvafakatnameTemplate[] = [
  {
    id: 'maas-haczi',
    baslik: 'Maaş Haczi Kesinti Muvafakatnamesi (İİK m. 83)',
    kategori: 'maas',
    aciklama: 'Borçlunun maaşından yasal 1/4 oranını aşan tutarda kesinti yapılmasına izin veren resmî muvafakat belgesi.',
    varsayilanKurum: 'T.C. SOSYAL GÜVENLİK KURUMU BAŞKANLIĞI',
    varsayilanKonu: 'Maaş Haczi ve Kesinti Muvafakati',
    yasalDayanak: '2004 sayılı İİK m. 83 ve 6183 sayılı Kanun m. 71',
    metin: `Kurumunuz nezdinde [DOSYA_NO] takip/dosya numarası ile aleyhime başlatılmış bulunan icra takibi ve tahakkuk eden kamu alacağına mahsuben;

Halen çalışmakta olduğum işyerimden almakta olduğum aylık net maaş, ücret ve her türlü yan ödemelerimden (ikramiye, prim, kıdem/ihbar tazminatı vb. dahil olmak üzere), 2004 sayılı İcra ve İflas Kanunu'nun 83. maddesindeki yasal 1/4 kesinti sınırına bağlı kalınmaksızın, borcun tamamı fer'ileriyle birlikte tasfiye edilinceye kadar aylık [KESINTI_TUTARI] kesinti yapılmasına kendi hür irademle rıza ve muvafakat ediyorum.

İşbu muvafakatnameyi kendi istek ve arzumla, hiçbir baskı ve tesir altında kalmaksızın imzaladığımı, yapılan kesintilere karşı hiçbir itirazda bulunmayacağımı beyan ve taahhüt ederim.`,
    imzaBaslik1: 'Muvafakat Eden (Borçlu)',
    imzaBaslik2: 'İşveren / Yetkili Makam Onayı',
  },
  {
    id: 'emekli-maas',
    baslik: 'Emekli Maaşı Haczi Muvafakatnamesi (5510 s.K. m. 93)',
    kategori: 'maas',
    aciklama: '5510 sayılı Kanun Madde 93 gereğince emekli aylığından borca mahsuben haciz ve kesinti yapılmasına dair açık muvafakat.',
    varsayilanKurum: 'T.C. SOSYAL GÜVENLİK KURUMU BAŞKANLIĞI',
    varsayilanKonu: 'Emekli Aylığından Haciz Kesintisi Yapılmasına İlişkin Muvafakat',
    yasalDayanak: '5510 sayılı Kanun m. 93 ve 6183 sayılı Kanun hükümleri',
    metin: `Kurumunuzdan almakta olduğum emekli aylığımdan (Emekli Sicil / Tahsis No: [TAHSIS_NO]), Kurumunuza olan [DOSYA_NO] sayılı prim ve kamu borcuma mahsuben;

5510 sayılı Sosyal Sigortalar ve Genel Sağlık Sigortası Kanunu'nun 93. maddesi hükmü uyarınca emekli aylıklarının haczedilemeyeceği kuralını bilerek ve bu hakkımdan feragat ederek; borcum tamamen ödenip kapanıncaya kadar her ay emekli aylığımdan [KESINTI_ORANI_TUTARI] tutarında kesinti yapılarak Kurumunuz ilgili hesabına aktarılmasına açıkça ve bila-kaydü şart muvafakat ediyorum.

Yapılacak kesintilere karşı hiçbir hukuki ve idari itirazda bulunmayacağımı, kesintilerin aksamadan devam etmesini talep ederim.`,
    imzaBaslik1: 'Muvafakat Eden (Emekli Borçlu)',
    imzaBaslik2: 'SGK Kabul ve Teslim Alan Yetkili',
  },
  {
    id: 'banka-bloke',
    baslik: 'Banka Hesabı Bloke Kaldırma ve Mahsup Muvafakatnamesi',
    kategori: 'banka',
    aciklama: 'Bankalardaki hacizli hesaplardan borcun tahsili ve kalan tutar üzerindeki blokenin kaldırılması talebi.',
    varsayilanKurum: 'T.C. SOSYAL GÜVENLİK KURUMU BAŞKANLIĞI',
    varsayilanKonu: 'Banka Haczi / Bloke Kaldırma ve Mahsup Talebi',
    yasalDayanak: '6183 sayılı Kanun m. 62 ve 79',
    metin: `Kurumunuz nezdindeki [DOSYA_NO] takip dosyası kapsamında [BANKA_ADI] nezdinde bulunan [HESAP_NO/IBAN] numaralı hesabım üzerine konulan e-haciz ve bloke işlemine istinaden;

Hesabımda bulunan bakiyeden toplam [MAHSUP_TUTARI] tutarındaki kısmın dosya borcuma mahsuben Kurumunuz hesaplarına aktarılmasını, aktarım sağlandıktan sonra kalan bakiye ile hesap üzerindeki e-haciz ve blokelerin ivedilikle kaldırılmasını saygılarımla arz ve talep ederim.`,
    imzaBaslik1: 'Hesap Sahibi / Borçlu',
    imzaBaslik2: 'İcra Takip Servisi Şefi',
  },
  {
    id: 'tasinmaz-satis',
    baslik: 'Taşınmaz (Gayrimenkul) Rızaen Satış ve Haciz Muvafakatnamesi',
    kategori: 'tasinmaz',
    aciklama: 'Hacizli taşınmazın rızaen satışına izin verilmesi ve satış bedelinden borcun kapatılması muvafakati.',
    varsayilanKurum: 'T.C. SOSYAL GÜVENLİK KURUMU BAŞKANLIĞI',
    varsayilanKonu: 'Taşınmazın Rızaen Satışı ve Haciz Fekki Muvafakatnamesi',
    yasalDayanak: '6183 sayılı Kanun m. 74 ve İİK m. 111/a',
    metin: `Maliki bulunduğum [IL_ILCE] sınırları dahilinde bulunan, Tapu Sicil Müdürlüğü'nün [ADA_PARSEL] ada/parsel sayısında kayıtlı [TASINMAZ_NITELIGI] niteliğindeki gayrimenkulüm üzerine Kurumunuzca [DOSYA_NO] dosya kapsamında tatbik edilen haczin fekki amacıyla;

Söz konusu taşınmazın üçüncü kişiye rızaen satışının gerçekleştirilmesi, satış bedelinden Kurumunuz asıl alacak, gecikme zammı ve takip masrafları toplamı olan [BORC_TUTARI] tutarın doğrudan tapu devri esnasında veya Kurum veznesine/hesabına peşinen ödenmesi koşuluyla haczin kaldırılmasına muvafakat ettiğimi beyan ve taahhüt ederim.`,
    imzaBaslik1: 'Taşınmaz Maliki (Borçlu)',
    imzaBaslik2: 'Gayrimenkul Satış Komisyonu',
  },
  {
    id: 'arac-muvafakat',
    baslik: 'Araç / Taşıt Satış İzni ve Haciz Kaldırma Muvafakatnamesi',
    kategori: 'tasit',
    aciklama: 'Hacizli veya yakalamalı aracın satışı için noterlik devrine izin verilmesi muvafakati.',
    varsayilanKurum: 'T.C. SOSYAL GÜVENLİK KURUMU BAŞKANLIĞI',
    varsayilanKonu: 'Araç Satış İzni ve Noter Devir Muvafakatnamesi',
    yasalDayanak: '6183 sayılı Kanun m. 70 ve 84',
    metin: `Mülkiyeti adıma/şirketimize ait olan [PLAKA_NO] plakalı, [SASI_NO] şasi numaralı [MARKA_MODEL] aracım üzerine [DOSYA_NO] takip dosyası kapsamında konulmuş olan haciz ve yakalama şerhinin;

Aracın noterlik nezdinde üçüncü şahsa devri karşılığında elde edilecek bedelden Kurumunuzun [BORC_TUTARI] tutarındaki borcunun def'aten ödenmesi kaydıyla, noter satışına muvafakat edildiğinin ilgili Noterlikler Birliği (ARTES) sistemine bildirilmesini ve haczin kaldırılmasını saygılarımla arz ederim.`,
    imzaBaslik1: 'Araç Ruhsat Sahibi (Borçlu)',
    imzaBaslik2: 'Araç Satış Servisi Yetkilisi',
  },
  {
    id: '6183-taahhutname',
    baslik: '6183 Sayılı Kanun Madde 48 Tecil ve Taksitlendirme Taahhütnamesi',
    kategori: 'taahhut',
    aciklama: 'Borcun belirlenen takvimde eşit veya kademeli ödeneceğine ilişkin resmî taahhütname.',
    varsayilanKurum: 'T.C. SOSYAL GÜVENLİK KURUMU BAŞKANLIĞI',
    varsayilanKonu: '6183/48 Tecil ve Taksitlendirme Ödeme Taahhüdü',
    yasalDayanak: '6183 sayılı AATUHK Madde 48 ve SGK 2024/12 Genelgesi',
    metin: `Kurumunuza olan [DOSYA_NO] sicil/dosya numaralı prim, idari para cezası ve fer'ilerinden oluşan toplam [TOPLAM_BORC] borcumu;

6183 sayılı Amme Alacaklarının Tahsil Usulü Hakkında Kanun'un 48. maddesi ve SGK 2024/12 sayılı Genelgesi çerçevesinde peşinat tutarı olan [PESINAT_TUTARI] derhal ödemek kaydıyla, bakiye borcumu [VADE_AY] ay eşit/kademeli taksitle tecil faiziyle birlikte eksiksiz ödeyeceğimi;

Taksitlerden birini veya cari ay primlerimi yasal süresinde ödemediğim takdirde tecil ve taksitlendirmemin ihlal olacağını, teminatların derhal paraya çevrileceğini ve cebri icra işlemlerine kalındığı yerden devam edileceğini gayrikabili rücu kabul, beyan ve taahhüt ederim.`,
    imzaBaslik1: 'Borçlu / Taahhüt Eden',
    imzaBaslik2: 'Müşterek Borçlu / Müteselsil Kefil',
  },
  {
    id: 'genel-dilekce',
    baslik: 'Genel Resmî Muvafakat ve İzin Belgesi',
    kategori: 'genel',
    aciklama: 'Her türlü resmî başvuru, izin, yetki ve açık rıza beyanı için düzenlenebilir şablon.',
    varsayilanKurum: 'T.C. SOSYAL GÜVENLİK KURUMU BAŞKANLIĞI',
    varsayilanKonu: 'Resmî Muvafakat ve İzin Beyanı',
    yasalDayanak: '6183 sayılı Kanun ve ilgili mevzuat',
    metin: `Kurumunuz nezdinde kayıtlı [DOSYA_NO] numaralı işlem ve dosyaya ilişkin olarak;

Aşağıda kimlik ve iletişim bilgileri bulunan tarafımca, [ACIKLAMA_VE_TALEP_METNI] hususunda gerekli idari ve hukuki işlemlerin tesis edilmesine hiçbir tazyik altında kalmaksızın, hür irademle rıza ve muvafakat ettiğimi bildirir, gereğini saygılarımla arz ve talep ederim.`,
    imzaBaslik1: 'Muvafakat Eden',
    imzaBaslik2: 'Kurum Yetkilisi',
  },
];
