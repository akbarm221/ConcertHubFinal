import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // Pastikan plugin React diimpor
import tailwindcss from '@tailwindcss/vite' // Plugin Tailwind Vite



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
     react()
  ],
})