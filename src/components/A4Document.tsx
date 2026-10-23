import React from 'react';
import { MuvafakatnameBelgeData } from '../types/muvafakatname';
import { TCAyYildizEmblem, SGKEmblem, AdaletEmblem } from './Emblems';

interface A4DocumentProps {
  data: MuvafakatnameBelgeData;
}

export const A4Document: React.FC<A4DocumentProps> = ({ data }) => {
  const { baslik, ayarlar, borclu, asilBorclu, teminat, metin, ekNotlar, imzalayan1, imzalayan2, sgkZapti } = data;

  // Paragraflara ayır
  const paragraflar = (metin || '').split('\n\n').filter((p) => p.trim().length > 0);

  const fontSizeClass =
    ayarlar.yaziBoyutu === 'sm'
      ? 'text-[10.5px] leading-relaxed'
      : ayarlar.yaziBoyutu === 'lg'
      ? 'text-[12.5px] leading-loose'
      : 'text-[11.5px] leading-relaxed';

  const fontFamClass = ayarlar.yaziTipi === 'sans' ? 'font-sans' : 'font-serif';

  return (
    <div className="w-full flex justify-center py-2 sm:py-4 overflow-auto">
      {/* A4 Kağıt Konteyneri (210mm x 297mm oranlı) */}
      <div
        id="muvafakatname-a4-print"
        className={`w-[210mm] min-h-[297mm] bg-white text-slate-900 p-[16mm] sm:p-[20mm] shadow-2xl rounded-sm print:shadow-none print:m-0 print:p-[14mm] print:w-full print:min-h-0 flex flex-col justify-between ${fontFamClass} relative border border-slate-300 print:border-none`}
        style={{
          boxSizing: 'border-box',
          color: '#0f172a',
        }}
      >
        {/* ÜST SAĞ KÖŞE: RESMÎ EK-9 ETİKETİ */}
        {ayarlar.formKoduGoster && (
          <div className="absolute top-[12mm] right-[16mm] sm:right-[20mm] print:top-[10mm] print:right-[14mm]">
            <div className="border-2 border-black px-3.5 py-1 text-center bg-white">
              <span className="font-extrabold text-[12px] sm:text-[13px] tracking-widest font-sans uppercase">
                {ayarlar.formKodu || 'EK-9'}
              </span>
            </div>
          </div>
        )}

        {/* ÜST BÖLÜM: ANTET, AMBLEM VE KURUM BİLGİSİ */}
        <div>
          {ayarlar.antetVarMi && (
            <div className="pb-3 border-b-2 border-black/90">
              <div className="flex items-center justify-between">
                {/* Sol Logo / Amblem */}
                <div className="w-16 h-16 flex items-center justify-start shrink-0">
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

                {/* Orta Resmî Antet */}
                <div className="text-center flex-1 px-2">
                  <div className="font-black text-[14px] sm:text-[15px] tracking-wider uppercase font-sans text-slate-950">
                    {ayarlar.kurumAdi || 'T.C. SOSYAL GÜVENLİK KURUMU BAŞKANLIĞI'}
                  </div>
                  {ayarlar.altBirimAdi && (
                    <div className="font-bold text-[11.5px] sm:text-[12px] tracking-wide uppercase font-sans text-slate-800 mt-0.5">
                      {ayarlar.altBirimAdi}
                    </div>
                  )}
                </div>

                {/* Sağ Boşluk (EK-9 rozeti için simetrik denge) */}
                <div className="w-16 shrink-0" />
              </div>
            </div>
          )}

          {/* EVRAK BİLGİ SATIRI (Dosya No, Konu, Tarih) */}
          <div className="my-3.5 flex items-start justify-between text-[10.5px] font-sans border-b border-slate-300 pb-2">
            <div className="space-y-0.5">
              {ayarlar.dosyaNo && (
                <div>
                  <span className="font-bold text-slate-800">Takip / Dosya No:</span>{' '}
                  <span className="font-mono font-bold">{ayarlar.dosyaNo}</span>
                </div>
              )}
              {ayarlar.konu && (
                <div>
                  <span className="font-bold text-slate-800">Konu:</span> {ayarlar.konu}
                </div>
              )}
            </div>

            <div className="text-right space-y-0.5">
              {ayarlar.tarihGoster && (
                <div>
                  <span className="font-bold text-slate-800">Tarih:</span>{' '}
                  <span className="font-mono">{ayarlar.evrakTarihi || new Date().toLocaleDateString('tr-TR')}</span>
                </div>
              )}
              {ayarlar.evrakSayisi && (
                <div>
                  <span className="font-bold text-slate-800">Sayı:</span>{' '}
                  <span className="font-mono">{ayarlar.evrakSayisi}</span>
                </div>
              )}
            </div>
          </div>

          {/* RESMÎ BELGE BAŞLIĞI */}
          <div className="text-center my-4">
            <h1 className="text-[14px] sm:text-[15px] font-black tracking-wide uppercase font-sans border-b-2 border-black inline-block pb-1">
              {baslik || 'EK-9: ÜÇÜNCÜ ŞAHISLAR TARAFINDAN VERİLECEK MUVAFAKATNAME ÖRNEĞİ'}
            </h1>
          </div>

          {/* HİTAP MAKAMI */}
          <div className="text-center font-extrabold text-[12px] sm:text-[12.5px] tracking-wider mb-4 uppercase font-sans">
            {ayarlar.altBirimAdi ? (
              <>
                <div>{ayarlar.altBirimAdi.split('/')[0]?.trim()}NE</div>
                {ayarlar.altBirimAdi.includes('/') && (
                  <div className="text-[11px] font-bold text-slate-700 mt-0.5">
                    ({ayarlar.altBirimAdi.split('/')[1]?.trim()}ne)
                  </div>
                )}
              </>
            ) : (
              <div>{ayarlar.kurumAdi ? `${ayarlar.kurumAdi} MAKAMINA` : 'İLGİLİ SOSYAL GÜVENLİK İL MÜDÜRLÜĞÜNE'}</div>
            )}
          </div>

          {/* BORÇLU & MUVAFAKAT VEREN BİLGİ TABLOSU */}
          <div className="mb-4 border border-black text-[10px] font-sans">
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b border-black">
                  <td className="w-1/4 p-1.5 bg-slate-100 font-bold border-r border-black">
                    Muvafakat Veren (3. Şahıs / Mülk Sahibi):
                  </td>
                  <td className="w-1/4 p-1.5 font-bold border-r border-black">
                    {borclu.adSoyad || '—'}
                  </td>
                  <td className="w-1/4 p-1.5 bg-slate-100 font-bold border-r border-black">
                    T.C. / Vergi Kimlik No:
                  </td>
                  <td className="w-1/4 p-1.5 font-mono font-bold">
                    {borclu.tcknVkn || '—'}
                  </td>
                </tr>

                {asilBorclu?.unvan && (
                  <tr className="border-b border-black">
                    <td className="p-1.5 bg-slate-100 font-bold border-r border-black">
                      Asıl Borçlu Adı / Şirket Ünvanı:
                    </td>
                    <td className="p-1.5 font-bold border-r border-black">
                      {asilBorclu.unvan}
                    </td>
                    <td className="p-1.5 bg-slate-100 font-bold border-r border-black">
                      İşyeri SGK Sicil No:
                    </td>
                    <td className="p-1.5 font-mono font-bold">
                      {asilBorclu.sgkSicilNo || borclu.sgkSicilNo || '—'}
                    </td>
                  </tr>
                )}

                {(ayarlar.borcTutari || ayarlar.borcDonemi) && (
                  <tr className="border-b border-black">
                    <td className="p-1.5 bg-slate-100 font-bold border-r border-black">
                      Kamu Alacağı Tutarı &amp; Dönemi:
                    </td>
                    <td colSpan={3} className="p-1.5 font-bold">
                      {ayarlar.borcTutari || '—'} {ayarlar.borcDonemi ? `(${ayarlar.borcDonemi})` : ''}
                    </td>
                  </tr>
                )}

                {borclu.adres && (
                  <tr>
                    <td className="p-1.5 bg-slate-100 font-bold border-r border-black">
                      Tebligat Adresi &amp; Tel:
                    </td>
                    <td colSpan={3} className="p-1.5">
                      {borclu.adres} {borclu.telefon ? `(Tel: ${borclu.telefon})` : ''}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* TEMİNAT / MAL BİLGİLERİ TABLOSU */}
          {ayarlar.teminatTablosuGoster && (
            <div className="mb-4 border border-black text-[10px] font-sans">
              <div className="bg-slate-200 text-center font-bold py-1 border-b border-black tracking-wider text-[10.5px]">
                TEMİNAT OLARAK GÖSTERİLEN VE HACZEDİLMESİNE MUVAFAKAT EDİLEN MAL / HAK BİLGİLERİ
              </div>

              {/* Taşınmaz Formatı */}
              {teminat.tur === 'gayrimenkul' && (
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-300">
                      <td className="w-1/4 p-1.5 bg-slate-50 font-bold border-r border-slate-300">İli / İlçesi:</td>
                      <td className="w-1/4 p-1.5 border-r border-slate-300">{teminat.il || '—'} / {teminat.ilce || '—'}</td>
                      <td className="w-1/4 p-1.5 bg-slate-50 font-bold border-r border-slate-300">Mahalle / Köy:</td>
                      <td className="w-1/4 p-1.5">{teminat.mahalleKoy || '—'}</td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="p-1.5 bg-slate-50 font-bold border-r border-slate-300">Ada / Parsel No:</td>
                      <td className="p-1.5 font-mono font-bold border-r border-slate-300">Ada: {teminat.ada || '—'} / Parsel: {teminat.parsel || '—'}</td>
                      <td className="p-1.5 bg-slate-50 font-bold border-r border-slate-300">Bağımsız Bölüm No:</td>
                      <td className="p-1.5">{teminat.bagimsizBolum || '—'}</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 bg-slate-50 font-bold border-r border-slate-300">Yüzölçümü &amp; Nitelik:</td>
                      <td className="p-1.5 border-r border-slate-300">{teminat.yuzolcumu || '—'} ({teminat.nitelik || '—'})</td>
                      <td className="p-1.5 bg-slate-50 font-bold border-r border-slate-300">Tapu Maliki &amp; Payı:</td>
                      <td className="p-1.5 font-bold">{teminat.tapuMaliki || borclu.adSoyad} ({teminat.hisseOrani || '1/1'})</td>
                    </tr>
                  </tbody>
                </table>
              )}

              {/* Taşıt Formatı */}
              {teminat.tur === 'tasit' && (
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-300">
                      <td className="w-1/4 p-1.5 bg-slate-50 font-bold border-r border-slate-300">Plaka Numarası:</td>
                      <td className="w-1/4 p-1.5 font-mono font-black border-r border-slate-300">{teminat.plaka || '—'}</td>
                      <td className="w-1/4 p-1.5 bg-slate-50 font-bold border-r border-slate-300">Marka / Model / Yıl:</td>
                      <td className="w-1/4 p-1.5">{teminat.markaModel || '—'} ({teminat.modelYili || '—'})</td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="p-1.5 bg-slate-50 font-bold border-r border-slate-300">Araç Cinsi:</td>
                      <td className="p-1.5 border-r border-slate-300">{teminat.cinsi || '—'}</td>
                      <td className="p-1.5 bg-slate-50 font-bold border-r border-slate-300">Ruhsat Sahibi:</td>
                      <td className="p-1.5 font-bold">{teminat.ruhsatSahibi || borclu.adSoyad}</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 bg-slate-50 font-bold border-r border-slate-300">Şasi Numarası:</td>
                      <td className="p-1.5 font-mono border-r border-slate-300">{teminat.sasiNo || '—'}</td>
                      <td className="p-1.5 bg-slate-50 font-bold border-r border-slate-300">Motor Numarası:</td>
                      <td className="p-1.5 font-mono">{teminat.motorNo || '—'}</td>
                    </tr>
                  </tbody>
                </table>
              )}

              {/* Banka Formatı */}
              {teminat.tur === 'banka' && (
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-300">
                      <td className="w-1/4 p-1.5 bg-slate-50 font-bold border-r border-slate-300">Banka &amp; Şube Adı:</td>
                      <td className="w-3/4 p-1.5 font-bold" colSpan={3}>{teminat.bankaAdi || '—'}</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 bg-slate-50 font-bold border-r border-slate-300">IBAN / Hesap No:</td>
                      <td className="p-1.5 font-mono font-bold border-r border-slate-300">{teminat.iban || teminat.hesapNo || '—'}</td>
                      <td className="p-1.5 bg-slate-50 font-bold border-r border-slate-300">Bloke / Mahsup Tutarı:</td>
                      <td className="p-1.5 font-bold">{teminat.alacakTutari || ayarlar.borcTutari || '—'}</td>
                    </tr>
                  </tbody>
                </table>
              )}

              {/* Maaş Formatı */}
              {teminat.tur === 'maas' && (
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-300">
                      <td className="w-1/4 p-1.5 bg-slate-50 font-bold border-r border-slate-300">Çalıştığı Kurum / İşyeri:</td>
                      <td className="w-3/4 p-1.5 font-bold" colSpan={3}>{teminat.calistigiYer || '—'}</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 bg-slate-50 font-bold border-r border-slate-300">Aylık Net Ücreti:</td>
                      <td className="p-1.5 border-r border-slate-300">{teminat.aylikNetUcret || '—'}</td>
                      <td className="p-1.5 bg-slate-50 font-bold border-r border-slate-300">Muvafakat Edilen Kesinti:</td>
                      <td className="p-1.5 font-bold">{teminat.kesintiTutariOrani || '—'}</td>
                    </tr>
                  </tbody>
                </table>
              )}

              {/* Diğer / Açıklama */}
              {teminat.tur === 'diger' && teminat.aciklama && (
                <div className="p-2 text-[10.5px]">
                  {teminat.aciklama}
                </div>
              )}
            </div>
          )}

          {/* GÖVDE METNİ (EK-9 YASAL TAAHHÜT BEYANI) */}
          <div className={`space-y-3 text-justify ${fontSizeClass}`}>
            {paragraflar.map((paragraf, idx) => (
              <p
                key={idx}
                className="indent-8 leading-relaxed"
                style={{ textAlign: 'justify', textJustify: 'inter-word' }}
              >
                {paragraf}
              </p>
            ))}

            {ekNotlar && (
              <div className="mt-2.5 p-2 bg-slate-100 border-l-4 border-slate-800 text-[10px] font-sans">
                <strong>Ek Açıklama &amp; Özel Hüküm:</strong> {ekNotlar}
              </div>
            )}
          </div>
        </div>

        {/* ALT BÖLÜM: İMZA BLOKLARI VE SGK HUZURDA İMZA ZAPTI */}
        <div className="mt-8 pt-2">
          {/* İMZALAR */}
          <div className="flex items-start justify-between gap-6 text-center font-sans">
            {/* 1. İmza: Muvafakat Veren */}
            <div className="flex-1 space-y-0.5">
              <div className="text-[10px] font-bold text-slate-700 uppercase">
                {imzalayan1.unvan || 'Muvafakat Veren (3. Şahıs / Borçlu)'}
              </div>
              <div className="font-extrabold text-[11.5px] text-slate-900">
                {imzalayan1.adSoyad || borclu.adSoyad}
              </div>
              <div className="text-[9.5px] text-slate-600">
                Tarih: {ayarlar.evrakTarihi || new Date().toLocaleDateString('tr-TR')}
              </div>
              <div className="h-14 flex items-center justify-center text-[10px] text-slate-400 italic">
                (İmza)
              </div>
            </div>

            {/* 2. İmza: Asıl Borçlu / Kefil / Onay Makamı */}
            {ayarlar.ikinciImzaVarMi && (
              <div className="flex-1 space-y-0.5">
                <div className="text-[10px] font-bold text-slate-700 uppercase">
                  {imzalayan2?.unvan || 'Asıl Borçlu / Yetkili Makam Onayı'}
                </div>
                <div className="font-extrabold text-[11.5px] text-slate-900">
                  {imzalayan2?.adSoyad || asilBorclu?.unvan || 'Yetkili İmza'}
                </div>
                <div className="text-[9.5px] text-slate-600">
                  (Kaşe / Mühür)
                </div>
                <div className="h-14 flex items-center justify-center text-[10px] text-slate-400 italic">
                  (İmza / Resmî Mühür)
                </div>
              </div>
            )}
          </div>

          {/* SGK RESMÎ HUZURDA İMZA ZAPTI (SGK 2024/12 GENELGESİ STANDARDI) */}
          {ayarlar.huzurdaImzaZaptiVarMi && (
            <div className="mt-5 border border-black p-2.5 bg-slate-50 text-[9.5px] font-sans">
              <div className="text-center font-bold uppercase tracking-wider mb-1 text-[10px] border-b border-black/40 pb-0.5">
                T.C. SOSYAL GÜVENLİK KURUMU HUZURDA İMZA VE TESPİT ZAPTI
              </div>
              <div className="text-justify leading-snug">
                İşbu <strong>EK-9 Muvafakatnamesi</strong>; muvafakat veren <strong>{borclu.adSoyad}</strong> (T.C./Vergi No: {borclu.tcknVkn}) tarafından huzurumuzda kendi hür iradesi ile tanzim ve imza altına alınmış olup, kimlik tespiti yapılmak suretiyle teslim alınmıştır.
              </div>
              <div className="mt-3 flex items-start justify-between text-center pt-1">
                <div className="flex-1">
                  <div className="font-bold text-[10px]">İcra Memuru</div>
                  <div className="text-[9px] text-slate-700">{sgkZapti?.icraMemuru?.adSoyad || 'İcra Memuru'}</div>
                  <div className="text-[8.5px] text-slate-500 font-mono">Sicil: {sgkZapti?.icraMemuru?.sicilNo || '—'}</div>
                  <div className="h-8 flex items-center justify-center text-[8.5px] text-slate-400 italic">
                    (İmza / Resmî Mühür)
                  </div>
                </div>

                <div className="flex-1">
                  <div className="font-bold text-[10px]">Sorumlu İcra Memuru / Şef</div>
                  <div className="text-[9px] text-slate-700">{sgkZapti?.sorumluMemur?.adSoyad || 'Sorumlu Şef / Yetkili'}</div>
                  <div className="text-[8.5px] text-slate-500 font-mono">Sicil: {sgkZapti?.sorumluMemur?.sicilNo || '—'}</div>
                  <div className="h-8 flex items-center justify-center text-[8.5px] text-slate-400 italic">
                    (İmza / Resmî Mühür)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DİPNOT VE MEVZUAT DAYANAĞI */}
          <div className="mt-4 pt-2 border-t border-slate-300 flex items-center justify-between text-[8.5px] font-sans text-slate-500">
            <div>
              SGK 2024/12 Sayılı Genelgesi Ek-9 ve 6183 Sayılı Kanun m. 10/5 hükümlerine göre tanzim edilmiştir.
            </div>
            <div>Sayfa 1 / 1</div>
          </div>
        </div>
      </div>
    </div>
  );
};
