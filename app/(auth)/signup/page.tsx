"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sparkles, Check } from "lucide-react";

const PERKS = [
  "5 carousels free every month",
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
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
    <div className="min-h-screen flex bg-[#0A0A0A]">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-center px-16 w-[45%] border-r border-white/5">
        <Link href="/" className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 rounded-lg bg-[#00C2A8] flex items-center justify-center text-black font-black">
            S
          </div>
          <span className="font-black text-xl text-white">Scrollr</span>
        </Link>

        <h2 className="text-3xl font-black text-white mb-4">
          Start creating scroll-stopping carousels
        </h2>
        <p className="text-white/50 mb-8 leading-relaxed">
          Join thousands of creators, marketers, and founders who turn ideas into
          high-performing social content in seconds.
        </p>

        <ul className="space-y-3">
          {PERKS.map((perk) => (
            <li key={perk} className="flex items-center gap-3 text-sm text-white/70">
              <div className="w-5 h-5 rounded-full bg-[#00C2A8]/20 text-[#00C2A8] flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3" />
              </div>
              {perk}
            </li>
          ))}
        </ul>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="lg:hidden text-center mb-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#00C2A8] flex items-center justify-center text-black font-black">
                S
              </div>
              <span className="font-black text-xl text-white">Scrollr</span>
            </Link>
          </div>

          <div>
            <h1 className="text-2xl font-black text-white">Create your account</h1>
            <p className="text-white/50 text-sm mt-1">Free forever. No card needed.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white/70">Name</Label>
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Email</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Password</Label>
              <Input
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00C2A8] text-black hover:bg-[#00D4BA] font-bold gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {loading ? "Creating account..." : "Create free account"}
            </Button>
          </form>

          <p className="text-center text-xs text-white/30">
            By signing up, you agree to our{" "}
            <a href="#" className="text-white/50 hover:text-white/70">Terms</a>{" "}
            and{" "}
            <a href="#" className="text-white/50 hover:text-white/70">Privacy Policy</a>
          </p>

          <p className="text-center text-sm text-white/40">
            Already have an account?{" "}
            <Link href="/login" className="text-[#00C2A8] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
