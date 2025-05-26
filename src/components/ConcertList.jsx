import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types'; // Pastikan PropTypes diimpor
import ConcertGrid from './ConcertGrid';

const API_BASE_URL = 'http://localhost:5000';
const ITEMS_PER_PAGE = 6;

// Nilai default untuk rentang jika hanya satu sisi yang disediakan
const DEFAULT_MIN_DATE = '1970-01-01';
const DEFAULT_MAX_DATE = '9999-12-31';
const DEFAULT_MAX_PRICE = '999999999'; // Digunakan jika backend memerlukan pasangan min/max price
// const DEFAULT_MIN_PRICE = '0'; // Kurang relevan jika UI hanya ada minPrice

const ConcertList = ({ filters }) => {
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paginationData, setPaginationData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [prevFiltersString, setPrevFiltersString] = useState(JSON.stringify(filters));

  const fetchConcerts = useCallback(async (pageToFetch, activeFilters) => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    // 'genres' di sini seharusnya sudah berupa array ID dari SidebarFilter -> HomePage
    const { startDate, endDate, minPrice, city, genres: genreIdsFromFilter } = activeFilters;

    // 1. Filter Tanggal
    if (startDate && endDate) {
      params.append('start_date', startDate);
      params.append('end_date', endDate);
    } else if (startDate) {
      params.append('start_date', startDate);
      params.append('end_date', DEFAULT_MAX_DATE);
    } else if (endDate) {
      params.append('start_date', DEFAULT_MIN_DATE);
      params.append('end_date', endDate);
    }

    // 2. Filter Harga
    // Logika ini mengasumsikan backend memerlukan pasangan min_price dan max_price.
    // Jika backend Anda sudah diubah untuk hanya menerima min_price (untuk concert.min_price >= X),
    // maka pengiriman max_price bisa dihapus.
    const numericMinPrice = minPrice && Number(minPrice) > 0 ? Number(minPrice) : null;
    if (numericMinPrice !== null) {
      params.append('min_price', numericMinPrice.toString());
      const effectiveMaxPrice = activeFilters.maxPrice && Number(activeFilters.maxPrice) >= numericMinPrice
                              ? activeFilters.maxPrice.toString()
                              : DEFAULT_MAX_PRICE; // Mengirim max_price default jika tidak ada dari filter
      params.append('max_price', effectiveMaxPrice);
    }

    // 3. Filter Kota/Venue (Search)
    if (city) {
      params.append('search', city);
    }

    // 4. Filter Genre (INI BAGIAN YANG DIPERBAIKI)
    // Sekarang kita asumsikan 'genreIdsFromFilter' adalah array ID angka.
    if (genreIdsFromFilter && genreIdsFromFilter.length > 0) {
      // console.warn sudah tidak relevan jika kita mengirim ID
      genreIdsFromFilter.forEach(genreId => {
        // Pastikan genreId adalah string saat dikirim jika backend mengharapkannya,
        // meskipun .toString() biasanya aman.
        params.append('genre_ids[]', genreId.toString());
      });
    }

    // Parameter Paginasi
    params.append('limit', ITEMS_PER_PAGE.toString());
    params.append('page', pageToFetch.toString());

    // console.log('[ConcertList] API Request Params:', params.toString());

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
  }, []);

  useEffect(() => {
    const currentFiltersString = JSON.stringify(filters);
    if (currentFiltersString !== prevFiltersString) {
      setCurrentPage(1);
      setPrevFiltersString(currentFiltersString);
    }
  }, [filters, prevFiltersString]);

  useEffect(() => {
    fetchConcerts(currentPage, filters);
  }, [currentPage, filters, fetchConcerts]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 &&
        (!paginationData || newPage <= paginationData.last_page) &&
        newPage !== currentPage) {
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
    maxPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Sesuaikan jika Anda tidak lagi menggunakan maxPrice dari filter
    city: PropTypes.string,
    genres: PropTypes.arrayOf(PropTypes.number), // DIPERBARUI: genres sekarang array angka (ID)
  }).isRequired,
};

export default ConcertList;