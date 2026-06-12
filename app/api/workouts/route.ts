import { auth } from "@clerk/nextjs/server";
import { listWorkouts, createWorkout } from "@/lib/services/workouts";
import { ok, err, unauthorized } from "@/lib/api-response";
import { revalidatePath } from "next/cache";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return unauthorized();

  const workouts = await listWorkouts(userId);
  return ok(workouts);
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return unauthorized();

  const body = await request.json();
  const { name, muscleGroups } = body;

  if (!name?.trim()) return err("Nome do treino é obrigatório");

  try {
    const workout = await createWorkout(userId, {
      name,
      muscleGroups: muscleGroups ?? [],
    });
    revalidatePath("/workouts");
    return ok(workout, 201);
  } catch (e) {
    return err(e instanceof Error ? e.message : "Erro ao criar treino");
  }
}