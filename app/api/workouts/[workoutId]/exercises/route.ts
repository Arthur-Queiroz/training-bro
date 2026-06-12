import { auth } from "@clerk/nextjs/server";
import { createExercise } from "@/lib/services/exercises";
import { ok, err, unauthorized } from "@/lib/api-response";
import { revalidatePath } from "next/cache";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ workoutId: string }> },
) {
  const { userId } = await auth();
  if (!userId) return unauthorized();

  const { workoutId } = await params;
  const body = await request.json();
  const { name, sets, reps, videoUrl, instructionUrl } = body;

  if (!name?.trim()) return err("Nome do exercício é obrigatório");
  if (!sets || sets <= 0) return err("Séries deve ser maior que zero");
  if (!reps || reps <= 0) return err("Repetições deve ser maior que zero");

  try {
    const exercise = await createExercise(userId, workoutId, {
      name,
      sets,
      reps,
      videoUrl: videoUrl || null,
      instructionUrl: instructionUrl || null,
    });
    revalidatePath(`/workouts/${workoutId}`);
    return ok(exercise, 201);
  } catch (e) {
    return err(
      e instanceof Error ? e.message : "Erro ao criar exercício",
    );
  }
}