import { Skeleton } from "@/components/skeleton";

/** Esqueleto da lista de treinos — espelha o cabeçalho + cards do WorkoutCard. */
export default function WorkoutsLoading() {
  return (
    <div className="px-4 pt-4 pb-4 max-w-lg mx-auto lg:max-w-none lg:px-6 lg:pt-6">
      {/* Cabeçalho: título + botão "novo" */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-7 w-7 rounded-[7px]" />
      </div>

      {/* Cards de treino */}
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-[10px] border border-line bg-surface p-3"
          >
            <Skeleton className="mt-[3px] h-2 w-2 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-3.5 w-2/3 mb-2" />
              <Skeleton className="h-4 w-24 rounded-[8px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
