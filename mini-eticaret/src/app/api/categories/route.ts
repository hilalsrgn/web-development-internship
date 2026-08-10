import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
import { requireAdmin } from "@/lib/auth";
import { categorySchema } from "@/lib/validations";
import { slugify } from "@/lib/slugify";

// Kategori listesini herkes görebilir (mağaza vitrininde filtre olarak
// kullanılacak) — bu yüzden GET'te admin kontrolü yok.
export async function GET() {
  await connectDB();
  const categories = await Category.find().sort({ name: 1 }).lean();
  return NextResponse.json({ categories });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Yetkiniz yok" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Geçersiz veri";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  await connectDB();

  const slug = slugify(parsed.data.name);
  const existing = await Category.findOne({ slug });
  if (existing) {
    return NextResponse.json(
      { error: "Bu isimde bir kategori zaten var" },
      { status: 409 }
    );
  }

  const category = await Category.create({ name: parsed.data.name, slug });
  return NextResponse.json({ category }, { status: 201 });
}
