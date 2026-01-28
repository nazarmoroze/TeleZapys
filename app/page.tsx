import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-[var(--tg-viewport-height,100vh)] min-h-screen overflow-hidden overscroll-none bg-[var(--tg-theme-bg-color)]">
      <main className="mx-auto flex h-[var(--tg-viewport-height,100vh)] w-full max-w-md flex-col overflow-hidden px-4 pb-6 text-center">
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/70 p-3">
            <Image
              src="/telezapys-logo.svg"
              alt="TeleZapys"
              width={56}
              height={56}
              priority
            />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold">TeleZapys CRM</h1>
            <p className="text-base text-[var(--tg-theme-hint-color)]">
              Ваш персональний бізнес-асистент у Telegram: записи, клієнти, гроші — все на місці.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 pb-[calc(env(safe-area-inset-bottom,0px)+8px)]">
          <Link
            className="inline-flex w-full items-center justify-center rounded-2xl bg-[#217AF8] px-5 py-4 text-base font-semibold text-white"
            href="/login"
          >
            Увійти
          </Link>
          <Link
            className="inline-flex w-full items-center justify-center rounded-2xl border border-black/10 bg-white/60 px-5 py-4 text-base font-semibold text-[var(--tg-theme-text-color)]"
            href="/register"
          >
            Зареєструватися
          </Link>
        </div>
      </main>
    </div>
  );
}
