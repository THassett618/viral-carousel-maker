"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sparkles, Check, ArrowRight } from "lucide-react";

const PERKS = [
  "3 carousels free to start",
  "All 8 slide templates included",
  "Instagram, LinkedIn, X support",
  "No credit card required",
];

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created! Check your email to confirm.");
      router.push("/generate");
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex relative"
      style={{ background: "#070707" }}
    >
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: [
            "radial-gradient(ellipse 60% 50% at 15% 50%, rgba(0,194,168,0.08) 0%, transparent 60%)",
            "radial-gradient(ellipse 50% 40% at 85% 20%, rgba(124,58,237,0.06) 0%, transparent 55%)",
          ].join(", "),
        }}
      />

      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-center px-16 w-[44%] relative"
        style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Subtle vertical line accent */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-48"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(0,194,168,0.3), transparent)",
          }}
        />

        <Link href="/" className="flex items-center gap-2.5 mb-16">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-black font-black text-sm"
            style={{
              background: "linear-gradient(135deg, #00C2A8, #00DFC8)",
              boxShadow: "0 0 16px rgba(0,194,168,0.4)",
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

        <h2
          className="font-black text-white mb-4 leading-tight"
          style={{
            fontFamily: "var(--font-bricolage)",
            fontSize: "2rem",
            letterSpacing: "-0.03em",
          }}
        >
          Make carousels that<br />
          <span style={{ color: "#00C2A8" }}>actually get saved.</span>
        </h2>
        <p
          className="leading-relaxed mb-10 text-[15px]"
          style={{ color: "rgba(255,255,255,0.42)" }}
        >
          Turn ideas into high-performing social content in seconds.
          Used by creators, marketers, and founders who stopped
          wasting hours in Canva.
        </p>

        <ul className="space-y-4">
          {PERKS.map((perk) => (
            <li key={perk} className="flex items-center gap-3 text-[14px]">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: "rgba(0,194,168,0.15)",
                  border: "1px solid rgba(0,194,168,0.25)",
                }}
              >
                <Check className="w-3 h-3" style={{ color: "#00C2A8" }} />
              </div>
              <span style={{ color: "rgba(255,255,255,0.65)" }}>{perk}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right panel: form */}
      <div className="flex-1 flex items-center justify-center px-4 py-16 relative z-10">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-black font-black text-sm"
                style={{
                  background: "linear-gradient(135deg, #00C2A8, #00DFC8)",
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
          </div>

          <div className="mb-8">
            <h1
              className="text-2xl font-black text-white mb-1"
              style={{ fontFamily: "var(--font-bricolage)", letterSpacing: "-0.02em" }}
            >
              Create your account
            </h1>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.38)" }}>
              Free forever. No card needed.
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
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="name"
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl h-11 text-white placeholder:text-white/20"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                />
              </div>
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
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
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
                  marginTop: "0.5rem",
                }}
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Create free account
                  </>
                )}
              </button>
            </form>
          </div>

          <p
            className="text-center text-[11px] mt-5"
            style={{ color: "rgba(255,255,255,0.22)" }}
          >
            By signing up, you agree to our{" "}
            <a
              href="#"
              className="underline underline-offset-2 transition-colors hover:text-white/40"
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="underline underline-offset-2 transition-colors hover:text-white/40"
            >
              Privacy Policy
            </a>
          </p>

          <p
            className="text-center text-sm mt-4"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold inline-flex items-center gap-1 transition-colors hover:brightness-110"
              style={{ color: "#00C2A8" }}
            >
              Sign in
              <ArrowRight className="w-3 h-3" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
