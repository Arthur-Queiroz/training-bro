import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { updateExercise, deleteExercise } from "@/lib/services/exercises";
import { ok, unauthorized, handleError } from "@/lib/api-response";
import {
  readJsonObject,
  asOptionalString,
  asOptionalNumber,
  asNullableString,
} from "@/lib/parse-body";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ workoutId: string; exerciseId: string }> },
) {
  const { userId } = await auth();
  if (!userId) return unauthorized();

  const { workoutId, exerciseId } = await params;

  try {
    const body = await readJsonObject(request);
    await updateExercise(userId, exerciseId, {
      name: asOptionalString(body.name),
      sets: asOptionalNumber(body.sets),
      reps: asOptionalNumber(body.reps),
      videoUrl: asNullableString(body.videoUrl),
      instructionUrl: asNullableString(body.instructionUrl),
    });
    revalidatePath(`/workouts/${workoutId}`);
    return ok({ updated: true });
  } catch (e) {
    return handleError(e);
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
    return handleError(e);
  }
}
