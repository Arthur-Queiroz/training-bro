import { notFound } from "next/navigation";
import { NotFoundError } from "@/lib/errors";

/**
 * Converte NotFoundError de um service na página 404 do Next. Outros erros
 * continuam subindo para o error boundary.
 */
export async function or404<T>(promise: Promise<T>): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }
}
