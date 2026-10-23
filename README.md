# Guchini Takeaway

Functional demo of a first-party online takeaway channel for
[Guchini](https://www.guchini.com.ar/), a sandwich chain in Mendoza,
Argentina. Simulates the full cycle: the
customer orders and pays online, the order lands live on the kitchen
panel, staff advance its status, and the customer gets notified via
WhatsApp.

**Live demo:** https://guchini-takeaway.vercel.app

Open `/` (customer side) in one window and `/local` (kitchen panel) in
another — state syncs across tabs in real time via `localStorage`.

## What it does

- **Customer flow** — branded home, branch picker, menu with live stock
  and promos, cart, checkout with scheduled pickup, simulated Mercado
  Pago, confirmation and order tracking.
- **Kitchen panel** (`/local`) — incoming orders appear live; staff
  advance them through Confirm → Prepare → Ready → Deliver.
- **Admin** (`/admin`) — per-branch stock, promos with usage counters,
  sales and conversion funnel. Setting a product to 0 makes it SOLD OUT
  on the menu instantly.
- **WhatsApp notifications** — the panel's "Send WhatsApp" button opens
  `wa.me` with a pre-filled message to the customer's phone: zero API
  cost, zero approved templates, zero setup.

## Routes

| Route | What it is |
|-------|------------|
| `/` | Home with real branding, featured items, locations |
| `/pedir` | Branch selection |
| `/pedir/[sucursal]` | Menu with stock, SOLD OUT and per-branch promos |
| `/pedir/[sucursal]/carrito` | Cart with applied discounts |
| `/pedir/[sucursal]/checkout` | Customer data + scheduled pickup |
| `/pago` | Simulated Mercado Pago (approved / rejected) |
| `/confirmacion/[id]` | Confirmation + WhatsApp preview |
| `/pedido/[id]` | Order status tracking |
| `/local` | Kitchen orders panel |
| `/admin` | Stock, promos, sales and funnel |

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 ·
Zustand (persist) · npm

Everything runs client-side: no backend, no real Mercado Pago or
WhatsApp API.

## Engineering notes

- **Only paid orders exist** — an approved payment is the single event
  that creates the order, decrements stock and pushes it to the kitchen
  panel. A rejected payment leaves no residue.
- **Cart is scoped to a branch** — switching branches empties it, since
  stock and promos are per-location and an order can't mix origins.
- **Per-branch stock pools** — each location manages its own digital
  stock, which avoids overselling against the counter without a POS
  integration.
- **Cross-tab sync via `localStorage`** — the customer tab and the
  kitchen panel share state through Zustand's `persist` middleware, so a
  single browser demos the full loop with no realtime infrastructure.

## Getting started

No environment variables needed.

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts: `npm run build`, `npm run lint`.
