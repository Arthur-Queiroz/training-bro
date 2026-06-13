import type { Metadata, Viewport } from "next";
import { Instrument_Serif, DM_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { SWRegister } from "@/components/sw-register";
import { Sidebar } from "@/components/sidebar";
import { BottomNav } from "@/components/bottom-nav";
import { THEME_STORAGE_KEY, themeStatusBarMap } from "@/lib/themes";
import "./globals.css";

// Roda ANTES da primeira pintura (script inline no topo do <body>): lê o tema
// salvo e aplica o data-theme no <html>, evitando o flash do tema padrão.
// Também sincroniza a <meta name="theme-color"> (status bar do PWA).
// É string estática gerada no servidor — sem input de usuário.
const themeInitScript = `(function(){try{
var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
var m=${JSON.stringify(themeStatusBarMap())};
if(t&&m[t]){
document.documentElement.dataset.theme=t;
var meta=document.querySelector('meta[name="theme-color"]');
if(meta)meta.setAttribute("content",m[t]);
}}catch(e){}})();`;

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Training Bro",
  description: "Your personal training companion",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Training Bro",
  },
  icons: {
    apple: "/training-bro-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0d",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();
  const userInfo = user
    ? {
        firstName: user.firstName ?? "Você",
        initials: (user.firstName?.[0] ?? "A").toUpperCase(),
        imageUrl: user.imageUrl ?? null,
        plan: "Plano free",
      }
    : null;

  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/"
      afterSignUpUrl="/"
    >
      <html
        lang="pt-BR"
        className={`${instrumentSerif.variable} ${dmSans.variable}`}
      >
        <body className="bg-base text-ink antialiased">
          <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
          <div className="flex min-h-screen">
            <Sidebar userInfo={userInfo} />
            <main className="flex-1 min-w-0 pb-20 lg:pb-0">{children}</main>
          </div>
          <BottomNav />
          <SWRegister />
        </body>
      </html>
    </ClerkProvider>
  );
}
