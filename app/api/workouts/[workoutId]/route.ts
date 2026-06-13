import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  getWorkout,
  updateWorkout,
  deleteWorkout,
} from "@/lib/services/workouts";
import { ok, unauthorized, handleError } from "@/lib/api-response";
import {
  readJsonObject,
  asOptionalString,
  asOptionalStringArray,
} from "@/lib/parse-body";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ workoutId: string }> },
) {
  const { userId } = await auth();
  if (!userId) return unauthorized();

  const { workoutId } = await params;

  try {
    return ok(await getWorkout(userId, workoutId));
  } catch (e) {
    return handleError(e);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ workoutId: string }> },
) {
  const { userId } = await auth();
  if (!userId) return unauthorized();

  const { workoutId } = await params;

  try {
    const body = await readJsonObject(request);
    await updateWorkout(userId, workoutId, {
      name: asOptionalString(body.name),
      muscleGroups: asOptionalStringArray(body.muscleGroups),
    });
    revalidatePath("/workouts");
    revalidatePath(`/workouts/${workoutId}`);
    return ok({ updated: true });
  } catch (e) {
    return handleError(e);
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
    return handleError(e);
  }
}
