import { MuvafakatnameBelgeData } from '../types/muvafakatname';

/**
 * Belgeyi Microsoft Word (.doc) dosyası olarak dışa aktarır.
 */
export function exportToWord(data: MuvafakatnameBelgeData, filename = 'SGK_EK-9_Muvafakatname.doc') {
  const { baslik, ayarlar, borclu, asilBorclu, teminat, metin, ekNotlar, imzalayan1, imzalayan2, sgkZapti } = data;

  const contentHtml = `
    <!DOCTYPE html>
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${baslik}</title>
      <style>
        @page {
          size: A4 portrait;
          margin: 20mm 20mm 20mm 20mm;
        }
        body {
          font-family: 'Times New Roman', Times, serif;
          font-size: 11pt;
          line-height: 1.4;
          color: #000;
        }
        .header-table {
          width: 100%;
          border-bottom: 2px solid #000;
          padding-bottom: 8px;
          margin-bottom: 15px;
        }
        .ek-badge {
          float: right;
          border: 1.5px solid #000;
          padding: 4px 10px;
          font-weight: bold;
          font-family: Arial, sans-serif;
          font-size: 11pt;
        }
        .title {
          text-align: center;
          font-family: Arial, sans-serif;
          font-weight: bold;
          font-size: 13pt;
          margin: 15px 0 10px 0;
          text-decoration: underline;
        }
        .hitap {
          text-align: center;
          font-family: Arial, sans-serif;
          font-weight: bold;
          font-size: 11pt;
          margin: 10px 0 15px 0;
        }
        .info-table {
          width: 100%;
          border-collapse: collapse;
          margin: 12px 0;
          font-family: Arial, sans-serif;
          font-size: 9.5pt;
        }
        .info-table td, .info-table th {
          border: 1px solid #444;
          padding: 5px 8px;
        }
        .info-table th {
          background-color: #f2f2f2;
          font-weight: bold;
          text-align: left;
        }
        .content-p {
          text-align: justify;
          text-indent: 12mm;
          margin: 10px 0;
          line-height: 1.5;
        }
        .signatures {
          width: 100%;
          margin-top: 35px;
        }
        .signatures td {
          text-align: center;
          vertical-align: top;
          width: 50%;
        }
        .zapit-box {
          border: 1px solid #000;
          padding: 8px 12px;
          margin-top: 25px;
          font-size: 9pt;
          font-family: Arial, sans-serif;
        }
      </style>
    </head>
    <body>
      ${ayarlar.formKoduGoster ? `<div class="ek-badge">${ayarlar.formKodu || 'EK-9'}</div><div style="clear: both;"></div>` : ''}

      <div style="text-align: center; font-family: Arial, sans-serif;">
        <div style="font-size: 13pt; font-weight: bold;">${ayarlar.kurumAdi}</div>
        <div style="font-size: 10.5pt; font-weight: bold; margin-top: 3px;">${ayarlar.altBirimAdi}</div>
      </div>

      <div style="margin-top: 15px; font-family: Arial, sans-serif; font-size: 10pt;">
        <div><strong>Dosya / Takip No:</strong> ${ayarlar.dosyaNo || '—'}</div>
        <div><strong>Konu:</strong> ${ayarlar.konu || '—'}</div>
        <div style="text-align: right; margin-top: -30px;"><strong>Tarih:</strong> ${ayarlar.evrakTarihi || new Date().toLocaleDateString('tr-TR')}</div>
      </div>

      <div class="title">${baslik}</div>
      <div class="hitap">${ayarlar.altBirimAdi ? `${ayarlar.altBirimAdi} MÜDÜRLÜĞÜNE` : `${ayarlar.kurumAdi} MAKAMINA`}</div>

      <!-- Bilgi Tablosu -->
      <table class="info-table">
        <tr>
          <th style="width: 25%;">Muvafakat Veren:</th>
          <td style="width: 25%; font-weight: bold;">${borclu.adSoyad}</td>
          <th style="width: 25%;">T.C. / Vergi No:</th>
          <td style="width: 25%; font-weight: bold;">${borclu.tcknVkn}</td>
        </tr>
        ${asilBorclu?.unvan ? `
        <tr>
          <th>Asıl Borçlu / Ünvan:</th>
          <td>${asilBorclu.unvan}</td>
          <th>İşyeri SGK Sicil No:</th>
          <td>${asilBorclu.sgkSicilNo || '—'}</td>
        </tr>
        ` : ''}
        ${ayarlar.borcTutari ? `
        <tr>
          <th>Kamu Borcu Tutarı:</th>
          <td colspan="3" style="font-weight: bold;">${ayarlar.borcTutari} ${ayarlar.borcDonemi ? `(${ayarlar.borcDonemi})` : ''}</td>
        </tr>
        ` : ''}
        ${borclu.adres ? `
        <tr>
          <th>Tebligat Adresi:</th>
          <td colspan="3">${borclu.adres}</td>
        </tr>
        ` : ''}
      </table>

      <!-- Teminat / Mal Tablosu -->
      ${ayarlar.teminatTablosuGoster ? `
      <table class="info-table">
        <tr>
          <th colspan="4" style="text-align: center; background-color: #e5e5e5; font-size: 10pt;">
            TEMİNAT OLARAK GÖSTERİLEN VE HACZİNE MUVAFAKAT EDİLEN MAL / HAK BİLGİLERİ
          </th>
        </tr>
        ${teminat.tur === 'gayrimenkul' ? `
        <tr>
          <th>İli / İlçesi:</th>
          <td>${teminat.il || '—'} / ${teminat.ilce || '—'}</td>
          <th>Mahalle / Köy:</th>
          <td>${teminat.mahalleKoy || '—'}</td>
        </tr>
        <tr>
          <th>Ada / Parsel No:</th>
          <td>Ada: ${teminat.ada || '—'} / Parsel: ${teminat.parsel || '—'}</td>
          <th>Bağımsız Bölüm:</th>
          <td>${teminat.bagimsizBolum || '—'}</td>
        </tr>
        <tr>
          <th>Yüzölçümü / Nitelik:</th>
          <td>${teminat.yuzolcumu || '—'} (${teminat.nitelik || '—'})</td>
          <th>Malik / Hisse:</th>
          <td>${teminat.tapuMaliki || borclu.adSoyad} (${teminat.hisseOrani || 'Tam'})</td>
        </tr>
        ` : ''}
        ${teminat.tur === 'tasit' ? `
        <tr>
          <th>Plaka Numarası:</th>
          <td style="font-weight: bold;">${teminat.plaka || '—'}</td>
          <th>Marka / Model / Yıl:</th>
          <td>${teminat.markaModel || '—'} (${teminat.modelYili || '—'})</td>
        </tr>
        <tr>
          <th>Araç Cinsi:</th>
          <td>${teminat.cinsi || '—'}</td>
          <th>Ruhsat Sahibi:</th>
          <td>${teminat.ruhsatSahibi || borclu.adSoyad}</td>
        </tr>
        <tr>
          <th>Şasi Numarası:</th>
          <td>${teminat.sasiNo || '—'}</td>
          <th>Motor Numarası:</th>
          <td>${teminat.motorNo || '—'}</td>
        </tr>
        ` : ''}
        ${teminat.tur === 'banka' ? `
        <tr>
          <th>Banka Adı:</th>
          <td>${teminat.bankaAdi || '—'}</td>
          <th>Hesap / IBAN:</th>
          <td>${teminat.iban || teminat.hesapNo || '—'}</td>
        </tr>
        ` : ''}
        ${teminat.tur === 'maas' ? `
        <tr>
          <th>Çalışılan İşyeri:</th>
          <td>${teminat.calistigiYer || '—'}</td>
          <th>Aylık Kesinti Tutarı:</th>
          <td style="font-weight: bold;">${teminat.kesintiTutariOrani || '—'}</td>
        </tr>
        ` : ''}
      </table>
      ` : ''}

      <!-- Metin Paragrafları -->
      ${metin
        .split('\n\n')
        .map((p) => `<p class="content-p">${p.replace(/\n/g, '<br>')}</p>`)
        .join('')}

      ${ekNotlar ? `<div style="margin-top: 10px; font-size: 10pt; font-family: Arial, sans-serif;"><strong>Not:</strong> ${ekNotlar}</div>` : ''}

      <!-- İmzalar -->
      <table class="signatures">
        <tr>
          <td>
            <div style="font-weight: bold; font-family: Arial, sans-serif; font-size: 10pt;">${imzalayan1.unvan}</div>
            <div style="margin-top: 4px; font-weight: bold;">${imzalayan1.adSoyad}</div>
            <div style="font-size: 9pt; color: #555; margin-top: 3px;">Tarih: ${ayarlar.evrakTarihi}</div>
            <div style="margin-top: 45px;">(İmza)</div>
          </td>
          ${ayarlar.ikinciImzaVarMi ? `
          <td>
            <div style="font-weight: bold; font-family: Arial, sans-serif; font-size: 10pt;">${imzalayan2?.unvan || 'SGK Kabul / Onay Makamı'}</div>
            <div style="margin-top: 4px; font-weight: bold;">${imzalayan2?.adSoyad || 'Yetkili Memur'}</div>
            <div style="font-size: 9pt; color: #555; margin-top: 3px;">Resmî Mühür / Kaşe</div>
            <div style="margin-top: 45px;">(İmza - Mühür)</div>
          </td>
          ` : ''}
        </tr>
      </table>

      <!-- Resmî SGK Zaptı -->
      ${ayarlar.huzurdaImzaZaptiVarMi ? `
      <div class="zapit-box">
        <div style="text-align: center; font-weight: bold; margin-bottom: 5px;">
          T.C. SOSYAL GÜVENLİK KURUMU HUZURDA İMZA ZAPTI
        </div>
        <div style="text-align: justify; margin-bottom: 8px;">
          İşbu EK-9 Resmî Muvafakatnamesi; muvafakat veren <strong>${borclu.adSoyad}</strong> (TCKN: ${borclu.tcknVkn}) tarafından huzurumuzda kendi hür iradesiyle okunarak imzalanmış olup, kimlik tespiti yapılarak teslim alınmıştır.
        </div>
        <table style="width: 100%; text-align: center; margin-top: 10px;">
          <tr>
            <td style="width: 50%;">
              <strong>İcra Memuru</strong><br>
              ${sgkZapti?.icraMemuru?.adSoyad || 'İcra Memuru'}<br>
              Sicil: ${sgkZapti?.icraMemuru?.sicilNo || '—'}<br>
              (İmza / Mühür)
            </td>
            <td style="width: 50%;">
              <strong>Sorumlu İcra Memuru / Şef</strong><br>
              ${sgkZapti?.sorumluMemur?.adSoyad || 'Sorumlu Şef'}<br>
              Sicil: ${sgkZapti?.sorumluMemur?.sicilNo || '—'}<br>
              (İmza / Mühür)
            </td>
          </tr>
        </table>
      </div>
      ` : ''}
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', contentHtml], {
    type: 'application/msword',
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
