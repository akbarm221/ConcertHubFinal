// ConcertCard.jsx (sudah dimodifikasi untuk menggunakan AuthModal)
import PropTypes from 'prop-types';
import { useState } from 'react';
import date_logo from '../assets/calender_black.svg'; // Pastikan path ini benar
import location_logo from '../assets/location_black.svg'; // Pastikan path ini benar
import AuthModal from './AuthModal/AuthModal'; // GANTI INI: Impor AuthModal yang benar

const ConcertCard = ({ title, date, location, image, price }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  // Status login pengguna, awalnya false (belum login)
  // Di aplikasi nyata, ini akan dikelola oleh context, Redux, atau state global lainnya
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null); // Untuk menyimpan data pengguna setelah login/register

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

  const numericPrice = parsePrice(price);

  const handleBookNowClick = () => {
    if (!isUserLoggedIn) {
      setIsAuthModalOpen(true); // Buka modal jika pengguna belum login
    } else {
      // Logika jika pengguna sudah login
      alert(`Hi ${userData?.email || 'User'}! Lanjutkan ke proses booking untuk ${title}.`);
      // Di sini Anda akan melanjutkan ke halaman booking atau logika lainnya
    }
  };

  // GANTI NAMA FUNGSI INI dan sesuaikan parameternya
  const handleAuthSuccess = (authData, authType) => {
    // authData akan berisi data dari form (misal: { email, id })
    // authType akan berisi 'login' atau 'register'
    console.log(`${authType} berhasil:`, authData);
    setIsUserLoggedIn(true); // Set status login menjadi true
    setUserData(authData); // Simpan data pengguna
    setIsAuthModalOpen(false); // Tutup modal
    alert(`${authType === 'login' ? 'Login' : 'Registrasi'} berhasil! Selamat datang, ${authData.email}. Anda sekarang dapat melakukan booking.`);
    // Anda bisa langsung memanggil logika booking di sini jika diinginkan
    // atau biarkan pengguna mengklik "Book Now" lagi.
    // Contoh:
    // if (authType === 'login' || authType === 'register') {
    //   // Langsung proses booking setelah login/register berhasil
    //   console.log(`Memproses booking untuk ${title} untuk pengguna ${authData.email}`);
    //   alert(`Booking untuk ${title} sedang diproses!`);
    // }
  };

  const handleCloseModal = () => {
    setIsAuthModalOpen(false); // Tutup modal
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-xs sm:max-w-sm flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {/* Bagian gambar tetap sama */}
        <div className="w-full h-52 sm:h-60 relative">
          <img
            src={image || 'https://via.placeholder.com/400x240?text=Concert+Image'} // Fallback image
            alt={title}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>

        {/* Bagian detail konten tetap sama, mungkin ada sedikit penyesuaian kelas Tailwind untuk konsistensi */}
        <div className="p-4 sm:p-5 flex flex-col flex-grow space-y-2 sm:space-y-3">
          <h3 className="font-semibold text-lg sm:text-xl text-gray-800 truncate" title={title}>
            {title}
          </h3>

          <div className="flex items-center text-xs sm:text-sm text-gray-600">
            <img src={date_logo} alt="Ikon Tanggal" className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{date}</span>
          </div>

          <div className="flex items-center text-xs sm:text-sm text-gray-600">
            <img src={location_logo} alt="Ikon Lokasi" className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate" title={location}>{location}</span>
          </div>

          <div className="flex-grow"></div> {/* Memberi ruang agar tombol di bawah */}

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

      {/* Panggil komponen AuthModal di sini */}
      {isAuthModalOpen && ( // Render modal hanya jika isAuthModalOpen true
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={handleCloseModal}
          onAuthSuccess={handleAuthSuccess} // Gunakan handler yang sudah diupdate
        />
      )}
    </>
  );
};

ConcertCard.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default ConcertCard;