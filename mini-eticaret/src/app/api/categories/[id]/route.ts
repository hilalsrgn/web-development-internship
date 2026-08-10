import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { requireAdmin } from "@/lib/auth";
import { categorySchema } from "@/lib/validations";
import { slugify } from "@/lib/slugify";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Yetkiniz yok" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Geçersiz veri";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  await connectDB();

  const category = await Category.findByIdAndUpdate(
    id,
    { name: parsed.data.name, slug: slugify(parsed.data.name) },
    { new: true }
  );

  if (!category) {
    return NextResponse.json({ error: "Kategori bulunamadı" }, { status: 404 });
  }

  return NextResponse.json({ category });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Yetkiniz yok" }, { status: 403 });
  }

  const { id } = await params;
  await connectDB();

  // Ürünleri "kategorisi silinmiş, kimliksiz" bırakmamak için: bu kategoriye
  // ait ürün varsa silmeyi reddediyoruz. Önce ürünleri başka bir kategoriye
  // taşımak ya da silmek gerekiyor.
  const productCount = await Product.countDocuments({ category: id });
  if (productCount > 0) {
    return NextResponse.json(
      {
        error: `Bu kategoride ${productCount} ürün var. Önce ürünleri silin ya da başka kategoriye taşıyın.`,
      },
      { status: 409 }
    );
  }

  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    return NextResponse.json({ error: "Kategori bulunamadı" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
