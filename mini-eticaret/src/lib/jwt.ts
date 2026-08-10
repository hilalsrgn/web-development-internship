import jwt from "jsonwebtoken";

// Bu dosya bilerek "next/headers" gibi Next.js'e özgü hiçbir şey içermiyor —
// sadece saf jsonwebtoken kullanıyor. Böylece hem normal API route'larından
// hem de proxy.ts (Edge runtime'da çalışabilen route koruma dosyası) içinden
// güvenle import edilebiliyor.

const JWT_SECRET = process.env.JWT_SECRET;

export interface JwtPayload {
  userId: string;
  role: "user" | "admin";
}

function getSecret(): string {
  if (!JWT_SECRET) {
    throw new Error(
      "JWT_SECRET tanımlı değil. .env.local dosyasına eklemeyi unuttun mu?"
    );
  }
  return JWT_SECRET;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, getSecret()) as JwtPayload;
  } catch {
    // Token süresi dolmuş, imza uyuşmuyor veya bozuk — hepsi için
    // basitçe "geçersiz" kabul ediyoruz, sebebini ayırt etmemize gerek yok.
    return null;
  }
}
