import { auth } from "@clerk/nextjs/server";
import { shareWorkout, getWorkoutShares } from "@/lib/services/sharing";
import { ok, unauthorized, handleError } from "@/lib/api-response";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ workoutId: string }> },
) {
  const { userId } = await auth();
  if (!userId) return unauthorized();

  const { workoutId } = await params;

  try {
    const share = await shareWorkout(userId, workoutId);
    return ok(share, 201);
  } catch (e) {
    return handleError(e);
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ workoutId: string }> },
) {
  const { userId } = await auth();
  if (!userId) return unauthorized();

  const { workoutId } = await params;

  try {
    const shares = await getWorkoutShares(userId, workoutId);
    return ok(shares);
  } catch (e) {
    return handleError(e);
  }
}
