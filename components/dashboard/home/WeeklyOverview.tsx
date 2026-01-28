"use client";

import { useEffect, useState } from "react";
import { FiTrendingUp } from "react-icons/fi";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

const weeklyVisitsData = [
  { day: 1, value: 6 },
  { day: 2, value: 9 },
  { day: 3, value: 7 },
  { day: 4, value: 12 },
  { day: 5, value: 10 },
  { day: 6, value: 14 },
  { day: 7, value: 13 },
];

const weeklyIncomeData = [
  { day: 1, value: 12 },
  { day: 2, value: 10 },
  { day: 3, value: 14 },
  { day: 4, value: 16 },
  { day: 5, value: 15 },
  { day: 6, value: 19 },
  { day: 7, value: 18 },
];

export default function WeeklyOverview() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--tg-theme-hint-color)]">
          Огляд за тиждень
        </span>
        <button
          type="button"
          className="rounded-full border border-black/5 bg-white px-3 py-1 text-xs font-semibold text-[#217AF8] transition-transform duration-150 active:scale-[0.98]"
        >
          Див. статистику
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Картка візитів */}
        <div className="relative min-w-0 overflow-hidden rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
          <div className="relative z-10 flex flex-col gap-3">
            <span className="text-sm font-semibold text-[var(--tg-theme-hint-color)]">
              Візитів
            </span>
            <span className="text-3xl font-semibold text-[var(--tg-theme-text-color)]">
              42
            </span>
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-600">
                <FiTrendingUp className="h-3.5 w-3.5" />
                +12%
              </span>
              <span className="ml-auto text-[var(--tg-theme-hint-color)]">
                тиждень
              </span>
            </div>
          </div>
          
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 min-h-[64px] opacity-90"
            style={{ minWidth: 1, minHeight: 1 }}
          >
            {mounted ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
                minWidth={1}
                minHeight={1}
              >
                <AreaChart
                  data={weeklyVisitsData}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorVisits"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#22C55E"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="#22C55E"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#22C55E"
                    strokeWidth={2}
                    fill="url(#colorVisits)"
                    animationDuration={800}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </div>

        {/* Картка доходу */}
        <div className="relative min-w-0 overflow-hidden rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
          <div className="relative z-10 flex flex-col gap-3">
            <span className="text-sm font-semibold text-[var(--tg-theme-hint-color)]">
              Дохід
            </span>
            <span className="text-3xl font-semibold text-[var(--tg-theme-text-color)]">
              54 500 ₴
            </span>
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-blue-600">
                <FiTrendingUp className="h-3.5 w-3.5" />
                +8%
              </span>
              <span className="ml-auto text-[var(--tg-theme-hint-color)]">
                тиждень
              </span>
            </div>
          </div>
          
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 min-h-[64px] opacity-90"
            style={{ minWidth: 1, minHeight: 1 }}
          >
            {mounted ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
                minWidth={1}
                minHeight={1}
              >
                <AreaChart
                  data={weeklyIncomeData}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorIncome"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#60A5FA"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="#60A5FA"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#60A5FA"
                    strokeWidth={2}
                    fill="url(#colorIncome)"
                    animationDuration={800}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
