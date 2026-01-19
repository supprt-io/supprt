import { defineConfig, type Plugin } from 'vite'
import preact from '@preact/preset-vite'
import pkg from './package.json'

// Plugin to remove @__PURE__ annotations that cause Rollup warnings for consumers
function removePureAnnotations(): Plugin {
  return {
    name: 'remove-pure-annotations',
    generateBundle(_, bundle) {
      for (const fileName of Object.keys(bundle)) {
        const chunk = bundle[fileName]
        if (chunk.type === 'chunk') {
          chunk.code = chunk.code.replace(/\/\*\s*@__PURE__\s*\*\//g, '')
        }
      }
    },
  }
}

export default defineConfig({
  plugins: [preact()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    __WIDGET_VERSION__: JSON.stringify(pkg.version),
  },
  esbuild: {
    legalComments: 'none',
  },
  build: {
    target: 'esnext',
    lib: {
      entry: 'src/index.tsx',
      name: 'Supprt',
      fileName: (format) => format === 'iife' ? 'supprt.js' : 'supprt.esm.js',
      formats: ['iife', 'es'],
    },
    cssCodeSplit: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        exports: 'named',
        inlineDynamicImports: true,
        assetFileNames: 'supprt.[ext]',
      },
      plugins: [removePureAnnotations()],
    },
  },
})
