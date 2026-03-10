import { defineConfig } from 'vitest/config'
import path from 'path'
import { config } from 'dotenv'

config()

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  test: {
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
