/**
 * Registro dos temas do app. As cores de verdade vivem em app/globals.css
 * (blocos [data-theme]); aqui ficam só os metadados que o JS precisa:
 * - label e swatches para o seletor em /profile/aparencia;
 * - statusBar: cor aplicada na <meta name="theme-color"> (a barra de status
 *   do celular quando o PWA está instalado) — deve ser igual ao --base do tema.
 *
 * Ao adicionar um tema novo: criar o bloco no globals.css E uma entrada aqui.
 */

export const THEME_STORAGE_KEY = "tb-theme";

export interface ThemeMeta {
  id: string;
  label: string;
  /** Cor da status bar do PWA — manter igual ao --base do tema. */
  statusBar: string;
  /** Amostras exibidas no card do seletor: [fundo, cartão, accent, texto]. */
  swatch: [string, string, string, string];
}

export const THEMES: ThemeMeta[] = [
  {
    id: "dark",
    label: "Escuro",
    statusBar: "#0b0b0d",
    swatch: ["#0b0b0d", "#141417", "#e8612b", "#f0ede6"],
  },
  {
    id: "light",
    label: "Claro",
    statusBar: "#f6f4ef",
    swatch: ["#f6f4ef", "#ffffff", "#d14e1d", "#201e1a"],
  },
  {
    id: "catppuccin",
    label: "Catppuccin",
    statusBar: "#1e1e2e",
    swatch: ["#1e1e2e", "#313244", "#fab387", "#cdd6f4"],
  },
  {
    id: "nord",
    label: "Nord",
    statusBar: "#2e3440",
    swatch: ["#2e3440", "#3b4252", "#88c0d0", "#eceff4"],
  },
  {
    id: "amoled",
    label: "AMOLED",
    statusBar: "#000000",
    swatch: ["#000000", "#0e0e10", "#ff6b35", "#f5f5f5"],
  },
];

export const DEFAULT_THEME = "dark";

/** Mapa id → cor da status bar, usado pelo script anti-flash no layout. */
export function themeStatusBarMap(): Record<string, string> {
  return Object.fromEntries(THEMES.map((t) => [t.id, t.statusBar]));
}
