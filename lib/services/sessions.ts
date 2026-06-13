import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";
import { startOfWeek } from "@/lib/week";

export interface LogSessionInput {
  /** IDs dos exercícios marcados como feitos no checklist da sessão. */
  completedExerciseIds?: string[];
  /** Quantos exercícios o treino tinha no momento (congela o "X de Y"). */
  totalExercises?: number;
}

export async function logSession(
  userId: string,
  workoutId: string,
  input: LogSessionInput = {},
) {
  const workout = await prisma.workout.findFirst({
    where: { id: workoutId, clerkUserId: userId },
    select: { id: true },
  });
  if (!workout) throw new NotFoundError("Treino não encontrado");

  return prisma.workoutSession.create({
    data: {
      clerkUserId: userId,
      workoutId,
      completedExerciseIds: input.completedExerciseIds ?? [],
      totalExercises: input.totalExercises ?? 0,
    },
  });
}

export async function listSessions(userId: string) {
  return prisma.workoutSession.findMany({
    where: { clerkUserId: userId },
    include: { workout: { select: { name: true, muscleGroups: true } } },
    orderBy: { performedAt: "desc" },
  });
}

export async function getSessionsThisWeek(userId: string) {
  return prisma.workoutSession.findMany({
    where: { clerkUserId: userId, performedAt: { gte: startOfWeek(new Date()) } },
    select: { performedAt: true },
  });
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Sequência de semanas: quantas semanas consecutivas (terminando na atual) o
 * usuário treinou pelo menos uma vez. Semana começa na segunda.
 *
 * Escolhemos semanas e não dias porque treino de academia tem dias de
 * descanso — um "dias seguidos" quebraria a cada folga. A semana atual ainda
 * em andamento não zera a sequência: se ela ainda não tem treino, contamos a
 * partir da semana passada (você não "perde" a sequência só por ser segunda
 * de manhã).
 */
export async function getStreak(userId: string): Promise<number> {
  const sessions = await prisma.workoutSession.findMany({
    where: { clerkUserId: userId },
    select: { performedAt: true },
  });

  // Semanas (segunda 00:00, como timestamp) que têm ao menos uma sessão.
  const weeksWithSession = new Set(
    sessions.map((s) => startOfWeek(s.performedAt).getTime()),
  );

  // Recua uma semana de forma robusta a horário de verão: voltar um dia a
  // partir de segunda 00:00 cai na semana anterior, e startOfWeek normaliza.
  const previousWeek = (monday: Date) =>
    startOfWeek(new Date(monday.getTime() - DAY_MS));

  let cursor = startOfWeek(new Date());
  if (!weeksWithSession.has(cursor.getTime())) {
    cursor = previousWeek(cursor);
  }

  let streak = 0;
  while (weeksWithSession.has(cursor.getTime())) {
    streak++;
    cursor = previousWeek(cursor);
  }
  return streak;
}