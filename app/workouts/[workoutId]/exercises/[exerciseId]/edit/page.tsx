import Link from "next/link";
import { updateExercise } from "@/lib/actions/exercises";
import { ExerciseForm } from "@/components/exercises/exercise-form";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export default async function EditExercisePage({
  params,
}: {
  params: Promise<{ workoutId: string; exerciseId: string }>;
}) {
  const { workoutId, exerciseId } = await params;

  const user = await currentUser();
  if (!user) throw new Error("Não autenticado");

  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId },
  });

  if (!exercise) throw new Error("Exercício não encontrado");

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link
        href={`/workouts/${workoutId}`}
        className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
      >
        &larr; Voltar
      </Link>
      <h1 className="mt-4 mb-6 text-2xl font-bold">Editar Exercício</h1>
      <ExerciseForm
        action={updateExercise}
        workoutId={workoutId}
        exercise={exercise}
      />
    </div>
  );
}
