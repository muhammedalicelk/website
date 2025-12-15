import React, { useState, useRef, useEffect } from 'react';
import { Music, Upload, Globe, User, Play, Pause, X, AlertCircle } from 'lucide-react';

/* =========================================================
   ✅ HAZIR MÜZİK KATALOĞU
   Yeni şarkı eklemek için sadece buraya 1 satır ekle:
   YT('Şarkı Adı', 'YouTubeID', { tags: ['etiket1','etiket2'] }),
   ========================================================= */
const SONGS = [
  YT('Dandini Dandini Dastana', '_zsQXwIOILo', { tags: ['ninni', 'türkçe'] }),
  YT('Twinkle Twinkle Little Star', 'yCjJyiqpAuU', { tags: ['kids', 'english'] }),
  YT('Uyu Yavrum Uyu', 'kVFjaOyAK-s', { tags: ['ninni', 'türkçe'] }),

  // Örnek:
  // YT('Jingle Bells', '3CWJNqyub3o', { tags: ['christmas','english'] }),
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

if (typeof document !== 'undefined') {
  const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/png';
  link.rel = 'icon';
  link.href = '/memory-drop-logo.png'; // public içine koyduğun dosya
  document.getElementsByTagName('head')[0].appendChild(link);
}
export default function SesliOyuncakSiparis() {
  const [activeTab, setActiveTab] = useState('hazir');
  const [formData, setFormData] = useState({
    musteriAdi: '',
    telefon: '',
    muzikSecimi: 'hazir',
    hazirMuzikId: '',
    yukluDosyalar: [],
    youtubeLink: ''
  });

  // ✅ Unmount olunca tüm URL'leri temizle (memory leak olmasın)
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
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      duration: 0,
      trimStart: 0,
      trimEnd: 0,
      isReady: false
    }));

    setFormData((prev) => ({
      ...prev,
      yukluDosyalar: [...prev.yukluDosyalar, ...newFiles],
      muzikSecimi: 'yukle'
    }));

    // aynı dosyayı tekrar seçebilmek için input reset
    e.target.value = '';
  };

  // ✅ Silince objectURL revoke et
  const removeDosya = (id) => {
    setFormData((prev) => {
      const target = prev.yukluDosyalar.find((f) => f.id === id);
      if (target?.url) URL.revokeObjectURL(target.url);

      return {
        ...prev,
        yukluDosyalar: prev.yukluDosyalar.filter((f) => f.id !== id)
      };
    });
  };

  const updateDosya = (id, updates) => {
    setFormData((prev) => ({
      ...prev,
      yukluDosyalar: prev.yukluDosyalar.map((f) => (f.id === id ? { ...f, ...updates } : f))
    }));
  };

  const handleSubmit = () => {
    if (!formData.musteriAdi || !formData.telefon) {
      alert('Lütfen ad ve telefon bilgilerini doldurun!');
      return;
    }

    if (activeTab === 'hazir' && !formData.hazirMuzikId) {
      alert('Lütfen bir müzik seçin!');
      return;
    }
    if (activeTab === 'yukle' && formData.yukluDosyalar.length === 0) {
      alert('Lütfen en az bir dosya yükleyin!');
      return;
    }
    if (activeTab === 'internet' && !formData.youtubeLink) {
      alert('Lütfen bir YouTube linki girin!');
      return;
    }

    const selectedSong = SONGS.find((s) => s.id === formData.hazirMuzikId);

    alert('Siparişiniz alındı! En kısa sürede sizinle iletişime geçeceğiz.');
    console.log('Sipariş Detayları:', formData);
    console.log('Seçilen Hazır Müzik:', selectedSong);
  };

  return (
   <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-stone-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-amber-200 to-yellow-200 rounded-full mx-auto mb-4 flex items-center justify-center shadow-inner">
  <img
    src="/memory-drop-logo.png"
    alt="Memory Drop Studio"
    className="w-14 h-14 object-contain rounded-lg"
  />
</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Memory Drop Studio Ön Sipariş Ekranı</h1>
          <p className="text-gray-600">Sevdikleriniz için özel, sesli bir oyuncak oluşturun</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Müşteri Bilgileri */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-amber-700" />
              İletişim Bilgileri
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad *</label>
                <input
                  type="text"
                  value={formData.musteriAdi}
                  onChange={(e) => setFormData({ ...formData, musteriAdi: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-600 focus:outline-none transition"
                  placeholder="Adınızı girin"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefon *</label>
                <input
                  type="tel"
                  value={formData.telefon}
                  onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-600 focus:outline-none transition"
                  placeholder="0555 555 55 55"
                />
              </div>
            </div>
          </div>

          {/* Müzik Seçimi */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
              <Music className="w-5 h-5 mr-2 text-amber-700" />
              Müzik Seçimi *
            </h2>

            {/* Uyarı */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <strong>Önemli:</strong> Müzik süresi maksimum 310 saniye olmalıdır. (5dk 10sn)
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
              <button
                type="button"
                onClick={() => setActiveTab('hazir')}
                className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl font-medium transition flex items-center justify-center gap-2 ${
                  activeTab === 'hazir'
                   ? 'bg-gradient-to-r from-amber-700 to-yellow-600 text-white shadow-lg'
: 'bg-amber-50 text-stone-700 hover:bg-amber-100'
                }`}
              >
                <Music className="w-4 h-4" />
                Hazır Müzik
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('yukle')}
                className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl font-medium transition flex items-center justify-center gap-2 ${
                  activeTab === 'yukle'
                   ? 'bg-gradient-to-r from-amber-700 to-yellow-600 text-white shadow-lg'
: 'bg-amber-50 text-stone-700 hover:bg-amber-100'
                }`}
              >
                <Upload className="w-4 h-4" />
                Dosya Yükle
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('internet')}
                className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl font-medium transition flex items-center justify-center gap-2 ${
                  activeTab === 'internet'
                   ? 'bg-gradient-to-r from-amber-700 to-yellow-600 text-white shadow-lg'
: 'bg-amber-50 text-stone-700 hover:bg-amber-100'
                }`}
              >
                <Globe className="w-4 h-4" />
                İnternetten
              </button>
            </div>

            {/* İçerik */}
            <div className="bg-gray-50 rounded-xl p-6">
              {/* Hazır */}
              {activeTab === 'hazir' && (
                <HazirMuzikPicker formData={formData} setFormData={setFormData} />
              )}

              {/* Dosya Yükleme */}
              {activeTab === 'yukle' && (
                <div>
                  <p className="text-sm text-gray-600 mb-4">Dosya yükle (MP3 / WAV)</p>

                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition mb-4">
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <label className="cursor-pointer">
                      <span className="text-purple-600 font-medium hover:text-purple-700">
                        Dosya Seç (Birden fazla seçilebilir)
                      </span>
                      <input type="file" accept="audio/*" multiple onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>

                  {formData.yukluDosyalar.length > 0 && (
                    <div className="space-y-4">
                      <p className="text-sm font-medium text-gray-700">Yüklenen Dosyalar:</p>
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

              {/* İnternetten */}
              {activeTab === 'internet' && (
                <div>
                  <p className="text-sm text-gray-600 mb-4">YouTube linki gir:</p>
                  <input
                    type="url"
                    value={formData.youtubeLink}
                    onChange={(e) => setFormData({ ...formData, youtubeLink: e.target.value, muzikSecimi: 'internet' })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-600 focus:outline-none transition"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                  <p className="text-xs text-amber-600 mt-2">Not: 310 saniyelik bölümü biz seçeriz.</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Siparişi Tamamla
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Siparişiniz alındıktan sonra sizinle iletişime geçeceğiz
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ✅ Hazır Müzik Picker
   ========================================================= */
function HazirMuzikPicker({ formData, setFormData }) {
  const [query, setQuery] = useState('');

  const filtered = SONGS.filter((s) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      s.title.toLowerCase().includes(q) ||
      (s.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  });

  const selected = SONGS.find((s) => s.id === formData.hazirMuzikId);

  return (
    <div>
      <p className="text-sm text-gray-600 mb-3">Listeden seç (istersen ara):</p>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-600 focus:outline-none transition mb-3"
        placeholder="Ara: ninni / english / dandini ..."
      />

      <select
        value={formData.hazirMuzikId}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            hazirMuzikId: e.target.value,
            muzikSecimi: 'hazir'
          }))
        }
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-600 focus:outline-none transition bg-white"
      >
        <option value="">— Müzik seç —</option>
        {filtered.map((s) => (
          <option key={s.id} value={s.id}>
            {s.title}
          </option>
        ))}
      </select>

      {filtered.length === 0 && (
        <div className="mt-3 text-sm text-amber-700">Sonuç yok. Arama kelimesini değiştir.</div>
      )}

      {selected?.type === 'youtube' && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-gray-700">Seçilen: {selected.title}</div>
            <div className="text-xs text-gray-500">{selected.tags?.length ? selected.tags.join(' • ') : ''}</div>
          </div>

          <div className="rounded-xl overflow-hidden">
            <iframe
              width="100%"
              height="220"
              src={`https://www.youtube.com/embed/${selected.youtubeId}`}
              title={selected.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   ✅ DosyaTrimmer (multi-file takılma fix + kırpma)
   ========================================================= */
function DosyaTrimmer({ dosya, onRemove, onUpdate }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeThumb, setActiveThumb] = useState(null); // "start" | "end"
  const audioRef = useRef(null);

  const MIN_GAP = 0.05;
  const STEP_NORMAL = 0.05;
  const STEP_FINE = 0.005;

  // ✅ 1) Metadata'yı probe Audio ile al (2. dosyada takılma fix)
  useEffect(() => {
    let cancelled = false;

    if (dosya.isReady && dosya.duration > 0) return;

    const probe = new Audio();
    probe.preload = 'metadata';
    probe.src = dosya.url;

    const done = (dur) => {
      if (cancelled) return;
      if (!dur || isNaN(dur) || dur <= 0) return;

      const firstInit = !dosya.duration || dosya.duration <= 0;

      onUpdate(dosya.id, {
        duration: dur,
        isReady: true,
        ...(firstInit ? { trimStart: 0, trimEnd: Math.min(310, dur) } : {})
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
  }, [dosya.id, dosya.url]);

  // ✅ 2) Trim sınır kontrolü (çalarken kırpsın)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (!isPlaying) return;

      const t = audio.currentTime;

      if (t < dosya.trimStart) {
        audio.currentTime = dosya.trimStart;
        return;
      }

      if (t >= dosya.trimEnd) {
        audio.pause();
        audio.currentTime = dosya.trimStart;
        setIsPlaying(false);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      audio.currentTime = dosya.trimStart;
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isPlaying, dosya.trimStart, dosya.trimEnd]);

  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
      audio.volume = 0.6;
      audio.currentTime = dosya.trimStart;
      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      console.error('Oynatma hatası:', err);
      setIsPlaying(false);
      alert('Ses çalınamadı. Tekrar play’e bas.');
    }
  };

  const getStep = (e) => (e.shiftKey ? STEP_FINE : STEP_NORMAL);
  const snap = (val, step) => Math.round(val / step) * step;

  const handleStartChange = (e) => {
    const step = getStep(e);
    const raw = parseFloat(e.target.value);
    const value = snap(raw, step);
    const clamped = Math.min(value, dosya.trimEnd - MIN_GAP);

    const audio = audioRef.current;
    if (audio && isPlaying) audio.currentTime = clamped;

    onUpdate(dosya.id, { trimStart: clamped });
  };

  const handleEndChange = (e) => {
    const step = getStep(e);
    const raw = parseFloat(e.target.value);
    const value = snap(raw, step);
    const clamped = Math.max(value, dosya.trimStart + MIN_GAP);

    const audio = audioRef.current;
    if (audio && isPlaying && audio.currentTime >= clamped) {
      audio.pause();
      audio.currentTime = dosya.trimStart;
      setIsPlaying(false);
    }

    onUpdate(dosya.id, { trimEnd: clamped });
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
    <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
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
        .trimRange:active::-webkit-slider-thumb {
          cursor: grabbing;
          transform: scale(1.05);
        }

.trimRange.end::-webkit-slider-thumb { border-color: #92400e; }
        }

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
.trimRange.end::-webkit-slider-thumb { border-color: #92400e; }
        }
        .trimRange::-moz-range-track {
          background: transparent;
          border: none;
        }
      `}</style>

      <audio ref={audioRef} src={dosya.url} preload="metadata" />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button
            type="button"
            onClick={togglePlay}
            disabled={!dosya.isReady}
            className={`p-2 rounded-full transition flex-shrink-0 ${
              dosya.isReady
                ? 'bg-purple-100 hover:bg-purple-200 active:scale-95'
                : 'bg-gray-100 cursor-not-allowed opacity-50'
            }`}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-purple-600" />
            ) : (
              <Play className="w-4 h-4 text-purple-600" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <span className="text-sm text-gray-700 truncate block">{dosya.name}</span>
            {!dosya.isReady ? (
              <span className="text-xs text-amber-600 animate-pulse">⏳ Dosya hazırlanıyor...</span>
            ) : (
              <span className="text-xs text-green-600">✓ Hazır - Toplam: {formatTime(dosya.duration)}</span>
            )}

            <div className="text-[11px] text-gray-500 mt-1">
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
          <div className="flex justify-between text-xs text-gray-600">
            <span>
              Başlangıç: <strong>{formatTime(dosya.trimStart)}</strong>
            </span>
            <span>
              Bitiş: <strong>{formatTime(dosya.trimEnd)}</strong>
            </span>
            <span className={selectedDuration > 310 ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>
              Süre: {formatTime(selectedDuration)}
            </span>
          </div>

          <div className="relative">
            <div
              className="h-2 rounded-lg bg-gray-200"
              style={{
                background: `linear-gradient(to right,
                  #e5e7eb 0%,
                  #e5e7eb ${startPct}%,
                  #b45309 ${startPct}%,
                  #b45309 ${endPct}%,
                  #e5e7eb ${endPct}%,
                  #e5e7eb 100%)`
              }}
            />

            {/* Start */}
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

            {/* End */}
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

            <div className="flex justify-between text-xs text-gray-400 mt-2">
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
