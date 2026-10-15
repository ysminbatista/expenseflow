# Telas do ExpenseFlow

> Rascunho baseado nas rotas existentes em `frontend/app`.

| Rota | Tela | Requisitos | Conteudo principal |
|------|------|------------|--------------------|
| `/` | Inicial | - | Apresentacao e acesso a login/cadastro |
| `/cadastro` | Cadastro | RF01 | Nome, e-mail, senha |
| `/login` | Login | RF02 | E-mail, senha |
| `/dashboard` | Dashboard | RF11 | Saldo, entradas, saidas, ultimas movimentacoes |
| `/movimentacoes` | Movimentacoes | RF04, RF06, RF12 | Lista, filtros, excluir, exportar CSV |
| `/nova-movimentacao` | Nova movimentacao | RF03 | Tipo, descricao, valor, data, categoria |
| `/editar-movimentacao` | Editar movimentacao | RF05 | Mesmo formulario preenchido |
| `/categorias` | Categorias | RF07-RF09 | Lista, criar, editar, remover |

## Observacoes

- `/editar-movimentacao` deveria receber o id (ex.: `/movimentacoes/[id]/editar`).
- Rotas privadas redirecionam para `/login` se nao houver sessao.
