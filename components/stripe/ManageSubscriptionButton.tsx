"use client";

import { useState } from "react";

export function ManageSubscriptionButton({
  userId,
}: {
  userId: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const canManage = Boolean(userId);

  const handleManage = async () => {
    const webApp = window.Telegram?.WebApp;
    if (!canManage) {
      webApp?.showAlert?.("Немає активної сесії користувача.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/create-portal-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create portal session");
      }

      const { url } = (await response.json()) as { url: string };
      if (url) {
        webApp?.openLink(url);
      }
    } catch (error) {
      webApp?.showAlert?.("Помилка при відкритті порталу Stripe");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleManage}
      disabled={!canManage || isLoading}
      className="w-full rounded-lg border border-black/10 px-4 py-3 text-sm font-semibold text-[var(--tg-theme-text-color)] disabled:opacity-70"
    >
      {isLoading ? "Відкриваємо портал..." : "Керувати підпискою"}
    </button>
  );
}
