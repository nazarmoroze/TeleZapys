"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

export function TelegramCloseButton({
  label,
  action = "back",
}: {
  label?: string;
  action?: "back" | "close";
}) {
  const router = useRouter();
  const handleClose = useCallback(() => {
    const webApp = window.Telegram?.WebApp;
    webApp?.HapticFeedback?.impactOccurred("light");
    if (action === "back") {
      if (window.history.length > 1) {
        router.back();
        return;
      }

      if (webApp?.close) {
        webApp.close();
        return;
      }

      window.close();
      return;
    }

    if (webApp?.close) {
      webApp.close();
      return;
    }

    if (window.history.length > 1) {
      router.back();
      return;
    }

    window.close();
  }, [action, router]);

  return (
    <button
      type="button"
      onClick={handleClose}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-base font-semibold text-[var(--tg-theme-text-color)]"
      title={label ?? "Закрити або згорнути"}
    >
      <span className="leading-none">×</span>
    </button>
  );
}
