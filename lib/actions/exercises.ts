"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createExercise(formData: FormData) {
  const user = await currentUser();
  if (!user) throw new Error("Não autenticado");

  const workoutId = formData.get("workout_id") as string;
  const name = formData.get("name") as string;
  const sets = parseInt(formData.get("sets") as string);
  const reps = parseInt(formData.get("reps") as string);
  const videoUrl = (formData.get("video_url") as string) || null;
  const instructionUrl = (formData.get("instruction_url") as string) || null;

  if (!name?.trim()) throw new Error("Nome do exercício é obrigatório");
  if (!sets || sets <= 0) throw new Error("Séries deve ser maior que zero");
  if (!reps || reps <= 0) throw new Error("Repetições deve ser maior que zero");

  const lastExercise = await prisma.exercise.findFirst({
    where: { workoutId },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  const nextOrder = lastExercise ? lastExercise.sortOrder + 1 : 0;

  await prisma.exercise.create({
    data: {
      workoutId,
      name: name.trim(),
      sets,
      reps,
      videoUrl: videoUrl?.trim() || null,
      instructionUrl: instructionUrl?.trim() || null,
      sortOrder: nextOrder,
    },
  });

  revalidatePath(`/workouts/${workoutId}`);
  redirect(`/workouts/${workoutId}`);
}

export async function updateExercise(formData: FormData) {
  const user = await currentUser();
  if (!user) throw new Error("Não autenticado");

  const id = formData.get("id") as string;
  const workoutId = formData.get("workout_id") as string;
  const name = formData.get("name") as string;
  const sets = parseInt(formData.get("sets") as string);
  const reps = parseInt(formData.get("reps") as string);
  const videoUrl = (formData.get("video_url") as string) || null;
  const instructionUrl = (formData.get("instruction_url") as string) || null;

  if (!name?.trim()) throw new Error("Nome do exercício é obrigatório");
  if (!sets || sets <= 0) throw new Error("Séries deve ser maior que zero");
  if (!reps || reps <= 0) throw new Error("Repetições deve ser maior que zero");

  await prisma.exercise.update({
    where: { id },
    data: {
      name: name.trim(),
      sets,
      reps,
      videoUrl: videoUrl?.trim() || null,
      instructionUrl: instructionUrl?.trim() || null,
    },
  });

  revalidatePath(`/workouts/${workoutId}`);
  redirect(`/workouts/${workoutId}`);
}

export async function deleteExercise(id: string, workoutId: string) {
  const user = await currentUser();
  if (!user) throw new Error("Não autenticado");

  await prisma.exercise.delete({ where: { id } });

  revalidatePath(`/workouts/${workoutId}`);
}
