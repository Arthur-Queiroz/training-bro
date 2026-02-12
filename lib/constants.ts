export const MUSCLE_GROUPS = [
  "Peito",
  "Costas",
  "Bíceps",
  "Tríceps",
  "Ombro",
  "Perna",
  "Core/Abdômen",
] as const;

export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];
