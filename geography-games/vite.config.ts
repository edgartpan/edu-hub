import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  optimizeDeps: {
    include: ['react-simple-maps', 'prop-types']
  },
  resolve: {
    alias: {
      'react-simple-maps': 'react-simple-maps/dist/index.es.js'
    }
  },
  build: {
    commonjsOptions: {
      include: [/react-simple-maps/, /node_modules/]
    }
  }
})
