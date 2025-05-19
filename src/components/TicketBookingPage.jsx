// src/components/TicketBookingPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageModal from './ImageModal'; 
import concertImg from '../assets/concert-bg.jpg'

// --- Mock Data ---
const mockConcertInfo = {
  id: 101,
  name: 'YOASOBI LIVE IN JAKARTA - ASIA TOUR 2024',
  venueName: 'Istora Senayan, GBK',
  date: '16 JAN 2024',
  description: 'Jogjajanan 2025 adalah salah satu program kerja Keluarga Mahasiswa Sosial Ekonomi Pertanian Universitas Gadjah Mada yang telah menjadi event ikonik di Jogja. Tahun ini, Jogjajanan kembali hadir dengan tema "general: Nada Bernada" dan tagline "Feel The Rhythm, Live The Moment". Tiap melodi lantunan momen tak terlupakan untuk Jogmates tercinta. Pada edisi ketujuh ini Jogjajanan akan menghadirkan rangkaian acara yang seru dan beragam, mulai dari deretan food tenant yang menawarkan berbagai pilihan kuliner, konser musik spektakuler dengan penampilan dari Guest Star yang memukau, hingga Pojok Dolanan yang menghadirkan permainan tradisional penuh nostalgia. Tak hanya itu, Jogjajanan 2025 juga dimeriahkan dengan berbagai kompetisi seperti Kompetisi Reels dan Business Plan Competition, serta dilengkapi dengan Art Spot yang instagramable dan penuh inspirasi. Jangan lewatkan keseruan dan segera amankan tiketmu!',
  venueMapImageUrl: concertImg 
};

const mockTicketTypes = [
  { id: 1, concertId: 101, name: 'Presale 1 (Regular)', price: 125000, quota: 500, description: 'Ticket description goes here...' },
  { id: 2, concertId: 101, name: 'Presale 2 (Regular)', price: 135000, quota: 300, description: 'Another ticket description here...' },
  { id: 3, concertId: 101, name: 'Presale 3 (Regular)', price: 145000, quota: 200, description: 'Description for presale 3.' },
  { id: 4, concertId: 101, name: 'Presale X (Premium)', price: 500000, quota: 50, description: 'Premium ticket benefits included.' },
];

const SERVICE_FEE = 21000;
const MOCK_USER_ID = 'userXYZ789';

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
          {ticket.description && <p className="text-xs text-gray-500 mt-1">{ticket.description}</p>}
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

function TicketBookingPage() {
  const navigate = useNavigate();
  const [concertInfo, setConcertInfo] = useState(null);
  const [availableTickets, setAvailableTickets] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentModalImageUrl, setCurrentModalImageUrl] = useState('');
  const [currentModalImageAlt, setCurrentModalImageAlt] = useState('');

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setConcertInfo(mockConcertInfo);
      const relevantTickets = mockTicketTypes.filter(ticket => ticket.concertId === mockConcertInfo.id);
      setAvailableTickets(relevantTickets);

      if (relevantTickets.length > 0 && relevantTickets.find(t => t.id === 1)) {
         setSelectedTickets({ 1: 1 });
      }
      setIsLoading(false);
    }, 500);
  }, []);

  const handleQuantityChange = (ticketId, newQuantity) => {
    const ticketInfo = availableTickets.find(t => t.id === ticketId);
    if (!ticketInfo) return;
    const quantity = Math.min(Math.max(0, newQuantity), ticketInfo.quota);

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
    setTotalPrice(currentSubtotal > 0 ? currentSubtotal + SERVICE_FEE : 0);
  }, [selectedTickets, availableTickets]);

  const handleSubmitOrder = async () => {
    if (Object.keys(selectedTickets).length === 0) {
      alert("Silakan pilih minimal satu tiket.");
      return;
    }

    const newPurchasedTickets = [];
    const orderId = `ORD-${Date.now()}`; // Buat ID Pesanan unik sederhana
    const orderTime = new Date().toISOString();

    for (const ticketIdStr in selectedTickets) {
      const ticketId = parseInt(ticketIdStr);
      const quantity = selectedTickets[ticketId];
      const ticketInfo = availableTickets.find(t => t.id === ticketId);

      if (ticketInfo) {
        
        for (let i = 0; i < quantity; i++) {
          newPurchasedTickets.push({
            uniqueTicketId: `${orderId}-${ticketId}-${i}`, 
            orderId: orderId,
            concertId: concertInfo?.id,
            concertName: concertInfo?.name || "Nama Konser Tidak Diketahui",
            ticketId: ticketInfo.id,
            ticketName: ticketInfo.name,
            ticketPrice: ticketInfo.price,
            orderTime: orderTime,
            status: 'Berhasil', 
            userId: MOCK_USER_ID,
          });
        }
      }
    }

    try {
      const existingTicketsJSON = localStorage.getItem('myPurchasedTickets');
      const existingTickets = existingTicketsJSON ? JSON.parse(existingTicketsJSON) : [];
      const updatedTickets = [...existingTickets, ...newPurchasedTickets];
      localStorage.setItem('myPurchasedTickets', JSON.stringify(updatedTickets));

      alert(`Pesanan dengan ID ${orderId} berhasil! Total: IDR ${totalPrice.toLocaleString()}. Anda akan diarahkan ke halaman Tiket Saya.`);
      setSelectedTickets({}); 
      navigate('/my-tickets'); 

    } catch (error) {
      console.error("Gagal menyimpan tiket ke localStorage atau navigasi:", error);
      alert("Terjadi kesalahan saat memproses pesanan Anda. Silakan coba lagi.");
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

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen text-xl">Memuat...</div>;
  }

  if (!concertInfo || (availableTickets.length === 0 && !isLoading)) {
    return <div className="text-center p-10 text-red-500">Gagal memuat data konser atau tiket tidak tersedia.</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kiri */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold mb-3 text-gray-700">Venue Information</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {concertInfo.description}
              </p>
            </section>

            <section className="bg-transparent p-0">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Ticket Category</h2>
              {availableTickets.map(ticket => (
                <TicketItem
                  key={ticket.id}
                  ticket={ticket}
                  quantity={selectedTickets[ticket.id] || 0}
                  onQuantityChange={handleQuantityChange}
                  maxQuota={ticket.quota}
                />
              ))}
            </section>
          </div>

          
          <div className="lg:col-span-1 space-y-6">
            <section className="bg-white p-6 rounded-xl shadow-lg  top-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">Order Details</h2>
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
                  <li className="flex justify-between items-center border-t border-gray-200 pt-2 mt-2 text-xs">
                    <span className="text-gray-600">Service Fee</span>
                    <span className="text-gray-800 font-medium">IDR {SERVICE_FEE.toLocaleString()}</span>
                  </li>
                </ul>
              )}
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between items-center font-bold text-md mb-4">
                  <span className="text-gray-700">Total</span>
                  <span className="text-purple-700">IDR {totalPrice.toLocaleString()}</span>
                </div>
                <button
                  onClick={handleSubmitOrder}
                  disabled={Object.keys(selectedTickets).length === 0 || totalPrice === 0 || isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Confirm Payment'}
                </button>
              </div>
            </section>

            {concertInfo.venueMapImageUrl && (
              <section className="bg-white p-4 rounded-xl shadow-lg">
                <h2 className="text-lg font-semibold mb-3 text-gray-700">Venue Map</h2>
                <div
                  className="cursor-pointer hover:opacity-80 transition-opacity rounded-md overflow-hidden"
                  onClick={() => openImageModal( concertInfo.venueMapImageUrl, `Peta venue ${concertInfo.venueName}`)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openImageModal( concertInfo.venueMapImageUrl, `Peta venue ${concertInfo.venueName}`); }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Lihat peta venue ${concertInfo.venueName} lebih besar`}
                >
                  <img
                    src={ concertInfo.venueMapImageUrl}
                    alt={`Peta venue ${concertInfo.venueName}`}
                    className="w-full h-auto object-contain"
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