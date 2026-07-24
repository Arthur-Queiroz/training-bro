import { auth } from "@clerk/nextjs/server";
import { importSharedWorkout } from "@/lib/services/sharing";
import { ok, unauthorized, handleError } from "@/lib/api-response";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { userId } = await auth();
  if (!userId) return unauthorized();

  try {
    const { token } = await params;
    const result = await importSharedWorkout(userId, token);
    return ok(result, 201);
  } catch (e) {
    return handleError(e);
  }
}
