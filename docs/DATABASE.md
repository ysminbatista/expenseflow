# Banco de Dados do ExpenseFlow

## Objetivo

O banco de dados é responsável por armazenar as informações dos usuários, categorias e movimentações financeiras do ExpenseFlow.

O banco é o PostgreSQL, acessado pelo Prisma. A fonte da verdade da estrutura é o arquivo `backend/prisma/schema.prisma`, e cada alteração gera uma migração em `backend/prisma/migrations`.

## Tabelas

O banco de dados é composto pelas seguintes tabelas:

User

Category

Transaction

Os nomes das tabelas e das colunas seguem o padrão do Prisma: tabelas no singular e colunas em camelCase (por exemplo `passwordHash` e `userId`).

## Tabela User

A tabela User é responsável por armazenar os dados dos usuários.

### Campos

id

Identificador único do usuário (número sequencial).

name

Nome do usuário.

email

Endereço de e-mail do usuário. Único. A API o guarda em minúsculas.

passwordHash

Hash da senha (bcrypt). A senha em si nunca é armazenada.

createdAt

Data de criação da conta.

## Tabela Category

A tabela Category é responsável por armazenar as categorias utilizadas nas movimentações.

### Campos

id

Identificador único da categoria.

name

Nome da categoria.

userId

Identificador do usuário que possui a categoria.

createdAt

Data de criação da categoria.

## Tabela Transaction

A tabela Transaction é responsável por armazenar as movimentações financeiras.

### Campos

id
Identificador único da movimentação.

type
Tipo da movimentação. Enum `TransactionType`: `INCOME` (entrada) ou `EXPENSE` (saída).

description
Descrição da movimentação.

amount
Valor da movimentação. Tipo `DECIMAL(10,2)`, sem ponto flutuante, com no máximo 99.999.999,99.

date
Data da movimentação.

categoryId
Identificador da categoria utilizada na movimentação.

userId
Identificador do usuário que possui a movimentação.

createdAt
Data de criação da movimentação.

updatedAt
Data da última atualização da movimentação.

## Relacionamentos

Um usuário pode possuir várias categorias.

Um usuário pode possuir várias movimentações.

Uma categoria pode estar relacionada a várias movimentações.

Cada movimentação pertence a um usuário.

Cada movimentação pertence a uma categoria.

## Relacionamento entre User e Category

A tabela Category possui o campo userId para identificar qual usuário criou e possui aquela categoria.

Um usuário pode possuir várias categorias.

Ao excluir um usuário, as categorias dele são excluídas junto (`ON DELETE CASCADE`).

## Relacionamento entre User e Transaction

A tabela Transaction possui o campo userId para identificar qual usuário possui aquela movimentação.

Um usuário pode possuir várias movimentações.

Ao excluir um usuário, as movimentações dele são excluídas junto (`ON DELETE CASCADE`).

## Relacionamento entre Category e Transaction

A tabela Transaction possui o campo categoryId para identificar a categoria da movimentação.

Uma categoria pode ser utilizada em várias movimentações.

O banco impede a exclusão de uma categoria que tenha movimentações (`ON DELETE RESTRICT`). Por isso a API, antes de excluir uma categoria em uso, move as movimentações para outra categoria (veja `reassignTo` em `API.md`).

## Regras do Banco de Dados

Cada usuário deve possuir um id único.

Cada categoria deve possuir um id único.

Cada movimentação deve possuir um id único.

O email do usuário deve ser único (índice único em `email`).

O nome da categoria deve ser único por usuário (índice único em `userId` + `name`). Dois usuários podem ter categorias com o mesmo nome.

O tipo da movimentação deve ser entrada ou saída (garantido pelo enum `TransactionType`).

Toda movimentação deve estar relacionada a um usuário.

Toda movimentação deve estar relacionada a uma categoria.

O valor da movimentação deve ser positivo. Essa regra é garantida pela API (validação e testes automatizados), e não por uma restrição no banco.

A comparação de nomes de categoria sem diferenciar maiúsculas de minúsculas também é feita pela API. O índice do banco diferencia maiúsculas.

## Categorias Iniciais

O sistema cria as seguintes categorias para cada novo usuário, no momento do cadastro:

Trabalho

Casa

Transporte

Alimentação

Outros

Elas ficam gravadas na tabela Category, em nome do usuário, e podem ser editadas ou removidas como qualquer outra.

## Cálculo do Saldo

O saldo não é armazenado diretamente no banco de dados.

O saldo é calculado com base nas movimentações do usuário.

As movimentações do tipo entrada aumentam o saldo.

As movimentações do tipo saída diminuem o saldo.

## Segurança dos Dados

Cada movimentação está relacionada ao usuário que a criou.

A API utiliza o userId do token de autenticação em toda consulta, para garantir que um usuário tenha acesso somente as suas próprias movimentações e categorias.

Um usuário não consegue acessar, editar ou excluir movimentações pertencentes a outro usuário. Testes automatizados cobrem esse isolamento.

## Ambientes

| Banco | Uso |
|-------|-----|
| `expenseflow` | Desenvolvimento |
| `expenseflow_test` | Testes automatizados. Criado no mesmo PostgreSQL do Docker é usado somente pelos testes. |

Para aplicar as migrações: `npx prisma migrate deploy` (dentro de `backend`). Para gerar o cliente do Prisma: `npx prisma generate`.
