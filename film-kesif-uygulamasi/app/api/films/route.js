export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const aramaMetni = searchParams.get("q") || "";

  const apiKey = process.env.TMDB_API_KEY;

  let adres;
  if (aramaMetni === "") {
    adres = "https://api.themoviedb.org/3/movie/popular?api_key=" + apiKey + "&language=tr-TR";
  } else {
    adres = "https://api.themoviedb.org/3/search/movie?api_key=" + apiKey + "&language=tr-TR&query=" + aramaMetni;
  }

  const cevap = await fetch(adres);
  const veri = await cevap.json();

  return Response.json(veri);
}