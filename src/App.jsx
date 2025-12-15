import React, { useState, useRef, useEffect } from 'react';
import { Music, Upload, Globe, User, Play, Pause, X, AlertCircle } from 'lucide-react';

/* =========================================================
   HAZIR MÜZİK KATALOĞU
   ========================================================= */
const SONGS = [
  YT('Dandini Dandini Dastana', '_zsQXwIOILo', { tags: ['ninni', 'türkçe'] }),
  YT('Twinkle Twinkle Little Star', 'yCjJyiqpAuU', { tags: ['kids', 'english'] }),
  YT('Uyu Yavrum Uyu', 'kVFjaOyAK-s', { tags: ['ninni', 'türkçe'] })
];

function YT(title, youtubeId, extra = {}) {
  return {
    id: `yt_${youtubeId}`,
    title,
    type: 'youtube',
    youtubeId,
    tags: extra.tags || []
  };
}

/* =========================================================
   FAVICON + TITLE
   ========================================================= */
useEffectOnce(() => {
  document.title = 'Memory Drop Studio Ön Sipariş Ekranı';

  const link =
    document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/png';
  link.rel = 'icon';
  link.href = '/memory-drop-logo.png';
  document.head.appendChild(link);
});

function useEffectOnce(fn) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(fn, []);
}

/* =========================================================
   ANA COMPONENT
   ========================================================= */
export default function SesliOyuncakSiparis() {
  const [activeTab, setActiveTab] = useState('hazir');
  const [formData, setFormData] = useState({
    musteriAdi: '',
    telefon: '',
    hazirMuzikId: '',
    yukluDosyalar: [],
    youtubeLink: ''
  });

  /* =========================================================
     FILE UPLOAD
     ========================================================= */
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const newFiles = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      duration: 0,
      trimStart: 0,
      trimEnd: 0,
      isReady: false
    }));

    setFormData((p) => ({
      ...p,
      yukluDosyalar: [...p.yukluDosyalar, ...newFiles]
    }));

    e.target.value = '';
  };

  const removeDosya = (id) => {
    setFormData((p) => {
      const f = p.yukluDosyalar.find((x) => x.id === id);
      if (f?.url) URL.revokeObjectURL(f.url);
      return { ...p, yukluDosyalar: p.yukluDosyalar.filter((x) => x.id !== id) };
    });
  };

  const updateDosya = (id, u) => {
    setFormData((p) => ({
      ...p,
      yukluDosyalar: p.yukluDosyalar.map((x) =>
        x.id === id ? { ...x, ...u } : x
      )
    }));
  };

  /* =========================================================
     UI
     ========================================================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-stone-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* ================= HEADER ================= */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 text-center">

          {/* LOGO – YUMUŞAK KÖŞELİ KARE */}
          <div className="w-32 h-32 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-200 to-yellow-200 shadow-inner border border-amber-200 overflow-hidden flex items-center justify-center">
            <img
              src="/memory-drop-logo.png"
              alt="Memory Drop Studio"
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>

          <h1 className="text-3xl font-bold text-stone-800 mb-2">
            Memory Drop Studio Ön Sipariş Ekranı
          </h1>
          <p className="text-stone-600">
            Sevdikleriniz için özel, sesli bir oyuncak oluşturun
          </p>
        </div>

        {/* ================= FORM ================= */}
        <div className="bg-white rounded-3xl shadow-xl p-8">

          {/* İLETİŞİM */}
          <Section title="İletişim Bilgileri" icon={<User className="w-5 h-5 text-amber-700" />}>
            <Input
              label="Ad Soyad *"
              placeholder="Adınızı girin"
              value={formData.musteriAdi}
              onChange={(v) => setFormData({ ...formData, musteriAdi: v })}
            />
            <Input
              label="Telefon *"
              placeholder="0555 555 55 55"
              value={formData.telefon}
              onChange={(v) => setFormData({ ...formData, telefon: v })}
            />
          </Section>

          {/* MÜZİK */}
          <Section title="Müzik Seçimi *" icon={<Music className="w-5 h-5 text-amber-700" />}>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-sm text-amber-800 flex gap-2">
              <AlertCircle className="w-5 h-5" />
              Maksimum süre 310 saniyedir (5dk 10sn)
            </div>

            {/* TABS */}
            <div className="flex gap-2 mb-4">
              {['hazir', 'yukle', 'internet'].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`flex-1 py-3 rounded-xl font-medium transition ${
                    activeTab === t
                      ? 'bg-gradient-to-r from-amber-700 to-yellow-600 text-white'
                      : 'bg-amber-50 text-stone-700 hover:bg-amber-100'
                  }`}
                >
                  {t === 'hazir' && 'Hazır Müzik'}
                  {t === 'yukle' && 'Dosya Yükle'}
                  {t === 'internet' && 'İnternetten'}
                </button>
              ))}
            </div>

            {/* CONTENT */}
            {activeTab === 'hazir' && (
              <HazirMuzikPicker formData={formData} setFormData={setFormData} />
            )}

            {activeTab === 'yukle' && (
              <>
                <label className="block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-amber-500">
                  <Upload className="mx-auto mb-2 text-amber-700" />
                  Dosya seç (MP3 / WAV)
                  <input type="file" multiple hidden accept="audio/*" onChange={handleFileUpload} />
                </label>

                <div className="mt-4 space-y-3">
                  {formData.yukluDosyalar.map((d) => (
                    <DosyaTrimmer
                      key={d.id}
                      dosya={d}
                      onRemove={removeDosya}
                      onUpdate={updateDosya}
                    />
                  ))}
                </div>
              </>
            )}

            {activeTab === 'internet' && (
              <Input
                label="YouTube Linki"
                placeholder="https://youtube.com/watch?v=..."
                value={formData.youtubeLink}
                onChange={(v) => setFormData({ ...formData, youtubeLink: v })}
              />
            )}
          </Section>

          {/* SUBMIT */}
          <button className="w-full mt-6 bg-gradient-to-r from-amber-700 to-yellow-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:scale-[1.01] transition">
            Siparişi Tamamla
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   KÜÇÜK BİLEŞENLER
   ========================================================= */
function Section({ title, icon, children }) {
  return (
    <div className="mb-8">
      <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
        {icon} {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border-2 focus:border-amber-600 outline-none"
      />
    </div>
  );
}
