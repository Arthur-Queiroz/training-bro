import { getAllWorkoutSessions } from "@/lib/actions/workouts";
import { getWorkoutPrimaryColor } from "@/lib/workout-colors";

const MONTHS_PT = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];

function formatDate(date: Date) {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, "0");
  const month = MONTHS_PT[d.getMonth()];
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  return { date: `${day} ${month} ${year}`, time: `${hours}:${minutes}` };
}

function groupByMonth(sessions: Awaited<ReturnType<typeof getAllWorkoutSessions>>) {
  const groups: Record<string, typeof sessions> = {};
  for (const session of sessions) {
    const d = new Date(session.performedAt);
    const key = `${MONTHS_PT[d.getMonth()]} ${d.getFullYear()}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(session);
  }
  return groups;
}

export default async function HistoryPage() {
  const sessions = await getAllWorkoutSessions();
  const grouped = groupByMonth(sessions);

  return (
    <div className="px-4 pt-4 pb-4 max-w-lg mx-auto lg:max-w-none lg:px-6 lg:pt-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[16px] font-medium text-[#F0EDE6]">Histórico</h1>
        {sessions.length > 0 && (
          <span className="text-[11px] text-[#5E5C55]">
            {sessions.length} treino{sessions.length !== 1 ? "s" : ""} realizados
          </span>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-[13px] text-[#5E5C55]">
            Nenhum treino registrado ainda
          </p>
          <p className="text-[11px] text-[#5E5C55] mt-1">
            Conclua um treino para ele aparecer aqui
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {Object.entries(grouped).map(([month, monthSessions]) => (
            <div key={month}>
              <p className="text-[11px] font-medium uppercase tracking-[0.5px] text-[#5E5C55] mb-2">
                {month}
              </p>
              <div className="rounded-[10px] bg-[#141417] border border-white/[0.06] divide-y divide-white/[0.06]">
                {monthSessions.map((session) => {
                  const color = getWorkoutPrimaryColor(session.workout.muscleGroups);
                  const { date, time } = formatDate(session.performedAt);
                  return (
                    <div key={session.id} className="flex items-center gap-3 px-3 py-3">
                      <span
                        className="h-2 w-2 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: color.solid }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium text-[#F0EDE6] truncate">
                          {session.workout.name}
                        </p>
                        {session.workout.muscleGroups.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {session.workout.muscleGroups.map((group) => (
                              <span
                                key={group}
                                className="rounded-[6px] px-1.5 py-0.5 text-[10px] font-medium"
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
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[12px] text-[#9B978E]">{date}</p>
                        <p className="text-[11px] text-[#5E5C55]">{time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
