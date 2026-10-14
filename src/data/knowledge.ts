export interface KnowledgeItem {
  id: string;
  category: '6183' | '5510' | 'genelge';
  title: string;
  summary: string;
  content: string;
  tags: string[];
}

export const KNOWLEDGE_BASE: KnowledgeItem[] = [
  {
    id: 'kademeli-tecil-36ay',
    category: 'genelge',
    title: '⚠️ Kademeli Tecil Uygulaması: 36 Ayı Aşan Sürelerde Uygulanamaz',
    summary: '2024/12 ve 2026/15 Genelgeleri uyarınca, 36 ayı aşan (37 - 72 ay arası) tecil ve taksitlendirmelerde kademeli taksitlendirme kesinlikle uygulanamaz.',
    content: `
6183 Sayılı Kanun 48. Maddesi ve SGK 2024/12 (2026/15 Değişikliği) Genelgesi Uyarınca Kademeli Tecil Esasları:

1. Kademeli Taksitlendirme Şartı:
Borçlunun mali durumunun taksitleri eşit miktarlarda ödemeye elverişli olmaması ve talep etmesi halinde kademeli tecil uygulanabilir.

2. Azami Süre Sınırı:
- ⚠️ 36 ayı aşan (37 ila 72 ay) tecil ve taksitlendirmelerde KADEMELİ TECİL UYGULAMASI YAPILMAZ!
- Kademeli taksitlendirme yalnızca azami 36 aya kadar olan teciller için mümkündür.

3. Kademeli Taksit Kuralları (1 - 36 Ay Arası):
- Kademeli ödeme planında her kademe en az 6 ay, en çok 12 ay sürebilir.
- İlk kademe taksit tutarı, kalan borcun eşit taksit tutarının %50'sinden az olamaz.
- Son kademe taksit tutarları, önceki kademelerden düşük belirlenemez.
    `,
    tags: ['kademeli tecil', '36 ay sınırı', 'genelge', 'eşit taksit', 'ödeme planı'],
  },
  {
    id: '6183-48-genel-esaslar',
    category: '6183',
    title: '6183 Sayılı Kanun 48. Madde Tecil ve Taksitlendirme Esasları',
    summary: 'Kamu alacaklarının tecil şartları, başvuru, peşinat, tecil faizi oranı ve teminat yükümlülükleri.',
    content: `
6183 Sayılı Amme Alacaklarının Tahsil Usulü Hakkında Kanunun 48. Maddesi:

1. Çok Zor Durum Şartı:
Amme borçlusunun borcunu defaten ödemesi halinde "çok zor duruma" düşecek olması gerekir.

2. Peşinat Yükümlülüğü:
Tecil başvurusunda toplam borcun en az 1/10'u (yüzde onu) veya ilk taksit tutarı peşinat olarak tahsil edilir.

3. Tecil Faizi:
Tecil edilen borçlara yıllık %39 (veya güncel yasal oran) üzerinden basit faiz formülüyle tecil faizi uygulanır.

4. Teminat Yükümlülüğü:
- 10.000.000 TL ve altındaki borçlarda teminat aranmaz.
- 10.000.000 TL üzerindeki borçlarda aşan kısmın yarısı (%50'si) tutarında teminat gösterilmesi zorunludur.
    `,
    tags: ['6183/48', 'tecil faizi', 'teminat', 'peşinat', 'amme alacağı'],
  },
  {
    id: 'cok-zor-durum-likidite',
    category: 'genelge',
    title: 'Çok Zor Durum Tespiti ve Likidite Oranı Formülleri',
    summary: 'Bilanço ve işletme hesabı esasına göre likidite oranı hesaplama ve azami taksit süreleri.',
    content: `
Likidite Oranı ve Taksit Süresi İlişkisi (2024/12 & 2026/15 Genelgeleri):

1. Formüller:
- Bilanço Esasına Göre: (Dönen Varlıklar - Stoklar) / Kısa Vadeli Yabancı Kaynaklar
- İşletme Hesabı Esasına Göre: (Kasa + Banka + Kısa Vadeli Alacaklar) / Kısa Vadeli Borçlar

2. Likidite Rasyosu Değerlendirmesi:
- 1,01 ve üzeri: Borçlu çok zor durumda kabul edilmez; tecil talebi REDDEDİLİR.
- 0,51 - 1,00 aralığı: Çok zor durum kabul edilir; AZAMİ 36 AY tecil verilebilir.
- 0,50 ve altı: Çok zor durum kabul edilir; AZAMİ 72 AY tecil verilebilir.

3. Raporlama Yetkisi:
- 900.000 TL üzeri borçlarda SMMM veya YMM tarafından düzenlenen Çok Zor Durum Raporu (Ek-1/a) aranır.
- 900.000 TL ve altı borçlarda borçlunun Mali Durum Bildirim Formu (Ek-1/b) esas alınır.
    `,
    tags: ['likidite oranı', 'çok zor durum', 'bilanço', 'işletme hesabı', 'azami taksit'],
  },
  {
    id: '5510-sayili-kanun-tecil',
    category: '5510',
    title: '5510 Sayılı Kanun Kapsamında Prim Erteleme ve Taksitlendirme',
    summary: 'Sosyal Güvenlik Kanunu kapsamında afet, olağanüstü hal ve mücbir sebep hallerinde prim erteleme esasları.',
    content: `
5510 Sayılı Sosyal Sigortalar ve Genel Sağlık Sigortası Kanunu Esasları:

1. Doğal Afet ve Mücbir Sebep Ertelemesi:
Yangın, su baskını, deprem gibi afetlerde Kurum Yönetim Kurulu kararıyla prim borçları 1 yıla kadar ertelenebilir ve faizsiz/gecikme zammı indirimiyle taksitlendirilebilir.

2. Sigortalılık Hakları:
Tecil ve taksitlendirmesi devam eden ve aksatılmayan işverenler ve sigortalılar 'Borcu Yoktur' belgesi alabilir ve sağlık yardımlarından kesintisiz faydalanır.
    `,
    tags: ['5510', 'mücbir sebep', 'afet', 'prim erteleme', 'sağlık aktivasyonu'],
  },
];
