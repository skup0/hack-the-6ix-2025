import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/hack-the-6ix-2025/', // Set base for GitHub Pages
  plugins: [react()],
});
