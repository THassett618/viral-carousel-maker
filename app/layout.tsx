import type { Metadata } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque, DM_Sans, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { LenisProvider } from "@/components/landing/LenisProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Scrollr — AI Carousel Generator",
  description:
    "Turn any topic, URL, or transcript into a scroll-stopping carousel in seconds. Built for LinkedIn, Instagram, and X.",
  openGraph: {
    title: "Scrollr — AI Carousel Generator",
    description: "Turn any topic into a scroll-stopping carousel in seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} ${dmSans.variable} ${bebasNeue.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <LenisProvider>
          {children}
        </LenisProvider>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
