# API do ExpenseFlow

## Objetivo

A API faz a comunicacao entre o frontend e o banco de dados do ExpenseFlow. Foi implementada em NestJS, com Prisma e PostgreSQL.

## Informacoes gerais

| Item | Valor |
|------|-------|
| URL local | `http://localhost:3001` |
| Formato | JSON (`Content-Type: application/json`), exceto a exportacao, que devolve CSV |
| Autenticacao | `Authorization: Bearer <token>` em todas as rotas, exceto `/auth/register` e `/auth/login` |
| Validade do token | 7 dias |
| Valores monetarios | Numeros positivos com ate 2 casas decimais, entre 0,01 e 99.999.999,99. Nas respostas, o campo `amount` vem como texto (ex.: `"250.5"`). |
| Datas | Enviadas como `AAAA-MM-DD`. Nas respostas, vem em ISO (ex.: `2026-10-05T00:00:00.000Z`). |

## Autenticacao

### POST /auth/register

Cadastra um novo usuario. Ao criar a conta, o sistema cria as 5 categorias iniciais (Trabalho, Casa, Transporte, Alimentacao, Outros) e ja devolve o token, entao o usuario fica logado.

Corpo:

| Campo | Regra |
|-------|-------|
| `name` | Texto, de 2 a 100 caracteres |
| `email` | E-mail valido. Guardado em minusculas e unico. |
| `password` | Texto, de 8 a 72 caracteres |

Resposta `201`:

```json
{
  "accessToken": "eyJhbGciOi...",
  "user": { "id": 1, "name": "Ana", "email": "ana@exemplo.com" }
}
```

Erros: `400` dados invalidos, `409` e-mail ja cadastrado.

### POST /auth/login

Verifica e-mail e senha e devolve o token.

Corpo: `email` e `password`. Resposta `201`: igual a do cadastro.

Erros: `401` e-mail ou senha invalidos (a mensagem e a mesma nos dois casos, para nao revelar se o e-mail existe).

### GET /auth/me

Devolve o usuario do token: `{ "id", "name", "email" }`. Usada pelo frontend para confirmar que a sessao ainda e valida.

Erros: `401` token ausente, invalido ou expirado.

## Categorias

Todas as rotas exigem token e trabalham apenas com as categorias do usuario autenticado.

### GET /categories

Lista as categorias, em ordem alfabetica: `[{ "id", "name", "userId", "createdAt" }]`.

### POST /categories

Cria uma categoria.

Corpo: `name` (de 1 a 50 caracteres; espacos nas pontas sao removidos).

Resposta `201`: a categoria criada. Erros: `400`, `409` ja existe categoria com esse nome (maiusculas e minusculas sao consideradas iguais).

### PATCH /categories/:id

Renomeia uma categoria. Corpo: `name`.

Erros: `400`, `404` categoria nao encontrada (ou de outro usuario), `409` nome ja usado.

### DELETE /categories/:id

Remove uma categoria.

| Situacao | Resultado |
|----------|-----------|
| Categoria sem movimentacoes | Removida. Resposta `200`: `{ "deleted": true, "reassigned": 0 }` |
| Categoria em uso, sem `reassignTo` | `409`, nada e alterado |
| Categoria em uso, com `?reassignTo=<id>` | As movimentacoes passam para a categoria de destino e a categoria e removida, na mesma transacao. Resposta `200`: `{ "deleted": true, "reassigned": <quantidade> }` |

Erros: `404` categoria (ou destino) nao encontrada ou de outro usuario, `409` destino igual a origem.

## Movimentacoes

Todas as rotas exigem token e trabalham apenas com as movimentacoes do usuario autenticado.

Formato de uma movimentacao:

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

`type` e `INCOME` (entrada) ou `EXPENSE` (saida).

### GET /transactions

Lista as movimentacoes, da data mais recente para a mais antiga. Filtros opcionais, combinaveis, na query string:

| Parametro | Descricao |
|-----------|-----------|
| `type` | `INCOME` ou `EXPENSE` |
| `categoryId` | Numero da categoria |
| `from` | Data inicial (`AAAA-MM-DD`), inclusiva |
| `to` | Data final (`AAAA-MM-DD`), inclusiva |

### GET /transactions/:id

Devolve uma movimentacao. Erro: `404` se nao existir ou for de outro usuario.

### POST /transactions

Cadastra uma movimentacao.

| Campo | Regra |
|-------|-------|
| `type` | `INCOME` ou `EXPENSE` |
| `description` | Texto, de 1 a 200 caracteres |
| `amount` | Maior que zero, ate 2 casas decimais, maximo 99.999.999,99 |
| `date` | Data valida (`AAAA-MM-DD`) |
| `categoryId` | Categoria do proprio usuario |

Resposta `201`: a movimentacao criada. Erros: `400`, `404` categoria nao encontrada. O campo `userId` nao e aceito: o dono e sempre o usuario do token.

### PATCH /transactions/:id

Edita uma movimentacao. Todos os campos do cadastro sao opcionais e so os enviados sao alterados; as mesmas regras de validacao valem.

Erros: `400`, `404` movimentacao ou categoria nao encontrada.

### DELETE /transactions/:id

Exclui uma movimentacao. Resposta `200`: `{ "deleted": true }`. Erro: `404`.

## Resumo financeiro (dashboard)

### GET /transactions/summary

Calcula o saldo a partir das movimentacoes. Aceita os mesmos filtros de `GET /transactions`.

Resposta `200`:

```json
{ "income": "1000.00", "expense": "250.50", "balance": "749.50" }
```

`balance` e entradas menos saidas e pode ser negativo. O saldo nao e armazenado: e sempre calculado.

Os gastos por categoria, mostrados no dashboard, nao tem rota propria: o frontend soma as saidas de `GET /transactions?type=EXPENSE`.

## Exportacao

### GET /transactions/export

Exporta as movimentacoes do usuario em CSV. Aceita os mesmos filtros de `GET /transactions`.

- Separador de colunas: ponto e virgula (`;`), o padrao do Excel em portugues. Com virgula, o Excel abriria tudo numa coluna so.
- Cabecalho: `Data;Tipo;Descricao;Categoria;Valor`
- Data em `AAAA-MM-DD`, tipo em portugues (`Entrada` ou `Saida`) e valor com 2 casas e virgula decimal (ex.: `1500,00`).
- Codificacao UTF-8 com BOM, para o Excel abrir os acentos corretamente.
- Campos com ponto e virgula ou aspas sao escapados. Textos que comecam com `=`, `+`, `-` ou `@` recebem um apostrofo na frente, para a planilha nao executa-los como formula.
- Resposta com `Content-Disposition: attachment; filename="movimentacoes.csv"`.

Como a rota exige o token no header, o frontend baixa o arquivo com `fetch`, e nao por um link direto.

## Seguranca

- Todas as rotas de dados exigem usuario autenticado. Sem token, ou com token invalido ou expirado, a resposta e `401`.
- Cada usuario acessa apenas as proprias categorias e movimentacoes. Recursos de outro usuario respondem `404`, e nao `403`, para nao revelar que existem.
- Senhas sao guardadas com hash (bcrypt) e nunca sao devolvidas.
- A API recusa campos que nao fazem parte do formato esperado (`400`).
- **CORS:** a API so aceita chamadas feitas pelo navegador a partir do endereco do frontend. Por padrao e `http://localhost:3000`. Em outro ambiente, defina `CORS_ORIGIN` no `.env` (varios enderecos separados por virgula).
- **Limite de tentativas:** por IP, a cada minuto, `POST /auth/login` e `POST /auth/register` aceitam no maximo 5 requisicoes, e as demais rotas, 120. Passou disso, a resposta e `429` com a mensagem "Muitas tentativas. Aguarde um minuto e tente novamente.". Os limites podem ser ajustados com `AUTH_THROTTLE_LIMIT` e `THROTTLE_LIMIT` no `.env`.

## Respostas de erro

Os erros seguem o formato padrao do NestJS:

```json
{ "message": "E-mail ja cadastrado", "error": "Conflict", "statusCode": 409 }
```

Em erros de validacao (`400`), `message` e uma lista com todos os problemas, em portugues:

```json
{
  "message": [
    "O campo nome deve ter no minimo 2 caracteres",
    "Informe um e-mail valido"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

| Codigo | Significado |
|--------|-------------|
| `200` / `201` | Sucesso |
| `400` | Dados invalidos |
| `401` | Nao autenticado, ou e-mail/senha incorretos |
| `404` | Recurso nao encontrado (ou pertencente a outro usuario) |
| `409` | Conflito: e-mail ou nome de categoria repetido, ou categoria em uso |
| `429` | Muitas requisicoes em pouco tempo (limite de tentativas) |

## Diferencas em relacao ao planejamento inicial

| Planejado | Implementado |
|-----------|--------------|
| `PUT /transactions/:id` e `PUT /categories/:id` | `PATCH`, pois a edicao e parcial |
| `GET /dashboard` | `GET /transactions/summary` (totais). Os gastos por categoria sao calculados no frontend. |
| Sem exclusao de categoria | `DELETE /categories/:id`, com `reassignTo` para categorias em uso |
| - | `GET /transactions/:id` e `GET /auth/me`, que as telas de edicao e de sessao precisam |
