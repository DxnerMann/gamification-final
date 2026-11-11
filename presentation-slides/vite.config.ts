import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so GitHub project Pages and local `dist` both work.
export default defineConfig({
  plugins: [react()],
  base: './',
})
