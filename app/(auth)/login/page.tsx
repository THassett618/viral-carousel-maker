"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sparkles, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
    } else {
      router.push("/generate");
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative"
      style={{ background: "#070707" }}
    >
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,194,168,0.09) 0%, transparent 60%)",
        }}
      />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-8">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-black font-black text-sm"
              style={{
                background: "linear-gradient(135deg, #00C2A8, #00DFC8)",
                boxShadow: "0 0 18px rgba(0,194,168,0.4)",
              }}
            >
              S
            </div>
            <span
              className="font-black text-xl text-white"
              style={{ fontFamily: "var(--font-bricolage)" }}
            >
              Scrollr
            </span>
          </Link>

          <h1
            className="text-2xl font-black text-white mb-1"
            style={{ fontFamily: "var(--font-bricolage)", letterSpacing: "-0.02em" }}
          >
            Welcome back
          </h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            Sign in to your account
          </p>
        </div>

        {/* Glass card */}
        <div
          className="p-7 rounded-3xl"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(16px)",
          }}
        >
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl h-11 text-white placeholder:text-white/20"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-xl h-11 text-white placeholder:text-white/20"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl font-bold text-sm text-black flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, #00C2A8 0%, #00DFC8 100%)",
                boxShadow: loading ? "none" : "0 4px 20px rgba(0,194,168,0.25)",
              }}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Sign in
                </>
              )}
            </button>
          </form>
        </div>

        <p
          className="text-center text-sm mt-6"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold inline-flex items-center gap-1 transition-colors hover:brightness-110"
            style={{ color: "#00C2A8" }}
          >
            Sign up free
            <ArrowRight className="w-3 h-3" />
          </Link>
        </p>
      </div>
    </div>
  );
}
