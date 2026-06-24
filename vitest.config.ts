import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // Exclure les tests Angular (TestBed / ComponentFixture)
    // qui nécessitent @analogjs/vitest-angular non installé.
    // Ces fichiers sont identifiables car ils importent @angular/core/testing.
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      // Tests Angular qui utilisent TestBed/ComponentFixture
      // (nécessitent @analogjs/vitest-angular non installé)
      'src/app/components/**/*.spec.ts',
      'src/app/map/**/*.spec.ts',
      'src/app/services/cities-api.service.spec.ts',
      'src/app/services/city-search.service.spec.ts',
    ],
    include: [
      // Services et utils Angular (logique pure, pas de DOM)
      'src/app/**/*.spec.ts',
      // Backend (Vitest déjà utilisé)
      'backend/src/**/*.spec.ts',
    ],
  },
  resolve: {
    alias: {
      '@core': resolve(__dirname, 'src/app/core'),
    },
  },
});
