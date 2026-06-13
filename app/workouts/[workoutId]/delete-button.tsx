"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteWorkoutButton({ workoutId }: { workoutId: string }) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Excluir este treino e todos os seus exercícios?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/workouts/${workoutId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir");
      router.push("/workouts");
      router.refresh();
    } catch {
      alert("Erro ao excluir treino.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="w-full rounded-[8px] border border-danger/30 bg-danger/10 py-2.5 text-[13px] font-medium text-danger transition-colors hover:bg-danger/20 disabled:opacity-50"
    >
      {deleting ? "Excluindo..." : "Excluir treino"}
    </button>
  );
}