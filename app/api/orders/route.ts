import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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
  const { error: dbError } = await supabase.from("orders").insert({
    navn,
    epost,
    pakke,
    russekull,
    beskrivelse,
    bilder: bildeUrls,
    status: "ny",
  });

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
