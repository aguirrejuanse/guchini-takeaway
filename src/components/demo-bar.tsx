"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

const VIEWS = [
  { href: "/", label: "Cliente" },
  { href: "/local", label: "Panel del local" },
  { href: "/admin", label: "Admin" },
];

export function DemoBar() {
  const pathname = usePathname();
  const router = useRouter();
  const resetDemo = useStore((s) => s.resetDemo);
  const seedDemo = useStore((s) => s.seedDemo);

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between gap-2 bg-coal px-3 py-2 text-white">
      <div className="flex shrink-0 items-center gap-2.5">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <Image
            src="/assets/logo.png"
            alt="Guchini"
            width={560}
            height={210}
            className="h-8 w-auto sm:h-10"
          />
        </Link>
        <span className="rounded bg-sun px-1.5 py-px text-[9px] font-bold uppercase tracking-widest text-ink">
          Demo
        </span>
      </div>
      <nav className="flex items-center gap-1 overflow-x-auto whitespace-nowrap">
        {VIEWS.map((v) => {
          const active =
            v.href === "/"
              ? !pathname.startsWith("/local") && !pathname.startsWith("/admin")
              : pathname.startsWith(v.href);
          return (
            <Link
              key={v.href}
              href={v.href}
              className={`rounded-md px-2.5 py-0.5 text-[11px] font-semibold transition-colors ${
                active ? "bg-sun text-ink" : "text-white/60 hover:text-white"
              }`}
            >
              {v.label}
            </Link>
          );
        })}
        <button
          onClick={() => {
            seedDemo();
            router.push("/local");
          }}
          className="ml-1 rounded-md border border-guchi/60 px-2.5 py-0.5 text-[11px] font-semibold text-sun hover:bg-guchi/20"
        >
          Cargar demo
        </button>
        <button
          onClick={() => {
            resetDemo();
            router.push("/");
          }}
          className="rounded-md border border-white/20 px-2.5 py-0.5 text-[11px] font-semibold text-white/60 hover:text-white"
        >
          Reiniciar
        </button>
      </nav>
    </div>
  );
}
