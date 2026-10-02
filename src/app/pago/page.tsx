"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { productById } from "@/lib/data";
import { formatARS } from "@/lib/format";
import { unitDiscount, useStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";

export default function PagoPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const items = useStore((s) => s.cart.items);
  const branchId = useStore((s) => s.cart.branchId);
  const promos = useStore((s) => s.promos);
  const confirmOrder = useStore((s) => s.confirmOrder);
  const track = useStore((s) => s.track);
  const [phase, setPhase] = useState<"idle" | "processing" | "failed">("idle");

  const subtotal = items.reduce(
    (a, i) => a + productById(i.productId).price * i.qty,
    0,
  );
  const discount = items.reduce(
    (a, i) => a + unitDiscount(promos, i.productId, branchId ?? "") * i.qty,
    0,
  );
  const total = subtotal - discount;

  useEffect(() => {
    if (hydrated && items.length === 0 && phase === "idle") {
      router.replace("/pedir");
    }
  }, [hydrated, items.length, phase, router]);

  const pay = () => {
    setPhase("processing");
    setTimeout(() => {
      const saved = sessionStorage.getItem("guchini-checkout");
      const { name, phone, pickupMin } = saved
        ? JSON.parse(saved)
        : { name: "Cliente", phone: "", pickupMin: 0 };
      const order = confirmOrder(name, phone, pickupMin ?? 0);
      if (order) router.replace(`/confirmacion/${order.id}`);
      else router.replace("/pedir");
    }, 1400);
  };

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="bg-mp px-5 py-4 text-white">
          <p className="font-display text-lg uppercase tracking-wider">
            Mercado Pago
          </p>
          <p className="text-xs font-medium opacity-80">
            Checkout simulado — demo
          </p>
        </div>

        <div className="p-5">
          <p className="text-sm font-medium text-cocoa">Guchini Takeaway</p>
          <p className="font-display text-3xl tracking-wide">
            {formatARS(total)}
          </p>

          {phase === "processing" ? (
            <div className="mt-6 flex flex-col items-center gap-3 py-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-mp border-t-transparent" />
              <p className="text-sm font-medium text-cocoa">
                Procesando pago…
              </p>
            </div>
          ) : phase === "failed" ? (
            <div className="mt-6">
              <div className="rounded-lg bg-tomato/10 p-3 text-center">
                <p className="font-display uppercase tracking-wide text-tomato">
                  Pago rechazado
                </p>
                <p className="text-xs font-medium text-cocoa">
                  No se creó ninguna orden. Probá de nuevo.
                </p>
              </div>
              <button
                onClick={() => setPhase("idle")}
                className="mt-4 w-full rounded-lg bg-sun py-2.5 text-sm font-semibold uppercase tracking-wider text-white"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-2">
              <button
                onClick={pay}
                className="w-full rounded-lg bg-mp py-3 text-sm font-semibold uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                Simular pago aprobado
              </button>
              <button
                onClick={() => {
                  track("payment_failed");
                  setPhase("failed");
                }}
                className="w-full rounded-lg border border-ink/15 bg-white py-3 text-sm font-semibold uppercase tracking-wider text-cocoa transition-colors hover:bg-cream"
              >
                Simular pago rechazado
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
