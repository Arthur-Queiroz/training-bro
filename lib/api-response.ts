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