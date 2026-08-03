const pool = require("../db");

async function tumGorevleriGetir(req, res, next) {
  try {
    const sonuc = await pool.query('SELECT * FROM "Gorev" ORDER BY id ASC');
    res.json(sonuc.rows);
  } catch (hata) {
    next(hata);
  }
}

async function gorevEkle(req, res, next) {
  try {
    const baslik = req.body.baslik;

    if (!baslik || baslik.trim() === "") {
      return res.status(400).json({ hata: "Görev başlığı boş olamaz." });
    }

    const sonuc = await pool.query(
      'INSERT INTO "Gorev" (baslik) VALUES ($1) RETURNING *',
      [baslik]
    );

    res.status(201).json(sonuc.rows[0]);
  } catch (hata) {
    next(hata);
  }
}

async function gorevGuncelle(req, res, next) {
  try {
    const id = Number(req.params.id);

    const mevcutGorev = await pool.query('SELECT * FROM "Gorev" WHERE id = $1', [id]);
    if (mevcutGorev.rows.length === 0) {
      return res.status(404).json({ hata: "Görev bulunamadı." });
    }

    const eskiGorev = mevcutGorev.rows[0];
    const yeniBaslik = req.body.baslik !== undefined ? req.body.baslik : eskiGorev.baslik;
    const yeniTamamlandi = req.body.tamamlandi !== undefined ? req.body.tamamlandi : eskiGorev.tamamlandi;

    const sonuc = await pool.query(
      'UPDATE "Gorev" SET baslik = $1, tamamlandi = $2 WHERE id = $3 RETURNING *',
      [yeniBaslik, yeniTamamlandi, id]
    );

    res.json(sonuc.rows[0]);
  } catch (hata) {
    next(hata);
  }
}

async function gorevSil(req, res, next) {
  try {
    const id = Number(req.params.id);

    const mevcutGorev = await pool.query('SELECT * FROM "Gorev" WHERE id = $1', [id]);
    if (mevcutGorev.rows.length === 0) {
      return res.status(404).json({ hata: "Görev bulunamadı." });
    }

    await pool.query('DELETE FROM "Gorev" WHERE id = $1', [id]);

    res.status(204).send();
  } catch (hata) {
    next(hata);
  }
}

module.exports = {
  tumGorevleriGetir,
  gorevEkle,
  gorevGuncelle,
  gorevSil
};