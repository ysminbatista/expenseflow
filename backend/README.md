# ExpenseFlow: backend

API em NestJS, com Prisma e PostgreSQL. A visão geral do projeto, como rodar tudo e as decisões técnicas estão no [README da raiz](../README.md).

## Comandos

```bash
npm run start:dev   # servidor com recarga automática (porta 3001)
npm run build       # compila para dist/
npm run test:e2e    # testes de integração (usa o banco <nome>_test)
npm run lint        # análise estática (oxlint)
```

## Configuração

Copie `.env.example` para `.env`. As variáveis estão explicadas dentro do próprio arquivo.

## Mais detalhes

- [Rotas da API](../docs/API.md)
- [Banco de dados](../docs/DATABASE.md)
