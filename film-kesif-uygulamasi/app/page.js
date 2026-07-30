"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [filmler, setFilmler] = useState([]);
  const [aramaMetni, setAramaMetni] = useState("");
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState(null);

  useEffect(function () {
    async function filmleriCek() {
      setYukleniyor(true);
      setHata(null);

      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

        let adres;
        if (aramaMetni === "") {
          adres = "https://api.themoviedb.org/3/movie/popular?api_key=" + apiKey + "&language=tr-TR";
        } else {
          adres = "https://api.themoviedb.org/3/search/movie?api_key=" + apiKey + "&language=tr-TR&query=" + aramaMetni;
        }

        const cevap = await fetch(adres);

        if (!cevap.ok) {
          throw new Error("Filmler yüklenirken bir sorun oluştu.");
        }

        const veri = await cevap.json();
        setFilmler(veri.results);
      } catch (hataDetayi) {
        setHata(hataDetayi.message);
      } finally {
        setYukleniyor(false);
      }
    }
    filmleriCek();
  }, [aramaMetni]);

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-8">
      <h1 className="text-3xl font-bold mb-4 text-red-600">FilmKeşif</h1>

      {hata !== null && (
        <p className="text-red-500 mb-4">{hata}</p>
      )}

      <input
        type="text"
        value={aramaMetni}
        onChange={function (event) { setAramaMetni(event.target.value); }}
        placeholder="Film ara..."
        className="border border-neutral-700 bg-neutral-800 text-neutral-100 rounded px-3 py-2 mb-6 w-64 placeholder-neutral-500 focus:outline-none focus:border-red-600"
      />

      {yukleniyor ? (
        <p className="text-neutral-400">Yükleniyor...</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {filmler.map(function (film) {

            return (
              <a
                key={film.id}
                href={"/film/" + film.id}
                className="bg-neutral-800 rounded p-3 w-40 block hover:scale-105 hover:shadow-lg hover:shadow-red-900/30 transition transform"
              >
                <Image
             src={"https://image.tmdb.org/t/p/w200" + film.poster_path}
             alt={film.title}
             width={200}
             height={300}
             className="w-full rounded mb-2"
/>
                <p className="text-sm font-medium text-neutral-200">{film.title}</p>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}