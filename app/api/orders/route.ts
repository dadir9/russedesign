import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const packageNames: Record<string, string> = {
  standard: "Standard — 2.990 kr",
  gull: "Gull — 4.490 kr",
  vip: "VIP — 6.990 kr",
};

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const navn = formData.get("navn") as string;
  const epost = formData.get("epost") as string;
  const pakke = formData.get("pakke") as string;
  const russekull = formData.get("russekull") as string;
  const beskrivelse = formData.get("beskrivelse") as string;
  const bilder = formData.getAll("bilder") as File[];

  // Last opp bilder til Supabase Storage
  const bildeUrls: string[] = [];
  for (const fil of bilder) {
    if (!fil || !fil.size) continue;
    const filnavn = `${Date.now()}-${fil.name.replace(/\s/g, "_")}`;
    const { error } = await supabase.storage
      .from("order-images")
      .upload(filnavn, fil, { contentType: fil.type });

    if (!error) {
      const { data } = supabase.storage.from("order-images").getPublicUrl(filnavn);
      bildeUrls.push(data.publicUrl);
    }
  }

  // Lagre bestilling i databasen
  const { data: order, error: dbError } = await supabase
    .from("orders")
    .insert({ navn, epost, pakke, russekull, beskrivelse, bilder: bildeUrls, status: "ny" })
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  // Send e-post til eier med alle ordredetaljer
  console.log("RESEND_KEY finnes:", !!process.env.RESEND_API_KEY);
  console.log("OWNER_EMAIL:", process.env.OWNER_EMAIL);
  if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes("FYLL_INN")) {
    try {
      await resend.emails.send({
        from: "RusseDesign <onboarding@resend.dev>",
        to: process.env.OWNER_EMAIL!,
        subject: `Ny bestilling fra ${navn} — ${packageNames[pakke] ?? pakke}`,
        html: `
          <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; background: #f9fafb; padding: 32px; border-radius: 12px;">
            <h2 style="color: #7c3aed; margin-bottom: 4px;">Ny bestilling! 🔔</h2>
            <p style="color: #6b7280; font-size: 14px; margin-top: 0;">Mottatt via russedesign.no</p>
            <table style="width:100%; border-collapse: collapse; margin: 20px 0; background: #fff; border-radius: 8px; overflow: hidden;">
              <tr style="background: #f3f4f6;"><td style="padding: 10px 14px; color: #6b7280; font-size: 13px; width: 120px;">Navn</td><td style="padding: 10px 14px; font-weight: bold; color: #111;">${navn}</td></tr>
              <tr><td style="padding: 10px 14px; color: #6b7280; font-size: 13px;">E-post</td><td style="padding: 10px 14px; color: #111;"><a href="mailto:${epost}" style="color: #7c3aed;">${epost}</a></td></tr>
              <tr style="background: #f3f4f6;"><td style="padding: 10px 14px; color: #6b7280; font-size: 13px;">Pakke</td><td style="padding: 10px 14px; font-weight: bold; color: #7c3aed;">${packageNames[pakke] ?? pakke}</td></tr>
              <tr><td style="padding: 10px 14px; color: #6b7280; font-size: 13px;">Russekull</td><td style="padding: 10px 14px; color: #111;">${russekull}</td></tr>
              <tr style="background: #f3f4f6;"><td style="padding: 10px 14px; color: #6b7280; font-size: 13px;">Beskrivelse</td><td style="padding: 10px 14px; color: #111;">${beskrivelse}</td></tr>
              ${bildeUrls.length ? `<tr><td style="padding: 10px 14px; color: #6b7280; font-size: 13px;">Bilder</td><td style="padding: 10px 14px;">${bildeUrls.map((u, i) => `<a href="${u}" style="color: #7c3aed; margin-right: 8px;">Bilde ${i + 1}</a>`).join("")}</td></tr>` : ""}
            </table>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin" style="display: inline-block; background: #7c3aed; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">Se i admin-panel →</a>
          </div>
        `,
      });
      console.log("E-post sendt OK");
    } catch (e) {
      console.error("E-post feil:", e);
    }
  } else {
    console.log("E-post hoppet over — mangler API-nøkkel");
  }

  return NextResponse.json({ success: true, orderId: order.id });
}
