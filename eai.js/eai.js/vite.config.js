import {defineConfig} from 'vite';

export default defineConfig({
    server: {
        port: 3005,
    },
    build: {
        rollupOptions: {
            output: {
                entryFileNames: 'index.js', // Set output file name to index.js
                chunkFileNames: '[name].js',
                assetFileNames: '[name][ext]',
            },
        },
    },
});