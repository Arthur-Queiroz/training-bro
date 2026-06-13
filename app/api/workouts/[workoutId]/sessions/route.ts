import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { logSession } from "@/lib/services/sessions";
import { ok, unauthorized, handleError } from "@/lib/api-response";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ workoutId: string }> },
) {
  const { userId } = await auth();
  if (!userId) return unauthorized();

  const { workoutId } = await params;

  try {
    const session = await logSession(userId, workoutId);
    revalidatePath("/");
    return ok(session, 201);
  } catch (e) {
    return handleError(e);
  }
}
