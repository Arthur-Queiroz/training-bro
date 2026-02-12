"use client";

import { MUSCLE_GROUPS } from "@/lib/constants";

interface WorkoutFormProps {
  action: (formData: FormData) => Promise<void>;
  workout?: {
    id: string;
    name: string;
    muscleGroups: string[];
  };
}

export function WorkoutForm({ action, workout }: WorkoutFormProps) {
  return (
    <form action={action} className="space-y-6">
      {workout && <input type="hidden" name="id" value={workout.id} />}

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Nome do Treino
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={workout?.name ?? ""}
          placeholder="Ex: Treino A, Peito e Tríceps..."
          required
          className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-600 dark:focus:border-zinc-400"
        />
      </div>

      <fieldset>
        <legend className="block text-sm font-medium mb-2">
          Grupos Musculares
        </legend>
        <div className="flex flex-wrap gap-2">
          {MUSCLE_GROUPS.map((group) => {
            const isChecked = workout?.muscleGroups?.includes(group) ?? false;
            return (
              <label
                key={group}
                className="flex cursor-pointer items-center gap-1.5 rounded-full border border-zinc-300 px-3 py-1.5 text-sm transition-colors has-[:checked]:border-zinc-600 has-[:checked]:bg-zinc-100 dark:border-zinc-600 dark:has-[:checked]:border-zinc-400 dark:has-[:checked]:bg-zinc-800"
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

      <button
        type="submit"
        className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {workout ? "Salvar Alterações" : "Criar Treino"}
      </button>
    </form>
  );
}
