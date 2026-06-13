import { ValidationError } from "@/lib/errors";

/**
 * Conversão segura do corpo JSON (tipado como `unknown`) para os tipos que os
 * services esperam. Aqui validamos apenas o *formato* (é string? número?);
 * as regras de negócio (obrigatório, maior que zero, etc.) ficam nos services.
 */

export async function readJsonObject(
  request: Request,
): Promise<Record<string, unknown>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new ValidationError("Corpo da requisição não é um JSON válido");
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    throw new ValidationError("Corpo da requisição inválido");
  }
  return body as Record<string, unknown>;
}

export function asString(value: unknown): string {
  if (typeof value !== "string") {
    throw new ValidationError("Campo de texto ausente ou inválido");
  }
  return value;
}

export function asNumber(value: unknown): number {
  const parsed = typeof value === "string" ? Number(value) : value;
  if (typeof parsed !== "number" || !Number.isFinite(parsed)) {
    throw new ValidationError("Campo numérico ausente ou inválido");
  }
  return parsed;
}

export function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  return asString(value);
}

export function asOptionalNumber(value: unknown): number | undefined {
  if (value === undefined || value === null) return undefined;
  return asNumber(value);
}

/** Campo que pode vir como string, ser explicitamente limpo (null) ou omitido. */
export function asNullableString(value: unknown): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  return asString(value);
}

export function asOptionalStringArray(value: unknown): string[] | undefined {
  if (value === undefined || value === null) return undefined;
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new ValidationError("Lista de texto inválida");
  }
  return value as string[];
}
