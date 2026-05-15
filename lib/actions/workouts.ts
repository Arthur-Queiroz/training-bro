"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function getWorkouts() {
  const user = await currentUser();
  if (!user) throw new Error("Não autenticado");

  return prisma.workout.findMany({
    where: { clerkUserId: user.id },
    include: { exercises: { select: { id: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getWorkout(id: string) {
  const user = await currentUser();
  if (!user) throw new Error("Não autenticado");

  const workout = await prisma.workout.findFirst({
    where: { id, clerkUserId: user.id },
    include: { exercises: { orderBy: { sortOrder: "asc" } } },
  });

  if (!workout) throw new Error("Treino não encontrado");
  return workout;
}

export async function createWorkout(formData: FormData) {
  const user = await currentUser();
  if (!user) throw new Error("Não autenticado");

  const name = formData.get("name") as string;
  const muscleGroups = formData.getAll("muscle_groups") as string[];

  if (!name?.trim()) throw new Error("Nome do treino é obrigatório");

  await prisma.workout.create({
    data: {
      clerkUserId: user.id,
      name: name.trim(),
      muscleGroups,
    },
  });

  revalidatePath("/workouts");
  redirect("/workouts");
}

export async function updateWorkout(formData: FormData) {
  const user = await currentUser();
  if (!user) throw new Error("Não autenticado");

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const muscleGroups = formData.getAll("muscle_groups") as string[];

  if (!name?.trim()) throw new Error("Nome do treino é obrigatório");

  await prisma.workout.updateMany({
    where: { id, clerkUserId: user.id },
    data: {
      name: name.trim(),
      muscleGroups,
    },
  });

  revalidatePath("/workouts");
  redirect(`/workouts/${id}`);
}

export async function deleteWorkout(id: string) {
  const user = await currentUser();
  if (!user) throw new Error("Não autenticado");

  await prisma.workout.deleteMany({
    where: { id, clerkUserId: user.id },
  });

  revalidatePath("/workouts");
  redirect("/workouts");
}

export async function logWorkoutSession(workoutId: string) {
  const user = await currentUser();
  if (!user) throw new Error("Não autenticado");

  await prisma.workoutSession.create({
    data: { clerkUserId: user.id, workoutId },
  });

  revalidatePath("/");
  redirect("/");
}

export async function getAllWorkoutSessions() {
  const user = await currentUser();
  if (!user) throw new Error("Não autenticado");

  return prisma.workoutSession.findMany({
    where: { clerkUserId: user.id },
    include: { workout: { select: { name: true, muscleGroups: true } } },
    orderBy: { performedAt: "desc" },
  });
}

export async function getWorkoutSessionsThisWeek() {
  const user = await currentUser();
  if (!user) throw new Error("Não autenticado");

  const now = new Date();
  const dow = now.getDay();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - (dow === 0 ? 6 : dow - 1));
  weekStart.setHours(0, 0, 0, 0);

  return prisma.workoutSession.findMany({
    where: { clerkUserId: user.id, performedAt: { gte: weekStart } },
    select: { performedAt: true },
  });
}
