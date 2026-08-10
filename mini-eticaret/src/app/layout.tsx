import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import { getCurrentUser } from "@/lib/auth";
import { CartProvider } from "@/lib/cart-context";
import "./globals.css";

// Başlıklarda karaktere sahip bir serif (Fraunces), gövde metninde okunaklı
// bir sans (Inter). İkisi birlikte "her yerde gördüğün AI arayüzü" hissini kırıyor.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mini Mağaza",
  description: "Staj final projesi — Next.js, MongoDB ve JWT ile mini e-ticaret uygulaması.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // .env.local henüz kurulmadıysa (MONGODB_URI yoksa) tüm siteyi
  // çökertmek yerine, navbar'ı "çıkış yapılmış" gibi göstermeyi tercih
  // ediyoruz — sadece gerçek auth işlemleri (kayıt/giriş) hata verir.
  let user: { name: string; role: "user" | "admin" } | null = null;
  try {
    const currentUser = await getCurrentUser();
    if (currentUser) {
      user = { name: currentUser.name, role: currentUser.role };
    }
  } catch {
    user = null;
  }

  return (
    <html
      lang="tr"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <CartProvider>
          <Navbar user={user} />
          <main className="flex-1">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
