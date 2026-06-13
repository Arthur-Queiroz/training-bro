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