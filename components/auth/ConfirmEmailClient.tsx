"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase-browser";

const REGISTER_PAYLOAD_KEY = "telezapys_register_payload";

type RegisterPayload = {
  fullName: string;
  businessName: string;
  phone: string;
  email: string;
  password: string;
};

export default function ConfirmEmailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [isClientReady, setIsClientReady] = useState(false);
  const [otp, setOtp] = useState("");
  const [payload, setPayload] = useState<RegisterPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClientReady(true);
    const raw = sessionStorage.getItem(REGISTER_PAYLOAD_KEY);
    if (!raw) return;

    const parsed = JSON.parse(raw) as RegisterPayload;
    setPayload(parsed);
  }, []);

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!payload) {
      setError("Немає даних для підтвердження.");
      return;
    }

    setIsLoading(true);
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email: payload.email,
      token: otp,
      type: "email",
    });

    if (verifyError) {
      setError(verifyError.message);
      setIsLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: payload.password,
      data: {
        full_name: payload.fullName,
        business_name: payload.businessName,
        phone: payload.phone,
      },
    });

    if (updateError) {
      setError(updateError.message);
      setIsLoading(false);
      return;
    }

    sessionStorage.removeItem(REGISTER_PAYLOAD_KEY);

    if (data.session) {
      router.push("/home");
      return;
    }

    setSuccess("Код підтверджено. Можна входити в акаунт.");
    setIsLoading(false);
  };

  const handleResend = async () => {
    if (!payload) return;
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    const { error: resendError } = await supabase.auth.signInWithOtp({
      email: payload.email,
      options: {
        shouldCreateUser: true,
      },
    });

    if (resendError) {
      setError(resendError.message);
      setIsLoading(false);
      return;
    }

    setSuccess("Код повторно надіслано на email.");
    setIsLoading(false);
  };

  const emailHint = searchParams.get("email") || payload?.email || "";
  const missingPayload = !payload;
  if (!isClientReady) {
    return null;
  }

  return (
    <div className="flex h-full flex-col gap-4 pb-[calc(env(safe-area-inset-bottom,0px)+8px)] pt-3">
      <h1 className="text-center text-2xl font-semibold">Підтвердження</h1>

      <div className="text-center text-sm text-[var(--tg-theme-hint-color)]">
        {missingPayload
          ? "Дані реєстрації не знайдено. Поверніться назад."
          : `Ми надіслали код на ${emailHint || "ваш email"}`}
      </div>

      <form className="flex flex-col gap-3" onSubmit={handleVerify}>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Код з email</label>
          <input
            required
            value={otp}
            onChange={(event) => setOtp(event.target.value)}
            className="h-[52px] w-full rounded-2xl border border-black/10 bg-white px-4 text-base tracking-[0.3em] focus:border-[#217AF8] focus:outline-none"
            placeholder="123456"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || missingPayload}
          className="mt-1 inline-flex h-[52px] items-center justify-center rounded-2xl bg-[#217AF8] px-5 text-base font-semibold text-white disabled:opacity-70"
        >
          Підтвердити код
        </button>
      </form>

      <button
        type="button"
        disabled={isLoading || missingPayload}
        onClick={handleResend}
        className="inline-flex h-[52px] items-center justify-center rounded-2xl border border-black/10 bg-white/70 px-5 text-base font-semibold text-[var(--tg-theme-text-color)] disabled:opacity-70"
      >
        Надіслати код ще раз
      </button>

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
        <span>Повернутись?</span>
        <Link className="font-semibold text-[#217AF8]" href="/register">
          Реєстрація
        </Link>
      </div>
    </div>
  );
}

