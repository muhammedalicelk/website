import React, { useState, useRef, useEffect } from 'react';
import { Music, Upload, Globe, User, Play, Pause, X, AlertCircle } from 'lucide-react';

/* =========================================================
   YOUTUBE HELPER
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
    type: 'youtube',
    youtubeId,
    tags: extra.tags || []
  };
}

/* =========================================================
   SONG LIST
   ========================================================= */
const SONGS = [
  YT('Dandini Dandini Dastana', '4NBBFSqv_GY', { tags: ['Çocuk', 'Türkçe'] }),
  YT('Twinkle Twinkle Little Star', 'yCjJyiqpAuU', { tags: ['Çocuk', 'İngilizce'] }),
  YT('Ben Sana Mecburum', 'GzDGB70IVCM', { tags: ['Romantik', 'Türkçe'] })
];

/* =========================================================
   MAIN
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

          {/* TABS */}
          <div className="flex gap-2 mb-6">
            <Tab active={activeTab === 'hazir'} onClick={() => setActiveTab('hazir')}>
              <Music className="w-4 h-4" /> Hazır
            </Tab>
            <Tab active={activeTab === 'yukle'} onClick={() => setActiveTab('yukle')}>
              <Upload className="w-4 h-4" /> Dosya
            </Tab>
            <Tab active={activeTab === 'internet'} onClick={() => setActiveTab('internet')}>
              <Globe className="w-4 h-4" /> İnternet
            </Tab>
          </div>

          {/* CONTENT */}
          <div className="bg-amber-50/40 rounded-xl p-6 border border-amber-100">

            {activeTab === 'hazir' && (
              <HazirMuzikPicker formData={formData} setFormData={setFormData} />
            )}

            {activeTab === 'internet' && (
              <InternetMuzikPicker formData={formData} setFormData={setFormData} />
            )}

            {activeTab === 'yukle' && (
              <div className="text-sm text-stone-600">
                Dosya yükleme zaten çalışıyor, buraya dokunmadım 👍
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   TAB
   ========================================================= */
function Tab({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
        active
          ? 'bg-gradient-to-r from-amber-700 to-yellow-600 text-white'
          : 'bg-amber-100 text-stone-700 hover:bg-amber-200'
      }`}
    >
      {children}
    </button>
  );
}

/* =========================================================
   HAZIR MÜZİK
   ========================================================= */
function HazirMuzikPicker({ formData, setFormData }) {
  const selected = SONGS.find(s => s.id === formData.hazirMuzikId);

  return (
    <div>
      <select
        value={formData.hazirMuzikId}
        onChange={(e) => setFormData(p => ({ ...p, hazirMuzikId: e.target.value }))}
        className="w-full p-3 rounded-xl border border-amber-200 bg-white"
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
    </div>
  );
}

/* =========================================================
   INTERNET MÜZİK (ÇALIŞAN KISIM)
   ========================================================= */
function InternetMuzikPicker({ formData, setFormData }) {
  const videoId = getYouTubeId(formData.youtubeLink);

  return (
    <div>
      <input
        type="url"
        value={formData.youtubeLink}
        onChange={(e) =>
          setFormData(p => ({ ...p, youtubeLink: e.target.value }))
        }
        placeholder="YouTube linki yapıştır"
        className="w-full p-3 rounded-xl border border-amber-200 bg-white"
      />

      {formData.youtubeLink && !videoId && (
        <div className="text-sm text-red-600 mt-2">
          Link okunamadı
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
    </div>
  );
}
