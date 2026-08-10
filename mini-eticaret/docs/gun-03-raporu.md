# Gün 3 Raporu — Ürün/Kategori CRUD ve Admin Paneli

**Tarih:** 2026-08-18
**Proje:** Mini E-Ticaret (staj final projesi)

## Bugünün hedefi

Admin'in ürün ve kategori ekleyip yönetebileceği bir sistem kurmak: hem
API tarafında (veriyi doğru ve güvenli şekilde kaydeden route'lar) hem de
arayüz tarafında (bu route'ları kullanan bir admin paneli).

## Yapılanlar

1. **`lib/auth.ts` → `requireAdmin()`** — API route'larında "bu isteği
   atan admin mi?" kontrolü için ortak fonksiyon.
2. **`lib/validations.ts`** — kategori ve ürün için Zod şemaları eklendi.
3. **`lib/slugify.ts`** — Türkçe karakterleri (ı, ğ, ü, ş, ö, ç) URL-dostu
   hale getiren küçük bir yardımcı fonksiyon (örn. "Kadın Ayakkabı" →
   "kadin-ayakkabi").
4. **Kategori API'leri** — `/api/categories` (listeleme herkese açık,
   ekleme sadece admin), `/api/categories/[id]` (güncelleme/silme admin).
5. **Ürün API'leri** — `/api/products` (listeleme + `?category=` ve
   `?q=` filtreleri, ekleme admin), `/api/products/[id]` (tekil
   getirme, güncelleme, silme).
6. **Admin paneli** — `/admin` (özet: ürün/kategori/sipariş sayıları),
   `/admin/kategoriler` (liste + ekleme + silme), `/admin/urunler`
   (liste + silme), `/admin/urunler/yeni` ve `/admin/urunler/[id]/duzenle`
   (ortak `ProductForm` bileşeni ile).
7. **Test hesabını admin yapma** — `scripts/set-admin-role.mjs` ile
   `test2@example.com` admin rolüne yükseltildi.
8. **Uçtan uca test** — admin panelinden gerçek bir kategori ("Elektronik")
   ve ürün ("Kablosuz Kulaklık") oluşturuldu, düzenlendi (stok güncellendi),
   listede doğru göründüğü doğrulandı.

## Karşılaşılan sorunlar ve çözümleri

**1. Rol değişikliği anında etkili olmuyor.**
Veritabanında bir kullanıcının rolünü "admin" yaptığımda, o kullanıcının
zaten var olan oturum token'ı hâlâ eski rolü ("user") taşıyordu — çünkü
JWT, üretildiği anda rolü içine "gömüyor", her istekte veritabanına
sormuyor. `src/proxy.ts` sayfa erişimini token'daki role bakarak
kontrol ettiği için, kullanıcı çıkış yapıp tekrar giriş yapana kadar
admin paneline giremedi. **Çözüm:** basitçe çıkış yapıp tekrar giriş
yapmak; yeni token güncel rolü taşıyor. Bunu bilerek böyle bıraktım —
her sayfa isteğinde veritabanına sorup rolü kontrol etmek performans
kaybı olurdu, 7 günlük token ömrü boyunca bu küçük gecikmeyi kabul
edilebilir buluyorum.

**2. "Only plain objects can be passed to Client Components" hatası.**
`/admin/urunler` sayfasında ürünleri MongoDB'den `.lean()` ile çektiğimde,
`_id` ve `category` alanları hâlâ MongoDB'nin özel `ObjectId` tipindeydi
(düz bir string/obje değil). Bu veriyi doğrudan bir Client Component'e
(`DeleteProductButton`) prop olarak geçirince Next.js hata verdi — çünkü
sunucudan tarayıcıya giden veri "seri hale getirilebilir" (serializable)
olmak zorunda, `ObjectId` gibi özel sınıflar buna uymuyor. **Çözüm:**
veritabanından gelen veriyi sayfaya göndermeden önce elle düz bir objeye
çeviriyorum (`String(product._id)` gibi). Bu, Next.js'in Server/Client
Component ayrımını anlamak açısından öğretici bir hataydı.

## Teknik kararların gerekçeleri

**Neden yetki kontrolü hem `proxy.ts`'de hem her API route'unda ayrı ayrı var?**
`proxy.ts` sadece *sayfaları* koruyor (`/admin/:path*`), API route'ları
(`/api/products` gibi) onun kapsamına girmiyor. Birisi admin panelini
hiç açmadan doğrudan `fetch('/api/products', {method:'POST', ...})`
çağırabilir — bunu `requireAdmin()` ile her yazma işlemi yapan route'ta
ayrıca engelliyoruz. Bunu bizzat test ettim: oturumu kapatıp API'ye
istek attığımda `403 Yetkiniz yok` cevabı aldım, arayüzdeki "gizli"
görünmesi tek başına yeterli değilmiş.

**Neden kategori silme, o kategoriye ait ürün varsa engelleniyor?**
Aksi halde ürünler "kategorisi olmayan" (geçersiz bir ID'ye işaret eden)
bir halde kalırdı. Basit bir `countDocuments` kontrolüyle bu veri
tutarsızlığını en baştan engelledik.

**Neden görseller şimdilik URL metin kutusu, dosya yükleme değil?**
AWS S3 entegrasyonu Gün 8'e planlandı — o kurulana kadar ürünlere
geçici olarak herhangi bir görsel URL'i (örn. bir stok fotoğraf
sitesinden) eklenebiliyor. S3 kurulunca bu alan gerçek dosya yükleme
alanına dönüşecek, veri modeli (`images: string[]`) zaten buna hazır.

## Sonraki adım (Gün 4)

Mağaza vitrini: ürün listeleme, detay sayfası, kategoriye göre filtre,
arama — tasarım kalitesinin öne çıkması gereken kısım.
