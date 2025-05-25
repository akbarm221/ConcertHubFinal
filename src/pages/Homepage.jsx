import Hero from '../components/Hero';
import SidebarFilter from '../components/SidebarFilter';
import ConcertList from '../components/ConcertList';
import React, { useState, useEffect } from 'react'; // 

const HomePage = () => {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    minPrice: 0,
    location: '',
    city: '',
    genres: [],
  });

  return (
    <>
      <Hero />
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
