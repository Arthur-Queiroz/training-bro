import Link from "next/link";

/**
 * Página 404. É o que o usuário vê quando um service lança NotFoundError e a
 * página chama notFound() via or404() (ex: abrir um treino que não existe ou
 * que não é dele), ou ao acessar uma URL inexistente.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p
        className="text-[40px] leading-none text-ink-3 mb-3"
        style={{ fontFamily: "var(--font-instrument-serif)" }}
      >
        404
      </p>
      <h1 className="text-[15px] font-medium text-ink mb-1">
        Não encontrado
      </h1>
      <p className="text-[12px] text-ink-3 mb-5 max-w-[260px]">
        Esta página ou treino não existe — ou não pertence à sua conta.
      </p>

      <Link
        href="/"
        className="rounded-[8px] bg-accent px-4 py-2 text-[13px] font-medium text-on-accent transition-colors hover:bg-accent-2"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
