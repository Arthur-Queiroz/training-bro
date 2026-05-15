import Link from "next/link";
import { getWorkout } from "@/lib/actions/workouts";
import { ExerciseCard } from "@/components/exercises/exercise-card";
import { getWorkoutPrimaryColor } from "@/lib/workout-colors";

export default async function WorkoutDetailPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { workoutId } = await params;
  const workout = await getWorkout(workoutId);
  const color = getWorkoutPrimaryColor(workout.muscleGroups);

  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)] max-w-lg mx-auto lg:max-w-none">
      {/* Back + header */}
      <div className="px-4 pt-4 pb-0 lg:px-6 lg:pt-6">
        <Link
          href="/workouts"
          className="inline-flex items-center gap-1.5 text-[12px] text-[#5E5C55] hover:text-[#9B978E] transition-colors mb-3"
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

        <div className="mb-4">
          <h1 className="text-[16px] font-medium text-[#F0EDE6] mb-2">
            {workout.name}
          </h1>
          {workout.muscleGroups.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {workout.muscleGroups.map((group) => (
                <span
                  key={group}
                  className="rounded-[8px] px-2 py-0.5 text-[11px] font-medium"
                  style={{
                    backgroundColor: color.soft,
                    color: color.solid,
                  }}
                >
                  {group}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Exercise list */}
      <div className="flex-1 px-4 lg:px-6">
        {workout.exercises.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-[13px] text-[#5E5C55] mb-4">
              Nenhum exercício ainda
            </p>
            <Link
              href={`/workouts/${workoutId}/exercises/new`}
              className="rounded-[8px] bg-[#E8612B] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#D4511F]"
            >
              Adicionar exercício
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {workout.exercises.map((exercise, index) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                workoutId={workoutId}
                index={index + 1}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="sticky bottom-20 lg:bottom-0 px-4 pb-4 pt-3 lg:px-6 border-t border-white/[0.06] bg-[#0b0b0d] mt-4">
        <div className="flex gap-2">
          <Link
            href={`/workouts/${workoutId}/edit`}
            className="rounded-[8px] border border-white/[0.06] bg-[#141417] px-4 py-2.5 text-center text-[13px] font-medium text-[#F0EDE6] transition-colors hover:bg-[#1B1B1F]"
          >
            Editar
          </Link>
          <Link
            href={`/workouts/${workoutId}/session`}
            className="flex-1 rounded-[8px] bg-[#E8612B] py-2.5 text-center text-[13px] font-medium text-white transition-colors hover:bg-[#D4511F]"
          >
            Iniciar treino
          </Link>
        </div>
      </div>
    </div>
  );
}
