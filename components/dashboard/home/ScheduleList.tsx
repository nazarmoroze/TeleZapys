"use client";

import { useState } from "react";
import {
  FiChevronDown,
  FiMessageCircle,
  FiPhone,
  FiRepeat,
  FiUser,
} from "react-icons/fi";

export type ScheduleItem = {
  time: string;
  end: string;
  title: string;
  client: string;
  price: string;
  status: "active" | "canceled";
};

type ScheduleListProps = {
  items: ScheduleItem[];
  title?: string;
  actionLabel?: string;
  showAction?: boolean;
};

export default function ScheduleList({
  items,
  title = "Сьогоднішній розклад",
  actionLabel = "Всі записи",
  showAction = true,
}: ScheduleListProps) {
  const [openCard, setOpenCard] = useState<string | null>(null);

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
      <div className="flex flex-col gap-3 pb-6">
        {items.map((item) => {
          const key = `${item.time}-${item.title}-${item.client}`;
          const isCanceled = item.status === "canceled";
          const accentClass = isCanceled ? "bg-rose-500" : "bg-emerald-500";
          const titleClass = isCanceled
            ? "text-[var(--tg-theme-hint-color)]"
            : "text-[var(--tg-theme-text-color)]";
          const priceClass = isCanceled
            ? "border-rose-100 bg-rose-50 text-rose-600"
            : "border-emerald-100 bg-emerald-50 text-emerald-700";
          const isOpen = openCard === key;

          return (
            <div
              key={key}
              className="relative overflow-hidden rounded-2xl border border-black/5 bg-white p-3 shadow-sm"
            >
              <span
                className={`pointer-events-none absolute left-0 top-0 h-full w-1.5 ${accentClass}`}
              />
              <div className="flex items-center justify-between gap-2 pl-2 transition-transform duration-150 active:scale-[0.99]">
                <div className="flex items-center gap-2">
                  <div className="flex min-w-[48px] flex-col items-start">
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
                <div className="flex items-center gap-1.5">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${priceClass}`}
                  >
                    {item.price}
                  </span>
                  <button
                    type="button"
                    aria-label={isOpen ? "Згорнути" : "Розгорнути"}
                    onClick={() =>
                      setOpenCard((prev) => (prev === key ? null : key))
                    }
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-black/5 text-[var(--tg-theme-hint-color)]"
                  >
                    <FiChevronDown
                      className={`h-4 w-4 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
              <div
                className={`grid transition-[grid-template-rows,opacity,transform] duration-200 ease-in-out ${
                  isOpen
                    ? "grid-rows-[1fr] translate-y-0 opacity-100"
                    : "grid-rows-[0fr] -translate-y-1 opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="mt-3 border-t border-black/5 pl-2 pt-3">
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        type="button"
                        className="flex flex-col items-center gap-1 rounded-2xl bg-slate-50 px-2 py-2 text-[11px] font-medium text-[var(--tg-theme-text-color)] transition-transform duration-150 active:scale-[0.97]"
                      >
                        <FiPhone className="h-4 w-4 text-[#217AF8]" />
                        Дзвінок
                      </button>
                      <button
                        type="button"
                        className="flex flex-col items-center gap-1 rounded-2xl bg-slate-50 px-2 py-2 text-[11px] font-medium text-[var(--tg-theme-text-color)] transition-transform duration-150 active:scale-[0.97]"
                      >
                        <FiMessageCircle className="h-4 w-4 text-[#217AF8]" />
                        Написати
                      </button>
                      <button
                        type="button"
                        className="flex flex-col items-center gap-1 rounded-2xl bg-slate-50 px-2 py-2 text-[11px] font-medium text-[var(--tg-theme-text-color)] transition-transform duration-150 active:scale-[0.97]"
                      >
                        <FiRepeat className="h-4 w-4 text-[#217AF8]" />
                        Перенести
                      </button>
                      <button
                        type="button"
                        className="flex flex-col items-center gap-1 rounded-2xl bg-slate-50 px-2 py-2 text-[11px] font-medium text-[var(--tg-theme-text-color)] transition-transform duration-150 active:scale-[0.97]"
                      >
                        <FiUser className="h-4 w-4 text-[#217AF8]" />
                        Контакт
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
