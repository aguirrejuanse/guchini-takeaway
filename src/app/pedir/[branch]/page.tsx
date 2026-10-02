"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { CartBar } from "@/components/cart-bar";
import { ProductCard } from "@/components/product-card";
import { branchById, PRODUCTS } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function MenuPage() {
  const { branch } = useParams<{ branch: string }>();
  const b = branchById(branch);
  const setBranch = useStore((s) => s.setBranch);
  const setQty = useStore((s) => s.setQty);
  const preselect = useStore((s) => s.preselect);
  const setPreselect = useStore((s) => s.setPreselect);
  const stock = useStore((s) => s.stock[branch]);
  const track = useStore((s) => s.track);

  useEffect(() => {
    setBranch(branch);
    if (preselect) {
      const available = (stock?.[preselect] ?? 0) > 0;
      if (available) setQty(preselect, 1);
      setPreselect(null);
    }
    track("menu_viewed");
  }, [branch, setBranch, setQty, preselect, setPreselect, stock, track]);

  const sanguches = PRODUCTS.filter((p) => p.category === "sanguche");
  const combos = PRODUCTS.filter((p) => p.category === "combo");
  const extras = PRODUCTS.filter((p) => p.category === "extra");
  const bebidas = PRODUCTS.filter((p) => p.category === "bebida");

  const sections = [
    { title: "Sanguchinis", items: sanguches, grid: false },
    { title: "Combos y extras", items: [...combos, ...extras], grid: true },
    { title: "Bebidas", items: bebidas, grid: true },
  ];

  return (
    <main className="mx-auto max-w-2xl px-4 pb-28">
      <header className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-tomato">
          Retirás en
        </p>
        <h1 className="mt-1 font-display text-3xl uppercase tracking-widest">
          {b.name}
        </h1>
        <p className="mt-1 text-sm font-medium text-cocoa">
          {b.address} · {b.hours}
        </p>
      </header>

      {sections.map((section) => (
        <section key={section.title} className="mt-8 space-y-4">
          <h2 className="font-display text-xl uppercase tracking-wider">
            {section.title}
          </h2>
          <div
            className={
              section.grid ? "grid grid-cols-1 gap-4 sm:grid-cols-2" : "space-y-4"
            }
          >
            {section.items.map((p, i) => (
              <ProductCard key={p.id} product={p} branchId={branch} index={i} />
            ))}
          </div>
        </section>
      ))}

      <CartBar branchId={branch} />
    </main>
  );
}
