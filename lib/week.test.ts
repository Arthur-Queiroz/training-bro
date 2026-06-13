import { describe, it, expect } from "vitest";
import { mondayFirstIndex, startOfWeek } from "@/lib/week";

describe("mondayFirstIndex", () => {
  it.each([
    ["segunda 2026-06-08", new Date(2026, 5, 8), 0],
    ["quarta 2026-06-10", new Date(2026, 5, 10), 2],
    ["sábado 2026-06-13", new Date(2026, 5, 13), 5],
    ["domingo 2026-06-14", new Date(2026, 5, 14), 6],
  ])("%s → índice %i", (_label, date, expected) => {
    expect(mondayFirstIndex(date)).toBe(expected);
  });
});

describe("startOfWeek", () => {
  it("quarta-feira → segunda da mesma semana às 00:00", () => {
    const start = startOfWeek(new Date(2026, 5, 10, 15, 30));
    expect(start.getFullYear()).toBe(2026);
    expect(start.getMonth()).toBe(5);
    expect(start.getDate()).toBe(8);
    expect(start.getHours()).toBe(0);
    expect(start.getMinutes()).toBe(0);
  });

  it("domingo → segunda ANTERIOR (não o próprio dia)", () => {
    const start = startOfWeek(new Date(2026, 5, 14, 10, 0));
    expect(start.getDate()).toBe(8);
    expect(start.getDay()).toBe(1); // segunda-feira
  });

  it("segunda → o próprio dia às 00:00", () => {
    const start = startOfWeek(new Date(2026, 5, 8, 23, 59));
    expect(start.getDate()).toBe(8);
  });

  it("não muta a data recebida", () => {
    const input = new Date(2026, 5, 10, 15, 30);
    const snapshot = input.getTime();
    startOfWeek(input);
    expect(input.getTime()).toBe(snapshot);
  });
});
