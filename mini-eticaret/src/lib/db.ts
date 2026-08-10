import mongoose from "mongoose";
import dns from "dns";

// "mongodb+srv://" adresleri, gerçek sunucu listesini bulmak için özel bir
// DNS sorgusu (SRV kaydı) yapar. Bazı Türkiye ISP/DNS sunucuları bu sorgu
// tipini desteklemiyor ve "querySrv ECONNREFUSED" hatası veriyor. Çözüm:
// sadece bu sorgu için Google'ın herkese açık DNS sunucusunu kullanmak —
// sistem geneli DNS ayarını değiştirmiyoruz, sadece bu Node.js sürecini.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const MONGODB_URI = process.env.MONGODB_URI;

// Next.js geliştirme modunda dosyalar sık sık yeniden yüklenir (hot reload).
// Her yeniden yüklemede yeni bir mongoose bağlantısı açmak yerine, bağlantıyı
// global nesnede önbelleğe alıyoruz — böylece "too many connections" hatasını
// önlemiş oluyoruz.
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cache;

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI tanımlı değil. .env.local dosyasına eklemeyi unuttun mu?"
    );
  }

  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI);
  }

  try {
    cache.conn = await cache.promise;
  } catch (err) {
    // Bağlantı başarısız olduysa önbelleği temizliyoruz — aksi halde bu
    // başarısız Promise sonsuza kadar saklanır ve bir daha asla yeniden
    // denenmez (Node süreci hayatta kaldığı sürece her istek aynı hatayı alır).
    cache.promise = null;
    throw err;
  }

  return cache.conn;
}
