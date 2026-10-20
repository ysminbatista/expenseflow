# Banco de Dados do ExpenseFlow

## Objetivo

O banco de dados e responsavel por armazenar as informacoes dos usuarios, categorias e movimentacoes financeiras do ExpenseFlow.

O banco e o PostgreSQL, acessado pelo Prisma. A fonte da verdade da estrutura e o arquivo `backend/prisma/schema.prisma`, e cada alteracao gera uma migracao em `backend/prisma/migrations`.

## Tabelas

O banco de dados e composto pelas seguintes tabelas:

User

Category

Transaction

Os nomes das tabelas e das colunas seguem o padrao do Prisma: tabelas no singular e colunas em camelCase (por exemplo `passwordHash` e `userId`).

## Tabela User

A tabela User e responsavel por armazenar os dados dos usuarios.

### Campos

id

Identificador unico do usuario (numero sequencial).

name

Nome do usuario.

email

Endereco de e-mail do usuario. Unico. A API o guarda em minusculas.

passwordHash

Hash da senha (bcrypt). A senha em si nunca e armazenada.

createdAt

Data de criacao da conta.

## Tabela Category

A tabela Category e responsavel por armazenar as categorias utilizadas nas movimentacoes.

### Campos

id

Identificador unico da categoria.

name

Nome da categoria.

userId

Identificador do usuario que possui a categoria.

createdAt

Data de criacao da categoria.

## Tabela Transaction

A tabela Transaction e responsavel por armazenar as movimentacoes financeiras.

### Campos

id
Identificador unico da movimentacao.

type
Tipo da movimentacao. Enum `TransactionType`: `INCOME` (entrada) ou `EXPENSE` (saida).

description
Descricao da movimentacao.

amount
Valor da movimentacao. Tipo `DECIMAL(10,2)`, sem ponto flutuante, com no maximo 99.999.999,99.

date
Data da movimentacao.

categoryId
Identificador da categoria utilizada na movimentacao.

userId
Identificador do usuario que possui a movimentacao.

createdAt
Data de criacao da movimentacao.

updatedAt
Data da ultima atualizacao da movimentacao.

## Relacionamentos

Um usuario pode possuir varias categorias.

Um usuario pode possuir varias movimentacoes.

Uma categoria pode estar relacionada a varias movimentacoes.

Cada movimentacao pertence a um usuario.

Cada movimentacao pertence a uma categoria.

## Relacionamento entre User e Category

A tabela Category possui o campo userId para identificar qual usuario criou e possui aquela categoria.

Um usuario pode possuir varias categorias.

Ao excluir um usuario, as categorias dele sao excluidas junto (`ON DELETE CASCADE`).

## Relacionamento entre User e Transaction

A tabela Transaction possui o campo userId para identificar qual usuario possui aquela movimentacao.

Um usuario pode possuir varias movimentacoes.

Ao excluir um usuario, as movimentacoes dele sao excluidas junto (`ON DELETE CASCADE`).

## Relacionamento entre Category e Transaction

A tabela Transaction possui o campo categoryId para identificar a categoria da movimentacao.

Uma categoria pode ser utilizada em varias movimentacoes.

O banco impede a exclusao de uma categoria que tenha movimentacoes (`ON DELETE RESTRICT`). Por isso a API, antes de excluir uma categoria em uso, move as movimentacoes para outra categoria (veja `reassignTo` em `API.md`).

## Regras do Banco de Dados

Cada usuario deve possuir um id unico.

Cada categoria deve possuir um id unico.

Cada movimentacao deve possuir um id unico.

O email do usuario deve ser unico (indice unico em `email`).

O nome da categoria deve ser unico por usuario (indice unico em `userId` + `name`). Dois usuarios podem ter categorias com o mesmo nome.

O tipo da movimentacao deve ser entrada ou saida (garantido pelo enum `TransactionType`).

Toda movimentacao deve estar relacionada a um usuario.

Toda movimentacao deve estar relacionada a uma categoria.

O valor da movimentacao deve ser positivo. Essa regra e garantida pela API (validacao e testes automatizados), e nao por uma restricao no banco.

A comparacao de nomes de categoria sem diferenciar maiusculas de minusculas tambem e feita pela API. O indice do banco diferencia maiusculas.

## Categorias Iniciais

O sistema cria as seguintes categorias para cada novo usuario, no momento do cadastro:

Trabalho

Casa

Transporte

Alimentacao

Outros

Elas ficam gravadas na tabela Category, em nome do usuario, e podem ser editadas ou removidas como qualquer outra.

## Calculo do Saldo

O saldo nao e armazenado diretamente no banco de dados.

O saldo e calculado com base nas movimentacoes do usuario.

As movimentacoes do tipo entrada aumentam o saldo.

As movimentacoes do tipo saida diminuem o saldo.

## Seguranca dos Dados

Cada movimentacao esta relacionada ao usuario que a criou.

A API utiliza o userId do token de autenticacao em toda consulta, para garantir que um usuario tenha acesso somente as suas proprias movimentacoes e categorias.

Um usuario nao consegue acessar, editar ou excluir movimentacoes pertencentes a outro usuario. Testes automatizados cobrem esse isolamento.

## Ambientes

| Banco | Uso |
|-------|-----|
| `expenseflow` | Desenvolvimento |
| `expenseflow_test` | Testes automatizados. Criado no mesmo PostgreSQL do Docker e usado somente pelos testes. |

Para aplicar as migracoes: `npx prisma migrate deploy` (dentro de `backend`). Para gerar o cliente do Prisma: `npx prisma generate`.
