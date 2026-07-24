import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotFoundError, ValidationError } from "@/lib/errors";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    workout: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    sharedWorkout: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import {
  shareWorkout,
  getSharedWorkoutByToken,
  getWorkoutShares,
  revokeShare,
  importSharedWorkout,
} from "@/lib/services/sharing";

const mockedWorkout = vi.mocked(prisma.workout);
const mockedSharedWorkout = vi.mocked(prisma.sharedWorkout);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("shareWorkout", () => {
  it("verifica ownership antes de criar o share", async () => {
    mockedWorkout.findFirst.mockResolvedValue({ id: "w1" } as never);
    mockedSharedWorkout.create.mockResolvedValue({
      id: "s1",
      token: "abc123",
      workoutId: "w1",
      clerkUserId: "user_1",
      createdAt: new Date(),
    } as never);

    await shareWorkout("user_1", "w1");

    expect(mockedWorkout.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "w1", clerkUserId: "user_1" },
      }),
    );
    expect(mockedSharedWorkout.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          workoutId: "w1",
          clerkUserId: "user_1",
        }),
      }),
    );
  });

  it("lança NotFoundError quando o treino não é do usuário", async () => {
    mockedWorkout.findFirst.mockResolvedValue(null);
    await expect(shareWorkout("user_2", "w1")).rejects.toThrow(NotFoundError);
    expect(mockedSharedWorkout.create).not.toHaveBeenCalled();
  });

  it("gera um token de 32 caracteres hex", async () => {
    mockedWorkout.findFirst.mockResolvedValue({ id: "w1" } as never);
    mockedSharedWorkout.create.mockResolvedValue({
      id: "s1",
      token: "x",
      workoutId: "w1",
      clerkUserId: "user_1",
      createdAt: new Date(),
    } as never);

    await shareWorkout("user_1", "w1");

    const { token } = mockedSharedWorkout.create.mock.calls[0][0].data;
    expect(token).toMatch(/^[a-f0-9]{32}$/);
  });
});

describe("getSharedWorkoutByToken", () => {
  it("retorna o workout com exercícios quando o token é válido", async () => {
    const shared = {
      id: "s1",
      token: "abc",
      workoutId: "w1",
      workout: {
        id: "w1",
        name: "Treino A",
        muscleGroups: ["Peito"],
        clerkUserId: "user_1",
        exercises: [{ id: "e1", name: "Supino", sets: 3, reps: 10 }],
      },
    };
    mockedSharedWorkout.findUnique.mockResolvedValue(shared as never);

    const result = await getSharedWorkoutByToken("abc");
    expect(result.workout.exercises).toHaveLength(1);
  });

  it("lança NotFoundError para token inexistente", async () => {
    mockedSharedWorkout.findUnique.mockResolvedValue(null);
    await expect(getSharedWorkoutByToken("invalido")).rejects.toThrow(
      NotFoundError,
    );
  });
});

describe("getWorkoutShares", () => {
  it("lista shares do usuário para um treino específico", async () => {
    mockedSharedWorkout.findMany.mockResolvedValue([]);
    await getWorkoutShares("user_1", "w1");
    expect(mockedSharedWorkout.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { workoutId: "w1", clerkUserId: "user_1" },
      }),
    );
  });
});

describe("revokeShare", () => {
  it("deleta escopado por clerkUserId (não permite revogar share de outro)", async () => {
    mockedSharedWorkout.deleteMany.mockResolvedValue({ count: 1 });
    await revokeShare("user_1", "token1");
    expect(mockedSharedWorkout.deleteMany).toHaveBeenCalledWith({
      where: { token: "token1", clerkUserId: "user_1" },
    });
  });

  it("lança NotFoundError se o share não é do usuário", async () => {
    mockedSharedWorkout.deleteMany.mockResolvedValue({ count: 0 });
    await expect(revokeShare("user_2", "token1")).rejects.toThrow(
      NotFoundError,
    );
  });
});

describe("importSharedWorkout", () => {
  it("cria uma cópia do workout com exercícios para o usuário importador", async () => {
    const shared = {
      id: "s1",
      token: "abc",
      workoutId: "w1",
      workout: {
        id: "w1",
        name: "Treino A",
        muscleGroups: ["Peito", "Tríceps"],
        clerkUserId: "user_1",
        exercises: [
          { id: "e1", name: "Supino", sets: 3, reps: 10, videoUrl: null, instructionUrl: null, sortOrder: 0 },
          { id: "e2", name: "Tríceps corda", sets: 3, reps: 12, videoUrl: null, instructionUrl: null, sortOrder: 1 },
        ],
      },
    };
    mockedSharedWorkout.findUnique.mockResolvedValue(shared as never);
    mockedWorkout.create.mockResolvedValue({ id: "w2" } as never);

    const result = await importSharedWorkout("user_2", "abc");

    expect(result.id).toBe("w2");
    expect(mockedWorkout.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          clerkUserId: "user_2",
          name: "Treino A",
          muscleGroups: ["Peito", "Tríceps"],
          exercises: {
            create: [
              expect.objectContaining({ name: "Supino", sets: 3, reps: 10 }),
              expect.objectContaining({ name: "Tríceps corda", sets: 3, reps: 12 }),
            ],
          },
        }),
      }),
    );
  });

  it("não permite importar o próprio treino", async () => {
    const shared = {
      id: "s1",
      token: "abc",
      workoutId: "w1",
      workout: {
        id: "w1",
        name: "Treino A",
        muscleGroups: [],
        clerkUserId: "user_1",
        exercises: [],
      },
    };
    mockedSharedWorkout.findUnique.mockResolvedValue(shared as never);

    await expect(importSharedWorkout("user_1", "abc")).rejects.toThrow(
      ValidationError,
    );
    expect(mockedWorkout.create).not.toHaveBeenCalled();
  });

  it("lança NotFoundError para token inexistente", async () => {
    mockedSharedWorkout.findUnique.mockResolvedValue(null);
    await expect(importSharedWorkout("user_1", "invalido")).rejects.toThrow(
      NotFoundError,
    );
  });
});
