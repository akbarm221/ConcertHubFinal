// src/pages/OAuthCallback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token); // ✅ Simpan token
    }

    navigate("/"); // ✅ Redirect ke home atau halaman semula
  }, [navigate]);

  return <p>Menyimpan login...</p>;
};

export default OAuthCallback;
