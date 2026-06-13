import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotFoundError, ValidationError } from "@/lib/errors";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    workout: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      updateMany: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import {
  listWorkouts,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout,
} from "@/lib/services/workouts";

const mockedWorkout = vi.mocked(prisma.workout);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("listWorkouts", () => {
  it("filtra pelo clerkUserId do usuário", async () => {
    mockedWorkout.findMany.mockResolvedValue([]);
    await listWorkouts("user_1");
    expect(mockedWorkout.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { clerkUserId: "user_1" } }),
    );
  });
});

describe("getWorkout", () => {
  it("busca escopado por id + clerkUserId (sem IDOR)", async () => {
    mockedWorkout.findFirst.mockResolvedValue({ id: "w1" } as never);
    await getWorkout("user_1", "w1");
    expect(mockedWorkout.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "w1", clerkUserId: "user_1" },
      }),
    );
  });

  it("lança NotFoundError quando o treino não é do usuário", async () => {
    mockedWorkout.findFirst.mockResolvedValue(null);
    await expect(getWorkout("user_2", "w1")).rejects.toThrow(NotFoundError);
  });
});

describe("createWorkout", () => {
  it("cria com o clerkUserId do chamador e nome trimado", async () => {
    mockedWorkout.create.mockResolvedValue({ id: "w1" } as never);
    await createWorkout("user_1", { name: "  Treino A  ", muscleGroups: [] });
    expect(mockedWorkout.create).toHaveBeenCalledWith({
      data: { clerkUserId: "user_1", name: "Treino A", muscleGroups: [] },
    });
  });

  it("rejeita nome vazio ou só espaços", async () => {
    await expect(
      createWorkout("user_1", { name: "   ", muscleGroups: [] }),
    ).rejects.toThrow(ValidationError);
    expect(mockedWorkout.create).not.toHaveBeenCalled();
  });
});

describe("updateWorkout", () => {
  it("atualiza escopado por id + clerkUserId (sem IDOR)", async () => {
    mockedWorkout.updateMany.mockResolvedValue({ count: 1 });
    await updateWorkout("user_1", "w1", { name: "Novo nome" });
    expect(mockedWorkout.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "w1", clerkUserId: "user_1" },
      }),
    );
  });

  it("rejeita nome vazio quando enviado", async () => {
    await expect(updateWorkout("user_1", "w1", { name: " " })).rejects.toThrow(
      ValidationError,
    );
    expect(mockedWorkout.updateMany).not.toHaveBeenCalled();
  });

  it("não toca campos omitidos (update parcial)", async () => {
    mockedWorkout.updateMany.mockResolvedValue({ count: 1 });
    await updateWorkout("user_1", "w1", { muscleGroups: ["Peito"] });
    const { data } = mockedWorkout.updateMany.mock.calls[0][0];
    expect(data).toEqual({ muscleGroups: ["Peito"] });
  });
});

describe("deleteWorkout", () => {
  it("exclui escopado por id + clerkUserId (sem IDOR)", async () => {
    mockedWorkout.deleteMany.mockResolvedValue({ count: 1 });
    await deleteWorkout("user_1", "w1");
    expect(mockedWorkout.deleteMany).toHaveBeenCalledWith({
      where: { id: "w1", clerkUserId: "user_1" },
    });
  });
});
