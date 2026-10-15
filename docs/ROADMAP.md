# Roadmap do ExpenseFlow

> Rascunho. Ajustar prazos e prioridades.

## Fase 0 - Base (em andamento)
- [x] Projeto NestJS + Prisma + PostgreSQL
- [x] Schema inicial (User, Category, Transaction)
- [x] Telas iniciais no Next.js
- [x] Correcao de build do backend
- [ ] Documentacao completa (API, DATABASE, ARCHITECTURE)

## Fase 1 - MVP
1. **Autenticacao:** cadastro, login, guard de rotas (RF01, RF02)
2. **Categorias:** CRUD e categorias iniciais (RF07-RF10)
3. **Movimentacoes:** CRUD com isolamento por usuario (RF03-RF06)
4. **Saldo e dashboard** (RF11)
5. **Exportacao CSV** (RF12)
6. **Integracao frontend-backend** de todas as telas

## Fase 2 - Qualidade
- Testes unitarios e e2e das regras de negocio
- Validacao de entrada (DTOs)
- Tratamento de erros e mensagens na interface

## Fase 3 - Pos-MVP
- Filtros por periodo e categoria, graficos
- Outros formatos de exportacao
- Metas e movimentacoes recorrentes
