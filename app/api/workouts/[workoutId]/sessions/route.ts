import { auth } from "@clerk/nextjs/server";
import { logSession } from "@/lib/services/sessions";
import { ok, err, unauthorized } from "@/lib/api-response";
import { revalidatePath } from "next/cache";

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
    return err(
      e instanceof Error ? e.message : "Erro ao registrar sessão",
    );
  }
}