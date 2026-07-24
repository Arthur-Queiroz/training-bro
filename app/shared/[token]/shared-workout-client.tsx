"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getWorkoutPrimaryColor } from "@/lib/workout-colors";

interface SharedExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  videoUrl: string | null;
  instructionUrl: string | null;
  sortOrder: number;
}

interface SharedWorkoutData {
  id: string;
  name: string;
  muscleGroups: string[];
  exercises: SharedExercise[];
  clerkUserId: string;
}

export function SharedWorkoutClient({ token }: { token: string }) {
  const [workout, setWorkout] = useState<SharedWorkoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchShared() {
      try {
        const res = await fetch(`/api/shared/${token}`);
        if (!res.ok) throw new Error("Treino não encontrado");
        const { data } = await res.json();
        setWorkout(data.workout);
      } catch {
        setError("Link inválido ou treino não encontrado.");
      } finally {
        setLoading(false);
      }
    }
    fetchShared();
  }, [token]);

  async function handleImport() {
    setImporting(true);
    try {
      const res = await fetch(`/api/shared/${token}/import`, {
        method: "POST",
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Erro ao importar treino");
      }
      const { data } = await res.json();
      router.push(`/workouts/${data.id}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao importar treino.");
      setImporting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
        <p className="text-[13px] text-ink-3">Carregando...</p>
      </div>
    );
  }

  if (error || !workout) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] px-4 text-center">
        <p className="text-[14px] text-ink mb-2">Ops!</p>
        <p className="text-[13px] text-ink-3">
          {error || "Link inválido ou treino não encontrado."}
        </p>
      </div>
    );
  }

  const color = getWorkoutPrimaryColor(workout.muscleGroups);

  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)] max-w-lg mx-auto lg:max-w-none">
      <div className="px-4 pt-4 pb-0 lg:px-6 lg:pt-6">
        <div className="mb-4">
          <p className="text-[11px] text-ink-3 mb-2">Treino compartilhado</p>
          <h1 className="text-[16px] font-medium text-ink mb-2">
            {workout.name}
          </h1>
          {workout.muscleGroups.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {workout.muscleGroups.map((group) => (
                <span
                  key={group}
                  className="rounded-[8px] px-2 py-0.5 text-[11px] font-medium"
                  style={{
                    backgroundColor: color.soft,
                    color: color.solid,
                  }}
                >
                  {group}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 px-4 lg:px-6">
        {workout.exercises.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-[13px] text-ink-3">Nenhum exercício</p>
          </div>
        ) : (
          <div className="divide-y divide-line">
            {workout.exercises.map((exercise, index) => (
              <div key={exercise.id} className="flex items-center gap-3 py-3">
                <div className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-[6px] bg-surface border border-line text-[11px] font-medium text-ink-3">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-ink leading-tight truncate">
                    {exercise.name}
                  </p>
                  <p className="text-[11px] text-ink-3 mt-0.5">
                    {exercise.sets} x {exercise.reps}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="sticky bottom-20 lg:bottom-0 px-4 pb-4 pt-3 lg:px-6 border-t border-line bg-base mt-4">
        <button
          onClick={handleImport}
          disabled={importing}
          className="w-full rounded-[8px] bg-accent py-2.5 text-center text-[13px] font-medium text-on-accent transition-colors hover:bg-accent-2 disabled:opacity-50"
        >
          {importing ? "Importando..." : "Importar treino"}
        </button>
      </div>
    </div>
  );
}
