# Regras de Negócio do ExpenseFlow

## RN01 Valores positivos

Os valores das movimentações devem ser sempre informados como valores positivos.

## RN02 Tipo da movimentação

Toda movimentação deve possuir um tipo que indique se ela é uma entrada ou uma saída.

O tipo da movimentação será utilizado para definir como o valor será considerado no cálculo do saldo.

## RN03 Acesso aos dados

Cada usuário pode acessar somente seus próprios dados e movimentações financeiras.

Um usuário não pode visualizar, editar ou excluir movimentações pertencentes a outro usuário.

## RN04 E-mail único

Cada conta deve possuir um endereço de e-mail único.

O sistema não deve permitir que dois usuários utilizem o mesmo endereço de e-mail.

## RN05 Categorias em uso

Uma categoria que esteja sendo utilizada por uma ou mais movimentações não pode ser removida sem que o sistema realize o tratamento necessário para essas movimentações.

## RN06 Categorias iniciais

O sistema deve possuir as seguintes categorias iniciais:
Trabalho
Casa
Transporte
Alimentação
Outros

## RN07 Gerenciamento de categorias

O usuário pode criar e editar suas categorias de movimentação.

## RN08 Movimentações do usuário

O usuário pode cadastrar, visualizar, editar e excluir somente suas próprias movimentações.

## RN09 Cálculo do saldo

O saldo do usuário deve ser calculado com base nas movimentações cadastradas.

As entradas devem aumentar o saldo e as saídas devem diminuir o saldo.

## RN10 Formato do valor

O valor de uma movimentação deve ser armazenado como um valor numérico positivo.

## RN11 Controle de acesso

O sistema deve verificar o usuário autenticado antes de permitir o acesso aos dados financeiros.

## RN12 Exportação

A exportação das movimentações financeiras deve ser realizada no formato CSV para o MVP.
