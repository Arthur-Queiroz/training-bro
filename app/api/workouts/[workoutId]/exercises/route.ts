import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createExercise } from "@/lib/services/exercises";
import { ok, unauthorized, handleError } from "@/lib/api-response";
import {
  readJsonObject,
  asString,
  asNumber,
  asNullableString,
} from "@/lib/parse-body";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ workoutId: string }> },
) {
  const { userId } = await auth();
  if (!userId) return unauthorized();

  const { workoutId } = await params;

  try {
    const body = await readJsonObject(request);
    const exercise = await createExercise(userId, workoutId, {
      name: asString(body.name),
      sets: asNumber(body.sets),
      reps: asNumber(body.reps),
      videoUrl: asNullableString(body.videoUrl),
      instructionUrl: asNullableString(body.instructionUrl),
    });
    revalidatePath(`/workouts/${workoutId}`);
    return ok(exercise, 201);
  } catch (e) {
    return handleError(e);
  }
}
