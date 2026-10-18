# Castro Advocacia — Chat

Interface de chat construída em React + TypeScript + Tailwind + Vite, replicando o
design do Figma **CASTRO ADVOCACIA** (node `3397-795`): a casca do painel
(sidebar + header + responsividade) com a **interface de chat** preenchendo a
área de conteúdo, reaproveitando os tokens da marca.

## Stack

- React 18 + TypeScript (estrito, sem `any`)
- Tailwind CSS 3 (tokens em `src/theme.ts`, consumidos pelo `tailwind.config.ts`)
- Vite 5
- lucide-react (ícones de UI do chat)

## Como rodar

```bash
npm install
npm run dev        # ambiente de desenvolvimento
npm run build      # typecheck + build de produção
npm run preview    # serve o build
```

## Estrutura

```
public/assets/            logo.svg (favicon + marca)
src/
  theme.ts                Tokens de design (fonte única)
  index.css               Tailwind + CSS vars + base/acessibilidade
  assets/                 Ícones SVG do Figma (inline, currentColor)
  types/chat.ts           Tipos do chat
  types/entities.ts       Tipos de Cliente e Serviço
  data/mockMessages.ts    Mock do chat (contato + histórico)
  data/mockConversations.ts  Fila de atendimento (Conversas)
  data/mockClients.ts     Mock de clientes
  data/mockServices.ts    Mock de serviços
  data/mockDashboard.ts   KPIs de clientes (Dashboard)
  hooks/useChat.ts        Lógica de chat (envio, status, auto-resposta)
  hooks/useHashRoute.ts   Roteamento por hash (#dashboard/#clientes/#servicos)
  components/
    layout/               DashboardLayout (hambúrguer + drawer), Sidebar,
                          SidebarLink, MobileTopBar, UserCard, BrandLogo,
                          Avatar, InlineIcon, navItems
    ui/                   PageHeader, IconButton, StatusTag
    dashboard/            StatCard, DonutChart, StatusBarChart
    conversas/            ConversationList, ConversationListItem
    pages/                DashboardPage, ConversasPage, ClientesPage, ServicosPage
    chat/                 ChatPanel, ChatHeader, MessageList, MessageBubble,
                          MessageInput, SendButton, TypingIndicator, Timestamp,
                          MessageStatusIcon
  App.tsx                 Roteia entre Dashboard / Conversas / Clientes / Serviços
```

## Tokens extraídos do Figma

| Token            | Valor     | Uso                                   |
| ---------------- | --------- | ------------------------------------- |
| blue/base        | `#5165E1` | balão enviado, botão de enviar        |
| blue/light       | `#8996EB` | "ADVOCACIA", botão desabilitado       |
| blue/dark        | `#2E3DA3` | link ativo, títulos, avatar           |
| fuschia/60       | `#FCDDEC` | texto/ícone de link inativo           |
| gray-100         | `#151619` | fundo da sidebar, texto primário      |
| gray-200         | `#1E2024` | bordas, botão hambúrguer              |
| gray-400         | `#858B99` | texto secundário/mudo                 |
| gray-600         | `#F9FAFA` | fundo do conteúdo, texto sobre escuro |
| Fonte            | Lato      | 400 / 700, line-height 1.4            |
| Raio links/botão | 5px       | menu links, botões                    |
| Raio avatar      | 9999px    | avatares                              |
| Raio conteúdo    | 20px      | topo do painel (mobile)               |

## Navegação

- **Menu hambúrguer em todas as telas** (desktop e mobile): a barra superior
  tem o botão que abre a navegação num drawer sobreposto.
- Cada item abre sua própria página, sincronizada com o hash da URL:
  - `#dashboard` → **métricas e gráficos** (KPIs de clientes: total, ativos,
    inativos, pendentes; donut de status dos clientes; barras de serviços por
    status) + botão **Exportar relatório** (Imprimir/PDF e CSV)
  - `#conversas` → **fila de atendimento**: lista de quem escolheu "falar com o
    atendente"; selecione uma pessoa para ver o histórico e responder
  - `#clientes` → tabela de clientes (nome, **CPF**, **número do processo**, ações)
  - `#servicos` → tabela de serviços (id, título, valor, responsável, status)
- Suporta voltar/avançar do navegador; o item ativo fica destacado (`aria-current`).

### Dados mockados do Dashboard

Os KPIs usam agregados mockados (`src/data/mockDashboard.ts`, total 128). As
barras de serviços são calculadas a partir dos dados reais de `mockServices`.
As cores dos gráficos foram validadas para daltonismo/contraste (paleta de
status com rótulos diretos, nunca cor sozinha).

## Tabelas: busca, CRUD e persistência

- **Busca** em Clientes (nome/CPF/processo) e Serviços (título/serviço/responsável/id),
  com estado vazio quando nada corresponde.
- **Novo** / **Editar** (Clientes e Serviços) e **Excluir** (Clientes, com
  diálogo de confirmação) via modal acessível — `role="dialog"`, foco gerido
  (trap + devolução), Esc e clique-fora. Ao salvar, as iniciais do avatar e a
  data de atualização são recalculadas; serviços novos recebem id sequencial
  (`00006`, …).
- **Persistência em `localStorage`** (`usePersistentState`): clientes e serviços
  sobrevivem ao recarregar. As leituras/escritas são protegidas (modo privado,
  storage bloqueado ou JSON inválido caem no mock inicial). O gráfico de
  serviços do Dashboard reflete os dados persistidos.
- Chaves usadas: `castro.clients`, `castro.services`.

## Comportamento

- **Enter** envia · **Shift+Enter** quebra linha
- Rolagem automática para a última mensagem
- Estados de mensagem: `sending` → `sent` (resposta automática) ou `error`
- **Para testar o estado de erro + reenvio:** envie uma mensagem contendo a
  palavra "erro" — ela falha propositalmente e exibe "Tentar novamente"
- Mobile: sidebar vira drawer (hambúrguer), com backdrop, Esc, clique-fora e foco gerido

## Acessibilidade (WCAG 2.1 AA)

- HTML semântico: `main`, `header`, `nav`, `ul/li`, `form`, `time`
- `aria-live="polite"` na lista de mensagens
- Labels em todos os campos e botões (incl. `sr-only`)
- Foco visível (`:focus-visible`) e navegação por teclado
- `aria-expanded`/`aria-controls` no hambúrguer; `role="dialog"` no drawer
- Respeita `prefers-reduced-motion`
- Contraste: texto principal e títulos ≥ 4.5:1

## Checklist de comparação com o Figma

Replicado (fiel ao Figma):

- [x] Sidebar desktop 200px, fundo `gray-100`, borda `gray-200`
- [x] Marca CASTRO (20px bold) / ADVOCACIA (10px bold, uppercase, tracking)
- [x] Logo e ícones de menu (SVGs reais do Figma)
- [x] Link ativo `blue/dark` com texto branco; inativos `fuschia/60`
- [x] Bloco de usuário no rodapé (avatar `UA` + nome + e-mail)
- [x] Barra superior mobile (hambúrguer 40px `rounded-5` + marca + avatar 40px)
- [x] Conteúdo branco com topo arredondado (20px no mobile)
- [x] Título em `blue/dark` bold (header do conteúdo)
- [x] Tipografia Lato e escala de tamanhos
- [x] Variantes desktop (≥1024px) e mobile (<1024px)

Adicionado / assumido (não existia no Figma, documentado):

- [~] **Conteúdo do chat**: o Figma tinha a área de conteúdo vazia (só o título).
      O chat (balões, input, typing, estados) foi projetado reaproveitando os
      tokens da marca — superfície clara com `#FFFFFF`, borda `#E6E8EC` e balão
      enviado `blue/base`.
- [~] Título de página desktop em 24px (derivado da altura 34px do Figma)
- [~] Breakpoint único de troca de layout em `lg` (1024px), conforme as duas
      variantes do Figma (390px mobile / 1366px desktop)
- [~] Ponto de presença (online) e ações de cabeçalho (ligar / mais)
- [~] Separadores de dia (Hoje/Ontem) na lista

Pendências conhecidas:

- [ ] Virtualização de lista: não incluída (mock curto). Estratégia documentada
      em `MessageList.tsx` para históricos com centenas de itens.
- [ ] O design original não especifica cores da superfície clara do chat; os
      valores assumidos estão isolados em `theme.ts` (bloco "assumidos").
