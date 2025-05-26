// src/pages/HomePage.jsx
import Hero from '../components/Hero';
import SidebarFilter from '../components/SidebarFilter';
import ConcertList from '../components/ConcertList';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
// Impor SATU ikon yang akan Anda gunakan untuk semua filter genre di Hero
import CommonGenreIcon from '../assets/logo.svg'; // <-- GANTI PATH INI DENGAN PATH IKON ANDA

const API_BASE_URL = 'http://localhost:5000'; // Sesuaikan jika perlu

const HomePage = () => {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    minPrice: 0,
    city: '',
    genres: [], // Array ID genre
  });

  const [allConcerts, setAllConcerts] = useState([]);
  const [heroBannerConcert, setHeroBannerConcert] = useState(null);
  const [heroGenreFilters, setHeroGenreFilters] = useState([]);
  const [uniqueGenres, setUniqueGenres] = useState([]);

  const fetchInitialData = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/concerts?limit=100`); // Ambil misal 100 konser
      const concertsData = response.data?.data?.data || [];
      setAllConcerts(concertsData);

      const genresSet = new Map();
      concertsData.forEach(concert => {
        concert.genres.forEach(genre => {
          if (!genresSet.has(genre.id)) {
            genresSet.set(genre.id, { id: genre.id, name: genre.name });
          }
        });
      });
      const allUniqueGenres = Array.from(genresSet.values());
      setUniqueGenres(allUniqueGenres);

    } catch (error) {
      console.error("Gagal mengambil data awal untuk HomePage:", error);
      setAllConcerts([]);
      setUniqueGenres([]);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    if (allConcerts.length > 0) {
      const randomIndex = Math.floor(Math.random() * allConcerts.length);
      setHeroBannerConcert(allConcerts[randomIndex]);
    }

    if (uniqueGenres.length > 0) {
      const shuffledGenres = [...uniqueGenres].sort(() => 0.5 - Math.random());
      const selectedGenres = shuffledGenres.slice(0, 6).map(genre => ({
        ...genre,
        icon: CommonGenreIcon, // <--- TETAPKAN IKON YANG SAMA UNTUK SEMUA
      }));
      setHeroGenreFilters(selectedGenres);
    }
  }, [allConcerts, uniqueGenres]);

  const handleHeroGenreFilterChange = (genreId) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      // Mengganti filter genre dengan yang baru dipilih dari Hero
      // Atau toggle jika ID sudah ada
      genres: prevFilters.genres.includes(genreId)
               ? prevFilters.genres.filter(id => id !== genreId) // Hapus jika sudah ada (efek toggle)
               : [genreId] // Set ke genre ini saja
    }));
  };

  useEffect(() => {
    // console.log('[HomePage] Filters updated:', filters); // Sudah ada
  }, [filters]);

  return (
    <>
      <Hero
        bannerConcert={heroBannerConcert}
        genreFilters={heroGenreFilters} // Setiap objek genre di sini akan memiliki 'icon: CommonGenreIcon'
        onGenreFilterChange={handleHeroGenreFilterChange}
        currentSelectedGenreIds={filters.genres}
      />
      <div className="flex flex-col lg:flex-row p-6 gap-8 bg-gray-100 min-h-screen">
        <aside className="w-full lg:w-1/4">
          <SidebarFilter currentFilters={filters} onFilterChange={setFilters} />
        </aside>
        <main className="w-full lg:w-3/4">
          <h1 className="text-2xl font-bold mb-4">Upcoming Concerts</h1>
          <ConcertList filters={filters} />
        </main>
      </div>
    </>
  );
};

export default HomePage;