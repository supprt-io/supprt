import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import pkg from './package.json'

export default defineConfig({
  plugins: [preact()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    __WIDGET_VERSION__: JSON.stringify(pkg.version),
  },
  build: {
    lib: {
      entry: 'src/index.tsx',
      name: 'Supprt',
      fileName: (format) => format === 'iife' ? 'supprt.js' : 'supprt.esm.js',
      formats: ['iife', 'es'],
    },
    cssCodeSplit: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
      },
    },
    rollupOptions: {
      output: {
        exports: 'named',
        inlineDynamicImports: true,
        assetFileNames: 'supprt.[ext]',
      },
    },
  },
})
