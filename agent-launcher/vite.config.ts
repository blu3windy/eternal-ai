import { defineConfig } from 'vite'
import path from 'node:path'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
   plugins: [
      react(),
      visualizer({open: true}),
      electron({
         main: {
            entry: 'electron/main.ts',
            vite: {
               build: {
                  rollupOptions: {
                     external: ['keytar', 'dockerode'], // ✅ Exclude from bundling
                  },
               },
            },
         },
         preload: {
            input: path.join(__dirname, 'electron/preload.ts'),
            vite: {
               build: {
                  rollupOptions: {
                     external: ['keytar', 'dockerode'], // ✅ Exclude from bundling
                  },
                  
               },
            },
         },
         renderer: process.env.NODE_ENV === 'test' ? undefined : {},
      }),
   ],
   resolve: {
      alias: {
         '@components': path.resolve(__dirname, 'src/components'),
         '@constants': path.resolve(__dirname, 'src/constants'),
         '@hooks': path.resolve(__dirname, 'src/hooks'),
         '@styles': path.resolve(__dirname, 'src/styles'),
         '@pages': path.resolve(__dirname, 'src/pages'),
         "@utils": path.resolve(__dirname, 'src/utils'),
         '@interfaces': path.resolve(__dirname, 'src/interfaces'),
         "@helpers": path.resolve(__dirname, 'src/helpers'),
         "@contract": path.resolve(__dirname, 'src/contract'),
         "@stores": path.resolve(__dirname, 'src/stores'),
         "@services": path.resolve(__dirname, 'src/services'),
         "@providers": path.resolve(__dirname, 'src/providers'),
         "@storage": path.resolve(__dirname, 'src/storage'),
      }
   },
   build: {
      minify: 'esbuild', // ✅ Use esbuild for fast minification
      rollupOptions: {
         output: {
            manualChunks(id) {
               if (id.includes('node_modules')) {
                  if (id.includes('ethers')) return 'ethers';
                  if (id.includes('moment')) return 'moment';
                  if (id.includes('axios')) return 'axios';
                  if (id.includes('bignumber.js')) return 'bignumber.js';
                  if (id.includes('crypto-js')) return 'crypto-js';
                  return 'vendor';
               }
            },
         }
      },
   },
   esbuild: {
      drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [], // ✅ Drop console logs in production only
   }
})