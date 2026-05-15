import { currentUser } from "@clerk/nextjs/server";
import { getWorkouts } from "@/lib/actions/workouts";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

const MONTHS_PT = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];

export default async function ProfilePage() {
  const user = await currentUser();
  const workouts = await getWorkouts();

  const createdAt = user?.createdAt ? new Date(user.createdAt) : new Date();
  const memberSince = `${MONTHS_PT[createdAt.getMonth()]} ${createdAt.getFullYear()}`;

  const initials = (user?.firstName?.[0] ?? "A").toUpperCase();
  const firstName = user?.firstName ?? "Você";

  return (
    <div className="px-4 pt-4 pb-4 max-w-lg mx-auto lg:max-w-none lg:px-6 lg:pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[16px] font-medium text-[#F0EDE6]">Perfil</h1>
      </div>

      {/* Avatar + name */}
      <div className="flex flex-col items-center text-center mb-5">
        <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#E8612B] text-[20px] font-medium text-white mb-3 overflow-hidden">
          {user?.imageUrl ? (
            <Image src={user.imageUrl} alt="Perfil" width={52} height={52} className="object-cover w-full h-full" />
          ) : (
            initials
          )}
        </div>
        <p className="text-[15px] font-medium text-[#F0EDE6]">{firstName}</p>
        <p className="text-[11px] text-[#5E5C55] mt-0.5">
          Membro desde {memberSince}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="rounded-[10px] border border-white/[0.06] bg-[#141417] p-3 text-center">
          <p className="text-[18px] font-medium text-[#F0EDE6]">
            {workouts.length}
          </p>
          <p className="text-[11px] text-[#5E5C55]">Total treinos</p>
        </div>
        <div className="rounded-[10px] border border-white/[0.06] bg-[#141417] p-3 text-center">
          <p className="text-[18px] font-medium text-[#F0EDE6]">—</p>
          <p className="text-[11px] text-[#5E5C55]">Sequência</p>
        </div>
      </div>

      {/* Menu items */}
      <div className="rounded-[10px] border border-white/[0.06] bg-[#141417] divide-y divide-white/[0.06] mb-4">
        <Link
          href="/profile/dados-pessoais"
          className="flex w-full items-center justify-between px-4 py-3 text-[13px] text-[#F0EDE6] transition-colors hover:bg-[#1B1B1F]"
        >
          Dados pessoais
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5E5C55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>
        {["Notificações", "Aparência", "Sobre o app"].map((item) => (
          <button
            key={item}
            className="flex w-full items-center justify-between px-4 py-3 text-[13px] text-[#F0EDE6] transition-colors hover:bg-[#1B1B1F]"
          >
            {item}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#5E5C55"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        ))}
      </div>

      {/* Sign out */}
      <SignOutButton>
        <button className="w-full rounded-[8px] border border-[#E24B4A]/30 py-2.5 text-[13px] font-medium text-[#E24B4A] transition-colors hover:bg-[#E24B4A]/10">
          Sair da conta
        </button>
      </SignOutButton>
    </div>
  );
}
