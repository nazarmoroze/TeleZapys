import { FiPlus } from "react-icons/fi";

export default function ServicesPage() {
  return (
    <div className="flex flex-col gap-4 pb-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-[var(--tg-theme-hint-color)]">
            Послуги
          </span>
          <span className="text-lg font-semibold text-[var(--tg-theme-text-color)]">
            Перелік послуг
          </span>
        </div>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-[#217AF8] px-4 text-sm font-semibold text-white transition-transform duration-150 active:scale-[0.98]"
        >
          <FiPlus className="h-4 w-4" />
          Додати послугу
        </button>
      </div>

      <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[var(--tg-theme-text-color)]">
              Манікюр
            </span>
            <span className="text-xs text-[var(--tg-theme-hint-color)]">
              60 хв · Базова
            </span>
          </div>
          <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            500 ₴
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[var(--tg-theme-text-color)]">
              Педикюр SPA
            </span>
            <span className="text-xs text-[var(--tg-theme-hint-color)]">
              90 хв · Догляд
            </span>
          </div>
          <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            900 ₴
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[var(--tg-theme-text-color)]">
              Консультація
            </span>
            <span className="text-xs text-[var(--tg-theme-hint-color)]">
              30 хв · Безкоштовно
            </span>
          </div>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-[var(--tg-theme-hint-color)]">
            0 ₴
          </span>
        </div>
      </div>
    </div>
  );
}
