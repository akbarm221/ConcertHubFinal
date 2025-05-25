// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom'; // Ini untuk navigasi
import PropTypes from 'prop-types'; // Ini untuk validasi prop (praktik baik)

const PrivateRoute = ({ children }) => {
  // Hanya satu baris ini yang melakukan pengecekan inti:
  const token = localStorage.getItem('token'); 

  // Dan satu conditional rendering ini yang memutuskan navigasi atau menampilkan konten:
  if (!token) {
    return <Navigate to="/" replace />; // Arahkan jika tidak ada token
  }

  return children; // Tampilkan konten jika token ada
};

// Validasi propTypes juga sudah ada untuk memastikan children itu ada
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;