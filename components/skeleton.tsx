/**
 * Bloco de carregamento (placeholder pulsante). Usado pelos arquivos
 * loading.tsx das rotas pra desenhar o "esqueleto" da página enquanto os
 * dados chegam do servidor — evita tela em branco no 4G da academia.
 *
 * Estilo: bg-surface-2 (um degrau acima do fundo, visível em todos os temas)
 * + animate-pulse do Tailwind. Passe width/height/rounded via className.
 */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`animate-pulse rounded-[6px] bg-surface-2 ${className}`}
    />
  );
}
