# Finance Manager - Backend

API REST desenvolvida com NestJS para gerenciamento financeiro, permitindo autenticação de usuários, gerenciamento de categorias e movimentações financeiras.

## Deploy

**Frontend (Vercel):**
https://desafio-dev-mocha.vercel.app/

**Backend (Railway):**
https://considerate-friendship-production.up.railway.app

**Swagger:**
https://considerate-friendship-production.up.railway.app/swagger

## Tecnologias

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- bcrypt
- Fastify
- Swagger
- class-validator
- class-transformer
- Jest

## Funcionalidades

- Cadastro de usuários
- Autenticação com JWT
- Refresh Token
- Logout
- Consulta do perfil autenticado
- CRUD de categorias
- CRUD de transações
- Movimentações vinculadas ao usuário autenticado
- Filtros por mês, ano e categoria
- Validação de dados
- Tratamento centralizado de erros
- Documentação da API com Swagger

## Arquitetura

O projeto foi organizado seguindo princípios de Domain-Driven Design (DDD), separando responsabilidades em:

- Domain
- Application
- Infrastructure

Cada módulo possui sua própria estrutura de entidades, repositórios, casos de uso e controladores.

## Pré-requisitos

- Node.js 20+
- PostgreSQL
- pnpm

## Instalação

Clone o repositório:

```bash
git clone <url-do-repositorio>
```

Entre na pasta da API:

```bash
cd api
```

Instale as dependências:

```bash
pnpm install
```

## Variáveis de ambiente

Crie um arquivo `.env`.

No Railway, configure as seguintes variáveis de ambiente:

Exemplo:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/finance_manager"

DIRECT_URL="postgresql://postgres:postgres@localhost:5432/finance_manager"
JWT_REFRESH_SECRET="financial_manager_refresh_secret"
JWT_REFRESH_EXPIRES_IN="7d"
JWT_EXPIRES_IN="15m"
JWT_SECRET="financial_manager_access_secret"
FRONTEND_URL="https://desafio-dev-mocha.vercel.app"
```

Altere os valores conforme seu ambiente.

## Banco de dados

Execute as migrations:

```bash
pnpm prisma migrate deploy
```

Durante o desenvolvimento:

```bash
pnpm prisma migrate dev
```

Caso deseje visualizar o banco:

```bash
pnpm prisma studio
```

## Executando a aplicação

Modo de desenvolvimento:

```bash
pnpm start:dev
```

Modo produção:

```bash
pnpm build
pnpm start:prod
```

A API ficará disponível em:

```
http://localhost:3000
```

## Documentação da API

Após iniciar a aplicação, a documentação estará disponível em:
Local:

```
http://localhost:3000/docs
```

Swagger:

```
https://considerate-friendship-production.up.railway.app/swagger
```

A documentação foi construída utilizando Swagger e contém todos os endpoints da aplicação.

## Estrutura do projeto

```text
src/
├── modules/
│   ├── auth/
│   ├── category/
│   └── transaction/
├── shared/
└── main.ts
```

## Organização dos módulos

Cada módulo segue a seguinte estrutura:

```text
module/
├── applications/
│   ├── dtos/
│   └── use-cases/
├── domain/
│   ├── entities/
│   ├── enums/
│   └── repositories/
├── infra/
│   ├── database/
│   └── http/
└── module.ts
```

## Segurança

A aplicação implementa:

- Autenticação utilizando JWT
- Refresh Token
- Rotas protegidas com Guards
- Hash de senhas utilizando bcrypt
- Validação de entrada com ValidationPipe
- Tratamento centralizado de exceções
- Isolamento dos dados por usuário autenticado

## Funcionalidades implementadas

- Cadastro de usuários
- Login
- Logout
- Refresh Token
- Consulta do perfil
- CRUD de categorias
- CRUD de transações
- Filtros por mês
- Filtros por ano
- Filtros por categoria
- Swagger
- ValidationPipe
- Tratamento global de erros
- Testes unitários dos casos de uso
- Controle de acesso por usuário autenticado

## Modelo de Dados

```mermaid
erDiagram

    USER ||--o{ REFRESH_TOKEN : has
    USER ||--o{ CATEGORY : owns
    USER ||--o{ TRANSACTION : creates
    CATEGORY ||--o{ TRANSACTION : classifies

    USER {
        string id PK
        string name
        string email UK
        string password
        UserRole role
        datetime createdAt
        datetime updatedAt
    }

    REFRESH_TOKEN {
        string id PK
        string token UK
        string userId FK
        datetime expiresAt
        datetime createdAt
    }

    CATEGORY {
        string id PK
        string name
        string userId FK
        datetime createdAt
        datetime updatedAt
    }

    TRANSACTION {
        string id PK
        string description
        decimal amount
        TransactionType type
        datetime date
        string userId FK
        string categoryId FK
        datetime createdAt
        datetime updatedAt
    }
```

## Regras de Relacionamento

- Um usuário pode possuir várias categorias.
- Um usuário pode possuir várias movimentações.
- Uma categoria pode estar vinculada a várias movimentações.
- Um usuário pode possuir vários refresh tokens.
- Ao excluir um usuário, suas categorias, movimentações e refresh tokens são removidos em cascata.
- Uma categoria não pode ser excluída caso existam movimentações vinculadas a ela.
- O nome da categoria deve ser único por usuário.

## Scripts

```bash
pnpm test

pnpm start:dev      # Desenvolvimento
pnpm build          # Build
pnpm start:prod     # Produção

pnpm prisma migrate dev
pnpm prisma migrate deploy
pnpm prisma studio
```

## Autor

Romulo Anderson da Rocha Zirbes
