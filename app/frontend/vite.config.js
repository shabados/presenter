import { defineConfig, transformWithEsbuild } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig( {
  plugins: [
    {
      name: 'treat-js-as-jsx',
      async transform( code, id ) {
        if ( !id.match( /src\/.*\.js$/ ) ) return null
        return transformWithEsbuild( code, id, { loader: 'jsx' } )
      },
    },
    react(),
  ],
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'build',
  },
} )
