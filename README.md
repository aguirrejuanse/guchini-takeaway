# Guchini Takeaway — demo

Demo navegable del canal propio de takeaway para Guchini. Simula el ciclo
completo: el cliente pide y paga online, el pedido entra en vivo al panel del
local, cocina avanza los estados, y el cliente recibe el aviso por WhatsApp.

Pensada para presentar el pitch en ~90 segundos: abrir `/` (cliente) en una
ventana y `/local` (panel) en otra — el estado se sincroniza entre pestañas
via `localStorage`.

## Correr

```bash
npm install
npm run dev   # http://localhost:3000
```

## Rutas

| Ruta | Qué es |
|------|--------|
| `/` | Home con branding real, destacados (precargan el carrito) y locales |
| `/pedir` | Selección de sucursal |
| `/pedir/[sucursal]` | Menú con stock, SOLD OUT y promos por sucursal |
| `/pedir/[sucursal]/carrito` | Carrito con descuentos |
| `/pedir/[sucursal]/checkout` | Datos + "¿En cuánto llegás?" |
| `/pago` | Mercado Pago simulado (aprobado / rechazado) |
| `/confirmacion/[id]` | Confirmación + preview del WhatsApp |
| `/pedido/[id]` | Tracking del estado |
| `/local` | Panel de pedidos del local |
| `/admin` | Stock, promos, ventas y funnel |

Stack: Next.js 15 (App Router) + Tailwind 4 + Zustand persist. Todo simulado
en el browser: sin backend, MP ni WhatsApp API reales.

## Decisiones tomadas

### Regla de oro

Solo existen pedidos pagados. El pago aprobado es el evento que crea la
orden, descuenta stock y la manda al panel. Un pago rechazado no deja
residuos.

### Carrito por sucursal

El carrito pertenece a una sucursal. Cambiar de sucursal lo vacía — el
stock y las promos son por local, y un pedido no puede mezclar orígenes.

### Stock por sucursal, sin POS (B1)

Cada sucursal configura su propio pool de stock digital. Sin integración POS
en B1, esto evita el overselling contra el mostrador. Integración real queda
para B2 y depende de qué POS usen (Fudo tiene API pública en plan Pro;
Maxirest solo via partners).

### WhatsApp via wa.me

El botón "Enviar WhatsApp" del panel abre `wa.me` con el mensaje armado al
celular del cliente. Cero costo de API, cero templates aprobados, cero
setup. La API de WhatsApp Business queda para B2 si escala.

### Pedido programado ("¿En cuánto llegás?")

En checkout el cliente elige "lo antes posible" o "en 30/45/60/90 min".
Pensado para Uspallata: el que viene por la ruta pide cuando tiene señal y
retira al llegar. En el panel, los programados van a una sección aparte que
los promueve a la cola activa 15 min antes del retiro.

Reglas pendientes de definir con el cliente:

- Ventana de retiro (¿qué pasa si llega tarde?).
- Cutoff respecto al cierre.
- Precio congelado al pagar (promo aplica a la hora de compra, no de retiro).
- Stock reservado al pagar; cancelar lo devuelve (implementado).

### Offline tolerance (lado cliente)

El cliente en ruta tiene señal intermitente. Estrategia B2:

- PWA con app shell y menú cacheados (serwist + manifest).
- Carrito persistente (ya: localStorage).
- Cola de submit con idempotency key — reintentos no duplican pedidos.
- iOS no tiene Background Sync: reintentar al volver al foco.
- El pago siempre requiere conexión (MP no funciona offline).

Lado local: el panel necesita sobrevivir cortes — backend con persistencia
offline (Firestore/Supabase) + heartbeat de sucursal para pausar la
recepción si el local queda sin conexión.

### Arquitectura B1 → B2

B1: modular monolith (orders, products, inventory, branches, payments,
promotions, notifications, analytics).

B2 con eventos: tabla `events` append-only en Postgres, outbox pattern para
notificaciones, consumers idempotentes, projections para panel y reportes.
Supabase cubre Postgres + realtime + edge functions sin infra propia.

### Preguntas abiertas para la reunión

- ¿Qué POS usan? (define el costo de la integración B2)
- ¿Quién emite el comprobante fiscal? (ARCA — no está en el PRD)
- Ya tienen "10% OFF en efectivo" — les duelen las comisiones, pero el
  canal online tiene fee de MP. El argumento es demanda nueva + datos, no
  solo ahorro.
