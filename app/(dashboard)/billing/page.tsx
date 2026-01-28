import BillingClient from "./BillingClient";

export default function BillingPage() {
  const priceIdPro = process.env.STRIPE_PRICE_ID_PRO ?? "";
  const priceIdElite = process.env.STRIPE_PRICE_ID_ELITE ?? "";

  return (
    <BillingClient priceIdPro={priceIdPro} priceIdElite={priceIdElite} />
  );
}
