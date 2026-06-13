"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface ExerciseFormProps {
  workoutId: string;
  exercise?: {
    id: string;
    name: string;
    sets: number;
    reps: number;
    videoUrl: string | null;
    instructionUrl: string | null;
  };
}

export function ExerciseForm({ workoutId, exercise }: ExerciseFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const name = fd.get("name") as string;
    const sets = parseInt(fd.get("sets") as string);
    const reps = parseInt(fd.get("reps") as string);
    const videoUrl = (fd.get("video_url") as string) || null;
    const instructionUrl = (fd.get("instruction_url") as string) || null;

    try {
      const url = exercise
        ? `/api/workouts/${workoutId}/exercises/${exercise.id}`
        : `/api/workouts/${workoutId}/exercises`;
      const method = exercise ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, sets, reps, videoUrl, instructionUrl }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao salvar exercício");
      }

      router.push(`/workouts/${workoutId}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao salvar exercício");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="workout_id" value={workoutId} />
      {exercise && <input type="hidden" name="id" value={exercise.id} />}

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Nome do Exercício
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={exercise?.name ?? ""}
          placeholder="Ex: Supino Reto, Agachamento..."
          required
          className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-600 dark:focus:border-zinc-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="sets" className="block text-sm font-medium mb-1">
            Séries
          </label>
          <input
            type="number"
            id="sets"
            name="sets"
            min={1}
            defaultValue={exercise?.sets ?? 3}
            required
            className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-600 dark:focus:border-zinc-400"
          />
        </div>
        <div>
          <label htmlFor="reps" className="block text-sm font-medium mb-1">
            Repetições
          </label>
          <input
            type="number"
            id="reps"
            name="reps"
            min={1}
            defaultValue={exercise?.reps ?? 12}
            required
            className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-600 dark:focus:border-zinc-400"
          />
        </div>
      </div>

      <div>
        <label htmlFor="video_url" className="block text-sm font-medium mb-1">
          Link de Vídeo <span className="text-zinc-400">(opcional)</span>
        </label>
        <input
          type="text"
          inputMode="url"
          id="video_url"
          name="video_url"
          defaultValue={exercise?.videoUrl ?? ""}
          placeholder="youtube.com/..."
          className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-600 dark:focus:border-zinc-400"
        />
      </div>

      <div>
        <label
          htmlFor="instruction_url"
          className="block text-sm font-medium mb-1"
        >
          Link de Instruções <span className="text-zinc-400">(opcional)</span>
        </label>
        <input
          type="text"
          inputMode="url"
          id="instruction_url"
          name="instruction_url"
          defaultValue={exercise?.instructionUrl ?? ""}
          placeholder="exemplo.com/..."
          className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-600 dark:focus:border-zinc-400"
        />
      </div>

      {error && (
        <p className="text-[12px] text-[#E24B4A]">{error}</p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 disabled:opacity-50"
      >
        {saving ? "Salvando..." : exercise ? "Salvar Alterações" : "Adicionar Exercício"}
      </button>
    </form>
  );
}