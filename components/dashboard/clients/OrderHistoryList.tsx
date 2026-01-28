"use client";

import type { ScheduleItem } from "@/components/dashboard/home/ScheduleList";

export type OrderHistoryItem = ScheduleItem & {
  date: string;
};

type OrderHistoryListProps = {
  items: OrderHistoryItem[];
  title?: string;
  actionLabel?: string;
  showAction?: boolean;
};

export default function OrderHistoryList({
  items,
  title = "Історія записів",
  actionLabel = "Всі записи",
  showAction = false,
}: OrderHistoryListProps) {
  const parseDate = (value: string) => {
    const trimmed = value.trim();
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(trimmed)) {
      const [day, month, year] = trimmed.split(".");
      return new Date(Number(year), Number(month) - 1, Number(day));
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const [year, month, day] = trimmed.split("-");
      return new Date(Number(year), Number(month) - 1, Number(day));
    }
    return null;
  };

  const monthLabel = (value: string) => {
    const parsed = parseDate(value);
    if (!parsed) return value;
    const label = new Intl.DateTimeFormat("uk-UA", {
      month: "long",
      year: "numeric",
    }).format(parsed);
    return label.charAt(0).toUpperCase() + label.slice(1);
  };

  const groupedItems = items.reduce<
    { key: string; label: string; items: OrderHistoryItem[] }[]
  >((acc, item) => {
    const parsed = parseDate(item.date);
    const key = parsed
      ? `${parsed.getFullYear()}-${parsed.getMonth()}`
      : item.date;
    const existing = acc.find((group) => group.key === key);
    if (existing) {
      existing.items.push(item);
    } else {
      acc.push({
        key,
        label: monthLabel(item.date),
        items: [item],
      });
    }
    return acc;
  }, []);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--tg-theme-hint-color)]">
          {title}
        </span>
        {showAction ? (
          <button
            type="button"
            className="rounded-full border border-black/5 bg-white px-3 py-1 text-xs font-semibold text-[#217AF8] transition-transform duration-150 active:scale-[0.98]"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
      <div className="flex flex-col gap-4 pb-6">
        {groupedItems.map((group) => (
          <div key={group.key} className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-[var(--tg-theme-hint-color)]">
              {group.label}
            </span>
            <div className="flex flex-col gap-3">
              {group.items.map((item) => {
                const key = `${item.time}-${item.title}-${item.client}-${item.date}`;
                const isCanceled = item.status === "canceled";
                const accentClass = isCanceled
                  ? "bg-rose-500"
                  : "bg-emerald-500";
                const titleClass = isCanceled
                  ? "text-[var(--tg-theme-hint-color)]"
                  : "text-[var(--tg-theme-text-color)]";
                const priceClass = isCanceled
                  ? "border-rose-100 bg-rose-50 text-rose-600"
                  : "border-emerald-100 bg-emerald-50 text-emerald-700";

                return (
                  <div
                    key={key}
                    className="relative overflow-hidden rounded-2xl border border-black/5 bg-white p-3 shadow-sm"
                  >
                    <span
                      className={`pointer-events-none absolute left-0 top-0 h-full w-1.5 ${accentClass}`}
                    />
                    <div className="flex items-center justify-between gap-2 pl-2">
                      <div className="flex items-center gap-2">
                        <div className="flex min-w-[72px] flex-col items-start">
                          <span className="mb-1 text-[11px] font-semibold leading-none text-[var(--tg-theme-hint-color)]">
                            {item.date}
                          </span>
                          <span
                            className={`text-base font-semibold leading-none tabular-nums ${
                              isCanceled
                                ? "text-[var(--tg-theme-hint-color)] line-through"
                                : "text-[var(--tg-theme-text-color)]"
                            }`}
                          >
                            {item.time}
                          </span>
                          <span
                            className={`mt-0.5 text-[11px] font-medium tabular-nums ${
                              isCanceled
                                ? "text-[var(--tg-theme-hint-color)] line-through"
                                : "text-[var(--tg-theme-hint-color)]"
                            }`}
                          >
                            {item.end}
                          </span>
                        </div>
                        <span className="h-9 w-px rounded-full bg-black/5" />
                        <div className="flex flex-col gap-0.5">
                          <span className={`text-sm font-semibold ${titleClass}`}>
                            {item.title}
                          </span>
                          <span className="text-sm text-[var(--tg-theme-hint-color)]">
                            {item.client}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${priceClass}`}
                      >
                        {item.price}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
