// src/components/Header.jsx
import { useState, useEffect } from 'react';
import LogoIcon from '../assets/logo.svg';
// import SearchIcon from '../assets/search.svg'; // Dihapus
// import UserIcon from '../assets/profile-logo.svg'; // Dihapus, diganti tombol Login/Logout
import { Link, useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal/AuthModal';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsUserLoggedIn(true);
    } else {
      setIsUserLoggedIn(false);
    }
    // Listener untuk perubahan localStorage dari tab/jendela lain (opsional tapi bagus)
    const handleStorageChange = (event) => {
      if (event.key === 'token') {
        setIsUserLoggedIn(!!event.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Hanya cek sekali saat mount, atau tambahkan dependency jika perlu update lebih sering

  // Navigasi disederhanakan
  const navLinks = [
    { name: 'Concerts', href: '/' },
    { name: 'My Tickets', href: '/my-tickets' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsUserLoggedIn(false);
    setMenuOpen(false);
    navigate('/');
  };

  const handleLoginButtonClick = () => {
    setMenuOpen(false); // Tutup menu mobile jika terbuka
    if (isUserLoggedIn) {
      handleLogout(); // Jika sudah login, tombol ini berfungsi sebagai Logout
    } else {
      setIsAuthModalOpen(true); // Jika belum login, buka modal
    }
  };

  const handleMyTicketsClick = (e) => {
    setMenuOpen(false);
    if (!isUserLoggedIn) {
      e.preventDefault();
      setIsAuthModalOpen(true);
    }
    // Jika sudah login, Link akan navigasi
  };

  const handleAuthSuccess = (userData, authType) => {
    setIsUserLoggedIn(true);
    setIsAuthModalOpen(false);
    // Navigasi setelah sukses sudah dihandle di LoginForm/AuthModal
    // Contoh: jika login, diarahkan ke /testing
    // Jika register, modal kembali ke tab login
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-lg font-semibold flex items-center gap-2 cursor-pointer">
            <img src={LogoIcon} alt="ConcertHub Logo" className="w-6 h-6" />
            <span>ConcertHub</span>
          </Link>

          {/* Navigasi Desktop */}
          <div className="hidden md:flex gap-x-6 items-center"> {/* Menggunakan gap-x-6 untuk spasi horizontal */}
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={link.name === 'My Tickets' ? handleMyTicketsClick : () => {}}
                className="hover:underline"
              >
                {link.name}
              </Link>
            ))}
            {/* Tombol Login/Logout menggantikan UserIcon dan SearchIcon */}
            <button
              onClick={handleLoginButtonClick}
              className="bg-white text-purple-700 px-4 py-1.5 rounded-full hover:bg-purple-100 text-sm font-semibold transition-colors"
            >
              {isUserLoggedIn ? 'Logout' : 'Login'}
            </button>
          </div>

          {/* Tombol Hamburger untuk Mobile */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          <div className="md:hidden mt-3 flex flex-col items-start gap-3 px-1 pb-3"> {/* px-1 agar tidak terlalu mepet */}
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={link.name === 'My Tickets' ? handleMyTicketsClick : () => setMenuOpen(false)}
                className="hover:underline py-1 w-full text-left px-3" // Styling agar lebih baik di mobile
              >
                {link.name}
              </Link>
            ))}
            {/* Tombol Login/Logout di mobile */}
            <button
              onClick={handleLoginButtonClick}
              className="bg-white text-purple-700 px-4 py-1.5 rounded-full hover:bg-purple-100 text-sm font-semibold transition-colors w-full mt-2 text-center" // Styling tombol mobile
            >
              {isUserLoggedIn ? 'Logout' : 'Login'}
            </button>
          </div>
        )}
      </nav>

      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
};

export default Header;