import React from 'react';
import { useParams, Link } from 'react-router-dom';



const ConcertDetailPage = () => {
  
  const { concertId } = useParams();


  const concert = { 
      id: concertId,
      title: `Nama Konser ${concertId}`,
      artist: `Artis Konser ${concertId}`,
      date: 'Tanggal Konser',
      price: 100000 * parseInt(concertId || '1'),
      imageUrl: `https://via.placeholder.com/800x400/cccccc/FFFFFF?text=Concert+${concertId}+Detail`,
      description: `Ini adalah deskripsi lengkap untuk konser ${concertId}. Informasi detail tentang jadwal, lineup, dan peraturan venue akan ditampilkan di sini.`
  }
 


  if (!concert) {
   
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Konser Tidak Ditemukan</h1>
        <p className="text-gray-700 mb-6">Maaf, kami tidak dapat menemukan detail untuk konser yang Anda cari.</p>
        <Link to="/" className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition duration-150">
          Kembali ke Beranda
        </Link>
      </div>
    )
  }


   const formatPrice = (price) => {
    if (typeof price !== 'number') return 'N/A';
    return `IDR ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  };


  return (
    <div className="container mx-auto p-4 md:p-8">
       <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <img src={concert.imageUrl} alt={`Detail for ${concert.title}`} className="w-full h-64 md:h-96 object-cover"/>
          <div className="p-6">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{concert.title}</h1>
              <p className="text-xl text-gray-700 mb-4">{concert.artist}</p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                  <span className="flex items-center"><span className="mr-1">🗓️</span> {concert.date}</span>
              
              </div>

              <p className="text-gray-800 mb-6">{concert.description}</p>

              <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 bg-gray-50 rounded-md">
                   <span className="text-2xl font-bold text-purple-700">{formatPrice(concert.price)}</span>
                   <button className="w-full md:w-auto bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-200 shadow-md transform hover:scale-105">
                      Pesan Tiket Sekarang
                   </button>
              </div>
          </div>
       </div>

       <div className="mt-8">
          <Link to="/" className="text-purple-600 hover:underline">
             &larr; Kembali ke Daftar Konser
          </Link>
        </div>
    </div>
  );
};

export default ConcertDetailPage;