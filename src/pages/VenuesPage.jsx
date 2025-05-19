import React from 'react';
import { Link } from 'react-router-dom'; // Opsional, jika perlu link kembali

const VenuesPage = () => (
  <div className="container mx-auto p-8">
    <h1 className="text-3xl font-bold mb-4">Venues</h1>
    <p className="text-gray-700">Daftar venue konser akan ditampilkan di sini.</p>
    {/* Tambahkan konten halaman venue di sini */}
    <div className="mt-8">
      <Link to="/" className="text-purple-600 hover:underline">
        &larr; Kembali ke Beranda
      </Link>
    </div>
  </div>
);

export default VenuesPage;