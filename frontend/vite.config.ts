import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {viteEnvs} from 'vite-envs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteEnvs({declarationFile: ".env"}),
  ],
  server: {
    port: 3030,
    host: "0.0.0.0",
  },
})
