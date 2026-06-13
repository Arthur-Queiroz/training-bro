import { Skeleton } from "@/components/skeleton";

/** Esqueleto do histórico — cabeçalho + grupos de sessões por mês. */
export default function HistoryLoading() {
  return (
    <div className="px-4 pt-4 pb-4 max-w-lg mx-auto lg:max-w-none lg:px-6 lg:pt-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-3 w-28" />
      </div>

      <div className="space-y-5">
        {Array.from({ length: 2 }).map((_, group) => (
          <div key={group}>
            <Skeleton className="h-3 w-20 mb-2" />
            <div className="rounded-[10px] border border-line bg-surface divide-y divide-line">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-3">
                  <Skeleton className="h-2 w-2 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-3 w-1/2 mb-1.5" />
                    <Skeleton className="h-4 w-16 rounded-[6px]" />
                  </div>
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
