"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FiMail } from "react-icons/fi";
import { SiTelegram } from "react-icons/si";
import { createBrowserClient } from "@/lib/supabase-browser";

const REGISTER_PAYLOAD_KEY = "telezapys_register_payload";

export default function RegisterPage() {
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
  const [isTelegramReady, setIsTelegramReady] = useState(false);

  useEffect(() => {
    setSupabase(createBrowserClient());
    setIsTelegramReady(Boolean(window.Telegram?.WebApp?.initData));
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

  const handleTelegramRegister = () => {
    const webApp = window.Telegram?.WebApp;
    if (!webApp?.initData) return;

    const tgUser = webApp.initDataUnsafe?.user;
    const suggestedName = [tgUser?.first_name, tgUser?.last_name]
      .filter(Boolean)
      .join(" ")
      .trim();
    if (suggestedName) {
      sessionStorage.setItem(
        "telezapys_register_prefill",
        JSON.stringify({ fullName: suggestedName })
      );
    }

    webApp.HapticFeedback?.impactOccurred("light");
    router.push("/register/email");
  };

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto overscroll-contain animate-[fadeIn_200ms_ease]">
      <h1 className="text-center text-2xl font-semibold">Реєстрація</h1>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleTelegramRegister}
          disabled={!isTelegramReady}
          className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[#217AF8] px-5 text-base font-semibold text-white disabled:opacity-70"
        >
          <SiTelegram className="h-5 w-5 text-white" />
          Зареєструватися через Telegram
        </button>
        <button
          type="button"
          disabled
          className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white px-5 text-base font-semibold text-[var(--tg-theme-text-color)] opacity-70"
        >
          <FcGoogle className="h-5 w-5" />
          Зареєструватися через Google
        </button>
        <Link
          href="/register/email"
          className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white px-5 text-base font-semibold text-[var(--tg-theme-text-color)]"
        >
          <FiMail className="h-5 w-5" />
          Зареєструватися через email
        </Link>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm text-[var(--tg-theme-hint-color)]">
        <span>Вже є профіль?</span>
        <Link className="font-semibold text-[#217AF8]" href="/login">
          Увійти
        </Link>
      </div>
    </div>
  );
}
