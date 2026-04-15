"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
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
  index: number;
}

export function ExerciseCard({ exercise, workoutId, index }: ExerciseCardProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="flex items-center gap-3 py-3">
      {/* Number badge */}
      <div className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-[6px] bg-[#141417] border border-white/[0.06] text-[11px] font-medium text-[#5E5C55]">
        {index}
      </div>

      {/* Name + sets/reps */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[#F0EDE6] leading-tight truncate">
          {exercise.name}
        </p>
        <p className="text-[11px] text-[#5E5C55] mt-0.5">
          {exercise.sets} x {exercise.reps}
        </p>
      </div>

      {/* "..." menu */}
      <div className="relative flex-shrink-0" ref={menuRef}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-7 w-7 items-center justify-center rounded-[6px] text-[#5E5C55] transition-colors hover:bg-white/[0.06] hover:text-[#9B978E]"
          aria-label="Opções"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
          </svg>
        </button>

        {open && (
          <div className="absolute right-0 top-8 z-10 min-w-[120px] rounded-[8px] border border-white/[0.06] bg-[#1B1B1F] py-1 shadow-xl">
            <Link
              href={`/workouts/${workoutId}/exercises/${exercise.id}/edit`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-[12px] text-[#F0EDE6] transition-colors hover:bg-white/[0.06]"
            >
              Editar
            </Link>
            <button
              onClick={async () => {
                setOpen(false);
                if (confirm("Excluir este exercício?")) {
                  await deleteExercise(exercise.id, workoutId);
                }
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-[12px] text-[#E24B4A] transition-colors hover:bg-[#E24B4A]/10"
            >
              Excluir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
