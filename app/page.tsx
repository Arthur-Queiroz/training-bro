import Link from "next/link";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import { getWorkouts, getWorkoutSessionsThisWeek } from "@/lib/actions/workouts";
import { getWorkoutPrimaryColor } from "@/lib/workout-colors";

const DAY_LABELS = ["S", "T", "Q", "Q", "S", "S", "D"];

const MONTHS_PT = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];
const DAYS_PT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default async function Home() {
  const user = await currentUser();
  const [workouts, sessionsThisWeek] = await Promise.all([
    getWorkouts(),
    getWorkoutSessionsThisWeek(),
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
            className="text-[18px] text-[#F0EDE6]"
            style={{ fontFamily: "var(--font-instrument-serif)" }}
          >
            Olá, {user?.firstName ?? "Você"}
          </h1>
          <p className="text-[11px] text-[#5E5C55] mt-0.5">
            {dayLabel}, {dayNum} {monthLabel}
          </p>
        </div>
        <Link
          href="/profile/dados-pessoais"
          className="flex h-[28px] w-[28px] flex-shrink-0 items-center justify-center rounded-full bg-[#E8612B] text-[12px] font-medium text-white transition-opacity hover:opacity-80 overflow-hidden"
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
      <div className="rounded-[10px] bg-[#141417] border border-white/[0.06] p-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.5px] text-[#5E5C55]">
            Iniciar treino
          </p>
          {workouts.length > 0 && (
            <Link
              href="/workouts"
              className="text-[11px] text-[#5E5C55] hover:text-[#9B978E] transition-colors"
            >
              Ver todos
            </Link>
          )}
        </div>

        {workouts.length === 0 ? (
          <div className="text-center py-2">
            <p className="text-[12px] text-[#5E5C55] mb-3">
              Nenhum treino criado ainda
            </p>
            <Link
              href="/workouts/new"
              className="inline-block rounded-[8px] bg-[#E8612B] px-4 py-2 text-[12px] font-medium text-white transition-colors hover:bg-[#D4511F]"
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
                  className="flex items-center gap-3 rounded-[8px] bg-[#0b0b0d] border border-white/[0.04] px-3 py-2.5 transition-colors hover:bg-[#141417]"
                >
                  <span
                    className="h-2 w-2 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: color.solid }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-[#F0EDE6] truncate">
                      {workout.name}
                    </p>
                    <p className="text-[11px] text-[#5E5C55]">
                      {workout.exercises.length} exercício
                      {workout.exercises.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#5E5C55"
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
                className="block text-center text-[12px] text-[#5E5C55] hover:text-[#9B978E] transition-colors pt-1"
              >
                +{workouts.length - 4} treinos
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Week */}
      <div className="rounded-[10px] bg-[#141417] border border-white/[0.06] p-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.5px] text-[#5E5C55] mb-3">
          Semana
        </p>
        <div className="grid grid-cols-7 gap-1">
          {DAY_LABELS.map((label, i) => {
            const isToday = i === todayIndex;
            const hasSession = sessionDays.has(i);
            return (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] text-[#5E5C55]">{label}</span>
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-[6px] text-[11px] font-medium transition-colors ${
                    isToday ? "bg-[#E8612B] text-white" : "text-[#9B978E]"
                  }`}
                >
                  {weekDates[i].getDate()}
                </div>
                <span
                  className={`h-1 w-1 rounded-full ${
                    hasSession ? "bg-[#2EBD6B]" : "bg-transparent"
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
    <div className="rounded-[10px] bg-[#141417] border border-white/[0.06] p-3">
      <div
        className={`mb-2 flex h-7 w-7 items-center justify-center rounded-[7px] ${
          accent ? "bg-[#2EBD6B]/10" : "bg-[#E8612B]/10"
        }`}
      >
        <span className={accent ? "text-[#2EBD6B]" : "text-[#E8612B]"}>
          {icon}
        </span>
      </div>
      <p className="text-[16px] font-medium text-[#F0EDE6]">{value}</p>
      <p className="text-[11px] text-[#5E5C55]">{label}</p>
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
