import React, { useState } from 'react';
import {
  Calendar,
  FileSpreadsheet,
  Copy,
  Check,
  ChevronDown,
  Layers
} from 'lucide-react';
import { formatTL } from '../utils/calculator';
import { TaksitItem } from '../types';

interface TaksitTablosuProps {
  taksitler: TaksitItem[];
  toplamBorc: number;
  toplamFaiz: number;
  toplamOdeme: number;
  taksitSayisi: number;
}

export const TaksitTablosu: React.FC<TaksitTablosuProps> = ({
  taksitler,
  toplamBorc,
  toplamFaiz,
  toplamOdeme,
  taksitSayisi,
}) => {
  const [copied, setCopied] = useState(false);

  const copyTable = () => {
    let text = "Taksit No\tVade Tarihi\tAna Para (TL)\tKalan Ana Para (TL)\tTecil Faizi (TL)\tToplam Taksit (TL)\n";
    taksitler.forEach((t) => {
      text += `${t.no}\t${t.vadeTarihi}\t${formatTL(t.anaPara)}\t${formatTL(t.kalanAnaPara)}\t${formatTL(t.faiz)}\t${formatTL(t.toplamTaksit)}\n`;
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportCSV = () => {
    let csv = "Taksit No;Vade Tarihi;Ana Para;Kalan Ana Para;Tecil Faizi;Toplam Taksit\n";
    taksitler.forEach((t) => {
      csv += `${t.no};${t.vadeTarihi};${formatTL(t.anaPara)};${formatTL(t.kalanAnaPara)};${formatTL(t.faiz)};${formatTL(t.toplamTaksit)}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SGK-6183-48-Taksit-Plani-${taksitSayisi}ay.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="rounded-3xl border shadow-xl p-6 sm:p-8 space-y-6 group"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-primary)',
      }}
    >
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b cursor-default" style={{ borderColor: 'var(--border-primary)' }}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:!text-white group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>{taksitSayisi} Aylık Resmî Geri Ödeme Planı</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Eşit taksitli 6183 sayılı Kanun 48. madde hesaplama tablosu
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copyTable}
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-500/10 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Kopyalandı' : 'Tabloyu Kopyala'}</span>
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

      {/* Taksit Tablosu */}
      <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: 'var(--border-primary)' }}>
        <table className="w-full text-left text-xs">
          <thead>
            <tr
              className="border-b font-extrabold uppercase tracking-wider text-[11px]"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-primary)',
                color: 'var(--text-secondary)',
              }}
            >
              <th className="p-3.5 text-center w-14">Taksit</th>
              <th className="p-3.5">Vade Tarihi</th>
              <th className="p-3.5 text-right">Ana Para Payı</th>
              <th className="p-3.5 text-right">Kalan Ana Para</th>
              <th className="p-3.5 text-right">Tecil Faizi</th>
              <th className="p-3.5 text-right font-black text-slate-900 dark:text-slate-100">
                Aylık Taksit Tutarı
              </th>
            </tr>
          </thead>
          <tbody className="divide-y font-mono" style={{ borderColor: 'var(--border-primary)' }}>
            {taksitler.map((t) => (
              <tr
                key={t.no}
                className="hover:bg-teal-500/5 transition-colors"
                style={{ color: 'var(--text-primary)' }}
              >
                <td className="p-3 text-center font-bold font-sans text-slate-500">{t.no}</td>
                <td className="p-3 font-semibold font-sans">{t.vadeTarihi}</td>
                <td className="p-3 text-right">{formatTL(t.anaPara)} ₺</td>
                <td className="p-3 text-right text-slate-500">{formatTL(t.kalanAnaPara)} ₺</td>
                <td className="p-3 text-right text-amber-600 dark:text-amber-400 font-semibold">
                  {formatTL(t.faiz)} ₺
                </td>
                <td className="p-3 text-right font-black text-teal-700 dark:text-teal-400">
                  {formatTL(t.toplamTaksit)} ₺
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr
              className="border-t-2 font-mono font-bold text-xs"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-primary)',
              }}
            >
              <td colSpan={2} className="p-3.5 font-bold font-sans text-slate-900 dark:text-slate-100">
                TOPLAM YEKÛN:
              </td>
              <td className="p-3.5 text-right">{formatTL(toplamBorc)} ₺</td>
              <td className="p-3.5 text-right text-slate-500">-</td>
              <td className="p-3.5 text-right text-amber-600 dark:text-amber-400">{formatTL(toplamFaiz)} ₺</td>
              <td className="p-3.5 text-right font-black text-sm text-teal-700 dark:text-teal-400">
                {formatTL(toplamOdeme)} ₺
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
