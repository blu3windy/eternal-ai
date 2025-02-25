import { defineConfig } from 'vite'
import path from 'node:path'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'

export default defineConfig({
   plugins: [
      react(),
      electron({
         main: {
            entry: 'electron/main.ts',
            vite: {
               build: {
                  rollupOptions: {
                     external: ['keytar'], // ✅ Exclude keytar from bundling
                  },
               },
            },
         },
         preload: {
            input: path.join(__dirname, 'electron/preload.ts'),
            vite: {
               build: {
                  rollupOptions: {
                     external: ['keytar'], // ✅ Exclude keytar from bundling
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
      }
   }
})