"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { branchById } from "@/lib/data";
import { cartTotals } from "@/lib/cart";
import { saveCheckoutDraft } from "@/lib/checkout";
import { formatARS } from "@/lib/format";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";

const INPUT_CLASS =
  "w-full rounded-lg border border-ink/15 bg-white px-3.5 py-3 text-sm font-medium outline-none transition-shadow placeholder:text-cocoa/60 focus:border-sun focus:ring-2 focus:ring-sun/30";

const PICKUP_OPTIONS = [
  { min: 0, label: "Lo antes posible", hint: "≈20 min" },
  { min: 30, label: "En 30 min", hint: "" },
  { min: 45, label: "En 45 min", hint: "" },
  { min: 60, label: "En 1 h", hint: "" },
  { min: 90, label: "En 1:30 h", hint: "" },
];

export default function CheckoutPage() {
  const { branch } = useParams<{ branch: string }>();
  const router = useRouter();
  const hydrated = useHydrated();
  const items = useStore((s) => s.cart.items);
  const promos = useStore((s) => s.promos);
  const track = useStore((s) => s.track);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pickupMin, setPickupMin] = useState(0);

  useEffect(() => {
    track("checkout_started");
  }, [track]);

  const b = branchById(branch);
  const { count, total } = cartTotals(items, promos, branch);
  const valid = name.trim().length >= 2 && phone.trim().length >= 8;

  useEffect(() => {
    if (hydrated && items.length === 0) router.replace(`/pedir/${branch}`);
  }, [hydrated, items.length, branch, router]);

  if (!hydrated || items.length === 0) {
    return <main className="mx-auto max-w-2xl px-4 pb-16" />;
  }

  return (
    <main className="mx-auto max-w-2xl px-4 pb-16">
      <Link
        href={`/pedir/${branch}/carrito`}
        className="mt-8 inline-block text-sm font-semibold text-cocoa hover:text-ink"
      >
        ← Volver al pedido
      </Link>
      <h1 className="mt-3 font-display text-3xl uppercase tracking-widest">
        Último paso
      </h1>

      <section className="mt-6 rounded-xl bg-paper p-5 shadow-sm">
        <h2 className="font-display text-lg uppercase tracking-wide">
          Tus datos
        </h2>
        <div className="mt-4 space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre y apellido"
            className={INPUT_CLASS}
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Celular (para el WhatsApp)"
            inputMode="tel"
            className={INPUT_CLASS}
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (opcional, para el comprobante)"
            inputMode="email"
            className={INPUT_CLASS}
          />
        </div>
      </section>

      <section className="mt-4 rounded-xl bg-paper p-5 shadow-sm">
        <h2 className="font-display text-lg uppercase tracking-wide">
          ¿En cuánto llegás?
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {PICKUP_OPTIONS.map((o) => (
            <button
              key={o.min}
              onClick={() => setPickupMin(o.min)}
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                pickupMin === o.min
                  ? "bg-guchi text-white shadow-md"
                  : "bg-ink/5 text-cocoa hover:bg-ink/10"
              }`}
            >
              {o.label}
              {o.hint ? (
                <span className="ml-1 opacity-70">{o.hint}</span>
              ) : null}
            </button>
          ))}
        </div>
        <p className="mt-2.5 text-xs font-medium text-cocoa">
          {pickupMin > 0
            ? "Pedido programado — lo preparamos para que esté listo cuando llegues."
            : "Lo arrancamos en cuanto confirmás el pago."}
        </p>
      </section>

      <section className="mt-4 rounded-xl bg-paper p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-cocoa">
          Resumen
        </p>
        <p className="mt-1 text-sm font-medium">
          {count} productos · Retiro en {b.shortName}
        </p>
        <p className="mt-1 font-display text-2xl tracking-wide text-mango">
          {formatARS(total)}
        </p>
      </section>

      <button
        disabled={!valid}
        onClick={() => {
          track("payment_started");
          saveCheckoutDraft({
            name: name.trim(),
            phone: phone.trim(),
            pickupMin,
          });
          router.push("/pago");
        }}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-mp py-4 text-sm font-semibold uppercase tracking-widest text-white shadow-md transition-all enabled:hover:-translate-y-0.5 enabled:hover:shadow-lg disabled:opacity-40"
      >
        Pagar con Mercado Pago
      </button>
      <p className="mt-3 text-center text-xs font-medium text-cocoa">
        La orden se confirma solo cuando el pago se aprueba.
      </p>
    </main>
  );
}
