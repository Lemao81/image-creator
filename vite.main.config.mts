import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      external: ['sharp'],
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
})
