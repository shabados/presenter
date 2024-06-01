import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig( {
  plugins: [
    tsconfigPaths(),
    TanStackRouterVite(),
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
    clearMocks: true,
    globals: true,
  },
} )
