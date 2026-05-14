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
          <main className="relative min-h-screen overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(255,255,255,0))]" />
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(3,37,76,0.05),transparent_32%),radial-gradient(circle_at_top_right,rgba(17,103,177,0.07),transparent_28%)]" />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
