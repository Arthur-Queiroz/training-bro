import { Skeleton } from "@/components/skeleton";

/**
 * Fallback de carregamento padrão (raiz). O Next mostra isto durante a
 * navegação enquanto o Server Component da página suspende buscando dados.
 * É herdado por qualquer rota que não tenha um loading.tsx próprio, então
 * mantém um formato neutro: cabeçalho + alguns blocos, no mesmo container
 * (padding/largura) das páginas pra não "pular" quando o conteúdo entra.
 */
export default function Loading() {
  return (
    <div className="px-4 pt-4 pb-4 max-w-lg mx-auto lg:max-w-none lg:px-6 lg:pt-6">
      {/* Título */}
      <Skeleton className="h-5 w-32 mb-5" />

      {/* Blocos de conteúdo */}
      <div className="space-y-2">
        <Skeleton className="h-16 w-full rounded-[10px]" />
        <Skeleton className="h-16 w-full rounded-[10px]" />
        <Skeleton className="h-16 w-full rounded-[10px]" />
      </div>
    </div>
  );
}
