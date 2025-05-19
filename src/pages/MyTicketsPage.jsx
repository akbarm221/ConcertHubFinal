// src/components/MyTicketsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function MyTicketsPage() {
  const [purchasedTickets, setPurchasedTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedTickets = localStorage.getItem('myPurchasedTickets');
    if (storedTickets) {
      try {
        setPurchasedTickets(JSON.parse(storedTickets));
      } catch (e) {
        console.error("Error parsing stored tickets from localStorage:", e);
        setPurchasedTickets([]);
      }
    }
    setIsLoading(false);
  }, []);

  const handleDeleteTicket = (ticketIdToDelete) => {
    // Konfirmasi sebelum menghapus
    if (window.confirm(`Apakah Anda yakin ingin menghapus tiket dengan ID: ${ticketIdToDelete}?`)) {
      // 1. Filter tiket yang ada untuk menghapus tiket yang diinginkan
      const updatedTickets = purchasedTickets.filter(
        (ticket) => ticket.uniqueTicketId !== ticketIdToDelete
      );

      // 2. Update localStorage
      localStorage.setItem('myPurchasedTickets', JSON.stringify(updatedTickets));

      // 3. Update state untuk me-refresh tampilan
      setPurchasedTickets(updatedTickets);

      alert(`Tiket dengan ID: ${ticketIdToDelete} berhasil dihapus.`);
    }
  };

  if (isLoading) {
    return <div className="text-center p-10">Memuat tiket Anda...</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Tiket Saya</h1>
      {purchasedTickets.length === 0 ? (
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <p className="text-gray-600 text-xl mb-4">Anda belum memiliki tiket.</p>
          <Link
            to="/"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-150"
          >
            Beli Tiket Sekarang
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Tiket Unik
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Pesanan
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Konser
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jenis Tiket
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Harga Satuan
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal Pesan
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  {/* Kolom baru untuk Aksi */}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {purchasedTickets.map((ticket) => (
                  <tr key={ticket.uniqueTicketId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.uniqueTicketId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{ticket.orderId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ticket.concertName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{ticket.ticketName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">IDR {ticket.ticketPrice.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(ticket.orderTime).toLocaleDateString('id-ID', {
                        year: 'numeric', month: 'long', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        ticket.status === 'Berhasil' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {ticket.status}
                      </span>
                    </td>
                    {/* Tombol Hapus di kolom Aksi */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDeleteTicket(ticket.uniqueTicketId)}
                        className="text-red-600 hover:text-red-800 font-medium hover:bg-red-100 px-2 py-1 rounded-md transition-colors text-xs"
                        aria-label={`Hapus tiket ${ticket.uniqueTicketId}`}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyTicketsPage;