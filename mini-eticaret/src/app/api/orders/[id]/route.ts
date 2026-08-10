import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { requireAdmin } from "@/lib/auth";

const VALID_STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"];

interface Params {
  params: Promise<{ id: string }>;
}

// Sadece durum (status) güncellenebiliyor — sipariş kalemleri veya fiyatı
// admin panelinden değiştirilemiyor. Bir sipariş oluşturulduktan sonra ne
// satıldığı ve ne kadar ödendiği sabit kalmalı; sadece "hangi aşamada
// olduğu" (kargoda, teslim edildi vb.) değişebilir.
export async function PATCH(request: NextRequest, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Yetkiniz yok" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();

  if (!VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Geçersiz durum" }, { status: 400 });
  }

  await connectDB();

  const order = await Order.findByIdAndUpdate(
    id,
    { status: body.status },
    { new: true }
  );

  if (!order) {
    return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
  }

  return NextResponse.json({ order });
}
