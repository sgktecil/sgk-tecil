import React, { useState } from 'react';
import {
  MuvafakatnameBelgeData,
  MuvafakatnameTemplate,
  TeminatTuru,
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
  Home,
  Car,
  Landmark,
  Briefcase,
  ShieldCheck,
  Tag,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface EditorPanelProps {
  data: MuvafakatnameBelgeData;
  onChange: (newData: MuvafakatnameBelgeData) => void;
  onLoadTemplate: (template: MuvafakatnameTemplate) => void;
  onLoadSampleBorrower: () => void;
  onOpenPasteModal: () => void;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  data,
  onChange,
  onLoadTemplate,
  onLoadSampleBorrower,
  onOpenPasteModal,
}) => {
  const { baslik, ayarlar, borclu, asilBorclu, teminat, metin, ekNotlar, imzalayan1, imzalayan2, sgkZapti } = data;

  const [activeSection, setActiveSection] = useState<'sablon' | 'kurum' | 'borclu' | 'teminat' | 'metin' | 'imza' | 'gorunum'>('sablon');

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

  const updateAsilBorclu = (partial: Partial<NonNullable<typeof asilBorclu>>) => {
    onChange({
      ...data,
      asilBorclu: {
        unvan: asilBorclu?.unvan || '',
        tcknVkn: asilBorclu?.tcknVkn || '',
        sgkSicilNo: asilBorclu?.sgkSicilNo || '',
        adres: asilBorclu?.adres || '',
        borcDonemi: asilBorclu?.borcDonemi || '',
        borcTutari: asilBorclu?.borcTutari || '',
        takipNo: asilBorclu?.takipNo || '',
        ...partial,
      },
    });
  };

  const updateTeminat = (partial: Partial<typeof teminat>) => {
    onChange({
      ...data,
      teminat: { ...teminat, ...partial },
    });
  };

  const updateZapit = (memurKey: 'icraMemuru' | 'sorumluMemur', field: string, value: string) => {
    onChange({
      ...data,
      sgkZapti: {
        icraMemuru: {
          adSoyad: 'İcra Memuru',
          sicilNo: '',
          unvan: 'İcra Memuru',
          ...(sgkZapti?.icraMemuru || {}),
          ...(memurKey === 'icraMemuru' ? { [field]: value } : {}),
        },
        sorumluMemur: {
          adSoyad: 'Sorumlu İcra Memuru / Şef',
          sicilNo: '',
          unvan: 'Sorumlu Şef',
          ...(sgkZapti?.sorumluMemur || {}),
          ...(memurKey === 'sorumluMemur' ? { [field]: value } : {}),
        },
      },
    });
  };

  return (
    <div className="space-y-4 text-xs">
      {/* HIZLI AKSİYONLAR */}
      <div
        className="p-3 rounded-2xl border flex items-center justify-between gap-2"
        style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-primary)' }}
      >
        <button
          type="button"
          onClick={onOpenPasteModal}
          className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px] flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hazır Örnekler &amp; Word İçe Aktar</span>
        </button>

        <button
          type="button"
          onClick={onLoadSampleBorrower}
          className="text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
          title="Aktif SGK borçlu bilgilerini bu forma otomatik aktar"
        >
          <span>SGK Borçlusunu Yansıt</span>
        </button>
      </div>

      {/* 1. RESMÎ ŞABLON SEÇİMİ */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-primary)' }}
      >
        <div
          onClick={() => setActiveSection(activeSection === 'sablon' ? ('' as any) : 'sablon')}
          className="p-3.5 flex items-center justify-between cursor-pointer font-extrabold text-slate-800 dark:text-slate-100 text-sm"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-teal-600" />
            <span>Resmî Şablon ve EK Formatı</span>
          </div>
          {activeSection === 'sablon' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>

        {activeSection === 'sablon' && (
          <div className="p-4 pt-0 space-y-3 border-t" style={{ borderColor: 'var(--border-primary)' }}>
            <div className="mt-3">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Form Şablonu:
              </label>
              <select
                value={data.sablonId}
                onChange={(e) => {
                  const found = MUVAFAKATNAME_TEMPLATES.find((t) => t.id === e.target.value);
                  if (found) onLoadTemplate(found);
                }}
                className="form-control-custom font-bold text-xs"
              >
                {MUVAFAKATNAME_TEMPLATES.map((tmpl) => (
                  <option key={tmpl.id} value={tmpl.id}>
                    {tmpl.baslik}
                  </option>
                ))}
              </select>
            </div>

            {/* Form Kodu (EK-9 Rozeti) */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Resmî Form Kodu:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={ayarlar.formKodu}
                    onChange={(e) => updateAyarlar({ formKodu: e.target.value })}
                    className="form-control-custom text-xs font-mono font-bold uppercase"
                    placeholder="EK-9"
                  />
                </div>
              </div>
              <div className="flex items-end pb-1.5">
                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={ayarlar.formKoduGoster}
                    onChange={(e) => updateAyarlar({ formKoduGoster: e.target.checked })}
                    className="rounded text-teal-600"
                  />
                  <span>Sağ Üstte Rozet Göster</span>
                </label>
              </div>
            </div>

            {/* Seçili şablon açıklaması */}
            {(() => {
              const active = MUVAFAKATNAME_TEMPLATES.find((t) => t.id === data.sablonId);
              if (!active) return null;
              return (
                <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-[11px] space-y-1 text-slate-700 dark:text-slate-300">
                  <div>{active.aciklama}</div>
                  <div className="font-bold text-teal-800 dark:text-teal-300">
                    Dayanak: {active.yasalDayanak}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* 2. MUVAFAKAT VEREN & BORÇLU BİLGİLERİ */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-primary)' }}
      >
        <div
          onClick={() => setActiveSection(activeSection === 'borclu' ? ('' as any) : 'borclu')}
          className="p-3.5 flex items-center justify-between cursor-pointer font-extrabold text-slate-800 dark:text-slate-100 text-sm"
        >
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-500" />
            <span>Muvafakat Veren &amp; Borçlu Bilgileri</span>
          </div>
          {activeSection === 'borclu' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>

        {activeSection === 'borclu' && (
          <div className="p-4 pt-0 space-y-3 border-t" style={{ borderColor: 'var(--border-primary)' }}>
            <div className="mt-3">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Muvafakat Edenin Sıfatı:
              </label>
              <select
                value={borclu.sifat}
                onChange={(e) => updateBorclu({ sifat: e.target.value as any })}
                className="form-control-custom text-xs font-bold"
              >
                <option value="ucuncu_sahis">3. Şahıs (Borçlu Dışında Taşınmaz/Araç Veren)</option>
                <option value="borclu">Borçlunun Kendisi</option>
                <option value="kefil">Müteselsil Kefil</option>
                <option value="sirket_yetkilisi">Şirket Müdürü / Yetkilisi</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Muvafakat Veren Adı Soyadı:
                </label>
                <input
                  type="text"
                  value={borclu.adSoyad}
                  onChange={(e) => {
                    updateBorclu({ adSoyad: e.target.value });
                    if (!data.imzalayan1.adSoyad || data.imzalayan1.adSoyad === borclu.adSoyad) {
                      onChange({
                        ...data,
                        borclu: { ...borclu, adSoyad: e.target.value },
                        imzalayan1: { ...data.imzalayan1, adSoyad: e.target.value },
                      });
                    }
                  }}
                  className="form-control-custom font-bold text-xs"
                  placeholder="KEMAL ŞAHİN"
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

            {/* Asıl Borçlu Bölümü (Eğer 3. Şahıs ise çok önemli) */}
            <div className="p-3 rounded-xl bg-slate-500/5 border border-slate-300/60 dark:border-slate-700/60 space-y-2">
              <span className="font-extrabold text-[11px] text-slate-700 dark:text-slate-300 block">
                Asıl Borçlu Bilgileri (Kamu Borçlusu):
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                    Asıl Borçlu Adı / Ünvan:
                  </label>
                  <input
                    type="text"
                    value={asilBorclu?.unvan || ''}
                    onChange={(e) => updateAsilBorclu({ unvan: e.target.value })}
                    className="form-control-custom text-xs"
                    placeholder="ÖZTÜRK TİCARET LTD. ŞTİ."
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                    İşyeri SGK Sicil No:
                  </label>
                  <input
                    type="text"
                    value={asilBorclu?.sgkSicilNo || borclu.sgkSicilNo || ''}
                    onChange={(e) => {
                      updateAsilBorclu({ sgkSicilNo: e.target.value });
                      updateBorclu({ sgkSicilNo: e.target.value });
                    }}
                    className="form-control-custom text-xs font-mono"
                    placeholder="2 4324 01 01 1055706 052 20-30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                    Borç Tutarı (TL):
                  </label>
                  <input
                    type="text"
                    value={ayarlar.borcTutari}
                    onChange={(e) => updateAyarlar({ borcTutari: e.target.value })}
                    className="form-control-custom text-xs font-bold font-mono"
                    placeholder="385.450,00 TL"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                    Borcun Dönemi:
                  </label>
                  <input
                    type="text"
                    value={ayarlar.borcDonemi}
                    onChange={(e) => updateAyarlar({ borcDonemi: e.target.value })}
                    className="form-control-custom text-xs"
                    placeholder="2025/1 - 2025/12"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Tebligat Adresi &amp; Telefon:
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
        )}
      </div>

      {/* 3. TEMİNAT VE MAL BİLGİLERİ (EK-9 ÇEKİRDEK TABLOSU) */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-primary)' }}
      >
        <div
          onClick={() => setActiveSection(activeSection === 'teminat' ? ('' as any) : 'teminat')}
          className="p-3.5 flex items-center justify-between cursor-pointer font-extrabold text-slate-800 dark:text-slate-100 text-sm"
        >
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-amber-500" />
            <span>Muvafakat Edilen Mal / Hak Bilgileri</span>
          </div>
          {activeSection === 'teminat' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>

        {activeSection === 'teminat' && (
          <div className="p-4 pt-0 space-y-3 border-t" style={{ borderColor: 'var(--border-primary)' }}>
            <div className="mt-3 flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                Teminat / Mal Türü:
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-[11px] text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={ayarlar.teminatTablosuGoster}
                  onChange={(e) => updateAyarlar({ teminatTablosuGoster: e.target.checked })}
                  className="rounded text-teal-600"
                />
                <span>Tabloyu Belgede Göster</span>
              </label>
            </div>

            {/* Tür Seçiciler */}
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'gayrimenkul', label: 'Taşınmaz', icon: Home },
                { id: 'tasit', label: 'Taşıt/Araç', icon: Car },
                { id: 'banka', label: 'Banka/Hesap', icon: Landmark },
                { id: 'maas', label: 'Maaş', icon: Briefcase },
              ].map((t) => {
                const Icon = t.icon;
                const isSelected = teminat.tur === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => updateTeminat({ tur: t.id as TeminatTuru })}
                    className={`py-2 px-1 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer font-bold text-[10.5px] ${
                      isSelected
                        ? 'border-teal-600 bg-teal-500/10 text-teal-700 dark:text-teal-300 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-500/5 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAŞINMAZ ALANLARI */}
            {teminat.tur === 'gayrimenkul' && (
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">İl / İlçe:</label>
                    <input
                      type="text"
                      value={teminat.il ? `${teminat.il} / ${teminat.ilce || ''}` : ''}
                      onChange={(e) => {
                        const parts = e.target.value.split('/');
                        updateTeminat({ il: parts[0]?.trim() || '', ilce: parts[1]?.trim() || '' });
                      }}
                      className="form-control-custom text-xs"
                      placeholder="ORDU / ALTINORDU"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Mahalle / Köy:</label>
                    <input
                      type="text"
                      value={teminat.mahalleKoy || ''}
                      onChange={(e) => updateTeminat({ mahalleKoy: e.target.value })}
                      className="form-control-custom text-xs"
                      placeholder="YENİ MAHALLE"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Ada No:</label>
                    <input
                      type="text"
                      value={teminat.ada || ''}
                      onChange={(e) => updateTeminat({ ada: e.target.value })}
                      className="form-control-custom text-xs font-mono"
                      placeholder="1024"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Parsel No:</label>
                    <input
                      type="text"
                      value={teminat.parsel || ''}
                      onChange={(e) => updateTeminat({ parsel: e.target.value })}
                      className="form-control-custom text-xs font-mono"
                      placeholder="18"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Bağımsız Bölüm:</label>
                    <input
                      type="text"
                      value={teminat.bagimsizBolum || ''}
                      onChange={(e) => updateTeminat({ bagimsizBolum: e.target.value })}
                      className="form-control-custom text-xs"
                      placeholder="4 (Mesken)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Yüzölçümü &amp; Nitelik:</label>
                    <input
                      type="text"
                      value={teminat.yuzolcumu || ''}
                      onChange={(e) => updateTeminat({ yuzolcumu: e.target.value })}
                      className="form-control-custom text-xs"
                      placeholder="135 m² Betonarme Daire"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Malik &amp; Pay Oranı:</label>
                    <input
                      type="text"
                      value={teminat.tapuMaliki || ''}
                      onChange={(e) => updateTeminat({ tapuMaliki: e.target.value })}
                      className="form-control-custom text-xs"
                      placeholder="KEMAL ŞAHİN (1/1)"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAŞIT ALANLARI */}
            {teminat.tur === 'tasit' && (
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Plaka:</label>
                    <input
                      type="text"
                      value={teminat.plaka || ''}
                      onChange={(e) => updateTeminat({ plaka: e.target.value.toUpperCase() })}
                      className="form-control-custom text-xs font-mono font-bold"
                      placeholder="52 AB 456"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Marka / Model / Yıl:</label>
                    <input
                      type="text"
                      value={teminat.markaModel || ''}
                      onChange={(e) => updateTeminat({ markaModel: e.target.value })}
                      className="form-control-custom text-xs"
                      placeholder="2023 Ford Transit Custom"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Şasi Numarası:</label>
                    <input
                      type="text"
                      value={teminat.sasiNo || ''}
                      onChange={(e) => updateTeminat({ sasiNo: e.target.value })}
                      className="form-control-custom text-xs font-mono"
                      placeholder="NM0XXXTTFXP89421"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Ruhsat Sahibi:</label>
                    <input
                      type="text"
                      value={teminat.ruhsatSahibi || ''}
                      onChange={(e) => updateTeminat({ ruhsatSahibi: e.target.value })}
                      className="form-control-custom text-xs"
                      placeholder="ÜMİT ÖZTÜRK"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* BANKA ALANLARI */}
            {teminat.tur === 'banka' && (
              <div className="space-y-2 pt-1">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Banka &amp; Şube Adı:</label>
                  <input
                    type="text"
                    value={teminat.bankaAdi || ''}
                    onChange={(e) => updateTeminat({ bankaAdi: e.target.value })}
                    className="form-control-custom text-xs"
                    placeholder="T.C. Ziraat Bankası Altınordu Şubesi"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">IBAN / Hesap No:</label>
                  <input
                    type="text"
                    value={teminat.iban || ''}
                    onChange={(e) => updateTeminat({ iban: e.target.value })}
                    className="form-control-custom text-xs font-mono"
                    placeholder="TR33 0001 0001 2345 6789 0050 01"
                  />
                </div>
              </div>
            )}

            {/* MAAŞ ALANLARI */}
            {teminat.tur === 'maas' && (
              <div className="space-y-2 pt-1">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Çalışılan İşyeri:</label>
                  <input
                    type="text"
                    value={teminat.calistigiYer || ''}
                    onChange={(e) => updateTeminat({ calistigiYer: e.target.value })}
                    className="form-control-custom text-xs"
                    placeholder="ÖZTÜRK NAKLİYAT VE TİCARET LTD. ŞTİ."
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Aylık Net Ücret:</label>
                    <input
                      type="text"
                      value={teminat.aylikNetUcret || ''}
                      onChange={(e) => updateTeminat({ aylikNetUcret: e.target.value })}
                      className="form-control-custom text-xs"
                      placeholder="45.000 TL"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Kesinti Tutarı / Oranı:</label>
                    <input
                      type="text"
                      value={teminat.kesintiTutariOrani || ''}
                      onChange={(e) => updateTeminat({ kesintiTutariOrani: e.target.value })}
                      className="form-control-custom text-xs font-bold"
                      placeholder="Aylık 15.000 TL"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. METİN DÜZENLEME & DEĞİŞKENLER */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-primary)' }}
      >
        <div
          onClick={() => setActiveSection(activeSection === 'metin' ? ('' as any) : 'metin')}
          className="p-3.5 flex items-center justify-between cursor-pointer font-extrabold text-slate-800 dark:text-slate-100 text-sm"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-500" />
            <span>Muvafakatname Metni &amp; Yasal Beyan</span>
          </div>
          {activeSection === 'metin' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>

        {activeSection === 'metin' && (
          <div className="p-4 pt-0 space-y-3 border-t" style={{ borderColor: 'var(--border-primary)' }}>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                Gövde Metni:
              </span>
              <button
                type="button"
                onClick={() => {
                  const active = MUVAFAKATNAME_TEMPLATES.find((t) => t.id === data.sablonId);
                  if (active) onChange({ ...data, metin: active.metin });
                }}
                className="text-[10.5px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Orijinal Metne Dön</span>
              </button>
            </div>

            <textarea
              rows={7}
              value={metin}
              onChange={(e) => onChange({ ...data, metin: e.target.value })}
              className="form-control-custom text-xs leading-relaxed font-sans"
              placeholder="Muvafakatname metnini buraya yazabilir veya doğrudan düzenleyebilirsiniz..."
            />

            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Ek Açıklama &amp; Notlar:
              </label>
              <input
                type="text"
                value={ekNotlar || ''}
                onChange={(e) => onChange({ ...data, ekNotlar: e.target.value })}
                className="form-control-custom text-xs"
                placeholder="Örn: Haciz şerhi tapuya tescil edildikten sonra taksitlendirme onaylanacaktır."
              />
            </div>
          </div>
        )}
      </div>

      {/* 5. SGK İCRA MEMURU HUZURDA İMZA ZAPTI & İMZALAR */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-primary)' }}
      >
        <div
          onClick={() => setActiveSection(activeSection === 'imza' ? ('' as any) : 'imza')}
          className="p-3.5 flex items-center justify-between cursor-pointer font-extrabold text-slate-800 dark:text-slate-100 text-sm"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>SGK Resmî Kabul ve İcra Zaptı</span>
          </div>
          {activeSection === 'imza' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>

        {activeSection === 'imza' && (
          <div className="p-4 pt-0 space-y-3 border-t" style={{ borderColor: 'var(--border-primary)' }}>
            <div className="mt-3">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={ayarlar.huzurdaImzaZaptiVarMi}
                  onChange={(e) => updateAyarlar({ huzurdaImzaZaptiVarMi: e.target.checked })}
                  className="rounded text-teal-600"
                />
                <span>SGK 2024/12 Huzurda İmza Zaptını Göster</span>
              </label>
            </div>

            {ayarlar.huzurdaImzaZaptiVarMi && (
              <div className="space-y-3 p-3 rounded-xl bg-slate-500/5 border border-slate-300/60 dark:border-slate-700/60">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">İcra Memuru Adı:</label>
                    <input
                      type="text"
                      value={sgkZapti?.icraMemuru?.adSoyad || ''}
                      onChange={(e) => updateZapit('icraMemuru', 'adSoyad', e.target.value)}
                      className="form-control-custom text-xs"
                      placeholder="İcra Memuru Adı Soyadı"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">İcra Memuru Sicil:</label>
                    <input
                      type="text"
                      value={sgkZapti?.icraMemuru?.sicilNo || ''}
                      onChange={(e) => updateZapit('icraMemuru', 'sicilNo', e.target.value)}
                      className="form-control-custom text-xs font-mono"
                      placeholder="Sicil No: 18452"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Sorumlu Şef / Müdür Yrd.:</label>
                    <input
                      type="text"
                      value={sgkZapti?.sorumluMemur?.adSoyad || ''}
                      onChange={(e) => updateZapit('sorumluMemur', 'adSoyad', e.target.value)}
                      className="form-control-custom text-xs"
                      placeholder="Sorumlu Şef Adı"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Sorumlu Şef Sicil:</label>
                    <input
                      type="text"
                      value={sgkZapti?.sorumluMemur?.sicilNo || ''}
                      onChange={(e) => updateZapit('sorumluMemur', 'sicilNo', e.target.value)}
                      className="form-control-custom text-xs font-mono"
                      placeholder="Sicil No: 12904"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-primary)' }}>
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={ayarlar.ikinciImzaVarMi}
                  onChange={(e) => updateAyarlar({ ikinciImzaVarMi: e.target.checked })}
                  className="rounded text-teal-600"
                />
                <span>2. İmza Alanını (Asıl Borçlu / Kurum Onayı) Göster</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* 6. SAYFA VE YAZDIRMA GÖRÜNÜM AYARLARI */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-primary)' }}
      >
        <div
          onClick={() => setActiveSection(activeSection === 'gorunum' ? ('' as any) : 'gorunum')}
          className="p-3.5 flex items-center justify-between cursor-pointer font-extrabold text-slate-800 dark:text-slate-100 text-sm"
        >
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-purple-500" />
            <span>Sayfa &amp; Görünüm Ayarları</span>
          </div>
          {activeSection === 'gorunum' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>

        {activeSection === 'gorunum' && (
          <div className="p-4 pt-0 space-y-3 border-t" style={{ borderColor: 'var(--border-primary)' }}>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
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
                  <option value="sgk">SGK Resmî Amblemi</option>
                  <option value="adalet">Adalet / İcra Terazisi</option>
                  <option value="yok">Amblemsiz (Sade)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Yazı Tipi &amp; Karakter:
                </label>
                <select
                  value={ayarlar.yaziTipi}
                  onChange={(e) => updateAyarlar({ yaziTipi: e.target.value as any })}
                  className="form-control-custom text-xs font-bold"
                >
                  <option value="serif">Times New Roman (Resmî)</option>
                  <option value="sans">Arial / Sans (Modern)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Yazı Boyutu:
                </label>
                <select
                  value={ayarlar.yaziBoyutu}
                  onChange={(e) => updateAyarlar({ yaziBoyutu: e.target.value as any })}
                  className="form-control-custom text-xs font-bold"
                >
                  <option value="sm">Kompakt (Küçük)</option>
                  <option value="base">Standart Resmî (12pt)</option>
                  <option value="lg">Büyük Metin</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Antet &amp; Başlık:
                </label>
                <div className="pt-2">
                  <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={ayarlar.antetVarMi}
                      onChange={(e) => updateAyarlar({ antetVarMi: e.target.checked })}
                      className="rounded text-teal-600"
                    />
                    <span>Üst Anteti Göster</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
