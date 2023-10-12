import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";


export default defineConfig({
  base: "./",
  server: {
    open: true
  },
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    }
  },
})

