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
  workouts/               # lista, criação, detalhe, edição de treinos
    [workoutId]/          # rota dinâmica de um treino + seus exercícios
components/
  workouts/               # componentes de UI de treinos (card, form)
  exercises/              # componentes de UI de exercícios (card, form)
lib/
  prisma.ts               # singleton do Prisma client
  constants.ts            # grupos musculares e constantes de domínio
  actions/
    workouts.ts           # Server Actions — CRUD de treinos
    exercises.ts          # Server Actions — CRUD de exercícios
prisma/
  schema.prisma           # schema do banco
```

Regra de ouro de localização:
- **Dados e regras de negócio** → `lib/actions/` (server) e `lib/` (helpers).
- **UI e interação** → `components/` e `app/`.
- Acesso ao Prisma acontece SOMENTE no servidor, nunca a partir de componente client.

## Princípio central: lógica de negócio NÃO vive no frontend

O problema recorrente deste projeto é empurrar responsabilidade pro client.
Trate o seguinte como violação a ser corrigida:

- **Cálculos, validações e regras de negócio devem estar em Server Actions**
  (`lib/actions/`), não em componentes client. Componente client cuida de UI,
  estado de tela e interação — não de regra de negócio.
- **Validação de dados** roda no servidor antes de tocar o banco, sempre. Validação
  no client é só UX (feedback rápido), nunca a única barreira.
- **`"use client"` é exceção, não padrão.** Se o componente não precisa de estado,
  efeito, ou evento de browser, ele deve ser Server Component.
- **Nenhuma query Prisma partindo do client.** Se você vê acesso a dados num
  componente client, mova pra uma Server Action.

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

## Server Actions — convenções

- Cada action faz uma operação. Se uma action faz fetch + validação +
  transformação + side effect tudo junto, separe em funções nomeadas em `lib/`.
- **Sempre autentique.** Toda action que lê/escreve dados do usuário valida a sessão
  via Clerk e garante que o recurso pertence ao usuário logado (sem isso, qualquer
  um edita treino dos outros).
- **Retorno consistente em caso de erro.** Use um shape previsível
  (ex: `{ ok: false, error: string }` / `{ ok: true, data }`) em vez de deixar
  exceções estourarem cruas no client.
- **Revalidação:** após mutação, revalide o path/tag afetado para a UI refletir.
- Não repita lógica de CRUD entre `workouts.ts` e `exercises.ts`; extraia o que
  for comum.

## React / Next.js

- Server Component é o padrão; só marque `"use client"` quando realmente precisar.
- Não faça data fetching em `useEffect` quando um Server Component ou Server Action
  resolve. Busque no servidor e passe via props.
- Componentes de `components/workouts` e `components/exercises` devem ser
  apresentacionais sempre que possível — recebem dados prontos, não buscam.
- Forms usam Server Actions diretamente (action={...}) em vez de handlers client
  que chamam fetch manual, salvo quando há interação rica que exige client.

## Sem over-engineering

- Não introduza abstrações, camadas, interfaces ou padrões que o problema não pede.
- A solução mínima que respeita a separação client/server e a tipagem forte é a
  correta. Prefira clareza a esperteza.

## Ao encontrar violações

Corrija diretamente no código. Faça commit na branch do PR e dê push. No comentário
do PR, liste cada problema encontrado e como foi corrigido, agrupado por arquivo.
Seja específico: ao mover "lógica do frontend", diga o que era, de qual componente
saiu, e pra qual action/helper foi.
