import jwt from "jsonwebtoken";
import { env } from "@repo/env/admin";
import { cookies } from "next/headers";

// Server helper used by admin pages to check the JWT stored in cookies.
export async function isLoggedIn() {
  const userCookies = await cookies();

  // ASSIGNMENT 2
  // check only that "auth_token" cookie exists
  // return userCookies.has("auth_token");

  // ASSIGNMENT 3
  // check that auth_token cookie exists and is valid
  const token = userCookies.get("auth_token")?.value;
  // jwt.verify confirms the token was signed with the same secret during login.
  return token && jwt.verify(token, env.JWT_SECRET || "");
}
