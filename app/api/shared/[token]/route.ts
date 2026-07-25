import { getSharedWorkoutByToken } from "@/lib/services/sharing";
import { ok, handleError } from "@/lib/api-response";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;
    const shared = await getSharedWorkoutByToken(token);
    return ok({
      id: shared.id,
      token: shared.token,
      workout: {
        id: shared.workout.id,
        name: shared.workout.name,
        muscleGroups: shared.workout.muscleGroups,
        exercises: shared.workout.exercises,
        clerkUserId: shared.workout.clerkUserId,
      },
    });
  } catch (e) {
    return handleError(e);
  }
}
