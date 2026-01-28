"use client";

import { useEffect } from "react";

const applyThemeParams = (themeParams?: Record<string, string>) => {
  if (!themeParams) return;
  const root = document.documentElement;
  const entries: Array<[string, string | undefined]> = [
    ["--tg-theme-bg-color", themeParams.bg_color],
    ["--tg-theme-text-color", themeParams.text_color],
    ["--tg-theme-hint-color", themeParams.hint_color],
    ["--tg-theme-link-color", themeParams.link_color],
    ["--tg-theme-button-color", themeParams.button_color],
    ["--tg-theme-button-text-color", themeParams.button_text_color],
  ];

  entries.forEach(([key, value]) => {
    if (value) {
      root.style.setProperty(key, value);
    }
  });
};

const applyViewportParams = () => {
  const root = document.documentElement;
  const webApp = window.Telegram?.WebApp;

  if (!webApp) {
    root.style.setProperty("--tg-viewport-height", `${window.innerHeight}px`);
    root.style.setProperty(
      "--tg-viewport-stable-height",
      `${window.innerHeight}px`
    );
    return;
  }

  root.style.setProperty("--tg-viewport-height", `${webApp.viewportHeight}px`);
  root.style.setProperty(
    "--tg-viewport-stable-height",
    `${webApp.viewportStableHeight ?? webApp.viewportHeight}px`
  );
};

export default function TelegramProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const webApp = window.Telegram?.WebApp;
    if (!webApp) return;

    webApp.ready();
    webApp.expand();
    webApp.enableClosingConfirmation();

    const handleThemeChanged = () => applyThemeParams(webApp.themeParams);
    const handleViewportChanged = () => applyViewportParams();

    applyThemeParams(webApp.themeParams);
    applyViewportParams();
    webApp.onEvent?.("themeChanged", handleThemeChanged);
    webApp.onEvent?.("viewportChanged", handleViewportChanged);

    webApp.HapticFeedback?.impactOccurred("light");

    return () => {
      webApp.offEvent?.("themeChanged", handleThemeChanged);
      webApp.offEvent?.("viewportChanged", handleViewportChanged);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => applyViewportParams();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <>{children}</>;
}
