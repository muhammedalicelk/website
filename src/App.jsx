import React, { useState, useRef, useEffect } from 'react';
import { Music, Upload, Globe, User, Check, Play, Pause, X, AlertCircle } from 'lucide-react';

// Favicon ekle
if (typeof document !== 'undefined') {
  const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/svg+xml';
  link.rel = 'icon';
  link.href =
    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">🎵</text></svg>';
  document.getElementsByTagName('head')[0].appendChild(link);
}

export default function SesliOyuncakSiparis() {
  const [activeTab, setActiveTab] = useState('hazir');
  const [formData, setFormData] = useState({
    musteriAdi: '',
    telefon: '',
    muzikSecimi: 'hazir',
    hazirMuzik: '',
    yukluDosyalar: [],
    youtubeLink: ''
  });

  // Hazır müzik listesi - YouTube
  const [hazirMuzikler] = useState([
    { id: 1, isim: 'Dandini Dandini Dastana', type: 'youtube', youtubeId: '_zsQXwIOILo' },
    { id: 2, isim: 'Twinkle Twinkle Little Star', type: 'youtube', youtubeId: 'yCjJyiqpAuU' },
    { id: 3, isim: 'Uyu Yavrum Uyu', type: 'youtube', youtubeId: 'kVFjaOyAK-s' }
  ]);

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
  };

  const removeDosya = (id) => {
    setFormData((prev) => ({
      ...prev,
      yukluDosyalar: prev.yukluDosyalar.filter((f) => f.id !== id)
    }));
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

    if (activeTab === 'hazir' && !formData.hazirMuzik) {
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

    alert('Siparişiniz alındı! En kısa sürede sizinle iletişime geçeceğiz.');
    console.log('Sipariş Detayları:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Music className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Sesli Oyuncak Siparişi</h1>
          <p className="text-gray-600">Sevdikleriniz için özel, sesli bir oyuncak oluşturun</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Müşteri Bilgileri */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-purple-500" />
              İletişim Bilgileri
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad *</label>
                <input
                  type="text"
                  value={formData.musteriAdi}
                  onChange={(e) => setFormData({ ...formData, musteriAdi: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition"
                  placeholder="Adınızı girin"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefon *</label>
                <input
                  type="tel"
                  value={formData.telefon}
                  onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition"
                  placeholder="0555 555 55 55"
                />
              </div>
            </div>
          </div>

          {/* Müzik Seçimi */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
              <Music className="w-5 h-5 mr-2 text-purple-500" />
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
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                <div>
                  <p className="text-sm text-gray-600 mb-4">Listeden seç ve dinle:</p>
                  <div className="space-y-3">
                    {hazirMuzikler.map((muzik) => (
                      <div key={muzik.id}>
                        <label
                          className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition ${
                            formData.hazirMuzik === muzik.isim
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="hazirMuzik"
                            value={muzik.isim}
                            checked={formData.hazirMuzik === muzik.isim}
                            onChange={(e) =>
                              setFormData({ ...formData, hazirMuzik: e.target.value, muzikSecimi: 'hazir' })
                            }
                            className="w-4 h-4 text-purple-500"
                          />
                          <span className="ml-3 text-gray-700 flex-1">{muzik.isim}</span>
                          {formData.hazirMuzik === muzik.isim && <Check className="w-5 h-5 ml-2 text-purple-500" />}
                        </label>

                        {muzik.type === 'youtube' && formData.hazirMuzik === muzik.isim && (
                          <div className="mt-3 rounded-xl overflow-hidden">
                            <iframe
                              width="100%"
                              height="200"
                              src={`https://www.youtube.com/embed/${muzik.youtubeId}`}
                              title={muzik.isim}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="rounded-xl"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Yükle */}
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
                        <DosyaTrimmer key={dosya.id} dosya={dosya} onRemove={removeDosya} onUpdate={updateDosya} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* İnternet */}
              {activeTab === 'internet' && (
                <div>
                  <p className="text-sm text-gray-600 mb-4">YouTube linki gir:</p>
                  <input
                    type="url"
                    value={formData.youtubeLink}
                    onChange={(e) => setFormData({ ...formData, youtubeLink: e.target.value, muzikSecimi: 'internet' })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition"
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

          <p className="text-xs text-gray-500 text-center mt-4">Siparişiniz alındıktan sonra sizinle iletişime geçeceğiz</p>
        </div>
      </div>
    </div>
  );
}

/* ===========================
   TEK BAR + 2 YUVARLAK TUTAMAÇ
   + HASSAS AYAR
   - Normal sürükle: 0.05s
   - SHIFT ile: 0.005s
   - Mouse wheel: mikro ayar
   =========================== */
function DosyaTrimmer({ dosya, onRemove, onUpdate }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeThumb, setActiveThumb] = useState(null); // "start" | "end"
  const audioRef = useRef(null);

  const MIN_GAP = 0.05;      // 50ms minimum aralık
  const STEP_NORMAL = 0.05;  // normal
  const STEP_FINE = 0.005;   // SHIFT ile ultra hassas

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      const dur = audio.duration;
      if (!dur || isNaN(dur) || dur <= 0) return;

      const firstInit = !dosya.duration || dosya.duration <= 0;

      onUpdate(dosya.id, {
        duration: dur,
        isReady: true,
        ...(firstInit ? { trimStart: 0, trimEnd: Math.min(310, dur) } : {})
      });
    };

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

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleLoadedMetadata);
    audio.addEventListener('loadeddata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    audio.preload = 'auto';
    if (audio.readyState === 0) audio.load();
    else if (audio.duration) handleLoadedMetadata();

    const timeout = setTimeout(() => {
      if (audio.duration) handleLoadedMetadata();
    }, 500);

    return () => {
      clearTimeout(timeout);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleLoadedMetadata);
      audio.removeEventListener('loadeddata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [dosya.id, dosya.trimStart, dosya.trimEnd, dosya.duration, isPlaying, onUpdate]);

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

  // Mouse wheel micro-adjust
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
          height: 26px;              /* yakalamayı kolaylaştır */
          background: transparent;
          pointer-events: none;      /* sadece thumb tıklanabilir */
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
          border: 2px solid #a855f7;
          box-shadow: 0 1px 3px rgba(0,0,0,0.25);
          pointer-events: auto;
          cursor: grab;
        }
        .trimRange:active::-webkit-slider-thumb {
          cursor: grabbing;
          transform: scale(1.05);
        }

        .trimRange.end::-webkit-slider-thumb {
          border-color: #ec4899; /* end pembe */
        }

        /* Firefox */
        .trimRange::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 9999px;
          background: white;
          border: 2px solid #a855f7;
          box-shadow: 0 1px 3px rgba(0,0,0,0.25);
          pointer-events: auto;
          cursor: grab;
        }
        .trimRange.end::-moz-range-thumb {
          border-color: #ec4899;
        }
        .trimRange::-moz-range-track {
          background: transparent;
          border: none;
        }
      `}</style>

      <audio ref={audioRef} src={dosya.url} preload="auto" />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button
            type="button"
            onClick={togglePlay}
            disabled={!dosya.isReady}
            className={`p-2 rounded-full transition flex-shrink-0 ${
              dosya.isReady ? 'bg-purple-100 hover:bg-purple-200 active:scale-95' : 'bg-gray-100 cursor-not-allowed opacity-50'
            }`}
            title={dosya.isReady ? (isPlaying ? 'Durdur' : 'Oynat') : 'Dosya yükleniyor...'}
          >
            {isPlaying ? <Pause className="w-4 h-4 text-purple-600" /> : <Play className="w-4 h-4 text-purple-600" />}
          </button>

          <div className="flex-1 min-w-0">
            <span className="text-sm text-gray-700 truncate block">{dosya.name}</span>
            {!dosya.isReady ? (
              <span className="text-xs text-amber-600 animate-pulse">⏳ Dosya hazırlanıyor...</span>
            ) : (
              <span className="text-xs text-green-600">✓ Hazır - Toplam: {formatTime(dosya.duration)}</span>
            )}
            <div className="text-[11px] text-gray-500 mt-1">
              İpucu: <b>SHIFT</b> ile ultra hassas · Mouse wheel ile mikro ayar
            </div>
          </div>
        </div>

        <button type="button" onClick={() => onRemove(dosya.id)} className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition flex-shrink-0">
          <X className="w-4 h-4 text-red-600" />
        </button>
      </div>

      {dosya.isReady && dosya.duration > 0 && (
        <div className="space-y-3 mt-4">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Başlangıç: <strong>{formatTime(dosya.trimStart)}</strong></span>
            <span>Bitiş: <strong>{formatTime(dosya.trimEnd)}</strong></span>
            <span className={selectedDuration > 310 ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>
              Süre: {formatTime(selectedDuration)}
            </span>
          </div>

          {/* Tek bar + iki thumb */}
          <div className="relative">
            <div
              className="h-2 rounded-lg bg-gray-200"
              style={{
                background: `linear-gradient(to right,
                  #e5e7eb 0%,
                  #e5e7eb ${startPct}%,
                  #a855f7 ${startPct}%,
                  #a855f7 ${endPct}%,
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
