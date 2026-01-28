export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Налаштування</h1>
        <p className="text-sm text-[var(--tg-theme-hint-color)]">
          Графік роботи, буфер між записами, тема та інше.
        </p>
      </div>
      <div className="rounded-2xl border border-black/5 bg-white/70 p-6">
        <p className="text-sm text-[var(--tg-theme-hint-color)]">
          Тут буде форма налаштувань та збереження у Telegram Cloud Storage.
        </p>
      </div>
    </div>
  );
}
