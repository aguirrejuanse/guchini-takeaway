"use client";

import Link from "next/link";
import { formatARS } from "@/lib/format";
import { productById } from "@/lib/data";
import { unitDiscount, useStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";

export function CartBar({ branchId }: { branchId: string }) {
  const hydrated = useHydrated();
  const items = useStore((s) => s.cart.items);
  const cartBranch = useStore((s) => s.cart.branchId);
  const promos = useStore((s) => s.promos);

  if (!hydrated || cartBranch !== branchId || items.length === 0) return null;

  const count = items.reduce((a, i) => a + i.qty, 0);
  const total = items.reduce(
    (a, i) =>
      a +
      (productById(i.productId).price -
        unitDiscount(promos, i.productId, branchId)) *
        i.qty,
    0,
  );

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 p-4">
      <Link
        href={`/pedir/${branchId}/carrito`}
        className="mx-auto flex max-w-md items-center justify-between rounded-lg bg-guchi px-5 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-xl transition-all hover:-translate-y-0.5"
      >
        <span>Ver pedido · {count}</span>
        <span className="font-display text-base normal-case tracking-wide">
          {formatARS(total)}
        </span>
      </Link>
    </div>
  );
}
