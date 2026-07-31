const express = require("express");
const app = express();
app.use(express.json());
const gorevRoutes = require("./routes/gorevRoutes");

const port = 3001;
app.use(function (req, res, next) {
  console.log(req.method + " isteği geldi: " + req.url);
  next();
});
app.use("/api/gorevler", gorevRoutes);

app.listen(port, function () {
  console.log("Sunucu " + port + " portunda çalışıyor");
});