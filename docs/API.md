# API do ExpenseFlow

## Objetivo

A API faz a comunicação entre o frontend e o banco de dados do ExpenseFlow. Foi implementada em NestJS, com Prisma e PostgreSQL.

## Informações gerais

| Item | Valor |
|------|-------|
| URL local | `http://localhost:3001` |
| Formato | JSON (`Content-Type: application/json`), exceto a exportação, que devolve CSV |
| Autenticação | `Authorization: Bearer <token>` em todas as rotas, exceto `/auth/register` e `/auth/login` |
| Validade do token | 7 dias |
| Valores monetários | Números positivos com até 2 casas decimais, entre 0,01 e 99.999.999,99. Nas respostas, o campo `amount` vem como texto (ex.: `"250.5"`). |
| Datas | Enviadas como `AAAA-MM-DD`. Nas respostas, vem em ISO (ex.: `2026-10-05T00:00:00.000Z`). |

## Autenticação

### POST /auth/register

Cadastra um novo usuário. Ao criar a conta, o sistema cria as 5 categorias iniciais (Trabalho, Casa, Transporte, Alimentação, Outros) e já devolve o token, então o usuário fica logado.

Corpo:

| Campo | Regra |
|-------|-------|
| `name` | Texto, de 2 a 100 caracteres |
| `email` | E-mail válido. Guardado em minúsculas e único. |
| `password` | Texto, de 8 a 72 caracteres |

Resposta `201`:

```json
{
  "accessToken": "eyJhbGciOi...",
  "user": { "id": 1, "name": "Ana", "email": "ana@exemplo.com" }
}
```

Erros: `400` dados inválidos, `409` e-mail já cadastrado.

### POST /auth/login

Verifica e-mail e senha e devolve o token.

Corpo: `email` e `password`. Resposta `201`: igual a do cadastro.

Erros: `401` e-mail ou senha inválidos (a mensagem é a mesma nos dois casos, para não revelar se o e-mail existe).

### GET /auth/me

Devolve o usuário do token: `{ "id", "name", "email" }`. Usada pelo frontend para confirmar que a sessão ainda é válida.

Erros: `401` token ausente, inválido ou expirado.

## Categorias

Todas as rotas exigem token e trabalham apenas com as categorias do usuário autenticado.

### GET /categories

Lista as categorias, em ordem alfabética: `[{ "id", "name", "userId", "createdAt" }]`.

### POST /categories

Cria uma categoria.

Corpo: `name` (de 1 a 50 caracteres; espaços nas pontas são removidos).

Resposta `201`: a categoria criada. Erros: `400`, `409` já existe categoria com esse nome (maiúsculas e minúsculas são consideradas iguais).

### PATCH /categories/:id

Renomeia uma categoria. Corpo: `name`.

Erros: `400`, `404` categoria não encontrada (ou de outro usuário), `409` nome já usado.

### DELETE /categories/:id

Remove uma categoria.

| Situação | Resultado |
|----------|-----------|
| Categoria sem movimentações | Removida. Resposta `200`: `{ "deleted": true, "reassigned": 0 }` |
| Categoria em uso, sem `reassignTo` | `409`, nada é alterado |
| Categoria em uso, com `?reassignTo=<id>` | As movimentações passam para a categoria de destino e a categoria é removida, na mesma transação. Resposta `200`: `{ "deleted": true, "reassigned": <quantidade> }` |

Erros: `404` categoria (ou destino) não encontrada ou de outro usuário, `409` destino igual a origem.

## Movimentações

Todas as rotas exigem token e trabalham apenas com as movimentações do usuário autenticado.

Formato de uma movimentação:

```json
{
  "id": 7,
  "type": "EXPENSE",
  "description": "Mercado",
  "amount": "250.5",
  "date": "2026-10-06T00:00:00.000Z",
  "categoryId": 2,
  "category": { "id": 2, "name": "Casa" }
}
```

`type` é `INCOME` (entrada) ou `EXPENSE` (saída).

### GET /transactions

Lista as movimentações, da data mais recente para a mais antiga. Filtros opcionais, combináveis, na query string:

| Parâmetro | Descrição |
|-----------|-----------|
| `type` | `INCOME` ou `EXPENSE` |
| `categoryId` | Número da categoria |
| `from` | Data inicial (`AAAA-MM-DD`), inclusiva |
| `to` | Data final (`AAAA-MM-DD`), inclusiva |

### GET /transactions/:id

Devolve uma movimentação. Erro: `404` se não existir ou for de outro usuário.

### POST /transactions

Cadastra uma movimentação.

| Campo | Regra |
|-------|-------|
| `type` | `INCOME` ou `EXPENSE` |
| `description` | Texto, de 1 a 200 caracteres |
| `amount` | Maior que zero, até 2 casas decimais, máximo 99.999.999,99 |
| `date` | Data válida (`AAAA-MM-DD`) |
| `categoryId` | Categoria do próprio usuário |

Resposta `201`: a movimentação criada. Erros: `400`, `404` categoria não encontrada. O campo `userId` não é aceito: o dono é sempre o usuário do token.

### PATCH /transactions/:id

Edita uma movimentação. Todos os campos do cadastro são opcionais e só os enviados são alterados; as mesmas regras de validação valem.

Erros: `400`, `404` movimentação ou categoria não encontrada.

### DELETE /transactions/:id

Exclui uma movimentação. Resposta `200`: `{ "deleted": true }`. Erro: `404`.

## Resumo financeiro (dashboard)

### GET /transactions/summary

Calcula o saldo a partir das movimentações. Aceita os mesmos filtros de `GET /transactions`.

Resposta `200`:

```json
{ "income": "1000.00", "expense": "250.50", "balance": "749.50" }
```

`balance` é entradas menos saídas e pode ser negativo. O saldo não é armazenado: é sempre calculado.

Os gastos por categoria, mostrados no dashboard, não tem rota própria: o frontend soma as saídas de `GET /transactions?type=EXPENSE`.

## Exportação

### GET /transactions/export

Exporta as movimentações do usuário em CSV. Aceita os mesmos filtros de `GET /transactions`.

- Separador de colunas: ponto e vírgula (`;`), o padrão do Excel em português. Com vírgula, o Excel abriria tudo numa coluna só.
- Cabeçalho: `Data;Tipo;Descrição;Categoria;Valor`
- Data em `AAAA-MM-DD`, tipo em português (`Entrada` ou `Saída`) e valor com 2 casas e vírgula decimal (ex.: `1500,00`).
- Codificação UTF-8 com BOM, para o Excel abrir os acentos corretamente.
- Campos com ponto e vírgula ou aspas são escapados. Textos que começam com `=`, `+`, `-` ou `@` recebem um apostrofo na frente, para a planilha não executá-los como fórmula.
- Resposta com `Content-Disposition: attachment; filename="movimentacoes.csv"`.

Como a rota exige o token no header, o frontend baixa o arquivo com `fetch`, e não por um link direto.

## Segurança

- Todas as rotas de dados exigem usuário autenticado. Sem token, ou com token inválido ou expirado, a resposta é `401`.
- Cada usuário acessa apenas as próprias categorias e movimentações. Recursos de outro usuário respondem `404`, e não `403`, para não revelar que existem.
- Senhas são guardadas com hash (bcrypt) e nunca são devolvidas.
- A API recusa campos que não fazem parte do formato esperado (`400`).
- **CORS:** a API só aceita chamadas feitas pelo navegador a partir do endereço do frontend. Por padrão é `http://localhost:3000`. Em outro ambiente, defina `CORS_ORIGIN` no `.env` (vários endereços separados por vírgula).
- **Limite de tentativas:** por IP, a cada minuto, `POST /auth/login` e `POST /auth/register` aceitam no máximo 5 requisições, e as demais rotas, 120. Passou disso, a resposta é `429` com a mensagem "Muitas tentativas. Aguarde um minuto e tente novamente.". Os limites podem ser ajustados com `AUTH_THROTTLE_LIMIT` e `THROTTLE_LIMIT` no `.env`.

## Respostas de erro

Os erros seguem o formato padrão do NestJS:

```json
{ "message": "E-mail já cadastrado", "error": "Conflict", "statusCode": 409 }
```

Em erros de validação (`400`), `message` é uma lista com todos os problemas, em português:

```json
{
  "message": [
    "O campo nome deve ter no mínimo 2 caracteres",
    "Informe um e-mail válido"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

| Código | Significado |
|--------|-------------|
| `200` / `201` | Sucesso |
| `400` | Dados inválidos |
| `401` | Não autenticado, ou e-mail/senha incorretos |
| `404` | Recurso não encontrado (ou pertencente a outro usuário) |
| `409` | Conflito: e-mail ou nome de categoria repetido, ou categoria em uso |
| `429` | Muitas requisições em pouco tempo (limite de tentativas) |

## Diferenças em relação ao planejamento inicial

| Planejado | Implementado |
|-----------|--------------|
| `PUT /transactions/:id` e `PUT /categories/:id` | `PATCH`, pois a edição é parcial |
| `GET /dashboard` | `GET /transactions/summary` (totais). Os gastos por categoria são calculados no frontend. |
| Sem exclusão de categoria | `DELETE /categories/:id`, com `reassignTo` para categorias em uso |
| - | `GET /transactions/:id` e `GET /auth/me`, que as telas de edição e de sessão precisam |
