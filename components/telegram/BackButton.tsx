"use client";

import { useEffect, useEffectEvent } from "react";
import { useRouter } from "next/navigation";

export function TelegramBackButton() {
  const router = useRouter();
  const handleBack = useEffectEvent(() => {
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred("light");
    router.back();
  });

  useEffect(() => {
    const webApp = window.Telegram?.WebApp;
    if (!webApp) return;

    webApp.BackButton.show();
    webApp.BackButton.onClick(handleBack);

    return () => {
      webApp.BackButton.hide();
      webApp.BackButton.offClick(handleBack);
    };
  }, []);

  return null;
}
