import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { verifyToken } from "@/lib/jwt";

const SALT_ROUNDS = 10;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function comparePassword(
  plain: string,
  hashed: string
): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

// Server component'lerde ve API route'larında "şu an giriş yapmış kullanıcı
// kim?" sorusunun cevabı burada. Cookie'deki JWT'yi okuyup doğruluyor,
// geçerliyse veritabanından güncel kullanıcıyı getiriyor.
export async function getCurrentUser() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  await connectDB();
  const user = await User.findById(payload.userId).lean();
  return user;
}

// proxy.ts sayfa erişimini koruyor ama API route'ları proxy'nin matcher'ına
// girmiyor (bkz. src/proxy.ts config.matcher) — bu yüzden ürün/kategori
// yazma işlemi yapan her API route'unun başında ayrıca bu kontrolü
// yapıyoruz. "Sadece arayüzde gizlemek" yeterli değil, sunucu tarafında da
// doğrulanmalı; aksi halde biri admin/urunler sayfasını görmeden doğrudan
// API'ye istek atarak ürün silebilir.
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return null;
  }
  return user;
}
