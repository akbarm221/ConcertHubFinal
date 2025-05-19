import concerts from '../data/concerts';
import CalendarIcon from '../assets/calendar.svg';
import LocationIcon from '../assets/location.svg';

const ConcertList = () => {
  return (
    <section className="flex px-6 py-10 gap-6">
    
      {/* Main Content */}
      <div className="flex-1">
        {/* Header and Sort */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Upcoming Concerts</h2>
          <div className="text-sm">
            Sort by:{' '}
            <select className="border px-2 py-1 rounded">
              <option>Date: Newest</option>
              <option>Date: Oldest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {concerts.map((concert, index) => (
            <div key={index} className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
              <img src={concert.image} alt={concert.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{concert.title}</h3>
                <div className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                  <img src={CalendarIcon} className="w-4 h-4" alt="Calendar" />
                  {concert.date}
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-2 mb-3">
                  <img src={LocationIcon} className="w-4 h-4" alt="Location" />
                  {concert.location}
                </div>
                <p className="text-sm text-gray-800 mb-2">Starting from</p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-purple-700">{concert.price}</span>
                  <button className="bg-purple-700 text-white text-sm px-4 py-1 rounded-full hover:bg-purple-800 transition">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-10">
          <div className="inline-flex items-center space-x-2">
            <button className="px-3 py-1 border rounded text-sm">1</button>
            <button className="px-3 py-1 border rounded text-sm">2</button>
            <button className="px-3 py-1 border rounded text-sm">3</button>
            <button className="px-3 py-1 border rounded text-sm">4</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConcertList;
