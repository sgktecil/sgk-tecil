import React from 'react';
import { MuvafakatnameBelgeData } from '../types/muvafakatname';
import { TCAyYildizEmblem, SGKEmblem, AdaletEmblem } from './Emblems';

interface A4DocumentProps {
  data: MuvafakatnameBelgeData;
}

export const A4Document: React.FC<A4DocumentProps> = ({ data }) => {
  const { baslik, ayarlar, borclu, metin, ekNotlar, imzalayan1, imzalayan2 } = data;

  // Paragraflara böl
  const paragraflar = metin.split('\n\n').filter((p) => p.trim().length > 0);

  const fontSizeClass =
    ayarlar.yaziBoyutu === 'sm'
      ? 'text-[11px] leading-relaxed'
      : ayarlar.yaziBoyutu === 'lg'
      ? 'text-[13px] leading-loose'
      : 'text-[12px] leading-relaxed';

  return (
    <div className="w-full flex justify-center py-4 bg-slate-200/70 dark:bg-slate-950/70 overflow-auto">
      {/* A4 Kağıt Konteyneri (210mm x 297mm oranlı) */}
      <div
        id="muvafakatname-a4-print"
        className="w-[210mm] min-h-[297mm] bg-white text-black p-[20mm] sm:p-[25mm] shadow-2xl rounded-sm print:shadow-none print:m-0 print:p-[20mm] print:w-full print:min-h-0 flex flex-col justify-between font-serif relative"
        style={{
          boxSizing: 'border-box',
          color: '#111827',
        }}
      >
        {/* ÜST BÖLÜM: BAŞLIK, AMBLEM VE ANTET */}
        <div>
          {ayarlar.antetVarMi && (
            <div className="text-center space-y-1 pb-4 border-b-2 border-black/80">
              <div className="flex items-center justify-between">
                {/* Sol Boşluk veya Logo */}
                <div className="w-16 h-16 flex items-center justify-center">
                  {ayarlar.amblemTuru === 'tc' && (
                    <TCAyYildizEmblem className="w-14 h-14 text-red-700 print:text-black" />
                  )}
                  {ayarlar.amblemTuru === 'sgk' && (
                    <SGKEmblem className="w-14 h-14 text-teal-800 print:text-black" />
                  )}
                  {ayarlar.amblemTuru === 'adalet' && (
                    <AdaletEmblem className="w-14 h-14 text-indigo-900 print:text-black" />
                  )}
                </div>

                {/* Orta Resmî Metin */}
                <div className="text-center flex-1 px-4">
                  <div className="font-extrabold text-[15px] tracking-wider uppercase font-sans">
                    {ayarlar.kurumAdi || 'T.C. SOSYAL GÜVENLİK KURUMU BAŞKANLIĞI'}
                  </div>
                  {ayarlar.altBirimAdi && (
                    <div className="font-bold text-[12px] tracking-wide uppercase font-sans text-slate-800">
                      {ayarlar.altBirimAdi}
                    </div>
                  )}
                </div>

                {/* Sağ Tarih / Evrak No */}
                <div className="w-28 text-right text-[10.5px] font-sans font-medium text-slate-700">
                  {ayarlar.tarihGoster && (
                    <div>
                      <strong>Tarih:</strong> {ayarlar.evrakTarihi || new Date().toLocaleDateString('tr-TR')}
                    </div>
                  )}
                  {ayarlar.evrakSayisi && (
                    <div>
                      <strong>Sayı:</strong> {ayarlar.evrakSayisi}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* EVRAK BİLGİ SATIRI (Dosya No, Konu) */}
          <div className="my-5 flex items-start justify-between text-[11.5px] font-sans border-b border-dashed border-slate-300 pb-3">
            <div className="space-y-0.5">
              {ayarlar.dosyaNo && (
                <div>
                  <span className="font-bold">Takip / Dosya No:</span> {ayarlar.dosyaNo}
                </div>
              )}
              {ayarlar.konu && (
                <div>
                  <span className="font-bold">Konu:</span> {ayarlar.konu}
                </div>
              )}
            </div>
            {borclu.sgkSicilNo && (
              <div className="text-right">
                <span className="font-bold">SGK Sicil No:</span> {borclu.sgkSicilNo}
              </div>
            )}
          </div>

          {/* BELGE BAŞLIĞI */}
          <div className="text-center my-6">
            <h1 className="text-[16px] sm:text-[17px] font-black tracking-wider uppercase font-sans border-b-2 border-black inline-block pb-1">
              {baslik || 'RESMÎ MUVAFAKATNAME'}
            </h1>
          </div>

          {/* MUHATAP MAKAMA HİTAP */}
          <div className="text-center font-bold text-[13px] tracking-wide mb-6 uppercase font-sans">
            {ayarlar.kurumAdi ? `${ayarlar.kurumAdi} MAKAMINA` : 'İLGİLİ MAKAMA'}
          </div>

          {/* BORÇLU / MUVAFAKAT EDEN BİLGİ KUTUSU */}
          <div className="mb-6 border border-black/40 rounded-sm p-3 bg-slate-50/50 text-[11px] font-sans">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="font-bold text-slate-700">Muvafakat Eden (Borçlu):</span>{' '}
                <span className="font-extrabold">{borclu.adSoyad || '—'}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">T.C. / Vergi Kimlik No:</span>{' '}
                <span className="font-mono font-bold">{borclu.tcknVkn || '—'}</span>
              </div>
              {borclu.isyeriUnvan && (
                <div className="col-span-2">
                  <span className="font-bold text-slate-700">İşyeri / Ünvan:</span>{' '}
                  <span>{borclu.isyeriUnvan}</span>
                </div>
              )}
              {borclu.adres && (
                <div className="col-span-2">
                  <span className="font-bold text-slate-700">Tebligat Adresi:</span>{' '}
                  <span>{borclu.adres}</span>
                </div>
              )}
            </div>
          </div>

          {/* GÖVDE METNİ */}
          <div className={`space-y-4 text-justify ${fontSizeClass}`}>
            {paragraflar.map((paragraf, idx) => (
              <p
                key={idx}
                className="indent-8 leading-relaxed font-serif"
                style={{ textAlign: 'justify', textJustify: 'inter-word' }}
              >
                {paragraf}
              </p>
            ))}

            {ekNotlar && (
              <div className="mt-4 p-2.5 bg-amber-50/60 border-l-4 border-amber-600 text-[11px] font-sans">
                <strong>Ek Açıklama &amp; Not:</strong> {ekNotlar}
              </div>
            )}
          </div>
        </div>

        {/* ALT BÖLÜM: İMZA BLOKLARI VE RESMÎ MÜHÜR ALANI */}
        <div className="mt-12 pt-6">
          <div className="flex items-start justify-between gap-8 text-center font-sans">
            {/* 1. İmza: Muvafakat Eden */}
            <div className="flex-1 space-y-1">
              <div className="text-[11px] font-bold text-slate-600 uppercase">
                {imzalayan1.unvan || 'Muvafakat Eden (Borçlu)'}
              </div>
              <div className="font-bold text-[12px]">{imzalayan1.adSoyad || borclu.adSoyad}</div>
              <div className="text-[10px] text-slate-500">Tarih: {ayarlar.evrakTarihi || new Date().toLocaleDateString('tr-TR')}</div>
              <div className="h-16 flex items-center justify-center text-[10px] text-slate-400 italic">
                (İmza / Kaşe)
              </div>
            </div>

            {/* 2. İmza: Onaylayan Yetkili Makam / İşveren (Opsiyonel) */}
            {ayarlar.ikinciImzaVarMi && (
              <div className="flex-1 space-y-1">
                <div className="text-[11px] font-bold text-slate-600 uppercase">
                  {imzalayan2?.unvan || 'Kurum Yetkilisi / Onay'}
                </div>
                <div className="font-bold text-[12px]">{imzalayan2?.adSoyad || 'Yetkili İmza'}</div>
                <div className="text-[10px] text-slate-500">Mühür / Kaşe</div>
                <div className="h-16 flex items-center justify-center text-[10px] text-slate-400 italic">
                  (İmza / Resmî Mühür)
                </div>
              </div>
            )}
          </div>

          {/* DİPNOT VE YASAL BİLGİ */}
          <div className="mt-8 pt-3 border-t border-slate-300 flex items-center justify-between text-[9px] font-sans text-slate-500">
            <div>
              İşbu resmî muvafakatname 6183 sayılı Kanun ve 2004 sayılı İİK hükümleri uyarınca düzenlenmiştir.
            </div>
            <div>Sayfa: 1 / 1</div>
          </div>
        </div>
      </div>
    </div>
  );
};
