# Telas do ExpenseFlow

| Rota | Tela | Acesso | Requisitos | Conteúdo principal |
|------|------|--------|------------|--------------------|
| `/` | Inicial | Público | - | Apresentação e acesso a login/cadastro |
| `/cadastro` | Cadastro | Público | RF01 | Nome, e-mail, senha (mínimo de 8 caracteres) |
| `/login` | Login | Público | RF02 | E-mail, senha |
| `/dashboard` | Dashboard | Logado | RF11 | Saldo, entradas, saídas e gastos por categoria |
| `/movimentacoes` | Movimentações | Logado | RF04, RF06, RF12 | Lista, filtros por categoria e período, excluir, exportar CSV |
| `/nova-movimentacao` | Nova movimentação | Logado | RF03 | Tipo, descrição, valor, data, categoria |
| `/editar-movimentacao?id=` | Editar movimentação | Logado | RF05 | Mesmo formulário, preenchido |
| `/categorias` | Categorias | Logado | RF07-RF09 | Lista, criar, editar, remover (com destino das movimentações) |

## Comportamento comum

- As telas logadas ficam sob um layout compartilhado: menu (Dashboard, Movimentações, Categorias), nome do usuário e botão **Sair**.
- Sem token ou com token inválido, a área logada redireciona para `/login`. Se o servidor estiver fora do ar, a sessão não é encerrada.
- "Nova" e "Editar" usam o mesmo componente de formulário.

## Observação

- `/editar-movimentacao` recebe o id por query string. Uma rota `/movimentacoes/[id]/editar` seria mais limpa, mas não foi priorizada.

## Identidade visual

- **Logo:** um "E" formado por três barras, que representam o fluxo do dinheiro, com uma moeda verde. É usada no cabeçalho, nas telas de entrada e como ícone da aba do navegador.
- **Cores:** índigo e violeta como marca. Verde para entradas e vermelho para saídas, em todas as telas.
- **Ícones:** SVG da biblioteca Lucide, sem emojis. Cada categoria tem um ícone próprio, reconhecido pelo nome (por exemplo, Trabalho, Casa, Transporte, Alimentação e Outros).
- **Interações:** avisos rápidos a cada ação, valores do dashboard que contam até o número final, barras animadas por categoria, saudação conforme o horário, botão para mostrar a senha e medidor de força da senha no cadastro. Quem prefere menos movimento no sistema não vê as animações.
