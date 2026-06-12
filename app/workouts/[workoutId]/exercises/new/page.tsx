import Link from "next/link";
import { ExerciseForm } from "@/components/exercises/exercise-form";

export default async function NewExercisePage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { workoutId } = await params;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link
        href={`/workouts/${workoutId}`}
        className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
      >
        &larr; Voltar
      </Link>
      <h1 className="mt-4 mb-6 text-2xl font-bold">Novo Exercício</h1>
      <ExerciseForm workoutId={workoutId} />
    </div>
  );
}
