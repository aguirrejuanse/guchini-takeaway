import { branchById } from "./data";
import type { Order } from "./store";
import { formatARS } from "./format";

export function waLink(phone: string, text: string): string {
  let d = phone.replace(/\D/g, "").replace(/^0+/, "");
  if (d.startsWith("54")) d = d.slice(2);
  d = d.replace(/^9/, "").replace(/^15/, "");
  return `https://wa.me/549${d}?text=${encodeURIComponent(text)}`;
}

export function waReadyMessage(order: Order): string {
  const branch = branchById(order.branchId);
  const items = order.items.map((i) => `${i.qty}x ${i.name}`).join("\n");
  return [
    `🥪 Guchini — ¡Tu pedido #${order.number} está listo!`,
    "",
    items,
    "",
    `Total: ${formatARS(order.total)}`,
    `Te esperamos en ${branch.name} (${branch.address}).`,
  ].join("\n");
}
