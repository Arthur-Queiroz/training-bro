import { Skeleton } from "@/components/skeleton";

/** Esqueleto do detalhe do treino — voltar + título + lista de exercícios. */
export default function WorkoutDetailLoading() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)] max-w-lg mx-auto lg:max-w-none">
      <div className="px-4 pt-4 pb-0 lg:px-6 lg:pt-6">
        {/* Link "Voltar" */}
        <Skeleton className="h-3 w-14 mb-3" />

        {/* Título + tags de grupo muscular */}
        <Skeleton className="h-5 w-2/3 mb-2" />
        <div className="flex gap-1.5 mb-4">
          <Skeleton className="h-5 w-16 rounded-[8px]" />
          <Skeleton className="h-5 w-14 rounded-[8px]" />
        </div>
      </div>

      {/* Exercícios */}
      <div className="flex-1 px-4 lg:px-6 divide-y divide-line">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-3">
            <Skeleton className="h-[22px] w-[22px] rounded-[6px]" />
            <div className="flex-1">
              <Skeleton className="h-3 w-1/2 mb-1.5" />
              <Skeleton className="h-2.5 w-12" />
            </div>
            <Skeleton className="h-7 w-7 rounded-[6px]" />
          </div>
        ))}
      </div>
    </div>
  );
}
