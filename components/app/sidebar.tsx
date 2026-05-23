"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { Sparkles, LayoutGrid, BookImage, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const NAV = [
  { href: "/generate", label: "Generate", icon: Sparkles },
  { href: "/carousels", label: "My Carousels", icon: LayoutGrid },
  { href: "/library", label: "Style Library", icon: BookImage },
];

interface Props {
  user: User;
}

export function AppSidebar({ user }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const initials = (user.user_metadata?.full_name || user.email || "U")
    .split(" ")
    .map((p: string) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside
      className="w-56 flex flex-col min-h-screen sticky top-0 shrink-0"
      style={{
        background: "rgba(7,7,7,0.95)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Logo */}
      <div
        className="h-14 flex items-center px-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <Link href="/generate" className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-black font-black text-xs flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #00C2A8, #00DFC8)",
              boxShadow: "0 0 12px rgba(0,194,168,0.35)",
            }}
          >
            S
          </div>
          <span
            className="font-black text-[15px] tracking-tight text-white"
            style={{ fontFamily: "var(--font-bricolage)" }}
          >
            Scrollr
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2.5 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200",
                active
                  ? "text-white"
                  : "text-white/40 hover:text-white/80"
              )}
              style={
                active
                  ? {
                      background: "rgba(0,194,168,0.1)",
                      border: "1px solid rgba(0,194,168,0.15)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                    }
                  : {
                      border: "1px solid transparent",
                    }
              }
            >
              <Icon
                className="w-4 h-4 flex-shrink-0"
                style={{ color: active ? "#00C2A8" : undefined }}
              />
              {label}
              {active && (
                <div
                  className="w-1.5 h-1.5 rounded-full ml-auto flex-shrink-0"
                  style={{ background: "#00C2A8", boxShadow: "0 0 6px rgba(0,194,168,0.7)" }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User row */}
      <div
        className="p-2.5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <Avatar className="w-7 h-7 flex-shrink-0">
            <AvatarFallback
              className="text-[10px] font-black"
              style={{
                background: "rgba(0,194,168,0.15)",
                color: "#00C2A8",
                border: "1px solid rgba(0,194,168,0.2)",
              }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-white truncate">
              {user.user_metadata?.full_name || "User"}
            </p>
            <p
              className="text-[10px] truncate"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              {user.email}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="p-1.5 rounded-lg transition-colors hover:bg-white/[0.06]"
            title="Sign out"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
