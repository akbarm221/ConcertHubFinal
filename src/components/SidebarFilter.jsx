import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Pastikan axios sudah terinstal (npm install axios)
import PropTypes from 'prop-types';

const API_BASE_URL = 'http://localhost:5000'; // Sesuaikan jika perlu

// Daftar nama genre konseptual yang ingin kita kecualikan dari filter pilihan
const CONCEPTUAL_GENRES_TO_EXCLUDE = ["Today", "This Weekend", "Trending"];

const SidebarFilter = ({ onFilterChange, currentFilters }) => { // Menerima currentFilters jika diperlukan untuk sinkronisasi awal
  // State lokal untuk setiap input filter
  const [minPrice, setMinPrice] = useState(currentFilters?.minPrice || 100000);
  const [startDate, setStartDate] = useState(currentFilters?.startDate || '');
  const [endDate, setEndDate] = useState(currentFilters?.endDate || '');
  const [city, setCity] = useState(currentFilters?.city || ''); // Menggunakan 'city' untuk input lokasi
  const [selectedGenreIds, setSelectedGenreIds] = useState(currentFilters?.genres || []); // Sekarang menyimpan array ID

  // State untuk daftar genre dari API
  const [availableGenres, setAvailableGenres] = useState([]);
  const [genresLoading, setGenresLoading] = useState(true);
  const [genresError, setGenresError] = useState(null);

  const sliderMaxPrice = 20500000; // Batas atas untuk slider, bukan nilai filter maxPrice

  // Fetch genres dari API saat komponen mount
  useEffect(() => {
    const fetchGenres = async () => {
      setGenresLoading(true);
      setGenresError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/genres`);
        if (response.data && response.data.status === 'success' && Array.isArray(response.data.data)) {
          // Filter untuk mengecualikan genre konseptual dan hanya mengambil genre musik aktual
          const musicGenres = response.data.data.filter(
            genre => !CONCEPTUAL_GENRES_TO_EXCLUDE.includes(genre.name)
          );
          setAvailableGenres(musicGenres);
        } else {
          setAvailableGenres([]);
          setGenresError("Format data genre tidak valid.");
        }
      } catch (err) {
        console.error("Gagal mengambil data genre:", err);
        setGenresError("Gagal mengambil daftar genre.");
        setAvailableGenres([]);
      } finally {
        setGenresLoading(false);
      }
    };

    fetchGenres();
  }, []); // Dependensi kosong berarti hanya dijalankan sekali saat mount

  const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);

  // Fungsi untuk memanggil onFilterChange di parent (HomePage)
  // dengan semua nilai filter saat ini dari state lokal SidebarFilter
  const triggerFilterChange = (changedField) => {
    if (onFilterChange) {
      const newFilters = {
        minPrice,
        startDate,
        endDate,
        city, // Menggunakan 'city' sebagai representasi input 'Location'
        genres: selectedGenreIds, // Mengirim array ID genre
        ...changedField, // Menyertakan field yang baru saja berubah
      };
      onFilterChange(newFilters);
    }
  };
  
  const handleMinPriceChange = (e) => {
    const val = Number(e.target.value);
    setMinPrice(val);
    triggerFilterChange({ minPrice: val });
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    triggerFilterChange({ startDate: e.target.value });
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    triggerFilterChange({ endDate: e.target.value });
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
    triggerFilterChange({ city: e.target.value });
  };

  const handleGenreChange = (genreId) => {
    const updatedGenreIds = selectedGenreIds.includes(genreId)
      ? selectedGenreIds.filter((id) => id !== genreId)
      : [...selectedGenreIds, genreId];
    setSelectedGenreIds(updatedGenreIds);
    triggerFilterChange({ genres: updatedGenreIds });
  };


  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full sm:w-80 space-y-6"> {/* Dibuat lebih responsif */}
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Filters</h2>

      {/* Date Range */}
      <div>
        <label className="block text-sm sm:text-base font-semibold mb-2">Date Range</label>
        <div className="space-y-2">
          <input
            type="date"
            className="border rounded px-3 py-2 w-full text-sm focus:ring-purple-500 focus:border-purple-500"
            value={startDate}
            onChange={handleStartDateChange}
          />
          <input
            type="date"
            className="border rounded px-3 py-2 w-full text-sm focus:ring-purple-500 focus:border-purple-500"
            value={endDate}
            min={startDate || undefined} // End date tidak boleh sebelum start date
            onChange={handleEndDateChange}
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location-input" className="block text-sm sm:text-base font-semibold mb-2">Location</label>
        <input
          id="location-input"
          type="text"
          placeholder="Enter city or venue"
          className="border rounded px-3 py-2 w-full text-sm focus:ring-purple-500 focus:border-purple-500"
          value={city}
          onChange={handleCityChange}
        />
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm sm:text-base font-semibold mb-2">Price Range (Starts From)</label>
        <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1">
          <span>{formatCurrency(minPrice)}</span>
          {/* <span>{formatCurrency(sliderMaxPrice)}</span>  Label max dari slider mungkin tidak perlu jika hanya filter minPrice */}
        </div>
        <input
          type="range"
          min={100000} // Atau nilai minimum dinamis jika perlu
          max={sliderMaxPrice}
          step={50000}
          value={minPrice}
          onChange={handleMinPriceChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
      </div>

      {/* Genre */}
      <div>
        <label className="block text-sm sm:text-base font-semibold mb-2">Genre</label>
        {genresLoading && <p className="text-xs text-gray-500">Loading genres...</p>}
        {genresError && <p className="text-xs text-red-500">{genresError}</p>}
        {!genresLoading && !genresError && availableGenres.length === 0 && (
          <p className="text-xs text-gray-500">No music genres available.</p>
        )}
        {!genresLoading && !genresError && availableGenres.length > 0 && (
          <div className="space-y-1 max-h-48 overflow-y-auto pr-2"> {/* Added max-height and scroll */}
            {availableGenres.map((genre) => (
              <div key={genre.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`genre-${genre.id}`} // ID unik untuk label
                  checked={selectedGenreIds.includes(genre.id)}
                  onChange={() => handleGenreChange(genre.id)}
                  className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                />
                <label htmlFor={`genre-${genre.id}`} className="ml-2 text-sm font-medium text-gray-700">
                  {genre.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

SidebarFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  currentFilters: PropTypes.shape({
    minPrice: PropTypes.number,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    city: PropTypes.string,
    genres: PropTypes.arrayOf(PropTypes.number), // genres sekarang array of numbers (IDs)
  }),
};

SidebarFilter.defaultProps = {
  currentFilters: { // Nilai default jika prop tidak disediakan
    minPrice: 100000,
    startDate: '',
    endDate: '',
    city: '',
    genres: [],
  },
};


export default SidebarFilter;