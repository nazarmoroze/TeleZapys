"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  FiBarChart2,
  FiCalendar,
  FiCreditCard,
  FiMessageSquare,
  FiPhone,
} from "react-icons/fi";
import { SiTelegram } from "react-icons/si";
import OrderHistoryList, {
  type OrderHistoryItem,
} from "@/components/dashboard/clients/OrderHistoryList";

export default function ClientDetailsClient() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const isEditing = searchParams.get("edit") === "1";
  const clientName = searchParams.get("name") || "Картка клієнта";
  const clientPhone = searchParams.get("phone") || "+380 00 000 00 00";
  const clientBirthDate = searchParams.get("birth") || "";

  const toDmy = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(trimmed)) return trimmed;
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const [year, month, day] = trimmed.split("-");
      return `${day}.${month}.${year}`;
    }
    if (/^\d{2}-\d{2}-\d{4}$/.test(trimmed)) {
      return trimmed.replace(/-/g, ".");
    }
    return trimmed;
  };

  const { initialLastName, initialFirstName } = useMemo(() => {
    const parts = clientName.trim().split(" ");
    return {
      initialLastName: parts[0] || "",
      initialFirstName: parts.slice(1).join(" ") || "",
    };
  }, [clientName]);

  const [lastName, setLastName] = useState(initialLastName);
  const [firstName, setFirstName] = useState(initialFirstName);
  const [phoneValue, setPhoneValue] = useState(clientPhone);
  const [birthValue, setBirthValue] = useState(toDmy(clientBirthDate));

  useEffect(() => {
    if (isEditing) return;
    setLastName(initialLastName);
    setFirstName(initialFirstName);
    setPhoneValue(clientPhone);
    setBirthValue(toDmy(clientBirthDate));
  }, [clientBirthDate, clientPhone, initialFirstName, initialLastName, isEditing]);

  useEffect(() => {
    const handleSave = () => {
      const nextName = `${lastName} ${firstName}`.trim() || "Картка клієнта";
      const params = new URLSearchParams(searchParams.toString());
      params.set("name", nextName);
      params.set("phone", phoneValue);
      const formattedBirth = toDmy(birthValue);
      if (formattedBirth) {
        params.set("birth", formattedBirth);
      } else {
        params.delete("birth");
      }
      params.delete("edit");
      router.replace(`${pathname}?${params.toString()}`);
    };

    window.addEventListener("client:save", handleSave);
    return () => {
      window.removeEventListener("client:save", handleSave);
    };
  }, [birthValue, firstName, lastName, pathname, phoneValue, router, searchParams]);

  const phoneDigits = phoneValue.replace(/\D/g, "");
  const telLink = phoneValue.startsWith("+") ? phoneValue : `+${phoneDigits}`;
  const telegramLink = `https://t.me/${phoneDigits}`;
  const smsLink = `sms:${telLink}`;
  const historyItems: OrderHistoryItem[] = [
    {
      date: "20.01.2026",
      time: "10:00",
      end: "11:30",
      title: "Манікюр гель",
      client: clientName,
      price: "800 ₴",
      status: "active",
    },
    {
      date: "12.01.2026",
      time: "12:30",
      end: "13:30",
      title: "Педикюр SPA",
      client: clientName,
      price: "950 ₴",
      status: "canceled",
    },
    {
      date: "08.01.2026",
      time: "14:00",
      end: "14:45",
      title: "Консультація",
      client: clientName,
      price: "0 ₴",
      status: "active",
    },
  ];

  return (
    <div className="flex flex-col gap-4 pb-6">
      <div className="rounded-2xl border border-black/5 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-xs font-medium text-[var(--tg-theme-hint-color)]">
            Прізвище
          </span>
          {isEditing ? (
            <input
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className="w-[55%] bg-transparent text-right text-base font-semibold text-[var(--tg-theme-text-color)] outline-none placeholder:text-[var(--tg-theme-hint-color)]"
              placeholder="Прізвище"
            />
          ) : (
            <span className="text-base font-semibold text-[var(--tg-theme-text-color)]">
              {lastName || "—"}
            </span>
          )}
        </div>
        <div className="h-px bg-black/5" />
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-xs font-medium text-[var(--tg-theme-hint-color)]">
            Ім&apos;я
          </span>
          {isEditing ? (
            <input
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="w-[55%] bg-transparent text-right text-base font-semibold text-[var(--tg-theme-text-color)] outline-none placeholder:text-[var(--tg-theme-hint-color)]"
              placeholder="Ім'я"
            />
          ) : (
            <span className="text-base font-semibold text-[var(--tg-theme-text-color)]">
              {firstName || "—"}
            </span>
          )}
        </div>
        <div className="h-px bg-black/5" />
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-xs font-medium text-[var(--tg-theme-hint-color)]">
            Номер телефону
          </span>
          {isEditing ? (
            <input
              value={phoneValue}
              onChange={(event) => setPhoneValue(event.target.value)}
              className="w-[55%] bg-transparent text-right text-base font-semibold text-[var(--tg-theme-text-color)] outline-none placeholder:text-[var(--tg-theme-hint-color)]"
              placeholder="+380 00 000 00 00"
              type="tel"
            />
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-[var(--tg-theme-text-color)]">
                {phoneValue}
              </span>
              <a
                href={`tel:${telLink}`}
                aria-label="Подзвонити"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-black/5 text-[#217AF8] transition-transform duration-150 active:scale-[0.96]"
              >
                <FiPhone className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
        <div className="h-px bg-black/5" />
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-xs font-medium text-[var(--tg-theme-hint-color)]">
            Дата народження
          </span>
          {isEditing ? (
            <div className="relative w-[55%] text-right">
              <span
                className={`text-sm font-semibold ${
                  birthValue
                    ? "text-[var(--tg-theme-text-color)]"
                    : "text-[var(--tg-theme-hint-color)]"
                }`}
              >
                {toDmy(birthValue) || "Виберіть дату"}
              </span>
              <input
                value={
                  /^\d{2}\.\d{2}\.\d{4}$/.test(birthValue)
                    ? birthValue.split(".").reverse().join("-")
                    : birthValue
                }
                onChange={(event) => setBirthValue(toDmy(event.target.value))}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                type="date"
              />
            </div>
          ) : (
            <span
              className={`text-sm font-semibold ${
                birthValue
                  ? "text-[var(--tg-theme-text-color)]"
                  : "text-[var(--tg-theme-hint-color)]"
              }`}
            >
              {toDmy(birthValue) || "Виберіть дату"}
            </span>
          )}
        </div>
      </div>

      <div className="relative h-[52px]">
        <div
          className={`absolute inset-0 grid grid-cols-2 gap-3 transition-[opacity,transform] duration-200 ease-out ${
            isEditing
              ? "pointer-events-none translate-y-1 opacity-0"
              : "translate-y-0 opacity-100"
          }`}
        >
          <a
            href={smsLink}
            className="flex h-[52px] items-center justify-center gap-2 rounded-2xl border border-[#217AF8]/30 bg-[#217AF8]/5 text-sm font-semibold text-[#217AF8] transition-transform duration-150 active:scale-[0.98]"
          >
            <FiMessageSquare className="h-4 w-4" />
            СМС
          </a>
          <a
            href={telegramLink}
            target="_blank"
            rel="noreferrer"
            className="flex h-[52px] items-center justify-center gap-2 rounded-2xl bg-[#217AF8] text-sm font-semibold text-white transition-transform duration-150 active:scale-[0.98]"
          >
            <SiTelegram className="h-4 w-4" />
            Telegram
          </a>
        </div>
        <div
          className={`absolute inset-0 grid grid-cols-2 gap-3 transition-[opacity,transform] duration-200 ease-out ${
            isEditing
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-1 opacity-0"
          }`}
        >
          <button
            type="button"
            className="flex h-[52px] items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 text-sm font-semibold text-amber-700 transition-transform duration-150 active:scale-[0.98]"
          >
            Заблокувати
          </button>
          <button
            type="button"
            className="flex h-[52px] items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 text-sm font-semibold text-rose-600 transition-transform duration-150 active:scale-[0.98]"
          >
            Видалити
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-2xl border border-black/5 bg-white px-3 py-2 text-center shadow-sm">
          <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-[var(--tg-theme-hint-color)]">
            <FiCalendar className="h-3.5 w-3.5 text-[#217AF8]" />
            Візитів
          </div>
          <div className="text-base font-semibold text-[var(--tg-theme-text-color)]">
            12
          </div>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white px-3 py-2 text-center shadow-sm">
          <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-[var(--tg-theme-hint-color)]">
            <FiCreditCard className="h-3.5 w-3.5 text-[#217AF8]" />
            Всього
          </div>
          <div className="text-base font-semibold text-[var(--tg-theme-text-color)]">
            9 600 ₴
          </div>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white px-3 py-2 text-center shadow-sm">
          <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-[var(--tg-theme-hint-color)]">
            <FiBarChart2 className="h-3.5 w-3.5 text-[#217AF8]" />
            Сер. чек
          </div>
          <div className="text-base font-semibold text-[var(--tg-theme-text-color)]">
            800 ₴
          </div>
        </div>
      </div>

      <OrderHistoryList items={historyItems} />
    </div>
  );
}
