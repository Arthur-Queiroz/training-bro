import Link from "next/link";
import { getWorkouts } from "@/lib/actions/workouts";
import { WorkoutCard } from "@/components/workouts/workout-card";

export default async function WorkoutsPage() {
  const workouts = await getWorkouts();

  return (
    <div className="px-4 pt-4 pb-4 max-w-lg mx-auto lg:max-w-none lg:px-6 lg:pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[16px] font-medium text-[#F0EDE6]">
          Meus treinos
        </h1>
        <Link
          href="/workouts/new"
          className="flex h-7 w-7 items-center justify-center rounded-[7px] border border-white/[0.06] bg-[#141417] text-[#9B978E] transition-colors hover:text-[#F0EDE6]"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </Link>
      </div>

      {workouts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-[13px] text-[#5E5C55] mb-4">
            Nenhum treino cadastrado ainda
          </p>
          <Link
            href="/workouts/new"
            className="rounded-[8px] bg-[#E8612B] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#D4511F]"
          >
            Criar primeiro treino
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {workouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      )}
    </div>
  );
}
