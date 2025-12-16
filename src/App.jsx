import React, { useState, useRef, useEffect } from 'react';
import { Music, Upload, Globe, User, Play, Pause, X, AlertCircle } from 'lucide-react';

function YT(title, youtubeId, extra = {}) {
  return {
    id: `yt_${youtubeId}`,
    title,
    type: 'youtube',
    youtubeId,
    tags: extra.tags || [],
  };
}
const SONGS = [
  /* =====================
     ÇOCUK
     ===================== */
  YT('Dandini Dandini Dastana', '_zsQXwIOILo', { tags: ['Çocuk', 'Türkçe'] }),
  YT('Twinkle Twinkle Little Star', 'yCjJyiqpAuU', { tags: ['Çocuk', 'İngilizce'] }),

  /* =====================
     TÜRKÇE ROMANTİK
     ===================== */
  YT('Sen Benim Şarkılarımsın', 'xkq5q2R0Q9A', { tags: ['Romantik', 'Türkçe'] }),
  YT('Senden Daha Güzel', '9QpGZbQk1jA', { tags: ['Romantik', 'Türkçe'] }),
  YT('Bir Tek Sen', 'bqE1VZ4XK3E', { tags: ['Romantik', 'Türkçe'] }),
  YT('Ben Sana Mecburum', 'Y1c1n1F6eGQ', { tags: ['Romantik', 'Türkçe'] }),
  YT('Aşk', 'kJpG7yZqYpE', { tags: ['Romantik', 'Türkçe'] }),

  /* =====================
     R&B
     ===================== */
  YT("What You Won't Do For Love", 'n9DmdAwUbxc', { tags: ['R&B', 'İngilizce'] }),

  /* =====================
     ROMANTİK – İSPANYOLCA
     ===================== */
  YT('La Mentira', 'P8BLkulZGX8', { tags: ['Romantik', 'İspanyolca'] }),
  YT('Obsesión', 'AKDLoUSaPV8', { tags: ['Romantik', 'İspanyolca'] }),
  YT('Bésame Mucho', 'M4z6xdu1iX8', { tags: ['Romantik', 'İspanyolca'] }),
  YT('Historia de un Amor', 'WJdgon8MF3Y', { tags: ['Romantik', 'İspanyolca'] }),

  /* =====================
     ROMANTİK – İNGİLİZCE
     ===================== */
  YT('Dance Me to the End of Love', '8StKOyYY3Gs', { tags: ['Romantik', 'İngilizce'] }),
  YT('I Love You Baby', 'AiIBKcd4m5Q', { tags: ['Romantik', 'İngilizce'] }),
  YT('And I Love You So', 'SKp1HKM_4TY', { tags: ['Romantik', 'İngilizce'] }),
];


// ✅ crypto.randomUUID yoksa fallback
function makeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export default function SesliOyuncakSiparis() {
  const [activeTab, setActiveTab] = useState('hazir');
  const [formData, setFormData] = useState({
    musteriAdi: '',
    telefon: '',
    hazirMuzikId: '',
    yukluDosyalar: [],
    youtubeLink: ''
  });

  // ✅ Title + Favicon (component içinde, güvenli)
  useEffect(() => {
    document.title = 'Memory Drop Studio Ön Sipariş Ekranı';

    const href = '/memory-drop-logo.png';
    let link = document.querySelector("link[rel='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.type = 'image/png';
    link.href = href;
  }, []);

  // ✅ Unmount olunca objectURL temizle
  useEffect(() => {
    return () => {
      for (const f of formData.yukluDosyalar) {
        if (f?.url) URL.revokeObjectURL(f.url);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const newFiles = files.map((file) => ({
      id: makeId(),
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
      const target = p.yukluDosyalar.find((x) => x.id === id);
      if (target?.url) URL.revokeObjectURL(target.url);
      return { ...p, yukluDosyalar: p.yukluDosyalar.filter((x) => x.id !== id) };
    });
  };

  const updateDosya = (id, updates) => {
    setFormData((p) => ({
      ...p,
      yukluDosyalar: p.yukluDosyalar.map((x) => (x.id === id ? { ...x, ...updates } : x))
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-stone-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* HEADER */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 text-center">
          {/* LOGO: yumuşak köşeli kare */}
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
                value={formData.musteriAdi}
                onChange={(v) => setFormData({ ...formData, musteriAdi: v })}
                placeholder="Adınızı girin"
              />
              <Input
                label="Telefon *"
                value={formData.telefon}
                onChange={(v) => setFormData({ ...formData, telefon: v })}
                placeholder="0555 555 55 55"
              />
            </div>
          </div>

          {/* MÜZİK */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-stone-800 flex items-center mb-4">
              <Music className="w-5 h-5 mr-2 text-amber-700" />
              Müzik Seçimi *
            </h2>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900">
                <strong>Önemli:</strong> Müzik süresi maksimum 310 saniye olmalıdır. (5dk 10sn)
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
              <TabButton active={activeTab === 'hazir'} onClick={() => setActiveTab('hazir')}>
                Hazır Müzik
              </TabButton>
              <TabButton active={activeTab === 'yukle'} onClick={() => setActiveTab('yukle')}>
                Dosya Yükle
              </TabButton>
              <TabButton active={activeTab === 'internet'} onClick={() => setActiveTab('internet')}>
                İnternetten
              </TabButton>
            </div>

            <div className="bg-amber-50/30 rounded-xl p-6 border border-amber-100">
              {activeTab === 'hazir' && (
                <HazirMuzikPicker formData={formData} setFormData={setFormData} />
              )}

              {activeTab === 'yukle' && (
                <div>
                  <p className="text-sm text-stone-700 mb-4">Dosya yükle (MP3 / WAV)</p>

                  <div className="border-2 border-dashed border-amber-200 rounded-xl p-8 text-center hover:border-amber-500 transition mb-4 bg-white">
                    <Upload className="w-12 h-12 mx-auto text-amber-700 mb-3" />
                    <label className="cursor-pointer">
                      <span className="text-amber-800 font-medium hover:text-amber-900">
                        Dosya Seç (Birden fazla seçilebilir)
                      </span>
                      <input type="file" accept="audio/*" multiple onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>

                  {formData.yukluDosyalar.length > 0 && (
                    <div className="space-y-4">
                      <p className="text-sm font-medium text-stone-700">Yüklenen Dosyalar:</p>
                      {formData.yukluDosyalar.map((dosya) => (
                        <DosyaTrimmer
                          key={dosya.id}
                          dosya={dosya}
                          onRemove={removeDosya}
                          onUpdate={updateDosya}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'internet' && (
                <div>
                  <p className="text-sm text-stone-700 mb-4">YouTube linki gir:</p>
                  <input
                    type="url"
                    value={formData.youtubeLink}
                    onChange={(e) => setFormData({ ...formData, youtubeLink: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-600 focus:outline-none transition bg-white"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                  <p className="text-xs text-amber-700 mt-2">Not: 310 saniyelik bölümü biz seçeriz.</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="button"
            className="w-full bg-gradient-to-r from-amber-700 to-yellow-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-amber-800 hover:to-yellow-700 transition shadow-lg hover:shadow-xl"
          >
            Siparişi Tamamla
          </button>

          <p className="text-xs text-stone-500 text-center mt-4">
            Siparişiniz alındıktan sonra sizinle iletişime geçeceğiz
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   UI HELPERS
   ========================================================= */
function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl font-medium transition ${
        active
          ? 'bg-gradient-to-r from-amber-700 to-yellow-600 text-white shadow-lg'
          : 'bg-amber-50 text-stone-700 hover:bg-amber-100'
      }`}
    >
      {children}
    </button>
  );
}

function Input({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-2">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-600 focus:outline-none transition bg-white"
        placeholder={placeholder}
      />
    </div>
  );
}

/* =========================================================
   HAZIR MÜZİK PICKER
   ========================================================= */
function HazirMuzikPicker({ formData, setFormData }) {
  const [query, setQuery] = useState('');

  const filtered = SONGS.filter((s) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return s.title.toLowerCase().includes(q) || (s.tags || []).some((t) => t.toLowerCase().includes(q));
  });

  const selected = SONGS.find((s) => s.id === formData.hazirMuzikId);

  return (
    <div>
      <p className="text-sm text-stone-700 mb-3">Listeden seç (istersen ara):</p>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-600 focus:outline-none transition mb-3 bg-white"
        placeholder="Ara: ninni / english / dandini ..."
      />

      <select
        value={formData.hazirMuzikId}
        onChange={(e) =>
          setFormData((p) => ({
            ...p,
            hazirMuzikId: e.target.value
          }))
        }
        className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-600 focus:outline-none transition bg-white"
      >
        <option value="">— Müzik seç —</option>
        {filtered.map((s) => (
          <option key={s.id} value={s.id}>
            {s.title}
          </option>
        ))}
      </select>

      {selected?.type === 'youtube' && (
        <div className="mt-4">
          <div className="text-sm font-semibold text-stone-700 mb-2">Seçilen: {selected.title}</div>
          <div className="rounded-xl overflow-hidden border border-amber-100 bg-white">
            <iframe
              width="100%"
              height="220"
              src={`https://www.youtube.com/embed/${selected.youtubeId}`}
              title={selected.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   DOSYA TRIMMER (multi-file metadata fix + trim sırasında kırpma)
   ========================================================= */
function DosyaTrimmer({ dosya, onRemove, onUpdate }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeThumb, setActiveThumb] = useState(null);
  const audioRef = useRef(null);

  const MIN_GAP = 0.05;
  const STEP_NORMAL = 0.05;
  const STEP_FINE = 0.005;

  // metadata probe (2. dosya takılma fix)
  useEffect(() => {
    let cancelled = false;

    if (dosya.isReady && dosya.duration > 0) return;

    const probe = new Audio();
    probe.preload = 'metadata';
    probe.src = dosya.url;

    const done = (dur) => {
      if (cancelled) return;
      if (!dur || isNaN(dur) || dur <= 0) return;

      onUpdate(dosya.id, {
        duration: dur,
        isReady: true,
        trimStart: 0,
        trimEnd: Math.min(310, dur)
      });
    };

    probe.onloadedmetadata = () => done(probe.duration);
    probe.onerror = () => {
      setTimeout(() => {
        if (cancelled) return;
        const retry = new Audio();
        retry.preload = 'metadata';
        retry.src = dosya.url;
        retry.onloadedmetadata = () => done(retry.duration);
        retry.load();
      }, 150);
    };

    probe.load();

    return () => {
      cancelled = true;
      probe.src = '';
    };
  }, [dosya.id, dosya.url]); // sadece url değişince

  // play sırasında trim uygula
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => {
      if (!isPlaying) return;
      const t = audio.currentTime;

      if (t < dosya.trimStart) audio.currentTime = dosya.trimStart;
      if (t >= dosya.trimEnd) {
        audio.pause();
        audio.currentTime = dosya.trimStart;
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', onTime);
    return () => audio.removeEventListener('timeupdate', onTime);
  }, [isPlaying, dosya.trimStart, dosya.trimEnd]);

  const formatTime = (s) => {
    if (s === null || s === undefined || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || !dosya.isReady) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      audio.currentTime = dosya.trimStart;
      await audio.play();
      setIsPlaying(true);
    } catch (e) {
      console.error(e);
      setIsPlaying(false);
      alert('Tarayıcı ses çalmayı engelledi. Play’e tekrar bas.');
    }
  };

  const snap = (val, step) => Math.round(val / step) * step;
  const getStep = (e) => (e.shiftKey ? STEP_FINE : STEP_NORMAL);

  const handleStartChange = (e) => {
    const step = getStep(e);
    const raw = parseFloat(e.target.value);
    const value = snap(raw, step);
    const clamped = Math.min(value, dosya.trimEnd - MIN_GAP);
    onUpdate(dosya.id, { trimStart: Math.max(0, clamped) });
    if (audioRef.current && isPlaying) audioRef.current.currentTime = Math.max(0, clamped);
  };

  const handleEndChange = (e) => {
    const step = getStep(e);
    const raw = parseFloat(e.target.value);
    const value = snap(raw, step);
    const clamped = Math.max(value, dosya.trimStart + MIN_GAP);
    onUpdate(dosya.id, { trimEnd: Math.min(dosya.duration, clamped) });
  };

  const handleWheel = (type, e) => {
    e.preventDefault();
    const step = e.shiftKey ? STEP_FINE : STEP_NORMAL;
    const dir = e.deltaY < 0 ? step : -step;

    if (type === 'start') {
      const next = Math.min(Math.max(0, dosya.trimStart + dir), dosya.trimEnd - MIN_GAP);
      onUpdate(dosya.id, { trimStart: next });
      if (audioRef.current && isPlaying) audioRef.current.currentTime = next;
    } else {
      const next = Math.max(Math.min(dosya.duration, dosya.trimEnd + dir), dosya.trimStart + MIN_GAP);
      onUpdate(dosya.id, { trimEnd: next });
    }
  };

  const selectedDuration = dosya.trimEnd - dosya.trimStart;
  const startPct = dosya.duration ? (dosya.trimStart / dosya.duration) * 100 : 0;
  const endPct = dosya.duration ? (dosya.trimEnd / dosya.duration) * 100 : 0;

  return (
    <div className="bg-white border border-amber-200 rounded-xl p-4">
      <style>{`
        .trimRange {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 26px;
          background: transparent;
          pointer-events: none;
          position: absolute;
          left: 0;
          top: -10px;
        }
        .trimRange::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 9999px;
          background: white;
          border: 2px solid #b45309;
          box-shadow: 0 1px 3px rgba(0,0,0,0.25);
          pointer-events: auto;
          cursor: grab;
        }
        .trimRange.end::-webkit-slider-thumb { border-color: #92400e; }
        .trimRange::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 9999px;
          background: white;
          border: 2px solid #b45309;
          box-shadow: 0 1px 3px rgba(0,0,0,0.25);
          pointer-events: auto;
          cursor: grab;
        }
        .trimRange.end::-moz-range-thumb { border-color: #92400e; }
        .trimRange::-moz-range-track { background: transparent; border: none; }
      `}</style>

      <audio ref={audioRef} src={dosya.url} preload="metadata" />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button
            type="button"
            onClick={togglePlay}
            disabled={!dosya.isReady}
            className={`p-2 rounded-full transition flex-shrink-0 ${
              dosya.isReady ? 'bg-amber-100 hover:bg-amber-200' : 'bg-stone-100 opacity-50 cursor-not-allowed'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4 text-amber-800" /> : <Play className="w-4 h-4 text-amber-800" />}
          </button>

          <div className="flex-1 min-w-0">
            <span className="text-sm text-stone-800 truncate block">{dosya.name}</span>
            {!dosya.isReady ? (
              <span className="text-xs text-amber-700 animate-pulse">⏳ Dosya hazırlanıyor...</span>
            ) : (
              <span className="text-xs text-stone-600">✓ Hazır - Toplam: {formatTime(dosya.duration)}</span>
            )}
            <div className="text-[11px] text-stone-500 mt-1">
              İpucu: Hassas ayar için <b>SHIFT</b> + <b>mouse tekerleğini</b> kullanınız
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onRemove(dosya.id)}
          className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition flex-shrink-0"
        >
          <X className="w-4 h-4 text-red-600" />
        </button>
      </div>

      {dosya.isReady && dosya.duration > 0 && (
        <div className="space-y-3 mt-4">
          <div className="flex justify-between text-xs text-stone-700">
            <span>Başlangıç: <strong>{formatTime(dosya.trimStart)}</strong></span>
            <span>Bitiş: <strong>{formatTime(dosya.trimEnd)}</strong></span>
            <span className={selectedDuration > 310 ? 'text-red-600 font-bold' : 'text-green-700 font-bold'}>
              Süre: {formatTime(selectedDuration)}
            </span>
          </div>

          <div className="relative">
            <div
              className="h-2 rounded-lg bg-stone-200"
              style={{
                background: `linear-gradient(to right,
                  #e7e5e4 0%,
                  #e7e5e4 ${startPct}%,
                  #b45309 ${startPct}%,
                  #b45309 ${endPct}%,
                  #e7e5e4 ${endPct}%,
                  #e7e5e4 100%)`
              }}
            />

            <input
              type="range"
              min="0"
              max={Math.max(0, dosya.duration - MIN_GAP)}
              step={STEP_FINE}
              value={dosya.trimStart}
              onPointerDown={() => setActiveThumb('start')}
              onMouseDown={() => setActiveThumb('start')}
              onTouchStart={() => setActiveThumb('start')}
              onWheel={(e) => handleWheel('start', e)}
              onChange={handleStartChange}
              className="trimRange start"
              style={{ zIndex: activeThumb === 'start' ? 3 : 2 }}
            />

            <input
              type="range"
              min={MIN_GAP}
              max={dosya.duration}
              step={STEP_FINE}
              value={dosya.trimEnd}
              onPointerDown={() => setActiveThumb('end')}
              onMouseDown={() => setActiveThumb('end')}
              onTouchStart={() => setActiveThumb('end')}
              onWheel={(e) => handleWheel('end', e)}
              onChange={handleEndChange}
              className="trimRange end"
              style={{ zIndex: activeThumb === 'end' ? 3 : 2 }}
            />

            <div className="flex justify-between text-xs text-stone-400 mt-2">
              <span>0:00</span>
              <span>{formatTime(dosya.duration)}</span>
            </div>
          </div>

          {selectedDuration > 310 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <p className="text-xs text-red-600">Seçili süre 310 saniyeden fazla! Lütfen kısaltın.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
