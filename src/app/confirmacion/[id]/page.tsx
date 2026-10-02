"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { WaBubble } from "@/components/wa-bubble";
import { branchById } from "@/lib/data";
import { formatARS, formatTime } from "@/lib/format";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";

export default function ConfirmacionPage() {
  const { id } = useParams<{ id: string }>();
  const hydrated = useHydrated();
  const order = useStore((s) => s.orders.find((o) => o.id === id));

  if (!hydrated) return <main className="mx-auto max-w-2xl px-4 pb-16" />;
  if (!order) {
    return (
      <main className="mx-auto max-w-2xl px-4 pb-16">
        <p className="mt-10 text-center font-medium text-cocoa">
          Pedido no encontrado.
        </p>
      </main>
    );
  }

  const branch = branchById(order.branchId);

  return (
    <main className="mx-auto max-w-2xl px-4 pb-16">
      <div className="mt-8 animate-pop-in rounded-xl bg-pine p-8 text-center text-white shadow-lg">
        <p className="font-script text-3xl text-sun">¡listo, che!</p>
        <p className="mt-1 font-display text-3xl uppercase tracking-widest">
          Pedido confirmado 🥪
        </p>
        <p className="mt-2 font-display text-xl tracking-wider text-sun">
          #{order.number}
        </p>
      </div>

      <div className="mt-4 rounded-xl bg-paper p-5 shadow-sm">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-cocoa">Sucursal</span>
          <span>{branch.name}</span>
        </div>
        <div className="mt-1.5 flex justify-between text-sm font-medium">
          <span className="text-cocoa">Retiro</span>
          <span>Hoy · {formatTime(order.pickupAt)}</span>
        </div>
        <div className="mt-3 border-t border-dashed border-ink/15 pt-3">
          {order.items.map((i) => (
            <div key={i.productId} className="flex justify-between text-sm">
              <span className="font-medium">
                {i.qty}x {i.name}
              </span>
              <span className="font-medium">
                {formatARS((i.unitPrice - i.unitDiscount) * i.qty)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-between border-t border-ink/10 pt-3 font-display text-lg tracking-wide">
          <span>TOTAL</span>
          <span className="text-mango">{formatARS(order.total)}</span>
        </div>
      </div>

      <p className="mt-4 text-center text-sm font-semibold text-guchi">
        Te avisamos por WhatsApp cuando esté listo.
      </p>

      <div className="mt-3">
        <WaBubble order={order} />
      </div>

      <Link
        href={`/pedido/${order.id}`}
        className="mt-6 block rounded-lg bg-sun py-3.5 text-center text-sm font-semibold uppercase tracking-widest text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
      >
        Ver estado de mi pedido
      </Link>
    </main>
  );
}
