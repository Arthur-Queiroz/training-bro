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
      className="w-full rounded-[8px] border border-red-500/30 bg-red-500/10 py-2.5 text-[13px] font-medium text-red-400 transition-colors hover:bg-red-500/20"
    >
      Excluir treino
    </button>
  );
}
