import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { getExercise } from "@/lib/services/exercises";
import { or404 } from "@/lib/or-404";
import { ExerciseForm } from "@/components/exercises/exercise-form";

export default async function EditExercisePage({
  params,
}: {
  params: Promise<{ workoutId: string; exerciseId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autenticado");

  const { workoutId, exerciseId } = await params;
  const exercise = await or404(getExercise(userId, exerciseId));

  return (
    <div className="px-4 pt-4 pb-4 max-w-lg mx-auto lg:max-w-none lg:px-6 lg:pt-6">
      <Link
        href={`/workouts/${workoutId}`}
        className="inline-flex items-center gap-1.5 text-[12px] text-ink-3 hover:text-ink-2 transition-colors mb-4"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Voltar
      </Link>
      <h1 className="text-[16px] font-medium text-ink mb-5">
        Editar exercício
      </h1>
      <ExerciseForm workoutId={workoutId} exercise={exercise} />
    </div>
  );
}
