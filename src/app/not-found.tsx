import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <Image
        src="/assets/guachini.png"
        alt="Guachini"
        width={260}
        height={112}
        className="animate-pop-in"
        priority
      />
      <p className="mt-6 font-display text-6xl uppercase tracking-widest text-tomato">
        404
      </p>
      <h1 className="mt-2 font-display text-3xl uppercase tracking-widest">
        Esta página está sold out
      </h1>
      <p className="mt-2 max-w-sm font-script text-2xl text-cocoa">
        se acabó, como el crunchini un viernes a la noche
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-sun px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
