import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { comparePassword } from "@/lib/auth";
import { signToken } from "@/lib/jwt";
import { loginSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Geçersiz veri";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { email, password } = parsed.data;

  await connectDB();

  // Şifre alanı modelde "select: false" olduğu için varsayılan sorguda
  // gelmiyor — burada özellikle "+password" ile isteyip karşılaştırma
  // yapıyoruz, sonra kullanıcıyı hiç frontend'e döndürmüyoruz.
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );

  // Kullanıcı bulunamadıysa ile şifre yanlışsa aynı hata mesajını
  // döndürüyoruz — "bu e-posta kayıtlı mı değil mi" bilgisini sızdırmamak için.
  if (!user) {
    return NextResponse.json(
      { error: "E-posta veya şifre hatalı" },
      { status: 401 }
    );
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    return NextResponse.json(
      { error: "E-posta veya şifre hatalı" },
      { status: 401 }
    );
  }

  const token = signToken({ userId: user.id, role: user.role });

  const response = NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}
