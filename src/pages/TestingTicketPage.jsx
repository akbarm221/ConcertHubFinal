// src/pages/MyTicketsPage.jsx (atau src/components/MyTicketsPage.jsx)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// 1. Impor komponen-komponen Anda
import HeroMyTicket from '../components/HeroMyTicket'; // Pastikan path ini benar
import TicketCard from '../components/TicketCard';     // Pastikan path ini benar

// Komponen Filter Sederhana
const TicketFilters = ({ onFilterChange, currentActiveFilter }) => {
  // Nama filter bisa diambil dari data atau di-hardcode
  // Sesuaikan nama filter ini dengan yang Anda inginkan
  const filterNames = ['Upcoming', 'Past Tickets', 'All Transaction History'];

  return (
    <div className="mb-6 flex justify-center">
      <div className="p-1 bg-gray-200 rounded-lg shadow-inner inline-flex">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-1 md:space-x-2 space-y-2 sm:space-y-0">
          {filterNames.map((name) => (
            <button
              key={name}
              onClick={() => {
                onFilterChange(name); // Panggil fungsi filter dari parent
              }}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap
                          ${currentActiveFilter === name
                              ? 'bg-purple-600 text-white shadow-md' // Style untuk filter aktif
                              : 'text-gray-600 bg-white hover:bg-gray-50' // Style untuk filter tidak aktif
                          }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Pengaturan Paginasi
const ITEMS_PER_PAGE = 3;

function MyTicketsPage() {
  const [allPurchasedTickets, setAllPurchasedTickets] = useState([]); // Semua tiket dari localStorage
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState('Upcoming'); // Default filter aktif

  useEffect(() => {
    setIsLoading(true);
    const storedTickets = localStorage.getItem('myPurchasedTickets');
    if (storedTickets) {
      try {
        const parsedTickets = JSON.parse(storedTickets);
        // TODO: Di sini Anda mungkin perlu memfilter tiket berdasarkan `activeFilter`
        // sebelum menyimpannya ke `setAllPurchasedTickets` atau membuat state baru untuk tiket yang difilter.
        // Untuk sekarang, kita tampilkan semua.
        setAllPurchasedTickets(parsedTickets);
      } catch (e) {
        console.error("Error parsing stored tickets from localStorage:", e);
        setAllPurchasedTickets([]);
      }
    }
    // Simulasi loading, hapus jika tidak perlu
    setTimeout(() => setIsLoading(false), 300);
  }, []); // Mungkin perlu dependency [activeFilter] jika data di-fetch ulang saat filter

  const handleDeleteTicket = (ticketIdToDelete) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus tiket dengan ID: ${ticketIdToDelete}?`)) {
      const updatedTickets = allPurchasedTickets.filter(
        (ticket) => ticket.uniqueTicketId !== ticketIdToDelete
      );
      localStorage.setItem('myPurchasedTickets', JSON.stringify(updatedTickets));
      setAllPurchasedTickets(updatedTickets);

      // Sesuaikan halaman saat ini jika item terakhir di halaman dihapus
      const newTotalPages = Math.ceil(updatedTickets.length / ITEMS_PER_PAGE);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      } else if (updatedTickets.length === 0) {
        setCurrentPage(1); // Kembali ke halaman pertama jika tidak ada tiket lagi
      }
      alert(`Tiket dengan ID: ${ticketIdToDelete} berhasil dihapus.`);
    }
  };

  const handleFilterChange = (filterName) => {
    console.log("Filter aktif:", filterName);
    setActiveFilter(filterName);
    setCurrentPage(1); // Selalu reset ke halaman pertama saat filter berubah
    // --- LOGIKA FILTER SEBENARNYA AKAN DITERAPKAN DI SINI ---
    // Anda perlu memfilter `allPurchasedTickets` berdasarkan `filterName`
    // dan mungkin menyimpannya ke state terpisah untuk `currentTicketsToDisplay`.
    // Contoh sederhana (perlu disesuaikan dengan data tiket Anda):
    // const originalTickets = JSON.parse(localStorage.getItem('myPurchasedTickets') || '[]');
    // if (filterName === 'Upcoming') {
    //   // Logika filter upcoming
    //   setFilteredTickets(originalTickets.filter(t => new Date(t.eventDate) >= new Date()));
    // } else if (filterName === 'Past Tickets') {
    //   // Logika filter past
    //   setFilteredTickets(originalTickets.filter(t => new Date(t.eventDate) < new Date()));
    // } else { // All Transaction History
    //   setFilteredTickets(originalTickets);
    // }
  };

  // Logika untuk Paginasi dan Filtering (sementara filter belum diimplementasikan penuh)
  // Untuk sekarang, paginasi bekerja pada `allPurchasedTickets`
  // Nantinya, ini harus bekerja pada `filteredTickets`
  const ticketsToPaginate = allPurchasedTickets; // Ganti dengan state tiket yang sudah difilter nanti

  const totalPages = Math.ceil(ticketsToPaginate.length / ITEMS_PER_PAGE);
  const currentTicketsToDisplay = ticketsToPaginate.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  if (isLoading) {
    return <div className="text-center p-10 text-xl animate-pulse">Memuat tiket Anda...</div>;
  }

  return (
    <>
      {/* Komponen HeroMyTicket untuk header halaman */}
      <HeroMyTicket />

      {/* Kontainer utama untuk filter dan daftar tiket */}
      {/* mx-auto menengahkan, padding diatur untuk berbagai ukuran layar */}
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">

        {/* Kotak Putih untuk Filter dan Daftar Tiket */}
        {/* --- SESUAIKAN LEBAR KOTAK PUTIH DI SINI --- */}
        {/* Contoh menggunakan max-w-5xl. Anda bisa ganti ke max-w-4xl, max-w-6xl, max-w-7xl,
            atau hapus max-w-XXL jika ingin lebar penuh dari 'container' */}
        <div className="bg-white shadow-xl rounded-lg p-4 sm:p-6 max-w-7xl mx-auto">

          <TicketFilters
            onFilterChange={handleFilterChange}
            currentActiveFilter={activeFilter}
          />

          {ticketsToPaginate.length === 0 && !isLoading ? ( // Tampilkan jika tidak loading dan tidak ada tiket
            <div className="text-center py-10">
              <p className="text-gray-600 text-xl mb-4">
                {activeFilter !== 'All Transaction History' && activeFilter !== 'Upcoming' // Asumsi default adalah upcoming atau all
                  ? `Tidak ada tiket untuk filter "${activeFilter}".`
                  : "Anda belum memiliki tiket."}
              </p>
              <Link
                to="/" // Arahkan ke halaman booking
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-6 rounded-lg transition duration-150"
              >
                Beli Tiket Sekarang
              </Link>
            </div>
          ) : (
            <>
              {/* Daftar Tiket (menggunakan TicketCard) */}
              {/* flex flex-col items-center akan menengahkan TicketCard jika lebarnya lebih kecil dari kontainer ini */}
              <div className="flex flex-col items-center space-y-6">
                {currentTicketsToDisplay.map((ticket) => (
                  <TicketCard
                    key={ticket.uniqueTicketId}
                    ticket={ticket} // Kirim data tiket ke komponen TicketCard
                    onDelete={() => handleDeleteTicket(ticket.uniqueTicketId)} // Kirim fungsi hapus
                  />
                ))}
              </div>

              {/* Navigasi Paginasi */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center space-x-4">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sebelumnya
                  </button>
                  <span className="text-sm text-gray-700">
                    Halaman {currentPage} dari {totalPages}
                  </span>
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Berikutnya
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default MyTicketsPage;