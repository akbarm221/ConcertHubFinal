// src/components/AuthModal/LoginForm.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    setIsLoading(true); 

    try {
      // Kirim request ke API login
      const response = await axios.post("http://localhost:8080/login", {
        email: email,
        password: password,
      });

      console.log("Full server response:", response);
      console.log("Server response data:", response.data);

      // Jika request berhasil dan mendapatkan token
      if (response.data && response.data.token) {
        // simpan jwt token ke storage browser
        localStorage.setItem('token', response.data.token);
     

        const userData = {
          token: response.data.token,
          email: email, 
          message: "Login successful!",
        };

       
        if (onSuccess) {
          onSuccess(userData);
        }

     
        navigate("/testing");
      } else {
        // handle no token 
        setError("Login failed. Invalid response from server.");
      }
    } catch (err) {
     
      if (err.response) {
       
        setError(
          err.response.data.message ||
            "Login failed. Please check your credentials."
        );
        console.error("Login API error:", err.response.data);
      } else if (err.request) {
        
        setError(
          "Login failed. No response from server. Please check your connection."
        );
        console.error("Login network error:", err.request);
      } else {
       
        setError("An unexpected error occurred. Please try again.");
        console.error("Login setup error:", err.message);
      }
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor="login-email"
        >
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
          disabled={isLoading}
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlfor="login-password"
        >
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
          disabled={isLoading}
        />
      </div>
      {error && <p className="text-red-500 text-xs sm:text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-150 ease-in-out font-semibold text-base"
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign in"}{" "}
      </button>
    </form>
  );
};

LoginForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

export default LoginForm;