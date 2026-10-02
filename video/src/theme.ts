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

/* Demo data — keep in sync with src/lib/data.ts */
export const BRANCHES = [
  { id: "ciudad", name: "Ciudad", address: "San Lorenzo 577" },
  { id: "chacras", name: "Chacras", address: "Italia 5475" },
  { id: "uspallata", name: "Uspallata", address: "Ruta N7 km 1151" },
  { id: "cordoba", name: "Nueva Córdoba", address: "Buenos Aires 518" },
] as const;

export const MENU = [
  { id: "guchicken", name: "Guchicken", price: 14500, img: "guchicken.jpg" },
  { id: "crunchini", name: "Crunchini", price: 16500, img: "crunchini.png" },
  { id: "crudo", name: "Crudo", price: 14500, img: "crudo.jpg" },
  { id: "la-patrona", name: "La Patrona", price: 14500, img: "la_patrona.jpg" },
  { id: "mortadela", name: "Mortadela", price: 14500, img: "mortadela.jpg" },
] as const;

export const ORDER = {
  id: "#10482",
  customer: "Martina",
  phone: "261 555 0142",
  product: "Guchicken",
  productDetail: "Milanesa de pollo, queso fontina, coleslaw, focaccia",
  price: 14500,
  branch: "Ciudad",
  address: "San Lorenzo 577",
} as const;

export const ars = (n: number) => `$${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
