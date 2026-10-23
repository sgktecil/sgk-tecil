import React from 'react';
import {
  MuvafakatnameBelgeData,
  MuvafakatnameTemplate,
} from '../types/muvafakatname';
import { MUVAFAKATNAME_TEMPLATES } from '../data/templates';
import {
  FileText,
  Building,
  User,
  Settings,
  Sparkles,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

interface EditorPanelProps {
  data: MuvafakatnameBelgeData;
  onChange: (newData: MuvafakatnameBelgeData) => void;
  onLoadTemplate: (template: MuvafakatnameTemplate) => void;
  onLoadSampleBorrower: () => void;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  data,
  onChange,
  onLoadTemplate,
  onLoadSampleBorrower,
}) => {
  const { baslik, ayarlar, borclu, metin, ekNotlar, imzalayan1, imzalayan2 } = data;

  const updateAyarlar = (partial: Partial<typeof ayarlar>) => {
    onChange({
      ...data,
      ayarlar: { ...ayarlar, ...partial },
    });
  };

  const updateBorclu = (partial: Partial<typeof borclu>) => {
    onChange({
      ...data,
      borclu: { ...borclu, ...partial },
    });
  };

  return (
    <div className="space-y-6 text-xs">
      {/* 1. ŞABLON SEÇİMİ */}
      <div className="p-4 rounded-2xl border space-y-3" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-primary)' }}>
        <div className="flex items-center justify-between">
          <label className="font-extrabold flex items-center gap-2 text-slate-800 dark:text-slate-100 text-sm">
            <BookOpen className="w-4 h-4 text-teal-600" />
            <span>Hazır Resmî Şablon Seçin</span>
          </label>
          <button
            type="button"
            onClick={onLoadSampleBorrower}
            className="text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
            title="Aktif SGK borçlu bilgilerini bu forma aktar"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>SGK Borçlusunu Yükle</span>
          </button>
        </div>

        <select
          value={data.sablonId}
          onChange={(e) => {
            const found = MUVAFAKATNAME_TEMPLATES.find((t) => t.id === e.target.value);
            if (found) onLoadTemplate(found);
          }}
          className="form-control-custom font-bold"
        >
          {MUVAFAKATNAME_TEMPLATES.map((tmpl) => (
            <option key={tmpl.id} value={tmpl.id}>
              {tmpl.baslik}
            </option>
          ))}
        </select>

        {/* Seçili şablon açıklaması ve yasal dayanak */}
        {(() => {
          const active = MUVAFAKATNAME_TEMPLATES.find((t) => t.id === data.sablonId);
          if (!active) return null;
          return (
            <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-[11px] space-y-1 text-slate-700 dark:text-slate-300">
              <div>{active.aciklama}</div>
              <div className="font-bold text-teal-800 dark:text-teal-300">
                Yasal Dayanak: {active.yasalDayanak}
              </div>
            </div>
          );
        })()}
      </div>

      {/* 2. KURUM & EVRAK BİLGİLERİ */}
      <div className="p-4 rounded-2xl border space-y-3" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-primary)' }}>
        <div className="font-extrabold flex items-center gap-2 text-slate-800 dark:text-slate-100 text-sm">
          <Building className="w-4 h-4 text-indigo-500" />
          <span>Kurum &amp; Evrak Bilgileri</span>
        </div>

        <div className="space-y-2">
          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Muhatap Kurum Adı:
            </label>
            <input
              type="text"
              value={ayarlar.kurumAdi}
              onChange={(e) => updateAyarlar({ kurumAdi: e.target.value })}
              className="form-control-custom font-bold text-xs"
              placeholder="T.C. SOSYAL GÜVENLİK KURUMU BAŞKANLIĞI"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Alt Birim / Servis Adı:
            </label>
            <input
              type="text"
              value={ayarlar.altBirimAdi}
              onChange={(e) => updateAyarlar({ altBirimAdi: e.target.value })}
              className="form-control-custom text-xs"
              placeholder="ORDU SOSYAL GÜVENLİK İL MÜDÜRLÜĞÜ / ALTINORDU SGM"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Takip / Dosya No:
              </label>
              <input
                type="text"
                value={ayarlar.dosyaNo}
                onChange={(e) => updateAyarlar({ dosyaNo: e.target.value })}
                className="form-control-custom text-xs font-mono"
                placeholder="2026/1055706-İCRA"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Evrak Tarihi:
              </label>
              <input
                type="text"
                value={ayarlar.evrakTarihi}
                onChange={(e) => updateAyarlar({ evrakTarihi: e.target.value })}
                className="form-control-custom text-xs font-mono"
                placeholder="23.10.2026"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Konu Başlığı:
            </label>
            <input
              type="text"
              value={ayarlar.konu}
              onChange={(e) => updateAyarlar({ konu: e.target.value })}
              className="form-control-custom text-xs"
              placeholder="Maaş Haczi ve Kesinti Muvafakati"
            />
          </div>
        </div>
      </div>

      {/* 3. BORÇLU / MUVAFAKAT EDEN BİLGİLERİ */}
      <div className="p-4 rounded-2xl border space-y-3" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-primary)' }}>
        <div className="font-extrabold flex items-center gap-2 text-slate-800 dark:text-slate-100 text-sm">
          <User className="w-4 h-4 text-emerald-500" />
          <span>Muvafakat Eden (Borçlu) Bilgileri</span>
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Ad Soyad / Ünvan:
              </label>
              <input
                type="text"
                value={borclu.adSoyad}
                onChange={(e) => updateBorclu({ adSoyad: e.target.value })}
                className="form-control-custom font-bold text-xs"
                placeholder="ÜMİT ÖZTÜRK"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                T.C. / Vergi No:
              </label>
              <input
                type="text"
                value={borclu.tcknVkn}
                onChange={(e) => updateBorclu({ tcknVkn: e.target.value })}
                className="form-control-custom text-xs font-mono"
                placeholder="12345678901"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                SGK Sicil Numarası:
              </label>
              <input
                type="text"
                value={borclu.sgkSicilNo || ''}
                onChange={(e) => updateBorclu({ sgkSicilNo: e.target.value })}
                className="form-control-custom text-xs font-mono"
                placeholder="2 4324 01 01 1055706 052 20-30"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                İşyeri / Çalıştığı Yer:
              </label>
              <input
                type="text"
                value={borclu.isyeriUnvan || ''}
                onChange={(e) => updateBorclu({ isyeriUnvan: e.target.value })}
                className="form-control-custom text-xs"
                placeholder="ÖZTÜRK TİCARET LTD. ŞTİ."
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Tebligat Adresi:
            </label>
            <textarea
              rows={2}
              value={borclu.adres}
              onChange={(e) => updateBorclu({ adres: e.target.value })}
              className="form-control-custom text-xs resize-none"
              placeholder="YENİ MAH. 328. SOK. DIŞ KAPI NO:8 - ORDU ALTINORDU"
            />
          </div>
        </div>
      </div>

      {/* 4. BELGE METNİ DÜZENLEME */}
      <div className="p-4 rounded-2xl border space-y-3" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-primary)' }}>
        <div className="flex items-center justify-between">
          <label className="font-extrabold flex items-center gap-2 text-slate-800 dark:text-slate-100 text-sm">
            <FileText className="w-4 h-4 text-amber-500" />
            <span>Muvafakatname Metni (Canlı Düzenle)</span>
          </label>
          <button
            type="button"
            onClick={() => {
              const active = MUVAFAKATNAME_TEMPLATES.find((t) => t.id === data.sablonId);
              if (active) onChange({ ...data, metin: active.metin });
            }}
            className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer font-medium"
            title="Metni varsayılan orijinal şablon haline döndür"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Sıfırla</span>
          </button>
        </div>

        <textarea
          rows={7}
          value={metin}
          onChange={(e) => onChange({ ...data, metin: e.target.value })}
          className="form-control-custom text-xs leading-relaxed font-sans"
          placeholder="Muvafakatname metnini buraya yazabilir veya düzenleyebilirsiniz..."
        />

        <div>
          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
            Ek Not / Özel Şartlar (İsteğe Bağlı):
          </label>
          <input
            type="text"
            value={ekNotlar || ''}
            onChange={(e) => onChange({ ...data, ekNotlar: e.target.value })}
            className="form-control-custom text-xs"
            placeholder="Örn: Kesintiler her ayın 15'inde yapılacaktır."
          />
        </div>
      </div>

      {/* 5. GÖRÜNÜM VE YAZDIRMA AYARLARI */}
      <div className="p-4 rounded-2xl border space-y-3" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-primary)' }}>
        <div className="font-extrabold flex items-center gap-2 text-slate-800 dark:text-slate-100 text-sm">
          <Settings className="w-4 h-4 text-purple-500" />
          <span>Görünüm &amp; Sayfa Ayarları</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Resmî Amblem:
            </label>
            <select
              value={ayarlar.amblemTuru}
              onChange={(e) => updateAyarlar({ amblemTuru: e.target.value as any })}
              className="form-control-custom text-xs font-bold"
            >
              <option value="tc">T.C. Ay-Yıldız Amblemi</option>
              <option value="sgk">SGK Amblemi</option>
              <option value="adalet">Adalet / İcra Terazisi</option>
              <option value="yok">Amblem Yok</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Yazı Boyutu:
            </label>
            <select
              value={ayarlar.yaziBoyutu}
              onChange={(e) => updateAyarlar({ yaziBoyutu: e.target.value as any })}
              className="form-control-custom text-xs font-bold"
            >
              <option value="sm">Küçük (Kompakt)</option>
              <option value="base">Standart Resmî (12pt)</option>
              <option value="lg">Büyük (Geniş Metin)</option>
            </select>
          </div>
        </div>

        <div className="pt-2 border-t flex items-center justify-between flex-wrap gap-2 text-xs" style={{ borderColor: 'var(--border-primary)' }}>
          <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={ayarlar.antetVarMi}
              onChange={(e) => updateAyarlar({ antetVarMi: e.target.checked })}
              className="rounded text-teal-600"
            />
            <span>Resmî Başlık &amp; Antet Göster</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={ayarlar.ikinciImzaVarMi}
              onChange={(e) => updateAyarlar({ ikinciImzaVarMi: e.target.checked })}
              className="rounded text-teal-600"
            />
            <span>2. İmza Alanı (Onay Makamı)</span>
          </label>
        </div>
      </div>
    </div>
  );
};
