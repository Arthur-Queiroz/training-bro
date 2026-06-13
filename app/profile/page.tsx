import { currentUser } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { listWorkouts } from "@/lib/services/workouts";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

const MONTHS_PT = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];

export default async function ProfilePage() {
  const user = await currentUser();
  const { userId } = await auth();
  if (!userId) throw new Error("Não autenticado");
  const workouts = await listWorkouts(userId);

  const createdAt = user?.createdAt ? new Date(user.createdAt) : new Date();
  const memberSince = `${MONTHS_PT[createdAt.getMonth()]} ${createdAt.getFullYear()}`;

  const initials = (user?.firstName?.[0] ?? "A").toUpperCase();
  const firstName = user?.firstName ?? "Você";

  return (
    <div className="px-4 pt-4 pb-4 max-w-lg mx-auto lg:max-w-none lg:px-6 lg:pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[16px] font-medium text-ink">Perfil</h1>
      </div>

      {/* Avatar + name */}
      <div className="flex flex-col items-center text-center mb-5">
        <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-accent text-[20px] font-medium text-on-accent mb-3 overflow-hidden">
          {user?.imageUrl ? (
            <Image src={user.imageUrl} alt="Perfil" width={52} height={52} className="object-cover w-full h-full" />
          ) : (
            initials
          )}
        </div>
        <p className="text-[15px] font-medium text-ink">{firstName}</p>
        <p className="text-[11px] text-ink-3 mt-0.5">
          Membro desde {memberSince}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="rounded-[10px] border border-line bg-surface p-3 text-center">
          <p className="text-[18px] font-medium text-ink">
            {workouts.length}
          </p>
          <p className="text-[11px] text-ink-3">Total treinos</p>
        </div>
        <div className="rounded-[10px] border border-line bg-surface p-3 text-center">
          <p className="text-[18px] font-medium text-ink">—</p>
          <p className="text-[11px] text-ink-3">Sequência</p>
        </div>
      </div>

      {/* Menu items */}
      <div className="rounded-[10px] border border-line bg-surface divide-y divide-line mb-4">
        <Link
          href="/profile/dados-pessoais"
          className="flex w-full items-center justify-between px-4 py-3 text-[13px] text-ink transition-colors hover:bg-surface-2"
        >
          Dados pessoais
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>
        {/* "Notificações" e "Sobre o app" eram botões sem ação — removidos
            até existirem de verdade. Botão que não responde = app quebrado
            aos olhos do usuário. */}
        <Link
          href="/profile/aparencia"
          className="flex w-full items-center justify-between px-4 py-3 text-[13px] text-ink transition-colors hover:bg-surface-2"
        >
          Aparência
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--ink-3)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>
      </div>

      {/* Sign out */}
      <SignOutButton>
        <button className="w-full rounded-[8px] border border-danger/30 py-2.5 text-[13px] font-medium text-danger transition-colors hover:bg-danger/10">
          Sair da conta
        </button>
      </SignOutButton>
    </div>
  );
}
