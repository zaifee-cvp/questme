import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const PRODUCT_NAME = "questme";

export async function GET() {
  const startedAt = Date.now();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      {
        status: "error",
        product: PRODUCT_NAME,
        error: "missing_env",
        durationMs: Date.now() - startedAt,
      },
      { status: 503 }
    );
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    const probe = supabase
      .from("__nonexistent_health_probe__")
      .select("id")
      .limit(1);

    const timeout = new Promise<{ error: { code: string } }>((resolve) =>
      setTimeout(() => resolve({ error: { code: "TIMEOUT" } }), 2000)
    );

    const result = (await Promise.race([probe, timeout])) as {
      error?: { code?: string };
    };

    const dbReachable =
      !result.error ||
      result.error.code === "42P01" ||
      result.error.code === "PGRST205";

    if (!dbReachable) {
      return NextResponse.json(
        {
          status: "error",
          product: PRODUCT_NAME,
          error: result.error?.code ?? "db_unreachable",
          durationMs: Date.now() - startedAt,
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        status: "ok",
        product: PRODUCT_NAME,
        durationMs: Date.now() - startedAt,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        status: "error",
        product: PRODUCT_NAME,
        error: err instanceof Error ? err.message : "unknown",
        durationMs: Date.now() - startedAt,
      },
      { status: 503 }
    );
  }
}
