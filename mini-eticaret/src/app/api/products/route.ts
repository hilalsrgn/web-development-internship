import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { requireAdmin } from "@/lib/auth";
import { productSchema } from "@/lib/validations";
import { slugify } from "@/lib/slugify";

// Mağaza vitrini (Gün 4) burayı ?category=...&q=... ile filtrelemek için
// kullanacak — bu yüzden şimdiden basit bir filtre desteği ekliyoruz.
export async function GET(request: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q");

  const filter: Record<string, unknown> = {};
  if (category) filter.category = category;
  if (q) filter.name = { $regex: q, $options: "i" };

  const products = await Product.find(filter)
    .populate("category", "name slug")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ products });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Yetkiniz yok" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Geçersiz veri";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  await connectDB();

  const slug = slugify(parsed.data.name);
  const existing = await Product.findOne({ slug });
  if (existing) {
    return NextResponse.json(
      { error: "Bu isimde bir ürün zaten var" },
      { status: 409 }
    );
  }

  const product = await Product.create({ ...parsed.data, slug });
  return NextResponse.json({ product }, { status: 201 });
}
