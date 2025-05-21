// src/components/AuthModal/AuthModal.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useNavigate } from 'react-router-dom'; // <-- 1. Impor useNavigate

// ... (Komponen GoogleIcon tetap sama) ...
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.825 11.237H12.11V13.608H17.613C17.397 14.762 16.706 15.748 15.716 16.42L15.71 16.425L13.675 18.009L13.511 18.109C14.909 19.339 16.738 20.125 18.863 20.125C21.35 20.125 23.25 19.25 24 17.75L21.825 11.237Z" fill="#4285F4"/>
    <path d="M11.388 24C14.025 24 16.237 23.113 17.813 21.613L15.175 19.425C14.262 20.062 13.025 20.45 11.388 20.45C8.663 20.45 6.388 18.65 5.5 16.225L2.763 18.2C3.963 20.662 6.413 22.275 8.988 23.212L11.388 24Z" fill="#34A853"/>
    <path d="M5.5 16.225C5.313 15.737 5.2 15.213 5.2 14.662C5.2 14.113 5.313 13.587 5.5 13.1L2.825 11.087C2.088 12.225 1.663 13.413 1.663 14.662C1.663 15.913 2.088 17.1 2.825 18.237L5.5 16.225Z" fill="#FBBC05"/>
    <path d="M11.388 5.3C12.738 5.3 13.95 5.787 14.9 6.662L17.863 3.7C16.238 2.187 14.025 1.337 11.388 1.337C7.613 1.337 4.363 3.537 2.763 6.537L5.5 8.55C6.388 6.125 8.663 5.3 11.388 5.3Z" fill="#EA4335"/>
  </svg>
);


const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [modalError, setModalError] = useState('');
  const navigate = useNavigate(); // <-- 2. Inisialisasi useNavigate

  useEffect(() => {
    if (isOpen) {
      setActiveTab('login');
      setModalError('');
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAuthProcessSuccess = (userDataFromForm, authType) => {
    console.log(`${authType} success from form:`, userDataFromForm);
    onAuthSuccess(userDataFromForm, authType); // Panggil callback prop dari parent (misal App.jsx)

    // 3. Lakukan navigasi setelah sukses
    if (authType === 'login') { // Hanya navigasi ke /order jika itu adalah login
      navigate('/order');
    }
    // Anda mungkin ingin onClose() dipanggil di sini atau di onAuthSuccess di parent
    // onClose(); // Tutup modal setelah navigasi atau setelah onAuthSuccess dipanggil
  };

  const handleGoogleSignIn = () => {
    setModalError('');
    alert('Fitur "Continue with Google" belum diimplementasikan.');
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-150 ease-in-out"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white p-5 sm:p-6 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-150 ease-in-out flex flex-col max-h-[90vh] sm:max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        {/* ... (Bagian Atas Modal, Tab, Error Message tetap sama) ... */}
        <div className="flex justify-between items-center mb-4 sm:mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Welcome to ConcertHub
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <div className="flex mb-4 sm:mb-5 border-b border-gray-200">
          <button
            onClick={() => { setActiveTab('login'); setModalError(''); }}
            className={`flex-1 py-2.5 text-center font-semibold transition-colors duration-200 focus:outline-none text-sm ${
              activeTab === 'login'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-purple-500'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setActiveTab('register'); setModalError(''); }}
            className={`flex-1 py-2.5 text-center font-semibold transition-colors duration-200 focus:outline-none text-sm ${
              activeTab === 'register'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-purple-500'
            }`}
          >
            Register
          </button>
        </div>

        {modalError && <p className="flex-shrink-0 text-red-500 text-xs mb-2 text-center">{modalError}</p>}

        <div className="flex-grow overflow-y-auto pb-4 scrollbar-hide">
          {activeTab === 'login' ? (
            <LoginForm onSuccess={(userData) => handleAuthProcessSuccess(userData, 'login')} />
          ) : (
            <RegisterForm onSuccess={(userData) => handleAuthProcessSuccess(userData, 'register')} />
          )}
        </div>

        <div className="flex-shrink-0 pt-3 border-t border-gray-200 mt-4">
          <div className="my-3 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-2 text-gray-400 text-xs">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center bg-white text-gray-700 py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 text-sm font-medium"
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

AuthModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAuthSuccess: PropTypes.func.isRequired,
};

export default AuthModal;