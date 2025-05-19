import React, { useState } from 'react';

const SidebarFilter = ({ onFilterChange }) => {
  const [minPrice, setMinPrice] = useState(100000);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [city,setCity] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);

  const maxPrice = 20500000;

  const genres = ['Rock', 'Pop', 'Hip Hop', 'Electronic', 'Jazz', 'Classical'];

  const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);

  const handleGenreChange = (genre) => {
    const updatedGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];
    setSelectedGenres(updatedGenres);
    triggerFilterChange({ genre: updatedGenres });
  };

  const triggerFilterChange = (changed) => {
    if (onFilterChange) {
      onFilterChange({
        minPrice,
        maxPrice,
        startDate,
        endDate,
        location,
        city,
        genres: selectedGenres,
        ...changed,
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow w-80 space-y-6">
      <h2 className="text-2xl font-bold">Filters</h2>

      {/* Date Range */}
      <div>
        <label className="block font-semibold mb-2">Date Range</label>
        <div className="space-y-2">
          <input
            type="date"
            className="border rounded px-2 py-1 w-full"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              triggerFilterChange({ startDate: e.target.value });
            }}
          />
          <input
            type="date"
            className="border rounded px-2 py-1 w-full"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              triggerFilterChange({ endDate: e.target.value });
            }}
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block font-semibold mb-2">Location</label>
        <input
          type="text"
          placeholder="Enter city or venue"
          className="border rounded px-2 py-1 w-full"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            triggerFilterChange({ city : e.target.value });
          }}
        />
      </div>

      {/* Price Range */}
      <div>
        <label className="block font-semibold mb-2">Price Range</label>
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>{formatCurrency(minPrice)}</span>
          <span>{formatCurrency(maxPrice)}</span>
        </div>
        <input
          type="range"
          min={100000}
          max={maxPrice}
          step={50000}
          value={minPrice}
          onChange={(e) => {
            const val = Number(e.target.value);
            setMinPrice(val);
            triggerFilterChange({ minPrice: val });
          }}
          className="w-full accent-purple-600"
        />
      </div>

      {/* Genre */}
      <div>
        <label className="block font-semibold mb-2">Genre</label>
        <div className="space-y-1">
          {genres.map((genre) => (
            <div key={genre} className="flex items-center">
              <input
                type="checkbox"
                id={genre}
                checked={selectedGenres.includes(genre)}
                onChange={() => handleGenreChange(genre)}
                className="accent-purple-600 mr-2"
              />
              <label htmlFor={genre}>{genre}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarFilter;
