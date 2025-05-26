// File: src/components/ConcertCard.jsx
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import date_logo from '../assets/calender_black.svg';
import location_logo from '../assets/location_black.svg';
// Jika Anda memiliki ikon khusus untuk genre, Anda bisa mengimpornya di sini:
// import genre_icon from '../assets/genre_icon.svg';
import AuthModal from './AuthModal/AuthModal';

// Tambahkan 'genres' ke daftar props yang di-destructure
const ConcertCard = ({ id, name, concert_start, venue, link_poster, price, max_price, description, link_venue, genres }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsUserLoggedIn(true);
    } else {
      setIsUserLoggedIn(false);
    }
  }, []);

  const parsePrice = (priceValue) => {
    if (typeof priceValue === 'number') {
      return priceValue;
    }
    if (typeof priceValue === 'string') {
      const numericString = priceValue.replace(/[^0-9]/g, '');
      return parseInt(numericString, 10) || 0;
    }
    return 0;
  };

  const numericMinPrice = parsePrice(price);
  const numericMaxPrice = parsePrice(max_price);

  const formatConcertDate = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
      return new Date(dateTimeString).toLocaleDateString('id-ID', options).replace(/\./g, ':');
    } catch (e) {
      console.error("Invalid date format:", dateTimeString, e);
      return "Invalid Date";
    }
  };

  const handleBookNowClick = () => {
    if (!isUserLoggedIn) {
      setIsAuthModalOpen(true);
    } else {
      navigate(`/booking/${id}`, {
        state: {
          concertName: name,
          concertDescription: description,
          venueMapImageUrl: link_venue,
        }
      });
    }
  };

  const handleAuthSuccess = (authDataResponse, authType) => {
    console.log(`${authType} berhasil:`, authDataResponse);
    if (authDataResponse.token) {
      localStorage.setItem('token', authDataResponse.token);
    }
    setIsUserLoggedIn(true);
    setIsAuthModalOpen(false);
    alert(`${authType === 'login' ? 'Login' : 'Registrasi'} berhasil! Anda sekarang dapat melakukan booking.`);
    navigate(`/booking/${id}`, {
        state: {
          concertName: name,
          concertDescription: description,
          venueMapImageUrl: link_venue,
        }
      });
  };

  const handleCloseModal = () => {
    setIsAuthModalOpen(false);
  };

  const venueName = venue && venue.name ? venue.name : 'Unknown Venue';
  const posterUrl = link_poster && (link_poster.startsWith('http://') || link_poster.startsWith('https://'))
  ? link_poster
  : '/default-placeholder.jpg'; // Pastikan ada gambar placeholder ini di folder public Anda

  const displayPrice = () => {
    const formattedMinPrice = numericMinPrice.toLocaleString('id-ID');
    if (numericMaxPrice > 0 && numericMaxPrice > numericMinPrice) {
      const formattedMaxPrice = numericMaxPrice.toLocaleString('id-ID');
      return `IDR ${formattedMinPrice} - ${formattedMaxPrice}`;
    }
    return `IDR ${formattedMinPrice}`;
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-xs sm:max-w-sm flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="w-full h-52 sm:h-60 relative">
          <img
            src={posterUrl}
            alt={name || 'Concert Poster'}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>

        <div className="p-4 sm:p-5 flex flex-col flex-grow space-y-2 sm:space-y-3">
          <h3 className="font-semibold text-lg sm:text-xl text-gray-800 truncate" title={name}>
            {name || 'Untitled Concert'}
          </h3>

          <div className="flex items-center text-xs sm:text-sm text-gray-600">
            <img src={date_logo} alt="Tanggal" className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{formatConcertDate(concert_start)}</span>
          </div>

          <div className="flex items-center text-xs sm:text-sm text-gray-600">
            <img src={location_logo} alt="Lokasi" className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate" title={venueName}>{venueName}</span>
          </div>

          {/* Menampilkan Genre */}
          {/* Pastikan genres ada dan tidak kosong */}
          {genres && genres.length > 0 && (
            <div className="flex items-start text-xs sm:text-sm text-gray-500 mt-1">
              {/* Opsional: Tambahkan ikon untuk genre di sini jika ada */}
              {/* <img src={genre_icon} alt="Genre" className="w-4 h-4 mr-2 flex-shrink-0 mt-px" /> */}
              <span className="flex flex-wrap gap-x-2 gap-y-1"> {/* Menggunakan flex-wrap jika genre terlalu banyak dan memberi jarak antar genre */}
                {genres.map((genre, index) => (
                  <span key={genre.id || index} className="font-medium text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded-md"> {/* Styling untuk setiap genre tag */}
                    {genre.name}
                  </span>
                ))}
              </span>
            </div>
          )}

          <div className="flex-grow"></div> {/* Spacer */}

          <div className="pt-2 sm:pt-3 space-y-1">
            <div className="text-xs text-gray-500">Mulai dari</div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
              <p className="text-sm sm:text-base font-bold text-purple-700 whitespace-nowrap mr-2">
                {displayPrice()}
              </p>
              <button
                onClick={handleBookNowClick}
                className="w-full sm:w-auto bg-purple-600 text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={handleCloseModal}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
};

ConcertCard.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  concert_start: PropTypes.string,
  venue: PropTypes.shape({
    name: PropTypes.string,
  }),
  link_poster: PropTypes.string,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  description: PropTypes.string,
  link_venue: PropTypes.string,
  genres: PropTypes.arrayOf( // PropType untuk genres
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    })
  ),
};

ConcertCard.defaultProps = {
  concert_start: 'N/A',
  venue: { name: 'Unknown Venue' },
  link_poster: '/default-placeholder.jpg',
  price: 0,
  max_price: 0,
  description: 'Deskripsi konser tidak tersedia.',
  link_venue: '',
  genres: [], // Default props untuk genres adalah array kosong
};

export default ConcertCard;