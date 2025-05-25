// src/components/AuthModal/RegisterForm.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios'; // <-- Import axios

const RegisterForm = ({ onSuccess }) => {
  const [username, setUsername] = useState(''); // <-- Tambah state untuk username
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobDay, setDobDay] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Untuk mencegah multiple submit

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 120 }, (_, i) => currentYear - i);
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true); // Mulai proses submit

    if (!username || !email || !password || !confirmPassword || !dobDay || !dobMonth || !dobYear) {
      setError('Semua field registrasi wajib diisi.');
      setIsSubmitting(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.');
      setIsSubmitting(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Format email tidak valid.');
      setIsSubmitting(false);
      return;
    }
    const birthDate = new Date(parseInt(dobYear), parseInt(dobMonth) - 1, parseInt(dobDay));
    if (isNaN(birthDate.getTime())) {
      setError('Tanggal lahir tidak valid.');
      setIsSubmitting(false);
      return;
    }
    const ageDiffMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiffMs);
    const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);

    if (calculatedAge < 10) {
      setError('Anda harus berusia minimal 10 tahun untuk mendaftar.');
      setIsSubmitting(false);
      return;
    }

    // Format tanggal lahir sesuai "YYYY-MM-DD"
    const formattedDob = `${dobYear}-${dobMonth}-${dobDay}`;

    try {
      const response = await axios.post('http://localhost:8080/register', {
        username,
        email,
        password,
        birth_date: formattedDob, // Gunakan birth_date sesuai API
      });

      console.log('Register API Response:', response.data);

      // Pastikan response.data memiliki struktur yang diharapkan setelah sukses
      // Misalnya, jika backend mengembalikan token dan user data:
      if (response.data.status === 'success') {
        // Asumsi backend mengembalikan user data dan mungkin token di response.data.data
        // Sesuaikan 'data' dengan properti yang benar dari respons sukses backend
        onSuccess(response.data.data || { email, token: response.data.token || 'dummy_token' }, 'register');
      } else {
        // Tangani error dari respons backend (misal: "status": "error", "message": "Email already exists")
        setError(response.data.message || 'Registration failed. Please try again.');
      }

    } catch (err) {
      console.error('Registration Error:', err);
      // Tangani error dari axios (jaringan, server error 4xx/5xx)
      if (err.response) {
        // Server merespons dengan status error (e.g., 400 Bad Request, 409 Conflict)
        setError(err.response.data.message || 'Registration failed due to server error.');
      } else if (err.request) {
        // Permintaan dibuat tapi tidak ada respons (e.g., jaringan mati)
        setError('No response from server. Check your internet connection.');
      } else {
        // Sesuatu terjadi dalam menyiapkan permintaan yang memicu error
        setError('An unexpected error occurred during registration.');
      }
    } finally {
      setIsSubmitting(false); // Selesai proses submit
    }
  };

  return (
    // Kurangi space-y jika perlu, misal dari space-y-5 ke space-y-4 atau space-y-3
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Tambahkan field Username */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="reg-username">
          Username
        </label>
        <input
          type="text"
          id="reg-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 text-sm"
          placeholder="Buat username"
          required
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="reg-email">
          Email address
        </label>
        <input
          type="email"
          id="reg-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          // Kurangi padding vertikal dari py-3 ke py-2.5
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 text-sm"
          placeholder="you@example.com"
          required
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="reg-password">
          Password
        </label>
        <input
          type="password"
          id="reg-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 text-sm"
          placeholder="Buat password"
          minLength="6"
          required
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="reg-confirm-password">
          Confirm Password
        </label>
        <input
          type="password"
          id="reg-confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 text-sm"
          placeholder="Ulangi password"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-700">
          Date of Birth
        </label>
        <div className="flex space-x-2"> {/* Kurangi space-x jika perlu */}
          <select
            id="reg-dob-month"
            value={dobMonth}
            onChange={(e) => setDobMonth(e.target.value)}
            // Kurangi padding vertikal
            className="w-1/3 px-2 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm"
            required
            aria-label="Bulan Lahir"
          >
            <option value="" disabled>MM</option>
            {months.map(month => (
              <option key={`m-${month}`} value={month}>
                {month}
              </option>
            ))}
          </select>
          <select
            id="reg-dob-day"
            value={dobDay}
            onChange={(e) => setDobDay(e.target.value)}
            className="w-1/3 px-2 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm"
            required
            aria-label="Tanggal Lahir"
          >
            <option value="" disabled>DD</option>
            {days.map(day => (
              <option key={`d-${day}`} value={day}>
                {day}
              </option>
            ))}
          </select>
          <select
            id="reg-dob-year"
            value={dobYear}
            onChange={(e) => setDobYear(e.target.value)}
            className="w-1/3 px-2 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm"
            required
            aria-label="Tahun Lahir"
          >
            <option value="" disabled>YYYY</option>
            {years.map(year => (
              <option key={`y-${year}`} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      {error && <p className="text-red-500 text-xs pt-1">{error}</p>}
      <button
        type="submit"
        className="w-full bg-purple-600 text-white py-2.5 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-150 ease-in-out font-semibold text-base"
        disabled={isSubmitting} // <-- Disable tombol saat submit
      >
        {isSubmitting ? 'Registering...' : 'Sign up'} {/* <-- Ubah teks tombol */}
      </button>
    </form>
  );
};

RegisterForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

export default RegisterForm;