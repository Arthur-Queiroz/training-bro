import type { SessionStats } from "@/lib/services/sessions";
import { getWorkoutPrimaryColor } from "@/lib/workout-colors";

/**
 * Card "Resumo" no topo do histórico. Apresentacional: recebe os números
 * prontos do service (getSessionStats) e só desenha. As barras usam a cor de
 * cada grupo muscular (lib/workout-colors), normalizadas pelo maior valor.
 */
export function SessionStatsCard({ stats }: { stats: SessionStats }) {
  // Top 5 grupos; a barra do líder fica cheia e as demais proporcionais a ele.
  const topGroups = stats.muscleGroups.slice(0, 5);
  const max = topGroups[0]?.count ?? 1;

  return (
    <div className="rounded-[10px] border border-line bg-surface p-3 mb-5">
      <p className="text-[11px] font-medium uppercase tracking-[0.5px] text-ink-3 mb-3">
        Resumo
      </p>

      {/* Números principais */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="rounded-[8px] bg-base border border-line p-2.5 text-center">
          <p className="text-[18px] font-medium text-ink">{stats.total}</p>
          <p className="text-[11px] text-ink-3">Total de treinos</p>
        </div>
        <div className="rounded-[8px] bg-base border border-line p-2.5 text-center">
          <p className="text-[18px] font-medium text-ink">{stats.thisMonth}</p>
          <p className="text-[11px] text-ink-3">Este mês</p>
        </div>
      </div>

      {/* Distribuição por grupo muscular */}
      {topGroups.length > 0 && (
        <div>
          <p className="text-[11px] text-ink-3 mb-2">Grupos mais treinados</p>
          <div className="space-y-1.5">
            {topGroups.map(({ group, count }) => {
              const color = getWorkoutPrimaryColor([group]);
              const pct = Math.round((count / max) * 100);
              return (
                <div key={group} className="flex items-center gap-2">
                  <span className="w-20 flex-shrink-0 truncate text-[11px] text-ink-2">
                    {group}
                  </span>
                  {/* Trilho da barra */}
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: color.solid }}
                    />
                  </div>
                  <span className="w-5 flex-shrink-0 text-right text-[11px] text-ink-3">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
