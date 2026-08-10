import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { requireAdmin } from "@/lib/auth";

// Vercel Blob'un "client upload" akışı: tarayıcı dosyayı doğrudan Blob'a
// yüklüyor, bu route sadece kısa ömürlü bir yükleme izni (token) veriyor.
// Dosyanın kendisi hiçbir zaman bizim sunucumuzdan geçmiyor — aynı S3
// presigned URL yaklaşımıyla aynı güvenlik mantığı, farklı sağlayıcı.
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const admin = await requireAdmin();
        if (!admin) {
          throw new Error("Yetkiniz yok");
        }

        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/avif",
          ],
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // Yükleme tamamlandığında ekstra bir işlem yapmamıza gerek yok —
        // dönen URL zaten ürün formunda görseller listesine ekleniyor.
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Yükleme başarısız";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
