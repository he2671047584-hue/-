
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { cwd } from 'node:process'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载当前目录下的环境变量文件 (.env)
  // 第三个参数 '' 表示加载所有变量，不仅仅是 VITE_ 开头的
  // Use imported cwd() to avoid typing errors with global process
  const env = loadEnv(mode, cwd(), '');

  return {
    plugins: [react()],
    // 定义全局常量，模拟 process.env 行为，解决浏览器环境报错问题
    define: {
      'process.env.API_KEY': JSON.stringify(env.AI_API_KEY || env.API_KEY || env.VITE_API_KEY || '')
    },
    server: {
      proxy: {
        // 代理配置：当你访问 /api 时，转发到你本地运行的后端程序(3000端口)
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})
