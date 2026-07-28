"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [filmler, setFilmler] = useState([]);
  const [aramaMetni, setAramaMetni] = useState("");

  useEffect(function () {
    async function filmleriCek() {
      const apiKey = "e502a3e38116e20db08d66f4123c4961";

      let adres;
      if (aramaMetni === "") {
        adres = "https://api.themoviedb.org/3/movie/popular?api_key=" + apiKey + "&language=tr-TR";
      } else {
        adres = "https://api.themoviedb.org/3/search/movie?api_key=" + apiKey + "&language=tr-TR&query=" + aramaMetni;
      }

      const cevap = await fetch(adres);
      const veri = await cevap.json();
      setFilmler(veri.results);
    }
    filmleriCek();
  }, [aramaMetni]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Popüler Filmler</h1>

      <input
        type="text"
        value={aramaMetni}
        onChange={function (event) { setAramaMetni(event.target.value); }}
        placeholder="Film ara..."
        className="border border-gray-300 rounded px-3 py-2 mb-6 w-64"
      />

      <div className="flex flex-wrap gap-4">
        {filmler.map(function (film) {
          return (
            <a
              key={film.id}
              href={"/film/" + film.id}
              className="bg-white rounded shadow p-3 w-40 block hover:shadow-lg transition"
            >
              <img
                src={"https://image.tmdb.org/t/p/w200" + film.poster_path}
                alt={film.title}
                className="w-full rounded mb-2"
              />
              <p className="text-sm font-medium">{film.title}</p>
            </a>
          );
        })}
      </div>
    </div>
  );
}