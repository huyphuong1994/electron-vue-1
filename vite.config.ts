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
        // Main-Process entry file of the Electron App.
        entry: 'electron/main.js',
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
