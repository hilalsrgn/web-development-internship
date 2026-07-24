// Görevleri tutan dizi
let gorevler = [];

// Şu an aktif olan filtre
let aktifFiltre = "tumu";

// HTML elementlerini seçiyoruz
const gorevForm = document.getElementById("gorevForm");
const gorevInput = document.getElementById("gorevInput");
const oncelikSelect = document.getElementById("oncelikSelect");
const gorevListesi = document.getElementById("gorevListesi");
const bosMesaj = document.getElementById("bosMesaj");
const sayac = document.getElementById("sayac");

function gorevleriKaydet() {
  localStorage.setItem("gorevler", JSON.stringify(gorevler));
}

function gorevleriYukle() {
  const kayitliVeri = localStorage.getItem("gorevler");
  if (kayitliVeri !== null) {
    gorevler = JSON.parse(kayitliVeri);
  }
}

function gorevleriGoster() {
  gorevListesi.innerHTML = "";

  let gosterilecekGorevler = gorevler;

  if (aktifFiltre === "bekleyen") {
    gosterilecekGorevler = gorevler.filter(function(gorev) {
      return gorev.tamamlandi === false;
    });
  } else if (aktifFiltre === "tamamlanan") {
    gosterilecekGorevler = gorevler.filter(function(gorev) {
      return gorev.tamamlandi === true;
    });
  }

  if (gosterilecekGorevler.length === 0) {
    bosMesaj.classList.remove("hidden");
  } else {
    bosMesaj.classList.add("hidden");
  }

  gosterilecekGorevler.forEach(function(gorev) {
    const li = document.createElement("li");
    li.className = "flex items-center justify-between rounded-xl px-4 py-3 bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition transform";

    const oncelikRenkleri = {
      dusuk: "bg-green-100 text-green-700",
      orta: "bg-yellow-100 text-yellow-700",
      yuksek: "bg-red-100 text-red-700"
    };

    const oncelikEmoji = {
      dusuk: "🟢",
      orta: "🟡",
      yuksek: "🔴"
    };

    li.innerHTML = `
      <div class="flex items-center gap-3">
        <input type="checkbox" ${gorev.tamamlandi ? "checked" : ""} class="tamamla-checkbox w-5 h-5 accent-pink-500" data-id="${gorev.id}">
        <span class="${gorev.tamamlandi ? 'line-through text-gray-400' : 'text-gray-800 font-medium'}">
          ${gorev.metin}
        </span>
        <span class="text-xs font-semibold px-2 py-1 rounded-full ${oncelikRenkleri[gorev.oncelik]}">
          ${oncelikEmoji[gorev.oncelik]} ${gorev.oncelik}
        </span>
      </div>
      <button class="sil-buton text-red-400 hover:text-red-600 hover:underline text-sm transition" data-id="${gorev.id}">Sil</button>
    `;

    gorevListesi.appendChild(li);
  });

  const bekleyenSayisi = gorevler.filter(function(gorev) {
    return gorev.tamamlandi === false;
  }).length;
  sayac.textContent = bekleyenSayisi + " görev kaldı";
}

gorevForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const girilenMetin = gorevInput.value.trim();

  if (girilenMetin === "") {
    return;
  }

  const yeniGorev = {
    id: Date.now(),
    metin: girilenMetin,
    oncelik: oncelikSelect.value,
    tamamlandi: false
  };

  gorevler.push(yeniGorev);

  gorevInput.value = "";

  gorevleriKaydet();
  gorevleriGoster();
});

gorevListesi.addEventListener("click", function(event) {

  if (event.target.classList.contains("sil-buton")) {
    const silinecekId = Number(event.target.dataset.id);
    gorevler = gorevler.filter(function(gorev) {
      return gorev.id !== silinecekId;
    });
    gorevleriKaydet();
    gorevleriGoster();
  }

  if (event.target.classList.contains("tamamla-checkbox")) {
    const tiklananId = Number(event.target.dataset.id);
    gorevler = gorevler.map(function(gorev) {
      if (gorev.id === tiklananId) {
        gorev.tamamlandi = !gorev.tamamlandi;
      }
      return gorev;
    });
    gorevleriKaydet();
    gorevleriGoster();
  }

});

const filtreButonlari = document.querySelectorAll(".filtre-buton");

filtreButonlari.forEach(function(buton) {
  buton.addEventListener("click", function() {
    aktifFiltre = buton.dataset.filtre;

    filtreButonlari.forEach(function(b) {
      b.className = "filtre-buton bg-gray-100 text-gray-600 text-sm px-4 py-1 rounded-full font-medium transition hover:bg-gray-200";
    });
    buton.className = "filtre-buton bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm px-4 py-1 rounded-full font-medium transition";

    gorevleriGoster();
  });
});

gorevleriYukle();
gorevleriGoster();