import React from 'react';
import { MuvafakatnameBelgeData } from '../types/muvafakatname';

interface A4DocumentProps {
  data: MuvafakatnameBelgeData;
}

export const A4Document: React.FC<A4DocumentProps> = ({ data }) => {
  const { baslik, ayarlar, borclu, asilBorclu, teminat, metin, ekNotlar, sgkZapti } = data;

  const fontFamClass = ayarlar.yaziTipi === 'sans' ? 'font-sans' : 'font-serif';

  const fontSizeClass =
    ayarlar.yaziBoyutu === 'sm'
      ? 'text-[11px] leading-relaxed'
      : ayarlar.yaziBoyutu === 'lg'
      ? 'text-[13px] leading-loose'
      : 'text-[12px] leading-relaxed';

  // Belge Tarihi
  const belgeTarihi = ayarlar.evrakTarihi || new Date().toLocaleDateString('tr-TR');

  // Asıl Borçlu Adı
  const asilBorcluAdi = asilBorclu?.unvan || borclu.isyeriUnvan || '………………………………';

  // Borç Dönemi ve Tutarı
  const borcDonemi = ayarlar.borcDonemi || '………………';
  const borcTutari = ayarlar.borcTutari || '…………………… TL';

  // İl Müdürlüğü ve Merkez Adı
  const ilMudurlugu = ayarlar.altBirimAdi?.split('/')[0]?.trim() || ayarlar.kurumAdi || '………………';
  const sgkMerkezi = ayarlar.altBirimAdi?.split('/')[1]?.trim() || '';

  return (
    <div className="w-full flex justify-center py-2 sm:py-4 overflow-auto">
      <div
        id="muvafakatname-a4-print"
        className={`w-[210mm] min-h-[297mm] bg-white text-slate-950 p-[20mm] sm:p-[25mm] shadow-2xl rounded-sm print:shadow-none print:m-0 print:p-[15mm] print:w-full print:min-h-0 flex flex-col justify-between ${fontFamClass} relative border border-slate-300 print:border-none`}
        style={{ boxSizing: 'border-box', color: '#000000' }}
      >
        {/* SAĞ ÜST KÖŞE: EK-9 */}
        <div className="w-full text-right mb-4">
          <span className="font-extrabold text-[15px] font-sans tracking-widest uppercase border-b-2 border-black pb-0.5 inline-block">
            {ayarlar.formKodu || 'EK-9'}
          </span>
        </div>

        <div>
          {/* BAŞLIK: ÜÇÜNCÜ ŞAHISLAR TARAFINDAN VERİLECEK MUVAFAKATNAME ÖRNEĞİ */}
          <div className="text-center my-6">
            <h1 className="text-[14px] sm:text-[15px] font-extrabold uppercase font-sans tracking-wide">
              {baslik || 'ÜÇÜNCÜ ŞAHISLAR TARAFINDAN VERİLECEK MUVAFAKATNAME ÖRNEĞİ'}
            </h1>
          </div>

          {/* HİTAP MAKAMI */}
          <div className="text-center font-bold text-[13px] tracking-wide my-8 uppercase font-sans">
            <div>{ilMudurlugu}NE</div>
            {sgkMerkezi ? (
              <div className="text-[12px] font-semibold text-slate-800 mt-1">({sgkMerkezi}ne)</div>
            ) : (
              <div className="text-[12px] font-semibold text-slate-800 mt-1">(Sosyal Güvenlik Merkezine)</div>
            )}
          </div>

          {/* YASAL METİN (SGK 2024/12 GENELGE METNİ) */}
          <div className={`text-justify leading-relaxed font-serif my-6 space-y-4 ${fontSizeClass}`}>
            <p className="indent-10 text-justify" style={{ textAlign: 'justify', textJustify: 'inter-word' }}>
              <strong className="font-sans font-bold">{asilBorcluAdi}</strong>’nin Sosyal Güvenlik Kurumuna olan{' '}
              <strong className="font-sans font-bold">{borcDonemi}</strong> dönemi/ayına ilişkin{' '}
              <strong className="font-sans font-bold">{borcTutari}</strong> tutarında prim ve idari para cezası borcuna ve bu borca bu tarihten ödenmesine kadar geçecek süre için işleyecek fer'ilerine karşılık aşağıda özellikleri yazılı menkul/gayrimenkul malı 6183 sayılı Kanunun 10 uncu maddesinin beşinci fıkrası gereğince teminat olarak gösteriyor ve söz konusu malların Sosyal Güvenlik Kurumu tarafından haczedilmesine muvafakat ediyorum. Bu konuda herhangi bir itirazda bulunmayacağımı beyan ve taahhüt ederim.
            </p>

            {ekNotlar && (
              <p className="indent-10 text-[11px] font-sans italic text-slate-800">
                Ek Not: {ekNotlar}
              </p>
            )}
          </div>

          {/* TARİH */}
          <div className="text-right my-5 font-sans text-[12px] font-bold">
            Tarih: {belgeTarihi}
          </div>

          {/* MUVAFAKAT VEREN BİLGİLERİ */}
          <div className="my-6 space-y-1.5 font-sans text-[12px]">
            <div>
              <strong>Adı Soyadı / Unvanı:</strong>{' '}
              <span className="font-bold">{borclu.adSoyad || '………………………………………………………………'}</span>
            </div>
            <div>
              <strong>Adres:</strong>{' '}
              <span>{borclu.adres || '…………………………………………………………………………………………………………………………'}</span>
            </div>
            <div>
              <strong>T.C. Kimlik No / Vergi Kimlik No:</strong>{' '}
              <span className="font-mono font-bold">{borclu.tcknVkn || '………………………………'}</span>
            </div>
            {borclu.telefon && (
              <div>
                <strong>Telefon:</strong> <span>{borclu.telefon}</span>
              </div>
            )}
            <div className="pt-2">
              <strong>İmza:</strong>
            </div>
          </div>

          {/* TEMİNAT OLARAK GÖSTERİLEN MALIN BİLGİLERİ */}
          {ayarlar.teminatTablosuGoster && (
            <div className="my-6 pt-4 border-t border-slate-400">
              <div className="font-bold text-[11.5px] uppercase font-sans mb-2 text-center underline">
                AŞAĞIDA ÖZELLİKLERİ YAZILI MENKUL / GAYRİMENKUL MALIN BİLGİLERİ
              </div>

              {teminat.tur === 'gayrimenkul' && (
                <div className="border border-black p-3 font-sans text-[11px] space-y-1 bg-slate-50/50">
                  <div className="grid grid-cols-2 gap-2">
                    <div><strong>İli / İlçesi:</strong> {teminat.il || '—'} / {teminat.ilce || '—'}</div>
                    <div><strong>Mahalle / Köy:</strong> {teminat.mahalleKoy || '—'}</div>
                    <div><strong>Ada / Parsel No:</strong> Ada: {teminat.ada || '—'} / Parsel: {teminat.parsel || '—'}</div>
                    <div><strong>Bağımsız Bölüm:</strong> {teminat.bagimsizBolum || '—'}</div>
                    <div><strong>Yüzölçümü &amp; Niteliği:</strong> {teminat.yuzolcumu || '—'} ({teminat.nitelik || '—'})</div>
                    <div><strong>Malik / Hisse:</strong> {teminat.tapuMaliki || borclu.adSoyad} ({teminat.hisseOrani || '1/1'})</div>
                  </div>
                </div>
              )}

              {teminat.tur === 'tasit' && (
                <div className="border border-black p-3 font-sans text-[11px] space-y-1 bg-slate-50/50">
                  <div className="grid grid-cols-2 gap-2">
                    <div><strong>Plaka No:</strong> <span className="font-mono font-bold">{teminat.plaka || '—'}</span></div>
                    <div><strong>Marka / Model / Yıl:</strong> {teminat.markaModel || '—'} ({teminat.modelYili || '—'})</div>
                    <div><strong>Araç Cinsi:</strong> {teminat.cinsi || '—'}</div>
                    <div><strong>Ruhsat Sahibi:</strong> {teminat.ruhsatSahibi || borclu.adSoyad}</div>
                    <div><strong>Şasi No:</strong> <span className="font-mono">{teminat.sasiNo || '—'}</span></div>
                    <div><strong>Motor No:</strong> <span className="font-mono">{teminat.motorNo || '—'}</span></div>
                  </div>
                </div>
              )}

              {teminat.tur === 'banka' && (
                <div className="border border-black p-3 font-sans text-[11px] space-y-1 bg-slate-50/50">
                  <div><strong>Banka Adı:</strong> {teminat.bankaAdi || '—'}</div>
                  <div><strong>Hesap / IBAN No:</strong> {teminat.iban || teminat.hesapNo || '—'}</div>
                  <div><strong>Tutar:</strong> {teminat.alacakTutari || borcTutari}</div>
                </div>
              )}

              {teminat.tur === 'maas' && (
                <div className="border border-black p-3 font-sans text-[11px] space-y-1 bg-slate-50/50">
                  <div><strong>Çalıştığı İşyeri:</strong> {teminat.calistigiYer || '—'}</div>
                  <div><strong>Net Ücret / Kesinti:</strong> {teminat.aylikNetUcret || '—'} / {teminat.kesintiTutariOrani || '—'}</div>
                </div>
              )}

              {teminat.tur === 'diger' && teminat.aciklama && (
                <div className="border border-black p-3 font-sans text-[11px] space-y-1 bg-slate-50/50">
                  <div><strong>Açıklama:</strong> {teminat.aciklama}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SGK RESMÎ HUZURDA İMZA ZAPTI */}
        <div className="mt-8 pt-4 border-t-2 border-black font-sans">
          <div className="italic text-center text-[11.5px] mb-6">
            Bu muvafakatname, huzurumuzda imza altına alınmıştır.
          </div>

          <div className="flex items-start justify-between text-center text-[11px] font-sans px-8">
            <div className="w-48 space-y-1">
              <div className="font-bold text-[12px]">İcra Memuru</div>
              <div className="text-slate-800">{sgkZapti?.icraMemuru?.adSoyad || '…………………………'}</div>
              <div className="text-[10px] text-slate-600 font-mono">Sicil No: {sgkZapti?.icraMemuru?.sicilNo || '…………'}</div>
              <div className="h-12 flex items-center justify-center text-[10px] text-slate-400 italic">
                (İmza / Mühür)
              </div>
            </div>

            <div className="w-48 space-y-1">
              <div className="font-bold text-[12px]">Sorumlu İcra Memuru</div>
              <div className="text-slate-800">{sgkZapti?.sorumluMemur?.adSoyad || '…………………………'}</div>
              <div className="text-[10px] text-slate-600 font-mono">Sicil No: {sgkZapti?.sorumluMemur?.sicilNo || '…………'}</div>
              <div className="h-12 flex items-center justify-center text-[10px] text-slate-400 italic">
                (İmza / Mühür)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
