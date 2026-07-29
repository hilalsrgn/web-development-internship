# 🎬 FilmKeşif

TMDb (The Movie Database) API'sini kullanan, popüler filmleri listeleyen, gerçek zamanlı arama yapabilen ve her film için detaylı bilgi sunan bir film keşif uygulaması.

## 🔗 Canlı Demo

[FilmKeşif'i ziyaret et](https://web-development-internship-two.vercel.app/)


## 🚀 Özellikler

- 🎥 Popüler filmlerin listelenmesi
- 🔍 Gerçek zamanlı, TMDb'nin tüm veritabanında arama
- 📄 Her film için ayrı, dynamic route ile oluşturulan detay sayfası (poster, özet, çıkış tarihi)
- ⏳ Loading ve hata durumu yönetimi
- 🎨 Koyu tema, sinema temalı modern arayüz
- 📱 Responsive tasarım

## 🛠️ Kullanılan Teknolojiler

- Next.js 16 (App Router)
- React (useState, useEffect, useParams)
- Tailwind CSS
- TMDb API

## 📂 Proje Yapısı
## ⚙️ Kurulum ve Çalıştırma

1. Bu depoyu klonlayın
2. `film-kesif-uygulamasi` klasörüne gidin
3. Bağımlılıkları yükleyin: `npm install`
4. Kök dizinde `.env.local` dosyası oluşturup TMDb API anahtarınızı ekleyin:
5. Geliştirme sunucusunu başlatın: `npm run dev`
6. Tarayıcıda `http://localhost:3000` adresini açın

## 🧠 Neler Öğrendim

Bu proje kapsamında şunları uyguladım:
- React component mantığı, JSX, props, state (`useState`)
- `useEffect` ile API entegrasyonu ve yaşam döngüsü yönetimi
- Controlled input ile form yönetimi ve koşullu render
- Next.js App Router ile dosya tabanlı routing
- Dynamic route (`[id]`) ile parametrik sayfa oluşturma
- Server/Client Component ayrımı
- Ortam değişkenleri (environment variables) ile güvenli API key yönetimi
- Vercel üzerinde canlıya alma (deployment)

## 👤 Geliştiren

Hilal Sargın — Web Geliştirme Stajı