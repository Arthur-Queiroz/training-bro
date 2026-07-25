"use client";

import { useState } from "react";

interface ShareWorkoutButtonProps {
  workoutId: string;
}

export function ShareWorkoutButton({ workoutId }: ShareWorkoutButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    setLoading(true);
    try {
      const res = await fetch(`/api/workouts/${workoutId}/share`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Erro ao gerar link");
      const { data } = await res.json();
      const url = `${window.location.origin}/shared/${data.token}`;
      setShareUrl(url);
      setOpen(true);
    } catch {
      alert("Erro ao gerar link de compartilhamento.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Erro ao copiar link.");
    }
  }

  function handleClose() {
    setOpen(false);
    setShareUrl(null);
    setCopied(false);
  }

  if (open && shareUrl) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-sm rounded-[12px] border border-line bg-surface p-4">
          <p className="text-[14px] font-medium text-ink mb-3">
            Link de compartilhamento
          </p>
          <p className="text-[12px] text-ink-3 mb-3">
            Qualquer pessoa com este link pode importar uma cópia deste treino.
          </p>
          <div className="rounded-[8px] border border-line bg-surface-2 p-2 mb-3">
            <p className="text-[11px] text-ink-2 break-all font-mono">
              {shareUrl}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 rounded-[8px] bg-accent py-2 text-[13px] font-medium text-on-accent transition-colors hover:bg-accent-2"
            >
              {copied ? "Copiado!" : "Copiar link"}
            </button>
            <button
              onClick={handleClose}
              className="rounded-[8px] border border-line bg-surface px-4 py-2 text-[13px] font-medium text-ink transition-colors hover:bg-surface-2"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleShare}
      disabled={loading}
      className="rounded-[8px] border border-line bg-surface px-4 py-2.5 text-[13px] font-medium text-ink transition-colors hover:bg-surface-2 disabled:opacity-50"
    >
      {loading ? "Gerando..." : "Compartilhar"}
    </button>
  );
}
