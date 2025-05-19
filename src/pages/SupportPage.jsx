import React from 'react';
import { Link } from 'react-router-dom';

const SupportPage = () => (
  <div className="container mx-auto p-8">
    <h1 className="text-3xl font-bold mb-4">Support</h1>
    <p className="text-gray-700">Informasi kontak, FAQ, atau bantuan lainnya akan ada di sini.</p>
    {/* Tambahkan konten halaman support */}
    <div className="mt-8">
      <Link to="/" className="text-purple-600 hover:underline">
        &larr; Kembali ke Beranda
      </Link>
    </div>
  </div>
);

export default SupportPage;