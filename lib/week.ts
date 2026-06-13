/**
 * Utilitários de semana. No app a semana começa na SEGUNDA-feira, mas o
 * JavaScript numera os dias com domingo=0..sábado=6. Centralizar a conversão
 * aqui evita repetir o "(dow === 0 ? 6 : dow - 1)" espalhado pela UI e pelos
 * services (onde já estava divergindo sutilmente).
 */

/** Índice do dia com a semana começando na segunda: segunda=0 ... domingo=6. */
export function mondayFirstIndex(date: Date): number {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
}

/** Segunda-feira às 00:00 da semana que contém `date`. */
export function startOfWeek(date: Date): Date {
  const start = new Date(date);
  start.setDate(date.getDate() - mondayFirstIndex(date));
  start.setHours(0, 0, 0, 0);
  return start;
}
