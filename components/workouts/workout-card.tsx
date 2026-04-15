import Link from "next/link";
import { getWorkoutPrimaryColor } from "@/lib/workout-colors";

interface WorkoutCardProps {
  workout: {
    id: string;
    name: string;
    muscleGroups: string[];
    exercises: { id: string }[];
  };
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
  const exerciseCount = workout.exercises?.length ?? 0;
  const color = getWorkoutPrimaryColor(workout.muscleGroups);

  return (
    <Link
      href={`/workouts/${workout.id}`}
      className="flex items-start gap-3 rounded-[10px] border border-white/[0.06] bg-[#141417] p-3 transition-colors hover:bg-[#1B1B1F]"
    >
      {/* Color dot */}
      <span
        className="mt-[3px] h-2 w-2 flex-shrink-0 rounded-full"
        style={{ backgroundColor: color.solid }}
      />

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium text-[#F0EDE6] leading-tight">
          {workout.name}
        </p>

        {workout.muscleGroups.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {workout.muscleGroups.map((group) => (
              <span
                key={group}
                className="rounded-[8px] px-1.5 py-0.5 text-[11px] font-medium"
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

        <p className="mt-1.5 text-[11px] text-[#5E5C55]">
          {exerciseCount === 0
            ? "Nenhum exercício"
            : `${exerciseCount} exercício${exerciseCount > 1 ? "s" : ""}`}
        </p>
      </div>
    </Link>
  );
}
