"use client";

import Link from "next/link";
import { BRANCHES } from "@/lib/data";

export default function PedirPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 pb-16">
      <div className="mt-10 text-center">
        <h1 className="font-display text-3xl uppercase tracking-widest">
          ¿Por dónde retirás?
        </h1>
        <div className="mx-auto mt-3 h-[3px] w-14 rounded-full bg-tomato" />
        <p className="mx-auto mt-3 max-w-md text-sm text-cocoa">
          Elegí la sucursal — el menú y el stock dependen de cada local.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {BRANCHES.map((b, i) => (
          <Link
            key={b.id}
            href={`/pedir/${b.id}`}
            className="block animate-fade-up rounded-xl bg-paper p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl uppercase tracking-wide">
                  {b.name}
                </h2>
                <p className="mt-1 text-sm font-medium text-cocoa">
                  {b.address}
                </p>
                <p className="text-xs text-cocoa/80">{b.addressDetail}</p>
                <p className="mt-1.5 text-xs font-medium text-cocoa">
                  {b.hours}
                </p>
                {b.cafeHours ? (
                  <p className="text-xs font-semibold text-guchi">
                    ☕ {b.cafeHours}
                  </p>
                ) : null}
              </div>
              <div className="shrink-0 text-right">
                <span className="inline-block rounded-full bg-guchi px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                  Abierto
                </span>
                <p className="mt-1.5 text-xs font-semibold text-cocoa">
                  Retiro en {b.eta}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
