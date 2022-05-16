import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ManifestOptions, VitePWA, VitePWAOptions } from 'vite-plugin-pwa'
import replace from '@rollup/plugin-replace'

const pwaOptions: Partial<VitePWAOptions> = {
  mode: 'development',
  base: 'src',
  includeAssets: ['favicon.svg'],
  manifest: {
    name: 'Pomobara',
    short_name: 'Pomobara',
    theme_color: '#ffffff',
    icons: [
      {
        src: 'capybara-pomo.png', // <== don't add slash, for testing
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/capybara-pomo.png', // <== don't remove slash, for testing
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: 'capybara-pomo.png', // <== don't add slash, for testing
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  },
  devOptions: {
    enabled: true,
  }
}


const replaceOptions = { __DATE__: new Date().toISOString() }
const claims = process.env.CLAIMS === 'true'
const reload = process.env.RELOAD_SW === 'true'

if (process.env.SW === 'true') {
  pwaOptions.srcDir = 'src'
  pwaOptions.filename = claims ? 'claims-sw.ts' : 'prompt-sw.ts'
  pwaOptions.strategies = 'injectManifest';
  (pwaOptions.manifest as Partial<ManifestOptions>).name = 'PWA Inject Manifest';
  (pwaOptions.manifest as Partial<ManifestOptions>).short_name = 'PWA Inject'
}

// pwaOptions.srcDir = 'src'
// pwaOptions.filename = 'prompt-sw.ts'
// pwaOptions.strategies = 'injectManifest';

if (claims)
  pwaOptions.registerType = 'autoUpdate'

if (reload) {
  // @ts-ignore
  replaceOptions.__RELOAD_SW__ = 'true'
}

// VitePWA(pwaOptions), 
// https://vitejs.dev/config/
export default defineConfig({
  envPrefix: ['VITE_', 'FIREBASE_'],
  plugins: [react(), replace({ replaceOptions, preventAssignment: true })],
  optimizeDeps: {
    entries: ['./src/app.tsx']
  },
  build: {
    sourcemap: true
  }
})

// 
