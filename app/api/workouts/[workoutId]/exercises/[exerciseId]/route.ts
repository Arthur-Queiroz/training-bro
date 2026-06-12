import { auth } from "@clerk/nextjs/server";
import { updateExercise, deleteExercise } from "@/lib/services/exercises";
import { ok, err, unauthorized, notFound } from "@/lib/api-response";
import { revalidatePath } from "next/cache";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ workoutId: string; exerciseId: string }> },
) {
  const { userId } = await auth();
  if (!userId) return unauthorized();

  const { workoutId, exerciseId } = await params;
  const body = await request.json();

  try {
    const exercise = await updateExercise(userId, exerciseId, {
      ...body,
      videoUrl: body.videoUrl ?? null,
      instructionUrl: body.instructionUrl ?? null,
    });
    revalidatePath(`/workouts/${workoutId}`);
    return ok(exercise);
  } catch (e) {
    if (e instanceof Error && e.message === "Exercício não encontrado") {
      return notFound(e.message);
    }
    return err(
      e instanceof Error ? e.message : "Erro ao atualizar exercício",
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ workoutId: string; exerciseId: string }> },
) {
  const { userId } = await auth();
  if (!userId) return unauthorized();

  const { workoutId, exerciseId } = await params;

  try {
    await deleteExercise(userId, exerciseId, workoutId);
    revalidatePath(`/workouts/${workoutId}`);
    return ok({ deleted: true });
  } catch (e) {
    return err(
      e instanceof Error ? e.message : "Erro ao excluir exercício",
    );
  }
}