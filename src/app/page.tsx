"use client";

import Image from "next/image";
import Link from "next/link";
import { BRANCHES, PRODUCTS, branchById } from "@/lib/data";
import { formatARS } from "@/lib/format";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";

export default function Home() {
  const hydrated = useHydrated();
  const promos = useStore((s) => s.promos);
  const setPreselect = useStore((s) => s.setPreselect);
  const cart = useStore((s) => s.cart);
  const activePromo = promos.find((p) => p.active);

  const cartCount = cart.items.reduce((a, i) => a + i.qty, 0);
  const resume = hydrated && cartCount > 0 && cart.branchId;
  const resumeBranch = cart.branchId ? branchById(cart.branchId) : null;

  return (
    <main>
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
        <Image
          src="/assets/hero-bg.jpg"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-coal/60" />
        <div className="relative z-10 px-4 py-20 text-center">
          <Image
            src="/assets/logo.png"
            alt="Guchini"
            width={560}
            height={210}
            className="mx-auto w-56 animate-fade-up drop-shadow-lg"
            priority
          />
          <h1
            className="mt-6 animate-fade-up font-display text-5xl uppercase tracking-wider text-white md:text-6xl"
            style={{ animationDelay: "150ms" }}
          >
            Un manso sanguche
          </h1>
          <p
            className="mt-3 animate-fade-up font-script text-3xl text-sun"
            style={{ animationDelay: "300ms" }}
          >
            el perfecto equilibrio del fast food y lo gourmet
          </p>
          <div className="animate-fade-up" style={{ animationDelay: "450ms" }}>
            <Link
              href={resume ? `/pedir/${cart.branchId}/carrito` : "/pedir"}
              className="mt-8 inline-block rounded-lg bg-sun px-10 py-3.5 text-sm font-semibold uppercase tracking-widest text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              {resume
                ? `Continuar mi pedido (${cartCount})`
                : "Pedí para retirar"}
            </Link>
            {resume && resumeBranch ? (
              <p className="mt-2 text-xs font-medium text-white/80">
                Tenés un pedido en curso en {resumeBranch.shortName}
              </p>
            ) : null}
          </div>
          <p
            className="mt-4 animate-fade-up text-xs font-medium uppercase tracking-widest text-white/70"
            style={{ animationDelay: "600ms" }}
          >
            Ciudad · Chacras · Uspallata · Nueva Córdoba
          </p>
        </div>
      </section>

      {activePromo ? (
        <section className="bg-sun px-4 py-3 text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-ink">
            ⚡ {activePromo.name} — {activePromo.tagline}
          </p>
        </section>
      ) : null}

      <section className="mx-auto max-w-3xl px-4 py-14">
        <div className="text-center">
          <h2 className="font-display text-3xl uppercase tracking-widest">
            Sanguchinis
          </h2>
          <div className="mx-auto mt-3 h-[3px] w-14 rounded-full bg-tomato" />
          <p className="mx-auto mt-3 max-w-md text-sm text-cocoa">
            Cada sanguche es una obra maestra culinaria.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {PRODUCTS.filter((p) => p.image).map((p) => (
            <Link
              href="/pedir"
              key={p.id}
              onClick={() => setPreselect(p.id)}
              className="group overflow-hidden rounded-xl bg-paper shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-32 w-full overflow-hidden">
                <Image
                  src={p.image!}
                  alt={p.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="200px"
                />
              </div>
              <div className="p-3">
                <p className="font-display text-sm uppercase tracking-wide">
                  {p.name}
                </p>
                <p className="text-sm font-bold text-mango">
                  {formatARS(p.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/pedir"
            className="inline-block rounded-lg border-2 border-ink px-8 py-3 text-sm font-semibold uppercase tracking-widest text-ink transition-all hover:bg-ink hover:text-white"
          >
            Ver el menú completo
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-14">
        <div className="text-center">
          <h2 className="font-display text-3xl uppercase tracking-widest">
            Locales
          </h2>
          <div className="mx-auto mt-3 h-[3px] w-14 rounded-full bg-tomato" />
          <p className="mx-auto mt-3 max-w-md text-sm text-cocoa">
            Elegí el que te quede más cerca y retirá sin fila.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {BRANCHES.map((b) => (
            <article
              key={b.id}
              className="rounded-xl bg-paper p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <h3 className="font-display text-lg uppercase tracking-wide">
                {b.name}
              </h3>
              <p className="mt-1 text-sm font-medium">{b.address}</p>
              <p className="text-xs font-medium text-cocoa">
                {b.addressDetail}
              </p>
              <p className="mt-2 text-xs font-medium text-cocoa">{b.hours}</p>
              {b.cafeHours ? (
                <p className="text-xs font-medium text-cocoa">{b.cafeHours}</p>
              ) : null}
              <div className="mt-4 flex items-center gap-3">
                <Link
                  href={`/pedir/${b.id}`}
                  className="rounded-lg bg-sun px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Pedir acá
                </Link>
                <a
                  href={b.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold uppercase tracking-wider text-cocoa underline-offset-2 transition-colors hover:text-ink hover:underline"
                >
                  Cómo llegar
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-ink/10 py-6 text-center text-xs font-medium text-cocoa">
        Demo de canal propio · guchini.com.ar
      </footer>
    </main>
  );
}
