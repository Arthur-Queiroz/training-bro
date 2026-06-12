import { prisma } from "@/lib/prisma";

export async function listWorkouts(userId: string) {
  return prisma.workout.findMany({
    where: { clerkUserId: userId },
    include: { exercises: { select: { id: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getWorkout(userId: string, id: string) {
  const workout = await prisma.workout.findFirst({
    where: { id, clerkUserId: userId },
    include: { exercises: { orderBy: { sortOrder: "asc" } } },
  });

  if (!workout) throw new Error("Treino não encontrado");
  return workout;
}

export interface CreateWorkoutInput {
  name: string;
  muscleGroups: string[];
}

export async function createWorkout(userId: string, input: CreateWorkoutInput) {
  if (!input.name?.trim()) throw new Error("Nome do treino é obrigatório");

  return prisma.workout.create({
    data: {
      clerkUserId: userId,
      name: input.name.trim(),
      muscleGroups: input.muscleGroups,
    },
  });
}

export interface UpdateWorkoutInput {
  name?: string;
  muscleGroups?: string[];
}

export async function updateWorkout(
  userId: string,
  id: string,
  input: UpdateWorkoutInput,
) {
  if (input.name !== undefined && !input.name?.trim()) {
    throw new Error("Nome do treino é obrigatório");
  }

  return prisma.workout.updateMany({
    where: { id, clerkUserId: userId },
    data: {
      ...(input.name !== undefined && { name: input.name.trim() }),
      ...(input.muscleGroups !== undefined && {
        muscleGroups: input.muscleGroups,
      }),
    },
  });
}

export async function deleteWorkout(userId: string, id: string) {
  return prisma.workout.deleteMany({
    where: { id, clerkUserId: userId },
  });
}