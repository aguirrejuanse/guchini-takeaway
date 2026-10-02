const ars = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function formatARS(value: number): string {
  return ars.format(value);
}

export function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function elapsedLabel(ts: number): string {
  const mins = Math.max(0, Math.round((Date.now() - ts) / 60000));
  if (mins < 1) return "recién";
  if (mins === 1) return "hace 1 min";
  return `hace ${mins} min`;
}
