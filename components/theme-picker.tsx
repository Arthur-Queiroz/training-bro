"use client";

import { useSyncExternalStore } from "react";
import { THEMES, THEME_STORAGE_KEY, DEFAULT_THEME } from "@/lib/themes";

// O tema salvo vive fora do React (localStorage), então a leitura usa
// useSyncExternalStore: o evento abaixo notifica o hook quando applyTheme
// grava um tema novo (e manteria múltiplos pickers em sincronia).
const THEME_CHANGE_EVENT = "tb-theme-change";

function subscribe(onChange: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  return () => window.removeEventListener(THEME_CHANGE_EVENT, onChange);
}

function getActiveTheme(): string {
  return localStorage.getItem(THEME_STORAGE_KEY) ?? DEFAULT_THEME;
}

// No servidor não existe localStorage — nenhum card aparece marcado até a
// hidratação (evita marcar o tema errado e "pular" depois).
function getServerTheme(): string | undefined {
  return undefined;
}

/**
 * Seletor de temas. A troca é 100% client-side:
 * 1. grava a escolha no localStorage (o script inline do layout relê a cada
 *    visita, antes da primeira pintura — sem flash);
 * 2. aplica data-theme no <html>, que ativa o bloco de variáveis CSS do tema
 *    em globals.css;
 * 3. atualiza a <meta name="theme-color"> pra status bar do celular
 *    acompanhar (importante no PWA instalado).
 */
export function ThemePicker() {
  const active = useSyncExternalStore(subscribe, getActiveTheme, getServerTheme);

  function applyTheme(id: string) {
    const theme = THEMES.find((t) => t.id === id);
    if (!theme) return;

    const root = document.documentElement;

    // Transição suave só durante a troca (classe definida no globals.css);
    // mantê-la sempre ativa deixaria toda interação com cor "arrastada".
    root.classList.add("theme-transition");
    window.setTimeout(() => root.classList.remove("theme-transition"), 250);

    root.setAttribute("data-theme", id);
    localStorage.setItem(THEME_STORAGE_KEY, id);

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme.statusBar);

    // Notifica o useSyncExternalStore pra re-renderizar com o novo ativo.
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {THEMES.map((theme) => {
        const isActive = theme.id === active;
        const [base, surface, accent, ink] = theme.swatch;
        return (
          <button
            key={theme.id}
            onClick={() => applyTheme(theme.id)}
            aria-pressed={isActive}
            className={`rounded-[10px] border p-3 text-left transition-colors ${
              isActive
                ? "border-accent bg-surface"
                : "border-line bg-surface hover:bg-surface-2"
            }`}
          >
            {/* Mini-preview do tema: fundo + cartão + accent + texto */}
            <div
              className="mb-2 flex h-12 items-center justify-center gap-1.5 rounded-[7px] border border-line"
              style={{ backgroundColor: base }}
            >
              <span
                className="h-6 w-6 rounded-[5px]"
                style={{ backgroundColor: surface }}
              />
              <span
                className="h-6 w-6 rounded-full"
                style={{ backgroundColor: accent }}
              />
              <span
                className="h-1.5 w-8 rounded-full"
                style={{ backgroundColor: ink }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium text-ink">
                {theme.label}
              </span>
              {isActive && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
