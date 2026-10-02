import { productById } from "./data";
import { promoFor, unitDiscount } from "./cart";
import type {
  DemoEvent,
  Order,
  OrderItem,
  OrderStatus,
  Promotion,
} from "./store";

type StockMap = Record<string, Record<string, number>>;

const MIN = 60 * 1000;

interface SeedEntry {
  number: number;
  branchId: string;
  status: OrderStatus;
  items: [string, number][];
  customerName: string;
  customerPhone: string;
  agoMin: number;
  pickupInMin?: number;
}

const SCENARIO: SeedEntry[] = [
  {
    number: 10486,
    branchId: "uspallata",
    status: "PAGADO",
    items: [["crunchini", 1], ["limonada", 2]],
    customerName: "Martín Ríos",
    customerPhone: "2615112233",
    agoMin: 4,
    pickupInMin: 50,
  },
  {
    number: 10485,
    branchId: "uspallata",
    status: "PAGADO",
    items: [["crunchini", 1], ["gaseosa", 1]],
    customerName: "Camila Torres",
    customerPhone: "2615443322",
    agoMin: 2,
  },
  {
    number: 10484,
    branchId: "ciudad",
    status: "CONFIRMADO",
    items: [["guchicken", 2], ["boniatos", 1]],
    customerName: "Sofía Luna",
    customerPhone: "2615889900",
    agoMin: 8,
  },
  {
    number: 10483,
    branchId: "ciudad",
    status: "EN_PREPARACION",
    items: [["la-patrona", 1], ["soda", 1]],
    customerName: "Diego Paredes",
    customerPhone: "2614771122",
    agoMin: 14,
  },
  {
    number: 10482,
    branchId: "chacras",
    status: "LISTO",
    items: [["crudo", 1], ["agua", 1]],
    customerName: "Valentina Moyano",
    customerPhone: "2615334455",
    agoMin: 19,
  },
  {
    number: 10481,
    branchId: "uspallata",
    status: "CANCELADO",
    items: [["combo-guchi", 1]],
    customerName: "Lucas Fernández",
    customerPhone: "2615667788",
    agoMin: 27,
  },
  {
    number: 10480,
    branchId: "ciudad",
    status: "RETIRADO",
    items: [["mortadela", 1], ["gaseosa", 1]],
    customerName: "Nadia Herrera",
    customerPhone: "2615998877",
    agoMin: 22,
  },
  {
    number: 10479,
    branchId: "chacras",
    status: "RETIRADO",
    items: [["combo-guchi", 1], ["cerveza", 2]],
    customerName: "Bruno Sánchez",
    customerPhone: "2615113344",
    agoMin: 32,
  },
  {
    number: 10478,
    branchId: "ciudad",
    status: "RETIRADO",
    items: [["guchicken", 2], ["limonada", 1]],
    customerName: "Ailén Vega",
    customerPhone: "2615556677",
    agoMin: 41,
  },
];

const FUNNEL: [string, number][] = [
  ["menu_viewed", 87],
  ["product_viewed", 64],
  ["promotion_viewed", 21],
  ["product_added", 41],
  ["cart_viewed", 36],
  ["checkout_started", 34],
  ["payment_started", 27],
  ["payment_approved", 19],
  ["payment_failed", 5],
  ["order_confirmed", 19],
  ["order_ready", 14],
  ["order_picked_up", 9],
  ["promotion_used", 10],
];

const STOCK_FLOORS: Record<string, Record<string, number>> = {
  ciudad: { mortadela: 2 },
  uspallata: { crunchini: 1 },
};

export function buildSeed(baseStock: StockMap, basePromos: Promotion[]) {
  const now = Date.now();

  const orders: Order[] = SCENARIO.map((e) => {
    const items: OrderItem[] = e.items.map(([productId, qty]) => {
      const product = productById(productId);
      return {
        productId,
        name: product.name,
        qty,
        unitPrice: product.price,
        unitDiscount: unitDiscount(basePromos, productId, e.branchId),
      };
    });
    const subtotal = items.reduce((a, i) => a + i.unitPrice * i.qty, 0);
    const discount = items.reduce((a, i) => a + i.unitDiscount * i.qty, 0);
    const createdAt = now - e.agoMin * MIN;
    const discounted = items.find((i) => i.unitDiscount > 0);
    const promoId = discounted
      ? promoFor(basePromos, discounted.productId, e.branchId)?.id ?? null
      : null;
    return {
      id: crypto.randomUUID(),
      number: e.number,
      branchId: e.branchId,
      items,
      subtotal,
      discount,
      total: subtotal - discount,
      customerName: e.customerName,
      customerPhone: e.customerPhone,
      status: e.status,
      promoId,
      createdAt,
      pickupAt: e.pickupInMin ? now + e.pickupInMin * MIN : createdAt + 20 * MIN,
      scheduled: e.pickupInMin !== undefined,
    };
  });

  const stock = Object.fromEntries(
    Object.entries(baseStock).map(([branchId, products]) => [
      branchId,
      { ...products },
    ]),
  );
  for (const order of orders) {
    if (order.status === "CANCELADO") continue;
    for (const item of order.items) {
      stock[order.branchId][item.productId] = Math.max(
        0,
        (stock[order.branchId][item.productId] ?? 0) - item.qty,
      );
    }
  }
  for (const [branchId, floors] of Object.entries(STOCK_FLOORS)) {
    for (const [productId, qty] of Object.entries(floors)) {
      stock[branchId][productId] = Math.min(stock[branchId][productId], qty);
    }
  }

  const promos = basePromos.map((p) => ({
    ...p,
    redemptions:
      p.id === "happy-guchi" ? 7 : p.id === "ruta-7" ? 3 : p.redemptions,
  }));

  const events: DemoEvent[] = FUNNEL.flatMap(([name, n]) =>
    Array.from({ length: n }, () => ({
      name,
      at: now - Math.floor(Math.random() * 3 * 60 * MIN),
    })),
  );

  return {
    cart: { branchId: null, items: [] },
    preselect: null,
    orders,
    stock,
    promos,
    events,
    orderCounter: 10486,
  };
}
