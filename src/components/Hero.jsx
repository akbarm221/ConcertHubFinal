import { useEffect, useState } from 'react';
import concerts from '../data/concerts';
import filters from '../data/filters';

import BgImage from '../assets/concert-bg.jpg';
import CalendarIcon from '../assets/calendar.svg';
import LocationIcon from '../assets/location.svg';

const Hero = () => {
  const [concert, setConcert] = useState(null);
  const [activeFilters, setActiveFilters] = useState(filters);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * concerts.length);
    setConcert(concerts[randomIndex]);
  }, []);

  const handleFilterClick = (clickedLabel) => {
    const updatedFilters = activeFilters.map((filter) => ({
      ...filter,
      active: filter.label === clickedLabel,
    }));
    setActiveFilters(updatedFilters);
   
  };

  if (!concert) {
    return <div className="h-[400px] bg-gray-200 animate-pulse" />;
  }

  return (
    <div>
      {/* Banner Hero */}
      <section
        className="relative h-[400px] md:h-[500px] w-full bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(${BgImage})` }}
      >
        <div className="absolute inset-0 bg-purple-800 bg-opacity-60"></div>

        <div className="relative z-10 max-w-4xl px-6 md:px-12 text-white">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">{concert.title}</h1>
          <p className="mb-6 text-sm md:text-base">{concert.description}</p>

          <div className="flex flex-col md:flex-row md:items-center gap-2 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <img src={CalendarIcon} alt="Calendar" className="w-5 h-5" />
              <span>{concert.date}</span>
            </div>
            <div className="flex items-center gap-2 md:ml-6">
              <img src={LocationIcon} alt="Location" className="w-5 h-5" />
              <span>{concert.location}</span>
            </div>
          </div>

          <button className="mt-6 px-6 py-2 bg-white text-purple-800 font-semibold rounded-full hover:bg-gray-200 transition">
            Book Now
          </button>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="overflow-x-auto whitespace-nowrap px-4 py-3 bg-white shadow-sm border-b">
        <div className="inline-flex space-x-3">
          {activeFilters.map((filter, idx) => (
            <button
              key={idx}
              onClick={() => handleFilterClick(filter.label)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                filter.active
                  ? 'bg-purple-600 text-white border-transparent'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              <img src={filter.icon} alt={filter.label} className="w-4 h-4" />
              <span>{filter.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
