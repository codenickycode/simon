import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    ssr: true,
    rollupOptions: {
      input: 'src/index.ts',
      output: {
        format: 'es',
        dir: 'dist',
        entryFileNames: 'index.js',
      },
    },
    minify: false,
  },
});
