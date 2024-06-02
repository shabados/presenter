import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig( {
  plugins: [ tsconfigPaths(), react() ],
  test: {
    environment: 'happy-dom',
    setupFiles: [ 'tests/setupTests.ts' ],
    clearMocks: true,
  },
} )
