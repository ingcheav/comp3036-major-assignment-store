import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// Handles admin login: reads the password, validates it, then creates a JWT cookie.
export async function POST(request: Request) {
  const { password } = await request.json();

  if (password !== "123") {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const token = jwt.sign({ user: "admin" }, process.env.JWT_SECRET || "", {
    expiresIn: "15m",
  });
  const response = NextResponse.json({ success: true });

  // Store the JWT in an httpOnly cookie so client-side JavaScript cannot read it.
  response.cookies.set("auth_token", token, {
    httpOnly: true,
    maxAge: 60 * 15,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}

// Handles logout by removing the authentication cookie from the browser.
export async function DELETE() {
  const response = NextResponse.json({ success: true });

  response.cookies.delete("auth_token");

  return response;
}
