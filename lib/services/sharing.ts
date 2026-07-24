import { prisma } from "@/lib/prisma";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { randomBytes } from "crypto";

function generateToken(): string {
  return randomBytes(16).toString("hex");
}

export async function shareWorkout(userId: string, workoutId: string) {
  const workout = await prisma.workout.findFirst({
    where: { id: workoutId, clerkUserId: userId },
  });

  if (!workout) throw new NotFoundError("Treino não encontrado");

  const token = generateToken();

  return prisma.sharedWorkout.create({
    data: {
      token,
      workoutId,
      clerkUserId: userId,
    },
  });
}

export async function getSharedWorkoutByToken(token: string) {
  const shared = await prisma.sharedWorkout.findUnique({
    where: { token },
    include: {
      workout: {
        include: {
          exercises: { orderBy: { sortOrder: "asc" } },
        },
      },
    },
  });

  if (!shared) throw new NotFoundError("Link de compartilhamento inválido");
  return shared;
}

export async function getWorkoutShares(userId: string, workoutId: string) {
  return prisma.sharedWorkout.findMany({
    where: { workoutId, clerkUserId: userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function revokeShare(userId: string, token: string) {
  const deleted = await prisma.sharedWorkout.deleteMany({
    where: { token, clerkUserId: userId },
  });

  if (deleted.count === 0) throw new NotFoundError("Link não encontrado");
}

export interface ImportSharedWorkoutResult {
  id: string;
}

export async function importSharedWorkout(
  userId: string,
  token: string,
): Promise<ImportSharedWorkoutResult> {
  const shared = await prisma.sharedWorkout.findUnique({
    where: { token },
    include: {
      workout: {
        include: {
          exercises: { orderBy: { sortOrder: "asc" } },
        },
      },
    },
  });

  if (!shared) throw new NotFoundError("Link de compartilhamento inválido");

  const source = shared.workout;

  if (source.clerkUserId === userId) {
    throw new ValidationError("Você não pode importar seu próprio treino");
  }

  const copied = await prisma.workout.create({
    data: {
      clerkUserId: userId,
      name: source.name,
      muscleGroups: source.muscleGroups,
      exercises: {
        create: source.exercises.map((ex) => ({
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          videoUrl: ex.videoUrl,
          instructionUrl: ex.instructionUrl,
          sortOrder: ex.sortOrder,
        })),
      },
    },
  });

  return { id: copied.id };
}
