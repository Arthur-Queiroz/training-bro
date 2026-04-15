import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { getWorkouts } from "@/lib/actions/workouts";
import { getWorkoutPrimaryColor } from "@/lib/workout-colors";

const DAY_LABELS = ["S", "T", "Q", "Q", "S", "S", "D"];

const MONTHS_PT = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];
const DAYS_PT = [
  "Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb",
];

export default async function Home() {
  const user = await currentUser();
  const workouts = await getWorkouts();
  const nextWorkout = workouts[0] ?? null;

  const now = new Date();
  const dow = now.getDay(); // 0=Sun
  const todayIndex = dow === 0 ? 6 : dow - 1; // Mon=0 … Sun=6
  const dayLabel = DAYS_PT[dow];
  const monthLabel = MONTHS_PT[now.getMonth()];
  const dayNum = now.getDate();

  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - todayIndex);
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d.getDate();
  });

  const nextColor = nextWorkout
    ? getWorkoutPrimaryColor(nextWorkout.muscleGroups)
    : null;

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
        <div
          className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#E8612B] text-[12px] font-medium text-white"
        >
          {(user?.firstName?.[0] ?? "A").toUpperCase()}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <StatCard
          icon={<WorkoutIcon />}
          value={workouts.length.toString()}
          label="Treinos"
        />
        <StatCard
          icon={<CheckIcon />}
          value="—"
          label="Meta"
          accent
        />
      </div>

      {/* Next workout */}
      <div className="rounded-[10px] bg-[#141417] border border-white/[0.06] p-3 mb-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.5px] text-[#5E5C55] mb-2">
          Próximo treino
        </p>
        {nextWorkout ? (
          <>
            <div className="flex items-center gap-2 mb-3">
              <span
                className="h-2 w-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: nextColor?.solid ?? "#E8612B" }}
              />
              <div>
                <p className="text-[13px] font-medium text-[#F0EDE6]">
                  {nextWorkout.name}
                </p>
                <p className="text-[11px] text-[#5E5C55]">
                  {nextWorkout.exercises.length} exercício
                  {nextWorkout.exercises.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <Link
              href={`/workouts/${nextWorkout.id}`}
              className="block w-full rounded-[8px] bg-[#E8612B] py-2.5 text-center text-[13px] font-medium text-white transition-colors hover:bg-[#D4511F]"
            >
              Iniciar treino
            </Link>
          </>
        ) : (
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
            return (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] text-[#5E5C55]">{label}</span>
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-[6px] text-[11px] font-medium transition-colors ${
                    isToday
                      ? "bg-[#E8612B] text-white"
                      : "text-[#9B978E]"
                  }`}
                >
                  {weekDates[i]}
                </div>
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

function WorkoutIcon() {
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
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
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
