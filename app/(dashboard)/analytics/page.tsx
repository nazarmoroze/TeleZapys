export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Аналітика</h1>
        <p className="text-sm text-[var(--tg-theme-hint-color)]">
          Показники доходу та завантаженості.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-black/5 bg-white/70 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--tg-theme-hint-color)]">
            Доходи
          </p>
          <p className="mt-2 text-2xl font-semibold">€0.00</p>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white/70 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--tg-theme-hint-color)]">
            Записи
          </p>
          <p className="mt-2 text-2xl font-semibold">0</p>
        </div>
      </div>
    </div>
  );
}
