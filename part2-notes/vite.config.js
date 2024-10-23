/* eslint-disable linebreak-style */
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
console.log('Loaded vitest config')
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,  // 可以设置开发服务器的端口
  },
  build: {
    outDir: 'build', // 构建输出的目录
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './testSetup.js',
  }
})
