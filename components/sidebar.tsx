"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";

interface SidebarProps {
  userInfo: {
    firstName: string;
    initials: string;
    imageUrl: string | null;
    plan: string;
  } | null;
}

const NAV_SECTIONS = [
  {
    label: "TREINOS",
    items: [
      { href: "/", label: "Dashboard", icon: DashboardIcon },
      { href: "/workouts", label: "Meus treinos", icon: WorkoutsIcon },
      { href: "/workouts/new", label: "Criar treino", icon: PlusIcon },
    ],
  },
  {
    label: "PROGRESSO",
    // "/measurements" era link morto (rota não existe) — removido até a
    // feature de medidas existir.
    items: [{ href: "/history", label: "Histórico", icon: HistoryIcon }],
  },
  {
    label: "CONTA",
    // "/settings" não existia; o hub real de conta é o perfil.
    items: [{ href: "/profile", label: "Perfil", icon: SettingsIcon }],
  },
];

export function Sidebar({ userInfo }: SidebarProps) {
  const pathname = usePathname();

  if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
    return null;
  }

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/workouts")
      return (
        pathname.startsWith("/workouts") && pathname !== "/workouts/new"
      );
    return pathname === href;
  };

  return (
    <aside className="hidden lg:flex w-[200px] flex-shrink-0 flex-col border-r border-line bg-base h-screen sticky top-0">
      {/* Logo */}
      <div className="px-4 pt-5 pb-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-accent">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--on-accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 4v16M18 4v16" strokeWidth="3" />
              <path d="M3 9v6M21 9v6" strokeWidth="3" />
              <path d="M6 12h12" />
            </svg>
          </div>
          <span
            className="text-[16px] text-ink"
            style={{ fontFamily: "var(--font-instrument-serif)" }}
          >
            Training Bro
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-4">
            <p className="px-3 pb-1.5 pt-3 text-[11px] font-medium uppercase tracking-[1px] text-ink-3">
              {section.label}
            </p>
            {section.items.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`mx-2 my-0.5 flex items-center gap-2.5 rounded-[7px] px-3 py-2 text-[12px] transition-colors ${
                    active
                      ? "bg-accent/10 text-accent"
                      : "text-ink-2 hover:bg-surface hover:text-ink"
                  }`}
                >
                  <Icon active={active} />
                  {label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User profile */}
      {userInfo && (
        <div className="border-t border-line p-3">
          <div className="flex items-center gap-2.5 rounded-[8px] bg-surface p-2">
            <div className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-full bg-accent text-[12px] font-medium text-on-accent overflow-hidden">
              {userInfo.imageUrl ? (
                <Image src={userInfo.imageUrl} alt="Perfil" width={30} height={30} className="object-cover w-full h-full" />
              ) : (
                userInfo.initials
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-medium text-ink">
                {userInfo.firstName}
              </p>
              <p className="truncate text-[11px] text-ink-3">
                {userInfo.plan}
              </p>
            </div>
            <SignOutButton>
              <button
                className="flex-shrink-0 text-ink-3 hover:text-ink-2 transition-colors"
                title="Sair"
              >
                <SignOutIcon />
              </button>
            </SignOutButton>
          </div>
        </div>
      )}
    </aside>
  );
}

/* ── Icons ── */

function DashboardIcon({ active }: { active?: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "var(--accent)" : "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function WorkoutsIcon({ active }: { active?: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "var(--accent)" : "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function PlusIcon({ active }: { active?: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "var(--accent)" : "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function HistoryIcon({ active }: { active?: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "var(--accent)" : "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}


function SettingsIcon({ active }: { active?: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "var(--accent)" : "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function SignOutIcon() {
  return (
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
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
