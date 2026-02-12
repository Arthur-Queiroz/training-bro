import Link from "next/link";
import { getWorkout, updateWorkout } from "@/lib/actions/workouts";
import { WorkoutForm } from "@/components/workouts/workout-form";

export default async function EditWorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { workoutId } = await params;
  const workout = await getWorkout(workoutId);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link
        href={`/workouts/${workoutId}`}
        className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
      >
        &larr; Voltar
      </Link>
      <h1 className="mt-4 mb-6 text-2xl font-bold">Editar Treino</h1>
      <WorkoutForm action={updateWorkout} workout={workout} />
    </div>
  );
}
