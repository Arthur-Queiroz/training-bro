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
    <form action={action} className="space-y-5">
      {workout && <input type="hidden" name="id" value={workout.id} />}

      <div>
        <label
          htmlFor="name"
          className="block text-[12px] font-medium text-[#9B978E] mb-1.5"
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
          className="w-full rounded-[8px] border border-white/[0.06] bg-[#141417] px-3 py-2.5 text-[13px] text-[#F0EDE6] placeholder-[#5E5C55] outline-none transition-colors focus:border-[#E8612B]/50 focus:bg-[#1B1B1F]"
        />
      </div>

      <fieldset>
        <legend className="block text-[12px] font-medium text-[#9B978E] mb-2">
          Grupos Musculares
        </legend>
        <div className="flex flex-wrap gap-2">
          {MUSCLE_GROUPS.map((group) => {
            const isChecked = workout?.muscleGroups?.includes(group) ?? false;
            return (
              <label
                key={group}
                className="flex cursor-pointer items-center gap-1.5 rounded-[8px] border border-white/[0.06] bg-[#141417] px-3 py-1.5 text-[12px] text-[#9B978E] transition-colors has-[:checked]:border-[#E8612B]/40 has-[:checked]:bg-[#E8612B]/10 has-[:checked]:text-[#E8612B]"
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
        className="w-full rounded-[8px] bg-[#E8612B] py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[#D4511F]"
      >
        {workout ? "Salvar Alterações" : "Criar Treino"}
      </button>
    </form>
  );
}
