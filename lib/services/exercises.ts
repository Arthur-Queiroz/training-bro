import { prisma } from "@/lib/prisma";
import { NotFoundError, ValidationError } from "@/lib/errors";

/**
 * Normaliza um link opcional: vazio vira null; sem esquema ganha https://
 * (ex: "youtube.com/x" → "https://youtube.com/x"); só aceita http(s) —
 * bloqueia esquemas perigosos como javascript:, que seriam renderizados
 * em <a href> na UI.
 */
function normalizeLinkUrl(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(trimmed);
  const candidate = hasScheme ? trimmed : `https://${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    throw new ValidationError("Link inválido: use uma URL completa");
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new ValidationError("Link inválido: só são aceitos http(s)");
  }
  return candidate;
}

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
  if (!workout) throw new NotFoundError("Treino não encontrado");

  if (!input.name.trim())
    throw new ValidationError("Nome do exercício é obrigatório");
  if (input.sets <= 0)
    throw new ValidationError("Séries deve ser maior que zero");
  if (input.reps <= 0)
    throw new ValidationError("Repetições deve ser maior que zero");

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
      videoUrl: normalizeLinkUrl(input.videoUrl),
      instructionUrl: normalizeLinkUrl(input.instructionUrl),
      sortOrder: nextOrder,
    },
  });
}

export async function getExercise(userId: string, exerciseId: string) {
  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId },
  });

  if (!exercise) throw new NotFoundError("Exercício não encontrado");

  const workout = await prisma.workout.findFirst({
    where: { id: exercise.workoutId, clerkUserId: userId },
  });
  if (!workout) throw new NotFoundError("Exercício não encontrado");

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
  if (!exercise) throw new NotFoundError("Exercício não encontrado");

  const workout = await prisma.workout.findFirst({
    where: { id: exercise.workoutId, clerkUserId: userId },
  });
  if (!workout) throw new NotFoundError("Exercício não encontrado");

  if (input.name !== undefined && !input.name.trim()) {
    throw new ValidationError("Nome do exercício é obrigatório");
  }
  if (input.sets !== undefined && input.sets <= 0) {
    throw new ValidationError("Séries deve ser maior que zero");
  }
  if (input.reps !== undefined && input.reps <= 0) {
    throw new ValidationError("Repetições deve ser maior que zero");
  }

  return prisma.exercise.update({
    where: { id: exerciseId },
    data: {
      ...(input.name !== undefined && { name: input.name.trim() }),
      ...(input.sets !== undefined && { sets: input.sets }),
      ...(input.reps !== undefined && { reps: input.reps }),
      ...(input.videoUrl !== undefined && {
        videoUrl: normalizeLinkUrl(input.videoUrl),
      }),
      ...(input.instructionUrl !== undefined && {
        instructionUrl: normalizeLinkUrl(input.instructionUrl),
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
  if (!workout) throw new NotFoundError("Treino não encontrado");

  // Escopa a exclusão ao treino do usuário: garante que o exercício pertence a
  // ESTE treino, e não a outro (possivelmente de outro usuário).
  const result = await prisma.exercise.deleteMany({
    where: { id: exerciseId, workoutId },
  });
  if (result.count === 0) throw new NotFoundError("Exercício não encontrado");

  return result;
}