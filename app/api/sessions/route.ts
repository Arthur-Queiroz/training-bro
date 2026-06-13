import { auth } from "@clerk/nextjs/server";
import { listSessions } from "@/lib/services/sessions";
import { ok, unauthorized } from "@/lib/api-response";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return unauthorized();

  const sessions = await listSessions(userId);
  return ok(sessions);
}