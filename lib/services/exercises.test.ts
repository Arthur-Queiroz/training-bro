import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotFoundError, ValidationError } from "@/lib/errors";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    workout: {
      findFirst: vi.fn(),
    },
    exercise: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import {
  createExercise,
  getExercise,
  updateExercise,
  deleteExercise,
} from "@/lib/services/exercises";

const mockedWorkout = vi.mocked(prisma.workout);
const mockedExercise = vi.mocked(prisma.exercise);

const validInput = { name: "Supino", sets: 3, reps: 12 };

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createExercise", () => {
  it("rejeita quando o treino não pertence ao usuário (ownership)", async () => {
    mockedWorkout.findFirst.mockResolvedValue(null);
    await expect(
      createExercise("invasor", "w1", validInput),
    ).rejects.toThrow(NotFoundError);
    expect(mockedExercise.create).not.toHaveBeenCalled();
  });

  it("verifica ownership consultando workout por id + clerkUserId", async () => {
    mockedWorkout.findFirst.mockResolvedValue({ id: "w1" } as never);
    mockedExercise.findFirst.mockResolvedValue(null);
    mockedExercise.create.mockResolvedValue({ id: "e1" } as never);
    await createExercise("user_1", "w1", validInput);
    expect(mockedWorkout.findFirst).toHaveBeenCalledWith({
      where: { id: "w1", clerkUserId: "user_1" },
    });
  });

  it.each([
    ["nome vazio", { ...validInput, name: "  " }],
    ["sets zero", { ...validInput, sets: 0 }],
    ["sets negativo", { ...validInput, sets: -1 }],
    ["reps zero", { ...validInput, reps: 0 }],
  ])("rejeita %s", async (_label, input) => {
    mockedWorkout.findFirst.mockResolvedValue({ id: "w1" } as never);
    await expect(createExercise("user_1", "w1", input)).rejects.toThrow(
      ValidationError,
    );
    expect(mockedExercise.create).not.toHaveBeenCalled();
  });

  it.each([
    ["javascript: (XSS)", "javascript:alert(1)"],
    ["data:", "data:text/html,<script>alert(1)</script>"],
    ["URL malformada", "you tube .com"],
  ])("rejeita link com esquema perigoso ou inválido: %s", async (_l, url) => {
    mockedWorkout.findFirst.mockResolvedValue({ id: "w1" } as never);
    mockedExercise.findFirst.mockResolvedValue(null);
    await expect(
      createExercise("user_1", "w1", { ...validInput, videoUrl: url }),
    ).rejects.toThrow(ValidationError);
    expect(mockedExercise.create).not.toHaveBeenCalled();
  });

  it("aceita links http e https", async () => {
    mockedWorkout.findFirst.mockResolvedValue({ id: "w1" } as never);
    mockedExercise.findFirst.mockResolvedValue(null);
    mockedExercise.create.mockResolvedValue({ id: "e1" } as never);
    await createExercise("user_1", "w1", {
      ...validInput,
      videoUrl: "https://youtube.com/watch?v=abc",
    });
    expect(mockedExercise.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        videoUrl: "https://youtube.com/watch?v=abc",
      }),
    });
  });

  it("link sem esquema ganha https:// automaticamente", async () => {
    mockedWorkout.findFirst.mockResolvedValue({ id: "w1" } as never);
    mockedExercise.findFirst.mockResolvedValue(null);
    mockedExercise.create.mockResolvedValue({ id: "e1" } as never);
    await createExercise("user_1", "w1", {
      ...validInput,
      videoUrl: "youtube.com/watch?v=abc",
    });
    expect(mockedExercise.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        videoUrl: "https://youtube.com/watch?v=abc",
      }),
    });
  });

  it("calcula sortOrder sequencial e normaliza URLs vazias para null", async () => {
    mockedWorkout.findFirst.mockResolvedValue({ id: "w1" } as never);
    mockedExercise.findFirst.mockResolvedValue({ sortOrder: 4 } as never);
    mockedExercise.create.mockResolvedValue({ id: "e1" } as never);
    await createExercise("user_1", "w1", { ...validInput, videoUrl: "  " });
    expect(mockedExercise.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ sortOrder: 5, videoUrl: null }),
    });
  });
});

describe("getExercise", () => {
  it("rejeita acesso a exercício de treino alheio (ownership)", async () => {
    mockedExercise.findUnique.mockResolvedValue({
      id: "e1",
      workoutId: "w_alheio",
    } as never);
    mockedWorkout.findFirst.mockResolvedValue(null);
    await expect(getExercise("invasor", "e1")).rejects.toThrow(NotFoundError);
  });

  it("retorna o exercício quando o treino pai é do usuário", async () => {
    const exercise = { id: "e1", workoutId: "w1" };
    mockedExercise.findUnique.mockResolvedValue(exercise as never);
    mockedWorkout.findFirst.mockResolvedValue({ id: "w1" } as never);
    await expect(getExercise("user_1", "e1")).resolves.toEqual(exercise);
  });
});

describe("updateExercise", () => {
  it("rejeita update de exercício de treino alheio (ownership)", async () => {
    mockedExercise.findUnique.mockResolvedValue({
      id: "e1",
      workoutId: "w_alheio",
    } as never);
    mockedWorkout.findFirst.mockResolvedValue(null);
    await expect(
      updateExercise("invasor", "e1", { name: "Hack" }),
    ).rejects.toThrow(NotFoundError);
    expect(mockedExercise.update).not.toHaveBeenCalled();
  });

  it("update parcial: só envia os campos presentes", async () => {
    mockedExercise.findUnique.mockResolvedValue({
      id: "e1",
      workoutId: "w1",
    } as never);
    mockedWorkout.findFirst.mockResolvedValue({ id: "w1" } as never);
    mockedExercise.update.mockResolvedValue({ id: "e1" } as never);
    await updateExercise("user_1", "e1", { sets: 5 });
    expect(mockedExercise.update).toHaveBeenCalledWith({
      where: { id: "e1" },
      data: { sets: 5 },
    });
  });

  it("videoUrl null limpa o campo (null explícito ≠ omitido)", async () => {
    mockedExercise.findUnique.mockResolvedValue({
      id: "e1",
      workoutId: "w1",
    } as never);
    mockedWorkout.findFirst.mockResolvedValue({ id: "w1" } as never);
    mockedExercise.update.mockResolvedValue({ id: "e1" } as never);
    await updateExercise("user_1", "e1", { videoUrl: null });
    expect(mockedExercise.update).toHaveBeenCalledWith({
      where: { id: "e1" },
      data: { videoUrl: null },
    });
  });

  it("rejeita javascript: URL também no update", async () => {
    mockedExercise.findUnique.mockResolvedValue({
      id: "e1",
      workoutId: "w1",
    } as never);
    mockedWorkout.findFirst.mockResolvedValue({ id: "w1" } as never);
    await expect(
      updateExercise("user_1", "e1", { videoUrl: "javascript:alert(1)" }),
    ).rejects.toThrow(ValidationError);
    expect(mockedExercise.update).not.toHaveBeenCalled();
  });

  it("rejeita sets/reps inválidos quando enviados", async () => {
    mockedExercise.findUnique.mockResolvedValue({
      id: "e1",
      workoutId: "w1",
    } as never);
    mockedWorkout.findFirst.mockResolvedValue({ id: "w1" } as never);
    await expect(
      updateExercise("user_1", "e1", { reps: 0 }),
    ).rejects.toThrow(ValidationError);
  });
});

describe("deleteExercise", () => {
  it("rejeita quando o treino informado não é do usuário (ownership)", async () => {
    mockedWorkout.findFirst.mockResolvedValue(null);
    await expect(
      deleteExercise("invasor", "e1", "w1"),
    ).rejects.toThrow(NotFoundError);
    expect(mockedExercise.deleteMany).not.toHaveBeenCalled();
  });

  it("exclusão escopada a {id, workoutId}: não deleta exercício de outro treino", async () => {
    mockedWorkout.findFirst.mockResolvedValue({ id: "w1" } as never);
    mockedExercise.deleteMany.mockResolvedValue({ count: 0 });
    // exercício existe mas pertence a OUTRO treino → count 0 → NotFound
    await expect(
      deleteExercise("user_1", "e_de_outro_treino", "w1"),
    ).rejects.toThrow(NotFoundError);
    expect(mockedExercise.deleteMany).toHaveBeenCalledWith({
      where: { id: "e_de_outro_treino", workoutId: "w1" },
    });
  });

  it("exclui quando exercício pertence ao treino do usuário", async () => {
    mockedWorkout.findFirst.mockResolvedValue({ id: "w1" } as never);
    mockedExercise.deleteMany.mockResolvedValue({ count: 1 });
    await expect(
      deleteExercise("user_1", "e1", "w1"),
    ).resolves.toEqual({ count: 1 });
  });
});
