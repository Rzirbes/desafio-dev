# Finance Manager - Frontend

Frontend da aplicação Finance Manager, desenvolvido com Next.js, responsável pela interface do usuário para gerenciamento de receitas, despesas e categorias.

## Deploy

**Frontend (Vercel):**
https://desafio-dev-mocha.vercel.app/

**Backend (Railway):**
https://considerate-friendship-production.up.railway.app

**Swagger:**
https://considerate-friendship-production.up.railway.app/swagger

---

## Tecnologias

- Next.js
- React
- TypeScript
- Tailwind CSS
- SWR
- Radix UI
- Lucide React

## Funcionalidades

- Autenticação de usuários
- Login e logout
- Dashboard financeiro
- Cadastro de receitas e despesas
- Edição e exclusão de movimentações
- Cadastro, edição e exclusão de categorias
- Filtros por mês, ano e categoria
- Atualização automática dos dados utilizando SWR
- Renovação automática do Access Token através do Refresh Token
- Interface responsiva

## Pré-requisitos

- Node.js 20+
- pnpm

## Instalação

Clone o repositório:

```bash
git clone <url-do-repositorio>
```

Entre na pasta do frontend:

```bash
cd ui
```

Instale as dependências:

```bash
pnpm install
```

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto.

Exemplo:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Altere a URL conforme o endereço da API.

## Executando o projeto

Modo de desenvolvimento:

```bash
pnpm dev
```

A aplicação estará disponível em:

```
http://localhost:3001
```

## Build para produção

```bash
pnpm build
```

Executar:

```bash
pnpm start
```

## Estrutura do projeto

```
src/
├── app/
│   ├── login/
│   ├── register/
│   ├── instructions/
│   └── (protected)/
│       └── dashboard/
├── components/
│   ├── auth/
│   ├── categories/
│   ├── dashboard/
│   ├── layout/
│   ├── transactions/
│   └── ui/
├── contexts/
├── hooks/
├── services/
│   ├── auth/
│   ├── categories/
│   └── transactions/
├── types/
└── utils/
```

## Fluxo de autenticação

O frontend utiliza autenticação baseada em JWT.

Fluxo:

- Login do usuário
- Recebimento do Access Token e Refresh Token
- Access Token utilizado nas requisições autenticadas
- Quando expira, o frontend solicita automaticamente um novo Access Token utilizando o Refresh Token
- Caso o Refresh Token seja inválido, o usuário é redirecionado para o login

## Integração com a API

A aplicação consome a API desenvolvida em NestJS.

Principais recursos utilizados:

- Autenticação
- Usuários
- Categorias
- Transações

## Funcionalidades implementadas

- Login
- Logout
- Dashboard financeiro
- CRUD de categorias
- CRUD de transações
- Filtros por mês
- Filtros por ano
- Filtros por categoria
- Atualização automática dos dados
- Tratamento de erros
- Interface responsiva

## Scripts

```bash
pnpm dev      # Desenvolvimento
pnpm build    # Build de produção
pnpm start    # Executa a aplicação
pnpm lint     # Verificação de código
```

## Autor

Romulo Anderson da Rocha Zirbes
