# Arquitetura do ExpenseFlow

## Objetivo

A arquitetura do ExpenseFlow será organizada em diferentes partes para separar as responsabilidades do sistema.

## Estrutura

O sistema será dividido em:

Frontend

Backend

API

Banco de dados

## Frontend

O frontend será responsável pela interface que o usuário utiliza.

A tecnologia utilizada será o Next.js.

O frontend será responsável por:

Exibir as telas do sistema

Permitir a interação do usuário

Enviar solicitações para a API

Exibir os dados recebidos da API

Adaptar a interface para dispositivos móveis e computadores

## Backend

O backend será responsável pelas regras e pelo processamento das informações.

A tecnologia utilizada será o NestJS.

O backend será responsável por:

Processar as solicitações da API

Validar os dados recebidos

Aplicar as regras de negócio

Controlar o acesso aos dados

Consultar e alterar os dados do banco

## API

A API será responsável pela comunicação entre o frontend e o backend.

O frontend enviará solicitações para a API.

O backend processará essas solicitações e retornará as informações necessárias.

Exemplo:

Usuário

Frontend

API

Backend

Banco de dados

Resposta

Frontend

Usuário

## Banco de Dados

O banco de dados será responsável pelo armazenamento das informações do sistema.

A tecnologia utilizada será o PostgreSQL.

Os principais dados armazenados serão:

Usuários

Categorias

Movimentações

## Prisma

O Prisma será utilizado como ORM para facilitar a comunicação entre o backend e o banco de dados.

O Prisma será responsável por:

Definir os modelos do banco

Realizar consultas

Criar registros

Atualizar registros

Excluir registros

## Docker

O Docker será utilizado para facilitar a configuração do ambiente de desenvolvimento.

O banco de dados PostgreSQL poderá ser executado utilizando Docker.

## Fluxo de uma movimentação

Quando o usuário cadastrar uma movimentação, o fluxo será:

Usuário acessa a tela de nova movimentação

Frontend coleta os dados

Frontend envia os dados para a API

Backend recebe os dados

Backend valida os dados

Backend aplica as regras de negócio

Backend utiliza o Prisma para salvar os dados

Prisma envia os dados para o PostgreSQL

PostgreSQL armazena a movimentação

Backend retorna uma resposta

Frontend atualiza a interface

## Segurança

O backend deve verificar a identidade do usuário antes de permitir o acesso aos seus dados.

As movimentações devem estar relacionadas ao usuário autenticado.

Um usuário não pode acessar dados pertencentes a outro usuário.

## Responsividade

O frontend deve funcionar em dispositivos móveis e computadores.

A interface deve se adaptar a diferentes tamanhos de tela.

## Tecnologias

Frontend

Next.js

Backend

NestJS

Banco de dados

PostgreSQL

ORM

Prisma

Ambiente

Docker
