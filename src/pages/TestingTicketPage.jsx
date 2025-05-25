// src/pages/MyTicketsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Pastikan axios sudah diinstal

import HeroMyTicket from '../components/HeroMyTicket'; // Asumsi path ini benar
import TicketCard from '../components/TicketCard';   // Asumsi path ini benar

// Komponen Filter Sederhana (Tidak ada perubahan dari kode Anda)
const TicketFilters = ({ onFilterChange, currentActiveFilter }) => {
  const filterNames = ['Upcoming', 'Past Tickets', 'All Transaction History'];
  return (
    <div className="mb-6 flex justify-center">
      <div className="p-1 bg-gray-200 rounded-lg shadow-inner inline-flex">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-1 md:space-x-2 space-y-2 sm:space-y-0">
          {filterNames.map((name) => (
            <button
              key={name}
              onClick={() => {
                onFilterChange(name);
              }}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap
                ${currentActiveFilter === name
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-600 bg-white hover:bg-gray-50'
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

function MyTicketsPage() {
  const [orders, setOrders] = useState([]); // Menyimpan order dari API untuk halaman saat ini
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState('Upcoming'); // Default filter
  const [paginationInfo, setPaginationInfo] = useState({
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 3, // Akan diupdate dari API
    from: 0,
    to: 0,
    apiCurrentPage: 1,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // Flag untuk mencegah update state jika komponen unmount

    const fetchOrders = async () => {
      if (!isMounted) return;
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      if (!token) {
        if (isMounted) {
          setError("Autentikasi dibutuhkan. Silakan login kembali.");
          setIsLoading(false);
          setOrders([]);
        }
        // Opsional: arahkan ke halaman login, contoh: navigate('/login');
        return;
      }

      try {
        // API Endpoint dengan parameter halaman
        // Anda bisa menambahkan parameter filter ke API jika backend mendukungnya
        // misal: `&filter=${activeFilter.toLowerCase().replace(' ', '_')}`
        const response = await axios.get(
          `http://localhost:8080/orders/me?page=${currentPage}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
          }
        );
        
        if (isMounted) {
          if (response.data && response.data.status === 'success') {
            const apiData = response.data.data;
            setOrders(apiData.data || []); // Pastikan apiData.data adalah array
            setPaginationInfo({
              apiCurrentPage: apiData.current_page,
              totalPages: apiData.last_page,
              totalItems: apiData.total,
              itemsPerPage: apiData.per_page,
              from: apiData.from,
              to: apiData.to,
            });
          } else {
            setError("Gagal mengambil data pesanan: format respons tidak dikenal.");
            setOrders([]);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching orders:", err.response || err.message);
          setError(err.response?.data?.message || "Terjadi kesalahan saat mengambil pesanan Anda.");
          setOrders([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchOrders();

    return () => { // Cleanup function
      isMounted = false;
    };
  }, [currentPage, activeFilter]); // Re-fetch jika currentPage atau activeFilter berubah

  const handleDeleteTicket = (orderIdToDelete) => {
    // CATATAN: Ini adalah placeholder. Penghapusan idealnya melalui API call ke backend.
    // Setelah API call berhasil, Anda bisa memanggil fetchOrders lagi atau update state.
    if (window.confirm(`Apakah Anda yakin ingin membatalkan pesanan dengan ID: ${orderIdToDelete}? (Fitur ini mungkin memerlukan integrasi backend)`)) {
      alert(`Fungsi pembatalan/penghapusan pesanan (ID: ${orderIdToDelete}) perlu diimplementasikan dengan API backend.`);
      // Contoh: setOrders(prevOrders => prevOrders.filter(order => order.id !== orderIdToDelete));
      // Kemudian, jika Anda mengubah data, idealnya panggil ulang fetchOrders atau
      // sesuaikan paginationInfo jika jumlah total item berubah signifikan.
    }
  };

  const handleFilterChange = (filterName) => {
    setActiveFilter(filterName);
    setCurrentPage(1); // Selalu kembali ke halaman pertama saat filter diubah
  };

  // Logika Filter Client-Side
  const getFilteredTicketsForDisplay = () => {
    if (!orders || orders.length === 0) return [];
    const now = new Date();

    // Sesuaikan status 'paid' atau 'success' dengan status yang menandakan pembayaran berhasil dari backend Anda
    const successStatuses = ['paid', 'success', 'completed']; // Contoh status berhasil

    switch (activeFilter) {
      case 'Upcoming':
        return orders.filter(order => {
          const concertStartStr = order.ticket_orders?.[0]?.ticket?.concert?.concert_start;
          // Pastikan order memiliki status berhasil sebelum mengecek tanggal
          return concertStartStr && successStatuses.includes(order.status?.toLowerCase()) && new Date(concertStartStr) > now;
        });
      case 'Past Tickets':
        return orders.filter(order => {
          const concertStartStr = order.ticket_orders?.[0]?.ticket?.concert?.concert_start;
          // Pastikan order memiliki status berhasil sebelum mengecek tanggal
          return concertStartStr && successStatuses.includes(order.status?.toLowerCase()) && new Date(concertStartStr) <= now;
        });
      case 'All Transaction History':
      default:
        return orders; // Menampilkan semua order dari halaman API saat ini
    }
  };

  const ticketsToDisplay = getFilteredTicketsForDisplay();

  const goToNextPage = () => {
    if (paginationInfo.apiCurrentPage < paginationInfo.totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (paginationInfo.apiCurrentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };
  
  // Kondisi Loading Awal atau Saat Error dan Tidak Ada Data
  if (isLoading && orders.length === 0) {
    return <div className="text-center p-10 text-xl animate-pulse">Memuat tiket Anda...</div>;
  }
  if (error && orders.length === 0 && !isLoading) {
    return (
      <>
        <HeroMyTicket />
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-white shadow-xl rounded-lg p-4 sm:p-6 max-w-7xl mx-auto text-center">
            <TicketFilters // Tetap tampilkan filter meskipun error
              onFilterChange={handleFilterChange}
              currentActiveFilter={activeFilter}
            />
            <p className="text-red-600 text-xl mb-4">{error}</p>
            <button 
              onClick={() => { setCurrentPage(1); setActiveFilter(activeFilter); /* Memicu fetchOrders */ }}
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-6 rounded-lg transition duration-150"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <HeroMyTicket />
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg p-4 sm:p-6 max-w-7xl mx-auto">
          <TicketFilters
            onFilterChange={handleFilterChange}
            currentActiveFilter={activeFilter}
          />

          {/* Jika loading selesai tapi tidak ada tiket setelah filter atau dari API */}
          {!isLoading && ticketsToDisplay.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600 text-xl mb-4">
                {`Tidak ada tiket untuk filter "${activeFilter}".`}
              </p>
              <Link
                to="/"
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-6 rounded-lg transition duration-150"
              >
                Cari Konser Lain
              </Link>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center space-y-6">
                {ticketsToDisplay.map((order) => (
                  <TicketCard
                    key={order.id} // Gunakan order.id yang unik dari API sebagai key
                    ticket={order} // Kirim seluruh objek order ke TicketCard
                    // onDelete prop bisa tetap ada jika TicketCard Anda menggunakannya
                    onDelete={() => handleDeleteTicket(order.id)}
                  />
                ))}
              </div>

              {paginationInfo.totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center space-x-4">
                  <button
                    onClick={goToPreviousPage}
                    disabled={paginationInfo.apiCurrentPage === 1 || isLoading}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sebelumnya
                  </button>
                  <span className="text-sm text-gray-700">
                    Halaman {paginationInfo.apiCurrentPage} dari {paginationInfo.totalPages}
                  </span>
                  <button
                    onClick={goToNextPage}
                    disabled={paginationInfo.apiCurrentPage === paginationInfo.totalPages || isLoading}
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