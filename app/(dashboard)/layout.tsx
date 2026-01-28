import { Suspense } from "react";
import { TelegramBackButton } from "@/components/telegram/BackButton";
import WindowControlsBar from "@/components/telegram/WindowControlsBar";
import BottomNav from "@/components/navigation/BottomNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex min-h-0 h-[var(--tg-viewport-height,100vh)] flex-col bg-[var(--tg-theme-bg-color)]"
      style={{ "--app-bottom-nav-height": "72px" } as React.CSSProperties}
    >
      <TelegramBackButton />
      <Suspense fallback={null}>
        <WindowControlsBar />
      </Suspense>
      <div className="scroll-area mx-auto w-full max-w-5xl flex-1 min-h-0 overflow-y-auto px-4 pb-[calc(var(--app-bottom-nav-height,72px)+env(safe-area-inset-bottom,0px)+16px)] pt-[calc(var(--app-header-height)+env(safe-area-inset-top,0px)+16px)] sm:px-6">
        {children}
      </div>
      <Suspense fallback={null}>
        <BottomNav />
      </Suspense>
    </div>
  );
}
