import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const isTest = process.env.NODE_ENV === 'test'

export default defineConfig( {
  plugins: [
    tsconfigPaths(),
    !isTest && TanStackRouterVite(),
    react(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:42425',
        ws: true,
      },
    },
  },
  test: {
    environment: 'happy-dom',
    setupFiles: [ 'tests/setupTests.ts' ],
    restoreMocks: true,
  },
} )
