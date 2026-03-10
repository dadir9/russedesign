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

  // Send e-post til kunde
  await resend.emails.send({
    from: "RusseDesign <noreply@russedesign.no>",
    to: epost,
    subject: "Bestilling mottatt! 🎉",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #7c3aed;">Hei ${navn}! 🎨</h2>
        <p>Vi har mottatt bestillingen din. Her er en oppsummering:</p>
        <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 8px 0; color: #6b7280;">Pakke</td><td style="font-weight: bold;">${packageNames[pakke] ?? pakke}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Russekull</td><td style="font-weight: bold;">${russekull}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Beskrivelse</td><td>${beskrivelse}</td></tr>
        </table>
        <p style="color: #6b7280; font-size: 14px;">Vi tar kontakt innen kort tid. Ta vare på denne e-posten som kvittering.</p>
        <p style="color: #7c3aed; font-weight: bold;">— RusseDesign</p>
      </div>
    `,
  });

  // Send varsel til eier
  await resend.emails.send({
    from: "RusseDesign <noreply@russedesign.no>",
    to: process.env.OWNER_EMAIL!,
    subject: `Ny bestilling fra ${navn} — ${packageNames[pakke] ?? pakke}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Ny bestilling! 🔔</h2>
        <table style="width:100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; color: #6b7280;">Navn</td><td style="font-weight: bold;">${navn}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">E-post</td><td>${epost}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Pakke</td><td style="font-weight: bold;">${packageNames[pakke] ?? pakke}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Russekull</td><td>${russekull}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Beskrivelse</td><td>${beskrivelse}</td></tr>
          ${bildeUrls.length ? `<tr><td style="padding: 6px 0; color: #6b7280;">Bilder</td><td>${bildeUrls.map((u) => `<a href="${u}">Bilde</a>`).join(", ")}</td></tr>` : ""}
        </table>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin" style="color: #7c3aed;">Se i admin-panel →</a></p>
      </div>
    `,
  });

  return NextResponse.json({ success: true, orderId: order.id });
}
