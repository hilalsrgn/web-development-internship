import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

// Next.js 16'da "middleware" dosya kuralı kaldırılıp "proxy" oldu. Eski
// middleware'in aksine proxy varsayılan olarak Node.js runtime'da çalışıyor
// (Edge değil) — bu yüzden jsonwebtoken gibi Node'a özgü paketleri burada
// sorunsuz kullanabiliyoruz; ayrı bir "Edge-uyumlu" JWT kütüphanesi gerekmiyor.

const ADMIN_PREFIX = "/admin";
// Sipariş geçmişi (/hesabim/siparisler) ve checkout (/odeme) ikisi de
// giriş gerektiriyor — ikisini de aynı "hesap" kapsamında koruyoruz.
const ACCOUNT_PREFIXES = ["/hesabim", "/odeme"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const payload = token ? verifyToken(token) : null;

  const needsAuth =
    pathname.startsWith(ADMIN_PREFIX) ||
    ACCOUNT_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (!needsAuth) {
    return NextResponse.next();
  }

  if (!payload) {
    const loginUrl = new URL("/giris", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith(ADMIN_PREFIX) && payload.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/hesabim/:path*", "/odeme/:path*"],
};
