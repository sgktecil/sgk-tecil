import React, { useState } from 'react';
import { Layers, ChevronDown, Check, ArrowRight } from 'lucide-react';
import { formatTL, calculate6183 } from '../utils/calculator';

interface VadeKarsilastirmaProps {
  anaBorc: number;
  pesinatTarihi: string;
  faizOrani: number;
  onSelectVade: (vade: number) => void;
}

export const VadeKarsilastirma: React.FC<VadeKarsilastirmaProps> = ({
  anaBorc,
  pesinatTarihi,
  faizOrani,
  onSelectVade,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const vades = [6, 12, 18, 24, 30, 36, 48, 60, 72];

  return (
    <div
      className="rounded-3xl border shadow-xl p-6 sm:p-8 space-y-4 group"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-primary)',
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-purple-600/10 text-purple-600 dark:text-purple-400 group-hover:bg-purple-600 group-hover:!text-white group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>Alternatif Vade Seçenekleri Karşılaştırma Listesi (6 - 72 Ay)</span>
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Farklı vadelerdeki aylık taksit tutarlarını ve faiz yüklerini inceleyin
            </p>
          </div>
        </div>

        <div className={`p-2 rounded-full border transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      {isOpen && (
        <div className="pt-4 border-t space-y-3" style={{ borderColor: 'var(--border-primary)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {vades.map((v) => {
              const res = calculate6183(anaBorc, v, 0, pesinatTarihi, faizOrani);
              const isLong = v > 36;

              return (
                <div
                  key={v}
                  onClick={() => onSelectVade(v)}
                  className="p-3.5 rounded-2xl border transition-all cursor-pointer hover:border-teal-500 hover:shadow-md relative overflow-hidden group"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border-primary)',
                  }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                      {v} Ay Vade
                    </span>
                    {isLong && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold">
                        Likidite ≤ 0.50
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between items-baseline">
                      <span className="text-slate-500 text-[11px]">1. Taksit:</span>
                      <span className="font-black text-teal-700 dark:text-teal-400">
                        {formatTL(res.ilkTaksitTutari)} ₺
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-slate-500 font-sans text-[11px]">Son Taksit:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {formatTL(res.sonTaksitTutari)} ₺
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500 font-sans">Toplam Faiz:</span>
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">
                        {formatTL(res.toplamFaiz)} ₺
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t flex items-center justify-between text-[11px] text-teal-600 font-bold group-hover:translate-x-0.5 transition-transform">
                    <span>Bu Vadeyi Seç</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
