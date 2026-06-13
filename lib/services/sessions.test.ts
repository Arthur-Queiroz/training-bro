import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NotFoundError } from "@/lib/errors";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    workout: {
      findFirst: vi.fn(),
    },
    workoutSession: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import {
  logSession,
  listSessions,
  getSessionsThisWeek,
  getStreak,
} from "@/lib/services/sessions";

const mockedWorkout = vi.mocked(prisma.workout);
const mockedSession = vi.mocked(prisma.workoutSession);

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("logSession", () => {
  it("rejeita registrar sessão em treino de outro usuário (ownership)", async () => {
    mockedWorkout.findFirst.mockResolvedValue(null);
    await expect(logSession("invasor", "w_alheio")).rejects.toThrow(
      NotFoundError,
    );
    expect(mockedSession.create).not.toHaveBeenCalled();
  });

  it("registra a sessão quando o treino é do usuário", async () => {
    mockedWorkout.findFirst.mockResolvedValue({ id: "w1" } as never);
    mockedSession.create.mockResolvedValue({ id: "s1" } as never);
    await logSession("user_1", "w1");
    expect(mockedWorkout.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "w1", clerkUserId: "user_1" },
      }),
    );
    expect(mockedSession.create).toHaveBeenCalledWith({
      data: { clerkUserId: "user_1", workoutId: "w1" },
    });
  });
});

describe("listSessions", () => {
  it("filtra pelo clerkUserId do usuário", async () => {
    mockedSession.findMany.mockResolvedValue([]);
    await listSessions("user_1");
    expect(mockedSession.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { clerkUserId: "user_1" } }),
    );
  });
});

describe("getSessionsThisWeek", () => {
  function weekStartUsed(): Date {
    const where = mockedSession.findMany.mock.calls[0][0]!
      .where as { performedAt: { gte: Date } };
    return where.performedAt.gte;
  }

  it("numa quarta-feira, a semana começa na segunda às 00:00", async () => {
    // 2026-06-10 foi uma quarta-feira
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 10, 15, 30));
    mockedSession.findMany.mockResolvedValue([]);

    await getSessionsThisWeek("user_1");

    const start = weekStartUsed();
    expect(start.getFullYear()).toBe(2026);
    expect(start.getMonth()).toBe(5);
    expect(start.getDate()).toBe(8); // segunda-feira
    expect(start.getHours()).toBe(0);
    expect(start.getMinutes()).toBe(0);
  });

  it("no domingo, a semana ainda começa na segunda anterior (não hoje)", async () => {
    // 2026-06-14 foi um domingo
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 14, 10, 0));
    mockedSession.findMany.mockResolvedValue([]);

    await getSessionsThisWeek("user_1");

    const start = weekStartUsed();
    expect(start.getDate()).toBe(8); // segunda anterior, não 14
    expect(start.getDay()).toBe(1); // segunda-feira
  });

  it("na segunda-feira, a semana começa hoje", async () => {
    // 2026-06-08 foi uma segunda-feira
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 8, 23, 59));
    mockedSession.findMany.mockResolvedValue([]);

    await getSessionsThisWeek("user_1");

    expect(weekStartUsed().getDate()).toBe(8);
  });
});

describe("getStreak", () => {
  // "Hoje" fixo numa quarta (2026-06-10). Semanas (segunda-feira):
  //   atual = 08/06 · -1 = 01/06 · -2 = 25/05 · -3 = 18/05
  const sessionsOn = (...dates: Date[]) =>
    mockedSession.findMany.mockResolvedValue(
      dates.map((performedAt) => ({ performedAt })) as never,
    );

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 10, 12, 0)); // quarta
  });

  it("sem sessões → 0", async () => {
    sessionsOn();
    expect(await getStreak("user_1")).toBe(0);
  });

  it("só esta semana → 1", async () => {
    sessionsOn(new Date(2026, 5, 9)); // terça desta semana
    expect(await getStreak("user_1")).toBe(1);
  });

  it("3 semanas consecutivas (atual, -1, -2) → 3", async () => {
    sessionsOn(
      new Date(2026, 5, 9), // atual
      new Date(2026, 5, 3), // -1
      new Date(2026, 4, 27), // -2
    );
    expect(await getStreak("user_1")).toBe(3);
  });

  it("conta apenas distintas: 2 sessões na mesma semana valem 1", async () => {
    sessionsOn(new Date(2026, 5, 9), new Date(2026, 5, 11));
    expect(await getStreak("user_1")).toBe(1);
  });

  it("buraco quebra a sequência: atual + -2 (faltou -1) → 1", async () => {
    sessionsOn(new Date(2026, 5, 9), new Date(2026, 4, 27));
    expect(await getStreak("user_1")).toBe(1);
  });

  it("semana atual em andamento sem treino não zera: -1 e -2 → 2", async () => {
    // Nada nesta semana ainda; conta a partir da semana passada.
    sessionsOn(new Date(2026, 5, 3), new Date(2026, 4, 27));
    expect(await getStreak("user_1")).toBe(2);
  });

  it("sem treino nesta semana E na passada → 0 (graça é de só 1 semana)", async () => {
    sessionsOn(new Date(2026, 4, 27)); // só -2
    expect(await getStreak("user_1")).toBe(0);
  });
});
