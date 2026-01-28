import Stripe from "https://esm.sh/stripe@15.12.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-11-20",
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  const { priceId, userId } = await req.json();
  if (!priceId || !userId) {
    return new Response("Missing priceId or userId", {
      status: 400,
      headers: corsHeaders,
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("stripe_customer_id, telegram_id, full_name")
    .eq("id", userId)
    .single();

  if (error || !profile) {
    return new Response("Profile not found", { status: 404, headers: corsHeaders });
  }

  let customerId = profile.stripe_customer_id as string | null;

  if (!customerId) {
    const customer = await stripe.customers.create({
      name: profile.full_name ?? undefined,
      metadata: {
        supabase_user_id: userId,
        telegram_id: profile.telegram_id?.toString() ?? "",
      },
    });

    customerId = customer.id;

    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", userId);
  }

  const origin = req.headers.get("origin") ?? "";
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/calendar?success=true`,
    cancel_url: `${origin}/billing?canceled=true`,
  });

  return new Response(JSON.stringify({ url: session.url }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
