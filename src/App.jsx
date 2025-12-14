import React, { useState, useRef, useEffect } from 'react';
import { Music, Upload, Globe, User, Phone, Check, Play, Pause, X, AlertCircle } from 'lucide-react';

// Favicon ekle
if (typeof document !== 'undefined') {
  const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/svg+xml';
  link.rel = 'icon';
  link.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">🎵</text></svg>';
  document.getElementsByTagName('head')[0].appendChild(link);
}

// Dosya Trimmer Component - HATA AYIKLAMA İÇİN GÜNCELLENDİ
function DosyaTrimmer({ dosya, onRemove, onUpdate }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const animationRef = useRef(null);

  // Ses dosyasının meta verilerini yükleme ve trim ayarlarını yapma
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      const dur = audio.duration;
      if (dur && !isNaN(dur) && dur > 0 && !dosya.isReady) {
        console.log(`[Dosya Yüklendi] ${dosya.name}: Toplam Süre: ${dur}s`);
        // trimEnd'i max 310 saniye veya toplam süreye ayarla
        onUpdate(dosya.id, {
           duration: dur,
           trimEnd: Math.min(310, dur),
           isReady: true
        });
      }
    };

    const handleCanPlayThrough = () => {
      if (audio.duration && !dosya.isReady) {
        handleLoadedMetadata();
      }
    };

    const handleError = (e) => {
      console.error(`Dosya yükleme hatası (${dosya.name}):`, e);
      // Hata durumunda da isReady'yi true yapabiliriz, kullanıcının denemesine izin vermek için
      if (!dosya.isReady) {
         onUpdate(dosya.id, { isReady: true });
      }
    };

    // Event listener'ları ekle
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('error', handleError);

    // Hemen yüklemeye çalış
    if (audio.readyState >= 2 && audio.duration) { // HAVE_CURRENT_DATA veya üstü
      handleLoadedMetadata();
    } else {
      audio.load();
    }

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('error', handleError);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dosya.id, dosya.isReady, dosya.name, onUpdate]);

  // Çalma ve trim kontrolü döngüsü
  useEffect(() => {
    const updateTime = () => {
      const audio = audioRef.current;
      if (audio && isPlaying) {
        const time = audio.currentTime;
        setCurrentTime(time);

        // Bitiş noktasına ulaşıldıysa durdur
        if (time >= dosya.trimEnd) {
          audio.pause();
          audio.currentTime = dosya.trimStart; // Başa dön
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

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || !dosya.isReady) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        audio.volume = 0.5;
        // Çalmaya başlamadan önce başlangıç noktasına ayarla
        audio.currentTime = dosya.trimStart;

        const playPromise = audio.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(err => {
              console.error('Oynatma hatası:', err.name, err.message);
              setIsPlaying(false);
              alert('🔊 Ses çalınamadı. Tarayıcı Otomatik Oynatmayı engellemiş olabilir.');
            });
        }
      } catch (err) {
        console.error('Beklenmeyen oynatma hatası:', err);
        setIsPlaying(false);
      }
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds) || seconds < 0) return '0:00';
    const totalSeconds = Math.floor(seconds);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Başlangıç kaydırıcısı
  const handleStartChange = (e) => {
    const newStart = parseFloat(e.target.value);
    // HATA AYIKLAMA: Başlangıç değişikliğini konsola yazdır
    console.log(`[Start Change] ID: ${dosya.id}, Yeni Başlangıç: ${newStart}`);
    
    // Başlangıç, bitişten 0.5 saniye küçük olmalı
    const safeStart = Math.min(newStart, dosya.trimEnd - 0.5); 
    
    onUpdate(dosya.id, { trimStart: safeStart });
  };

  // Bitiş kaydırıcısı
  const handleEndChange = (e) => {
    const newEnd = parseFloat(e.target.value);
    // HATA AYIKLAMA: Bitiş değişikliğini konsola yazdır
    console.log(`[End Change] ID: ${dosya.id}, Yeni Bitiş: ${newEnd}`);
    
    // Bitiş, başlangıçtan 0.5 saniye büyük olmalı
    const safeEnd = Math.max(newEnd, dosya.trimStart + 0.5);

    onUpdate(dosya.id, { trimEnd: safeEnd });
  };

  const selectedDuration = Math.max(0, dosya.trimEnd - dosya.trimStart);

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
      {/* src olarak dosya.url kullanılır, preload ile hızlı yüklenir */}
      <audio ref={audioRef} src={dosya.url} preload="auto" />

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
            title={dosya.isReady ? (isPlaying ? 'Durdur' : 'Oynat') : 'Dosya yükleniyor...'}
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
              <span className="text-xs text-amber-600 animate-pulse">⏳ Dosya hazırlanıyor... (Lütfen bekleyin)</span>
            ) : (
              <span className="text-xs text-green-600">
                ✓ Hazır - Toplam: {formatTime(dosya.duration)} - Şu an: {formatTime(currentTime)}
              </span>
            )}
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
        <div className="space-y-4 mt-4">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Başlangıç: <strong>{formatTime(dosya.trimStart)}</strong></span>
            <span>Bitiş: <strong>{formatTime(dosya.trimEnd)}</strong></span>
            <span className={selectedDuration > 310 ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>
              Seçili Süre: {formatTime(selectedDuration)}
            </span>
          </div>

          {/* Başlangıç Noktası Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-gray-700">Başlangıç Noktası</label>
              <span className="text-xs text-purple-600 font-bold bg-purple-50 px-2 py-1 rounded">{formatTime(dosya.trimStart)}</span>
            </div>
            <input
              type="range"
              min="0"
              // Başlangıç, bitişten 0.5 saniye küçük olabilir (çakışmayı önlemek için)
              max={Math.max(0, dosya.trimEnd - 0.5)} 
              step="0.1"
              value={dosya.trimStart}
              onChange={handleStartChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
              style={{
                background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${
                    (dosya.trimStart / dosya.duration) * 100
                }%, #e5e7eb ${
                    (dosya.trimStart / dosya.duration) * 100
                }%, #e5e7eb 100%)`
              }}
            />
          </div>

          {/* Bitiş Noktası Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-gray-700">Bitiş Noktası</label>
              <span className="text-xs text-pink-600 font-bold bg-pink-50 px-2 py-1 rounded">{formatTime(dosya.trimEnd)}</span>
            </div>
            <input
              type="range"
              // Bitiş, başlangıçtan 0.5 saniye büyük olabilir (çakışmayı önlemek için)
              min={Math.min(dosya.duration, dosya.trimStart + 0.5)} 
              max={dosya.duration}
              step="0.1"
              value={dosya.trimEnd}
              onChange={handleEndChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
              style={{
                background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${
                    (dosya.trimEnd / dosya.duration) * 100
                }%, #e5e7eb ${
                    (dosya.trimEnd / dosya.duration) * 100
                }%, #e5e7eb 100%)`
              }}
            />
            <p className="text-xs text-gray-500 mt-1 italic">
              ℹ️ İstediğiniz bitiş noktasını seçin (Max: {formatTime(dosya.duration)})
            </p>
          </div>

          {/* Hata Mesajı */}
          {selectedDuration > 310 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <p className="text-xs text-red-600">Seçili süre 310 saniyeden fazla ({formatTime(selectedDuration)})! Lütfen kısaltın.</p>
            </div>
          )}
          
           {/* Progress Bar (Oynatılırken) */}
          {isPlaying && (
            <div className="relative h-1 bg-gray-200 rounded-full overflow-hidden">
              {/* Oynatma çubuğunun genişliğini, seçilen aralıkta nerede olduğuna göre hesapla */}
              <div 
                className="absolute h-full bg-purple-500 transition-all duration-100"
                style={{ 
                  width: `${((currentTime - dosya.trimStart) / selectedDuration) * 100}%`,
                  left: `${(dosya.trimStart / dosya.duration) * 100}%`, // Başlangıç pozisyonunu ayarla
                  // Eğer current time trimEnd'den büyükse, genişliği %100'e sabitle
                  // Veya sadece normal hesaplama yap
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
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

  // Hazır müzik listesi - YOUTUBE'A ÇEVRİLDİ
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
       type: 'youtube',
       youtubeId: 'yCjJyiqpAuU'
    },
    {
       id: 3,
       isim: 'Uyu Yavrum Uyu',
       type: 'youtube',
       youtubeId: 'kVFjaOyAK-s'
    }
  ]);
  
  // AudioRef ve PlayingMuzik state'leri, sadece hazır dosya oynatmak için kullanılıyordu.
  // Yüklü dosyalar için artık DosyaTrimmer içinde yönetiliyor.
  const audioRef = useRef(null); 
  const [playingMuzik, setPlayingMuzik] = useState(null); // Hazır müzikler için tutulabilir, ancak şu an hepsi YouTube olduğu için kullanılmıyor.

  // Hazır müziklerin hepsi YouTube olduğu için bu fonksiyon şu an kullanılmıyor.
  // useEffect(() => {
  //   if (audioRef.current) {
  //     audioRef.current.onended = () => setPlayingMuzik(null);
  //   }
  // }, []);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      file: file,
      url: URL.createObjectURL(file),
      name: file.name,
      duration: 0,
      trimStart: 0,
      // Başlangıçta 310 saniye veya 5 dakikanın sonu olarak ayarla. 
      // Gerçek duration DosyaTrimmer'da yüklendikten sonra güncellenecek.
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
    setFormData(prevData => ({
      ...prevData,
      yukluDosyalar: prevData.yukluDosyalar.map(f => 
         f.id === id ? { ...f, ...updates } : f
      )
    }));
  };

  const handleSubmit = () => {
    if (!formData.musteriAdi || !formData.telefon) {
      alert('Lütfen ad ve telefon bilgilerini doldurun!');
      return;
    }
    
    let isMuzikSecili = false;
    let muzikDetay;
    
    switch(activeTab) {
        case 'hazir':
            if (formData.hazirMuzik) {
                isMuzikSecili = true;
                muzikDetay = { type: 'Hazır Müzik', isim: formData.hazirMuzik };
            }
            break;
        case 'yukle':
            if (formData.yukluDosyalar.length > 0) {
                // Seçili dosyalardan süresi 310 saniyeyi geçen var mı kontrol et
                const hasLongFile = formData.yukluDosyalar.some(f => (f.trimEnd - f.trimStart) > 310);
                if (hasLongFile) {
                     alert('Lütfen yüklediğiniz dosyalardan birinin süresini 310 saniye veya altına kısaltın!');
                     return;
                }
                isMuzikSecili = true;
                muzikDetay = { 
                    type: 'Yüklenen Dosyalar', 
                    dosyalar: formData.yukluDosyalar.map(f => ({
                        isim: f.name,
                        trimStart: f.trimStart,
                        trimEnd: f.trimEnd
                    }))
                };
            }
            break;
        case 'internet':
            if (formData.youtubeLink) {
                isMuzikSecili = true;
                muzikDetay = { type: 'YouTube Link', link: formData.youtubeLink };
            }
            break;
        default:
            break;
    }
    
    if (!isMuzikSecili) {
        alert('Lütfen bir müzik seçimi yapın!');
        return;
    }

    alert('Siparişiniz alındı! En kısa sürede sizinle iletişime geçeceğiz.');
    console.log('--- Sipariş Özeti ---');
    console.log('Müşteri:', formData.musteriAdi);
    console.log('Telefon:', formData.telefon);
    console.log('Müzik Seçim Türü:', activeTab);
    console.log('Müzik Detayları:', muzikDetay);
    console.log('---------------------');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 font-sans antialiased">
      <div className="max-w-2xl mx-auto">
        
        {/* Tailwind'i etkinleştirmek için bir betik etiketi gerekmez, ancak React ortamında varsayılır. */}
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 text-center border-t-4 border-purple-500">
          <div className="w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Music className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Sesli Oyuncak Siparişi</h1>
          <p className="text-gray-600">Sevdikleriniz için özel, sesli bir oyuncak oluşturun</p>
        </div>
        
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          
          {/* Müşteri Bilgileri */}
          <div className="mb-8 border-b pb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-purple-500" />
              1. İletişim Bilgileri
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition"
                  placeholder="Adınızı ve soyadınızı girin"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition"
                  placeholder="05XX XXX XX XX"
                />
              </div>
            </div>
          </div>
          
          {/* Müzik Seçimi */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Music className="w-5 h-5 mr-2 text-purple-500" />
              2. Müzik Seçimi
            </h2>
            
            {/* Uyarı Mesajı */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <strong>Önemli:</strong> Müzik süresi maksimum 310 saniye (5 dakika 10 saniye) olmalıdır. Yüklediğiniz dosyalarda, süreyi aşağıdaki kaydırıcılarla ayarlayabilirsiniz.
              </div>
            </div>
            
            {/* Tab Buttons */}
            <div className="flex gap-2 mb-6 flex-wrap bg-gray-100 p-2 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('hazir')}
                className={`flex-1 min-w-[140px] py-3 px-4 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                  activeTab === 'hazir'
                    ? 'bg-white text-purple-600 shadow-md'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Music className="w-4 h-4" />
                Hazır Müzik
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('yukle')}
                className={`flex-1 min-w-[140px] py-3 px-4 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                  activeTab === 'yukle'
                    ? 'bg-white text-purple-600 shadow-md'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Upload className="w-4 h-4" />
                Dosya Yükle
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('internet')}
                className={`flex-1 min-w-[140px] py-3 px-4 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                  activeTab === 'internet'
                    ? 'bg-white text-purple-600 shadow-md'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Globe className="w-4 h-4" />
                İnternetten
              </button>
            </div>
            
            {/* Tab Content */}
            <div className="rounded-xl p-4 border border-gray-200">
              
              {/* Hazır Müzik (YouTube Embed) */}
              {activeTab === 'hazir' && (
                <div>
                  <p className="text-sm text-gray-600 mb-4">Aşağıdaki listeden bir müzik seçin ve önizlemesini izleyin:</p>
                  <div className="space-y-3">
                    {hazirMuzikler.map((muzik) => (
                      <div key={muzik.id} className="border-b border-gray-100 last:border-b-0 pb-3">
                        <label
                          className={`flex items-center p-3 border-2 rounded-xl cursor-pointer transition ${
                            formData.hazirMuzik === muzik.isim
                              ? 'border-purple-500 bg-purple-50 shadow-sm'
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
                            className="w-4 h-4 text-purple-500 focus:ring-purple-500"
                          />
                          <span className="ml-3 text-gray-700 flex-1 font-medium">{muzik.isim}</span>
                          
                          {formData.hazirMuzik === muzik.isim && (
                            <Check className="w-5 h-5 ml-2 text-purple-500" />
                          )}
                        </label>
                        
                        {/* YouTube Preview */}
                        {muzik.type === 'youtube' && formData.hazirMuzik === muzik.isim && (
                          <div className="mt-3 rounded-lg overflow-hidden border border-gray-300">
                            <iframe
                              width="100%"
                              height="200"
                              src={`https://www.youtube.com/embed/${muzik.youtubeId}`}
                              title={muzik.isim}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dosya Yükleme (Trimmer dahil) */}
              {activeTab === 'yukle' && (
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    Müzik dosyalarınızı yükleyin (MP3, WAV formatları). Ses uzunluğunu aşağıdan ayarlayabilirsiniz.
                  </p>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition mb-4 bg-gray-50">
                    <Upload className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                    <label className="cursor-pointer">
                      <span className="text-purple-600 font-bold hover:text-purple-700 underline underline-offset-2">
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
                  
                  {/* Yüklenen Dosyalar Listesi */}
                  {formData.yukluDosyalar.length > 0 && (
                    <div className="space-y-4 pt-4">
                      <p className="text-sm font-medium text-gray-700">Yüklenen Dosyalar ve Kırpma Ayarları:</p>
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
              
              {/* İnternetten Müzik */}
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Örnek: https://youtube.com/watch?v=dQw4w9WgXcQ
                  </p>
                  <p className="text-xs text-amber-700 mt-2 p-2 bg-amber-100 rounded">
                    ⚠️  Linkteki müziğin 310 saniyelik en uygun bölümü tarafımızdan seçilecektir.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-pink-600 hover:to-purple-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Siparişi Tamamla
          </button>
          <p className="text-xs text-gray-500 text-center mt-4">
            Siparişiniz alındıktan sonra belirtilen telefon numarasından sizinle iletişime geçeceğiz.
          </p>
        </div>
      </div>
    </div>
  );
}
