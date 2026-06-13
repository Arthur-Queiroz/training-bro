import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";
import { startOfWeek } from "@/lib/week";

export async function logSession(userId: string, workoutId: string) {
  const workout = await prisma.workout.findFirst({
    where: { id: workoutId, clerkUserId: userId },
    select: { id: true },
  });
  if (!workout) throw new NotFoundError("Treino não encontrado");

  return prisma.workoutSession.create({
    data: { clerkUserId: userId, workoutId },
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