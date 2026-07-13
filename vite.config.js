import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fork } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  if (command === 'serve') {
    console.log("Starting backend Node.js Express server on port 8080...");
    try {
      fork(path.resolve(__dirname, 'server.js'), [], {
        env: { ...process.env, PORT: '8080' }
      });
    } catch (err) {
      console.error("Failed to spawn backend server:", err.message);
    }
  }

  return {
    plugins: [react()],
    build: {
      outDir: 'build'
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        }
      }
    }
  }
})

