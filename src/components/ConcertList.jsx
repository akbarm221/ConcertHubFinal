import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import ConcertGrid from './ConcertGrid';

const API_BASE_URL = 'http://localhost:8080';
const ITEMS_PER_PAGE = 6;

// Nilai default untuk rentang jika hanya satu sisi yang disediakan
const DEFAULT_MIN_DATE = '1970-01-01'; // Tanggal awal yang sangat lampau
const DEFAULT_MAX_DATE = '9999-12-31'; // Tanggal akhir yang sangat jauh
const DEFAULT_MAX_PRICE = '999999999'; // Harga maksimum yang sangat besar
const DEFAULT_MIN_PRICE = '0';         // Harga minimum default jika hanya max_price yang ada (kurang relevan untuk UI saat ini)


const ConcertList = ({ filters }) => {
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paginationData, setPaginationData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Menyimpan string filter sebelumnya untuk deteksi perubahan yang sebenarnya
  const [prevFiltersString, setPrevFiltersString] = useState(JSON.stringify(filters));

  const fetchConcerts = useCallback(async (pageToFetch, activeFilters) => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    const { startDate, endDate, minPrice, city, genres } = activeFilters; // Ambil dari activeFilters

    // --- Penanganan Parameter Filter Rentang ---

    // 1. Filter Tanggal (memastikan pasangan dikirim jika salah satu ada)
    if (startDate && endDate) {
      params.append('start_date', startDate);
      params.append('end_date', endDate);
    } else if (startDate) { // Hanya startDate yang diisi
      params.append('start_date', startDate);
      params.append('end_date', DEFAULT_MAX_DATE); // Default endDate
    } else if (endDate) { // Hanya endDate yang diisi
      params.append('start_date', DEFAULT_MIN_DATE); // Default startDate
      params.append('end_date', endDate);
    }
    // Jika tidak ada startDate maupun endDate, tidak ada parameter tanggal yang dikirim.

    // 2. Filter Harga (memastikan pasangan dikirim jika minPrice ada)
    const numericMinPrice = minPrice && Number(minPrice) > 0 ? Number(minPrice) : null;
    // Asumsi 'filters' belum memiliki 'maxPrice' dari UI, jadi kita gunakan default jika minPrice ada.
    // Jika nanti Anda menambahkan input maxPrice, Anda bisa mengambilnya dari activeFilters.maxPrice
    if (numericMinPrice !== null) {
      params.append('min_price', numericMinPrice.toString());
      // Jika activeFilters.maxPrice ada dan valid, gunakan itu. Jika tidak, default.
      const effectiveMaxPrice = activeFilters.maxPrice && Number(activeFilters.maxPrice) >= numericMinPrice
                               ? activeFilters.maxPrice.toString()
                               : DEFAULT_MAX_PRICE;
      params.append('max_price', effectiveMaxPrice);
    }
    // Jika hanya maxPrice yang ada (misal dari pengembangan UI di masa depan)
    // else if (activeFilters.maxPrice && Number(activeFilters.maxPrice) > 0) {
    //   params.append('min_price', DEFAULT_MIN_PRICE);
    //   params.append('max_price', activeFilters.maxPrice.toString());
    // }
    // Jika tidak ada minPrice (atau valid minPrice), tidak ada parameter harga yang dikirim.


    // --- Filter Lainnya ---
    if (city) {
      params.append('search', city);
    }

    if (genres && genres.length > 0) {
      console.warn("PERHATIAN: Filter genre saat ini menggunakan NAMA. Backend kemungkinan besar mengharapkan ID genre. Silakan sesuaikan implementasi filter genre untuk mengirim ID.");
      // Implementasi pengiriman ID genre (jika sudah ada mapping)
      // const genreIdMap = { 'Rock': 1, 'Pop': 2, /* ... */ };
      // genres.forEach(genreName => {
      //   if (genreIdMap[genreName]) {
      //     params.append('genre_ids[]', genreIdMap[genreName]);
      //   }
      // });
    }

    // Parameter Paginasi
    params.append('limit', ITEMS_PER_PAGE.toString());
    params.append('page', pageToFetch.toString());

    console.log('API Request Params:', params.toString()); // Untuk debugging parameter yang dikirim

    try {
      const response = await axios.get(`${API_BASE_URL}/concerts`, { params });
      setConcerts(response.data?.data?.data || []);
      setPaginationData(response.data?.data || null);

      if (response.data?.data?.data?.length === 0 && pageToFetch > 1) {
        const lastPageFromAPI = response.data?.data?.last_page;
        if (lastPageFromAPI > 0 && lastPageFromAPI < pageToFetch) {
          setCurrentPage(lastPageFromAPI);
        } else if (lastPageFromAPI === 0 && pageToFetch > 1) {
          setCurrentPage(1);
        }
      }
    } catch (err) {
      console.error("Gagal mengambil data konser:", err.response ? err.response.data : err.message);
      setError("Gagal mengambil data konser. Silakan coba lagi nanti.");
      setConcerts([]);
      setPaginationData(null);
    } finally {
      setLoading(false);
    }
  }, []); // useCallback sekarang tidak bergantung pada 'filters' secara langsung, karena 'filters' akan dilewatkan sebagai argumen

  // useEffect untuk mereset currentPage ke 1 ketika 'filters' berubah
  useEffect(() => {
    const currentFiltersString = JSON.stringify(filters);
    if (currentFiltersString !== prevFiltersString) {
      setCurrentPage(1); // Reset ke halaman pertama
      setPrevFiltersString(currentFiltersString); // Update string filter sebelumnya
    }
  }, [filters, prevFiltersString]);

  // useEffect untuk memanggil fetchConcerts ketika currentPage atau filters (via prevFiltersString) berubah
  useEffect(() => {
    // `filters` dilewatkan sebagai argumen ke `WorkspaceConcerts` untuk memastikan nilai terbaru digunakan
    fetchConcerts(currentPage, filters);
  }, [currentPage, filters, fetchConcerts]); // filters ditambahkan sebagai dependency untuk memanggil fetchConcerts saat filternya berubah.

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && (!paginationData || newPage <= paginationData.last_page) && newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };

  if (loading) return <p className="text-center text-gray-600 py-10">Memuat daftar konser...</p>;
  if (error) return <p className="text-center text-red-600 py-10">{error}</p>;

  return (
    <ConcertGrid
      concerts={concerts}
      paginationData={paginationData}
      currentPage={currentPage}
      onPageChange={handlePageChange}
    />
  );
};

ConcertList.propTypes = {
  filters: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    minPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    maxPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Tambahkan jika Anda berencana menambah filter maxPrice
    city: PropTypes.string,
    genres: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default ConcertList;