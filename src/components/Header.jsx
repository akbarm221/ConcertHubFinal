import { useState } from 'react';
import LogoIcon from '../assets/logo.svg';
import SearchIcon from '../assets/search.svg';
import UserIcon from '../assets/profile-logo.svg';
import { Link } from 'react-router-dom';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Concerts', href: '/' },
    { name: 'Venues', href: '#' },
    { name: 'My Tickets', href: '/testing' },
    { name: 'Support', href: '#' },
  ];

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-lg font-semibold flex items-center gap-2">
          <img src={LogoIcon} alt="ConcertHub Logo" className="w-6 h-6" />
          <span>ConcertHub</span>
        </div>

       
        <div className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="hover:underline">
              {link.name}
            </a>
          ))}
          <img src={SearchIcon} alt="Search" className="w-5 h-5 cursor-pointer" />
          <img src={UserIcon} alt="User" className="w-6 h-6 cursor-pointer" />
        </div>

       
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
            <a key={link.name} href={link.href} className="hover:underline">
              {link.name}
            </a>
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
