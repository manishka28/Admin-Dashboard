import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['d3-shape', '@nivo/pie', '@nivo/core', '@nivo/arcs'],
},
})
