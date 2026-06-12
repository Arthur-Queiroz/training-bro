import { auth } from "@clerk/nextjs/server";
import { getWorkout } from "@/lib/services/workouts";
import { or404 } from "@/lib/or-404";
import { getWorkoutPrimaryColor } from "@/lib/workout-colors";
import { WorkoutSessionClient } from "./session-client";

export default async function WorkoutSessionPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autenticado");
  const { workoutId } = await params;
  const workout = await or404(getWorkout(userId, workoutId));
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
