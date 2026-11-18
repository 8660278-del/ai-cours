import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { BridgeProvider } from "@/components/bridge-provider";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const appName = "ГК ПИР";

export const metadata: Metadata = {
  title: `${appName} — Нейросети для работы`,
  description:
    "Учебный курс ГК ПИР: как применять нейросети в ежедневной работе и повышать продуктивность.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={cn("font-sans", geist.variable)}>
      <body className="antialiased min-h-screen bg-background flex flex-col">
        <BridgeProvider />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-black/10 bg-[#f6f5f2]">
          <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
            © {new Date().getFullYear()} {appName} · Учебный курс «Нейросети для
            работы»
          </div>
        </footer>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
