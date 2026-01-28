import Link from "next/link";
import WindowControlsBar from "@/components/telegram/WindowControlsBar";

export default function BookingPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="h-[var(--tg-viewport-height,100vh)] bg-[var(--tg-theme-bg-color)]">
      <WindowControlsBar label="TeleZapys Booking" />
      <div className="mx-auto flex w-full max-w-md flex-col gap-5 px-4 pb-10 pt-[calc(var(--app-header-height)+env(safe-area-inset-top,0px)+8px)]">
        <span className="text-xs uppercase tracking-[0.3em] text-[var(--tg-theme-hint-color)]">
          Self-booking
        </span>
        <h1 className="text-2xl font-semibold tracking-tight">
          Запис до майстра {params.id}
        </h1>
        <p className="text-sm text-[var(--tg-theme-hint-color)]">
          Сторінка публічного запису. Тут з&apos;явиться вибір послуги, дати та часу.
        </p>
        <Link
          className="inline-flex w-fit items-center justify-center rounded-xl border border-black/10 px-5 py-3 text-sm font-semibold"
          href="/"
        >
          Повернутись
        </Link>
      </div>
    </div>
  );
}
