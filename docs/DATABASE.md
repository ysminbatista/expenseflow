# Banco de Dados do ExpenseFlow

## Objetivo

O banco de dados sera responsavel por armazenar as informacoes dos usuarios, categorias e movimentacoes financeiras do ExpenseFlow.

## Tabelas

O banco de dados sera composto pelas seguintes tabelas:

Users

Categories

Transactions

## Tabela Users

A tabela Users sera responsavel por armazenar os dados dos usuarios.

### Campos

id

Identificador unico do usuario.

name

Nome do usuario.

email

Endereco de e-mail do usuario.

password

Senha do usuario.

created_at

Data de criacao da conta.

updated_at

Data da ultima atualizacao dos dados do usuario.

## Tabela Categories

A tabela Categories sera responsavel por armazenar as categorias utilizadas nas movimentacoes.

### Campos

id

Identificador unico da categoria.

name

Nome da categoria.

user_id

Identificador do usuario que possui a categoria.

created_at

Data de criacao da categoria.

updated_at

Data da ultima atualizacao da categoria.

## Tabela Transactions

A tabela Transactions sera responsavel por armazenar as movimentacoes financeiras.

### Campos

id
Identificador unico da movimentacao.

type
Tipo da movimentacao. Pode ser entrada ou saida.

description
Descricao da movimentacao.

amount
Valor da movimentacao.

category_id
Identificador da categoria utilizada na movimentacao.

user_id
Identificador do usuario que possui a movimentacao.

date
Data da movimentacao.

created_at
Data de criacao da movimentacao.

updated_at
Data da ultima atualizacao da movimentacao.

## Relacionamentos

Um usuario pode possuir varias categorias.

Um usuario pode possuir varias movimentacoes.

Uma categoria pode estar relacionada a varias movimentacoes.

Cada movimentacao pertence a um usuario.

Cada movimentacao pertence a uma categoria.

## Relacionamento entre Users e Categories

A tabela Categories possui o campo user_id para identificar qual usuario criou e possui aquela categoria.

Um usuario pode possuir varias categorias.

## Relacionamento entre Users e Transactions

A tabela Transactions possui o campo user_id para identificar qual usuario possui aquela movimentacao.

Um usuario pode possuir varias movimentacoes.

## Relacionamento entre Categories e Transactions

A tabela Transactions possui o campo category_id para identificar a categoria da movimentacao.

Uma categoria pode ser utilizada em varias movimentacoes.

## Regras do Banco de Dados

Cada usuario deve possuir um id unico.

Cada categoria deve possuir um id unico.

Cada movimentacao deve possuir um id unico.

O email do usuario deve ser unico.

O valor da movimentacao deve ser positivo.

O tipo da movimentacao deve ser entrada ou saida.

Toda movimentacao deve estar relacionada a um usuario.

Toda movimentacao deve estar relacionada a uma categoria.

## Categorias Iniciais

O sistema deve possuir inicialmente as seguintes categorias:

Trabalho

Casa

Transporte

Alimentacao

Outros

## Calculo do Saldo

O saldo nao sera armazenado diretamente no banco de dados.

O saldo sera calculado com base nas movimentacoes do usuario.

As movimentacoes do tipo entrada aumentam o saldo.

As movimentacoes do tipo saida diminuem o saldo.

## Seguranca dos Dados

Cada movimentacao deve estar relacionada ao usuario que a criou.

O sistema deve utilizar o user_id para garantir que um usuario tenha acesso somente as suas proprias movimentacoes.

Um usuario nao deve conseguir acessar, editar ou excluir movimentacoes pertencentes a outro usuario.
