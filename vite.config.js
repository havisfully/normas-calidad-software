import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
    // Use the repo subpath only for production builds (GitHub Pages).
    base: command === 'build' ? '/normas-calidad-software/' : '/',
    plugins: [react()],
}))