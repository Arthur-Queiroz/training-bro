import { auth } from "@clerk/nextjs/server";
import { getWorkout, updateWorkout, deleteWorkout } from "@/lib/services/workouts";
import { ok, err, unauthorized, notFound } from "@/lib/api-response";
import { revalidatePath } from "next/cache";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ workoutId: string }> },
) {
  const { userId } = await auth();
  if (!userId) return unauthorized();

  const { workoutId } = await params;

  try {
    const workout = await getWorkout(userId, workoutId);
    return ok(workout);
  } catch (e) {
    if (e instanceof Error && e.message === "Treino não encontrado") {
      return notFound(e.message);
    }
    return err(e instanceof Error ? e.message : "Erro ao buscar treino");
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ workoutId: string }> },
) {
  const { userId } = await auth();
  if (!userId) return unauthorized();

  const { workoutId } = await params;
  const body = await request.json();

  try {
    const result = await updateWorkout(userId, workoutId, body);
    revalidatePath("/workouts");
    revalidatePath(`/workouts/${workoutId}`);
    return ok(result);
  } catch (e) {
    return err(e instanceof Error ? e.message : "Erro ao atualizar treino");
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ workoutId: string }> },
) {
  const { userId } = await auth();
  if (!userId) return unauthorized();

  const { workoutId } = await params;

  try {
    await deleteWorkout(userId, workoutId);
    revalidatePath("/workouts");
    return ok({ deleted: true });
  } catch (e) {
    return err(e instanceof Error ? e.message : "Erro ao excluir treino");
  }
}