"use client";

import { useState } from "react";

export function UpgradeButton({
  tier,
  priceId,
  userId,
}: {
  tier: string;
  priceId: string;
  userId: string;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const canUpgrade = Boolean(userId && priceId);

  const handleUpgrade = async () => {
    const webApp = window.Telegram?.WebApp;
    if (!canUpgrade) {
      webApp?.showAlert?.("Немає активної сесії користувача.");
      return;
    }

    setIsLoading(true);
    webApp?.MainButton.showProgress();

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = (await response.json()) as { url: string };
      if (url) {
        webApp?.openLink(url);
      }
    } catch (error) {
      webApp?.showAlert?.("Помилка при створенні сесії оплати");
      console.error(error);
    } finally {
      webApp?.MainButton.hideProgress();
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleUpgrade}
      disabled={!canUpgrade || isLoading}
      className="w-full rounded-lg bg-[var(--tg-theme-button-color)] px-4 py-3 text-sm font-semibold text-[var(--tg-theme-button-text-color)] disabled:opacity-70"
    >
      {isLoading ? "Переходимо до оплати..." : `Оновити до ${tier}`}
    </button>
  );
}
