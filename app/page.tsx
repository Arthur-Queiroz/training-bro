import Link from "next/link";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import { listWorkouts } from "@/lib/services/workouts";
import { getSessionsThisWeek } from "@/lib/services/sessions";
import { getWorkoutPrimaryColor } from "@/lib/workout-colors";

const DAY_LABELS = ["S", "T", "Q", "Q", "S", "S", "D"];

const MONTHS_PT = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];
const DAYS_PT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default async function Home() {
  const user = await currentUser();
  if (!user) throw new Error("Não autenticado");

  const [workouts, sessionsThisWeek] = await Promise.all([
    listWorkouts(user.id),
    getSessionsThisWeek(user.id),
  ]);

  const now = new Date();
  const dow = now.getDay();
  const todayIndex = dow === 0 ? 6 : dow - 1;
  const dayLabel = DAYS_PT[dow];
  const monthLabel = MONTHS_PT[now.getMonth()];
  const dayNum = now.getDate();

  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - todayIndex);
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const sessionDays = new Set(
    sessionsThisWeek.map((s) => {
      const d = new Date(s.performedAt);
      return d.getDay() === 0 ? 6 : d.getDay() - 1;
    })
  );

  return (
    <div className="px-4 pt-4 pb-4 max-w-lg mx-auto lg:max-w-none lg:px-6 lg:pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1
            className="text-[18px] text-ink"
            style={{ fontFamily: "var(--font-instrument-serif)" }}
          >
            Olá, {user?.firstName ?? "Você"}
          </h1>
          <p className="text-[11px] text-ink-3 mt-0.5">
            {dayLabel}, {dayNum} {monthLabel}
          </p>
        </div>
        <Link
          href="/profile/dados-pessoais"
          className="flex h-[28px] w-[28px] flex-shrink-0 items-center justify-center rounded-full bg-accent text-[12px] font-medium text-on-accent transition-opacity hover:opacity-80 overflow-hidden"
        >
          {user?.imageUrl ? (
            <Image
              src={user.imageUrl}
              alt="Perfil"
              width={28}
              height={28}
              className="object-cover w-full h-full"
            />
          ) : (
            (user?.firstName?.[0] ?? "A").toUpperCase()
          )}
        </Link>
      </div>

      {/* Stats row */}
      <div className="mb-3">
        <StatCard
          icon={<CheckIcon />}
          value={sessionsThisWeek.length.toString()}
          label="Esta semana"
          accent
        />
      </div>

      {/* Choose workout */}
      <div className="rounded-[10px] bg-surface border border-line p-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.5px] text-ink-3">
            Iniciar treino
          </p>
          {workouts.length > 0 && (
            <Link
              href="/workouts"
              className="text-[11px] text-ink-3 hover:text-ink-2 transition-colors"
            >
              Ver todos
            </Link>
          )}
        </div>

        {workouts.length === 0 ? (
          <div className="text-center py-2">
            <p className="text-[12px] text-ink-3 mb-3">
              Nenhum treino criado ainda
            </p>
            <Link
              href="/workouts/new"
              className="inline-block rounded-[8px] bg-accent px-4 py-2 text-[12px] font-medium text-on-accent transition-colors hover:bg-accent-2"
            >
              Criar treino
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {workouts.slice(0, 4).map((workout) => {
              const color = getWorkoutPrimaryColor(workout.muscleGroups);
              return (
                <Link
                  key={workout.id}
                  href={`/workouts/${workout.id}`}
                  className="flex items-center gap-3 rounded-[8px] bg-base border border-line px-3 py-2.5 transition-colors hover:bg-surface"
                >
                  <span
                    className="h-2 w-2 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: color.solid }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-ink truncate">
                      {workout.name}
                    </p>
                    <p className="text-[11px] text-ink-3">
                      {workout.exercises.length} exercício
                      {workout.exercises.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--ink-3)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Link>
              );
            })}
            {workouts.length > 4 && (
              <Link
                href="/workouts"
                className="block text-center text-[12px] text-ink-3 hover:text-ink-2 transition-colors pt-1"
              >
                +{workouts.length - 4} treinos
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Week */}
      <div className="rounded-[10px] bg-surface border border-line p-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.5px] text-ink-3 mb-3">
          Semana
        </p>
        <div className="grid grid-cols-7 gap-1">
          {DAY_LABELS.map((label, i) => {
            const isToday = i === todayIndex;
            const hasSession = sessionDays.has(i);
            return (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] text-ink-3">{label}</span>
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-[6px] text-[11px] font-medium transition-colors ${
                    isToday ? "bg-accent text-on-accent" : "text-ink-2"
                  }`}
                >
                  {weekDates[i].getDate()}
                </div>
                <span
                  className={`h-1 w-1 rounded-full ${
                    hasSession ? "bg-ok" : "bg-transparent"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  accent,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-[10px] bg-surface border border-line p-3">
      <div
        className={`mb-2 flex h-7 w-7 items-center justify-center rounded-[7px] ${
          accent ? "bg-ok/10" : "bg-accent/10"
        }`}
      >
        <span className={accent ? "text-ok" : "text-accent"}>
          {icon}
        </span>
      </div>
      <p className="text-[16px] font-medium text-ink">{value}</p>
      <p className="text-[11px] text-ink-3">{label}</p>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
