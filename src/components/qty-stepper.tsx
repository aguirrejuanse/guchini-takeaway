"use client";

export function QtyStepper({
  qty,
  onChange,
  max,
}: {
  qty: number;
  onChange: (qty: number) => void;
  max?: number;
}) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-ink/15 bg-white px-1 py-0.5 shadow-sm">
      <button
        onClick={() => onChange(qty - 1)}
        className="h-7 w-7 rounded-full font-bold transition-colors hover:bg-cream"
      >
        −
      </button>
      <span className="w-5 text-center text-sm font-bold">{qty}</span>
      <button
        onClick={() => onChange(qty + 1)}
        disabled={max !== undefined && qty >= max}
        className="h-7 w-7 rounded-full font-bold transition-colors hover:bg-cream disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}
