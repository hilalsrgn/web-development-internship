# Gün 1 Raporu — Proje İskeleti, Veritabanı Modelleri ve Tasarım Sistemi

**Tarih:** 2026-08-18
**Proje:** Mini E-Ticaret (staj final projesi)
**Konum:** `web-development-internship/mini-eticaret`

## Bugünün hedefi

8 günlük planın ilk günü: çalışan bir proje iskeleti kurmak, veritabanı
bağlantısını hazırlamak, ana veri modellerini (User, Category, Product, Order)
tanımlamak ve sitenin görsel kimliğini (renk, tipografi, temel bileşenler)
oturtmak. Bu gün henüz kayıt/giriş veya ürün listeleme gibi işlevsel özellik
içermiyor — sonraki günlerin üzerine inşa edileceği temel bugün atıldı.

## Yapılanlar

1. **Proje kurulumu** — `create-next-app` ile TypeScript, Tailwind CSS ve App
   Router destekli bir Next.js projesi oluşturuldu (`mini-eticaret` klasörü,
   mevcut staj reposunun içinde, ayrı bir repo açılmadı).
2. **Next.js sürüm kontrolü** — kurulan sürüm 16.3.1 çıktı. Bu sürümde
   `middleware.ts` dosya kuralı kaldırılmış, yerine `proxy.ts` gelmiş
   (fonksiyon adı da `middleware` değil `proxy`). Bunu resmi pakette gelen
   dokümantasyondan (`node_modules/next/dist/docs`) doğruladım; Gün 2'de
   korumalı route'ları yazarken bu ismi kullanacağız.
3. **Paketler** — `mongoose`, `jsonwebtoken`, `bcryptjs`, `zod` kuruldu.
4. **Veritabanı bağlantısı** (`src/lib/db.ts`) — MongoDB'ye Mongoose ile
   bağlanan, bağlantıyı önbelleğe alan bir yardımcı fonksiyon.
5. **Veri modelleri** (`src/models/`) — `User`, `Category`, `Product`,
   `Order` şemaları, alan doğrulamalarıyla birlikte.
6. **Tasarım sistemi** — renk paleti, tipografi ve iki temel bileşen
   (Navbar, Button), ana sayfa bu sistemle yeniden yazıldı.
7. **Ortam değişkenleri** — `.env.local.example` dosyası eklendi,
   `.gitignore` gözden geçirildi.
8. **Doğrulama** — `tsc --noEmit` temiz geçti, `npm run dev` hatasız
   çalıştı, sayfa tarayıcıda konsol hatası olmadan render oldu.

## Teknik kararlar ve gerekçeleri

**Neden Next.js tek proje (ayrı bir Express backend değil)?**
8 günlük bir sürede iki ayrı proje (frontend + backend) yönetmek, iki ayrı
deployment ve CORS (farklı adresler arası istek izni) ayarı demek. Next.js'in
API route'ları sayesinde hem sayfaları hem API uç noktalarını tek projede
yazabiliyoruz — zaman kazandırıyor, roadmap de bunu öneriyor.

**Neden Mongoose (Prisma değil)?**
Prisma, veritabanıyla konuşurken arka planda "query engine" adında bir
binary dosya indirir; bu dosya bazı kurumsal ağlarda/firewall'larda
engellenebiliyor (daha önce bu sorunu yaşadık). Mongoose saf JavaScript/
TypeScript üzerinden çalışıyor, böyle bir indirme adımı yok.

**Neden kendi JWT sistemimiz (NextAuth değil)?**
Roadmap'te "JWT authentication" özellikle bir öğrenme hedefi olarak
geçiyor. Hazır bir paket kullanırsak token'ın nasıl oluşturulduğunu,
doğrulandığını görmeyiz. Gün 2'de bunu adım adım kendimiz yazacağız —
staj raporunda anlatması da daha kolay olacak.

**Model tasarımındaki küçük ama önemli detay:**
Her modelde `mongoose.models.X || mongoose.model(...)` deseni kullanıldı.
Next.js geliştirme modunda kodu her kaydettiğinizde dosyalar yeniden
çalıştırılır; bu satır olmadan "Cannot overwrite model" hatası alınır.
Aynı mantık `db.ts`'te bağlantı için de var — bağlantı global bir
değişkende saklanıyor, her hot-reload'da yeni bağlantı açılmıyor.

**Tasarım kararı: neden Fraunces + Inter, neden bu renkler?**
Varsayılan AI/SaaS arayüzlerinin çoğu mor-mavi gradyan ve tek bir grotesk
font (genelde Inter veya Geist) kullanıyor — bu "şablon" hissi veriyor.
Bunun yerine sıcak, kağıt tonlu bir zemin (`--paper`) ve toprak/kil
kırmızısı bir vurgu rengi (`--clay`) seçtim; başlıklarda karakterli bir
serif font (Fraunces), gövde metninde okunaklı bir sans-serif (Inter)
kullanılıyor. Amaç: bir bütik mağaza kimliğine benzemesi, jenerik bir
"AI ile üretildi" görünümünden kaçınmak.

## Karşılaşılan / önceden önlenen sorunlar

- Önceki (bulut ortamındaki) denemede yerel Windows ortamında klasör
  içi içe geçmesi ve zip dosyalarıyla uğraşmak ciddi sürtünme yaratmıştı.
  Bu sefer proje doğrudan hedef repo içinde, tek seviye klasör olarak
  açıldı.
- Google Fonts (`next/font/google`) ile ilgili daha önce bazı ağ
  ortamlarında build hatası yaşanmıştı; bu makinede sorunsuz indi, bu
  yüzden sistem fontuna geçmeye gerek kalmadı.
- `.gitignore`'daki `.env*` kuralı `.env.local.example` dosyasını da
  gizliyordu — örnek dosyanın git'e girebilmesi için
  `!.env*.example` istisnası eklendi.

## Şu an eksik / bilerek ertelenen

- `lib/jwt.ts`, `lib/auth.ts`, `lib/validations.ts` henüz yok — bunlar
  Gün 2'nin konusu (kayıt/giriş).
- Gerçek bir MongoDB bağlantı adresi (Atlas) henüz girilmedi; `db.ts`
  şu an sadece hazır, kullanılmıyor. `.env.local` dosyası oluşturulmadı.
- Hiçbir dosya git'e commit edilmedi — commit atma kararı kullanıcıya
  ait.

## Sonraki adım (Gün 2)

Kayıt/giriş sayfaları, şifre hashleme (`bcryptjs`), JWT üretimi/doğrulaması
ve `proxy.ts` ile korumalı route'lar. Bunun için önce MongoDB Atlas'ta
ücretsiz bir cluster kurulması gerekiyor.
