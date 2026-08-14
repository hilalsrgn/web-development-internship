import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Ürün görselleri artık tek, bilinen bir kaynaktan (Vercel Blob)
    // geliyor — bu yüzden next/image'in optimizasyonundan faydalanabiliriz.
    // Öncesinde (admin elle URL girdiğinde) domain sabit olmadığı için
    // bu mümkün değildi.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        // Örnek ürün kataloğu için Unsplash'ten gerçek ürün fotoğrafları
        // kullanıldı — admin yüklemeleri yine Vercel Blob'a gidiyor.
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
