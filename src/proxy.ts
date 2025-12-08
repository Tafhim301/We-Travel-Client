import jwt, { JwtPayload } from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getCookie, deleteCookie } from "./services/auth/tokenHandlers";

export type UserRole = "USER" | "ADMIN";

const PUBLIC_ROUTES = ["/", "/about", "/explore", "/contact"];
const AUTH_ROUTES = ["/auth/login", "/auth/register"];

const ROLE_BASED_ROUTES: Record<UserRole, string[]> = {
  USER: ["/dashboard", "/profile"],
  ADMIN: ["/admin", "/admin/users", "/admin/dashboard"],
};

const DEFAULT_DASHBOARD: Record<UserRole, string> = {
  USER: "/dashboard",
  ADMIN: "/admin/dashboard",
};


function isPublicRoute(path: string) {
  return PUBLIC_ROUTES.some((r) => path.startsWith(r));
}

function isAuthRoute(path: string) {
  return AUTH_ROUTES.some((r) => path.startsWith(r));
}

function getRouteOwner(path: string): UserRole | null {
  for (const role in ROLE_BASED_ROUTES) {
    const belongs = ROLE_BASED_ROUTES[role as UserRole].some((p) =>
      path.startsWith(p)
    );
    if (belongs) return role as UserRole;
  }
  return null;
}


export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const accessToken = await getCookie("accessToken");

  let role: UserRole | null = null;

  if (accessToken) {
    try {
      const decoded = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_SECRET!
      ) as JwtPayload;

      role = decoded?.role as UserRole;
      if (!role) throw new Error("Invalid token payload");
    } catch (err) {
      console.log("JWT Error:", err);

      await deleteCookie("accessToken");
      await deleteCookie("refreshToken");

      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", path);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isAuthRoute(path)) {
    if (accessToken && role) {
      return NextResponse.redirect(
        new URL(DEFAULT_DASHBOARD[role], request.url)
      );
    }
    return NextResponse.next();
  }

  if (isPublicRoute(path)) {
    return NextResponse.next();
  }


  if (!accessToken) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(loginUrl);
  }


  const owner = getRouteOwner(path);

  if (owner && owner !== role) {
    return NextResponse.redirect(
      new URL(DEFAULT_DASHBOARD[role!], request.url)
    );
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};
