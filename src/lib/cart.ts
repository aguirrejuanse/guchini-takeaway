import { productById } from "./data";
import type { CartItem, Promotion } from "./store";

export function promoFor(
  promos: Promotion[],
  productId: string,
  branchId: string,
): Promotion | null {
  return (
    promos.find(
      (p) =>
        p.active && p.productId === productId && p.branchIds.includes(branchId),
    ) ?? null
  );
}

export function unitDiscount(
  promos: Promotion[],
  productId: string,
  branchId: string,
): number {
  const promo = promoFor(promos, productId, branchId);
  if (!promo) return 0;
  const price = productById(productId).price;
  return promo.percentOff > 0
    ? Math.round((price * promo.percentOff) / 100)
    : promo.fixedOff;
}

export function cartTotals(
  items: CartItem[],
  promos: Promotion[],
  branchId: string,
) {
  const count = items.reduce((a, i) => a + i.qty, 0);
  const subtotal = items.reduce(
    (a, i) => a + productById(i.productId).price * i.qty,
    0,
  );
  const discount = items.reduce(
    (a, i) => a + unitDiscount(promos, i.productId, branchId) * i.qty,
    0,
  );
  return { count, subtotal, discount, total: subtotal - discount };
}
