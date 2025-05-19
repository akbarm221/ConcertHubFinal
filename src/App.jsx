// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/Homepage';
import VenuesPage from './pages/VenuesPage';
import MyTicketsPage from './pages/MyTicketsPage';
import SupportPage from './pages/SupportPage';
import ConcertDetailPage from './pages/ConcertDetailPages';
import NotFoundPage from './pages/NotFoundPage';
import TicketBookingMain from './pages/TicketBookingMain';
import TicketCard from './components/TicketCard';
import TestingTicketPage from './pages/TestingTicketPage';

function App() {
  return (
    // min-h-screen dan flex-col memastikan footer menempel di bawah jika konten pendek
    <div className="min-h-screen flex flex-col bg-gray-100"> {/* Ganti warna background jika perlu */}
      <Header />
      {/* flex-grow membuat main mengambil ruang tersisa, mendorong footer ke bawah */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
           <Route path="/ticketdesign" element={<TicketCard />} />
          <Route path="/testing" element={<TestingTicketPage />} />
          <Route path="/venues" element={<VenuesPage />} />
          <Route path="/order" element={<TicketBookingMain />} />
          <Route path="/my-tickets" element={<MyTicketsPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/concert/:concertId" element={<ConcertDetailPage />} />
          
          <Route path="*" element={<NotFoundPage />} />

        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;