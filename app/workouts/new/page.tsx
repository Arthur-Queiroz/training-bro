import Link from "next/link";
import { createWorkout } from "@/lib/actions/workouts";
import { WorkoutForm } from "@/components/workouts/workout-form";

export default function NewWorkoutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link
        href="/workouts"
        className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
      >
        &larr; Voltar
      </Link>
      <h1 className="mt-4 mb-6 text-2xl font-bold">Novo Treino</h1>
      <WorkoutForm action={createWorkout} />
    </div>
  );
}
