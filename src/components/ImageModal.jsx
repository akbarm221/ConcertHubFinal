// src/components/ImageModal.jsx
import React, { useEffect } from 'react';

function ImageModal({ isOpen, onClose, imageUrl, altText = "Gambar Diperbesar" }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      // PERUBAHAN DI SINI: ganti bg-black menjadi bg-white
      className="fixed inset-0 bg-white bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-modal-title"
    >
      <div
        className="bg-white p-2 sm:p-4 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="image-modal-title" className="sr-only">{altText}</h2>
        <button
          onClick={onClose}
          // Anda mungkin perlu menyesuaikan warna tombol close jika background modal terlalu terang
          // Misalnya, membuatnya lebih gelap agar kontras
          className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors z-10"
          aria-label="Tutup Modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="w-full h-full flex-grow overflow-auto flex items-center justify-center py-4">
          <img
            src={imageUrl}
            alt={altText}
            className="max-w-full max-h-full object-contain rounded-md"
          />
        </div>
      </div>
    </div>
  );
}

export default ImageModal;