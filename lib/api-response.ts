import { NotFoundError, ValidationError } from "@/lib/errors";

export function ok<T>(data: T, status = 200): Response {
  return Response.json({ ok: true, data }, { status });
}

export function err(message: string, status = 400): Response {
  return Response.json({ ok: false, error: message }, { status });
}

export function unauthorized(): Response {
  return err("Não autenticado", 401);
}

export function notFound(message = "Recurso não encontrado"): Response {
  return err(message, 404);
}

/**
 * Mapeia um erro lançado por um service para a resposta HTTP correta. Mantém o
 * tratamento de erros idêntico em todas as rotas e evita vazar detalhes internos
 * em erros inesperados.
 */
export function handleError(error: unknown): Response {
  if (error instanceof ValidationError) return err(error.message, 400);
  if (error instanceof NotFoundError) return notFound(error.message);

  console.error("Erro inesperado em rota de API:", error);
  return err("Erro interno do servidor", 500);
}
