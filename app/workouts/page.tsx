import Link from "next/link";
import { getWorkouts } from "@/lib/actions/workouts";
import { WorkoutCard } from "@/components/workouts/workout-card";

export default async function WorkoutsPage() {
  const workouts = await getWorkouts();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Meus Treinos</h1>
        <Link
          href="/workouts/new"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Novo Treino
        </Link>
      </div>

      {workouts.length === 0 ? (
        <p className="text-center text-zinc-500 py-12">
          Nenhum treino cadastrado ainda. Crie seu primeiro treino!
        </p>
      ) : (
        <div className="space-y-3">
          {workouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      )}
    </div>
  );
}
