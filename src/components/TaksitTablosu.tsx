import React, { useState } from 'react';
import {
  Calendar,
  FileSpreadsheet,
  Copy,
  Check,
  Scale,
  Sparkles,
  Info,
  Clock,
  TrendingUp,
  Percent,
  Coins
} from 'lucide-react';
import { formatTL } from '../utils/calculator';
import { TaksitItem } from '../types';

interface TaksitTablosuProps {
  taksitler: TaksitItem[];
  toplamBorc: number;
  kalanBorc?: number;
  pesinat?: number;
  toplamFaiz: number;
  toplamOdeme: number;
  taksitSayisi: number;
  faizOrani?: number;
  planTipi?: 'kanuni' | 'esit';
  onPlanTipiChange?: (val: 'kanuni' | 'esit') => void;
  pesinatDahilMi?: boolean;
  onPesinatDahilMiChange?: (val: boolean) => void;
  ilkTaksitTutari?: number;
  sonTaksitTutari?: number;
  aylikSabitTaksit?: number;
}

export const TaksitTablosu: React.FC<TaksitTablosuProps> = ({
  taksitler,
  toplamBorc,
  kalanBorc,
  pesinat = 0,
  toplamFaiz,
  toplamOdeme,
  taksitSayisi,
  faizOrani = 39,
  planTipi = 'kanuni',
  onPlanTipiChange,
  ilkTaksitTutari,
  sonTaksitTutari,
  aylikSabitTaksit,
}) => {
  const [copied, setCopied] = useState(false);

  // Vadeli taksitler (peşinat hariç)
  const vadeliTaksitler = taksitler.filter((t) => !t.isPesinat);
  const effectiveIlkTaksit = ilkTaksitTutari || vadeliTaksitler[0]?.toplamTaksit || 0;
  const effectiveSonTaksit = sonTaksitTutari || vadeliTaksitler[vadeliTaksitler.length - 1]?.toplamTaksit || 0;
  const effectiveOrtalama = aylikSabitTaksit || (vadeliTaksitler.length > 0 ? (toplamFaiz + (kalanBorc || 0)) / vadeliTaksitler.length : 0);

  const copyTable = () => {
    let text = "TAKSİT\tANA PARA\tFAİZ\tTAKSİT TOPLAMI\tÖDEME TARİHİ\n";
    taksitler.forEach((t) => {
      const faizText = t.isPesinat || t.faiz === 0 ? "—" : `${formatTL(t.faiz)} ₺`;
      text += `${t.no}\t${formatTL(t.anaPara)} ₺\t${faizText}\t${formatTL(t.toplamTaksit)} ₺\t${t.vadeTarihi}\n`;
    });
    text += `TOPLAM\t${formatTL(toplamBorc)} ₺\t${formatTL(toplamFaiz)} ₺\t${formatTL(toplamOdeme)} ₺\t—\n`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportCSV = () => {
    let csv = "TAKSİT;ANA PARA;FAİZ;TAKSİT TOPLAMI;ÖDEME TARİHİ\n";
    taksitler.forEach((t) => {
      const faizText = t.isPesinat || t.faiz === 0 ? "—" : `${formatTL(t.faiz)} ₺`;
      csv += `${t.no};${formatTL(t.anaPara)} ₺;${faizText};${formatTL(t.toplamTaksit)} ₺;${t.vadeTarihi}\n`;
    });
    csv += `TOPLAM;${formatTL(toplamBorc)} ₺;${formatTL(toplamFaiz)} ₺;${formatTL(toplamOdeme)} ₺;—\n`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SGK-6183-48-Geri-Odeme-Plani-${taksitSayisi}ay.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toplamAnaParaHesaplanan = taksitler.reduce((acc, t) => acc + t.anaPara, 0);

  return (
    <div
      className="rounded-3xl border shadow-xl p-6 sm:p-8 space-y-6 group"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-primary)',
      }}
    >
      {/* Üst Başlık ve Eylemler */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b cursor-default" style={{ borderColor: 'var(--border-primary)' }}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:!text-white group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>{taksitSayisi} Aylık Resmî Geri Ödeme Planı</span>
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                planTipi === 'kanuni'
                  ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20'
                  : 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20'
              }`}>
                {planTipi === 'kanuni' ? '6183 m.48 Resmî SGK Usulü' : 'Eşit Sabit Taksit'}
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {planTipi === 'kanuni'
                ? '6183 sayılı Kanun m. 48 uyarınca ay sonu vadelerine göre basit gün faizli resmî cetvel'
                : 'Toplam tecil faizinin vadeli taksitlere eşit paylaştırıldığı ortalama plan'}
            </p>
          </div>
        </div>

        {/* Butonlar ve Plan Seçimi */}
        <div className="flex items-center flex-wrap gap-2">
          {onPlanTipiChange && (
            <div className="inline-flex p-1 rounded-2xl border bg-slate-100 dark:bg-slate-800/80" style={{ borderColor: 'var(--border-primary)' }}>
              <button
                type="button"
                onClick={() => onPlanTipiChange('kanuni')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  planTipi === 'kanuni'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="SGK ve Maliye sistemindeki ay sonu vadeli artan faizli resmî taksit planı"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>6183 m.48 Resmî Plan</span>
              </button>
              <button
                type="button"
                onClick={() => onPlanTipiChange('esit')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  planTipi === 'esit'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Toplam faizin eşit taksitlere dağıtıldığı ortalama taksitli model"
              >
                <span>Eşit Taksit</span>
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={copyTable}
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-500/10 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
          </button>

          <button
            type="button"
            onClick={exportCSV}
            className="px-3 py-1.5 rounded-xl border border-teal-500/40 text-teal-700 dark:text-teal-300 hover:bg-teal-500/10 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />
            <span>Excel / CSV</span>
          </button>
        </div>
      </div>

      {/* Özet İstatistik Kartları */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-2xl border" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-primary)' }}>
          <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 mb-1">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            <span>1. Vadeli Taksit:</span>
          </div>
          <div className="text-base font-black text-slate-800 dark:text-slate-100 font-mono">
            {formatTL(effectiveIlkTaksit)} ₺
          </div>
          <div className="text-[10px] text-teal-600 dark:text-teal-400 font-medium mt-0.5">
            İlk vadeli taksit tutarı
          </div>
        </div>

        <div className="p-3.5 rounded-2xl border" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-primary)' }}>
          <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
            <span>Son Taksit ({taksitSayisi}. Ay):</span>
          </div>
          <div className="text-base font-black text-slate-800 dark:text-slate-100 font-mono">
            {formatTL(effectiveSonTaksit)} ₺
          </div>
          <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mt-0.5">
            {planTipi === 'kanuni' ? 'En yüksek taksit tutarı' : 'Sabit tutarlı taksit'}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl border" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-primary)' }}>
          <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 mb-1">
            <Coins className="w-3.5 h-3.5 text-blue-600" />
            <span>Ortalama Aylık:</span>
          </div>
          <div className="text-base font-black text-teal-700 dark:text-teal-400 font-mono">
            {formatTL(effectiveOrtalama)} ₺
          </div>
          <div className="text-[10px] text-slate-400 font-medium mt-0.5">
            Vadeli taksit ortalaması
          </div>
        </div>

        <div className="p-3.5 rounded-2xl border" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-primary)' }}>
          <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 mb-1">
            <Percent className="w-3.5 h-3.5 text-purple-600" />
            <span>Toplam Tecil Faizi:</span>
          </div>
          <div className="text-base font-black text-purple-700 dark:text-purple-400 font-mono">
            {formatTL(toplamFaiz)} ₺
          </div>
          <div className="text-[10px] text-purple-600 dark:text-purple-400 font-medium mt-0.5">
            Yıllık %{faizOrani} oranıyla
          </div>
        </div>

        <div className="p-3.5 rounded-2xl border col-span-2 sm:col-span-1" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-primary)' }}>
          <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Toplam Geri Ödeme:</span>
          </div>
          <div className="text-base font-black text-emerald-700 dark:text-emerald-400 font-mono">
            {formatTL(toplamOdeme)} ₺
          </div>
          <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
            Peşinat + Tüm Taksitler
          </div>
        </div>
      </div>

      {/* 6183 Sayılı Kanun Madde 48 Bilgilendirme Notu */}
      <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-xs space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-teal-900 dark:text-teal-200">
          <Info className="w-4 h-4 text-teal-600 shrink-0" />
          <span>SGK Resmî 6183 Sayılı Kanun Madde 48 Gün Esaslı Formülü:</span>
        </div>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          SGK taksitlendirmelerinde taksit vadeleri takip eden ayların son günü olarak belirlenir. Tecil faizi, müracaat tarihinden her bir taksitin ödeme tarihine kadar geçen gün sayısı üzerinden basit faizle hesaplanır:{' '}
          <code className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 font-mono text-[11px] font-bold text-teal-700 dark:text-teal-300">
            Tecil Faizi = (Taksit Ana Parası × Yıllık Faiz Oranı × Gün Sayısı) / 36.000
          </code>
          . Peşinat, müracaat/işlem tarihinde derhal ödendiği için tecil faizi işletilmez (—).
        </p>
      </div>

      {/* Resmî Geri Ödeme Tablosu - Proje Temasıyla Tam Uyumlu */}
      <div className="overflow-hidden rounded-2xl border shadow-sm" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr
                className="border-b font-extrabold uppercase tracking-wider text-[11px] sm:text-xs"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-primary)',
                  color: 'var(--text-secondary)',
                }}
              >
                <th className="p-4 text-left font-black w-28">TAKSİT</th>
                <th className="p-4 text-right font-black">ANA PARA</th>
                <th className="p-4 text-right font-black text-amber-600 dark:text-amber-400">FAİZ</th>
                <th className="p-4 text-right font-black text-slate-900 dark:text-slate-100">TAKSİT TOPLAMI</th>
                <th className="p-4 text-right font-black">ÖDEME TARİHİ</th>
              </tr>
            </thead>
            <tbody className="divide-y font-mono" style={{ borderColor: 'var(--border-primary)' }}>
              {taksitler.map((t, idx) => {
                const isPesinatRow = t.isPesinat || t.no === 'Peşinat';

                return (
                  <tr
                    key={idx}
                    className="hover:bg-teal-500/5 transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {/* TAKSİT */}
                    <td className="p-4 text-left font-bold font-sans">
                      {isPesinatRow ? (
                        <span className="font-extrabold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                          Peşinat
                        </span>
                      ) : (
                        <span className="text-slate-500 font-semibold">{t.no}</span>
                      )}
                    </td>

                    {/* ANA PARA */}
                    <td className="p-4 text-right font-semibold text-slate-800 dark:text-slate-100">
                      {formatTL(t.anaPara)} ₺
                    </td>

                    {/* FAİZ */}
                    <td className="p-4 text-right font-bold text-amber-600 dark:text-amber-400">
                      {isPesinatRow || t.faiz === 0 ? (
                        <span className="text-slate-400 font-sans">—</span>
                      ) : (
                        `${formatTL(t.faiz)} ₺`
                      )}
                    </td>

                    {/* TAKSİT TOPLAMI */}
                    <td className="p-4 text-right font-black text-teal-700 dark:text-teal-400">
                      {formatTL(t.toplamTaksit)} ₺
                    </td>

                    {/* ÖDEME TARİHİ */}
                    <td className="p-4 text-right font-sans font-medium text-slate-600 dark:text-slate-400">
                      {t.vadeTarihi}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr
                className="border-t-2 font-mono font-bold text-xs sm:text-sm"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-primary)',
                }}
              >
                <td className="p-4 text-left font-black font-sans text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  TOPLAM
                </td>
                <td className="p-4 text-right font-black text-slate-900 dark:text-slate-100">
                  {formatTL(toplamAnaParaHesaplanan)} ₺
                </td>
                <td className="p-4 text-right font-black text-amber-600 dark:text-amber-400">
                  {formatTL(toplamFaiz)} ₺
                </td>
                <td className="p-4 text-right font-black text-teal-700 dark:text-teal-400 text-sm sm:text-base">
                  {formatTL(toplamOdeme)} ₺
                </td>
                <td className="p-4 text-right font-sans text-slate-400 font-bold">
                  —
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
