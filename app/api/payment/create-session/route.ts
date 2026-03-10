import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const prices: Record<string, { amount: number; name: string }> = {
  standard: { amount: 299000, name: "Standard — RusseDesign logo" },
  gull: { amount: 449000, name: "Gull — RusseDesign logo" },
  vip: { amount: 699000, name: "VIP — RusseDesign logo" },
};

export async function POST(req: NextRequest) {
  const { orderId, pakke, navn } = await req.json();

  const pkg = prices[pakke] ?? prices.standard;
  const deposit = Math.round(pkg.amount / 2);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "nok",
          product_data: { name: `${pkg.name} (50% depositum)`, description: `Bestilt av ${navn}` },
          unit_amount: Math.round(deposit * 1.25), // inkl. MVA
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: { orderId, pakke },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/bestilling-bekreftet?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?orderId=${orderId}&pakke=${pakke}&navn=${encodeURIComponent(navn)}&cancelled=1`,
  });

  await supabase
    .from("orders")
    .update({ stripe_session_id: session.id })
    .eq("id", orderId);

  return NextResponse.json({ url: session.url });
}
