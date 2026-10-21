# Requisitos do ExpenseFlow

## Objetivo

Aplicação web de controle financeiro pessoal: o usuário registra entradas e saídas, organiza por categorias, acompanha o saldo e exporta os dados.

## Requisitos funcionais

| ID | Requisito | Regras relacionadas |
|----|-----------|---------------------|
| RF01 | Cadastro de usuário com nome, e-mail e senha | RN04 |
| RF02 | Login e logout | RN11 |
| RF03 | Cadastrar movimentação (tipo, descrição, valor, data, categoria) | RN01, RN02, RN08, RN10 |
| RF04 | Listar movimentações do usuário, com filtros por categoria e período | RN03, RN08 |
| RF05 | Editar movimentação | RN08 |
| RF06 | Excluir movimentação | RN08 |
| RF07 | Criar categorias | RN07 |
| RF08 | Editar categorias | RN07 |
| RF09 | Remover categoria; se estiver em uso, mover as movimentações para outra categoria | RN05 |
| RF10 | Criar categorias iniciais no cadastro do usuário | RN06 |
| RF11 | Exibir saldo, total de entradas e total de saídas | RN09 |
| RF12 | Exportar movimentações em CSV, respeitando os filtros aplicados | RN12 |

## Requisitos não funcionais

| ID | Requisito |
|----|-----------|
| RNF01 | Senhas armazenadas apenas como hash (bcrypt) |
| RNF02 | Todas as rotas de dados exigem autenticação e filtram por usuário |
| RNF03 | Valores monetários em Decimal(10,2), sem ponto flutuante |
| RNF04 | Interface responsiva (desktop e celular) |
| RNF05 | Ambiente local via Docker (PostgreSQL) |
| RNF06 | CSV protegido contra injeção de fórmulas em planilhas |

## Fora do escopo do MVP

- Exportação em outros formatos (PDF, XLSX)
- Múltiplas moedas
- Orçamentos, metas e movimentações recorrentes
- Compartilhamento entre usuários

## Decisões tomadas

| Tema | Decisão |
|------|---------|
| Autenticação | JWT enviado no header `Authorization: Bearer <token>`, com validade de 7 dias. O frontend guarda o token no `localStorage`. |
| Categoria em uso (RN05) | A remoção exige `reassignTo` (categoria de destino). Sem ele a API responde 409. As movimentações são movidas e a categoria removida na mesma transação. |
| Remover categoria | Faz parte do MVP (RF09), embora a RN07 cite apenas criar e editar. |
| Tipo da movimentação | Enum `INCOME` / `EXPENSE` no banco. |
| Categorias iniciais (RN06) | Copiadas para cada usuário no cadastro. Os nomes são únicos por usuário, sem diferenciar maiúsculas de minúsculas. |
| Acesso a dados de outro usuário (RN03) | A API responde 404, e não 403, para não revelar que o registro existe. |
