import { execSync } from 'node:child_process';

// Roda uma vez antes dos testes: aplica as migracoes no banco de teste.
export default function setup() {
  const url = process.env.DATABASE_URL ?? '';
  if (!/\/[^/?]*_test(\?|$)/.test(url)) {
    throw new Error(
      'Os testes e2e so podem rodar em um banco cujo nome termina com _test',
    );
  }
  execSync('npx prisma migrate deploy', {
    stdio: 'pipe',
    env: process.env,
  });
}
