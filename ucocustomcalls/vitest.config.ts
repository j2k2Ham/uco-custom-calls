import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  esbuild: {
    jsx: 'automatic'
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    exclude: ['**/.next/**', '**/node_modules/**'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/__tests__/**',
        'src/**/*.test.{ts,tsx}',
        'src/app/**/route.{ts,tsx}',
        // legacy/duplicate experimental files
        'src/hooks/cart.tsx',
        'src/hooks/useCart.tsx'
      ],
      // NOTE: Initial low thresholds while only cart hook is tested.
      // Increase progressively as component/page tests are added.
      thresholds: {
        lines: 12,
        statements: 12,
        functions: 35,
        branches: 25
      }
    }
  }
});
