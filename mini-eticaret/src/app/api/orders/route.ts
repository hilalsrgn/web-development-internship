import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import { getCurrentUser } from "@/lib/auth";
import { checkoutSchema } from "@/lib/validations";

class StockError extends Error {}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Geçersiz veri";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  await connectDB();

  // GÜVENLİK: fiyatı asla istemciden gelen veriden almıyoruz — sepette
  // gösterilen fiyat tarayıcıda kolayca değiştirilebilir (DevTools'tan).
  // Burada her ürünün güncel fiyatını veritabanından tekrar okuyoruz.
  //
  // Stok azaltma her ürün için "atomik" yapılıyor: sadece stok yeterliyse
  // düş (findOneAndUpdate + $gte şartı). Bu, iki kişinin aynı anda son
  // ürünü satın almaya çalışması durumunda ikisinin de stoğu eksiye
  // düşürmesini engelliyor. Sipariş ortasında bir ürün yetersiz çıkarsa,
  // o ana kadar düşülen stokları geri ekleyip hatayı döndürüyoruz — gerçek
  // bir veritabanı "transaction"ı değil ama küçük bir proje için makul bir
  // yaklaşım.
  const orderItems: { product: string; name: string; price: number; quantity: number }[] = [];
  const decremented: { productId: string; quantity: number }[] = [];
  let totalPrice = 0;

  try {
    for (const item of parsed.data.items) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.productId, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );

      if (!updated) {
        const product = await Product.findById(item.productId);
        const label = product ? product.name : "bir ürün";
        throw new StockError(`"${label}" için yeterli stok yok`);
      }

      decremented.push({ productId: item.productId, quantity: item.quantity });
      orderItems.push({
        product: updated._id.toString(),
        name: updated.name,
        price: updated.price,
        quantity: item.quantity,
      });
      totalPrice += updated.price * item.quantity;
    }
  } catch (err) {
    for (const d of decremented) {
      await Product.updateOne(
        { _id: d.productId },
        { $inc: { stock: d.quantity } }
      );
    }

    const message = err instanceof StockError ? err.message : "Sipariş oluşturulamadı";
    return NextResponse.json({ error: message }, { status: 409 });
  }

  // Mock ödeme: gerçek bir ödeme sağlayıcısı yok, bu yüzden sipariş
  // oluşturulur oluşturulmaz doğrudan "paid" (ödendi) kabul ediliyor.
  const order = await Order.create({
    user: user._id,
    items: orderItems,
    totalPrice,
    status: "paid",
    shippingAddress: parsed.data.shippingAddress,
  });

  return NextResponse.json({ orderId: order._id.toString() }, { status: 201 });
}
