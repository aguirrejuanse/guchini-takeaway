"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { branchById, productById } from "@/lib/data";
import { formatARS } from "@/lib/format";
import { unitDiscount, useStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";

export default function CarritoPage() {
  const { branch } = useParams<{ branch: string }>();
  const router = useRouter();
  const hydrated = useHydrated();
  const items = useStore((s) => s.cart.items);
  const cartBranch = useStore((s) => s.cart.branchId);
  const promos = useStore((s) => s.promos);
  const setQty = useStore((s) => s.setQty);
  const track = useStore((s) => s.track);

  useEffect(() => {
    track("cart_viewed");
  }, [track]);

  useEffect(() => {
    if (hydrated && (cartBranch !== branch || items.length === 0)) {
      router.replace(`/pedir/${branch}`);
    }
  }, [hydrated, cartBranch, branch, items.length, router]);

  const b = branchById(branch);
  const subtotal = items.reduce(
    (a, i) => a + productById(i.productId).price * i.qty,
    0,
  );
  const discount = items.reduce(
    (a, i) => a + unitDiscount(promos, i.productId, branch) * i.qty,
    0,
  );

  if (!hydrated || items.length === 0) {
    return <main className="mx-auto max-w-2xl px-4 pb-16" />;
  }

  return (
    <main className="mx-auto max-w-2xl px-4 pb-16">
      <Link
        href={`/pedir/${branch}`}
        className="mt-8 inline-block text-sm font-semibold text-cocoa hover:text-ink"
      >
        ← Seguir pidiendo
      </Link>
      <h1 className="mt-3 font-display text-3xl uppercase tracking-widest">
        Tu pedido
      </h1>
      <p className="text-sm font-medium text-cocoa">Retirás en {b.name}</p>

      <div className="mt-6 space-y-3">
        {items.map((i, idx) => {
          const p = productById(i.productId);
          const d = unitDiscount(promos, i.productId, branch);
          return (
            <div
              key={i.productId}
              className="flex animate-fade-up items-center justify-between rounded-xl bg-paper p-4 shadow-sm"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div>
                <p className="font-display uppercase tracking-wide">{p.name}</p>
                <p className="text-sm font-medium text-cocoa">
                  {formatARS(p.price - d)} c/u
                  {d > 0 ? (
                    <span className="ml-2 rounded bg-tomato px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                      Promo
                    </span>
                  ) : null}
                </p>
              </div>
              <div className="flex items-center gap-1 rounded-full border border-ink/15 bg-white px-1 py-0.5 shadow-sm">
                <button
                  onClick={() => setQty(i.productId, i.qty - 1)}
                  className="h-7 w-7 rounded-full font-bold hover:bg-cream"
                >
                  −
                </button>
                <span className="w-5 text-center text-sm font-bold">
                  {i.qty}
                </span>
                <button
                  onClick={() => setQty(i.productId, i.qty + 1)}
                  className="h-7 w-7 rounded-full font-bold hover:bg-cream"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl bg-paper p-5 shadow-sm">
        <div className="flex justify-between text-sm font-medium text-cocoa">
          <span>Subtotal</span>
          <span>{formatARS(subtotal)}</span>
        </div>
        {discount > 0 ? (
          <div className="mt-1.5 flex justify-between text-sm font-semibold text-guchi">
            <span>Descuentos</span>
            <span>−{formatARS(discount)}</span>
          </div>
        ) : null}
        <div className="mt-3 flex justify-between border-t border-ink/10 pt-3 font-display text-xl tracking-wide">
          <span>TOTAL</span>
          <span className="text-mango">{formatARS(subtotal - discount)}</span>
        </div>
      </div>

      <Link
        href={`/pedir/${branch}/checkout`}
        className="mt-6 block rounded-lg bg-sun py-3.5 text-center text-sm font-semibold uppercase tracking-widest text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
      >
        Continuar al pago
      </Link>
    </main>
  );
}
