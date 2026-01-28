import Stripe from "stripe";

export const createStripeClient = () => {
  const value = process.env.STRIPE_SECRET_KEY;
  if (!value) {
    throw new Error("Missing env var: STRIPE_SECRET_KEY");
  }
  return new Stripe(value, {
    apiVersion: "2025-12-15.clover",
  });
};
