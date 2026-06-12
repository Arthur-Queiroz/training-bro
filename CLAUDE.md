# Training Bro — guia do projeto e convenções de revisão

App de cadastro, gerenciamento e acompanhamento de treinos de musculação.
Você revisa e corrige código deste projeto. Aplique as regras abaixo em qualquer
revisão. Ao revisar um PR, compare contra a base com `git diff origin/main...HEAD`.

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript
- Tailwind CSS 4 · Clerk (auth) · Prisma 7 (ORM) · Supabase PostgreSQL
- next-pwa (PWA)

## Estrutura e onde cada coisa vive

```
app/                      # rotas (App Router). Páginas e layouts.
  api/                    # API routes REST (auth → parse tipado → service → handleError)
  workouts/               # lista, criação, detalhe, edição de treinos
    [workoutId]/          # rota dinâmica de um treino + seus exercícios
components/
  workouts/               # componentes de UI de treinos (card, form)
  exercises/              # componentes de UI de exercícios (card, form)
lib/
  prisma.ts               # singleton do Prisma client
  constants.ts            # grupos musculares e constantes de domínio
  services/
    workouts.ts           # lógica de negócio — CRUD de treinos
    exercises.ts          # lógica de negócio — CRUD de exercícios
    sessions.ts           # lógica de negócio — sessões de treino
  errors.ts               # erros de domínio (ValidationError, NotFoundError)
  parse-body.ts           # parsing tipado do corpo JSON na fronteira HTTP
  api-response.ts         # helpers de resposta (ok/err) + handleError
proxy.ts                  # clerkMiddleware (protege tudo exceto /sign-in e /sign-up).
                          # No Next 16 o middleware.ts foi renomeado para proxy.ts —
                          # NÃO crie um middleware.ts, o build falha com os dois.
prisma/
  schema.prisma           # schema do banco
```

Regra de ouro de localização:
- **Regras de negócio** → `lib/services/`. Services recebem `userId` como parâmetro,
  não conhecem HTTP e lançam erros de domínio (`lib/errors.ts`).
- **Fronteira HTTP** → `app/api/`. Routes só fazem: auth → parse tipado → service
  → resposta. Nada de regra de negócio em route.
- **UI e interação** → `components/` e `app/`.
- Acesso ao Prisma acontece SOMENTE no servidor (services), nunca a partir de
  componente client. Server Components importam services direto (sem round-trip
  HTTP); componentes client chamam as API routes via `fetch()`.

## Princípio central: lógica de negócio NÃO vive no frontend

O problema recorrente deste projeto é empurrar responsabilidade pro client.
Trate o seguinte como violação a ser corrigida:

- **Cálculos, validações e regras de negócio devem estar nos services**
  (`lib/services/`), não em componentes client nem em API routes. Componente
  client cuida de UI, estado de tela e interação — não de regra de negócio.
- **Validação de dados** roda no servidor antes de tocar o banco, sempre. Validação
  no client é só UX (feedback rápido), nunca a única barreira.
- **`"use client"` é exceção, não padrão.** Se o componente não precisa de estado,
  efeito, ou evento de browser, ele deve ser Server Component.
- **Nenhuma query Prisma partindo do client.** Se você vê acesso a dados num
  componente client, mova pra um service exposto por uma API route.

## TypeScript — boas práticas obrigatórias

- **Sem `any`.** Use tipos concretos. Quando o tipo é desconhecido de fato, use
  `unknown` e faça narrowing antes de usar.
- **Sem `as` pra silenciar o compilador.** Casts só quando há garantia real do tipo;
  caso contrário, resolva a tipagem de verdade (generics, guards, schema).
- **Tipos de domínio centralizados.** Modele `Workout`, `Exercise`, `MuscleGroup`
  uma vez (derivando dos tipos do Prisma quando possível) e reutilize. Não
  redefina o mesmo shape em vários arquivos.
- **Prefira tipos derivados do Prisma** (`Prisma.WorkoutGetPayload<...>`) a redigitar
  manualmente os campos da entidade.
- **Funções com retorno explícito** quando o tipo não é óbvio pela implementação.
- **`strict` respeitado.** Nada de `// @ts-ignore` sem justificativa em comentário.
- **Null vs undefined:** seja consistente. Campos opcionais do banco geralmente são
  `null`; estado de UI ainda não preenchido geralmente é `undefined`. Não misture.

## Services e API routes — convenções

- Cada service faz uma operação. Se uma função faz fetch + validação +
  transformação + side effect tudo junto, separe em funções nomeadas em `lib/`.
- **Sempre autentique e verifique ownership.** Toda route valida a sessão via
  Clerk (`auth()`) e todo service escopa as queries pelo `clerkUserId` recebido,
  garantindo que o recurso pertence ao usuário logado (sem isso, qualquer um
  edita treino dos outros). Há testes de regressão disso em `lib/services/*.test.ts`.
- **Erros tipados.** Services lançam `ValidationError`/`NotFoundError`
  (`lib/errors.ts`); routes convertem com `handleError()` (`lib/api-response.ts`)
  para 400/404, e erro inesperado vira 500 genérico sem vazar detalhes.
- **Resposta consistente:** `{ ok: true, data }` / `{ ok: false, error }` via
  helpers `ok()`/`err()`. Nunca monte o JSON de resposta na mão.
- **Corpo da requisição é `unknown`.** Converta com os helpers de
  `lib/parse-body.ts` antes de passar ao service. Nada de `await request.json()`
  usado direto.
- **Revalidação:** após mutação, revalide o path/tag afetado para a UI refletir.
- Não repita lógica de CRUD entre `workouts.ts` e `exercises.ts`; extraia o que
  for comum.

## Testes

- Suíte em Vitest (`npm test`), sem banco — o Prisma é mockado via `vi.mock`.
- Toda mudança em service deve manter/estender os testes de ownership
  (anti-IDOR) e de validação correspondentes.
- CI (GitHub Actions) roda typecheck, lint e testes em todo PR.

## React / Next.js

- Server Component é o padrão; só marque `"use client"` quando realmente precisar.
- Não faça data fetching em `useEffect` quando um Server Component resolve.
  Busque no servidor (importando o service) e passe via props.
- Componentes de `components/workouts` e `components/exercises` devem ser
  apresentacionais sempre que possível — recebem dados prontos, não buscam.
- Forms client chamam as API routes via `fetch()` e, após mutação com navegação,
  usam `router.push()` + `router.refresh()` para a UI refletir o novo estado.
- Páginas que carregam um recurso por id devem responder 404 de verdade
  (`notFound()` do `next/navigation`) quando o service lança `NotFoundError` —
  use o helper `or404()` de `lib/or-404.ts`.

## Sem over-engineering

- Não introduza abstrações, camadas, interfaces ou padrões que o problema não pede.
- A solução mínima que respeita a separação client/server e a tipagem forte é a
  correta. Prefira clareza a esperteza.

## Ao encontrar violações

Corrija diretamente no código. Faça commit na branch do PR e dê push. No comentário
do PR, liste cada problema encontrado e como foi corrigido, agrupado por arquivo.
Seja específico: ao mover "lógica do frontend", diga o que era, de qual componente
saiu, e pra qual service/helper foi.
