import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const locale = request.nextUrl.pathname.match(/^\/(en|ar)(?:\/|$)/)?.[1] ?? "en";
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-makers-locale", locale);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)"],
};
