import { defineConfig } from 'astro/config'
import netlify from '@astrojs/netlify'
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: netlify(),
  server: {
    port: 3000
  },
  vite: {
    plugins: [tailwindcss()]
  }
})
