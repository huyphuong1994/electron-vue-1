import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  devServer: {
    port: 4040,
  },
  server: {
    port: 4040,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000', // Thay đổi thành URL máy chủ Express của bạn
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  plugins: [
    vue(),
    electron([
      {
        entry: [
          'electron/main.js',
          'electron/server.js',
          'electron/api.js',
          'electron/responseUtils.js',
          'electron/telegram.js',
          'electron/webhook.js',
          'electron/database.js',
        ]
      },
      {
        entry: 'electron/preload.ts',
        onstart(options) {
          // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
          // instead of restarting the entire Electron App.
          options.reload()
        },
      },
    ]),
    renderer(),
  ],
})
