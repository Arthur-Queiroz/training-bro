-- AlterTable
ALTER TABLE "workout_sessions" ADD COLUMN     "completed_exercise_ids" UUID[] DEFAULT ARRAY[]::UUID[],
ADD COLUMN     "total_exercises" INTEGER NOT NULL DEFAULT 0;

