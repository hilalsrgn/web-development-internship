import { z } from "zod";

// Zod: gelen veriyi hem TypeScript tipine hem de çalışma zamanı (runtime)
// kontrolüne bağlıyor. TypeScript sadece derleme sırasında kontrol eder;
// API'ye gelen istek gövdesi (request body) derleme zamanında bilinmiyor,
// bu yüzden orada Zod'a ihtiyacımız var.

export const registerSchema = z.object({
  name: z.string().trim().min(2, "İsim en az 2 karakter olmalı"),
  email: z.email("Geçerli bir e-posta adresi girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
});

export const loginSchema = z.object({
  email: z.email("Geçerli bir e-posta adresi girin"),
  password: z.string().min(1, "Şifre zorunlu"),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Kategori adı en az 2 karakter olmalı"),
});

export const productSchema = z.object({
  name: z.string().trim().min(2, "Ürün adı en az 2 karakter olmalı"),
  description: z.string().trim().min(10, "Açıklama en az 10 karakter olmalı"),
  price: z.coerce.number().positive("Fiyat 0'dan büyük olmalı"),
  stock: z.coerce.number().int().min(0, "Stok negatif olamaz"),
  category: z.string().min(1, "Kategori seçmelisin"),
  images: z.array(z.url("Geçerli bir görsel adresi girin")).default([]),
});

export const checkoutSchema = z.object({
  shippingAddress: z.object({
    fullName: z.string().trim().min(2, "Ad soyad en az 2 karakter olmalı"),
    address: z.string().trim().min(10, "Adres en az 10 karakter olmalı"),
    city: z.string().trim().min(2, "Şehir zorunlu"),
    postalCode: z.string().trim().min(4, "Posta kodu zorunlu"),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.coerce.number().int().positive(),
      })
    )
    .min(1, "Sepetiniz boş"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
