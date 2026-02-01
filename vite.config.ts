import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // 🔹 ОБЯЗАТЕЛЬНО для GitHub Pages
  base: '/GamificationSite/',

  // 🔹 если используешь react-router-dom
  server: {
    historyApiFallback: true,
  },

  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})
