# Gün 6 Raporu — Checkout, Mock Ödeme, Sipariş Geçmişi

**Tarih:** 2026-08-18
**Proje:** Mini E-Ticaret (staj final projesi)

## Bugünün hedefi

Sepetten gerçek bir siparişe geçmek: teslimat adresi formu, "mock" (sahte)
ödeme onayı, siparişin veritabanına kaydedilmesi, stokun düşmesi ve
kullanıcının kendi sipariş geçmişini görebilmesi.

## Yapılanlar

1. **`proxy.ts`** — `/odeme` (checkout) sayfası da artık `/hesabim` gibi
   giriş gerektiriyor.
2. **`checkoutSchema`** — teslimat adresi ve sepet kalemleri için Zod
   şeması.
3. **`POST /api/orders`** — sipariş oluşturma uç noktası. Detaylar
   aşağıda.
4. **`/odeme`** — adres formu + sepet özeti + "Siparişi Onayla" butonu.
   Gerçek bir ödeme sağlayıcısı yok, bilerek "mock" — buton basılır
   basılmaz sipariş "ödendi" kabul ediliyor.
5. **`/hesabim/siparisler`** — kullanıcının geçmiş siparişlerinin listesi.
6. **`/hesabim/siparisler/[id]`** — tek bir siparişin detayı (ürünler,
   toplam, teslimat adresi). Ödeme başarılı olunca da bu sayfaya
   yönlendiriliyor, yani hem "sipariş onay sayfası" hem "geçmiş" aynı
   sayfa.
7. **Uçtan uca test** — sepete 2 farklı üründen ekleyip gerçekten sipariş
   verdim: sipariş oluştu, sepet otomatik boşaldı, ürün stokları
   veritabanında gerçekten düştü (60→58, 15→14), sipariş geçmişinde ve
   detay sayfasında doğru bilgilerle göründü.

## `POST /api/orders` içindeki iki önemli güvenlik/doğruluk kararı

**1. Fiyatı asla istemciden gelen veriden almıyoruz.**
Tarayıcıdaki sepet verisi (fiyat dahil) DevTools üzerinden kolayca
değiştirilebilir — biri ürünü ₺1 gibi göstererek sipariş verebilir. Bu
yüzden istemciden sadece `productId` ve `quantity` alıyoruz; fiyatı her
zaman o an veritabanından okuyoruz ve toplamı sunucuda yeniden
hesaplıyoruz.

**2. Stok düşürme "atomik" yapılıyor, tam bir transaction değil.**
Her ürün için `findOneAndUpdate({_id, stock: {$gte: quantity}}, {$inc:
{stock: -quantity}})` kullandım — bu, "stok yeterliyse düş" işlemini tek
bir veritabanı komutunda yapıyor. Bunun önemi: iki kullanıcı aynı anda
son ürünü satın almaya çalışırsa, ikisi de "stok var" kontrolünü ayrı
ayrı yapıp ikisi de siparişi tamamlarsa stok eksiye düşebilir (race
condition). Bu yöntem bunu engelliyor — sadece biri başarılı olur.

Sepette birden fazla ürün varsa ve ortadaki bir ürün stok yetersizliğinden
başarısız olursa, o ana kadar düşülen stokları geri ekleyip hata
döndürüyorum. Bu, gerçek bir veritabanı "transaction"ı (ACID) kadar sağlam
değil — MongoDB Atlas'ta transaction desteği var ama bu projenin
ölçeğinde eklemek gereksiz karmaşıklık olurdu. Raporda bunu bilerek bir
sınırlama olarak not ediyorum; production bir sistemde transaction
kullanılırdı.

## Diğer kararların gerekçeleri

**Neden sipariş onay sayfası ile sipariş geçmişi detay sayfası aynı?**
Ayrı bir "teşekkürler" sayfası yapmak yerine, ödeme başarılı olunca
doğrudan `/hesabim/siparisler/[id]`'e yönlendiriyoruz. Kullanıcı zaten
az sonra "siparişlerim" sayfasında aynı bilgiyi görecek — aynı bileşeni
iki kere yazmaya gerek yok.

**Neden sipariş detay sorgusu `Order.findOne({_id: id, user: user._id})`
şeklinde, önce çekip sonra kontrol etmiyor?**
Biri tarayıcı adres çubuğuna başka bir kullanıcının sipariş ID'sini
yazarsa, bu sorgu hiçbir şey döndürmüyor (kendi siparişi değilse), sayfa
404 gösteriyor. Filtreyi sorgunun kendisine koymak, "yetkisiz erişim"
sınıfındaki güvenlik açıklarını (IDOR) daha en baştan imkânsız
kılıyor.

## Sonraki adım (Gün 7)

Admin panelini tamamlama (sipariş yönetimi eklenecek), responsive
düzenlemeler, kalan hata/loading durumları.
