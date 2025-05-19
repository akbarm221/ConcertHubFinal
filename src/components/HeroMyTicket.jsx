// src/components/HeroMyTicket.jsx (atau path yang Anda inginkan)
import React from 'react';
// Pastikan path ke BgImage Anda benar relatif terhadap file ini
import BgImage from '../assets/concert-bg.jpg'; // Ganti jika path atau nama file berbeda

const HeroMyTicket = () => { // NAMA KOMPONEN DIGANTI
  return (
    <div>
      {/* Banner Hero dengan Gambar Latar dan Overlay Ungu */}
      <section
        className="relative h-[300px] md:h-[400px] w-full bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${BgImage})` }}
      >
        {/* Overlay Warna Ungu */}
        <div className="absolute inset-0 bg-purple-800 bg-opacity-60"></div>

        {/* Konten Teks "Tiket Saya" di Tengah */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            Tiket Saya
          </h1>
        </div>
      </section>
    </div>
  );
};

export default HeroMyTicket; // EXPORT DENGAN NAMA BARU