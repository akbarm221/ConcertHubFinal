import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="container mx-auto p-8 text-center flex flex-col items-center justify-center min-h-[60vh]"> {/* Atur tinggi minimum agar konten di tengah */}
    <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
    <p className="text-2xl font-semibold text-gray-800 mt-4 mb-2">Oops! Halaman Tidak Ditemukan.</p>
    <p className="text-gray-600 mb-8 max-w-md">Halaman yang Anda cari mungkin telah dihapus, namanya diubah, atau sementara tidak tersedia.</p>
    <Link
      to="/"
      className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-200 shadow-md"
    >
      Kembali ke Beranda
    </Link>
  </div>
);

export default NotFoundPage;