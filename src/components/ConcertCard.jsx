// src/components/ConcertCard.jsx
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import date_logo from '../assets/calender_black.svg'; // Pastikan path asset benar
import location_logo from '../assets/location_black.svg'; // Pastikan path asset benar
import AuthModal from './AuthModal/AuthModal'; // Pastikan path komponen AuthModal benar
import { useNavigate } from 'react-router-dom';

const ConcertCard = ({ id, name, concert_start, venue, link_poster, price }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  // const [userData, setUserData] = useState(null); // setUserData tidak dipanggil, bisa dihapus jika tidak digunakan
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    // const storedUserData = localStorage.getItem('userData'); // Jika Anda menyimpan user data
    if (token) {
      setIsUserLoggedIn(true);
      // if (storedUserData) setUserData(JSON.parse(storedUserData));
    } else {
      setIsUserLoggedIn(false);
    }
  }, []);

  const parsePrice = (priceValue) => {
    if (typeof priceValue === 'number') {
      return priceValue;
    }
    if (typeof priceValue === 'string') {
      const numericString = priceValue.replace(/[^0-9]/g, ''); // Hanya angka
      return parseInt(numericString, 10) || 0; // Default ke 0 jika NaN
    }
    return 0; // Default untuk tipe lain atau undefined/null
  };

  const numericPrice = parsePrice(price);

  const formatConcertDate = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    try {
      // Menggunakan 'id-ID' untuk format Indonesia jika diinginkan, atau 'en-US'
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
      return new Date(dateTimeString).toLocaleDateString('id-ID', options).replace(/\./g, ':'); // Ganti titik dengan : untuk waktu
    } catch (e) {
      console.error("Invalid date format:", dateTimeString, e);
      return "Invalid Date";
    }
  };

  const handleBookNowClick = () => {
    if (!isUserLoggedIn) {
      setIsAuthModalOpen(true);
    } else {
      // Navigasi ke halaman booking dengan ID konser jika diperlukan
      navigate(`/booking/${id}`); // Contoh: navigasi ke halaman booking
      // navigate('/testing'); // Sesuai kode Anda sebelumnya
    }
  };

  const handleAuthSuccess = (authDataResponse, authType) => { // Ganti nama parameter agar tidak bentrok
    console.log(`${authType} berhasil:`, authDataResponse);
    if (authDataResponse.token) {
      localStorage.setItem('token', authDataResponse.token);
    }
    // if (authDataResponse.user) { // Jika API mengembalikan objek user
    //   localStorage.setItem('userData', JSON.stringify(authDataResponse.user));
    //   setUserData(authDataResponse.user);
    // }
    setIsUserLoggedIn(true);
    setIsAuthModalOpen(false);
    // Ganti alert dengan notifikasi yang lebih baik jika memungkinkan
    alert(`${authType === 'login' ? 'Login' : 'Registrasi'} berhasil! Anda sekarang dapat melakukan booking.`);

    // Langsung navigasi ke halaman booking setelah login/register berhasil
    navigate(`/booking/${id}`); // Contoh
    // navigate('/testing');
  };

  const handleCloseModal = () => {
    setIsAuthModalOpen(false);
  };

  const venueName = venue && venue.name ? venue.name : 'Unknown Venue';
  const posterUrl = link_poster && (link_poster.startsWith('http://') || link_poster.startsWith('https://'))
  ? link_poster
  : '/default-placeholder.jpg'; // Ganti dengan asset lokal yang kamu miliki

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

          <div className="flex-grow"></div> {/* Spacer */}

          <div className="pt-2 sm:pt-3 space-y-1">
            <div className="text-xs text-gray-500">Mulai dari</div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
              <p className="text-lg sm:text-xl font-bold text-purple-700">
                IDR {numericPrice.toLocaleString('id-ID')}
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
          onAuthSuccess={handleAuthSuccess} // Pastikan nama prop sesuai dengan yang diharapkan AuthModal
        />
      )}
    </>
  );
};

ConcertCard.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  concert_start: PropTypes.string, // Bisa jadi null/undefined jika API tidak selalu mengirimkannya
  venue: PropTypes.shape({
    name: PropTypes.string, // Bisa jadi null/undefined
  }),
  link_poster: PropTypes.string,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Bisa jadi null/undefined
};

// Default props untuk menghindari error jika ada prop yang tidak terdefinisi
ConcertCard.defaultProps = {
  concert_start: 'N/A',
  venue: { name: 'Unknown Venue' },
  link_poster: '/default-placeholder.jpg',
  price: 0,
};

export default ConcertCard;