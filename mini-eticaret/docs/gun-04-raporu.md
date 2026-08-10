# Gün 4 Raporu — Mağaza Vitrini

**Tarih:** 2026-08-18
**Proje:** Mini E-Ticaret (staj final projesi)

## Bugünün hedefi

Müşterinin gerçekten göreceği ilk sayfaları kurmak: ürün listeleme,
kategoriye göre filtreleme, arama ve ürün detay sayfası. Roadmap bu günde
özellikle tasarım kalitesinin öne çıkmasını istiyor.

## Yapılanlar

1. **`ProductCard`** — ürün kartı bileşeni. Görsel yoksa kırık resim
   ikonu yerine markanın rengiyle uyumlu, ürünün ilk harfini gösteren bir
   yer tutucu var.
2. **`ProductFilters`** — kategori butonları ve arama kutusu. Bilerek
   JavaScript'siz: kategoriler düz `<Link>`, arama düz bir GET formu.
   İkisi de URL'i değiştirip sayfayı sunucudan yeniden getiriyor.
3. **`/urunler`** — ürün listesi, `?category=` ve `?q=` URL parametreleriyle
   filtreleniyor, boş sonuç durumu var.
4. **`/urunler/[slug]`** — ürün detay sayfası: görsel, açıklama, fiyat,
   stok durumu (yeşil/kırmızı), "Sepete Ekle" butonu (Gün 5'e kadar pasif,
   nedeni sayfada açıkça yazıyor).
5. **`loading.tsx`** dosyaları — hem liste hem detay sayfası için iskelet
   (skeleton) yükleme ekranları.
6. **`error.tsx`** — ürünler yüklenirken bir hata olursa "Tekrar Dene"
   butonlu bir hata ekranı.
7. **`not-found.tsx`** — Next.js'in varsayılan İngilizce 404 sayfası
   yerine, sitenin tasarımına uygun Türkçe bir 404 sayfası.
8. **Test verisi** — "Giyim" kategorisi ve iki ürün daha eklenerek
   filtre/arama gerçek verilerle test edildi.
9. **Uçtan uca test** — kategori filtresi, arama, boş sonuç durumu,
   ürün detayı ve 404 sayfası tarayıcıda tek tek denendi.

## Teknik kararların gerekçeleri

**Neden filtre/arama için client-side JavaScript (useState, onChange)
kullanmadım?**
Bu basit bir filtreleme — URL'i değiştirip sayfayı sunucudan yeniden
istemek, hem daha az kod hem de tarayıcı geçmişinde (geri/ileri
tuşlarıyla) doğru çalışıyor. Gerçek bir "anlık, sayfa yenilenmeden filtre"
deneyimi isteseydik client component + `useRouter` gerekirdi, ama bunun
getirdiği karmaşıklık bu aşamada gereksiz.

**Neden ürün görselleri `next/image` değil düz `<img>`?**
`next/image`, optimize edeceği görsellerin domain'lerinin
`next.config.ts`'te önceden tanımlanmasını istiyor. Admin panelinden
şu an herhangi bir siteden görsel URL'i girilebiliyor (sabit bir domain
yok) — bu yüzden düz `<img>` kullandım. Gün 8'de görseller AWS S3'e
taşınınca, tek bir sabit domain (S3 bucket adresi) olacağı için o zaman
`next/image`'e geçmek hem mümkün hem mantıklı olacak.

**Neden "Sepete Ekle" butonu şimdiden var ama pasif?**
Kullanıcının ürün sayfasında ne bekleyeceğini görmesi için — tamamen
eksik olsaydı sayfa "bitmemiş" görünürdü. Buton var, stok yoksa zaten
otomatik pasifleşiyor, altında ne zaman aktif olacağı yazıyor.

## Sonraki adım (Gün 5)

Sepet sistemi: "Sepete Ekle" butonunu gerçek işleve kavuşturmak, sepet
sayfası, miktar güncelleme, toplam tutar hesaplama.
