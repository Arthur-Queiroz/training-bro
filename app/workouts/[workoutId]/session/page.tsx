import { getWorkout } from "@/lib/actions/workouts";
import { getWorkoutPrimaryColor } from "@/lib/workout-colors";
import { WorkoutSessionClient } from "./session-client";

export default async function WorkoutSessionPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { workoutId } = await params;
  const workout = await getWorkout(workoutId);
  const color = getWorkoutPrimaryColor(workout.muscleGroups);

  return (
    <WorkoutSessionClient
      workoutId={workoutId}
      workoutName={workout.name}
      muscleGroups={workout.muscleGroups}
      exercises={workout.exercises.map((e) => ({
        id: e.id,
        name: e.name,
        sets: e.sets,
        reps: e.reps,
        videoUrl: e.videoUrl ?? null,
        instructionUrl: e.instructionUrl ?? null,
      }))}
      color={color}
    />
  );
}
