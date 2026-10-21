# Roadmap do ExpenseFlow

## Fase 0 - Base (concluída)
- [x] Projeto NestJS + Prisma + PostgreSQL
- [x] Schema inicial (User, Category, Transaction)
- [x] Telas iniciais no Next.js
- [x] Correção de build do backend

## Fase 1 - MVP (concluída)

Backend
- [x] Autenticação: cadastro, login e guard de rotas (RF01, RF02)
- [x] Categorias: CRUD e categorias iniciais (RF07-RF10)
- [x] Movimentações: CRUD com isolamento por usuário (RF03-RF06)
- [x] Saldo (`/transactions/summary`) e exportação CSV (RF11, RF12)

Frontend
- [x] Login e cadastro ligados à API
- [x] Área logada com menu, proteção de rotas e botão Sair
- [x] Categorias ligadas à API
- [x] Movimentações (lista, nova, editar, excluir, filtros e CSV) ligadas à API
- [x] Dashboard ligado à API (RF11)

## Fase 2 - Qualidade (concluída)
- [x] Versionamento com git e repositório no GitHub
- [x] Testes automatizados das regras de negócio (backend, banco de testes separado)
- [x] Mensagens de validação da API em português
- [x] Documentação: API, banco de dados, telas e requisitos
- [x] Segurança: CORS restrito ao frontend, limite de tentativas de login e fechamento da conexão do Prisma

## Fase 3 - Apresentação (em andamento)
- [x] Textos em português com acentuação
- [x] Identidade visual: logo, paleta, ícones SVG e ícone da aba
- [x] Interações: avisos de ação, valores animados, barras por categoria, medidor de senha
- [x] Layout responsivo
- [x] README do repositório, com prints e decisões técnicas
- [ ] Deploy (frontend, backend e banco) com link de demonstração
- [ ] Conta de demonstração com dados de exemplo
- [ ] Integração contínua (testes rodando a cada envio ao GitHub)
- [ ] Senha própria para o banco de produção, fora do `docker-compose.yml` de desenvolvimento

## Fase 4 - Pós-MVP
- Gráficos e relatórios por período
- Outros formatos de exportação
- Metas e movimentações recorrentes
- Recuperação de senha
