let gorevler = [
  { id: 1, baslik: "Ödev tamamla", tamamlandi: false },
  { id: 2, baslik: "Market alışverişi", tamamlandi: true }
];

function tumGorevleriGetir(req, res) {
  res.json(gorevler);
}

function gorevEkle(req, res) {
  const baslik = req.body.baslik;

  if (!baslik || baslik.trim() === "") {
    return res.status(400).json({ hata: "Görev başlığı boş olamaz." });
  }

  const yeniGorev = {
    id: Date.now(),
    baslik: baslik,
    tamamlandi: false
  };

  gorevler.push(yeniGorev);
  res.status(201).json(yeniGorev);
}

module.exports = {
  tumGorevleriGetir,
  gorevEkle
};