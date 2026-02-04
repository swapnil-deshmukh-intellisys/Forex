import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    css: true,
    testTimeout: 10000,
    hookTimeout: 10000,
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: [
      'node_modules',
      'dist',
      '.idea',
      '.git',
      '.cache',
      'coverage',
      'src/tests/f2p/integration.f2p.test.jsx',
      'src/tests/f2p/trading.f2p.test.jsx',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.config.js',
        '**/*.config.ts',
        '**/dist/',
        '**/build/',
        '**/coverage/',
        '**/*.d.ts',
        '**/main.jsx',
        '**/index.js',
      ],
      thresholds: {
        lines: 45,
        functions: 27,
        branches: 60,
        statements: 45,
      },
    },
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
      },
    },
    maxConcurrency: 5,
    minThreads: 1,
    maxThreads: 4,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});

