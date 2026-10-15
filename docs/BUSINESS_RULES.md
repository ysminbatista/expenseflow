# Regras de Negocio do ExpenseFlow

## RN01 Valores positivos

Os valores das movimentacoes devem ser sempre informados como valores positivos.

## RN02 Tipo da movimentacao

Toda movimentacao deve possuir um tipo que indique se ela e uma entrada ou uma saida.

O tipo da movimentacao sera utilizado para definir como o valor sera considerado no calculo do saldo.

## RN03 Acesso aos dados

Cada usuario pode acessar somente seus proprios dados e movimentacoes financeiras.

Um usuario nao pode visualizar, editar ou excluir movimentacoes pertencentes a outro usuario.

## RN04 E-mail unico

Cada conta deve possuir um endereco de e-mail unico.

O sistema nao deve permitir que dois usuarios utilizem o mesmo endereco de e-mail.

## RN05 Categorias em uso

Uma categoria que esteja sendo utilizada por uma ou mais movimentacoes nao pode ser removida sem que o sistema realize o tratamento necessario para essas movimentacoes.

## RN06 Categorias iniciais

O sistema deve possuir as seguintes categorias iniciais:
Trabalho
Casa
Transporte
Alimentacao
Outros

## RN07 Gerenciamento de categorias

O usuario pode criar e editar suas categorias de movimentacao.

## RN08 Movimentacoes do usuario

O usuario pode cadastrar, visualizar, editar e excluir somente suas proprias movimentacoes.

## RN09 Calculo do saldo

O saldo do usuario deve ser calculado com base nas movimentacoes cadastradas.

As entradas devem aumentar o saldo e as saidas devem diminuir o saldo.

## RN10 Formato do valor

O valor de uma movimentacao deve ser armazenado como um valor numerico positivo.

## RN11 Controle de acesso

O sistema deve verificar o usuario autenticado antes de permitir o acesso aos dados financeiros.

## RN12 Exportacao

A exportacao das movimentacoes financeiras deve ser realizada no formato CSV para o MVP.
