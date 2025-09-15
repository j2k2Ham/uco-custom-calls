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
    exclude: [
      '**/.next/**',
      '**/node_modules/**',
      'src/app/**',
      'src/types/**'
    ],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/__tests__/**',
        'src/**/*.test.{ts,tsx}',
        'src/app/**',
        'src/types/**',
        'src/hooks/cart.tsx',
        'src/hooks/useCart.tsx'
      ],
      // NOTE: Initial low thresholds while only cart hook is tested.
      // Increase progressively as component/page tests are added.
      thresholds: {
        // Raised after achieving near-100% statements/lines, high branches.
        // Leave minimal headroom for small untested additions.
        lines: 98,
        statements: 98,
        functions: 90,
        branches: 85
      }
    }
  }
});
