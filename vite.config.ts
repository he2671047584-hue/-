
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import vue from '@vitejs/plugin-vue'
import { cwd } from 'node:process'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, cwd(), '');

  return {
    plugins: [
      react(),
      vue() // 同时支持 Vue
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.AI_API_KEY || env.API_KEY || env.VITE_API_KEY || '')
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})
