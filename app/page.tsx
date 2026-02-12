import Link from "next/link";
import { SignOutButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-2xl font-bold text-black dark:text-zinc-50">
            Training Bro
          </h1>
          <UserButton />
        </div>

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h2 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Welcome, {user?.firstName || "Bro"}!
          </h2>

          <Link
            href="/workouts"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-zinc-900 px-6 text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 md:w-auto"
          >
            Meus Treinos
          </Link>
        </div>

        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <SignOutButton>
            <button className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-red-600 px-5 text-white transition-colors hover:bg-red-700 md:w-[158px]">
              Sign Out
            </button>
          </SignOutButton>
        </div>
      </main>
    </div>
  );
}
