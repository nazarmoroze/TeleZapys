import { NextResponse } from "next/server";
import { createStripeClient } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const stripe = createStripeClient();
  const { priceId, userId } = (await request.json()) as {
    priceId?: string;
    userId?: string;
  };

  if (!priceId || !userId) {
    return NextResponse.json(
      { error: "Missing priceId or userId" },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("stripe_customer_id, telegram_id, full_name")
    .eq("id", userId)
    .single();

  if (error || !profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  let customerId = profile.stripe_customer_id;
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

  const origin = request.headers.get("origin");
  if (!origin) {
    return NextResponse.json({ error: "Missing origin header" }, { status: 400 });
  }
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/calendar?success=true`,
    cancel_url: `${origin}/billing?canceled=true`,
  });

  return NextResponse.json({ url: session.url });
}
