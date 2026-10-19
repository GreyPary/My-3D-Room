
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/My-3D-Room/',
  plugins: [tailwindcss()],
})
