import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    if (req.nextauth.token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  { pages: { signIn: "/login" } }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
};
