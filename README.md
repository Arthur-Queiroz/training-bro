# Training Bro

Aplicativo para cadastro, gerenciamento e acompanhamento de treinos de musculacao.

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Clerk** (autenticacao)
- **Prisma 7** (ORM)
- **Supabase PostgreSQL** (banco de dados)
- **next-pwa** (PWA)

## Pre-requisitos

- Node.js 18+
- Conta no [Clerk](https://clerk.com)
- Projeto no [Supabase](https://supabase.com) (PostgreSQL)

## Setup

1. Clone o repositorio e instale as dependencias:

```bash
git clone <repo-url>
cd training-bro
npm install
```

2. Crie o arquivo `.env` na raiz com as seguintes variaveis:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=sua_clerk_publishable_key
CLERK_SECRET_KEY=sua_clerk_secret_key

DATABASE_URL=postgresql://postgres:SUA_SENHA@db.SEU_PROJETO.supabase.co:5432/postgres
```

3. Rode as migrations do Prisma para criar as tabelas:

```bash
npx prisma migrate dev
```

4. Gere o Prisma Client:

```bash
npx prisma generate
```

5. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Estrutura do Projeto

```
app/
  page.tsx                  # Home (autenticada)
  workouts/
    page.tsx                # Lista de treinos
    new/page.tsx            # Criar treino
    [workoutId]/
      page.tsx              # Detalhes do treino + exercicios
      edit/page.tsx         # Editar treino
      exercises/
        new/page.tsx        # Adicionar exercicio
        [exerciseId]/
          edit/page.tsx     # Editar exercicio
components/
  workouts/                 # Componentes de treinos (card, form)
  exercises/                # Componentes de exercicios (card, form)
lib/
  prisma.ts                 # Prisma client singleton
  constants.ts              # Grupos musculares
  actions/
    workouts.ts             # Server actions CRUD treinos
    exercises.ts            # Server actions CRUD exercicios
prisma/
  schema.prisma             # Schema do banco de dados
  migrations/               # Historico de migrations
```

## Scripts

| Comando | Descricao |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de producao |
| `npm run start` | Iniciar em producao |
| `npm run lint` | Rodar ESLint |
| `npx prisma migrate dev` | Aplicar migrations |
| `npx prisma generate` | Gerar Prisma Client |
| `npx prisma studio` | Interface visual do banco |
