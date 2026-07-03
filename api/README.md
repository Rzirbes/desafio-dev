# Finance Manager - Backend

API REST desenvolvida com NestJS para gerenciamento financeiro, permitindo autenticação de usuários, gerenciamento de categorias e movimentações financeiras.

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

Exemplo:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/finance_manager"

JWT_SECRET=your-secret-key

ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
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

```
http://localhost:3000/docs
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

## Scripts

```bash
pnpm start:dev      # Desenvolvimento
pnpm build          # Build
pnpm start:prod     # Produção

pnpm prisma migrate dev
pnpm prisma migrate deploy
pnpm prisma studio
```

## Autor

Romulo Anderson da Rocha Zirbes
