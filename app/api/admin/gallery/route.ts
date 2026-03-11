import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

function checkAuth(req: NextRequest) {
  return req.headers.get("x-admin-password") === ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase.storage.from("gallery").list("", {
    sortBy: { column: "created_at", order: "desc" },
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const files = (data || []).map((file) => {
    const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(file.name);
    return { name: file.name, url: urlData.publicUrl, created_at: file.created_at };
  });

  return NextResponse.json(files);
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const filename = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
  const { error } = await supabase.storage.from("gallery").upload(filename, file, {
    contentType: file.type,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = supabase.storage.from("gallery").getPublicUrl(filename);
  return NextResponse.json({ url: data.publicUrl, name: filename });
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = await req.json();
  const { error } = await supabase.storage.from("gallery").remove([name]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
