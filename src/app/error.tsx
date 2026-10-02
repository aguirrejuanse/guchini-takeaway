"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-6xl uppercase tracking-widest text-tomato">
        Ups
      </p>
      <h1 className="mt-2 font-display text-3xl uppercase tracking-widest">
        Se nos quemó el pan
      </h1>
      <p className="mt-2 max-w-sm font-script text-2xl text-cocoa">
        algo salió mal de nuestro lado — no te cobramos nada
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="rounded-lg bg-sun px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="rounded-lg border border-ink/15 bg-paper px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-cocoa transition-colors hover:bg-cream"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
