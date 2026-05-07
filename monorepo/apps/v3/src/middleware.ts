import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import {
  CMS_TEMPLATE_COOKIE,
  CMS_TEMPLATE_HEADER,
  resolveTemplateFromHost,
  type CmsTemplateId,
} from "@/lib/cms-template";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function forwardedHost(req: NextRequest): string {
  const xfh = req.headers.get("x-forwarded-host");
  if (xfh) return xfh.split(",")[0]?.trim() ?? "";
  return req.headers.get("host") ?? "";
}

function syncTemplateCookie(
  req: NextRequest,
  res: NextResponse,
  template: CmsTemplateId,
) {
  const cur = req.cookies.get(CMS_TEMPLATE_COOKIE)?.value;
  if (cur === template) return;
  res.cookies.set(CMS_TEMPLATE_COOKIE, template, {
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
    httpOnly: true,
  });
}

function nextWithTemplate(req: NextRequest, template: CmsTemplateId) {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set(CMS_TEMPLATE_HEADER, template);
  const res = NextResponse.next({
    request: { headers: requestHeaders },
  });
  syncTemplateCookie(req, res, template);
  return res;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const template = resolveTemplateFromHost(forwardedHost(req));

  const protectedPath =
    (pathname.startsWith("/admin") && pathname !== "/admin/login") ||
    (pathname.startsWith("/api/admin") && pathname !== "/api/admin/login");

  if (!protectedPath) {
    return nextWithTemplate(req, template);
  }

  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const ok = await verifySessionToken(token ?? "");
  if (ok) {
    return nextWithTemplate(req, template);
  }

  if (pathname.startsWith("/api/")) {
    const res = NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    syncTemplateCookie(req, res, template);
    return res;
  }
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname);
  const res = NextResponse.redirect(url);
  syncTemplateCookie(req, res, template);
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
