# Roadmap do ExpenseFlow

## Fase 0 - Base (concluida)
- [x] Projeto NestJS + Prisma + PostgreSQL
- [x] Schema inicial (User, Category, Transaction)
- [x] Telas iniciais no Next.js
- [x] Correcao de build do backend

## Fase 1 - MVP (em andamento)

Backend
- [x] Autenticacao: cadastro, login e guard de rotas (RF01, RF02)
- [x] Categorias: CRUD e categorias iniciais (RF07-RF10)
- [x] Movimentacoes: CRUD com isolamento por usuario (RF03-RF06)
- [x] Saldo (`/transactions/summary`) e exportacao CSV (RF11, RF12)

Frontend
- [x] Login e cadastro ligados a API
- [x] Area logada com menu, protecao de rotas e botao Sair
- [x] Categorias ligadas a API
- [x] Movimentacoes (lista, nova, editar, excluir, filtros e CSV) ligadas a API
- [ ] Dashboard ligado a API (RF11)

## Fase 2 - Qualidade
- [ ] Primeiro commit e fluxo de versionamento
- [ ] Testes automatizados das regras de negocio (backend)
- [ ] Mensagens de validacao da API em portugues
- [ ] Documentacao: API, DATABASE e ARCHITECTURE
- [ ] Revisao de seguranca: CORS restrito, shutdown do Prisma, credenciais fora do docker-compose

## Fase 3 - Pos-MVP
- Graficos e relatorios por periodo
- Outros formatos de exportacao
- Metas e movimentacoes recorrentes
