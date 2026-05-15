import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "ElectroMart — Premium Electronics",
  description: "Shop the latest laptops, phones, audio gear and accessories.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-slate-900">
        <Providers>
          <Navbar />
          <main className="relative min-h-screen overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(255,255,255,0))]" />
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(3,37,76,0.06),transparent_30%),radial-gradient(circle_at_top_right,rgba(17,103,177,0.08),transparent_28%)]" />
            {children}
          </main>
          <footer className="mt-16 border-t border-white/60 bg-white/50 py-6 text-center text-sm text-slate-500 backdrop-blur">
            © {new Date().getFullYear()} ElectroMart. Curated tech for real life.
          </footer>
        </Providers>
      </body>
    </html>
  );
}
