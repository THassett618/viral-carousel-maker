import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { embedText } from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { query, threshold = 0.3, limit = 6 } = await req.json();
    if (!query) return NextResponse.json({ error: "query required" }, { status: 400 });

    const embedding = await embedText(query);
    const { data, error } = await supabase.rpc("match_reference_images", {
      query_embedding: embedding,
      match_threshold: threshold,
      match_count: limit,
      p_user_id: user.id,
    });

    if (error) throw new Error(error.message);
    return NextResponse.json({ results: data || [] });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Search failed" },
      { status: 500 }
    );
  }
}
