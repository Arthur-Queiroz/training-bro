import Link from "next/link";
import { getWorkout } from "@/lib/actions/workouts";
import { DeleteWorkoutButton } from "./delete-button";
import { ExerciseCard } from "@/components/exercises/exercise-card";

export default async function WorkoutDetailPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { workoutId } = await params;
  const workout = await getWorkout(workoutId);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link
        href="/workouts"
        className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
      >
        &larr; Voltar
      </Link>

      <div className="mt-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{workout.name}</h1>
          {workout.muscleGroups.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {workout.muscleGroups.map((group) => (
                <span
                  key={group}
                  className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  {group}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/workouts/${workoutId}/edit`}
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-800"
          >
            Editar
          </Link>
          <DeleteWorkoutButton workoutId={workoutId} />
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Exercícios</h2>
          <Link
            href={`/workouts/${workoutId}/exercises/new`}
            className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Adicionar
          </Link>
        </div>

        {workout.exercises.length === 0 ? (
          <p className="text-center text-zinc-500 py-8">
            Nenhum exercício cadastrado. Adicione seu primeiro exercício!
          </p>
        ) : (
          <div className="space-y-2">
            {workout.exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                workoutId={workoutId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
