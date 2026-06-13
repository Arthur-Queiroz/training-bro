/**
 * Erros de domínio usados pelos services. As rotas mapeiam cada tipo para o
 * status HTTP correto (ver lib/api-response.ts), evitando comparação frágil por
 * mensagem de texto.
 */

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}
