export interface Branch {
  id: string;
  name: string;
  shortName: string;
  address: string;
  addressDetail: string;
  hours: string;
  cafeHours?: string;
  eta: string;
  mapsUrl: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  bread?: string;
  price: number;
  image?: string;
  emoji?: string;
  tags?: string[];
  category: "sanguche" | "combo" | "extra" | "bebida";
}

export const BRANCHES: Branch[] = [
  {
    id: "ciudad",
    name: 'Guchini "La Casa"',
    shortName: "Ciudad",
    address: "San Lorenzo 577, Ciudad",
    addressDetail: "Frente a Plaza Italia · esq. 25 de Mayo",
    hours: "Todos los días · 12 a 23:30",
    eta: "20–30 min",
    mapsUrl:
      "https://www.google.com.ar/maps/place/Guchini+%7C+Ciudad/@-32.8924053,-68.8475252,17z",
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
    mapsUrl:
      "https://www.google.com/maps/place/Guchini+%7C+Chacras/@-32.9863015,-68.8814013,17z",
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
    mapsUrl:
      "https://www.google.com/maps/place/Guchini+%7C+Uspallata/@-32.5939795,-69.370604,17z",
  },
  {
    id: "cordoba",
    name: "Guchini Nueva Córdoba",
    shortName: "Nueva Córdoba",
    address: "Buenos Aires 518, Córdoba",
    addressDetail: "Esq. Rondeau · cerca del Blvd. Arturo Illia",
    hours: "Todos los días · 12 a 23:30",
    eta: "20–30 min",
    mapsUrl:
      "https://www.google.com/maps/place/Guchini+%7C+Nueva+C%C3%B3rdoba/@-31.4225736,-64.1854752,17z",
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "crunchini",
    name: "Crunchini",
    description:
      "Mila de pollo, queso fontina, bacon, pickles de pepino, salsa ranch, doritos, sriracha.",
    bread: "Focaccia",
    price: 16500,
    image: "/assets/crunchini.png",
    tags: ["Collab Doritos"],
    category: "sanguche",
  },
  {
    id: "guchicken",
    name: "Guchicken",
    description:
      "Milanesa de pollo, queso fontina, coleslaw, mostaneza, aceite de oliva.",
    bread: "Focaccia",
    price: 14500,
    image: "/assets/guchicken.jpg",
    category: "sanguche",
  },
  {
    id: "crudo",
    name: "Crudo",
    description:
      "Jamón crudo, queso sardo, tomate, rúcula, pesto, aceite de oliva.",
    bread: "Focaccia",
    price: 14500,
    image: "/assets/crudo.jpg",
    tags: ["Sin TACC disponible"],
    category: "sanguche",
  },
  {
    id: "la-patrona",
    name: "La Patrona",
    description:
      "Milanesa de berenjena, queso sardo, cebolla pickle, tomate, rúcula, alioli alimonado, aceite de oliva.",
    bread: "Focaccia",
    price: 14500,
    image: "/assets/la_patrona.jpg",
    tags: ["Veggie"],
    category: "sanguche",
  },
  {
    id: "mortadela",
    name: "Mortadela",
    description:
      "Mortadela con pistacho, stracciatella, queso sbrinz, pesto, aceite de oliva.",
    bread: "Focaccia",
    price: 14500,
    image: "/assets/mortadela.jpg",
    tags: ["Sin TACC disponible"],
    category: "sanguche",
  },
  {
    id: "combo-guchi",
    name: "Combo Guchi",
    description: "Sanguche clásico + boniatos + gaseosa. No aplica con Crunchini.",
    price: 20000,
    emoji: "🧺",
    tags: ["El picnic completo"],
    category: "combo",
  },
  {
    id: "boniatos",
    name: "Boniatos",
    description: "Boniato frito crocante.",
    price: 4000,
    emoji: "🍠",
    category: "extra",
  },
  {
    id: "gaseosa",
    name: "Gaseosa",
    description: "Línea Coca-Cola.",
    price: 3000,
    emoji: "🥤",
    category: "bebida",
  },
  {
    id: "limonada",
    name: "Limonada",
    description: "Limón, menta y jengibre.",
    price: 3500,
    emoji: "🍋",
    category: "bebida",
  },
  {
    id: "soda",
    name: "Soda crocante",
    description: "Soda de la casa.",
    price: 4500,
    emoji: "🫧",
    category: "bebida",
  },
  {
    id: "vermouth",
    name: "Vermouth",
    description: "Vermouth de la casa.",
    price: 4500,
    emoji: "🍸",
    category: "bebida",
  },
  {
    id: "cerveza",
    name: "Cerveza",
    description: "Lata o porrón.",
    price: 4500,
    emoji: "🍺",
    category: "bebida",
  },
  {
    id: "agua",
    name: "Agua saborizada",
    description: "Agua saborizada.",
    price: 3000,
    emoji: "💧",
    category: "bebida",
  },
];

export function productById(id: string): Product {
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) throw new Error(`Unknown product ${id}`);
  return product;
}

export function branchById(id: string): Branch {
  const branch = BRANCHES.find((b) => b.id === id);
  if (!branch) throw new Error(`Unknown branch ${id}`);
  return branch;
}
