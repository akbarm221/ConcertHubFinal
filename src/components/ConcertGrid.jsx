import React from 'react';
import PropTypes from 'prop-types';
import ConcertCard from './ConcertCard'; // Pastikan path ini benar

const ConcertGrid = ({ concerts, paginationData, currentPage, onPageChange }) => {
  // Jika tidak ada konser dan tidak ada data paginasi (mungkin saat initial load atau error)
  if (!paginationData && (!concerts || concerts.length === 0)) {
    // Pesan ini bisa ditampilkan oleh ConcertList saat loading atau error,
    // jadi mungkin tidak perlu di sini, atau bisa sebagai fallback.
    // Jika ConcertList sudah menampilkan pesan loading/error, ini mungkin tidak akan pernah terlihat.
    // Namun, jika concerts kosong setelah fetch berhasil (tidak ada hasil), pesan di bawah akan muncul.
  }

  // Jika array konser kosong SETELAH fetch (tidak ada hasil yang cocok dengan filter)
  if (concerts.length === 0 && paginationData && paginationData.total === 0) {
    return (
      <p className="col-span-full text-center text-gray-500 py-10">
        Tidak ada konser yang ditemukan dengan filter saat ini.
      </p>
    );
  }

  // Menghitung total halaman dari data paginasi yang dikirim oleh backend Laravel
  const totalPages = paginationData ? paginationData.last_page : 1;

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {concerts.map((concert) => (
          <ConcertCard
            key={concert.id}
            id={concert.id}
            name={concert.name}
            concert_start={concert.concert_start}
            venue={concert.venue} // venue adalah objek, ConcertCard akan menangani venue.name
            link_poster={concert.link_poster}
            // Backend Anda menambahkan `min_price` ke setiap objek konser melalui transformasi
            // Jadi, kita bisa langsung menggunakan concert.min_price
            price={concert.min_price !== undefined ? concert.min_price : 0}
          />
        ))}
      </div>

      {/* Tampilkan Paginasi hanya jika total halaman lebih dari 1 */}
      {paginationData && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 sm:gap-3 text-sm mt-8">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                : 'text-gray-700'
            }`}
          >
            &lt; Sebelumnya
          </button>

          {/* Logika untuk menampilkan nomor halaman */}
          {/* Sederhana: tampilkan semua halaman. Untuk banyak halaman, pertimbangkan ellipsis */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 transition-colors text-xs sm:text-sm ${
                page === currentPage
                  ? 'bg-purple-600 text-white font-semibold border-purple-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                : 'text-gray-700'
            }`}
          >
            Berikutnya &gt;
          </button>
        </div>
      )}
      {paginationData && paginationData.total !== undefined && (
         <p className="text-center text-xs text-gray-500 mt-2">
            Menampilkan {paginationData.from}-{paginationData.to} dari {paginationData.total} konser.
        </p>
      )}
    </div>
  );
};

ConcertGrid.propTypes = {
  concerts: PropTypes.arrayOf(PropTypes.object).isRequired,
  paginationData: PropTypes.shape({
    current_page: PropTypes.number,
    data: PropTypes.array, // Array konser untuk halaman ini (sebenarnya sudah di `props.concerts`)
    first_page_url: PropTypes.string,
    from: PropTypes.number,
    last_page: PropTypes.number,
    last_page_url: PropTypes.string,
    links: PropTypes.array,
    next_page_url: PropTypes.string,
    path: PropTypes.string,
    per_page: PropTypes.number,
    prev_page_url: PropTypes.string,
    to: PropTypes.number,
    total: PropTypes.number,
  }), // Bisa null jika belum ada data
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

// Default props untuk paginationData agar tidak error jika null saat render awal
ConcertGrid.defaultProps = {
    paginationData: null,
};

export default ConcertGrid;