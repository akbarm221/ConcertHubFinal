import { useState, useEffect } from 'react'; 
import ConcertCard from './ConcertCard';



const ConcertGrid = ({ concerts }) => {
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);


  const totalPages = Math.ceil(concerts.length / itemsPerPage);


  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
       setCurrentPage(1);
    } else if (concerts.length === 0) {
       
       setCurrentPage(1);
    }
  }, [concerts, currentPage, totalPages]);


  const startIndex = (currentPage - 1) * itemsPerPage;
  
  const currentConcerts = concerts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNumber) => {
  
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    } else if (pageNumber < 1) {
       setCurrentPage(1); 
    } else if (totalPages === 0) {
       setCurrentPage(1); 
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Grid Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
       
        {concerts.length === 0 && (
           <p className="col-span-full text-center text-gray-500">No concerts match the current filters.</p>
        )}
       
        {currentConcerts.map((concert, index) => (
         
          <ConcertCard key={concert.id || `concert-${startIndex + index}`} {...concert} />
        ))}
      </div>

      
      {totalPages > 1 && (
         <div className="flex justify-center items-center gap-3 text-sm">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className={`px-2 ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-black'}`}
            disabled={currentPage === 1}
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                page === currentPage
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className={`px-2 ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-black'}`}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default ConcertGrid;