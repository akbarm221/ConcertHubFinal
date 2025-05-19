// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // Ini mengimpor App.jsx Anda
import "./index.css"
import { BrowserRouter } from 'react-router-dom' // Pastikan ini diimpor


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* <--- INI BAGIAN KRUSIAL */}
      <App />       {/* Komponen App Anda, yang berisi <Routes> */}
    </BrowserRouter> {/* <--- PENUTUP BrowserRouter */}
  </React.StrictMode>,
)