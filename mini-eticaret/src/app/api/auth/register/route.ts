import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { hashPassword } from "@/lib/auth";
import { signToken } from "@/lib/jwt";
import { registerSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    // Zod hatalarını sade bir mesaj listesine çeviriyoruz, ham Zod
    // hata objesini frontend'e sızdırmıyoruz.
    const message = parsed.error.issues[0]?.message ?? "Geçersiz veri";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { name, email, password } = parsed.data;

  await connectDB();

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return NextResponse.json(
      { error: "Bu e-posta adresi zaten kayıtlı" },
      { status: 409 }
    );
  }

  const hashedPassword = await hashPassword(password);
  const user = await User.create({ name, email, password: hashedPassword });

  const token = signToken({ userId: user.id, role: user.role });

  const response = NextResponse.json(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    { status: 201 }
  );

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 gün — signToken'daki süreyle aynı
    path: "/",
  });

  return response;
}
