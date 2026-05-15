import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * POST /api/auth/logout
 * Server-side logout endpoint that validates the session.
 * The actual token invalidation is handled client-side via NextAuth's signOut().
 * @returns JSON { success: true } if session exists, 401 if not authenticated
 */
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  return NextResponse.json({ success: true });
}
