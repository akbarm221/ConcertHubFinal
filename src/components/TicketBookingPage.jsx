// src/components/TicketBookingPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import ImageModal from './ImageModal';
import concertImgFallback from '../assets/concert-bg.jpg';

// Komponen TicketItem (tidak ada perubahan pada logikanya, hanya tampilan deskripsi tiket yg dihilangkan)
function TicketItem({ ticket, quantity, onQuantityChange, maxQuota }) {
  const handleIncrement = () => {
    if (quantity < maxQuota) {
      onQuantityChange(ticket.id, quantity + 1);
    }
  };

  const handleDecrement = () => {
    onQuantityChange(ticket.id, Math.max(0, quantity - 1));
  };

  const handleInputChange = (e) => {
    let newQuantity = parseInt(e.target.value, 10);
    if (isNaN(newQuantity) || newQuantity < 0) {
      newQuantity = 0;
    } else if (newQuantity > maxQuota) {
      newQuantity = maxQuota;
    }
    onQuantityChange(ticket.id, newQuantity);
  };

  return (
    <div className="border border-gray-200 p-4 rounded-lg mb-4 shadow-sm bg-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="mb-3 sm:mb-0 sm:mr-4 flex-grow">
          <h3 className="text-md font-semibold text-gray-800">{ticket.name}</h3>
          <p className="text-purple-600 font-bold text-sm">IDR {ticket.price.toLocaleString()}</p>
          {/* Deskripsi tiket dihilangkan dari tampilan */}
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0 mt-2 sm:mt-0">
          {quantity > 0 ? (
            <>
              <button
                onClick={handleDecrement}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-3 rounded-l focus:outline-none text-sm"
                aria-label={`Kurangi jumlah tiket ${ticket.name}`}
              >
                -
              </button>
              <input
                type="text"
                value={quantity}
                onChange={handleInputChange}
                className="w-10 text-center border-t border-b border-gray-300 py-1 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-sm"
                min="0"
                aria-label={`Jumlah tiket ${ticket.name}`}
              />
              <button
                onClick={handleIncrement}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-3 rounded-r focus:outline-none text-sm"
                aria-label={`Tambah jumlah tiket ${ticket.name}`}
              >
                +
              </button>
            </>
          ) : (
            <button
              onClick={() => onQuantityChange(ticket.id, 1)}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-1.5 px-4 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              Tambah
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// const MOCK_USER_ID = 'userXYZ789'; // Tidak digunakan lagi jika user ID diambil dari token di backend

function TicketBookingPage() {
  const navigate = useNavigate(); // navigate tidak digunakan di handleSubmitOrder baru, bisa dihapus jika tidak ada kegunaan lain
  const location = useLocation();
  const { concertId: concertIdFromParams } = useParams();

  const [concertInfo, setConcertInfo] = useState(null);
  const [availableTickets, setAvailableTickets] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Loading untuk data awal & submit order
  const [error, setError] = useState(null);

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentModalImageUrl, setCurrentModalImageUrl] = useState('');
  const [currentModalImageAlt, setCurrentModalImageAlt] = useState('');

  useEffect(() => {
    let isMounted = true; // Flag untuk mencegah update state jika komponen unmount
    setIsLoading(true);
    setError(null);
    const routeState = location.state;
    let currentConcertId = concertIdFromParams ? parseInt(concertIdFromParams) : null;

    const concertDetails = {
      id: currentConcertId,
      name: routeState?.concertName || (currentConcertId ? `Konser #${currentConcertId}` : 'Nama Konser Tidak Diketahui'),
      description: routeState?.concertDescription || 'Deskripsi untuk konser ini belum tersedia.',
      venueMapImageUrl: routeState?.venueMapImageUrl || concertImgFallback,
      venueName: routeState?.venueName || (currentConcertId ? `Venue Konser #${currentConcertId}` : 'Venue Tidak Diketahui'),
      date: routeState?.date || 'Tanggal Konser (Ambil dari API)',
    };
    if (isMounted) {
      setConcertInfo(concertDetails);
    }
    

    const fetchTickets = async () => {
      if (!currentConcertId) {
        if (isMounted) {
            setError("ID Konser tidak valid untuk mengambil tiket.");
            setAvailableTickets([]);
            setIsLoading(false);
        }
        return;
      }
      try {
        const response = await axios.get(`http://localhost:8080/tickets?concert_id=${currentConcertId}`);
        if (isMounted) {
            if (response.data && response.data.status === 'success' && Array.isArray(response.data.data)) {
            setAvailableTickets(response.data.data);
            } else {
            console.error("Format respons API tiket tidak sesuai:", response.data);
            setError("Gagal memuat jenis tiket: format data tidak sesuai.");
            setAvailableTickets([]);
            }
        }
      } catch (err) {
        if (isMounted) {
            console.error("Gagal mengambil data tiket:", err);
            setError(err.response?.data?.message || "Terjadi kesalahan saat mengambil data tiket.");
            setAvailableTickets([]);
        }
      } finally {
        if (isMounted) {
            setIsLoading(false);
        }
      }
    };

    if (currentConcertId) {
      fetchTickets();
    } else {
      if (isMounted) {
        setError("Tidak ada ID konser yang diberikan untuk memuat tiket.");
        setAvailableTickets([]);
        setIsLoading(false);
      }
    }
    return () => { // Cleanup function
        isMounted = false;
    };
  }, [location.state, concertIdFromParams]);

  const handleQuantityChange = (ticketId, newQuantity) => {
    const ticketInfo = availableTickets.find(t => t.id === ticketId);
    if (!ticketInfo) return;
    const maxQuota = typeof ticketInfo.quota === 'number' && ticketInfo.quota > 0 ? ticketInfo.quota : 0;
    const quantity = Math.min(Math.max(0, newQuantity), maxQuota);

    setSelectedTickets(prevSelected => {
      const updatedSelected = { ...prevSelected };
      if (quantity > 0) {
        updatedSelected[ticketId] = quantity;
      } else {
        delete updatedSelected[ticketId];
      }
      return updatedSelected;
    });
  };

  useEffect(() => {
    let currentSubtotal = 0;
    for (const ticketId in selectedTickets) {
      const ticketInfo = availableTickets.find(t => t.id === parseInt(ticketId));
      if (ticketInfo) {
        currentSubtotal += ticketInfo.price * selectedTickets[ticketId];
      }
    }
    setTotalPrice(currentSubtotal); // Total harga tanpa biaya layanan
  }, [selectedTickets, availableTickets]);

  const handleSubmitOrder = async () => {
    if (Object.keys(selectedTickets).length === 0) {
      alert("Silakan pilih minimal satu tiket.");
      return;
    }
    if (!concertInfo) {
      alert("Informasi konser tidak termuat, tidak dapat melanjutkan pesanan.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Anda belum login atau sesi Anda telah habis. Silakan login kembali.");
      setIsLoading(false);
      return;
    }

    const ticketsForAPI = Object.entries(selectedTickets).map(([ticketId, quantity]) => ({
      ticket_id: parseInt(ticketId),
      quantity: quantity,
    }));

    const requestBody = {
      tickets: ticketsForAPI,
    };

    try {
      console.log(token)
      const response = await axios.post(
        'http://localhost:8080/ticket-orders',
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );

      if (response.data && response.data.snap_url) {
        // Pengguna akan diarahkan, jadi tidak perlu alert atau reset state di sini
        // yang mungkin akan hilang saat redirect.
        window.location.href = response.data.snap_url;
      } else {
        console.error("Respon sukses namun tidak ada snap_url:", response.data);
        const message = "Gagal memproses pembayaran: informasi pembayaran tidak lengkap dari server.";
        setError(message);
        alert(message);
      }
    } catch (err) {
      console.error("Gagal membuat pesanan tiket:", err.response ? err.response.data : err.message);
      const apiErrorMessage = err.response?.data?.message || "Terjadi kesalahan pada server saat membuat pesanan.";
      setError(apiErrorMessage);
      alert(`Gagal membuat pesanan: ${apiErrorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const openImageModal = (imageUrl, altText) => {
    setCurrentModalImageUrl(imageUrl);
    setCurrentModalImageAlt(altText);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setCurrentModalImageUrl('');
    setCurrentModalImageAlt('');
  };

  // --- JSX untuk Render ---
  if (isLoading && !concertInfo && availableTickets.length === 0) { // Kondisi loading awal
    return <div className="flex justify-center items-center min-h-screen text-xl">Memuat data...</div>;
  }

  if (!concertInfo && !isLoading) { // Jika concertInfo gagal dimuat (seharusnya jarang terjadi jika ID ada)
      return <div className="text-center p-10 text-red-500">Gagal memuat informasi konser dasar.</div>;
  }

  // Menampilkan pesan error utama jika ada, setelah loading selesai & tiket gagal dimuat
  if (error && availableTickets.length === 0 && !isLoading) {
    return (
      <div className="container mx-auto max-w-3xl py-8 px-4 text-center">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-red-600 mb-3">Oops! Terjadi Kesalahan</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }


  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {concertInfo && (
              <section className="bg-white p-6 rounded-xl shadow-lg">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{concertInfo.name}</h1>
                <p className="text-sm text-gray-500 mb-3">{concertInfo.date} | {concertInfo.venueName}</p>
                <h2 className="text-xl font-semibold mb-3 text-gray-700">Informasi Konser & Venue</h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {concertInfo.description}
                </p>
              </section>
            )}

            <section className="bg-transparent p-0">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Kategori Tiket</h2>
              {isLoading && availableTickets.length === 0 && !error ? ( // Loading spesifik untuk tiket
                 <div className="bg-white rounded-xl shadow-lg p-6 text-center text-gray-500">Memuat tiket...</div>
              ) : availableTickets.length > 0 ? (
                availableTickets.map(ticket => (
                  <TicketItem
                    key={ticket.id}
                    ticket={ticket}
                    quantity={selectedTickets[ticket.id] || 0}
                    onQuantityChange={handleQuantityChange}
                    maxQuota={ticket.quota}
                  />
                ))
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-6">
                 <p className="text-gray-500 text-center py-4">
                    {error ? `Tidak dapat memuat tiket: ${error}` : "Tiket untuk konser ini belum tersedia atau sudah habis."}
                 </p>
                </div>
              )}
            </section>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <section className="bg-white p-6 rounded-xl shadow-lg top-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">Detail Pesanan</h2>
              {Object.keys(selectedTickets).length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-3">Belum ada tiket yang dipilih.</p>
              ) : (
                <ul className="space-y-2 mb-4">
                  {Object.entries(selectedTickets).map(([ticketId, quantity]) => {
                    const ticketInfo = availableTickets.find(t => t.id === parseInt(ticketId));
                    if (!ticketInfo) return null;
                    return (
                      <li key={ticketId} className="flex justify-between items-center text-xs">
                        <span className="text-gray-600">{ticketInfo.name}</span>
                        <span className="text-gray-800 font-medium">
                          {quantity}X IDR {ticketInfo.price.toLocaleString()}
                        </span>
                      </li>
                    );
                  })}
                  {/* Biaya layanan sudah dihapus dari sini */}
                </ul>
              )}
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between items-center font-bold text-md mb-4">
                  <span className="text-gray-700">Total</span>
                  <span className="text-purple-700">IDR {totalPrice.toLocaleString()}</span>
                </div>
                <button
                  onClick={handleSubmitOrder}
                  disabled={Object.keys(selectedTickets).length === 0 || totalPrice === 0 || isLoading || availableTickets.length === 0 && !error}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {/* Ubah teks tombol jika isLoading karena submit order */}
                  {isLoading && Object.keys(selectedTickets).length > 0 ? 'Memproses Pembayaran...' : 'Konfirmasi Pembayaran'}
                </button>
              </div>
            </section>

            {concertInfo && concertInfo.venueMapImageUrl && concertInfo.venueMapImageUrl !== concertImgFallback && (
              <section className="bg-white p-4 rounded-xl shadow-lg">
                <h2 className="text-lg font-semibold mb-3 text-gray-700">Peta Venue</h2>
                <div
                  className="cursor-pointer hover:opacity-80 transition-opacity rounded-md overflow-hidden"
                  onClick={() => openImageModal(concertInfo.venueMapImageUrl, `Peta venue untuk ${concertInfo.name}`)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openImageModal(concertInfo.venueMapImageUrl, `Peta venue untuk ${concertInfo.name}`); }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Lihat peta venue ${concertInfo.name} lebih besar`}
                >
                  <img
                    src={concertInfo.venueMapImageUrl}
                    alt={`Peta venue ${concertInfo.venueName || concertInfo.name}`}
                    className="w-full h-auto object-contain rounded-md"
                  />
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      <ImageModal
        isOpen={isImageModalOpen}
        onClose={closeImageModal}
        imageUrl={currentModalImageUrl}
        altText={currentModalImageAlt}
      />
    </div>
  );
}

export default TicketBookingPage;