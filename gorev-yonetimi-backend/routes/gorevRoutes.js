const express = require("express");
const router = express.Router();
const gorevController = require("../controllers/gorevController");

router.get("/", gorevController.tumGorevleriGetir);
router.post("/", gorevController.gorevEkle);
router.put("/:id", gorevController.gorevGuncelle);
router.delete("/:id", gorevController.gorevSil);

module.exports = router;