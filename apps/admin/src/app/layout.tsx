import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { AdminNavbar } from "@/components/layout/AdminNavbar";

export const metadata: Metadata = {
  title: "ElectroMart Admin",
  description: "ElectroMart store administration panel.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-slate-900">
        <Providers>
          <AdminNavbar />
          <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,rgba(238,244,251,0.92),rgba(219,230,244,0.98))]">
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[linear-gradient(180deg,rgba(3,37,76,0.12),rgba(3,37,76,0))]" />
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(3,37,76,0.06),transparent_32%),radial-gradient(circle_at_top_right,rgba(17,103,177,0.08),transparent_28%)]" />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
