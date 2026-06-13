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
