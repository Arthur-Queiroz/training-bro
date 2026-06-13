"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function SWRegister() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      // Force update: unregister any existing SW, clear caches, then re-register
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        const updatePromises = registrations.map((reg) => reg.update());
        Promise.all(updatePromises).then(() => {
          navigator.serviceWorker
            .register("/sw.js", { updateViaCache: "none" })
            .catch((err) => {
              console.error("SW registration failed:", err);
            });
        });
      });
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
    }
    setInstallPrompt(null);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex items-center justify-between gap-3 rounded-lg border border-line bg-surface-2 p-4 shadow-lg">
      <p className="text-sm text-ink">
        Instale o <strong>Training Bro</strong> no seu dispositivo!
      </p>
      <div className="flex shrink-0 gap-2">
        <button
          onClick={() => setShowBanner(false)}
          className="rounded-md px-3 py-1.5 text-sm text-ink-2 transition-colors hover:text-ink"
        >
          Agora não
        </button>
        <button
          onClick={handleInstall}
          className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-on-accent transition-colors hover:bg-accent-2"
        >
          Instalar
        </button>
      </div>
    </div>
  );
}
