import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const PRODUCT_NAME = "questme";

async function timed(fn: () => Promise<void>, timeoutMs: number): Promise<{ ok: boolean; latencyMs: number; error?: string }> {
  const started = Date.now();
  try {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), timeoutMs)
    );
    await Promise.race([fn(), timeout]);
    return { ok: true, latencyMs: Date.now() - started };
  } catch (e) {
    return {
      ok: false,
      latencyMs: Date.now() - started,
      error: (e instanceof Error ? e.message : "error").slice(0, 100),
    };
  }
}

async function probeSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { ok: false, latencyMs: 0, error: "missing_env" };
  return timed(async () => {
    const supabase = createClient(url, key, { auth: { persistSession: false } });
    const { error } = await supabase
      .from("__nonexistent_health_probe__")
      .select("id")
      .limit(1);
    if (error && error.code !== "42P01" && error.code !== "PGRST205") {
      throw new Error(error.code ?? "unknown");
    }
  }, 2000);
}

async function probeStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return { ok: false, latencyMs: 0, error: "missing_env" };
  return timed(async () => {
    const res = await fetch("https://api.stripe.com/v1/balance", {
      headers: { Authorization: `Bearer ${key}` },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`http_${res.status}`);
  }, 3000);
}

async function probeResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, latencyMs: 0, error: "missing_env" };
  return timed(async () => {
    const res = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${key}` },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`http_${res.status}`);
  }, 3000);
}

export async function GET() {
  const startedAt = Date.now();
  const [supabase, stripe, email] = await Promise.all([
    probeSupabase(),
    probeStripe(),
    probeResend(),
  ]);

  const allOk = supabase.ok && stripe.ok && email.ok;
  const supabaseOk = supabase.ok;

  const status = allOk ? "ok" : supabaseOk ? "degraded" : "error";
  const httpStatus = supabaseOk ? 200 : 503;

  return NextResponse.json(
    {
      status,
      product: PRODUCT_NAME,
      checks: { supabase, stripe, email },
      durationMs: Date.now() - startedAt,
      timestamp: new Date().toISOString(),
    },
    { status: httpStatus }
  );
}
