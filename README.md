# Castro Advocacia — Plataforma

Monorepo da plataforma Castro Advocacia: painel administrativo (frontend) e API REST (backend).

## Estrutura

```
├── frontend/          React 18 + TypeScript + Tailwind CSS + Vite
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/           Java 21 + Spring Boot 3.4 + PostgreSQL
│   ├── src/main/java/com/castroadvocacia/plataforma/
│   │   ├── model/         Entidades JPA (Cliente, Servico, Usuario, Conversa, Mensagem)
│   │   ├── repository/    Repositórios Spring Data
│   │   ├── service/       Lógica de negócio
│   │   ├── controller/    Endpoints REST (/api/*)
│   │   ├── dto/           Data Transfer Objects
│   │   ├── config/        CORS, Security
│   │   └── security/      JWT, autenticação
│   ├── src/main/resources/
│   │   └── application.yml
│   └── pom.xml
│
└── README.md
```

## Como rodar

### Frontend
```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

### Backend
```bash
cd backend
./mvnw spring-boot:run    # http://localhost:8080 (perfil dev, H2 em memória)
```

### Produção
- Frontend: `npm run build` gera `/dist` para deploy estático
- Backend: `./mvnw package` gera JAR em `/target`
- Banco: PostgreSQL (variáveis `DATABASE_URL`, `DATABASE_USER`, `DATABASE_PASSWORD`)

## Stack

| Camada   | Tecnologia                                    |
| -------- | --------------------------------------------- |
| Frontend | React 18, TypeScript, Tailwind CSS 3, Vite 5  |
| Backend  | Java 21, Spring Boot 3.4, Spring Security, JPA|
| Banco    | PostgreSQL (prod) / H2 (dev)                  |
| Auth     | JWT + BCrypt                                   |
