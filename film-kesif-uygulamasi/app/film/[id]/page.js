"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function FilmDetay() {
  const params = useParams();
  const filmId = params.id;

  const [film, setFilm] = useState(null);
  const [hata, setHata] = useState(null);

  useEffect(function () {
    async function filmGetir() {
      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        const adres = "https://api.themoviedb.org/3/movie/" + filmId + "?api_key=" + apiKey + "&language=tr-TR";

        const cevap = await fetch(adres);

        if (!cevap.ok) {
          throw new Error("Film bilgileri yüklenemedi.");
        }

        const veri = await cevap.json();
        setFilm(veri);
      } catch (hataDetayi) {
        setHata(hataDetayi.message);
      }
    }
    filmGetir();
  }, [filmId]);

  if (hata !== null) {
    return <p className="min-h-screen bg-neutral-900 text-red-500 p-8">{hata}</p>;
  }

  if (film === null) {
    return <p className="min-h-screen bg-neutral-900 text-neutral-400 p-8">Yükleniyor...</p>;
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-8">
      <a href="/" className="text-red-500 hover:underline text-sm mb-4 inline-block">← Geri dön</a>

     <Image
  src={"https://image.tmdb.org/t/p/w300" + film.poster_path}
  alt={film.title}
  width={300}
  height={450}
  className="rounded mb-4 w-64 shadow-lg shadow-black/50"
/>
      <h1 className="text-3xl font-bold mb-2">{film.title}</h1>
      <p className="text-neutral-400 mb-4">{film.release_date}</p>
      <p className="max-w-xl text-neutral-200">{film.overview}</p>
    </div>
  );
}