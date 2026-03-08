import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { cwd } from 'node:process'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, cwd(), '');

  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.AI_API_KEY || env.API_KEY || env.VITE_API_KEY || '')
    }
    // 已删除下方产生冗余和冲突的 proxy 配置
  }
}
                           )
