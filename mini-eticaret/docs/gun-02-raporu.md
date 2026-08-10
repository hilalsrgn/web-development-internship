# Gün 2 Raporu — MongoDB Atlas, Kayıt/Giriş ve JWT

**Tarih:** 2026-08-18
**Proje:** Mini E-Ticaret (staj final projesi)

## Bugünün hedefi

Gün 1'de hazırlanan iskeletin üzerine gerçek bir kimlik doğrulama (authentication)
sistemi kurmak: kullanıcılar kayıt olabilsin, giriş yapabilsin, şifreleri güvenli
şekilde saklansın, oturumları JWT ile yönetilsin ve bazı sayfalar sadece giriş
yapmış (ya da admin) kullanıcılara açık olsun.

## Yapılanlar

1. **MongoDB Atlas kurulumu** — ücretsiz M0 cluster (AWS, Frankfurt bölgesi)
   oluşturuldu, veritabanı kullanıcısı ve bağlantı adresi alındı.
2. **`lib/validations.ts`** — Zod ile kayıt ve giriş formları için doğrulama
   şemaları.
3. **`lib/jwt.ts`** — token üretme (`signToken`) ve doğrulama (`verifyToken`)
   fonksiyonları.
4. **`lib/auth.ts`** — şifre hashleme/karşılaştırma (`bcryptjs`) ve
   `getCurrentUser()` (cookie'deki token'dan giriş yapmış kullanıcıyı bulma).
5. **API route'ları** — `/api/auth/register`, `/api/auth/login`,
   `/api/auth/logout`, `/api/auth/me`.
6. **`src/proxy.ts`** — `/admin` ve `/hesabim` altındaki sayfaları koruyor;
   giriş yapılmamışsa `/giris`'e, admin olmayan biri `/admin`'e girmeye
   çalışırsa ana sayfaya yönlendiriyor.
7. **Kayıt/giriş sayfaları** (`/kayit`, `/giris`) — loading ve hata
   durumlarını gösteren formlar.
8. **Navbar güncellemesi** — giriş yapmış kullanıcı için isim + "Çıkış Yap",
   yapmamış kullanıcı için "Giriş Yap" / "Kayıt Ol" gösteriyor.
9. **Uçtan uca test** — tarayıcıda gerçek kayıt, giriş, çıkış ve route
   koruması denendi, hepsi doğrulandı.

## Karşılaşılan sorun ve çözümü (raporun en önemli kısmı)

İlk register denemesinde şu hatayı aldım:

```
Error: querySrv ECONNREFUSED _mongodb._tcp.cluster0.auizyye.mongodb.net
```

**Sorunun kaynağı ne?** `mongodb+srv://` ile başlayan bağlantı adresleri,
gerçek sunucuların adreslerini bulmak için özel bir DNS sorgusu (SRV kaydı)
yapıyor. `nslookup` ile test ettiğimde bu sorgunun işletim sistemi
seviyesinde sorunsuz çalıştığını gördüm — yani genel internet bağlantısı
sorunlu değildi. Sorun, Node.js'in kendi iç DNS çözücüsünün (c-ares) bu
sorguyu Windows'ta düzgün yönlendirememesiydi.

**Çözüm:** `src/lib/db.ts` içinde, bağlantı kurulmadan önce Node'a özellikle
Google'ın herkese açık DNS sunucusunu kullanmasını söyledim:

```ts
import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
```

Bu, bilgisayarın genel ağ ayarlarını değiştirmiyor — sadece bu Node.js
sürecinin DNS sorgularını etkiliyor.

**Bu arada ikinci bir hata daha buldum:** `connectDB()` fonksiyonu, bağlantı
denemesi başarısız olduğunda hatayı önbellekte (`cache.promise`) sonsuza
kadar saklıyordu. Yani DNS sorunu çözülse bile, aynı başarısız Promise
tekrar tekrar döndürülüyor ve hiçbir zaman yeniden denenmiyordu. Bunu da
düzelttim: hata durumunda önbellek temizleniyor, böylece bir sonraki
istek gerçekten yeniden dener.

Bu, staj raporunda anlatmaya değer bir bölüm — sadece "bağlandı" demek
yerine, hatayı nasıl teşhis ettiğimi (nslookup ile DNS'i izole ettim),
kod tarafında mı yoksa ağ tarafında mı olduğunu nasıl ayırt ettiğimi ve
iki farklı sorunu (DNS + önbellek) nasıl bulduğumu gösteriyor.

**Ek not (aynı gün, VS Code'da kendi ortamımda test ederken):** `dns.setServers`
düzeltmesi bazı denemelerde çalıştı, bazılarında yine aynı
`querySrv ECONNREFUSED` hatasını verdi — yani SRV DNS sorgusu bu ağda
*aralıklı* olarak başarısız oluyormuş, sabit değil. Kalıcı çözüm için
SRV sorgusuna hiç ihtiyaç duymayan bir bağlantı adresi formatına geçtim:
`mongodb+srv://cluster0...` yerine, sunucuların gerçek adreslerini
(`ac-jrqvilr-shard-00-00/01/02.auizyye.mongodb.net:27017`) ve replica
set adını (`atlas-o4r59m-shard-0`) açıkça yazan `mongodb://` formatı.
Bu bilgileri `nslookup -type=SRV` ve `nslookup -type=TXT` ile Atlas'ın
DNS kayıtlarından elle bulup çıkardım. Bu format 3/3 denemede kesintisiz
çalıştı — "bazen çalışan" bir düzeltmeyle yetinmek yerine, sorunun
kaynağını (aralıklı SRV/DNS engeli) tamamen ortadan kaldıran bir çözüm
tercih ettim.

## Teknik kararların gerekçeleri

**Neden şifre hash'i `select: false`?**
`User` modelinde `password` alanı varsayılan sorgularda gelmiyor
(`src/models/User.ts`). Yanlışlıkla bir API route'unun kullanıcı listesini
şifre hash'iyle birlikte döndürmesini imkânsız hale getiriyor — güvenlik
açığını kod seviyesinde engelliyoruz.

**Neden login'de "e-posta veya şifre hatalı" (aynı mesaj)?**
Kullanıcı bulunamadıysa ile şifre yanlışsa farklı mesaj gösterirsek,
saldırgan bu mesajlardan hangi e-postaların sistemde kayıtlı olduğunu
öğrenebilir (user enumeration). Aynı mesajı kullanmak bunu engelliyor.

**Neden JWT `httpOnly` cookie'de saklanıyor, `localStorage`'da değil?**
`localStorage`'a yazılan bir token, sayfaya sızan herhangi bir XSS
(zararlı script) saldırısıyla kolayca çalınabilir. `httpOnly` cookie
JavaScript'ten hiç okunamıyor, bu riski ortadan kaldırıyor.

## Sonraki adım (Gün 3)

Ürün ve kategori CRUD API'leri, admin paneli.
