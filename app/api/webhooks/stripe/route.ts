import { headers } from "next/headers";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const getEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing env var: ${key}`);
  }
  return value;
};

const stripe = new Stripe(getEnv("STRIPE_SECRET_KEY"), {
  apiVersion: "2024-11-20",
});

const supabase = createClient(
  getEnv("NEXT_PUBLIC_SUPABASE_URL"),
  getEnv("SUPABASE_SERVICE_ROLE_KEY"),
  { auth: { persistSession: false } }
);

const resolveTier = (subscription: Stripe.Subscription) => {
  const price = subscription.items.data[0]?.price;
  return price?.lookup_key || price?.metadata?.tier || "free";
};

export async function POST(request: Request) {
  const signature = headers().get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      getEnv("STRIPE_WEBHOOK_SECRET")
    );
  } catch (error) {
    return new Response(`Webhook Error: ${(error as Error).message}`, {
      status: 400,
    });
  }

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id;

      await supabase
        .from("profiles")
        .update({
          subscription_tier: resolveTier(subscription),
          subscription_status: subscription.status,
        })
        .eq("stripe_customer_id", customerId);
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id;

      await supabase
        .from("profiles")
        .update({
          subscription_tier: "free",
          subscription_status: "canceled",
        })
        .eq("stripe_customer_id", customerId);
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId =
        typeof invoice.customer === "string"
          ? invoice.customer
          : invoice.customer?.id;

      if (customerId) {
        await supabase
          .from("profiles")
          .update({ subscription_status: "past_due" })
          .eq("stripe_customer_id", customerId);
      }
      break;
    }
    default:
      break;
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
