import Link from "next/link";
import { ThemePicker } from "@/components/theme-picker";

export default function AparenciaPage() {
  return (
    <div className="px-4 pt-4 pb-4 max-w-lg mx-auto lg:max-w-none lg:px-6 lg:pt-6">
      <Link
        href="/profile"
        className="inline-flex items-center gap-1.5 text-[12px] text-ink-3 hover:text-ink-2 transition-colors mb-4"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Voltar
      </Link>

      <h1 className="text-[16px] font-medium text-ink mb-1">Aparência</h1>
      <p className="text-[12px] text-ink-3 mb-5">
        Escolha o tema do app. A preferência fica salva neste dispositivo.
      </p>

      <ThemePicker />
    </div>
  );
}
