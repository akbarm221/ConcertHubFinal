// src/components/AuthModal/AuthModal.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

// ... (GoogleIcon tetap sama) ...
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
    onAuthSuccess(userDataFromForm, authType);
  };

  const handleGoogleSignIn = () => {
    setModalError('');
    alert('Fitur "Continue with Google" belum diimplementasikan.');
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out"
      onClick={handleOverlayClick}
    >
      {/* Tambahkan max-h-[...] dan overflow-y-auto di sini */}
      <div className="bg-white p-6 sm:p-7 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out flex flex-col max-h-[90vh]">
        <div className="text-center mb-4 sm:mb-5"> {/* Kurangi margin bottom sedikit */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Welcome to ConcertHub</h2>
        </div>

        <div className="flex mb-4 sm:mb-5 border-b border-gray-200"> {/* Kurangi margin bottom sedikit */}
          <button
            onClick={() => { setActiveTab('login'); setModalError(''); }}
            className={`flex-1 py-2.5 text-center font-semibold transition-colors duration-200 focus:outline-none text-sm sm:text-base ${ // Kurangi py dan sesuaikan font size
              activeTab === 'login'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-purple-500 hover:border-b-2 hover:border-gray-300'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setActiveTab('register'); setModalError(''); }}
            className={`flex-1 py-2.5 text-center font-semibold transition-colors duration-200 focus:outline-none text-sm sm:text-base ${ // Kurangi py dan sesuaikan font size
              activeTab === 'register'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-purple-500 hover:border-b-2 hover:border-gray-300'
            }`}
          >
            Register
          </button>
        </div>

        {modalError && <p className="text-red-500 text-xs mb-3 text-center">{modalError}</p>} {/* Kurangi mb */}

        {/* Konten form sekarang bisa scroll jika terlalu panjang */}
        <div className="overflow-y-auto pb-2 custom-scrollbar"> {/* Tambahkan custom scrollbar jika mau */}
          {activeTab === 'login' ? (
            <LoginForm onSuccess={(userData) => handleAuthProcessSuccess(userData, 'login')} />
          ) : (
            <RegisterForm onSuccess={(userData) => handleAuthProcessSuccess(userData, 'register')} />
          )}
        </div>

        {/* Bagian OR dan Google bisa tetap atau ikut scroll jika diletakkan di dalam div scrollable */}
        {/* Jika ingin tetap di bawah, pisahkan dari div overflow-y-auto */}
        <div className="pt-4"> {/* Tambahkan pt untuk memberi jarak jika dipisah */}
            <div className="my-4 flex items-center"> {/* Kurangi my */}
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-3 text-gray-400 text-xs">OR</span> {/* Kurangi mx dan font size */}
            <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <button
            type="button"
            onClick={handleGoogleSignIn}
            // Kurangi py
            className="w-full flex items-center justify-center bg-white text-gray-700 py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-500 transition duration-150 ease-in-out font-medium text-sm"
            >
            <GoogleIcon />
            Continue with Google
            </button>
        </div>


        <button
          onClick={onClose}
          className="mt-4 w-full text-center text-xs text-gray-600 hover:text-purple-600 hover:underline focus:outline-none" // Kurangi mt dan font size
        >
          Tutup
        </button>
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