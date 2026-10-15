# API do ExpenseFlow

## Objetivo

A API sera responsavel pela comunicacao entre o frontend, o backend e o banco de dados do ExpenseFlow.

## Autenticacao

### POST /auth/register

Responsavel pelo cadastro de um novo usuario.

O usuario deve informar:

Nome

E-mail

Senha

### POST /auth/login

Responsavel pelo login do usuario.

O usuario deve informar:

E-mail

Senha

A API deve verificar os dados de acesso e identificar o usuario autenticado.

## Movimentacoes

### GET /transactions

Responsavel por listar as movimentacoes do usuario autenticado.

A API deve retornar somente as movimentacoes pertencentes ao usuario.

Pode receber filtros por:

Periodo

Categoria

### POST /transactions

Responsavel por cadastrar uma nova movimentacao.

Dados necessarios:

Tipo

Descricao

Valor

Categoria

Data

### PUT /transactions/:id

Responsavel por editar uma movimentacao existente.

A API deve permitir a alteracao dos dados da movimentacao.

A movimentacao deve pertencer ao usuario autenticado.

### DELETE /transactions/:id

Responsavel por excluir uma movimentacao.

A API deve permitir a exclusao somente de movimentacoes pertencentes ao usuario autenticado.

## Categorias

### GET /categories

Responsavel por listar as categorias do usuario autenticado.

### POST /categories

Responsavel por criar uma nova categoria.

Dados necessarios:

Nome

### PUT /categories/:id

Responsavel por editar uma categoria existente.

A categoria deve pertencer ao usuario autenticado.

## Dashboard

### GET /dashboard

Responsavel por retornar os dados necessarios para o dashboard.

A API deve fornecer:

Saldo atual

Total de entradas

Total de saidas

Gastos por categoria

## Exportacao

### GET /transactions/export

Responsavel por exportar as movimentacoes financeiras do usuario.

O formato da exportacao sera CSV.

A API deve exportar somente as movimentacoes pertencentes ao usuario autenticado.

## Seguranca

Todas as rotas que acessam dados financeiros devem verificar o usuario autenticado.

O usuario somente pode acessar suas proprias movimentacoes e categorias.

O usuario nao pode acessar dados pertencentes a outro usuario.

## Respostas da API

As respostas da API devem informar se a operacao foi realizada com sucesso ou se ocorreu algum erro.

Em caso de erro, a API deve retornar uma mensagem informando o motivo do erro.

## Observacao

Os endpoints definidos neste documento representam a estrutura inicial da API para o MVP do ExpenseFlow.

A implementacao pode ser ajustada durante o desenvolvimento caso seja identificada alguma necessidade tecnica.
