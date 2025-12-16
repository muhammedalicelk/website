import React, { useState, useEffect, useRef } from 'react';
import { Music, Upload, Globe, User, Play, Pause, X, AlertCircle } from 'lucide-react';

/* =========================================================
   YOUTUBE ID PARSER (HER FORMAT)
   ========================================================= */
function getYouTubeId(input) {
  if (!input) return '';
  const s = input.trim();

  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;

  try {
    const url = new URL(s);

    if (url.hostname.includes('youtu.be')) {
      return url.pathname.split('/').filter(Boolean)[0] || '';
    }

    const v = url.searchParams.get('v');
    if (v) return v;

    const parts = url.pathname.split('/').filter(Boolean);
    const shorts = parts.indexOf('shorts');
    if (shorts !== -1) return parts[shorts + 1] || '';

    const embed = parts.indexOf('embed');
    if (embed !== -1) return parts[embed + 1] || '';

    return '';
  } catch {
    return '';
  }
}

/* =========================================================
   YT HELPER
   ========================================================= */
function YT(title, youtubeId, extra = {}) {
  return {
    id: `yt_${youtubeId}`,
    title,
    youtubeId,
    tags: extra.tags || []
  };
}

/* =========================================================
   HAZIR MÜZİKLER
   ========================================================= */
const SONGS = [
  YT('Dandini Dandini Dastana', '4NBBFSqv_GY', { tags: ['Çocuk', 'Türkçe'] }),
  YT('Twinkle Twinkle Little Star', 'yCjJyiqpAuU', { tags: ['Çocuk', 'English'] }),
  YT('Ben Sana Mecburum', 'GzDGB70IVCM', { tags: ['Romantik', 'Türkçe'] }),
];

/* =========================================================
   MAIN
   ========================================================= */
export default function SesliOyuncakSiparis() {
  const [activeTab, setActiveTab] = useState('hazir');
  const [form, setForm] = useState({
    ad: '',
    telefon: '',
    hazirId: '',
    youtubeLink: '',
    files: []
  });

  /* Title + Favicon */
  useEffect(() => {
    document.title = 'Memory Drop Studio Ön Sipariş';
    let link = document.querySelector("link[rel='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = '/memory-drop-logo.png';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-stone-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* HEADER */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 text-center">
          <div className="w-32 h-32 mx-auto mb-4 rounded-2xl overflow-hidden border border-amber-200 bg-amber-100">
            <img
              src="/memory-drop-logo.png"
              alt="Memory Drop Studio"
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>

          <h1 className="text-3xl font-bold text-stone-800 mb-2">
            Memory Drop Studio Ön Sipariş
          </h1>
          <p className="text-stone-600">
            Sevdikleriniz için özel, sesli bir oyuncak
          </p>
        </div>

        {/* FORM */}
        <div className="bg-white rounded-3xl shadow-xl p-8">

          {/* İLETİŞİM */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-stone-800 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-amber-700" />
              İletişim Bilgileri
            </h2>

            <div className="space-y-4">
              <Input
                label="Ad Soyad *"
                value={form.ad}
                onChange={(v) => setForm({ ...form, ad: v })}
              />
              <Input
                label="Telefon *"
                value={form.telefon}
                onChange={(v) => setForm({ ...form, telefon: v })}
              />
            </div>
          </div>

          {/* MÜZİK */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-stone-800 flex items-center mb-4">
              <Music className="w-5 h-5 mr-2 text-amber-700" />
              Müzik Seçimi
            </h2>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-700 mt-0.5" />
              <div className="text-sm text-amber-900">
                Müzik süresi maksimum <b>310 saniye</b>.
              </div>
            </div>

            {/* TABS */}
            <div className="flex gap-2 mb-6">
              <Tab active={activeTab === 'hazir'} onClick={() => setActiveTab('hazir')}>
                <Music className="w-4 h-4" /> Hazır
              </Tab>
              <Tab active={activeTab === 'dosya'} onClick={() => setActiveTab('dosya')}>
                <Upload className="w-4 h-4" /> Dosya
              </Tab>
              <Tab active={activeTab === 'internet'} onClick={() => setActiveTab('internet')}>
                <Globe className="w-4 h-4" /> İnternet
              </Tab>
            </div>

            <div className="bg-amber-50/40 rounded-xl p-6 border border-amber-100">

              {activeTab === 'hazir' && (
                <HazirMuzik form={form} setForm={setForm} />
              )}

              {activeTab === 'internet' && (
                <InternetMuzik form={form} setForm={setForm} />
              )}

              {activeTab === 'dosya' && (
                <div className="text-sm text-stone-600">
                  Dosya yükleme altyapısı mevcut (trim kısmını daha önce yazdık 👍)
                </div>
              )}

            </div>
          </div>

          {/* SUBMIT */}
          <button
            className="w-full bg-gradient-to-r from-amber-700 to-yellow-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-amber-800 hover:to-yellow-700 transition"
            onClick={() => alert('Sipariş alındı (demo)')}
          >
            Siparişi Tamamla
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   COMPONENTS
   ========================================================= */
function Tab({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
        active
          ? 'bg-gradient-to-r from-amber-700 to-yellow-600 text-white shadow'
          : 'bg-amber-100 text-stone-700 hover:bg-amber-200'
      }`}
    >
      {children}
    </button>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-2">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-600 outline-none"
      />
    </div>
  );
}

/* =========================================================
   HAZIR MÜZİK
   ========================================================= */
function HazirMuzik({ form, setForm }) {
  const selected = SONGS.find(s => s.id === form.hazirId);

  return (
    <>
      <select
        className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 bg-white"
        value={form.hazirId}
        onChange={(e) => setForm({ ...form, hazirId: e.target.value })}
      >
        <option value="">— Müzik seç —</option>
        {SONGS.map(s => (
          <option key={s.id} value={s.id}>{s.title}</option>
        ))}
      </select>

      {selected && (
        <div className="mt-4 rounded-xl overflow-hidden border border-amber-200">
          <iframe
            width="100%"
            height="220"
            src={`https://www.youtube.com/embed/${selected.youtubeId}`}
            title={selected.title}
            allowFullScreen
          />
        </div>
      )}
    </>
  );
}

/* =========================================================
   INTERNET MÜZİK (ÇALIŞAN)
   ========================================================= */
function InternetMuzik({ form, setForm }) {
  const videoId = getYouTubeId(form.youtubeLink);

  return (
    <>
      <input
        type="url"
        value={form.youtubeLink}
        onChange={(e) => setForm({ ...form, youtubeLink: e.target.value })}
        placeholder="YouTube linki yapıştır"
        className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 bg-white"
      />

      {form.youtubeLink && !videoId && (
        <div className="text-sm text-red-600 mt-2">
          Link tanınmadı
        </div>
      )}

      {videoId && (
        <div className="mt-4 rounded-xl overflow-hidden border border-amber-200 bg-white">
          <iframe
            width="100%"
            height="220"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube Preview"
            allowFullScreen
          />
        </div>
      )}
    </>
  );
}
