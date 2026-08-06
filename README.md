# Training Bro

Aplicativo para cadastro, gerenciamento e acompanhamento de treinos de musculação.

## Tech Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Clerk** (autenticação)
- **Prisma 7** (ORM)
- **Supabase PostgreSQL** (banco de dados)
- **Vitest** (testes)
- **PWA** (service worker)

## Pré-requisitos

- Node.js 22+
- Conta no [Clerk](https://clerk.com)
- Projeto no [Supabase](https://supabase.com) (PostgreSQL)

## Setup

1. Clone o repositório e instale as dependências:

```bash
git clone <repo-url>
cd training-bro
npm install
```

2. Crie o arquivo `.env` na raiz com as seguintes variáveis:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=sua_clerk_publishable_key
CLERK_SECRET_KEY=sua_clerk_secret_key

DATABASE_URL=postgresql://postgres:SUA_SENHA@db.SEU_PROJETO.supabase.co:5432/postgres
```

3. Rode as migrations do Prisma:

```bash
npx prisma migrate dev
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Estrutura do Projeto

```
app/                              # Rotas (App Router)
  api/
    workouts/
      route.ts                    # GET (listar), POST (criar)
      [workoutId]/
        route.ts                  # GET, PUT, DELETE de um treino
        exercises/                # CRUD de exercícios via API
        sessions/                 # Criação de sessões de treino via API
    sessions/
      route.ts                    # GET (listar sessões)
      week/route.ts               # GET (sessões da semana)
  workouts/
    page.tsx                      # Lista de treinos
    new/page.tsx                  # Criar treino
    [workoutId]/
      page.tsx                    # Detalhes do treino + exercícios
      edit/page.tsx               # Editar treino
      session/page.tsx            # Registrar sessão de treino
      exercises/
        new/page.tsx              # Adicionar exercício
        [exerciseId]/edit/page.tsx # Editar exercício
  history/
    page.tsx                      # Histórico de sessões
  profile/
    page.tsx                      # Perfil do usuário
    aparencia/page.tsx            # Configurações de aparência
    dados-pessoais/page.tsx       # Dados pessoais
  sign-in/                        # Login (Clerk)
  sign-up/                        # Cadastro (Clerk)

components/
  workouts/                       # UI de treinos (card, form)
  exercises/                      # UI de exercícios (card, form)
  history/                        # UI de histórico (session-stats)
  bottom-nav.tsx                  # Navegação inferior (mobile)
  sidebar.tsx                     # Navegação lateral
  theme-picker.tsx                # Seletor de tema
  skeleton.tsx                    # Skeleton loading
  sw-register.tsx                 # Registro do service worker

lib/
  prisma.ts                       # Singleton do Prisma client
  constants.ts                    # Grupos musculares e constantes de domínio
  errors.ts                       # Erros de domínio (ValidationError, NotFoundError)
  parse-body.ts                   # Parsing tipado do corpo JSON
  api-response.ts                 # Helpers de resposta (ok/err) + handleError
  or-404.ts                       # Helper para converter NotFoundError em 404
  themes.ts                       # Temas da aplicação
  week.ts                         # Utilidades de semana
  workout-colors.ts               # Cores para treinos
  services/
    workouts.ts                   # Lógica de negócio — CRUD de treinos
    exercises.ts                  # Lógica de negócio — CRUD de exercícios
    sessions.ts                   # Lógica de negócio — sessões de treino

proxy.ts                          # Clerk middleware (Next 16)
prisma/schema.prisma              # Schema do banco
```

## Arquitetura

O projeto segue separação clara de responsabilidades:

- **Regras de negócio** → `lib/services/` — recebem `userId`, não conhecem HTTP, lançam erros de domínio.
- **Fronteira HTTP** → `app/api/` — autenticam via Clerk, fazem parsing tipado do body, chamam o service e retornam resposta padronizada (`{ ok, data }` / `{ ok, error }`).
- **UI** → `components/` e `app/` — Server Components por padrão; `"use client"` só quando necessário.

Acesso ao Prisma acontece exclusivamente nos services (servidor). Server Components importam services direto; componentes client chamam as API routes via `fetch()`.

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento (Turbopack) |
| `npm run build` | Build de produção |
| `npm run start` | Iniciar em produção |
| `npm run lint` | Rodar ESLint |
| `npm test` | Rodar testes (Vitest) |
| `npm run test:watch` | Testes em modo watch |
| `npx tsc --noEmit` | Typecheck |
| `npx prisma migrate dev` | Aplicar migrations |
| `npx prisma generate` | Gerar Prisma Client |
| `npx prisma studio` | Interface visual do banco |

## Testes

Testes unitários com **Vitest**, sem banco de dados — o Prisma é mockado via `vi.mock`. Os testes cobrem:

- CRUD de treinos, exercícios e sessões
- Validação de ownership (anti-IDOR)
- Validações de negócio

CI via GitHub Actions roda typecheck, lint e testes em todo push e PR.

## Deploy

Deploy automatizado via GitHub Actions (`.github/workflows/deploy.yml`).
