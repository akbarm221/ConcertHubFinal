// src/components/Header.jsx
import { useState } from 'react';
import LogoIcon from '../assets/logo.svg';
import SearchIcon from '../assets/search.svg';
import UserIcon from '../assets/profile-logo.svg';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate(); // Inisialisasi useNavigate

  const navLinks = [
    { name: 'Concerts', href: '/' },
    { name: 'Venues', href: '/venues' }, // Pastikan ini mengarah ke rute yang benar
    { name: 'My Tickets', href: '/my-tickets' }, // Pastikan ini mengarah ke rute yang benar
    { name: 'Support', href: '/support' }, // Pastikan ini mengarah ke rute yang benar
  ];

  // Fungsi untuk logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Hapus token dari localStorage
    navigate('/'); // Arahkan pengguna ke halaman utama
    // Opsional: setMenuOpen(false) jika Anda ingin menu mobile tertutup setelah logout
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Menggunakan Link untuk logo/nama aplikasi yang memicu logout */}
        <div
          className="text-lg font-semibold flex items-center gap-2 cursor-pointer" // Tambahkan cursor-pointer
          onClick={handleLogout} // Tambahkan onClick untuk logout
        >
          <img src={LogoIcon} alt="ConcertHub Logo" className="w-6 h-6" />
          <span>ConcertHub</span>
        </div>

        {/* Navigasi Desktop */}
        <div className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            // Menggunakan Link untuk navigasi internal yang benar
            <Link key={link.name} to={link.href} className="hover:underline">
              {link.name}
            </Link>
          ))}
          <img src={SearchIcon} alt="Search" className="w-5 h-5 cursor-pointer" />
          {/* Anda bisa menambahkan logika untuk icon User di sini, misal membuka modal login/profil */}
          <img src={UserIcon} alt="User" className="w-6 h-6 cursor-pointer" />
        </div>

        {/* Tombol Hamburger untuk Mobile */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-3 flex flex-col gap-3 px-4">
          {navLinks.map((link) => (
            // Menggunakan Link untuk navigasi internal yang benar di mobile
            <Link key={link.name} to={link.href} className="hover:underline">
              {link.name}
            </Link>
          ))}
          <div className="flex gap-4 mt-2">
            <img src={SearchIcon} alt="Search" className="w-5 h-5 cursor-pointer" />
            <img src={UserIcon} alt="User" className="w-6 h-6 cursor-pointer" />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;