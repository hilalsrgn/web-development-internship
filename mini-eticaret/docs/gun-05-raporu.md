# Gün 5 Raporu — Sepet Sistemi

**Tarih:** 2026-08-18
**Proje:** Mini E-Ticaret (staj final projesi)

## Bugünün hedefi

"Sepete Ekle" butonunu gerçek işleve kavuşturmak: ürünleri sepete
ekleyebilme, miktar değiştirebilme, çıkarabilme ve toplam tutarı görme.

## Yapılanlar

1. **`lib/cart-context.tsx`** — React Context ile sepet state'i
   (`addItem`, `removeItem`, `updateQuantity`, `clear`, `totalItems`,
   `totalPrice`) ve `localStorage`'a otomatik kaydetme.
2. **`CartProvider`** — `layout.tsx`'e eklendi, tüm sayfalarda sepete
   erişim sağlıyor.
3. **`AddToCartButton`** — ürün detay sayfasındaki pasif buton yerine
   geldi; stok kontrolü yapıyor, sepette zaten o üründen ne kadar
   olduğunu biliyor.
4. **`CartIndicator`** — navbar'da sepetteki toplam ürün sayısını
   gösteren rozet.
5. **`/sepet`** — sepet sayfası: miktar artır/azalt, ürün silme, toplam
   tutar, boş sepet durumu, "Ödemeye Geç" butonu (Gün 6'ya kadar pasif).
6. **Uçtan uca test** — ekleme, miktar artırma, sayfa yenileme sonrası
   kalıcılık, silme ve boş durum tek tek tarayıcıda denendi.

## Teknik kararların gerekçeleri

**Neden sepet veritabanında değil, `localStorage`'da tutuluyor?**
İki seçenek vardı: (1) veritabanında kullanıcıya bağlı bir sepet, (2)
tarayıcıda saklanan bir sepet. Veritabanı seçeneği, sepete bir şey
eklemek için önce giriş yapmayı zorunlu kılardı — çoğu gerçek mağaza
sitesi (örn. Trendyol, Amazon) giriş yapmadan da sepete ekleme izni
verir, "önce sepete at, sonra öde" akışı daha doğal. `localStorage`
bunu tek başına çözüyor: sepet tarayıcıda kalıyor, sayfa yenilense bile
kayboluyor, sadece ödeme aşamasında (Gün 6) giriş zorunlu olacak.

**Neden hydration (sunucu/istemci render uyuşmazlığı) sorunu var, nasıl
çözüldü?**
`localStorage` sadece tarayıcıda var, Next.js'in sunucu tarafı render'ında
yok. Eğer state'i doğrudan `localStorage`'dan başlatsaydım, sunucunun
ürettiği HTML ("sepet boş") ile tarayıcının ilk render'ı ("sepette 3
ürün var") birbirini tutmaz, React "hydration mismatch" hatası verirdi.
Çözüm: state her zaman boş dizi ile başlıyor (sunucu ve istemci aynı),
gerçek veri sadece bileşen tarayıcıda "mount" olduktan sonra
(`useEffect` içinde) okunuyor. Bu, React'te sık karşılaşılan, öğrenmeye
değer bir örüntü.

**Neden miktar, üründeki stok sayısını geçemiyor?**
`updateQuantity` ve `addItem` fonksiyonları her zaman
`Math.min(istenen, stok)` uyguluyor. Aksi halde kullanıcı depoda
olmayan bir miktarı sepete koyup ödeme sayfasına kadar taşıyabilirdi —
bunu en baştan, sepet seviyesinde engelledik.

## Sonraki adım (Gün 6)

Checkout akışı: teslimat adresi formu, mock ödeme, sipariş oluşturma
(`Order` modeli zaten Gün 1'de hazırdı), sipariş geçmişi sayfası.
