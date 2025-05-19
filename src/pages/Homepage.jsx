import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import ConcertGrid from '../components/ConcertGrid';
import SidebarFilter from '../components/SidebarFilter';
import allConcertsData from '../data/concerts'; 

const HomePage = () => {
  const [filters, setFilters] = useState({
  
    startDate: '',
    endDate: '',
    minPrice: 500000, 
    location: '',
    city:'',
    genres: [],
  });
  const [filteredConcerts, setFilteredConcerts] = useState(allConcertsData);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };


  useEffect(() => {
    let currentConcerts = [...allConcertsData]; 

    const filterStartDate = filters.startDate ? new Date(filters.startDate) : null;
    const filterEndDate = filters.endDate ? new Date(filters.endDate) : null;
    
    if (filterStartDate) filterStartDate.setHours(0, 0, 0, 0);
    if (filterEndDate) filterEndDate.setHours(0, 0, 0, 0);
    
    if (filterStartDate || filterEndDate) {
      currentConcerts = currentConcerts.filter(concert => {
        const concertDate = new Date(concert.date); 
        concertDate.setHours(0, 0, 0, 0);
    
        let passStartDate = !filterStartDate || concertDate >= filterStartDate;
        let passEndDate = !filterEndDate || concertDate <= filterEndDate;
    
        return passStartDate && passEndDate;
      });
    }

 
    currentConcerts = currentConcerts.filter(concert => {

       const priceString = concert.price.replace(/[^0-9]/g, ''); 
       const price = parseInt(priceString, 10);
       return !isNaN(price) && price >= filters.minPrice;
    });

   
    if (filters.location && filters.location.trim() !== '') {
        currentConcerts = currentConcerts.filter(concert =>
            concert.location.toLowerCase().includes(filters.location.toLowerCase())
        );
    }

  
    if (filters.city && filters.city.trim() !== '') {
      currentConcerts = currentConcerts.filter(concert =>
          concert.city.toLowerCase().includes(filters.city.toLowerCase())
      );
  }
    


    setFilteredConcerts(currentConcerts);
  }, [filters]); 

  return (
    <>
      <div>
        <Hero />
        <div className="flex flex-col lg:flex-row p-6 gap-8 bg-gray-100 min-h-screen">
          <aside className="w-full lg:w-1/4 flex justify-center lg:self-start">
            <SidebarFilter
              currentFilters={filters}
              onFilterChange={handleFilterChange}
            />
          </aside>
          <main className="w-full lg:w-3/4">
            <h1 className="text-2xl font-bold mb-4">Upcoming Concerts</h1>
            <ConcertGrid concerts={filteredConcerts} />
          </main>
        </div>
      </div>
    </>
  );
};


export default HomePage;