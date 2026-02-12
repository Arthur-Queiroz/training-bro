import Link from "next/link";

interface WorkoutCardProps {
  workout: {
    id: string;
    name: string;
    muscleGroups: string[];
    exercises: { id: string }[];
  };
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
  const exerciseCount = workout.exercises?.length ?? 0;

  return (
    <Link
      href={`/workouts/${workout.id}`}
      className="block rounded-lg border border-zinc-200 p-4 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500"
    >
      <h3 className="text-lg font-semibold">{workout.name}</h3>

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

      <p className="mt-2 text-sm text-zinc-500">
        {exerciseCount === 0
          ? "Nenhum exercício cadastrado"
          : `${exerciseCount} exercício${exerciseCount > 1 ? "s" : ""}`}
      </p>
    </Link>
  );
}
