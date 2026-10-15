# Requisitos do ExpenseFlow

> Rascunho gerado a partir de BUSINESS_RULES.md, do schema do banco e das telas existentes. Revisar antes de adotar.

## Objetivo

Aplicacao web de controle financeiro pessoal: o usuario registra entradas e saidas, organiza por categorias, acompanha o saldo e exporta os dados.

## Requisitos funcionais

| ID | Requisito | Regras relacionadas |
|----|-----------|---------------------|
| RF01 | Cadastro de usuario com nome, e-mail e senha | RN04 |
| RF02 | Login e logout | RN11 |
| RF03 | Cadastrar movimentacao (tipo, descricao, valor, data, categoria) | RN01, RN02, RN08, RN10 |
| RF04 | Listar movimentacoes do usuario | RN03, RN08 |
| RF05 | Editar movimentacao | RN08 |
| RF06 | Excluir movimentacao | RN08 |
| RF07 | Criar categorias | RN07 |
| RF08 | Editar categorias | RN07 |
| RF09 | Remover categoria tratando movimentacoes vinculadas | RN05 |
| RF10 | Criar categorias iniciais no cadastro do usuario | RN06 |
| RF11 | Exibir saldo, total de entradas e total de saidas | RN09 |
| RF12 | Exportar movimentacoes em CSV | RN12 |

## Requisitos nao funcionais

| ID | Requisito |
|----|-----------|
| RNF01 | Senhas armazenadas apenas como hash |
| RNF02 | Todas as rotas de dados exigem autenticacao e filtram por usuario |
| RNF03 | Valores monetarios em Decimal(10,2), sem ponto flutuante |
| RNF04 | Interface responsiva (desktop e celular) |
| RNF05 | Ambiente local via Docker (PostgreSQL) |

## Fora do escopo do MVP

- Exportacao em outros formatos (PDF, XLSX)
- Multiplas moedas
- Orcamentos, metas e movimentacoes recorrentes
- Compartilhamento entre usuarios

## Decisoes em aberto

1. Tratamento de categoria em uso (RN05): reatribuir a "Outros", pedir nova categoria ou bloquear exclusao.
2. Estrategia de autenticacao: JWT ou sessao por cookie.
3. Campo `type` deve virar enum (INCOME/EXPENSE) no banco.
4. Excluir categoria faz parte do MVP? (RN07 cita apenas criar e editar.)
