import { NextRequest, NextResponse } from "next/server";
import { generateHooks } from "@/lib/carousel-generator";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({
  topic: z.string().optional(),
  url: z.string().optional(),
  rawText: z.string().optional(),
  platform: z.enum(["instagram", "linkedin", "twitter"]).default("instagram"),
  targetAudience: z.string().optional(),
  offering: z.string().optional(),
  goal: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const input = schema.parse(body);

    const hooks = await generateHooks(input);
    return NextResponse.json({ hooks });
  } catch (err) {
    console.error("[hooks]", err);
    return NextResponse.json({ error: "Hook generation failed" }, { status: 500 });
  }
}
