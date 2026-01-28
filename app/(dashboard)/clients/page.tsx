"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FiChevronRight, FiPlus, FiSliders } from "react-icons/fi";

type Client = {
  id: string;
  name: string;
  phone: string;
  tag?: string;
  lastVisit?: string;
};

const demoClients: Client[] = [
  {
    id: "c1",
    name: "Марія Коваль",
    phone: "+380 93 123 45 67",
    tag: "Постійний",
    lastVisit: "24 січня",
  },
  {
    id: "c2",
    name: "Олена Василенко",
    phone: "+380 67 222 11 00",
    tag: "Новий",
    lastVisit: "21 січня",
  },
  {
    id: "c3",
    name: "Ірина Сидоренко",
    phone: "+380 50 555 66 77",
    tag: "VIP",
    lastVisit: "18 січня",
  },
  {
    id: "c4",
    name: "Катерина Мельник",
    phone: "+380 97 444 22 33",
    lastVisit: "12 січня",
  },
  {
    id: "c5",
    name: "Світлана Дмитренко",
    phone: "+380 63 987 65 43",
    tag: "Постійний",
    lastVisit: "10 січня",
  },
  {
    id: "c6",
    name: "Анастасія Левченко",
    phone: "+380 99 555 44 11",
    tag: "Новий",
    lastVisit: "9 січня",
  },
  {
    id: "c7",
    name: "Юлія Романенко",
    phone: "+380 73 234 56 78",
    tag: "VIP",
    lastVisit: "7 січня",
  },
  {
    id: "c8",
    name: "Наталія Паламарчук",
    phone: "+380 68 111 22 33",
    tag: "Постійний",
    lastVisit: "5 січня",
  },
  {
    id: "c9",
    name: "Тетяна Бондар",
    phone: "+380 67 333 22 11",
    lastVisit: "3 січня",
  },
  {
    id: "c10",
    name: "Оксана Гриценко",
    phone: "+380 50 666 77 88",
    tag: "Новий",
    lastVisit: "2 січня",
  },
  {
    id: "c11",
    name: "Людмила Іваненко",
    phone: "+380 96 101 01 10",
    tag: "Постійний",
    lastVisit: "31 грудня",
  },
  {
    id: "c12",
    name: "Вікторія Яковенко",
    phone: "+380 66 909 80 70",
    tag: "VIP",
    lastVisit: "28 грудня",
  },
];

export default function ClientsPage() {
  const [filter, setFilter] = useState<"all" | "new" | "vip" | "regular">(
    "all"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState({
    lastName: "",
    firstName: "",
    phone: "",
    birth: "",
  });

  const filteredClients = useMemo(() => {
    return demoClients.filter((client) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "new" && client.tag === "Новий") ||
        (filter === "vip" && client.tag === "VIP") ||
        (filter === "regular" && client.tag === "Постійний");

      return matchesFilter;
    });
  }, [filter]);

  return (
    <div className="flex flex-col gap-4 pb-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-[var(--tg-theme-hint-color)]">
            Клієнти
          </span>
          <span className="text-lg font-semibold text-[var(--tg-theme-text-color)]">
            База клієнтів
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-[#217AF8] px-4 text-sm font-semibold text-white transition-transform duration-150 active:scale-[0.98]"
        >
          <FiPlus className="h-4 w-4" />
          Додати клієнта
        </button>
      </div>

      <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              filter === "all"
                ? "bg-[#217AF8]/10 text-[#217AF8]"
                : "bg-white text-[var(--tg-theme-hint-color)]"
            }`}
          >
            Всі
          </button>
          <button
            type="button"
            onClick={() => setFilter("new")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              filter === "new"
                ? "bg-[#217AF8]/10 text-[#217AF8]"
                : "bg-white text-[var(--tg-theme-hint-color)]"
            }`}
          >
            Нові
          </button>
          <button
            type="button"
            onClick={() => setFilter("regular")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              filter === "regular"
                ? "bg-[#217AF8]/10 text-[#217AF8]"
                : "bg-white text-[var(--tg-theme-hint-color)]"
            }`}
          >
            Постійні
          </button>
          <button
            type="button"
            onClick={() => setFilter("vip")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              filter === "vip"
                ? "bg-[#217AF8]/10 text-[#217AF8]"
                : "bg-white text-[var(--tg-theme-hint-color)]"
            }`}
          >
            VIP
          </button>
          <button
            type="button"
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-full border border-black/5 text-[var(--tg-theme-hint-color)]"
            aria-label="Фільтри"
          >
            <FiSliders className="h-4 w-4" />
          </button>
      </div>

      <div className="flex flex-col gap-3 pb-6">
        {filteredClients.map((client) => (
          <Link
            key={client.id}
            href={{
              pathname: `/clients/${client.id}`,
              query: {
                name: client.name,
                phone: client.phone,
              },
            }}
            className="group flex items-center justify-between rounded-2xl border border-black/5 bg-white p-4 shadow-sm transition-transform duration-150 active:scale-[0.99]"
            aria-label={`Відкрити картку клієнта ${client.name}`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E8F0FF] text-sm font-semibold text-[#217AF8]">
                {client.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[var(--tg-theme-text-color)]">
                  {client.name}
                </span>
                <span className="text-xs text-[var(--tg-theme-hint-color)]">
                  {client.phone}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end gap-2 text-right">
                {client.tag ? (
                  <span className="rounded-full bg-[#217AF8]/10 px-2 py-0.5 text-[10px] font-semibold text-[#217AF8]">
                    {client.tag}
                  </span>
                ) : null}
                {client.lastVisit ? (
                  <span className="text-[10px] text-[var(--tg-theme-hint-color)]">
                    {client.lastVisit}
                  </span>
                ) : null}
              </div>
              <FiChevronRight className="h-4 w-4 text-[var(--tg-theme-hint-color)] transition-transform duration-150 group-active:translate-x-0.5" />
            </div>
          </Link>
        ))}
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
    </div>
  );
}
