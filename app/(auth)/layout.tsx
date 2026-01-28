import { Suspense } from "react";
import WindowControlsBar from "@/components/telegram/WindowControlsBar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[var(--tg-viewport-height,100vh)] flex-col overflow-hidden overscroll-none bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)]">
      <Suspense fallback={null}>
        <WindowControlsBar />
      </Suspense>
      <div className="mx-auto flex min-h-0 w-full max-w-md flex-1 flex-col gap-6 overflow-hidden px-4 pb-6 pt-[calc(var(--app-header-height)+env(safe-area-inset-top,0px)+48px)]">
        {children}
      </div>
    </div>
  );
}
