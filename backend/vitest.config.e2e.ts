import { config } from 'dotenv';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

// Os testes usam um banco separado (<banco>_test), nunca o de desenvolvimento.
config({ quiet: true });
const devUrl = process.env.DATABASE_URL ?? '';
const testUrl = devUrl.replace(/\/([^/?]+)(\?|$)/, '/$1_test$2');
// Tambem no processo principal, para o globalSetup (migracoes) enxergar
process.env.DATABASE_URL = testUrl;

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    globalSetup: ['./test/global-setup.ts'],
    // Todos os arquivos compartilham o mesmo banco: nada de paralelismo
    fileParallelism: false,
    env: {
      DATABASE_URL: testUrl,
      JWT_SECRET: 'segredo-apenas-para-testes',
    },
  },
});
