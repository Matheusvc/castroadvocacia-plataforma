# Autenticação JWT — Spec A

Data: 2026-10-19
Status: aprovado para implementação

## Contexto

O projeto `castroadvocacia-plataforma` é um monorepo (`front-end/` + `back-end/`
na branch `master`). O backend (`back-end/.../config/SecurityConfig.java`) já
exige autenticação em tudo que não seja `/api/auth/**`, mas não existe nenhum
mecanismo de autenticação real implementado — nem emissão/validação de token no
backend, nem chamada de API no frontend.

O frontend já tem (não commitado, construído em paralelo a este trabalho) um
gate de login puramente client-side:
- `front-end/src/components/pages/LoginPage.tsx` — formulário com validação
  local de formato (e-mail/senha), chama `onLogin()` sem checar nada no servidor.
- `front-end/src/App.tsx` — usa `usePersistentState("castro.auth", false)`
  como flag booleana de "logado", renderiza `LoginPage` ou o `DashboardLayout`.
- `onLogout` já está fiado por `DashboardLayout` → `Sidebar` → `UserCard`.

Este spec substitui a validação client-side fake por autenticação real contra
o backend, sem redesenhar a UI existente.

## Escopo

**Dentro do escopo:**
- Backend: endpoints `POST /api/auth/register` e `POST /api/auth/login`,
  emissão/validação de JWT, filtro de autenticação.
- Frontend: cliente HTTP com injeção automática de token, troca da validação
  fake do `LoginPage.tsx` por chamada real, troca da flag booleana em
  `App.tsx` por um token persistido, logout limpando o token.

**Fora do escopo (specs futuros):**
- Integração da tela de Clientes com a API real (Spec B).
- Exportar para Excel (Spec B).
- Recuperação de senha, múltiplos perfis de permissão por rota, refresh token.
- Tela de cadastro de usuário no frontend (o endpoint de registro existe, mas
  sem UI — criação de usuário por enquanto é via chamada direta à API).

## Backend

### Dependência nova
`pom.xml`: `io.jsonwebtoken:jjwt-api`, `jjwt-impl`, `jjwt-jackson` (versão 0.12.x).

### DTOs (`dto/`)
- `LoginRequestDTO`: `email` (`@NotBlank @Email`), `senha` (`@NotBlank`).
- `RegisterRequestDTO`: `nome`, `email`, `senha` (todos `@NotBlank`; `email`
  também `@Email`).
- `AuthResponseDTO`: `token`, `nome`, `email`, `perfil`.

### `security/JwtService`
- `gerarToken(Usuario usuario)`: subject = `usuario.getId()`, claims `email` e
  `perfil`, expiração configurável (`jwt.expiration-ms`, default 8h),
  assinado com chave HMAC lida de `jwt.secret` (`application.yml`, com
  variável de ambiente em prod — mesmo padrão de `DATABASE_URL` etc.).
- `validarToken(String token)`: retorna claims ou lança exceção se
  inválido/expirado.

### `security/JwtAuthenticationFilter` (`OncePerRequestFilter`)
- Ignora `/api/auth/**` e `/h2-console/**`.
- Lê `Authorization: Bearer <token>`; se ausente, segue a cadeia (deixa a
  regra do `SecurityConfig` barrar com 401 se a rota exigir auth).
- Se presente: valida, popula `SecurityContextHolder` com um
  `UsernamePasswordAuthenticationToken` (principal = id do usuário, authority
  = `ROLE_<PERFIL>`). Token inválido/expirado → 401 (sem lançar exceção não
  tratada; responde direto via `HttpServletResponse`).

### `AuthController`
- `POST /api/auth/register`: valida `@Valid`, checa
  `usuarioRepository.existsByEmail`, lança conflito (409, reaproveitando o
  `DataIntegrityViolationException` já tratado pelo `GlobalExceptionHandler`)
  se duplicado, senão cria com senha codificada (`passwordEncoder.encode`),
  retorna `AuthResponseDTO` com token (login automático pós-registro).
- `POST /api/auth/login`: busca por e-mail, `passwordEncoder.matches`; credencial
  inválida → 401 com mensagem genérica ("E-mail ou senha inválidos.") — não
  revela se o e-mail existe. Sucesso → `AuthResponseDTO`.

### `SecurityConfig`
- Mantém `/api/auth/**` e `/h2-console/**` públicos, resto autenticado,
  `STATELESS` (já está assim).
- Registra `JwtAuthenticationFilter` antes de
  `UsernamePasswordAuthenticationFilter`.

### Testes
- `JwtServiceTest`: gera token, valida, confirma expiração/assinatura inválida
  são rejeitadas.
- `AuthControllerTest` (`@WebMvcTest`): registro com sucesso, registro
  duplicado (409), login com sucesso, login com senha errada (401).

## Frontend

### `src/lib/apiClient.ts` (novo)
- Base URL via `import.meta.env.VITE_API_BASE_URL` (nova `front-end/.env`,
  default `http://localhost:8080`).
- Wrapper fino sobre `fetch`: injeta `Authorization: Bearer <token>` lendo de
  um módulo de sessão (`src/lib/authSession.ts`, ver abaixo); em resposta
  `401`, limpa o token e força logout (callback registrado pelo `App.tsx`).
- Funções: `apiGet`, `apiPost`, `apiPut`, `apiDelete` (JSON) — usadas pelo
  Spec B também.

### `src/lib/authSession.ts` (novo)
- Encapsula o `usePersistentState`-like storage do token em
  `localStorage` (`castro.auth.token`), com funções `getToken`,
  `setToken`, `clearToken` fora do ciclo de render do React (o `apiClient`
  precisa ler o token fora de um componente).

### `LoginPage.tsx` (editar)
- Mantém o formulário e a validação local de formato já existente.
- `handleSubmit`, após validação local passar, chama
  `apiPost("/api/auth/login", { email, senha: password })`.
- Sucesso: guarda token (`authSession.setToken`), chama `onLogin()`.
- Falha (401): mostra erro genérico abaixo do campo de senha (reaproveita o
  `errors` state já existente), sem redesenhar o layout.

### `App.tsx` (editar)
- Troca `usePersistentState("castro.auth", false)` por um estado derivado do
  token (`authSession.getToken()` na inicialização +
  `useState`/evento customizado para refletir mudanças).
- `onLogout` (já fiado até `UserCard`) passa a chamar `authSession.clearToken()`
  e resetar o estado local.

### Testes
- Manual via navegador (critério do projeto para UI) + checagem de que
  `npm run typecheck` passa.

## Erros e casos de borda
- Token expirado durante o uso (ex.: aba aberta por 8h): qualquer chamada via
  `apiClient` recebe 401 → logout automático, usuário cai na tela de login.
- H2 reinicia a cada subida do backend (`ddl-auto: create-drop`) → todos os
  usuários são perdidos. Não há seed automático neste spec (fora de escopo);
  criar um usuário de teste via `POST /api/auth/register` (Postman/curl) após
  cada subida do backend em dev.

## Compatibilidade com trabalho em andamento
Os arquivos `App.tsx`, `LoginPage.tsx`, `TextField.tsx`, `DashboardLayout.tsx`,
`Sidebar.tsx`, `UserCard.tsx` têm mudanças não commitadas de uma sessão
paralela. Este spec constrói em cima do estado atual desses arquivos (lido em
19/10/2026) — a implementação deve reler cada arquivo imediatamente antes de
editar, para não sobrescrever progresso feito nesse intervalo.
