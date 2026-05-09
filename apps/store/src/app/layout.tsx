// src/app/layout.tsx
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
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <footer className="bg-gray-900 text-gray-400 text-sm text-center py-6 mt-16">
            © {new Date().getFullYear()} ElectroMart. All rights reserved.
          </footer>
        </Providers>
      </body>
    </html>
  );
}
