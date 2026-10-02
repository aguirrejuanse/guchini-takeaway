"use client";

import { SectionTitle } from "@/components/section-title";
import { BRANCHES, PRODUCTS } from "@/lib/data";
import { formatARS } from "@/lib/format";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";

const FUNNEL_STEPS = [
  { event: "menu_viewed", label: "Vieron el menú" },
  { event: "checkout_started", label: "Iniciaron checkout" },
  { event: "payment_approved", label: "Pagos aprobados" },
  { event: "order_ready", label: "Pedidos listos" },
];

export default function AdminPage() {
  const hydrated = useHydrated();
  const stock = useStore((s) => s.stock);
  const setStock = useStore((s) => s.setStock);
  const productActive = useStore((s) => s.productActive);
  const toggleProduct = useStore((s) => s.toggleProduct);
  const promos = useStore((s) => s.promos);
  const togglePromo = useStore((s) => s.togglePromo);
  const orders = useStore((s) => s.orders);
  const events = useStore((s) => s.events);

  if (!hydrated) return <main className="mx-auto max-w-5xl px-4 pb-16" />;

  const validOrders = orders.filter((o) => o.status !== "CANCELADO");
  const revenue = validOrders.reduce((a, o) => a + o.total, 0);
  const discountGiven = validOrders.reduce((a, o) => a + o.discount, 0);
  const unitsSold = validOrders.reduce(
    (a, o) => a + o.items.reduce((x, i) => x + i.qty, 0),
    0,
  );

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16">
      <h1 className="mt-8 font-display text-3xl uppercase tracking-widest">
        Administración
      </h1>

      <section className="mt-8">
        <SectionTitle>Hoy en números</SectionTitle>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Pedidos", value: String(validOrders.length) },
            { label: "Unidades", value: String(unitsSold) },
            { label: "Ventas", value: formatARS(revenue) },
            { label: "Descuentos", value: formatARS(discountGiven) },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl bg-paper p-4 text-center shadow-sm"
            >
              <p className="font-display text-2xl tracking-wide text-mango">
                {s.value}
              </p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-cocoa">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <SectionTitle>Funnel de conversión</SectionTitle>
        <div className="mt-4 space-y-3">
          {FUNNEL_STEPS.map((step) => {
            const count = events.filter((e) => e.name === step.event).length;
            const first = Math.max(
              1,
              events.filter((e) => e.name === FUNNEL_STEPS[0].event).length,
            );
            const pct = Math.min(100, Math.round((count / first) * 100));
            return (
              <div key={step.event}>
                <div className="flex justify-between text-xs font-semibold">
                  <span>{step.label}</span>
                  <span className="text-cocoa">{count}</span>
                </div>
                <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-ink/10">
                  <div
                    className="h-full rounded-full bg-guchi transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <SectionTitle>Promociones</SectionTitle>
        <div className="mt-4 space-y-3">
          {promos.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-xl bg-paper p-4 shadow-sm"
            >
              <div>
                <p className="font-display uppercase tracking-wide">{p.name}</p>
                <p className="text-sm font-medium text-cocoa">{p.tagline}</p>
                <p className="mt-0.5 text-xs font-semibold text-guchi">
                  {p.redemptions} pedidos la usaron
                </p>
              </div>
              <button
                onClick={() => togglePromo(p.id)}
                className={`rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider shadow-sm transition-colors ${
                  p.active
                    ? "bg-guchi text-white"
                    : "bg-ink/10 text-cocoa"
                }`}
              >
                {p.active ? "Activa" : "Pausada"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <SectionTitle>Stock por sucursal</SectionTitle>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {BRANCHES.map((b) => (
            <div
              key={b.id}
              className="overflow-hidden rounded-xl bg-paper shadow-sm"
            >
              <p className="border-b border-ink/10 bg-sun/20 px-4 py-2.5 font-display uppercase tracking-wide">
                {b.name}
              </p>
              <div className="divide-y divide-ink/5">
                {PRODUCTS.map((p) => {
                  const qty = stock[b.id]?.[p.id] ?? 0;
                  const active = productActive[p.id] ?? true;
                  return (
                    <div
                      key={p.id}
                      className="flex items-center justify-between px-4 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium">{p.name}</p>
                        {!active ? (
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-tomato">
                            Inactivo
                          </p>
                        ) : qty === 0 ? (
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-tomato">
                            Sold out
                          </p>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setStock(b.id, p.id, qty - 1)}
                          className="h-7 w-7 rounded-full border border-ink/15 text-sm font-bold transition-colors hover:bg-cream"
                        >
                          −
                        </button>
                        <span className="w-7 text-center text-sm font-bold">
                          {qty}
                        </span>
                        <button
                          onClick={() => setStock(b.id, p.id, qty + 1)}
                          className="h-7 w-7 rounded-full border border-ink/15 text-sm font-bold transition-colors hover:bg-cream"
                        >
                          +
                        </button>
                        <button
                          onClick={() => toggleProduct(p.id)}
                          className={`ml-2 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide transition-colors ${
                            active
                              ? "bg-guchi text-white"
                              : "bg-ink/10 text-cocoa"
                          }`}
                        >
                          {active ? "ON" : "OFF"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
