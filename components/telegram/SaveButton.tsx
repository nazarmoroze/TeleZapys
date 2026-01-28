"use client";

import { useEffect, useEffectEvent } from "react";

export function TelegramSaveButton({
  onSave,
  text = "Зберегти",
}: {
  onSave: () => void;
  text?: string;
}) {
  const handleClick = useEffectEvent(() => {
    onSave();
  });

  useEffect(() => {
    const webApp = window.Telegram?.WebApp;
    if (!webApp) return;

    webApp.MainButton.setText(text);
    webApp.MainButton.show();
    webApp.MainButton.onClick(handleClick);

    return () => {
      webApp.MainButton.hide();
      webApp.MainButton.offClick(handleClick);
    };
  }, [text]);

  return null;
}
