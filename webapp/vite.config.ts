import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // amazon-cognito-identity-js pulls in the Node `buffer` package, which
    // references the Node-only `global`; map it to the browser equivalent.
    global: 'globalThis',
  },
})
