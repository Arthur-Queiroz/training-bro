"use client";

import { useEffect } from "react";

/**
 * Error boundary global. O Next renderiza isto quando um Server/Client
 * Component da árvore lança um erro não tratado (ex: falha de rede com o
 * banco). Precisa ser Client Component e recebe `reset()` pra tentar
 * re-renderizar o segmento sem recarregar a página inteira.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log no console do cliente; o detalhe real fica no servidor (não
    // expomos a mensagem crua na UI pra não vazar internals).
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <h1 className="text-[15px] font-medium text-ink mb-1">
        Algo deu errado
      </h1>
      <p className="text-[12px] text-ink-3 mb-5 max-w-[260px]">
        Não foi possível carregar esta tela. Tente de novo em instantes.
      </p>

      <button
        onClick={reset}
        className="rounded-[8px] bg-accent px-4 py-2 text-[13px] font-medium text-on-accent transition-colors hover:bg-accent-2"
      >
        Tentar novamente
      </button>
    </div>
  );
}
