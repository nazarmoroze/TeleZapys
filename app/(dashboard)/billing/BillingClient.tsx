"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase-browser";
import { ManageSubscriptionButton } from "@/components/stripe/ManageSubscriptionButton";
import { UpgradeButton } from "@/components/stripe/UpgradeButton";

export default function BillingClient({
  priceIdPro,
  priceIdElite,
}: {
  priceIdPro: string;
  priceIdElite: string;
}) {
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const supabase = createBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? "");
    });
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Підписка</h1>
        <p className="text-sm text-[var(--tg-theme-hint-color)]">
          Оберіть план TeleZapys та керуйте оплатою через Stripe.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-black/5 bg-white/70 p-5">
          <h2 className="text-lg font-semibold">Free</h2>
          <p className="mt-2 text-sm text-[var(--tg-theme-hint-color)]">
            До 30 клієнтів, базовий календар.
          </p>
          <p className="mt-4 text-2xl font-semibold">€0</p>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white/70 p-5">
          <h2 className="text-lg font-semibold">Pro</h2>
          <p className="mt-2 text-sm text-[var(--tg-theme-hint-color)]">
            До 500 клієнтів, аналітика та звіти.
          </p>
          <p className="mt-4 text-2xl font-semibold">€3 / міс</p>
          <div className="mt-4">
            <UpgradeButton tier="Pro" priceId={priceIdPro} userId={userId} />
          </div>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white/70 p-5">
          <h2 className="text-lg font-semibold">Elite</h2>
          <p className="mt-2 text-sm text-[var(--tg-theme-hint-color)]">
            500+ клієнтів та пріоритетна підтримка.
          </p>
          <p className="mt-4 text-2xl font-semibold">€6 / міс</p>
          <div className="mt-4">
            <UpgradeButton tier="Elite" priceId={priceIdElite} userId={userId} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-black/5 bg-white/70 p-5">
        <ManageSubscriptionButton userId={userId} />
      </div>
    </div>
  );
}
