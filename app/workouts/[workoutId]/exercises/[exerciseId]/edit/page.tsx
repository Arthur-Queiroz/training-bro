import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { getExercise } from "@/lib/services/exercises";
import { ExerciseForm } from "@/components/exercises/exercise-form";

export default async function EditExercisePage({
  params,
}: {
  params: Promise<{ workoutId: string; exerciseId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autenticado");

  const { workoutId, exerciseId } = await params;
  const exercise = await getExercise(userId, exerciseId);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link
        href={`/workouts/${workoutId}`}
        className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
      >
        &larr; Voltar
      </Link>
      <h1 className="mt-4 mb-6 text-2xl font-bold">Editar Exercício</h1>
      <ExerciseForm
        workoutId={workoutId}
        exercise={exercise}
      />
    </div>
  );
}