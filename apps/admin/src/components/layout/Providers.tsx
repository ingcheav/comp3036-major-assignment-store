"use client";
import { SessionProvider } from "next-auth/react";

/**
 * Providers component — wraps the admin dashboard with the NextAuth SessionProvider.
 * Makes the authentication session available throughout all admin pages and components.
 * @param children - The admin application subtree to wrap
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
