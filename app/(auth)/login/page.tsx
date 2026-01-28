"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { SiTelegram } from "react-icons/si";
import { createBrowserClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
      return;
    }

    router.push("/home");
  };

  return (
    <div className="flex h-full flex-col gap-4 pb-[calc(env(safe-area-inset-bottom,0px)+8px)] pt-3">
      <h1 className="text-center text-2xl font-semibold">Вхід</h1>

      <div className="flex w-full flex-col gap-3">
        <form className="flex flex-col gap-3" onSubmit={handleEmailLogin}>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-[52px] w-full rounded-2xl border border-black/10 bg-white px-4 text-base focus:border-[#217AF8] focus:outline-none"
              placeholder="example@mail.com"
              autoComplete="email"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Пароль</label>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-[52px] w-full rounded-2xl border border-black/10 bg-white px-4 text-base focus:border-[#217AF8] focus:outline-none"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="mt-1 inline-flex h-[52px] w-full items-center justify-center rounded-2xl bg-[#217AF8] px-5 text-base font-semibold text-white disabled:opacity-70"
          >
            Увійти
          </button>
        </form>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        ) : null}

        <div className="flex items-center gap-3 text-xs text-[var(--tg-theme-hint-color)]">
          <span className="h-px flex-1 bg-black/10" />
          або
          <span className="h-px flex-1 bg-black/10" />
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            disabled
            className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white/70 px-5 text-base font-semibold text-[var(--tg-theme-text-color)] opacity-60"
          >
            <FcGoogle className="h-5 w-5" />
            Увійти через Google
          </button>
          <button
            type="button"
            disabled
            className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white/70 px-5 text-base font-semibold text-[var(--tg-theme-text-color)] opacity-60"
          >
            <SiTelegram className="h-5 w-5 text-[#229ED9]" />
            Увійти через Telegram
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-[var(--tg-theme-hint-color)]">
          <span>Немає акаунта?</span>
          <Link className="font-semibold text-[#217AF8]" href="/register">
            Зареєструватися
          </Link>
        </div>
      </div>
    </div>
  );
}
