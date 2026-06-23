import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: {
    conditions: ['node']
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
})
