"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ClientEditPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "";
  const phone = searchParams.get("phone") || "+380 00 000 00 00";

  const [lastName, setLastName] = useState(
    useMemo(() => name.split(" ")[0] || "", [name])
  );
  const [firstName, setFirstName] = useState(
    useMemo(() => name.split(" ").slice(1).join(" ") || "", [name])
  );
  const [phoneValue, setPhoneValue] = useState(phone);

  return (
    <div className="flex flex-col gap-4 pb-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-[var(--tg-theme-hint-color)]">
            Прізвище
          </label>
          <input
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            className="h-[48px] w-full rounded-2xl border border-black/5 bg-white px-3 text-base text-[var(--tg-theme-text-color)] outline-none"
            placeholder="Введіть прізвище"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-[var(--tg-theme-hint-color)]">
            Ім&apos;я
          </label>
          <input
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className="h-[48px] w-full rounded-2xl border border-black/5 bg-white px-3 text-base text-[var(--tg-theme-text-color)] outline-none"
            placeholder="Введіть ім'я"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-[var(--tg-theme-hint-color)]">
            Номер телефону
          </label>
          <input
            value={phoneValue}
            onChange={(event) => setPhoneValue(event.target.value)}
            className="h-[48px] w-full rounded-2xl border border-black/5 bg-white px-3 text-base text-[var(--tg-theme-text-color)] outline-none"
            placeholder="+380 00 000 00 00"
            type="tel"
          />
        </div>
        <button
          type="button"
          className="mt-2 inline-flex h-[48px] items-center justify-center rounded-2xl bg-[#217AF8] text-base font-semibold text-white transition-transform duration-150 active:scale-[0.98]"
        >
          Зберегти зміни
        </button>
      </div>
    </div>
  );
}
