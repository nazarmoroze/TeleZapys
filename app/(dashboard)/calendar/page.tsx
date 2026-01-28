"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ScheduleList, {
  ScheduleItem,
} from "@/components/dashboard/home/ScheduleList";

type EventStatus = "active" | "canceled";

type CalendarEvent = {
  id: string;
  date: string; // YYYY-MM-DD
  time: string;
  end: string;
  title: string;
  price: string;
  status: EventStatus;
};

const weekdayLabels = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

const demoEvents: CalendarEvent[] = [
  {
    id: "e1",
    date: "2026-01-27",
    time: "10:00",
    end: "11:30",
    title: "Манікюр",
    price: "800 ₴",
    status: "active",
  },
  {
    id: "e2",
    date: "2026-01-27",
    time: "12:30",
    end: "13:30",
    title: "Педикюр",
    price: "950 ₴",
    status: "canceled",
  },
  {
    id: "e3",
    date: "2026-01-28",
    time: "15:00",
    end: "16:00",
    title: "Брови",
    price: "500 ₴",
    status: "active",
  },
  {
    id: "e4",
    date: "2026-01-30",
    time: "11:00",
    end: "12:00",
    title: "Стрижка",
    price: "700 ₴",
    status: "active",
  },
];

const toISODate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getWeekStart = (date: Date) => {
  const start = new Date(date);
  const day = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - day);
  start.setHours(0, 0, 0, 0);
  return start;
};

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const getMonthDays = (date: Date) => {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const start = getWeekStart(first);
  return Array.from({ length: 42 }, (_, index) => addDays(start, index));
};

export default function CalendarPage() {
  const [view, setView] = useState<"week" | "month">("week");
  const [activeDate, setActiveDate] = useState<Date | null>(null);
  const [todayIso, setTodayIso] = useState<string | null>(null);
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const [calendarHeight, setCalendarHeight] = useState(0);
  const swipeStartX = useRef(0);
  const swipeStartY = useRef(0);
  const swipeStartTime = useRef(0);
  const [weekSwipePhase, setWeekSwipePhase] = useState<
    "" | "in-left" | "in-right"
  >("");
  const isWeekAnimating = useRef(false);
  const [weekSwipeKey, setWeekSwipeKey] = useState(0);

  const weekStart = useMemo(
    () => (activeDate ? getWeekStart(activeDate) : null),
    [activeDate]
  );
  const weekDays = useMemo(
    () =>
      weekStart
        ? Array.from({ length: 7 }, (_, index) => addDays(weekStart, index))
        : [],
    [weekStart]
  );
  const monthDays = useMemo(
    () => (activeDate ? getMonthDays(activeDate) : []),
    [activeDate]
  );

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    demoEvents.forEach((event) => {
      const items = map.get(event.date) ?? [];
      items.push(event);
      map.set(event.date, items);
    });
    return map;
  }, []);

  const monthLabel = useMemo(() => {
    if (!activeDate) return "";
    return new Intl.DateTimeFormat("uk-UA", {
      month: "long",
      year: "numeric",
    }).format(activeDate);
  }, [activeDate]);

  const shiftMonth = (delta: number) => {
    if (!activeDate) return;
    const next = new Date(activeDate);
    next.setDate(1);
    next.setMonth(next.getMonth() + delta);
    setActiveDate(next);
  };

  const shiftWeek = (delta: number) => {
    setActiveDate((prev) => (prev ? addDays(prev, delta * 7) : prev));
  };

  const activeIso = activeDate ? toISODate(activeDate) : null;
  const activeEvents = activeIso ? eventsByDate.get(activeIso) ?? [] : [];
  const scheduleItems: ScheduleItem[] = activeEvents.map((event) => ({
    time: event.time,
    end: event.end,
    title: event.title,
    client: "Клієнт",
    price: event.price,
    status: event.status,
  }));

  useEffect(() => {
    if (!activeDate) {
      setActiveDate(new Date());
    }
    if (!todayIso) {
      setTodayIso(toISODate(new Date()));
    }

    const element = calendarRef.current;
    if (!element) return;

    const updateHeight = () => setCalendarHeight(element.offsetHeight);
    updateHeight();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);
    return () => observer.disconnect();
  }, [view, activeDate, todayIso]);

  const handleWeekTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (view !== "week") return;
    const touch = event.touches[0];
    swipeStartX.current = touch.clientX;
    swipeStartY.current = touch.clientY;
    swipeStartTime.current = Date.now();
  };

  const handleWeekTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (view !== "week" || isWeekAnimating.current) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - swipeStartX.current;
    const deltaY = touch.clientY - swipeStartY.current;
    const elapsed = Date.now() - swipeStartTime.current;

    if (Math.abs(deltaX) < 40 || Math.abs(deltaX) < Math.abs(deltaY)) {
      return;
    }

    if (elapsed > 600) {
      return;
    }

    const direction = deltaX < 0 ? 1 : -1;
    isWeekAnimating.current = true;
    shiftWeek(direction);
    setWeekSwipeKey((prev) => prev + 1);
    setWeekSwipePhase(direction === 1 ? "in-right" : "in-left");
    requestAnimationFrame(() => {
      setWeekSwipePhase("");
      window.setTimeout(() => {
        isWeekAnimating.current = false;
      }, 220);
    });
  };

  if (!activeDate) {
    return <div className="flex flex-1 flex-col" />;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div
        ref={calendarRef}
        className="calendar-fixed fixed left-0 right-0 z-20 bg-[var(--tg-theme-bg-color)]"
        style={{
          top: "calc(var(--app-header-height)+env(safe-area-inset-top,0px))",
        }}
      >
        <div className="mx-auto w-full max-w-5xl px-4 pb-4 sm:px-6">
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-[var(--tg-theme-hint-color)]">
                  Календар
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-[var(--tg-theme-text-color)]">
                    {monthLabel}
                  </span>
                  {view === "month" ? (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label="Попередній місяць"
                        onClick={() => shiftMonth(-1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-black/5 text-[var(--tg-theme-hint-color)] transition-transform duration-150 active:scale-[0.96]"
                      >
                        <FiChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Наступний місяць"
                        onClick={() => shiftMonth(1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-black/5 text-[var(--tg-theme-hint-color)] transition-transform duration-150 active:scale-[0.96]"
                      >
                        <FiChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {view === "week" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveDate(new Date());
                      setView("week");
                    }}
                    className="rounded-full border border-black/5 bg-white px-3 py-1 text-xs font-semibold text-[var(--tg-theme-text-color)] transition-transform duration-150 active:scale-[0.98]"
                  >
                    Сьогодні
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() =>
                    setView((prev) => (prev === "week" ? "month" : "week"))
                  }
                  className="flex items-center gap-2 rounded-full border border-black/5 bg-white px-3 py-1 text-xs font-semibold text-[#217AF8] transition-transform duration-150 active:scale-[0.98]"
                >
                  {view === "week" ? "Місяць" : "Тиждень"}
                  <FiChevronDown
                    className={`h-4 w-4 transition-transform ${
                      view === "month" ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-[11px] font-medium text-[var(--tg-theme-hint-color)]">
              {weekdayLabels.map((label) => (
                <span key={label} className="text-center">
                  {label}
                </span>
              ))}
            </div>

            <div
              className={`grid gap-2 transition-[grid-template-rows,opacity,transform] duration-200 ease-in-out ${
                view === "week"
                  ? "grid-rows-[1fr] translate-y-0 opacity-100"
                  : "grid-rows-[0fr] -translate-y-1 opacity-0"
              }`}
            >
              <div
                className={`overflow-hidden week-swipe ${
                  weekSwipePhase ? `week-swipe--${weekSwipePhase}` : ""
                }`}
                onTouchStart={handleWeekTouchStart}
                onTouchEnd={handleWeekTouchEnd}
              >
                <div
                  key={weekSwipeKey}
                  className={`grid grid-cols-7 gap-2 week-swipe ${
                    weekSwipePhase ? `week-swipe--${weekSwipePhase}` : ""
                  }`}
                >
                  {weekDays.map((day) => {
                    const iso = toISODate(day);
                    const isToday = todayIso === iso;
                    const isActive = iso === toISODate(activeDate);
                    return (
                      <button
                        key={iso}
                        type="button"
                        onClick={() => {
                          setActiveDate(day);
                          setView("week");
                        }}
                        className={`relative flex aspect-square items-center justify-center rounded-2xl border border-black/5 p-2 text-center transition-transform duration-150 active:scale-[0.98] ${
                          isActive
                            ? "border-[#217AF8]/40 bg-[#217AF8]/5"
                            : "bg-white"
                        }`}
                      >
                        <span
                          className={`text-sm font-semibold leading-none ${
                            isToday
                              ? "text-[#217AF8]"
                              : "text-[var(--tg-theme-text-color)]"
                          }`}
                        >
                          {day.getDate()}
                        </span>
                        {eventsByDate.get(iso)?.length ? (
                          <span className="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#217AF8]" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div
              className={`grid gap-2 transition-[grid-template-rows,opacity,transform] duration-200 ease-in-out ${
                view === "month"
                  ? "grid-rows-[1fr] translate-y-0 opacity-100"
                  : "grid-rows-[0fr] -translate-y-1 opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="grid grid-cols-7 gap-2">
                  {monthDays.map((day) => {
                    const iso = toISODate(day);
                    const isToday = todayIso === iso;
                    const isCurrentMonth =
                      day.getMonth() === activeDate.getMonth();
                    const dayEvents = eventsByDate.get(iso) ?? [];

                    return (
                      <button
                        key={iso}
                        type="button"
                        onClick={() => {
                          setActiveDate(day);
                          setView("week");
                        }}
                        className={`relative flex aspect-square items-center justify-center rounded-2xl border border-black/5 p-2 text-center transition-transform duration-150 active:scale-[0.98] ${
                          isCurrentMonth ? "bg-white" : "bg-black/[0.02]"
                        }`}
                      >
                        <span
                          className={`text-xs font-semibold leading-none ${
                            isToday
                              ? "text-[#217AF8]"
                              : isCurrentMonth
                              ? "text-[var(--tg-theme-text-color)]"
                              : "text-[var(--tg-theme-hint-color)]"
                          }`}
                        >
                          {day.getDate()}
                        </span>
                        {dayEvents.length ? (
                          <div className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 gap-1">
                            {dayEvents.slice(0, 3).map((event) => (
                              <span
                                key={event.id}
                                className={`h-1 w-1 rounded-full ${
                                  event.status === "canceled"
                                    ? "bg-rose-400"
                                    : "bg-emerald-400"
                                }`}
                              />
                            ))}
                          </div>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div
        className="flex flex-col gap-6"
        style={{ paddingTop: calendarHeight ? calendarHeight + 12 : 0 }}
      >
        {scheduleItems.length ? (
          <ScheduleList
            items={scheduleItems}
            title={`Записи на ${activeDate.toLocaleDateString("uk-UA")}`}
            showAction={false}
          />
        ) : (
          <div className="rounded-2xl border border-black/5 bg-white p-4 text-sm text-[var(--tg-theme-hint-color)]">
            Немає запланованих записів.
          </div>
        )}
      </div>
    </div>
  );
}
