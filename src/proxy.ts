import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // If user already set a preference cookie, respect it
  const cookieLocale = request.cookies.get("locale")?.value;
  if (cookieLocale === "es" || cookieLocale === "en") {
    return response;
  }

  // Otherwise detect from Accept-Language header
  const acceptLang = request.headers.get("accept-language") ?? "";
  const preferSpanish = acceptLang.toLowerCase().startsWith("es");
  const detectedLocale = preferSpanish ? "es" : "en";

  response.cookies.set("locale", detectedLocale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}

export const config = {
  matcher: ["/"],
};