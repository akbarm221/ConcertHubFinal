// src/data/genreIcons.js

// 1. Impor file SVG atau gambar ikon Anda di sini
import PopIcon from '../assets/genre.svg'
import RockIcon from '../assets/genre.svg';
import JazzIcon from '../assets/genre.svg';
import IndieIcon from '../assets/genre.svg';
import ElectronicIcon from '../assets/genre.svg';
import HipHopIcon from '../assets/genre.svg';
import AcousticIcon from '../assets/genre.svg';
// Tambahkan impor lain sesuai kebutuhan

// Impor juga ikon default jika ada genre yang tidak memiliki ikon spesifik
import DefaultGenreIcon from '../assets/icons/default_genre_icon.svg'; // Contoh ikon default

const genreIconMap = {
  // Kunci adalah nama genre (case-sensitive, sesuaikan dengan data dari API)
  // Nilai adalah variabel ikon yang sudah diimpor
  'Pop': PopIcon,
  'Rock': RockIcon,
  'Jazz': JazzIcon,
  'Indie': IndieIcon,
  'Electronic': ElectronicIcon,
  'Alternative': RockIcon, // Bisa menggunakan ikon yang sama jika mirip
  'Hip-Hop': HipHopIcon, // Hati-hati dengan tanda hubung atau spasi jika ada di nama genre API
  'R&B': HipHopIcon,
  'Acoustic': AcousticIcon,
  // Tambahkan genre lain dan ikonnya di sini
};

// Fungsi untuk mendapatkan ikon berdasarkan nama genre
export const getGenreIcon = (genreName) => {
  return genreIconMap[genreName] || DefaultGenreIcon; // Kembalikan ikon spesifik atau default
};

export default genreIconMap; // Anda bisa ekspor map langsung jika mau