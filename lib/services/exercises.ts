import { prisma } from "@/lib/prisma";

export interface CreateExerciseInput {
  name: string;
  sets: number;
  reps: number;
  videoUrl?: string | null;
  instructionUrl?: string | null;
}

export async function createExercise(
  userId: string,
  workoutId: string,
  input: CreateExerciseInput,
) {
  const workout = await prisma.workout.findFirst({
    where: { id: workoutId, clerkUserId: userId },
  });
  if (!workout) throw new Error("Treino não encontrado");

  if (!input.name?.trim()) throw new Error("Nome do exercício é obrigatório");
  if (!input.sets || input.sets <= 0)
    throw new Error("Séries deve ser maior que zero");
  if (!input.reps || input.reps <= 0)
    throw new Error("Repetições deve ser maior que zero");

  const lastExercise = await prisma.exercise.findFirst({
    where: { workoutId },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  const nextOrder = lastExercise ? lastExercise.sortOrder + 1 : 0;

  return prisma.exercise.create({
    data: {
      workoutId,
      name: input.name.trim(),
      sets: input.sets,
      reps: input.reps,
      videoUrl: input.videoUrl?.trim() || null,
      instructionUrl: input.instructionUrl?.trim() || null,
      sortOrder: nextOrder,
    },
  });
}

export async function getExercise(userId: string, exerciseId: string) {
  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId },
  });

  if (!exercise) throw new Error("Exercício não encontrado");

  const workout = await prisma.workout.findFirst({
    where: { id: exercise.workoutId, clerkUserId: userId },
  });
  if (!workout) throw new Error("Exercício não encontrado");

  return exercise;
}

export interface UpdateExerciseInput {
  name?: string;
  sets?: number;
  reps?: number;
  videoUrl?: string | null;
  instructionUrl?: string | null;
}

export async function updateExercise(
  userId: string,
  exerciseId: string,
  input: UpdateExerciseInput,
) {
  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId },
  });
  if (!exercise) throw new Error("Exercício não encontrado");

  const workout = await prisma.workout.findFirst({
    where: { id: exercise.workoutId, clerkUserId: userId },
  });
  if (!workout) throw new Error("Exercício não encontrado");

  if (input.name !== undefined && !input.name?.trim()) {
    throw new Error("Nome do exercício é obrigatório");
  }
  if (input.sets !== undefined && input.sets <= 0) {
    throw new Error("Séries deve ser maior que zero");
  }
  if (input.reps !== undefined && input.reps <= 0) {
    throw new Error("Repetições deve ser maior que zero");
  }

  return prisma.exercise.update({
    where: { id: exerciseId },
    data: {
      ...(input.name !== undefined && { name: input.name.trim() }),
      ...(input.sets !== undefined && { sets: input.sets }),
      ...(input.reps !== undefined && { reps: input.reps }),
      ...(input.videoUrl !== undefined && {
        videoUrl: input.videoUrl?.trim() || null,
      }),
      ...(input.instructionUrl !== undefined && {
        instructionUrl: input.instructionUrl?.trim() || null,
      }),
    },
  });
}

export async function deleteExercise(
  userId: string,
  exerciseId: string,
  workoutId: string,
) {
  const workout = await prisma.workout.findFirst({
    where: { id: workoutId, clerkUserId: userId },
  });
  if (!workout) throw new Error("Treino não encontrado");

  return prisma.exercise.delete({ where: { id: exerciseId } });
}