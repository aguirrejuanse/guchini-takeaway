const CHECKOUT_KEY = "guchini-checkout";

export interface CheckoutDraft {
  name: string;
  phone: string;
  pickupMin: number;
}

export function saveCheckoutDraft(draft: CheckoutDraft) {
  sessionStorage.setItem(CHECKOUT_KEY, JSON.stringify(draft));
}

export function loadCheckoutDraft(): CheckoutDraft {
  const saved = sessionStorage.getItem(CHECKOUT_KEY);
  if (!saved) return { name: "Cliente", phone: "", pickupMin: 0 };
  const parsed = JSON.parse(saved) as Partial<CheckoutDraft>;
  return {
    name: parsed.name ?? "Cliente",
    phone: parsed.phone ?? "",
    pickupMin: parsed.pickupMin ?? 0,
  };
}
