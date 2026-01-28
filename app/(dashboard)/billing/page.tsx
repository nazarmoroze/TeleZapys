import BillingClient from "./BillingClient";

const getEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing env var: ${key}`);
  }
  return value;
};

export default function BillingPage() {
  return (
    <BillingClient
      priceIdPro={getEnv("STRIPE_PRICE_ID_PRO")}
      priceIdElite={getEnv("STRIPE_PRICE_ID_ELITE")}
    />
  );
}
