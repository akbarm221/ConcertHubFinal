// src/components/AuthModal/LoginForm.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const LoginForm = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

 useEffect(() => {
  const localToken = localStorage.getItem("token");

  if (localToken) {
    const userData = {
      token: localToken,
      email: null,
      message: "Already logged in with stored token",
    };

    if (onSuccess) {
      onSuccess(userData, 'already-logged-in');
    }
    return; // Stop here, no need to check URL
  }

  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (token) {
    // Clean token from URL
    window.history.replaceState({}, document.title, window.location.pathname);

    // Simpan ke localStorage
    localStorage.setItem("token", token);

    const userData = {
      token: token,
      email: null,
      message: "Login with Google successful!",
    };

    if (onSuccess) {
      onSuccess(userData, 'google-login');
    }
  }
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email: email,
        password: password,
      });

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        const userData = {
          token: response.data.token,
          email: email,
          message: "Login successful!",
        };
        if (onSuccess) {
          onSuccess(userData, 'credentials-login');
        }
      } else {
        setError("Login failed. Invalid response from server.");
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Login failed. Please check your credentials.");
      } else if (err.request) {
        setError("Login failed. No response from server. Please check your connection.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginClick = () => {
    setIsGoogleLoading(true);
    window.location.href = "http://localhost:5000/auth/redirect";
  };

  return (
    <div className="space-y-4">
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
            disabled={isLoading || isGoogleLoading}
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
            disabled={isLoading || isGoogleLoading}
          />
        </div>
        {error && <p className="text-red-500 text-xs sm:text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-150 ease-in-out font-semibold text-base"
          disabled={isLoading || isGoogleLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      {/* <div className="flex items-center my-3">
        <hr className="flex-grow border-t border-gray-300" />
        <span className="px-2 text-xs text-gray-500 uppercase">Or continue with</span>
        <hr className="flex-grow border-t border-gray-300" />
      </div> */}

      {/* <button
        type="button"
        onClick={handleGoogleLoginClick}
        disabled={isGoogleLoading || isLoading}
        className="w-full flex items-center justify-center bg-white text-gray-700 py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition duration-150 ease-in-out font-medium text-sm shadow-sm"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M21.892 11.345C21.892 10.605 21.825 9.92 21.705 9.28H12.203V13.17H17.611C17.371 14.435 16.678 15.51 15.656 16.21V18.645H18.919C20.845 16.92 21.892 14.395 21.892 11.345Z" fill="#4285F4"/><path fillRule="evenodd" clipRule="evenodd" d="M12.203 22.0001C15.123 22.0001 17.571 21.0751 18.919 19.6451L15.656 17.2101C14.683 17.8901 13.541 18.2801 12.203 18.2801C9.60101 18.2801 7.39101 16.6151 6.57101 14.2851H3.18101V16.7801C4.58601 19.9301 8.13101 22.0001 12.203 22.0001Z" fill="#34A853"/><path fillRule="evenodd" clipRule="evenodd" d="M6.57099 14.2851C6.34099 13.5901 6.20299 12.8501 6.20299 12.0751C6.20299 11.3001 6.34099 10.5601 6.57099 9.8651V7.3701L3.18099 8.8801C2.40099 10.0701 2 11.2751 2 12.0751C2 12.8751 2.40099 14.0801 3.18099 15.2701L6.57099 14.2851Z" fill="#FBBC05"/><path fillRule="evenodd" clipRule="evenodd" d="M12.203 5.87C13.643 5.87 14.903 6.375 15.971 7.37L18.984 4.54C17.561 3.26 15.123 2.15 12.203 2.15C8.13101 2.15 4.58601 4.22 3.18101 7.37L6.57101 8.865C7.39101 6.535 9.60101 5.87 12.203 5.87Z" fill="#EA4335"/></svg>
        {isGoogleLoading ? "Mengarahkan..." : "Sign in with Google"}
      </button> */}
    </div>
  );
};

LoginForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

export default LoginForm;
