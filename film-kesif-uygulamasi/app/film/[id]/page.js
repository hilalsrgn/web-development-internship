"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function FilmDetay() {
  const params = useParams();
  const filmId = params.id;

  const [film, setFilm] = useState(null);

  useEffect(function () {
    async function filmGetir() {
      const apiKey = "e502a3e38116e20db08d66f4123c4961";
      const adres = "https://api.themoviedb.org/3/movie/" + filmId + "?api_key=" + apiKey + "&language=tr-TR";

      const cevap = await fetch(adres);
      const veri = await cevap.json();
      setFilm(veri);
    }
    filmGetir();
  }, [filmId]);

  if (film === null) {
    return <p className="p-8">Yükleniyor...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <img
        src={"https://image.tmdb.org/t/p/w300" + film.poster_path}
        alt={film.title}
        className="rounded mb-4 w-64"
      />
      <h1 className="text-3xl font-bold mb-2">{film.title}</h1>
      <p className="text-gray-600 mb-4">{film.release_date}</p>
      <p className="max-w-xl">{film.overview}</p>
    </div>
  );
}