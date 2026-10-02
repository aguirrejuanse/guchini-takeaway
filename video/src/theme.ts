import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";

loadAnton("normal", { weights: ["400"], subsets: ["latin"] });
loadCaveat("normal", { weights: ["700"], subsets: ["latin"] });
loadPoppins("normal", { weights: ["400", "500", "600", "700", "800"], subsets: ["latin"] });

/* Brand palette — mirrors src/app/globals.css in the web app */
export const C = {
  cream: "#f2ebdd",
  paper: "#ffffff",
  sun: "#ffbf33",
  mango: "#f0a500",
  guchi: "#138613",
  pine: "#1b7334",
  tomato: "#ff194d",
  pinki: "#ff8ccc",
  ink: "#2c1810",
  cocoa: "#6b5b47",
  coal: "#1a1a1a",
  mp: "#009ee3",
  whatsapp: "#25d366",
  waBubble: "#dcf8c6",
  line: "rgba(44,24,16,0.10)",
} as const;

export const FONTS = {
  display: "Anton, sans-serif",
  script: "Caveat, cursive",
  sans: "Poppins, sans-serif",
} as const;

export const SHADOW = {
  card: "0 10px 30px rgba(44,24,16,0.10)",
  device: "0 50px 90px rgba(44,24,16,0.28), 0 12px 30px rgba(44,24,16,0.18)",
  pop: "0 18px 40px rgba(44,24,16,0.20)",
} as const;

export const RADIUS = { card: 22, pill: 999 } as const;

/* Demo data — mirrors src/lib/data.ts and src/lib/store.ts */
export const BRANCHES = [
  {
    id: "ciudad",
    name: 'Guchini "La Casa"',
    shortName: "Ciudad",
    address: "San Lorenzo 577, Ciudad",
    addressDetail: "Frente a Plaza Italia · esq. 25 de Mayo",
    hours: "Todos los días · 12 a 23:30",
    cafeHours: undefined as string | undefined,
    eta: "20–30 min",
  },
  {
    id: "chacras",
    name: "Guchini Chacras",
    shortName: "Chacras de Coria",
    address: "Italia 5475, Chacras de Coria",
    addressDetail: "Esq. Justicia · frente a Plaza Espejo",
    hours: "Todos los días · 12 a 23:30",
    cafeHours: "Cafetería · 9 a 13 y 16 a 20",
    eta: "25–35 min",
  },
  {
    id: "uspallata",
    name: "Guchini Uspallata",
    shortName: "Uspallata",
    address: "Ruta N7 km 1151, Uspallata",
    addressDetail: "Junto a la YPF",
    hours: "Todos los días · 12 a 23",
    cafeHours: "Cafetería · 9 a 23",
    eta: "15–25 min",
  },
  {
    id: "cordoba",
    name: "Guchini Nueva Córdoba",
    shortName: "Nueva Córdoba",
    address: "Buenos Aires 518, Córdoba",
    addressDetail: "Esq. Rondeau · cerca del Blvd. Arturo Illia",
    hours: "Todos los días · 12 a 23:30",
    cafeHours: undefined as string | undefined,
    eta: "20–30 min",
  },
] as const;

export type BranchId = (typeof BRANCHES)[number]["id"];
export const branchOf = (id: string) => BRANCHES.find((b) => b.id === id)!;

export interface ProductDef {
  id: string;
  name: string;
  description: string;
  price: number;
  img?: string;
  emoji?: string;
  bread?: string;
  tags?: string[];
  category: "sanguche" | "combo" | "extra" | "bebida";
}

export const PRODUCTS: ProductDef[] = [
  { id: "crunchini", name: "Crunchini", description: "Mila de pollo, queso fontina, bacon, pickles de pepino, salsa ranch, doritos, sriracha.", price: 16500, img: "crunchini.png", bread: "Focaccia", tags: ["Collab Doritos"], category: "sanguche" },
  { id: "guchicken", name: "Guchicken", description: "Milanesa de pollo, queso fontina, coleslaw, mostaneza, aceite de oliva.", price: 14500, img: "guchicken.jpg", bread: "Focaccia", category: "sanguche" },
  { id: "crudo", name: "Crudo", description: "Jamón crudo, queso sardo, tomate, rúcula, pesto, aceite de oliva.", price: 14500, img: "crudo.jpg", bread: "Focaccia", tags: ["Sin TACC disponible"], category: "sanguche" },
  { id: "la-patrona", name: "La Patrona", description: "Milanesa de berenjena, queso sardo, cebolla pickle, tomate, rúcula, alioli alimonado, aceite de oliva.", price: 14500, img: "la_patrona.jpg", bread: "Focaccia", tags: ["Veggie"], category: "sanguche" },
  { id: "mortadela", name: "Mortadela", description: "Mortadela con pistacho, stracciatella, queso sbrinz, pesto, aceite de oliva.", price: 14500, img: "mortadela.jpg", bread: "Focaccia", tags: ["Sin TACC disponible"], category: "sanguche" },
  { id: "combo-guchi", name: "Combo Guchi", description: "Sanguche clásico + boniatos + gaseosa. No aplica con Crunchini.", price: 20000, emoji: "🧺", tags: ["El picnic completo"], category: "combo" },
  { id: "boniatos", name: "Boniatos", description: "Boniato frito crocante.", price: 4000, emoji: "🍠", category: "extra" },
  { id: "gaseosa", name: "Gaseosa", description: "Línea Coca-Cola.", price: 3000, emoji: "🥤", category: "bebida" },
  { id: "limonada", name: "Limonada", description: "Limón, menta y jengibre.", price: 3500, emoji: "🍋", category: "bebida" },
  { id: "soda", name: "Soda crocante", description: "Soda de la casa.", price: 4500, emoji: "🫧", category: "bebida" },
  { id: "vermouth", name: "Vermouth", description: "Vermouth de la casa.", price: 4500, emoji: "🍸", category: "bebida" },
  { id: "cerveza", name: "Cerveza", description: "Lata o porrón.", price: 4500, emoji: "🍺", category: "bebida" },
  { id: "agua", name: "Agua saborizada", description: "Agua saborizada.", price: 3000, emoji: "💧", category: "bebida" },
];

export const productOf = (id: string) => PRODUCTS.find((p) => p.id === id)!;

/** Initial stock, copied from src/lib/store.ts (same product order as PRODUCTS). */
export const STOCK: Record<string, number[]> = {
  ciudad: [7, 12, 8, 10, 6, 20, 20, 30, 15, 8, 6, 18, 12],
  chacras: [4, 9, 5, 7, 0, 12, 12, 18, 10, 5, 4, 10, 8],
  uspallata: [6, 8, 4, 5, 4, 15, 10, 15, 8, 4, 0, 12, 10],
  cordoba: [5, 10, 6, 8, 5, 14, 14, 20, 12, 6, 3, 14, 10],
};

/** Happy Guchi: 15% off Guchicken in ciudad / chacras / cordoba. */
export const PROMO = { percent: 15, label: "15% OFF" } as const;

export const ORDER = {
  id: "#10482",
  number: "10482",
  customer: "Martina",
  phone: "261 555 0142",
  product: "Guchicken",
  price: 14500,
  discount: 2175,
  total: 12325,
  branch: "Ciudad",
  branchName: 'Guchini "La Casa"',
  address: "San Lorenzo 577, Ciudad",
} as const;

/** Same format as src/lib/format.ts (es-AR currency, no decimals): "$ 14.500". */
export const ars = (n: number) => "$\u00a0" + num(n);
export const num = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
