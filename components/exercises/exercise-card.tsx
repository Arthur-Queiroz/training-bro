"use client";

import Link from "next/link";
import { deleteExercise } from "@/lib/actions/exercises";

interface ExerciseCardProps {
  exercise: {
    id: string;
    workoutId: string;
    name: string;
    sets: number;
    reps: number;
    videoUrl: string | null;
    instructionUrl: string | null;
    sortOrder: number;
  };
  workoutId: string;
}

export function ExerciseCard({ exercise, workoutId }: ExerciseCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
      <div className="flex-1">
        <p className="font-medium">
          {exercise.name}{" "}
          <span className="text-zinc-500">
            - {exercise.sets}x{exercise.reps}
          </span>
        </p>

        {(exercise.videoUrl || exercise.instructionUrl) && (
          <div className="mt-1 flex gap-3 text-xs">
            {exercise.videoUrl && (
              <a
                href={exercise.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Video
              </a>
            )}
            {exercise.instructionUrl && (
              <a
                href={exercise.instructionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Instruções
              </a>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 ml-4">
        <Link
          href={`/workouts/${workoutId}/exercises/${exercise.id}/edit`}
          className="rounded px-2 py-1 text-xs text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        >
          Editar
        </Link>
        <button
          onClick={async () => {
            if (confirm("Excluir este exercício?")) {
              await deleteExercise(exercise.id, workoutId);
            }
          }}
          className="rounded px-2 py-1 text-xs text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950"
        >
          Excluir
        </button>
      </div>
    </div>
  );
}
