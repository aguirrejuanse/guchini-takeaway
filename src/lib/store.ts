"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { PRODUCTS, productById } from "./data";

export type OrderStatus =
  | "PAGADO"
  | "CONFIRMADO"
  | "EN_PREPARACION"
  | "LISTO"
  | "RETIRADO"
  | "CANCELADO";

export const STATUS_FLOW: OrderStatus[] = [
  "PAGADO",
  "CONFIRMADO",
  "EN_PREPARACION",
  "LISTO",
  "RETIRADO",
];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  PAGADO: "Pagado",
  CONFIRMADO: "Confirmado",
  EN_PREPARACION: "En preparación",
  LISTO: "Listo para retirar",
  RETIRADO: "Retirado",
  CANCELADO: "Cancelado",
};

export interface OrderItem {
  productId: string;
  name: string;
  qty: number;
  unitPrice: number;
  unitDiscount: number;
}

export interface Order {
  id: string;
  number: number;
  branchId: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  customerName: string;
  customerPhone: string;
  status: OrderStatus;
  promoId: string | null;
  createdAt: number;
  pickupAt: number;
}

export interface Promotion {
  id: string;
  name: string;
  tagline: string;
  productId: string;
  percentOff: number;
  fixedOff: number;
  branchIds: string[];
  active: boolean;
  redemptions: number;
}

export interface CartItem {
  productId: string;
  qty: number;
}

export interface DemoEvent {
  name: string;
  at: number;
}

type StockMap = Record<string, Record<string, number>>;

function initialStock(): StockMap {
  return {
    ciudad: {
      crunchini: 7,
      guchicken: 12,
      crudo: 8,
      "la-patrona": 10,
      mortadela: 6,
      "combo-guchi": 20,
      boniatos: 20,
      gaseosa: 30,
      limonada: 15,
      soda: 8,
      vermouth: 6,
      cerveza: 18,
      agua: 12,
    },
    chacras: {
      crunchini: 4,
      guchicken: 9,
      crudo: 5,
      "la-patrona": 7,
      mortadela: 0,
      "combo-guchi": 12,
      boniatos: 12,
      gaseosa: 18,
      limonada: 10,
      soda: 5,
      vermouth: 4,
      cerveza: 10,
      agua: 8,
    },
    uspallata: {
      crunchini: 6,
      guchicken: 8,
      crudo: 4,
      "la-patrona": 5,
      mortadela: 4,
      "combo-guchi": 15,
      boniatos: 10,
      gaseosa: 15,
      limonada: 8,
      soda: 4,
      vermouth: 0,
      cerveza: 12,
      agua: 10,
    },
    cordoba: {
      crunchini: 5,
      guchicken: 10,
      crudo: 6,
      "la-patrona": 8,
      mortadela: 5,
      "combo-guchi": 14,
      boniatos: 14,
      gaseosa: 20,
      limonada: 12,
      soda: 6,
      vermouth: 3,
      cerveza: 14,
      agua: 10,
    },
  };
}

function initialActive(): Record<string, boolean> {
  return Object.fromEntries(PRODUCTS.map((p) => [p.id, true]));
}

function initialPromos(): Promotion[] {
  return [
    {
      id: "happy-guchi",
      name: "Happy Guchi",
      tagline: "15% OFF en Guchicken · 16 a 18hs",
      productId: "guchicken",
      percentOff: 15,
      fixedOff: 0,
      branchIds: ["ciudad", "chacras", "cordoba"],
      active: true,
      redemptions: 0,
    },
    {
      id: "ruta-7",
      name: "Ruta 7",
      tagline: "$2.000 OFF en Combo Guchi · solo Uspallata",
      productId: "combo-guchi",
      percentOff: 0,
      fixedOff: 2000,
      branchIds: ["uspallata"],
      active: true,
      redemptions: 0,
    },
    {
      id: "efectivo-10",
      name: "10% OFF Efectivo",
      tagline: "Pagando en efectivo en el local · canal presencial",
      productId: "guchicken",
      percentOff: 10,
      fixedOff: 0,
      branchIds: ["ciudad"],
      active: false,
      redemptions: 0,
    },
  ];
}

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

interface DemoStore {
  cart: { branchId: string | null; items: CartItem[] };
  preselect: string | null;
  orders: Order[];
  stock: StockMap;
  productActive: Record<string, boolean>;
  promos: Promotion[];
  events: DemoEvent[];
  orderCounter: number;
  track: (name: string) => void;
  setPreselect: (productId: string | null) => void;
  setBranch: (branchId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  confirmOrder: (name: string, phone: string) => Order | null;
  advanceOrder: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;
  setStock: (branchId: string, productId: string, qty: number) => void;
  toggleProduct: (productId: string) => void;
  togglePromo: (promoId: string) => void;
  resetDemo: () => void;
}

export const useStore = create<DemoStore>()(
  persist(
    (set, get) => ({
      cart: { branchId: null, items: [] },
      preselect: null,
      orders: [],
      stock: initialStock(),
      productActive: initialActive(),
      promos: initialPromos(),
      events: [],
      orderCounter: 10480,

      track: (name) =>
        set((s) => ({
          events: [...s.events.slice(-299), { name, at: Date.now() }],
        })),

      setPreselect: (productId) => set({ preselect: productId }),

      setBranch: (branchId) =>
        set((s) =>
          s.cart.branchId === branchId
            ? s
            : { cart: { branchId, items: [] } },
        ),

      setQty: (productId, qty) =>
        set((s) => {
          const items = s.cart.items.filter((i) => i.productId !== productId);
          if (qty > 0) items.push({ productId, qty });
          return { cart: { ...s.cart, items } };
        }),

      clearCart: () => set((s) => ({ cart: { ...s.cart, items: [] } })),

      confirmOrder: (name, phone) => {
        const s = get();
        const branchId = s.cart.branchId;
        if (!branchId || s.cart.items.length === 0) return null;

        const items: OrderItem[] = s.cart.items.map((ci) => {
          const product = productById(ci.productId);
          return {
            productId: ci.productId,
            name: product.name,
            qty: ci.qty,
            unitPrice: product.price,
            unitDiscount: unitDiscount(s.promos, ci.productId, branchId),
          };
        });
        const subtotal = items.reduce((a, i) => a + i.unitPrice * i.qty, 0);
        const discount = items.reduce((a, i) => a + i.unitDiscount * i.qty, 0);
        const promoIds = [
          ...new Set(
            items
              .filter((i) => i.unitDiscount > 0)
              .map((i) => promoFor(s.promos, i.productId, branchId)!.id),
          ),
        ];

        const order: Order = {
          id: crypto.randomUUID(),
          number: s.orderCounter + 1,
          branchId,
          items,
          subtotal,
          discount,
          total: subtotal - discount,
          customerName: name,
          customerPhone: phone,
          status: "PAGADO",
          promoId: promoIds[0] ?? null,
          createdAt: Date.now(),
          pickupAt: Date.now() + 20 * 60 * 1000,
        };

        set((prev) => {
          const branchStock = { ...prev.stock[branchId] };
          for (const item of items) {
            branchStock[item.productId] = Math.max(
              0,
              (branchStock[item.productId] ?? 0) - item.qty,
            );
          }
          return {
            orders: [order, ...prev.orders],
            stock: { ...prev.stock, [branchId]: branchStock },
            orderCounter: prev.orderCounter + 1,
            cart: { branchId, items: [] },
            promos: prev.promos.map((p) =>
              promoIds.includes(p.id)
                ? { ...p, redemptions: p.redemptions + 1 }
                : p,
            ),
            events: [
              ...prev.events.slice(-299),
              { name: "payment_approved", at: Date.now() },
              { name: "order_confirmed", at: Date.now() },
            ],
          };
        });
        return order;
      },

      advanceOrder: (orderId) =>
        set((s) => ({
          orders: s.orders.map((o) => {
            if (o.id !== orderId) return o;
            const idx = STATUS_FLOW.indexOf(o.status);
            if (idx < 0 || idx === STATUS_FLOW.length - 1) return o;
            return { ...o, status: STATUS_FLOW[idx + 1] };
          }),
          events: [
            ...s.events.slice(-299),
            {
              name:
                s.orders.find((o) => o.id === orderId)?.status ===
                "EN_PREPARACION"
                  ? "order_ready"
                  : "order_advanced",
              at: Date.now(),
            },
          ],
        })),

      cancelOrder: (orderId) =>
        set((s) => {
          const order = s.orders.find((o) => o.id === orderId);
          if (!order) return s;
          const branchStock = { ...s.stock[order.branchId] };
          for (const item of order.items) {
            branchStock[item.productId] =
              (branchStock[item.productId] ?? 0) + item.qty;
          }
          return {
            orders: s.orders.map((o) =>
              o.id === orderId ? { ...o, status: "CANCELADO" } : o,
            ),
            stock: { ...s.stock, [order.branchId]: branchStock },
          };
        }),

      setStock: (branchId, productId, qty) =>
        set((s) => ({
          stock: {
            ...s.stock,
            [branchId]: {
              ...s.stock[branchId],
              [productId]: Math.max(0, qty),
            },
          },
        })),

      toggleProduct: (productId) =>
        set((s) => ({
          productActive: {
            ...s.productActive,
            [productId]: !s.productActive[productId],
          },
        })),

      togglePromo: (promoId) =>
        set((s) => ({
          promos: s.promos.map((p) =>
            p.id === promoId ? { ...p, active: !p.active } : p,
          ),
        })),

      resetDemo: () =>
        set({
          cart: { branchId: null, items: [] },
          preselect: null,
          orders: [],
          stock: initialStock(),
          productActive: initialActive(),
          promos: initialPromos(),
          events: [],
          orderCounter: 10480,
        }),
    }),
    {
      name: "guchini-demo-v2",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
