"use client";

import { useState } from "react";
import { FiCalendar, FiUserPlus } from "react-icons/fi";

export default function QuickActions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState({
    lastName: "",
    firstName: "",
    phone: "",
    birth: "",
  });

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex h-[64px] items-center gap-3 rounded-2xl bg-[#217AF8] px-3 text-left text-white shadow-sm transition-transform duration-150 active:scale-[0.98]"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
            <FiUserPlus className="h-5 w-5" />
          </span>
          <span className="flex flex-col">
            <span className="text-xs font-medium text-white/70">Додати</span>
            <span className="text-sm font-semibold">Клієнта</span>
          </span>
        </button>
        <button
          type="button"
          className="flex h-[64px] items-center gap-3 rounded-2xl border border-black/5 bg-white px-3 text-left text-[var(--tg-theme-text-color)] shadow-sm transition-transform duration-150 active:scale-[0.98]"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E8F0FF] text-[#217AF8]">
            <FiCalendar className="h-5 w-5" />
          </span>
          <span className="flex flex-col">
            <span className="text-xs font-medium text-[var(--tg-theme-hint-color)]">
              Запланувати
            </span>
            <span className="text-sm font-semibold">Візит</span>
          </span>
        </button>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm [animation:fadeIn_160ms_ease-out]">
          <div
            className="absolute inset-0"
            onClick={() => setIsModalOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md rounded-3xl bg-white p-5 shadow-xl [animation:modalIn_180ms_ease-out]">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-base font-semibold text-[var(--tg-theme-text-color)]">
                Новий клієнт
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="h-8 rounded-full px-3 text-xs font-semibold text-[var(--tg-theme-hint-color)] transition-transform duration-150 active:scale-[0.96]"
              >
                Закрити
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <label className="flex flex-col gap-2 text-xs font-medium text-[var(--tg-theme-hint-color)]">
                Прізвище
                <input
                  value={formState.lastName}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      lastName: event.target.value,
                    }))
                  }
                  className="h-12 rounded-2xl border border-black/5 bg-white px-3 text-base text-[var(--tg-theme-text-color)] outline-none"
                  placeholder="Введіть прізвище"
                />
              </label>
              <label className="flex flex-col gap-2 text-xs font-medium text-[var(--tg-theme-hint-color)]">
                Ім&apos;я
                <input
                  value={formState.firstName}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      firstName: event.target.value,
                    }))
                  }
                  className="h-12 rounded-2xl border border-black/5 bg-white px-3 text-base text-[var(--tg-theme-text-color)] outline-none"
                  placeholder="Введіть ім'я"
                />
              </label>
              <label className="flex flex-col gap-2 text-xs font-medium text-[var(--tg-theme-hint-color)]">
                Номер телефону
                <input
                  value={formState.phone}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      phone: event.target.value,
                    }))
                  }
                  className="h-12 rounded-2xl border border-black/5 bg-white px-3 text-base text-[var(--tg-theme-text-color)] outline-none"
                  placeholder="+380 00 000 00 00"
                  type="tel"
                />
              </label>
              <label className="flex flex-col gap-2 text-xs font-medium text-[var(--tg-theme-hint-color)]">
                Дата народження
                <input
                  value={formState.birth}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      birth: event.target.value,
                    }))
                  }
                  className="h-12 rounded-2xl border border-black/5 bg-white px-3 text-base text-[var(--tg-theme-text-color)] outline-none"
                  type="date"
                />
              </label>
            </div>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex h-11 flex-1 items-center justify-center rounded-2xl border border-black/5 bg-white text-sm font-semibold text-[var(--tg-theme-text-color)] transition-transform duration-150 active:scale-[0.98]"
              >
                Скасувати
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setFormState({
                    lastName: "",
                    firstName: "",
                    phone: "",
                    birth: "",
                  });
                }}
                className="flex h-11 flex-1 items-center justify-center rounded-2xl bg-[#217AF8] text-sm font-semibold text-white transition-transform duration-150 active:scale-[0.98]"
              >
                Зберегти
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
