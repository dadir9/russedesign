import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
const resend = new Resend(process.env.RESEND_API_KEY);

const packageNames: Record<string, string> = {
  standard: "Standard — 2.990 kr",
  gull: "Gull — 4.490 kr",
  vip: "VIP — 6.990 kr",
};
const packagePrices: Record<string, number> = { standard: 2990, gull: 4490, vip: 6990 };

function isAuthorized(req: NextRequest) {
  return req.headers.get("x-admin-password") === process.env.ADMIN_PASSWORD;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });

  const { orderId } = await req.json();
  if (!orderId) return NextResponse.json({ error: "Mangler orderId" }, { status: 400 });

  // Hent ordren
  const { data: order, error: fetchErr } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (fetchErr || !order) return NextResponse.json({ error: "Finner ikke bestillingen" }, { status: 404 });
  if (order.status === "refundert") return NextResponse.json({ error: "Allerede refundert" }, { status: 400 });

  // Oppdater status
  const { error: updateErr } = await supabaseAdmin
    .from("orders")
    .update({ status: "refundert" })
    .eq("id", orderId);

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

  // Send refund-epost til kunden
  if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes("FYLL_INN")) {
    try {
      const pris = packagePrices[order.pakke] ?? 0;
      await resend.emails.send({
        from: "RusseDesign <onboarding@resend.dev>",
        to: order.epost,
        subject: "Din bestilling er refundert — RusseDesign",
        html: `
          <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; background: #f9fafb; padding: 32px; border-radius: 12px;">
            <h2 style="color: #7c3aed; margin-bottom: 4px;">Refusjon bekreftet</h2>
            <p style="color: #6b7280; font-size: 14px; margin-top: 0;">Hei ${order.navn},</p>
            <p style="color: #374151; font-size: 15px;">Din bestilling hos RusseDesign er nå refundert.</p>
            <table style="width:100%; border-collapse: collapse; margin: 20px 0; background: #fff; border-radius: 8px; overflow: hidden;">
              <tr style="background: #f3f4f6;"><td style="padding: 10px 14px; color: #6b7280; font-size: 13px; width: 120px;">Pakke</td><td style="padding: 10px 14px; font-weight: bold; color: #7c3aed;">${packageNames[order.pakke] ?? order.pakke}</td></tr>
              <tr><td style="padding: 10px 14px; color: #6b7280; font-size: 13px;">Beløp</td><td style="padding: 10px 14px; font-weight: bold; color: #111;">${pris.toLocaleString("no")} kr</td></tr>
              <tr style="background: #f3f4f6;"><td style="padding: 10px 14px; color: #6b7280; font-size: 13px;">Status</td><td style="padding: 10px 14px; color: #10b981; font-weight: bold;">Refundert ✓</td></tr>
            </table>
            <p style="color: #6b7280; font-size: 13px;">Pengene vil returneres til din originale betalingsmetode innen 5–10 virkedager.</p>
            <p style="color: #6b7280; font-size: 13px;">Har du spørsmål? Kontakt oss på <a href="mailto:${process.env.OWNER_EMAIL}" style="color: #7c3aed;">${process.env.OWNER_EMAIL}</a></p>
          </div>
        `,
      });
    } catch (e) {
      console.error("Refund email feil:", e);
    }
  }

  return NextResponse.json({ success: true });
}
