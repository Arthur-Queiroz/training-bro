import Link from "next/link";
import { getWorkout, updateWorkout } from "@/lib/actions/workouts";
import { WorkoutForm } from "@/components/workouts/workout-form";
import { DeleteWorkoutButton } from "@/app/workouts/[workoutId]/delete-button";

export default async function EditWorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { workoutId } = await params;
  const workout = await getWorkout(workoutId);

  return (
    <div className="px-4 pt-4 pb-4 max-w-lg mx-auto lg:max-w-none lg:px-6 lg:pt-6">
      <Link
        href={`/workouts/${workoutId}`}
        className="inline-flex items-center gap-1.5 text-[12px] text-[#5E5C55] hover:text-[#9B978E] transition-colors mb-4"
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

      <h1 className="text-[16px] font-medium text-[#F0EDE6] mb-4">
        Editar treino
      </h1>

      <WorkoutForm action={updateWorkout} workout={workout} />

      <div className="mt-6 pt-4 border-t border-white/[0.06]">
        <DeleteWorkoutButton workoutId={workoutId} />
      </div>
    </div>
  );
}
