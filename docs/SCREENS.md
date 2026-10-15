# Telas do ExpenseFlow

| Rota | Tela | Acesso | Requisitos | Conteudo principal |
|------|------|--------|------------|--------------------|
| `/` | Inicial | Publico | - | Apresentacao e acesso a login/cadastro |
| `/cadastro` | Cadastro | Publico | RF01 | Nome, e-mail, senha (minimo de 8 caracteres) |
| `/login` | Login | Publico | RF02 | E-mail, senha |
| `/dashboard` | Dashboard | Logado | RF11 | Saldo, entradas, saidas e gastos por categoria |
| `/movimentacoes` | Movimentacoes | Logado | RF04, RF06, RF12 | Lista, filtros por categoria e periodo, excluir, exportar CSV |
| `/nova-movimentacao` | Nova movimentacao | Logado | RF03 | Tipo, descricao, valor, data, categoria |
| `/editar-movimentacao?id=` | Editar movimentacao | Logado | RF05 | Mesmo formulario, preenchido |
| `/categorias` | Categorias | Logado | RF07-RF09 | Lista, criar, editar, remover (com destino das movimentacoes) |

## Comportamento comum

- As telas logadas ficam sob um layout compartilhado: menu (Dashboard, Movimentacoes, Categorias), nome do usuario e botao **Sair**.
- Sem token ou com token invalido, a area logada redireciona para `/login`. Se o servidor estiver fora do ar, a sessao nao e encerrada.
- "Nova" e "Editar" usam o mesmo componente de formulario.

## Observacao

- `/editar-movimentacao` recebe o id por query string. Uma rota `/movimentacoes/[id]/editar` seria mais limpa, mas nao foi priorizada.
