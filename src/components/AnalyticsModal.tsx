import React, { useState, useEffect } from 'react';
import {
  X,
  BarChart3,
  Users,
  Calendar,
  Calculator,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Send,
  HelpCircle,
  RefreshCw,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import {
  getGaMeasurementId,
  setGaMeasurementId,
  fetchVisitorStats,
  sendTestEvent,
  VisitorStats
} from '../utils/analytics';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ isOpen, onClose }) => {
  const [gaId, setGaId] = useState('');
  const [currentGaId, setCurrentGaId] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testSent, setTestSent] = useState(false);
  const [stats, setStats] = useState<VisitorStats>({
    totalVisits: 0,
    todayVisits: 0,
    totalCalculations: 0,
    lastVisitAt: new Date().toISOString(),
  });
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'ga4'>('stats');

  useEffect(() => {
    if (isOpen) {
      const activeId = getGaMeasurementId();
      setGaId(activeId);
      setCurrentGaId(activeId);
      loadStats();
    }
  }, [isOpen]);

  const loadStats = async () => {
    setIsLoadingStats(true);
    try {
      const data = await fetchVisitorStats();
      setStats(data);
    } finally {
      setIsLoadingStats(false);
    }
  };

  if (!isOpen) return null;

  const handleSaveGa = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = gaId.trim().toUpperCase();
    setGaMeasurementId(clean);
    setCurrentGaId(clean);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSendTest = () => {
    const success = sendTestEvent();
    if (success) {
      setTestSent(true);
      setTimeout(() => setTestSent(false), 4000);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Bilinmiyor';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl rounded-3xl border shadow-2xl p-6 space-y-5 overflow-hidden flex flex-col max-h-[90vh]"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-primary)',
          color: 'var(--text-primary)',
        }}
      >
        {/* Üst Başlık */}
        <div className="flex items-center justify-between pb-3 border-b shrink-0" style={{ borderColor: 'var(--border-primary)' }}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                  Ziyaretçi Takibi &amp; Google Analytics
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3" />
                  Yönetici Paneli
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Yalnızca yöneticinin erişebildiği özel istatistik ve yapılandırma ekranı
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-500/10 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sekmeler */}
        <div className="flex gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Yerleşik Ziyaretçi Sayacı</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ga4')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'ga4'
                ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Google Analytics 4 (GA4)</span>
            {currentGaId && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Aktif" />
            )}
          </button>
        </div>

        {/* Sekme İçerikleri */}
        <div className="overflow-y-auto space-y-4 pr-1">
          {activeTab === 'stats' ? (
            <div className="space-y-4">
              {/* Bilgilendirme Kartı */}
              <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-900 dark:text-teal-100 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed space-y-1">
                  <p className="font-bold">Otomatik &amp; Gizlilik Odaklı Canlı Sayaç</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Siteniz canlıya alındığı andan itibaren her yeni ziyaret ve yapılan hesaplama buraya anlık olarak kaydedilir. Hiçbir kurulum yapmanıza gerek kalmadan kaç kişinin girdiğini görebilirsiniz.
                  </p>
                </div>
              </div>

              {/* İstatistik Kutuları */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl border bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Users className="w-3.5 h-3.5 text-blue-500" />
                      Toplam Giriş
                    </span>
                    <span className="text-[10px] text-slate-400">Tüm Zamanlar</span>
                  </div>
                  <div className="text-2xl font-black text-slate-800 dark:text-slate-100 font-mono">
                    {stats.totalVisits.toLocaleString('tr-TR')}
                  </div>
                  <div className="text-[10px] text-slate-400">Canlı linke tıklayan kişi/sayfa açılışı</div>
                </div>

                <div className="p-4 rounded-2xl border bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                      Bugünkü Giriş
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Bugün</span>
                  </div>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {stats.todayVisits.toLocaleString('tr-TR')}
                  </div>
                  <div className="text-[10px] text-slate-400">Bugün siteye yapılan ziyaret</div>
                </div>

                <div className="p-4 rounded-2xl border bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calculator className="w-3.5 h-3.5 text-amber-500" />
                      Yapılan Hesaplama
                    </span>
                    <span className="text-[10px] text-slate-400">İşlem</span>
                  </div>
                  <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
                    {stats.totalCalculations.toLocaleString('tr-TR')}
                  </div>
                  <div className="text-[10px] text-slate-400">Tecil / Maaş haczi hesabı</div>
                </div>

                <div className="p-4 rounded-2xl border bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-purple-500" />
                      Son Ziyaret
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-200 pt-2 font-mono">
                    {formatDate(stats.lastVisitAt)}
                  </div>
                  <div className="text-[10px] text-slate-400">Son oturum zamanı</div>
                </div>
              </div>

              {/* Yenile butonu */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={loadStats}
                  disabled={isLoadingStats}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStats ? 'animate-spin' : ''}`} />
                  <span>Verileri Yenile</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Google Analytics 4 Kartı */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-teal-600" />
                    Google Analytics 4 (GA4) Entegrasyonu
                  </span>
                  {currentGaId ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      Aktif: {currentGaId}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/15 text-amber-600 border border-amber-500/30">
                      <AlertCircle className="w-3 h-3" />
                      Bağlantı Bekleniyor
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Ziyaretçilerin şehirlerini, kullandıkları tarayıcıları, hangi sayfada ne kadar kaldıklarını ve canlı anlık haritayı doğrudan Google Analytics panonuzdan takip etmek için Ölçüm Kimliğinizi (Measurement ID) girin.
                </p>

                <form onSubmit={handleSaveGa} className="space-y-3 pt-1">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        Ölçüm Kimliği (Measurement ID):
                      </label>
                      <a
                        href="https://analytics.google.com"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:underline"
                      >
                        <span>Google Analytics'i Aç</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={gaId}
                        onChange={(e) => setGaId(e.target.value)}
                        placeholder="Örn: G-N54Q7K9876"
                        className="flex-1 px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs cursor-pointer shadow-sm transition-all"
                      >
                        Kaydet
                      </button>
                    </div>
                  </div>

                  {savedSuccess && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Google Analytics kimliği başarıyla kaydedildi ve etkinleştirildi!</span>
                    </div>
                  )}

                  {currentGaId && (
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={handleSendTest}
                        className="text-xs font-bold text-teal-600 hover:text-teal-500 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Google Analytics'e Test Sinyali Gönder</span>
                      </button>
                      {testSent && (
                        <span className="text-[11px] font-bold text-emerald-600 animate-pulse">
                          ✓ Sinyal iletildi! GA4 Gerçek Zamanlı panosuna bakın.
                        </span>
                      )}
                    </div>
                  )}
                </form>
              </div>

              {/* 3 Adımda GA4 Kurulum Rehberi */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-teal-600" />
                    G- ile Başlayan Kimliği 2 Dakikada Nasıl Alırsınız?
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    %100 Ücretsiz
                  </span>
                </div>

                <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                    <div>
                      <a href="https://analytics.google.com" target="_blank" rel="noreferrer" className="text-teal-600 dark:text-teal-400 font-bold underline inline-flex items-center gap-0.5">
                        analytics.google.com
                      </a> adresini yeni sekmede açın ve Gmail hesabınızla giriş yapın.
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                    <div>
                      Sol en alttaki <strong>Yönetici (Çark)</strong> simgesine tıklayın ve mavi <strong>"+ Mülk Oluştur"</strong> butonuna basın. Bir isim verin (Örn: <em>SGK Tecil</em>).
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
                    <div>
                      Platform olarak <strong>"Web"</strong>i seçin, site adresinizi yazıp <strong>"Akış Oluştur"</strong> deyin.
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">4</span>
                    <div>
                      Açılan ekranda sağ üstte beliren <strong>ÖLÇÜM KİMLİĞİ: G-XXXXXXXXXX</strong> kodunu kopyalayıp yukarıdaki kutucuğa yapıştırın ve <strong>Kaydet</strong> butonuna basın.
                    </div>
                  </div>
                </div>

                <div className="pt-1 text-[10px] text-slate-400 border-t border-slate-200 dark:border-slate-700/60 leading-normal">
                  💡 <em>Not: Google Analytics kullanmak istemiyorsanız, yan sekmedeki <strong>"Yerleşik Ziyaretçi Sayacı"</strong> hiçbir kurulum gerektirmeden ziyaretleri zaten otomatik saymaktadır.</em>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Alt Kapatma */}
        <div className="pt-3 border-t flex justify-end shrink-0" style={{ borderColor: 'var(--border-primary)' }}>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer transition-all"
          >
            Tamam / Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
