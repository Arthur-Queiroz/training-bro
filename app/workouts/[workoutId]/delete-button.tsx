"use client";

import { deleteWorkout } from "@/lib/actions/workouts";

export function DeleteWorkoutButton({ workoutId }: { workoutId: string }) {
  return (
    <button
      onClick={async () => {
        if (confirm("Excluir este treino e todos os seus exercícios?")) {
          await deleteWorkout(workoutId);
        }
      }}
      className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
    >
      Excluir
    </button>
  );
}
