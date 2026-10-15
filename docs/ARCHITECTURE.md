# Arquitetura do ExpenseFlow

## Objetivo

A arquitetura do ExpenseFlow sera organizada em diferentes partes para separar as responsabilidades do sistema.

## Estrutura

O sistema sera dividido em:

Frontend

Backend

API

Banco de dados

## Frontend

O frontend sera responsavel pela interface que o usuario utiliza.

A tecnologia utilizada sera o Next.js.

O frontend sera responsavel por:

Exibir as telas do sistema

Permitir a interacao do usuario

Enviar solicitacoes para a API

Exibir os dados recebidos da API

Adaptar a interface para dispositivos moveis e computadores

## Backend

O backend sera responsavel pelas regras e pelo processamento das informacoes.

A tecnologia utilizada sera o NestJS.

O backend sera responsavel por:

Processar as solicitacoes da API

Validar os dados recebidos

Aplicar as regras de negocio

Controlar o acesso aos dados

Consultar e alterar os dados do banco

## API

A API sera responsavel pela comunicacao entre o frontend e o backend.

O frontend enviara solicitacoes para a API.

O backend processara essas solicitacoes e retornara as informacoes necessarias.

Exemplo:

Usuario

Frontend

API

Backend

Banco de dados

Resposta

Frontend

Usuario

## Banco de Dados

O banco de dados sera responsavel pelo armazenamento das informacoes do sistema.

A tecnologia utilizada sera o PostgreSQL.

Os principais dados armazenados serao:

Usuarios

Categorias

Movimentacoes

## Prisma

O Prisma sera utilizado como ORM para facilitar a comunicacao entre o backend e o banco de dados.

O Prisma sera responsavel por:

Definir os modelos do banco

Realizar consultas

Criar registros

Atualizar registros

Excluir registros

## Docker

O Docker sera utilizado para facilitar a configuracao do ambiente de desenvolvimento.

O banco de dados PostgreSQL podera ser executado utilizando Docker.

## Fluxo de uma movimentacao

Quando o usuario cadastrar uma movimentacao, o fluxo sera:

Usuario acessa a tela de nova movimentacao

Frontend coleta os dados

Frontend envia os dados para a API

Backend recebe os dados

Backend valida os dados

Backend aplica as regras de negocio

Backend utiliza o Prisma para salvar os dados

Prisma envia os dados para o PostgreSQL

PostgreSQL armazena a movimentacao

Backend retorna uma resposta

Frontend atualiza a interface

## Seguranca

O backend deve verificar a identidade do usuario antes de permitir o acesso aos seus dados.

As movimentacoes devem estar relacionadas ao usuario autenticado.

Um usuario nao pode acessar dados pertencentes a outro usuario.

## Responsividade

O frontend deve funcionar em dispositivos moveis e computadores.

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
