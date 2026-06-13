"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MUSCLE_GROUPS } from "@/lib/constants";

interface WorkoutFormProps {
  workout?: {
    id: string;
    name: string;
    muscleGroups: string[];
  };
}

export function WorkoutForm({ workout }: WorkoutFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const name = fd.get("name") as string;
    const muscleGroups = fd.getAll("muscle_groups") as string[];

    try {
      const url = workout
        ? `/api/workouts/${workout.id}`
        : "/api/workouts";
      const method = workout ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, muscleGroups }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao salvar treino");
      }

      router.push(workout ? `/workouts/${workout.id}` : "/workouts");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao salvar treino");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {workout && <input type="hidden" name="id" value={workout.id} />}

      <div>
        <label
          htmlFor="name"
          className="block text-[12px] font-medium text-ink-2 mb-1.5"
        >
          Nome do Treino
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={workout?.name ?? ""}
          placeholder="Ex: Treino A, Peito e Tríceps..."
          required
          className="w-full rounded-[8px] border border-line bg-surface px-3 py-2.5 text-[13px] text-ink placeholder-ink-3 outline-none transition-colors focus:border-accent/50 focus:bg-surface-2"
        />
      </div>

      <fieldset>
        <legend className="block text-[12px] font-medium text-ink-2 mb-2">
          Grupos Musculares
        </legend>
        <div className="flex flex-wrap gap-2">
          {MUSCLE_GROUPS.map((group) => {
            const isChecked = workout?.muscleGroups?.includes(group) ?? false;
            return (
              <label
                key={group}
                className="flex cursor-pointer items-center gap-1.5 rounded-[8px] border border-line bg-surface px-3 py-1.5 text-[12px] text-ink-2 transition-colors has-[:checked]:border-accent/40 has-[:checked]:bg-accent/10 has-[:checked]:text-accent"
              >
                <input
                  type="checkbox"
                  name="muscle_groups"
                  value={group}
                  defaultChecked={isChecked}
                  className="sr-only"
                />
                {group}
              </label>
            );
          })}
        </div>
      </fieldset>

      {error && (
        <p className="text-[12px] text-danger">{error}</p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-[8px] bg-accent py-2.5 text-[13px] font-medium text-on-accent transition-colors hover:bg-accent-2 disabled:opacity-50"
      >
        {saving ? "Salvando..." : workout ? "Salvar Alterações" : "Criar Treino"}
      </button>
    </form>
  );
}