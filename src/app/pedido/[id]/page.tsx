"use client";

import { useParams } from "next/navigation";
import { branchById } from "@/lib/data";
import { formatTime } from "@/lib/format";
import { STATUS_FLOW, STATUS_LABEL, useStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";

export default function PedidoPage() {
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
  const currentIdx =
    order.status === "CANCELADO" ? -1 : STATUS_FLOW.indexOf(order.status);

  return (
    <main className="mx-auto max-w-2xl px-4 pb-16">
      <h1 className="mt-8 font-display text-3xl uppercase tracking-widest">
        Pedido #{order.number}
      </h1>
      <p className="mt-1 text-sm font-medium text-cocoa">
        {branch.name} ·{" "}
        {order.scheduled ? "Retiro programado" : "Retiro estimado"}{" "}
        {formatTime(order.pickupAt)}
      </p>

      {order.status === "CANCELADO" ? (
        <div className="mt-8 rounded-xl bg-tomato/10 p-6 text-center">
          <p className="font-display text-xl uppercase tracking-wide text-tomato">
            Pedido cancelado
          </p>
          <p className="mt-1 text-sm font-medium text-cocoa">
            El local se comunica con vos para la devolución.
          </p>
        </div>
      ) : (
        <ol className="mt-8">
          {STATUS_FLOW.map((status, idx) => {
            const done = idx <= currentIdx;
            const current = idx === currentIdx;
            return (
              <li
                key={status}
                className="flex animate-fade-up items-stretch gap-4"
                style={{ animationDelay: `${idx * 120}ms` }}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                      done
                        ? "bg-guchi text-white shadow-md"
                        : "bg-ink/10 text-cocoa"
                    } ${current ? "ring-4 ring-sun/50" : ""}`}
                  >
                    {done ? "✓" : idx + 1}
                  </div>
                  {idx < STATUS_FLOW.length - 1 ? (
                    <div
                      className={`w-0.5 flex-1 ${
                        idx < currentIdx ? "bg-guchi" : "bg-ink/10"
                      }`}
                    />
                  ) : null}
                </div>
                <div className="pb-7 pt-1.5">
                  <p
                    className={`font-display text-lg uppercase leading-none tracking-wide ${
                      done ? "text-ink" : "text-cocoa/40"
                    }`}
                  >
                    {STATUS_LABEL[status]}
                  </p>
                  {current && status === "LISTO" ? (
                    <p className="mt-1.5 text-sm font-semibold text-guchi">
                      Ya podés pasar a retirarlo 🏃
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </main>
  );
}
