# Mini Mağaza

Next.js, MongoDB ve JWT ile sıfırdan geliştirilmiş bir mini e-ticaret
uygulaması. Staj final projesi olarak 8 günde geliştirildi.

Her günün ne yapıldığını ve neden öyle yapıldığını anlatan raporlar için
[`docs/`](docs) klasörüne bakın (`gun-01-raporu.md` — `gun-08-raporu.md`).

## Özellikler

- **Kimlik doğrulama** — JWT tabanlı kayıt/giriş, `httpOnly` cookie ile
  oturum yönetimi, bcrypt ile şifre hashleme
- **Rol tabanlı yetkilendirme** — `user` / `admin` rolleri, `proxy.ts`
  ile sayfa koruması, her yazma işlemi yapan API route'unda ayrıca
  sunucu taraflı yetki kontrolü
- **Ürün & kategori yönetimi** — admin panelinden tam CRUD
- **Mağaza vitrini** — ürün listeleme, kategoriye göre filtre, arama,
  ürün detay sayfası
- **Sepet** — tarayıcıda (`localStorage`) saklanan, giriş yapmadan da
  kullanılabilen sepet
- **Checkout & sipariş** — teslimat adresi formu, mock ödeme, sunucu
  tarafında fiyat/stok doğrulama, atomik stok düşürme
- **Sipariş yönetimi** — kullanıcı kendi sipariş geçmişini, admin tüm
  siparişleri görüp durumunu güncelleyebiliyor
- **Hata & yükleme durumları** — her ana bölümde `loading.tsx` /
  `error.tsx`, özel 404 sayfası
- **Responsive tasarım** — mobil menü dahil, telefon genişliğinde test
  edildi
- **Ürün görselleri** — Vercel Blob'da saklanıyor, admin panelinden
  doğrudan dosya yükleyerek eklenir

## Teknoloji Yığını

| Katman | Teknoloji | Neden |
| --- | --- | --- |
| Framework | Next.js 16 (App Router) | Frontend + API route'ları tek projede |
| Dil | TypeScript | Derleme zamanı tip güvenliği |
| Stil | Tailwind CSS v4 | Hızlı, tutarlı tasarım sistemi |
| Veritabanı | MongoDB Atlas + Mongoose | Prisma'nın binary indirme sorunlarından kaçınmak için |
| Kimlik doğrulama | jsonwebtoken + bcryptjs | Kendi JWT akışını öğrenmek için (hazır paket değil) |
| Doğrulama | Zod | Çalışma zamanı veri doğrulama |
| Görsel depolama | Vercel Blob | Deployment ile aynı hesap, ek servis kurulumu gerektirmiyor |
| Deployment | Vercel | Next.js ile sorunsuz entegrasyon |

## Kurulum

```bash
npm install
```

`.env.local.example` dosyasını kopyalayıp `.env.local` olarak kaydedin,
gerçek değerleri girin:

```bash
MONGODB_URI=...   # MongoDB Atlas bağlantı adresi
JWT_SECRET=...    # rastgele, uzun bir metin
```

(`BLOB_READ_WRITE_TOKEN` için bkz. `gun-08-raporu.md`.)

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) adresini açın.

## Klasör Yapısı

```
src/
  app/            → Next.js sayfaları ve API route'ları (App Router)
  models/         → Mongoose şemaları: User, Category, Product, Order
  lib/            → db bağlantısı, JWT, auth, doğrulama, sepet context'i
  components/     → paylaşılan UI bileşenleri
scripts/
  set-admin-role.mjs → bir kullanıcıyı admin yapmak için yardımcı script
docs/
  gun-XX-raporu.md   → günlük gelişim raporları
```

## Admin Hesabı Oluşturma

Kayıt olduktan sonra kendinizi admin yapmak için:

```bash
node scripts/set-admin-role.mjs sizin@epostaniz.com
```

## Test

```bash
npm test
```

## Bilinen Sınırlamalar

- Sipariş oluşturma sırasında stok düşürme atomik (`findOneAndUpdate`
  ile yarış durumu engelleniyor) ama tam bir veritabanı transaction'ı
  değil — sepette birden fazla ürün varken ortadaki bir ürün stok
  yetersizliğinden başarısız olursa, önceki ürünlerin stoğu geri
  ekleniyor ama bu iki ayrı işlem, tek bir atomik adım değil.
- Ödeme tamamen "mock" — gerçek bir ödeme sağlayıcısı entegre değil.
