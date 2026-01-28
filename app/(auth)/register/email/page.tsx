"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase-browser";

const REGISTER_PAYLOAD_KEY = "telezapys_register_payload";
const REGISTER_PREFILL_KEY = "telezapys_register_prefill";

export default function RegisterEmailPage() {
  const router = useRouter();
  const [supabase, setSupabase] = useState<ReturnType<
    typeof createBrowserClient
  > | null>(null);
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSupabase(createBrowserClient());
    const raw = sessionStorage.getItem(REGISTER_PREFILL_KEY);
    if (!raw) return;

    try {
      const prefill = JSON.parse(raw) as { fullName?: string };
      if (prefill.fullName) {
        setFullName(prefill.fullName);
      }
    } finally {
      sessionStorage.removeItem(REGISTER_PREFILL_KEY);
    }
  }, []);

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    if (!supabase) {
      setError("Ініціалізація. Спробуйте ще раз.");
      setIsLoading(false);
      return;
    }

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });

    if (otpError) {
      setError(otpError.message);
      setIsLoading(false);
      return;
    }

    const payload = {
      fullName,
      businessName,
      phone,
      email,
      password,
    };
    sessionStorage.setItem(REGISTER_PAYLOAD_KEY, JSON.stringify(payload));

    setSuccess("Код підтвердження надіслано на email.");
    setIsLoading(false);
    router.push(`/register/confirm?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto overscroll-contain animate-[fadeIn_200ms_ease]">
      <h1 className="text-center text-2xl font-semibold">
        Реєстрація через email
      </h1>

      <div className="flex flex-col gap-1 text-sm text-[var(--tg-theme-hint-color)]">
        <span>Виберіть спосіб реєстрації.</span>
        <Link className="font-semibold text-[#217AF8]" href="/register">
          Назад
        </Link>
      </div>

      <form className="flex flex-col gap-3" onSubmit={handleRegister}>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Ваше ім&apos;я</label>
          <input
            required
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="h-[52px] w-full rounded-2xl border border-black/10 bg-white px-4 text-base focus:border-[#217AF8] focus:outline-none"
            placeholder="Анна Коваль"
            autoComplete="name"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Назва студії або бренду</label>
          <input
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
            className="h-[52px] w-full rounded-2xl border border-black/10 bg-white px-4 text-base focus:border-[#217AF8] focus:outline-none"
            placeholder="Beauty Studio"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Телефон</label>
          <input
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="h-[52px] w-full rounded-2xl border border-black/10 bg-white px-4 text-base focus:border-[#217AF8] focus:outline-none"
            placeholder="+380 00 000 00 00"
            type="tel"
            autoComplete="tel"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Email</label>
          <input
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-[52px] w-full rounded-2xl border border-black/10 bg-white px-4 text-base focus:border-[#217AF8] focus:outline-none"
            placeholder="example@mail.com"
            type="email"
            autoComplete="email"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Пароль</label>
          <input
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-[52px] w-full rounded-2xl border border-black/10 bg-white px-4 text-base focus:border-[#217AF8] focus:outline-none"
            placeholder="••••••••"
            type="password"
            autoComplete="new-password"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="mt-1 inline-flex h-[52px] items-center justify-center rounded-2xl bg-[#217AF8] px-5 text-base font-semibold text-white disabled:opacity-70"
        >
          Зареєтруватись
        </button>
      </form>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      ) : null}

      <div className="flex items-center justify-center gap-2 text-sm text-[var(--tg-theme-hint-color)]">
        <span>Вже є профіль?</span>
        <Link className="font-semibold text-[#217AF8]" href="/login">
          Увійти
        </Link>
      </div>
    </div>
  );
}
