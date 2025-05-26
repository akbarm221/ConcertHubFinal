// src/pages/MyTicketsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Pastikan axios sudah diinstal

import HeroMyTicket from '../components/HeroMyTicket'; // Asumsi path ini benar
import TicketCard from '../components/TicketCard';   // Asumsi path ini benar

// Komponen Filter Sederhana
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
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/orders/me?page=${currentPage}`,
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
    if (window.confirm(`Apakah Anda yakin ingin membatalkan pesanan dengan ID: ${orderIdToDelete}? (Fitur ini mungkin memerlukan integrasi backend)`)) {
      alert(`Fungsi pembatalan/penghapusan pesanan (ID: ${orderIdToDelete}) perlu diimplementasikan dengan API backend.`);
    }
  };

  const handleFilterChange = (filterName) => {
    setActiveFilter(filterName);
    setCurrentPage(1); // Selalu kembali ke halaman pertama saat filter diubah
  };

  // Logika Filter Client-Side
  const getFilteredTicketsForDisplay = () => {
    if (!orders || orders.length === 0) return [];
    const now = new Date(); // Mendapatkan tanggal dan waktu saat ini sebagai referensi

    // --- BAGIAN PENTING UNTUK PENYESUAIAN FILTER ---
    // Array `successStatuses` menentukan status pesanan mana yang dianggap "valid"
    // untuk ditampilkan dalam filter "Upcoming" dan "Past Tickets".
    // Contoh respons API Anda menunjukkan status "pending".
    // Jika Anda ingin tiket dengan status "pending" (atau status lain dari API Anda)
    // juga muncul di filter "Upcoming" atau "Past Tickets", Anda perlu
    // menambahkan status tersebut (dalam huruf kecil) ke dalam array ini.
    // Misalnya: const successStatuses = ['paid', 'success', 'completed', 'pending'];
    // Sesuaikan ini dengan logika bisnis dan status yang digunakan oleh backend Anda.
    const successStatuses = ['paid', 'success', 'completed']; // Ini adalah contoh bawaan Anda

    switch (activeFilter) {
      case 'Upcoming':
        return orders.filter(order => {
          const concertStartStr = order.ticket_orders?.[0]?.ticket?.concert?.concert_start;
          // Filter akan menampilkan tiket jika:
          // 1. Data tanggal konser ada dan valid.
          // 2. Status pesanan (order.status) ada di dalam `successStatuses`.
          // 3. Tanggal & waktu konser (`new Date(concertStartStr)`) LEBIH BESAR DARI waktu saat ini (`now`).
          return concertStartStr && successStatuses.includes(order.status?.toLowerCase()) && new Date(concertStartStr) > now;
        });
      case 'Past Tickets':
        return orders.filter(order => {
          const concertStartStr = order.ticket_orders?.[0]?.ticket?.concert?.concert_start;
          // Filter akan menampilkan tiket jika:
          // 1. Data tanggal konser ada dan valid.
          // 2. Status pesanan (order.status) ada di dalam `successStatuses`.
          // 3. Tanggal & waktu konser (`new Date(concertStartStr)`) LEBIH KECIL ATAU SAMA DENGAN waktu saat ini (`now`).
          return concertStartStr && successStatuses.includes(order.status?.toLowerCase()) && new Date(concertStartStr) <= now;
        });
      case 'All Transaction History':
      default:
        return orders; // Menampilkan semua order dari halaman API saat ini tanpa filter status/tanggal
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
  
  if (isLoading && orders.length === 0) {
    return <div className="text-center p-10 text-xl animate-pulse">Memuat tiket Anda...</div>;
  }

  if (error && orders.length === 0 && !isLoading) {
    return (
      <>
        <HeroMyTicket />
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-white shadow-xl rounded-lg p-4 sm:p-6 max-w-7xl mx-auto text-center">
            <TicketFilters
              onFilterChange={handleFilterChange}
              currentActiveFilter={activeFilter}
            />
            <p className="text-red-600 text-xl mb-4">{error}</p>
            <button 
              onClick={() => { setCurrentPage(1); /* Memicu fetchOrders dengan filter aktif saat ini */ }}
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

          {!isLoading && ticketsToDisplay.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600 text-xl mb-4">
                {/* Pesan akan disesuaikan jika tidak ada tiket setelah API call atau setelah filter */}
                {orders.length > 0 
                  ? `Tidak ada tiket untuk filter "${activeFilter}".` 
                  : `Anda belum memiliki tiket pada kategori "${activeFilter}".`}
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
              {isLoading && <div className="text-center p-10 text-xl animate-pulse">Memperbarui daftar tiket...</div>}
              {!isLoading && ticketsToDisplay.length > 0 && (
                <div className="flex flex-col items-center space-y-6">
                  {ticketsToDisplay.map((order) => (
                    <TicketCard
                      key={order.id}
                      ticket={order}
                      onDelete={() => handleDeleteTicket(order.id)}
                    />
                  ))}
                </div>
              )}

              {!isLoading && paginationInfo.totalPages > 1 && ticketsToDisplay.length > 0 && (
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