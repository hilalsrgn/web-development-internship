import { LinkButton } from "@/components/ui/Button";

// Tailwind sınıf adlarını derleme zamanında taradığı için burada tam
// string'ler yazıyoruz — `bg-${değişken}` gibi dinamik birleştirme,
// Tailwind bu sınıfı hiç görmediğinden CSS üretilmeden sessizce kaybolur.
const trustSignals = [
  {
    title: "Hızlı Kargo",
    description: "Siparişiniz aynı gün kargoya verilir.",
    className: "col-span-2 rounded-2xl border border-border bg-clay-tint p-6",
  },
  {
    title: "Güvenli Ödeme",
    description: "Kart bilgileriniz uçtan uca korunur.",
    className: "rounded-2xl border border-border bg-paper-raised p-6",
  },
  {
    title: "Kolay İade",
    description: "14 gün içinde koşulsuz iade hakkı.",
    className: "rounded-2xl border border-border bg-paper-raised p-6",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <section className="grid gap-12 py-20 sm:py-28 lg:grid-cols-2 lg:items-center">
        <div>
          <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
            Küçük ama gerçek bir mağaza deneyimi.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-ink-muted">
            İhtiyacınız olan ürünleri güvenle keşfedin, hesabınızla takip
            edin, kolayca sipariş verin.
          </p>
          <div className="mt-8 flex gap-4">
            <LinkButton href="/urunler" variant="primary">
              Ürünlere Göz At
            </LinkButton>
            <LinkButton href="/kayit" variant="secondary">
              Hesap Oluştur
            </LinkButton>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {trustSignals.map((item) => (
            <div key={item.title} className={item.className}>
              <p className="font-display text-lg text-ink">{item.title}</p>
              <p className="mt-2 text-sm text-ink-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
