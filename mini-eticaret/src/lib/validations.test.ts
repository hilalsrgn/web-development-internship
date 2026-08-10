import { describe, expect, it } from "vitest";
import {
  registerSchema,
  loginSchema,
  productSchema,
  checkoutSchema,
} from "./validations";

describe("registerSchema", () => {
  it("geçerli veriyi kabul eder", () => {
    const result = registerSchema.safeParse({
      name: "Ahmet Yılmaz",
      email: "ahmet@ornek.com",
      password: "sifre123",
    });
    expect(result.success).toBe(true);
  });

  it("2 karakterden kısa ismi reddeder", () => {
    const result = registerSchema.safeParse({
      name: "A",
      email: "ahmet@ornek.com",
      password: "sifre123",
    });
    expect(result.success).toBe(false);
  });

  it("geçersiz e-postayı reddeder", () => {
    const result = registerSchema.safeParse({
      name: "Ahmet Yılmaz",
      email: "gecersiz-eposta",
      password: "sifre123",
    });
    expect(result.success).toBe(false);
  });

  it("6 karakterden kısa şifreyi reddeder", () => {
    const result = registerSchema.safeParse({
      name: "Ahmet Yılmaz",
      email: "ahmet@ornek.com",
      password: "12345",
    });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("boş şifreyi reddeder", () => {
    const result = loginSchema.safeParse({
      email: "ahmet@ornek.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("productSchema", () => {
  it("negatif fiyatı reddeder", () => {
    const result = productSchema.safeParse({
      name: "Ürün",
      description: "Yeterince uzun bir açıklama metni.",
      price: -10,
      stock: 5,
      category: "abc123",
      images: [],
    });
    expect(result.success).toBe(false);
  });

  it("negatif stoğu reddeder", () => {
    const result = productSchema.safeParse({
      name: "Ürün",
      description: "Yeterince uzun bir açıklama metni.",
      price: 100,
      stock: -1,
      category: "abc123",
      images: [],
    });
    expect(result.success).toBe(false);
  });

  it("form'dan gelen string sayıları otomatik çevirir", () => {
    // HTML formlarından gelen değerler her zaman string'tir (input
    // elemanları type="number" olsa bile). z.coerce bunu otomatik
    // sayıya çeviriyor mu, kontrol ediyoruz.
    const result = productSchema.safeParse({
      name: "Ürün",
      description: "Yeterince uzun bir açıklama metni.",
      price: "149.90",
      stock: "10",
      category: "abc123",
      images: [],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.price).toBe(149.9);
      expect(result.data.stock).toBe(10);
    }
  });
});

describe("checkoutSchema", () => {
  it("boş sepeti reddeder", () => {
    const result = checkoutSchema.safeParse({
      shippingAddress: {
        fullName: "Ahmet Yılmaz",
        address: "Örnek Mahallesi Test Sokak No:1",
        city: "İstanbul",
        postalCode: "34000",
      },
      items: [],
    });
    expect(result.success).toBe(false);
  });

  it("eksik teslimat adresini reddeder", () => {
    const result = checkoutSchema.safeParse({
      shippingAddress: {
        fullName: "Ahmet Yılmaz",
        address: "kısa",
        city: "İstanbul",
        postalCode: "34000",
      },
      items: [{ productId: "abc123", quantity: 1 }],
    });
    expect(result.success).toBe(false);
  });
});
