"use client";

import Image from "next/image";
import type { Product } from "@/lib/data";
import { formatARS } from "@/lib/format";
import { useHydrated } from "@/lib/use-hydrated";
import { promoFor, useStore } from "@/lib/store";

export function ProductCard({
  product,
  branchId,
  index = 0,
}: {
  product: Product;
  branchId: string;
  index?: number;
}) {
  const hydrated = useHydrated();
  const stock = useStore((s) => s.stock[branchId]?.[product.id] ?? 0);
  const active = useStore((s) => s.productActive[product.id] ?? true);
  const qty = useStore(
    (s) => s.cart.items.find((i) => i.productId === product.id)?.qty ?? 0,
  );
  const promos = useStore((s) => s.promos);
  const setQty = useStore((s) => s.setQty);

  const promo = promoFor(promos, product.id, branchId);
  const discount = promo
    ? promo.percentOff > 0
      ? Math.round((product.price * promo.percentOff) / 100)
      : promo.fixedOff
    : 0;
  const soldOut = hydrated && stock <= 0;
  const disabled = soldOut || !active;

  return (
    <div
      className={`group animate-fade-up overflow-hidden rounded-2xl bg-paper shadow-sm transition-all duration-300 ${
        disabled ? "opacity-70" : "hover:-translate-y-1 hover:shadow-xl"
      }`}
      style={{ animationDelay: `${Math.min(index, 10) * 70}ms` }}
    >
      <div className="relative h-44 w-full overflow-hidden bg-cream">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
              soldOut ? "grayscale" : ""
            }`}
            sizes="(max-width: 640px) 100vw, 400px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-6xl">
            {product.emoji}
          </div>
        )}
        {promo && !soldOut ? (
          <span className="absolute left-3 top-3 rounded-md bg-tomato px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-md">
            {promo.percentOff > 0
              ? `${promo.percentOff}% off`
              : `$${promo.fixedOff.toLocaleString("es-AR")} off`}
          </span>
        ) : null}
        {soldOut ? (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/40">
            <span className="font-display text-2xl uppercase tracking-widest text-white">
              Agotado
            </span>
          </div>
        ) : null}
      </div>

      <div className="p-4">
        <h3 className="font-display text-lg uppercase tracking-wide">
          {product.name}
        </h3>
        <p className="mt-1 text-sm leading-snug text-cocoa">
          {product.description}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {product.bread ? (
            <span className="rounded-md bg-sun/15 px-1.5 py-0.5 font-serif text-xs italic text-mango">
              Pan: {product.bread}
            </span>
          ) : null}
          {product.tags?.map((t) => (
            <span
              key={t}
              className="rounded-md bg-pinki/20 px-1.5 py-0.5 text-[11px] font-semibold text-ink"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div>
            {discount > 0 ? (
              <span className="mr-2 text-sm font-semibold text-cocoa line-through">
                {formatARS(product.price)}
              </span>
            ) : null}
            <span className="text-lg font-bold text-mango">
              {formatARS(product.price - discount)}
            </span>
            {hydrated && !soldOut && stock <= 5 ? (
              <p className="text-[11px] font-semibold text-tomato">
                ¡Quedan {stock}!
              </p>
            ) : null}
          </div>

          {disabled ? (
            <span className="rounded-lg bg-cream px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-cocoa">
              Agotado
            </span>
          ) : qty === 0 ? (
            <button
              onClick={() => setQty(product.id, 1)}
              className="rounded-lg bg-sun px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
            >
              Agregar
            </button>
          ) : (
            <div className="flex items-center gap-1 rounded-full border border-ink/15 bg-white px-1 py-0.5 shadow-sm">
              <button
                onClick={() => setQty(product.id, qty - 1)}
                className="h-7 w-7 rounded-full font-bold transition-colors hover:bg-cream"
              >
                −
              </button>
              <span className="w-5 text-center text-sm font-bold">{qty}</span>
              <button
                onClick={() => setQty(product.id, qty + 1)}
                disabled={qty >= stock}
                className="h-7 w-7 rounded-full font-bold transition-colors hover:bg-cream disabled:opacity-30"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
