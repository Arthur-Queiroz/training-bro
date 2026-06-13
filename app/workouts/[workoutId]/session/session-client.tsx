"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  videoUrl: string | null;
  instructionUrl: string | null;
}

interface Props {
  workoutId: string;
  workoutName: string;
  muscleGroups: string[];
  exercises: Exercise[];
  color: { solid: string; soft: string };
}

export function WorkoutSessionClient({
  workoutId,
  workoutName,
  muscleGroups,
  exercises,
  color,
}: Props) {
  const router = useRouter();
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const done = checked.size;
  const total = exercises.length;
  const allDone = total > 0 && done === total;
  const progress = total > 0 ? (done / total) * 100 : 0;

  async function handleFinish() {
    const res = await fetch(`/api/workouts/${workoutId}/sessions`, {
      method: "POST",
    });
    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      alert("Erro ao registrar treino.");
    }
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)] max-w-lg mx-auto lg:max-w-none">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 lg:px-6 lg:pt-6">
        <Link
          href={`/workouts/${workoutId}`}
          className="inline-flex items-center gap-1.5 text-[12px] text-ink-3 hover:text-ink-2 transition-colors mb-3"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Voltar
        </Link>

        <h1 className="text-[16px] font-medium text-ink mb-1">
          {workoutName}
        </h1>

        {muscleGroups.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {muscleGroups.map((group) => (
              <span
                key={group}
                className="rounded-[6px] px-1.5 py-0.5 text-[11px] font-medium"
                style={{ backgroundColor: color.soft, color: color.solid }}
              >
                {group}
              </span>
            ))}
          </div>
        )}

        {/* Progress */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-ink-3">
            {done} de {total} exercícios
          </span>
          {allDone && (
            <span className="text-[11px] font-medium text-ok">
              Tudo concluído!
            </span>
          )}
        </div>
        <div className="h-1 rounded-full bg-line overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              backgroundColor: allDone ? "var(--ok)" : color.solid,
            }}
          />
        </div>
      </div>

      {/* Exercise list */}
      <div className="flex-1 px-4 lg:px-6">
        {exercises.length === 0 ? (
          <p className="text-[13px] text-ink-3 text-center py-8">
            Nenhum exercício neste treino
          </p>
        ) : (
          <div className="divide-y divide-line">
            {exercises.map((exercise) => {
              const isChecked = checked.has(exercise.id);
              return (
                <button
                  key={exercise.id}
                  onClick={() => toggle(exercise.id)}
                  className="w-full flex items-center gap-3 py-3.5 text-left transition-opacity"
                  style={{ opacity: isChecked ? 0.5 : 1 }}
                >
                  {/* Checkbox */}
                  <div
                    className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                    style={{
                      borderColor: isChecked ? "var(--ok)" : "var(--line-2)",
                      backgroundColor: isChecked ? "var(--ok)" : "transparent",
                    }}
                  >
                    {isChecked && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--on-accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[13px] font-medium text-ink transition-colors"
                      style={{ textDecoration: isChecked ? "line-through" : "none", color: isChecked ? "var(--ink-3)" : "var(--ink)" }}
                    >
                      {exercise.name}
                    </p>
                  </div>

                  {/* Sets × Reps */}
                  <span
                    className="flex-shrink-0 rounded-[6px] px-2 py-0.5 text-[11px] font-medium"
                    style={{ backgroundColor: color.soft, color: isChecked ? "var(--ink-3)" : color.solid }}
                  >
                    {exercise.sets}×{exercise.reps}
                  </span>

                  {/* Video / Instruction links */}
                  {(exercise.videoUrl || exercise.instructionUrl) && (
                    <div className="flex gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                      {exercise.videoUrl && (
                        <a
                          href={exercise.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-surface-2 text-ink-2 transition-colors hover:text-ink"
                          title="Ver vídeo"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        </a>
                      )}
                      {exercise.instructionUrl && (
                        <a
                          href={exercise.instructionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-surface-2 text-ink-2 transition-colors hover:text-ink"
                          title="Ver instruções"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                          </svg>
                        </a>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="sticky bottom-20 lg:bottom-0 px-4 pb-4 pt-3 lg:px-6 border-t border-line bg-base mt-4">
        <button
          onClick={() => startTransition(handleFinish)}
          disabled={isPending}
          className="w-full rounded-[8px] py-2.5 text-[13px] font-medium text-white transition-all disabled:opacity-50"
          style={{
            backgroundColor: allDone ? "var(--ok)" : "var(--accent)",
          }}
        >
          {isPending
            ? "Registrando..."
            : allDone
            ? "Concluir treino"
            : "Encerrar treino"}
        </button>
      </div>
    </div>
  );
}