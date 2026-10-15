# Requisitos do ExpenseFlow

## Objetivo

Aplicacao web de controle financeiro pessoal: o usuario registra entradas e saidas, organiza por categorias, acompanha o saldo e exporta os dados.

## Requisitos funcionais

| ID | Requisito | Regras relacionadas |
|----|-----------|---------------------|
| RF01 | Cadastro de usuario com nome, e-mail e senha | RN04 |
| RF02 | Login e logout | RN11 |
| RF03 | Cadastrar movimentacao (tipo, descricao, valor, data, categoria) | RN01, RN02, RN08, RN10 |
| RF04 | Listar movimentacoes do usuario, com filtros por categoria e periodo | RN03, RN08 |
| RF05 | Editar movimentacao | RN08 |
| RF06 | Excluir movimentacao | RN08 |
| RF07 | Criar categorias | RN07 |
| RF08 | Editar categorias | RN07 |
| RF09 | Remover categoria; se estiver em uso, mover as movimentacoes para outra categoria | RN05 |
| RF10 | Criar categorias iniciais no cadastro do usuario | RN06 |
| RF11 | Exibir saldo, total de entradas e total de saidas | RN09 |
| RF12 | Exportar movimentacoes em CSV, respeitando os filtros aplicados | RN12 |

## Requisitos nao funcionais

| ID | Requisito |
|----|-----------|
| RNF01 | Senhas armazenadas apenas como hash (bcrypt) |
| RNF02 | Todas as rotas de dados exigem autenticacao e filtram por usuario |
| RNF03 | Valores monetarios em Decimal(10,2), sem ponto flutuante |
| RNF04 | Interface responsiva (desktop e celular) |
| RNF05 | Ambiente local via Docker (PostgreSQL) |
| RNF06 | CSV protegido contra injecao de formulas em planilhas |

## Fora do escopo do MVP

- Exportacao em outros formatos (PDF, XLSX)
- Multiplas moedas
- Orcamentos, metas e movimentacoes recorrentes
- Compartilhamento entre usuarios

## Decisoes tomadas

| Tema | Decisao |
|------|---------|
| Autenticacao | JWT enviado no header `Authorization: Bearer <token>`, com validade de 7 dias. O frontend guarda o token no `localStorage`. |
| Categoria em uso (RN05) | A remocao exige `reassignTo` (categoria de destino). Sem ele a API responde 409. As movimentacoes sao movidas e a categoria removida na mesma transacao. |
| Remover categoria | Faz parte do MVP (RF09), embora a RN07 cite apenas criar e editar. |
| Tipo da movimentacao | Enum `INCOME` / `EXPENSE` no banco. |
| Categorias iniciais (RN06) | Copiadas para cada usuario no cadastro. Os nomes sao unicos por usuario, sem diferenciar maiusculas de minusculas. |
| Acesso a dados de outro usuario (RN03) | A API responde 404, e nao 403, para nao revelar que o registro existe. |
