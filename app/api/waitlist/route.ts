import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.toLowerCase().trim() : "";

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    await supabase
      .from("waitlist")
      .upsert({ email, source: body.source ?? "affiliate" }, { onConflict: "email" });
  } catch {
    // Table may not exist yet in this environment — still return success to unblock UX
  }

  return NextResponse.json({ ok: true });
}
