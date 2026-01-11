import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File;

  const filename = `${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from("audio")
    .upload(filename, file);

  if (error) return NextResponse.json({ error });

  const { data: url } = supabase.storage
    .from("audio")
    .getPublicUrl(filename);

  return NextResponse.json({ url: url.publicUrl });
}
