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
// Import PrivateRoute yang baru kita buat
import PrivateRoute from './components/PrivateRoute'; 
import OAuthCallback from './components/AuthModal/OAuthCallback';

function App() {
  return (
    
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      
      <main className="flex-grow">
        <Routes>
         
          <Route path="/" element={<HomePage />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
          {/* Rute-rute yang dilindungi: Bungkus dengan PrivateRoute */}
          <Route 
            path="/ticketdesign" 
            element={
              <PrivateRoute>
                <TicketCard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/testing" 
            element={
              <PrivateRoute>
                <TestingTicketPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/venues" 
            element={
              <PrivateRoute>
                <VenuesPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/booking/:concertId" 
            element={
              <PrivateRoute>
                <TicketBookingMain />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/my-tickets" 
            element={
              <PrivateRoute>
                <MyTicketsPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/support" 
            element={
              <PrivateRoute>
                <SupportPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/concert/:concertId" 
            element={
              <PrivateRoute>
                <ConcertDetailPage />
              </PrivateRoute>
            } 
          />
          
          {/* Rute Not Found tetap tidak perlu dilindungi */}
          <Route path="*" element={<NotFoundPage />} />

        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;