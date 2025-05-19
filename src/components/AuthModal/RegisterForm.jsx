// src/components/AuthModal/RegisterForm.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';

const RegisterForm = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobDay, setDobDay] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [error, setError] = useState('');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 120 }, (_, i) => currentYear - i);
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword || !dobDay || !dobMonth || !dobYear) {
      setError('Semua field registrasi wajib diisi.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        setError('Format email tidak valid.');
        return;
    }
    const birthDate = new Date(parseInt(dobYear), parseInt(dobMonth) - 1, parseInt(dobDay));
    if (isNaN(birthDate.getTime())) {
        setError('Tanggal lahir tidak valid.');
        return;
    }
    const ageDiffMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiffMs);
    const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);

    if (calculatedAge < 10) {
        setError('Anda harus berusia minimal 10 tahun untuk mendaftar.');
        return;
    }

    console.log('Data Registrasi (Static):', {
      email,
      dob: `${dobYear}-${dobMonth}-${dobDay}`,
    });
    onSuccess({ email, id: `staticRegId${Date.now()}`, message: 'Registration successful (static)' });
  };

  return (
    // Kurangi space-y jika perlu, misal dari space-y-5 ke space-y-4 atau space-y-3
    <form onSubmit={handleSubmit} className="space-y-4">
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
        // Kurangi padding vertikal
        className="w-full bg-purple-600 text-white py-2.5 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-150 ease-in-out font-semibold text-base"
      >
        Sign up
      </button>
    </form>
  );
};

RegisterForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

export default RegisterForm;