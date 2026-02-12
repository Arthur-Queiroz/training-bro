"use client";

interface ExerciseFormProps {
  action: (formData: FormData) => Promise<void>;
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

export function ExerciseForm({
  action,
  workoutId,
  exercise,
}: ExerciseFormProps) {
  return (
    <form action={action} className="space-y-6">
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
          type="url"
          id="video_url"
          name="video_url"
          defaultValue={exercise?.videoUrl ?? ""}
          placeholder="https://youtube.com/..."
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
          type="url"
          id="instruction_url"
          name="instruction_url"
          defaultValue={exercise?.instructionUrl ?? ""}
          placeholder="https://..."
          className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-600 dark:focus:border-zinc-400"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {exercise ? "Salvar Alterações" : "Adicionar Exercício"}
      </button>
    </form>
  );
}
