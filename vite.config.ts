import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    nodePolyfills({
      globals: { process: true }
    })
  ],
  define: {
    REACT_APP_SOCKET_URL: JSON.stringify(process.env.VITE_SOCKET_URL),
  },
  optimizeDeps: {
    exclude: ['vite-plugin-node-polyfills'],
  },
  server: {
    port: 3000,
  },
});