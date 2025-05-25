// src/components/Hero.jsx
// Impor yang tidak perlu bisa dihapus jika hanya mengandalkan props untuk ikon
// import DefaultGenreIcon from '../assets/icons/default_genre_icon.svg'; // Tidak perlu impor ikon di sini lagi

import BgImage from '../assets/concert-bg.jpg';
import LocationIcon from '../assets/calendar.svg';
import CalendarIcon from '../assets/location.svg';
import genreLogo from '../assets/genre.svg'

// Terima props dari HomePage
const Hero = ({ bannerConcert, genreFilters, onGenreFilterChange, currentSelectedGenreIds }) => {

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

  return (
    <div>
      {/* Banner Hero */}
      <section
        className="relative h-[400px] md:h-[500px] w-full bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(${BgImage})` }}
      >
        <div className="absolute inset-0 bg-purple-800 bg-opacity-60"></div>
        <div className="relative z-10 max-w-4xl px-6 md:px-12 text-white">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">{bannerConcert.name || 'Nama Konser'}</h1>
          <p className="mb-6 text-sm md:text-base line-clamp-3">{bannerConcert.description || 'Deskripsi konser tidak tersedia.'}</p>
          <div className="flex flex-col md:flex-row md:items-center gap-2 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <img src={CalendarIcon} alt="Calendar" className="w-5 h-5" />
              <span>{formatHeroDate(bannerConcert.concert_start)}</span>
            </div>
            <div className="flex items-center gap-2 md:ml-6">
              <img src={LocationIcon} alt="Location" className="w-5 h-5" />
              <span>{bannerConcert.venue?.name || 'Lokasi tidak diketahui'}</span>
            </div>
          </div>
          <button className="mt-6 px-6 py-2 bg-white text-purple-800 font-semibold rounded-full hover:bg-gray-200 transition">
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
              {/* 'genre.icon' sekarang akan selalu berisi path ke CommonGenreIcon */}
              <img src={genreLogo} alt="" className="w-4 h-4" /> {/* Teks alt bisa dikosongkan atau diisi teks generik */}
              <span>{genre.name}</span>
            </button>
          )) : <p className="text-sm text-gray-500">Memuat genre...</p>}
        </div>
      </div>
    </div>
  );
};

export default Hero;