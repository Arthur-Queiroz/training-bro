import { SharedWorkoutClient } from "./shared-workout-client";

export default async function SharedWorkoutPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <SharedWorkoutClient token={token} />;
}
