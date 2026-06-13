import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { listWorkouts, createWorkout } from "@/lib/services/workouts";
import { ok, unauthorized, handleError } from "@/lib/api-response";
import {
  readJsonObject,
  asString,
  asOptionalStringArray,
} from "@/lib/parse-body";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return unauthorized();

  return ok(await listWorkouts(userId));
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return unauthorized();

  try {
    const body = await readJsonObject(request);
    const workout = await createWorkout(userId, {
      name: asString(body.name),
      muscleGroups: asOptionalStringArray(body.muscleGroups) ?? [],
    });
    revalidatePath("/workouts");
    return ok(workout, 201);
  } catch (e) {
    return handleError(e);
  }
}
