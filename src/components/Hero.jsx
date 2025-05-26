// src/components/Hero.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Impor useNavigate

// Impor aset Anda
import BgImage from '../assets/concert-bg.jpg'; // Asumsi ini adalah gambar latar dinamis atau placeholder
import LocationIcon from '../assets/location.svg'; // Pastikan path ini benar (sebelumnya CalendarIcon untuk lokasi)
import CalendarIcon from '../assets/calendar.svg'; // Pastikan path ini benar (sebelumnya LocationIcon untuk kalender)
// Anda menukar CalendarIcon dan LocationIcon di kode asli Anda, saya akan ikuti penamaan variabel Anda.
// CalendarIcon untuk tanggal, LocationIcon untuk lokasi.
import genreLogo from '../assets/genre.svg';

const Hero = ({ bannerConcert, genreFilters, onGenreFilterChange, currentSelectedGenreIds }) => {
  const navigate = useNavigate(); // 2. Dapatkan fungsi navigate

  const formatHeroDate = (dateString) => {
    if (!dateString) return 'Tanggal tidak tersedia';
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString('id-ID', options).replace(/\./g, ':');
    } catch (e) {
      console.error("Invalid date format for Hero:", dateString, e);
      return "Format tanggal salah";
    }
  };

  // 3. Buat fungsi handleBookNowClick
  const handleBookNowClick = () => {
    if (bannerConcert && bannerConcert.id) {
      navigate(`/booking/${bannerConcert.id}`, {
        state: {
          concertName: bannerConcert.name,
          concertDescription: bannerConcert.description,
          // 'link_venue' dari bannerConcert akan digunakan sebagai 'venueMapImageUrl'
          // di TicketBookingPage
          venueMapImageUrl: bannerConcert.link_venue,
          // Anda juga bisa mengirim data lain jika diperlukan oleh TicketBookingPage,
          // misalnya tanggal atau nama venue jika sudah diformat.
          date: formatHeroDate(bannerConcert.concert_start),
          venueName: bannerConcert.venue?.name,
        }
      });
    } else {
      console.error("Tidak dapat melakukan booking: data bannerConcert tidak lengkap.");
      // Mungkin tampilkan pesan error ke pengguna atau jangan lakukan apa-apa
    }
  };

  if (!bannerConcert) {
    return (
      <div>
        <div className="relative h-[400px] md:h-[500px] w-full bg-gray-300 animate-pulse flex items-center justify-center">
          <p className="text-gray-500">Memuat banner...</p>
        </div>
        <div className="overflow-x-auto whitespace-nowrap px-4 py-3 bg-white shadow-sm border-b min-h-[58px]">
          {/* Placeholder untuk filter bar */}
        </div>
      </div>
    );
  }

  // Ambil gambar poster konser jika ada, jika tidak gunakan BgImage fallback
  const heroBackground = bannerConcert.link_poster || BgImage;

  return (
    <div>
      {/* Banner Hero */}
      <section
        className="relative h-[400px] md:h-[500px] w-full bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(${heroBackground})` }} // Menggunakan poster konser dinamis
      >
        <div className="absolute inset-0 bg-purple-800 bg-opacity-60"></div> {/* Overlay tetap ada */}
        <div className="relative z-10 max-w-4xl px-6 md:px-12 text-white">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">{bannerConcert.name || 'Nama Konser'}</h1>
          <p className="mb-6 text-sm md:text-base line-clamp-3">{bannerConcert.description || 'Deskripsi konser tidak tersedia.'}</p>
          <div className="flex flex-col md:flex-row md:items-center gap-2 text-sm md:text-base">
            <div className="flex items-center gap-2">
              {/* Menggunakan CalendarIcon untuk tanggal */}
              <img src={CalendarIcon} alt="Calendar" className="w-5 h-5" />
              <span>{formatHeroDate(bannerConcert.concert_start)}</span>
            </div>
            <div className="flex items-center gap-2 md:ml-6">
              {/* Menggunakan LocationIcon untuk lokasi */}
              <img src={LocationIcon} alt="Location" className="w-5 h-5" />
              <span>{bannerConcert.venue?.name || 'Lokasi tidak diketahui'}</span>
            </div>
          </div>
          {/* 4. Pasang onClick handler ke tombol Book Now */}
          <button
            onClick={handleBookNowClick}
            className="mt-6 px-6 py-2 bg-white text-purple-800 font-semibold rounded-full hover:bg-gray-200 transition"
          >
            Book Now
          </button>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="overflow-x-auto whitespace-nowrap px-4 py-3 bg-white shadow-sm border-b">
        <div className="inline-flex space-x-3">
          {(genreFilters && genreFilters.length > 0) ? genreFilters.map((genre) => (
            <button
              key={genre.id}
              onClick={() => onGenreFilterChange(genre.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                currentSelectedGenreIds && currentSelectedGenreIds.includes(genre.id)
                  ? 'bg-purple-600 text-white border-transparent'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              <img src={genreLogo} alt="" className="w-4 h-4" />
              <span>{genre.name}</span>
            </button>
          )) : <p className="text-sm text-gray-500">Memuat genre...</p>}
        </div>
      </div>
    </div>
  );
};

export default Hero;