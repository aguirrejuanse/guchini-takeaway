"use client";

import { useEffect, useState } from "react";
import { WaBubble } from "@/components/wa-bubble";
import { BRANCHES, branchById } from "@/lib/data";
import { elapsedLabel, formatARS, formatTime, inMinutesLabel } from "@/lib/format";
import { waLink, waReadyMessage } from "@/lib/wa";
import {
  STATUS_LABEL,
  useStore,
  type Order,
  type OrderStatus,
} from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";

const NEXT_ACTION: Partial<Record<OrderStatus, string>> = {
  PAGADO: "Confirmar",
  CONFIRMADO: "Preparar",
  EN_PREPARACION: "Marcar listo",
  LISTO: "Entregar",
};

const STATUS_COLOR: Record<OrderStatus, string> = {
  PAGADO: "bg-sun/25 text-ink",
  CONFIRMADO: "bg-pinki/30 text-ink",
  EN_PREPARACION: "bg-sun text-ink",
  LISTO: "bg-guchi text-white",
  RETIRADO: "bg-ink/10 text-cocoa",
  CANCELADO: "bg-tomato/15 text-tomato",
};

function OrderCard({
  order,
  onCancel,
}: {
  order: Order;
  onCancel: (order: Order) => void;
}) {
  const advanceOrder = useStore((s) => s.advanceOrder);
  const [justReady, setJustReady] = useState(false);
  const action = NEXT_ACTION[order.status];
  const branch = branchById(order.branchId);

  const advance = () => {
    const wasPreparing = order.status === "EN_PREPARACION";
    advanceOrder(order.id);
    if (wasPreparing) {
      setJustReady(true);
      setTimeout(() => setJustReady(false), 6000);
    }
  };

  return (
    <article className="animate-pop-in rounded-xl bg-paper p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="font-display text-xl tracking-wide">#{order.number}</p>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${STATUS_COLOR[order.status]}`}
        >
          {STATUS_LABEL[order.status]}
        </span>
      </div>
      <p className="mt-0.5 text-xs font-medium text-cocoa">
        {branch.shortName} · {elapsedLabel(order.createdAt)} ·{" "}
        {order.customerName}
      </p>
      {order.scheduled ? (
        <p className="mt-1 inline-block rounded bg-sun/25 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink">
          Programado · retira {formatTime(order.pickupAt)}
        </p>
      ) : null}

      <div className="mt-2.5 border-t border-dashed border-ink/15 pt-2.5">
        {order.items.map((i) => (
          <p key={i.productId} className="text-sm font-medium">
            {i.qty}x {i.name}
          </p>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="font-display text-lg tracking-wide text-mango">
          {formatARS(order.total)}
        </span>
        <div className="flex items-center gap-2">
          {order.status !== "RETIRADO" && order.status !== "CANCELADO" ? (
            <button
              onClick={() => onCancel(order)}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-tomato transition-colors hover:bg-tomato/10"
            >
              Cancelar
            </button>
          ) : null}
          {action ? (
            <button
              onClick={advance}
              className="rounded-lg bg-guchi px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              {action}
            </button>
          ) : null}
        </div>
      </div>

      {order.status === "LISTO" ? (
        <a
          href={waLink(order.customerPhone, waReadyMessage(order))}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2.5 flex items-center justify-center gap-1.5 rounded-lg bg-[#25d366] px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          Enviar WhatsApp al cliente
        </a>
      ) : null}

      {justReady ? (
        <div className="mt-3 animate-pop-in">
          <WaBubble order={order} ready />
        </div>
      ) : null}
    </article>
  );
}

function CancelModal({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) {
  const cancelOrder = useStore((s) => s.cancelOrder);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-sm animate-pop-in rounded-xl bg-paper p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-xl uppercase tracking-wider">
          Cancelar pedido #{order.number}
        </h2>
        <p className="mt-2 text-sm font-medium text-cocoa">
          {order.items.map((i) => `${i.qty}x ${i.name}`).join(", ")} ·{" "}
          {formatARS(order.total)}
        </p>
        <div className="mt-4 space-y-1.5 rounded-lg bg-sun/15 p-3 text-xs font-medium text-ink">
          <p>· El stock vuelve al menú automáticamente.</p>
          <p>· Acordate de hacer el reintegro en Mercado Pago.</p>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cocoa transition-colors hover:bg-ink/5"
          >
            Volver
          </button>
          <button
            onClick={() => {
              cancelOrder(order.id);
              onClose();
            }}
            className="rounded-lg bg-tomato px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            Sí, cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LocalPage() {
  const hydrated = useHydrated();
  const orders = useStore((s) => s.orders);
  const [branchFilter, setBranchFilter] = useState<string>("todas");
  const [cancelling, setCancelling] = useState<Order | null>(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 30000);
    return () => clearInterval(t);
  }, []);

  if (!hydrated) return <main className="mx-auto max-w-5xl px-4 pb-16" />;

  const filtered = orders.filter(
    (o) => branchFilter === "todas" || o.branchId === branchFilter,
  );
  const PREP_MS = 15 * 60 * 1000;
  const pending = filtered.filter(
    (o) => o.status !== "RETIRADO" && o.status !== "CANCELADO",
  );
  const scheduled = pending.filter(
    (o) => o.scheduled && o.pickupAt - Date.now() > PREP_MS,
  );
  const active = pending.filter((o) => !scheduled.includes(o));
  const done = filtered.filter(
    (o) => o.status === "RETIRADO" || o.status === "CANCELADO",
  );

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16">
      <div className="mt-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-widest">
            Pedidos
          </h1>
          <p className="mt-1 text-sm font-medium text-cocoa">
            Solo entran pedidos pagados y confirmados.
          </p>
        </div>
        <div className="flex gap-1 rounded-full bg-white p-1 shadow-sm">
          {["todas", ...BRANCHES.map((b) => b.id)].map((f) => (
            <button
              key={f}
              onClick={() => setBranchFilter(f)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                branchFilter === f
                  ? "bg-coal text-white"
                  : "text-cocoa hover:text-ink"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {pending.length === 0 ? (
        <div className="mt-8 rounded-xl border-2 border-dashed border-ink/20 p-12 text-center">
          <p className="font-display text-xl uppercase tracking-wide text-cocoa">
            Sin pedidos activos
          </p>
          <p className="mt-1 text-sm font-medium text-cocoa">
            Cuando un cliente pague, el pedido aparece acá al toque.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {active.map((o) => (
            <OrderCard key={o.id} order={o} onCancel={setCancelling} />
          ))}
        </div>
      )}

      {scheduled.length > 0 ? (
        <>
          <h2 className="mt-10 font-display text-lg uppercase tracking-wider text-cocoa">
            Programados
          </h2>
          <p className="mt-1 text-xs font-medium text-cocoa">
            Entran a la cola 15 min antes del retiro.
          </p>
          <div className="mt-3 grid grid-cols-1 gap-4 opacity-75 sm:grid-cols-2 lg:grid-cols-3">
            {scheduled.map((o) => (
              <div key={o.id} className="relative">
                <OrderCard order={o} onCancel={setCancelling} />
                <span className="absolute right-3 top-12 rounded-full bg-ink/80 px-2 py-0.5 text-[10px] font-bold text-white">
                  {inMinutesLabel(o.pickupAt)}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : null}

      {done.length > 0 ? (
        <>
          <h2 className="mt-10 font-display text-lg uppercase tracking-wider text-cocoa">
            Historial
          </h2>
          <div className="mt-3 space-y-2 opacity-70">
            {done.map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between rounded-lg bg-paper px-4 py-2.5 shadow-sm"
              >
                <span className="text-sm font-medium">
                  #{o.number} ·{" "}
                  {o.items.map((i) => `${i.qty}x ${i.name}`).join(", ")}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide text-cocoa">
                  {STATUS_LABEL[o.status]}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : null}

      {cancelling ? (
        <CancelModal order={cancelling} onClose={() => setCancelling(null)} />
      ) : null}
    </main>
  );
}
