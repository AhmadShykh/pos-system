import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    watch: {
      usePolling: true, // Enable polling
      interval: 100,
    }
  },
  base: './', // Add this line to make asset paths relative
  plugins: [react()],
});
