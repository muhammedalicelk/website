import React, { useState, useRef, useEffect } from 'react';
import { Music, Upload, Globe, User, Phone, Check, Play, Pause, X, AlertCircle } from 'lucide-react';

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

  // Hazır müzik listesi - Gerçek müzik URL'leri ile güncelleyin
  const [hazirMuzikler] = useState([
    { 
      id: 1, 
      isim: 'Dandini Dandini Dastana', 
      type: 'youtube',
      youtubeId: '_zsQXwIOILo'
    },
    { 
      id: 2, 
      isim: 'Twinkle Twinkle Little Star', 
      type: 'file',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' 
    },
    { 
      id: 3, 
      isim: 'Uyu Yavrum Uyu', 
      type: 'file',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' 
    }
  ]);

  const [playingMuzik, setPlayingMuzik] = useState(null);
  const audioRef = useRef(null);

  const playMuzik = (muzik) => {
    if (muzik.type === 'file') {
      if (playingMuzik === muzik.id) {
        audioRef.current?.pause();
        setPlayingMuzik(null);
      } else {
        if (audioRef.current) {
          audioRef.current.src = muzik.url;
          audioRef.current.play();
        }
        setPlayingMuzik(muzik.id);
      }
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => setPlayingMuzik(null);
    }
  }, []);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      file: file,
      url: URL.createObjectURL(file),
      name: file.name,
      duration: 0,
      trimStart: 0,
      trimEnd: 310,
      isReady: false
    }));
    
    setFormData({ 
      ...formData, 
      yukluDosyalar: [...formData.yukluDosyalar, ...newFiles],
      muzikSecimi: 'yukle'
    });
  };

  const removeDosya = (id) => {
    setFormData({
      ...formData,
      yukluDosyalar: formData.yukluDosyalar.filter(f => f.id !== id)
    });
  };

  const updateDosya = (id, updates) => {
    setFormData({
      ...formData,
      yukluDosyalar: formData.yukluDosyalar.map(f => 
        f.id === id ? { ...f, ...updates } : f
      )
    });
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
        
        <audio ref={audioRef} />

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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ad Soyad *
                </label>
                <input
                  type="text"
                  value={formData.musteriAdi}
                  onChange={(e) => setFormData({ ...formData, musteriAdi: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition"
                  placeholder="Adınızı girin"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon *
                </label>
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
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Music className="w-5 h-5 mr-2 text-purple-500" />
                Müzik Seçimi *
              </h2>
            </div>

            {/* Uyarı Mesajı */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <strong>Önemli:</strong> Müzik süresi maksimum 310 saniye (5 dakika 10 saniye) olmalıdır. Daha uzun müzikler için istediğiniz 310 saniyelik bölümü seçebilirsiniz.
              </div>
            </div>

            {/* Tab Buttons */}
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

            {/* Tab Content */}
            <div className="bg-gray-50 rounded-xl p-6">
              
              {/* Hazır Müzik */}
              {activeTab === 'hazir' && (
                <div>
                  <p className="text-sm text-gray-600 mb-4">Aşağıdaki listeden bir müzik seçin ve dinleyin:</p>
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
                            onChange={(e) => {
                              setFormData({ ...formData, hazirMuzik: e.target.value, muzikSecimi: 'hazir' });
                            }}
                            className="w-4 h-4 text-purple-500"
                          />
                          <span className="ml-3 text-gray-700 flex-1">{muzik.isim}</span>
                          
                          {muzik.type === 'file' && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                playMuzik(muzik);
                              }}
                              className="ml-2 p-2 rounded-full bg-purple-100 hover:bg-purple-200 transition"
                            >
                              {playingMuzik === muzik.id ? (
                                <Pause className="w-4 h-4 text-purple-600" />
                              ) : (
                                <Play className="w-4 h-4 text-purple-600" />
                              )}
                            </button>
                          )}
                          
                          {formData.hazirMuzik === muzik.isim && (
                            <Check className="w-5 h-5 ml-2 text-purple-500" />
                          )}
                        </label>
                        
                        {/* YouTube Preview */}
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

              {/* Dosya Yükleme */}
              {activeTab === 'yukle' && (
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    Müzik dosyalarınızı yükleyin (MP3, WAV formatları)
                  </p>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition mb-4">
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <label className="cursor-pointer">
                      <span className="text-purple-600 font-medium hover:text-purple-700">
                        Dosya Seç (Birden fazla seçilebilir)
                      </span>
                      <input
                        type="file"
                        accept="audio/*"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Yüklenen Dosyalar */}
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
                  <p className="text-sm text-gray-600 mb-4">
                    YouTube'dan bir müzik linki paylaşın:
                  </p>
                  <input
                    type="url"
                    value={formData.youtubeLink}
                    onChange={(e) => {
                      setFormData({ ...formData, youtubeLink: e.target.value, muzikSecimi: 'internet' });
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Örnek: https://youtube.com/watch?v=dQw4w9WgXcQ
                  </p>
                  <p className="text-xs text-amber-600 mt-2">
                    Not: Müziğin 310 saniyelik bölümünü tarafımızdan seçeceğiz.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
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

// Dosya Trimmer Component
function DosyaTrimmer({ dosya, onRemove, onUpdate }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      const dur = audio.duration;
      if (dur && !isNaN(dur) && dur > 0) {
        onUpdate(dosya.id, { 
          duration: dur, 
          trimEnd: Math.min(310, dur),
          isReady: true 
        });
      }
    };

    const handleCanPlay = () => {
      if (!dosya.isReady && audio.duration) {
        handleLoadedMetadata();
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadeddata', handleLoadedMetadata);
    
    // Force load
    audio.load();
    
    // Fallback timeout
    const timeout = setTimeout(() => {
      if (!dosya.isReady && audio.duration) {
        handleLoadedMetadata();
      }
    }, 1000);
    
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadeddata', handleLoadedMetadata);
      clearTimeout(timeout);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dosya.id, dosya.isReady, onUpdate]);

  useEffect(() => {
    const updateTime = () => {
      if (audioRef.current && isPlaying) {
        const time = audioRef.current.currentTime;
        setCurrentTime(time);
        
        if (time >= dosya.trimEnd) {
          audioRef.current.pause();
          audioRef.current.currentTime = dosya.trimStart;
          setIsPlaying(false);
        } else {
          animationRef.current = requestAnimationFrame(updateTime);
        }
      }
    };

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(updateTime);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, dosya.trimEnd, dosya.trimStart]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) {
      console.error('Audio element bulunamadı');
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.currentTime = dosya.trimStart;
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Oynatma başladı');
            setIsPlaying(true);
          })
          .catch(err => {
            console.error('Oynatma hatası:', err.name, err.message);
            alert('Ses çalınamadı. Lütfen tarayıcınızın ses iznini kontrol edin veya sayfayı yenileyin.');
            setIsPlaying(false);
          });
      }
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartChange = (e) => {
    const newStart = parseFloat(e.target.value);
    const maxEnd = Math.min(newStart + 310, dosya.duration);
    onUpdate(dosya.id, { 
      trimStart: newStart,
      trimEnd: maxEnd
    });
  };

  const handleEndChange = (e) => {
    const newEnd = parseFloat(e.target.value);
    onUpdate(dosya.id, { trimEnd: newEnd });
  };

  const selectedDuration = dosya.trimEnd - dosya.trimStart;

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
      <audio 
        ref={audioRef} 
        src={dosya.url} 
        preload="metadata"
        onError={(e) => console.error('Audio yükleme hatası:', e)}
      />
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button
            type="button"
            onClick={togglePlay}
            disabled={!dosya.isReady}
            className={`p-2 rounded-full transition flex-shrink-0 ${
              dosya.isReady 
                ? 'bg-purple-100 hover:bg-purple-200' 
                : 'bg-gray-100 cursor-not-allowed'
            }`}
            title={!dosya.isReady ? 'Dosya hazırlanıyor...' : isPlaying ? 'Durdur' : 'Oynat'}
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
              <span className="text-xs text-amber-600 animate-pulse">Dosya hazırlanıyor...</span>
            ) : (
              <span className="text-xs text-green-600">✓ Hazır - Toplam: {formatTime(dosya.duration)}</span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onRemove(dosya.id)}
          className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition flex-shrink-0"
          title="Dosyayı Kaldır"
        >
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

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-gray-600">Başlangıç Noktası</label>
              <span className="text-xs text-purple-600 font-medium">{formatTime(dosya.trimStart)}</span>
            </div>
            <input
              type="range"
              min="0"
              max={Math.max(0, dosya.duration - 0.1)}
              step="0.1"
              value={dosya.trimStart}
              onChange={handleStartChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-gray-600">Bitiş Noktası</label>
              <span className="text-xs text-purple-600 font-medium">{formatTime(dosya.trimEnd)}</span>
            </div>
            <input
              type="range"
              min={dosya.trimStart}
              max={Math.min(dosya.trimStart + 310, dosya.duration)}
              step="0.1"
              value={dosya.trimEnd}
              onChange={handleEndChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          {/* Progress Bar */}
          {isPlaying && (
            <div className="relative h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="absolute h-full bg-purple-500 transition-all duration-100"
                style={{ 
                  width: `${((currentTime - dosya.trimStart) / (dosya.trimEnd - dosya.trimStart)) * 100}%` 
                }}
              />
            </div>
          )}

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
