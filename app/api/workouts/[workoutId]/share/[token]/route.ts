import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { revokeShare } from "@/lib/services/sharing";
import { ok, unauthorized, handleError } from "@/lib/api-response";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ workoutId: string; token: string }> },
) {
  const { userId } = await auth();
  if (!userId) return unauthorized();

  const { workoutId, token } = await params;

  try {
    await revokeShare(userId, token);
    revalidatePath(`/workouts/${workoutId}`);
    return ok({ revoked: true });
  } catch (e) {
    return handleError(e);
  }
}
