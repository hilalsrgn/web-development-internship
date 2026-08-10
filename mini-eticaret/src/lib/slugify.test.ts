import { describe, expect, it } from "vitest";
import { slugify } from "./slugify";

describe("slugify", () => {
  it("Türkçe karakterleri İngilizce karşılıklarına çevirir", () => {
    expect(slugify("Kadın Ayakkabı")).toBe("kadin-ayakkabi");
    expect(slugify("Öğrenci Çantası")).toBe("ogrenci-cantasi");
  });

  it("boşlukları tireye çevirir", () => {
    expect(slugify("Kablosuz Kulaklık")).toBe("kablosuz-kulaklik");
  });

  it("birden fazla boşluğu tek tireye indirger", () => {
    expect(slugify("Çok   Boşluklu   İsim")).toBe("cok-bosluklu-isim");
  });

  it("harf ve rakam dışındaki karakterleri kaldırır", () => {
    expect(slugify("Ürün! (Yeni)")).toBe("urun-yeni");
  });

  it("baştaki ve sondaki boşlukları temizler", () => {
    expect(slugify("  Test Ürünü  ")).toBe("test-urunu");
  });
});
