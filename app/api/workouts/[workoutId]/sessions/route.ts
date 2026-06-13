import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { logSession } from "@/lib/services/sessions";
import { ok, unauthorized, handleError } from "@/lib/api-response";
import {
  readJsonObject,
  asOptionalStringArray,
  asOptionalNumber,
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
    const session = await logSession(userId, workoutId, {
      completedExerciseIds: asOptionalStringArray(body.completedExerciseIds),
      totalExercises: asOptionalNumber(body.totalExercises),
    });
    revalidatePath("/");
    revalidatePath("/history");
    return ok(session, 201);
  } catch (e) {
    return handleError(e);
  }
}
