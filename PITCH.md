# Pitch — Guchini Takeaway

## El contexto (qué ya sabemos de ellos)

- Sanguchería viral, take away nativo desde el día 1.
- Filas constantes. El producto SE AGOTA antes del cierre.
- 4 sucursales: Ciudad, Chacras, Uspallata (ruta), Nueva Córdoba (1ra franquicia).
- Ya tienen "10% OFF en efectivo" — les duelen las comisiones de medios de pago.
- Están armando centro de producción y evaluando más franquicias.

## La propuesta en una frase

> Un canal propio de pedidos online para retirar — con su marca, sus datos
> y su stock en tiempo real — que crece con cada sucursal y franquicia.

## Demo script (~90 seg)

1. **Home** (`/`): marca real, destacados, locales. "Así se vería SU app, no
   la de un tercero."
2. **Cliente**: click en Guchicken → elegir sucursal → ya está en el carrito
   → checkout → "¿En cuánto llegás?" (pedido programado) → pagar.
3. **Panel** (`/local` en otra ventana): el pedido aparece EN VIVO. Avanzar
   Confirmar → Preparar → Listo → aparece el botón de WhatsApp real
   (`wa.me`, desde su propio número, sin costo de API) → Entregar.
4. **Admin** (`/admin`): stock por sucursal en vivo, promo activable con
   contador de usos, funnel de conversión. "Esto es lo que un marketplace
   nunca les da: sus propios datos."
5. **SOLD OUT**: poner un producto en 0 desde admin → desaparece del menú
   en vivo. "El cliente nunca paga algo que no hay."

## Diferenciales vs las alternativas

| vs | Nuestro argumento |
|----|-------------------|
| Marketplace (PYa, etc.) | Sin comisión por pedido, su marca, sus datos, takeaway nativo (no delivery) |
| Tienda del POS (ej. Fudo "Tu Delivery") | Branding propio, promos medibles, funnel analytics, pedido programado, multi-sucursal/franquicia real |
| Pedir por WhatsApp/IG | La app es fuente de verdad: stock, estados, pagos. WhatsApp solo notifica |

## Lo que les vendemos de verdad

1. **Demanda anticipada**: ven a las 17hs que a las 20hs tienen 40
   sanguches comprometidos → producción informada, menos quiebre de stock.
2. **Promos medibles**: "¿el 2x1 funcionó?" con números, no con sensación.
3. **Franquicia-ready**: cada nuevo local es una sucursal más en el sistema,
   no un sistema nuevo. Datos comparables entre locales.
4. **La fila se vuelve opcional**: pedir antes, retirar sin esperar.

## Modelo comercial propuesto

- Setup único + fee mensual **por sucursal**.
- Crece solo con cada franquicia que abran.
- (Alternativa: revenue share bajo sobre ventas del canal — alinear
  incentivos, pero más difícil de auditar para ellos.)

## Objeciones esperadas

- **"Ya tenemos tienda del POS"** → la nuestra es su marca + datos + promos
  medibles + pedido programado. La del POS es genérica.
- **"El pago online tiene comisión"** → sí, MP cobra. Pero abre demanda
  nueva (anticipado, sin fila, turistas que pasan por la ruta) y los datos
  son de ustedes. Y vs marketplace, el fee es mucho menor.
- **"La cocina no va a usar la tablet"** → el panel es un botón por pedido.
  Diseñado para un sábado 22hs con la casa llena.
- **"¿Y si se cae internet del local?"** → el sistema detecta el local
  offline y pausa pedidos ahí. No se vende lo que nadie puede ver.

## Preguntas que tenemos que hacerles

1. ¿Qué POS usan hoy? (define la integración de stock a futuro)
2. ¿Quién emite factura de las ventas online? (ARCA)
3. ¿Cuántos sanguches/hora puede despachar cada cocina? (capacidad de slots)
4. ¿Cómo manejan hoy el stock cuando se agota algo?
5. ¿Cuánto vale para ustedes saber qué promo genera ventas?

## Roadmap

- **B1** (lo que ven en la demo): takeaway, multi-sucursal, MP, stock,
  promos, panel, reportes, pedido programado.
- **B2**: PWA offline para ruta, WhatsApp API automático, integración POS,
  facturación electrónica, fidelización, delivery.
