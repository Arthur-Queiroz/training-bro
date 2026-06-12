import { prisma } from "@/lib/prisma";

export async function logSession(userId: string, workoutId: string) {
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
  const now = new Date();
  const dow = now.getDay();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - (dow === 0 ? 6 : dow - 1));
  weekStart.setHours(0, 0, 0, 0);

  return prisma.workoutSession.findMany({
    where: { clerkUserId: userId, performedAt: { gte: weekStart } },
    select: { performedAt: true },
  });
}