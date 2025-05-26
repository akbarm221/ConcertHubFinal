// src/pages/MyTicketsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Impor axios

import HeroMyTicket from '../components/HeroMyTicket';
import TicketCard from '../components/TicketCard';

// Komponen Filter Sederhana (tetap sama)
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

// ITEMS_PER_PAGE mungkin tidak lagi dibutuhkan jika API menentukan per_page
// const ITEMS_PER_PAGE = 3;

function MyTicketsPage() {
  const [orders, setOrders] = useState([]); // Menggantikan allPurchasedTickets
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState('All Transaction History'); // Default filter
  const [paginationInfo, setPaginationInfo] = useState({
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 3, // Bisa diupdate dari API
    from: 0,
    to: 0,
  });
  const [error, setError] = useState(null);

  // Di sinilah Anda akan consume API:
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null); // Reset error setiap kali fetch
      const token = localStorage.getItem('token');

      if (!token) {
        setError("Autentikasi dibutuhkan. Silakan login kembali.");
        setIsLoading(false);
        setOrders([]); // Kosongkan orders jika tidak ada token
        // Opsional: arahkan ke halaman login
        // navigate('/login');
        return;
      }

      try {
        // Parameter filter bisa ditambahkan di sini jika API mendukung
        // Contoh: /orders/me?page=${currentPage}&status=${activeFilter === 'Upcoming' ? 'paid' : ... }
        // Untuk saat ini, kita hanya menggunakan page
        const response = await axios.get(
          `http://localhost:5000/orders/me?page=${currentPage}`, // API Endpoint Anda
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
          }
        );

        if (response.data && response.data.status === 'success') {
          const apiData = response.data.data;
          setOrders(apiData.data); // Array of order objects
          setPaginationInfo({
            currentPage: apiData.current_page,
            totalPages: apiData.last_page,
            totalItems: apiData.total,
            itemsPerPage: apiData.per_page,
            from: apiData.from,
            to: apiData.to,
          });
          // Jika API mengembalikan halaman yang berbeda dari yang diminta (misalnya, halaman terakhir)
          // Anda mungkin ingin menyesuaikan state currentPage di sini, tapi umumnya API akan menghormati parameter page.
          // if (currentPage !== apiData.current_page) {
          //   setCurrentPage(apiData.current_page);
          // }
        } else {
          setError("Gagal mengambil data pesanan: format respons tidak dikenal.");
          setOrders([]);
        }
      } catch (err) {
        console.error("Error fetching orders:", err.response || err.message);
        setError(err.response?.data?.message || "Terjadi kesalahan saat mengambil pesanan Anda.");
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage, activeFilter]); // Akan re-fetch jika currentPage atau activeFilter berubah

  const handleDeleteTicket = (orderIdToDelete) => {
    // CATATAN: Logika ini idealnya melakukan panggilan API DELETE ke backend,
    // lalu me-refresh data dengan memanggil fetchOrders() atau memperbarui state.
    // Untuk saat ini, logika localStorage akan menjadi tidak sinkron dengan backend.
    // Pertimbangkan untuk menonaktifkan atau mengubah ini.
    if (window.confirm(`Apakah Anda yakin ingin menghapus/membatalkan pesanan dengan ID: ${orderIdToDelete}? (Aksi ini mungkin tidak didukung oleh backend saat ini)`)) {
      // Contoh placeholder jika ingin update UI langsung (tidak ideal tanpa backend update)
      // setOrders(prevOrders => prevOrders.filter(order => order.id !== orderIdToDelete));
      alert(`Fitur hapus order dari sisi klien perlu penyesuaian dengan API backend.`);
    }
  };

  const handleFilterChange = (filterName) => {
    setActiveFilter(filterName);
    setCurrentPage(1); // Reset ke halaman pertama saat filter berubah
  };

  // Logika untuk menyaring tiket berdasarkan activeFilter ('Upcoming', 'Past Tickets')
  // perlu diimplementasikan di sini. Ini akan memproses array `orders`.
  // Contoh Sederhana (perlu disesuaikan berdasarkan status 'paid' dan tanggal `concert_start`):
  const getFilteredTicketsForDisplay = () => {
    if (!orders || orders.length === 0) return [];

    const now = new Date();

    switch (activeFilter) {
      case 'Upcoming':
        return orders.filter(order => {
          // Asumsikan order hanya punya satu konser utama via ticket_orders[0]
          // Dan tiket valid jika statusnya 'paid' (atau status sukses lainnya dari backend Anda)
          const concertStart = order.ticket_orders?.[0]?.ticket?.concert?.concert_start;
          return concertStart && new Date(concertStart) > now && (order.status === 'paid' || order.status === 'success'); // Sesuaikan status sukses
        });
      case 'Past Tickets':
        return orders.filter(order => {
          const concertStart = order.ticket_orders?.[0]?.ticket?.concert?.concert_start;
          return concertStart && new Date(concertStart) <= now && (order.status === 'paid' || order.status === 'success'); // Sesuaikan status sukses
        });
      case 'All Transaction History':
      default:
        return orders; // Semua order yang diambil dari API untuk halaman saat ini
    }
  };

  const ticketsToDisplay = getFilteredTicketsForDisplay();

  const goToNextPage = () => {
    if (currentPage < paginationInfo.totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  if (isLoading && orders.length === 0) { // Loading awal atau saat ganti halaman/filter
    return <div className="text-center p-10 text-xl animate-pulse">Memuat tiket Anda...</div>;
  }
  
  if (error && orders.length === 0) { // Jika ada error dan tidak ada tiket yang bisa ditampilkan
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg p-4 sm:p-6 max-w-7xl mx-auto text-center">
          <p className="text-red-600 text-xl mb-4">{error}</p>
          <Link
            to="/"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-6 rounded-lg transition duration-150"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
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

          {/* Menggunakan ticketsToDisplay yang sudah difilter */}
          {ticketsToDisplay.length === 0 && !isLoading ? (
            <div className="text-center py-10">
              <p className="text-gray-600 text-xl mb-4">
                {`Tidak ada tiket untuk filter "${activeFilter}".`}
              </p>
              <Link
                to="/"
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-6 rounded-lg transition duration-150"
              >
                Beli Tiket Sekarang
              </Link>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center space-y-6">
                {ticketsToDisplay.map((order) => ( // Loop melalui order yang sudah difilter
                  <TicketCard
                    key={order.id} // Gunakan order.id sebagai key
                    ticket={order}    // Kirim seluruh objek order ke TicketCard
                    onDelete={() => handleDeleteTicket(order.id)}
                  />
                ))}
              </div>

              {/* Paginasi berdasarkan info dari API */}
              {paginationInfo.totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center space-x-4">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sebelumnya
                  </button>
                  <span className="text-sm text-gray-700">
                    Halaman {paginationInfo.currentPage} dari {paginationInfo.totalPages}
                  </span>
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === paginationInfo.totalPages}
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