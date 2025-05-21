// src/components/AuthModal/LoginForm.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';

const LoginForm = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

const handleSubmit = async (e) => {
    e.preventDefault();
    // setError(''); // Tidak perlu setError lagi

    // Langsung panggil onSuccess seolah-olah login berhasil
    // Anda bisa mengirim data dummy atau data yang relevan jika ada
    onSuccess({ email: email || 'mockuser@example.com', id: 'staticUserId123', message: 'Login successful (forced)' });
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="login-email">
          Email address
        </label>
        <input
          type="email"
          id="login-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 text-sm"
          placeholder="you@example.com"
          required
          autoFocus
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="login-password">
          Password
        </label>
        <input
          type="password"
          id="login-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 text-sm"
          placeholder="••••••••"
          required
        />
        {/* Anda bisa menambahkan link "Forgot password?" di sini jika perlu */}
      </div>
      {error && <p className="text-red-500 text-xs sm:text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-150 ease-in-out font-semibold text-base"
      >
        Sign in
      </button>
    </form>
  );
};

LoginForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

export default LoginForm;