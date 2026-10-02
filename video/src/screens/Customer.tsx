import React from "react";
import { useCurrentFrame } from "remotion";
import { Photo, progress, useTyped } from "../kit";
import { ars, BRANCHES, C, FONTS, ORDER, PRODUCTS, PROMO, STOCK, type ProductDef } from "../theme";
import {
  display,
  FadeUp,
  MobileMain,
  PopIn,
  QtyStepper,
  SHADOW_LG,
  SHADOW_MD,
  SHADOW_SM,
  SHADOW_XL,
  Spinner,
  TapHost,
  TRACK,
  TX,
  WaBubble,
  WebSectionTitle,
} from "./web";

/* Every screen here recreates a page of the real Next.js app, laid out at a 390px-wide mobile viewport
   (so Tailwind px values map 1:1). Scroll offsets are in page pixels. */

const INK_15 = "rgba(44,24,16,0.15)";
const INK_10 = "rgba(44,24,16,0.10)";
const INK_5 = "rgba(44,24,16,0.05)";

const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: C.paper, borderRadius: 12, boxShadow: SHADOW_SM, padding: 20, ...style }}>{children}</div>
);

const PrimaryButton: React.FC<{ children: React.ReactNode; bg?: string; tap?: number; style?: React.CSSProperties }> = ({
  children,
  bg = C.sun,
  tap,
  style,
}) => (
  <TapHost
    tap={tap}
    style={{
      borderRadius: 8,
      background: bg,
      color: "#fff",
      textAlign: "center",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      fontWeight: 600,
      ...TX.sm,
      padding: "14px 0",
      boxShadow: SHADOW_MD,
      ...style,
    }}
  >
    {children}
  </TapHost>
);

/* ------------------------------------------------------------------ /pedir */

export const PedirScreen: React.FC<{ at?: number; tapBranch?: number }> = ({ at = 0, tapBranch }) => {
  const frame = useCurrentFrame();
  const pressed = tapBranch !== undefined && frame >= tapBranch - 2;
  return (
    <MobileMain>
      <div style={{ marginTop: 40 }}>
        <WebSectionTitle centered>¿Por dónde retirás?</WebSectionTitle>
        <p style={{ margin: "12px auto 0", maxWidth: 448, textAlign: "center", color: C.cocoa, ...TX.sm }}>
          Elegí la sucursal — el menú y el stock dependen de cada local.
        </p>
      </div>
      <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 16 }}>
        {BRANCHES.map((b, i) => (
          <FadeUp key={b.id} at={at} i={i * 2.4}>
            <div
              style={{
                position: "relative",
                borderRadius: 12,
                background: C.paper,
                padding: 20,
                boxShadow: i === 0 && pressed ? SHADOW_XL : SHADOW_SM,
                transform: i === 0 && pressed ? "translateY(-4px)" : undefined,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={display("xl", TRACK.wide)}>{b.name}</div>
                  <div style={{ marginTop: 4, color: C.cocoa, fontWeight: 500, ...TX.sm }}>{b.address}</div>
                  <div style={{ color: "rgba(107,91,71,0.8)", ...TX.xs }}>{b.addressDetail}</div>
                  <div style={{ marginTop: 6, color: C.cocoa, fontWeight: 500, ...TX.xs }}>{b.hours}</div>
                  {b.cafeHours ? <div style={{ color: C.guchi, fontWeight: 600, ...TX.xs }}>☕ {b.cafeHours}</div> : null}
                </div>
                <div style={{ flexShrink: 0, textAlign: "right" }}>
                  <span
                    style={{
                      display: "inline-block",
                      borderRadius: 999,
                      background: C.guchi,
                      color: "#fff",
                      padding: "4px 12px",
                      fontSize: 11,
                      lineHeight: "16px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.025em",
                    }}
                  >
                    Abierto
                  </span>
                  <div style={{ marginTop: 6, color: C.cocoa, fontWeight: 600, ...TX.xs }}>Retiro en {b.eta}</div>
                </div>
              </div>
              {i === 0 && tapBranch !== undefined && <TapAnchor at={tapBranch} />}
            </div>
          </FadeUp>
        ))}
      </div>
    </MobileMain>
  );
};

/** Invisible element centered in its (positioned) parent that hosts a tap ripple. */
const TapAnchor: React.FC<{ at: number; y?: string }> = ({ at, y = "50%" }) => (
  <TapHostAbs at={at} y={y} />
);
import { Tap } from "../kit";
const TapHostAbs: React.FC<{ at: number; y: string }> = ({ at, y }) => <Tap at={at} x="62%" y={y} />;

/* --------------------------------------------------------- /pedir/[branch] */

const SERIF = 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';

export const ProductCard: React.FC<{
  p: ProductDef;
  index: number;
  stock: number;
  discount?: { percent?: number; fixed?: number };
  qty?: number;
  tapAdd?: number;
  enterAt?: number;
}> = ({ p, index, stock, discount, qty = 0, tapAdd, enterAt = 0 }) => {
  const unit = discount ? (discount.percent ? Math.round((p.price * discount.percent) / 100) : discount.fixed ?? 0) : 0;
  const soldOut = stock <= 0;
  return (
    <FadeUp at={enterAt} i={Math.min(index, 10) * 2.1}>
      <div
        style={{
          overflow: "hidden",
          borderRadius: 16,
          background: C.paper,
          boxShadow: SHADOW_SM,
          opacity: soldOut ? 0.7 : 1,
        }}
      >
        <div style={{ position: "relative", height: 176, width: "100%", overflow: "hidden", background: C.cream }}>
          {p.img ? (
            <Photo src={p.img} style={{ filter: soldOut ? "grayscale(1)" : undefined }} />
          ) : (
            <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", fontSize: 60, lineHeight: 1 }}>
              {p.emoji}
            </div>
          )}
          {unit > 0 && !soldOut ? (
            <span
              style={{
                position: "absolute",
                left: 12,
                top: 12,
                borderRadius: 6,
                background: C.tomato,
                color: "#fff",
                padding: "4px 8px",
                fontSize: 11,
                lineHeight: "16px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.025em",
                boxShadow: SHADOW_MD,
              }}
            >
              {discount?.percent ? `${discount.percent}% off` : `$${(discount?.fixed ?? 0).toLocaleString("es-AR")} off`}
            </span>
          ) : null}
          {soldOut ? (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(44,24,16,0.4)" }}>
              <span style={{ ...display("2xl", TRACK.widest), color: "#fff" }}>Agotado</span>
            </div>
          ) : null}
        </div>
        <div style={{ padding: 16 }}>
          <div style={display("lg", TRACK.wide)}>{p.name}</div>
          <p style={{ margin: "4px 0 0", color: C.cocoa, ...TX.sm, lineHeight: 1.375 }}>{p.description}</p>
          <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6 }}>
            {p.bread ? (
              <span style={{ borderRadius: 6, background: "rgba(255,191,51,0.15)", padding: "2px 6px", fontFamily: SERIF, fontStyle: "italic", color: C.mango, ...TX.xs }}>
                Pan: {p.bread}
              </span>
            ) : null}
            {p.tags?.map((t) => (
              <span key={t} style={{ borderRadius: 6, background: "rgba(255,140,204,0.2)", padding: "2px 6px", fontSize: 11, lineHeight: "16px", fontWeight: 600, color: C.ink }}>
                {t}
              </span>
            ))}
          </div>
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              {unit > 0 ? (
                <span style={{ marginRight: 8, color: C.cocoa, fontWeight: 600, textDecoration: "line-through", ...TX.sm }}>{ars(p.price)}</span>
              ) : null}
              <span style={{ color: C.mango, fontWeight: 700, ...TX.lg }}>{ars(p.price - unit)}</span>
              {!soldOut && stock <= 5 ? (
                <div style={{ color: C.tomato, fontSize: 11, lineHeight: "16px", fontWeight: 600 }}>¡Quedan {stock}!</div>
              ) : null}
            </div>
            {soldOut ? (
              <span style={{ borderRadius: 8, background: C.cream, padding: "6px 12px", color: C.cocoa, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.025em", ...TX.xs }}>
                Agotado
              </span>
            ) : qty === 0 ? (
              <TapHost
                tap={tapAdd}
                style={{
                  borderRadius: 8,
                  background: C.sun,
                  color: "#fff",
                  padding: "6px 16px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.025em",
                  boxShadow: SHADOW_MD,
                  ...TX.xs,
                }}
              >
                Agregar
              </TapHost>
            ) : (
              <QtyStepper qty={qty} />
            )}
          </div>
        </div>
      </div>
    </FadeUp>
  );
};

const discountFor = (productId: string, branch: string) => {
  if (productId === "guchicken" && ["ciudad", "chacras", "cordoba"].includes(branch)) return { percent: PROMO.percent };
  if (productId === "combo-guchi" && branch === "uspallata") return { fixed: 2000 };
  return undefined;
};

/** Page height of the menu above the first product card, used to aim scrolls. */
export const MenuScreen: React.FC<{
  branch: "ciudad" | "uspallata";
  scroll?: number;
  at?: number;
  /** Frame at which Guchicken was added (stepper shows 1). */
  addedAt?: number;
  tapAdd?: number;
  /** Override Guchicken stock (admin demo). */
  guchickenStock?: number;
}> = ({ branch, scroll = 0, at = 0, addedAt, tapAdd, guchickenStock }) => {
  const frame = useCurrentFrame();
  const b = BRANCHES.find((x) => x.id === branch)!;
  const sections = [
    { title: "Sanguchinis", items: PRODUCTS.filter((p) => p.category === "sanguche"), grid: false },
    { title: "Combos y extras", items: PRODUCTS.filter((p) => p.category === "combo" || p.category === "extra"), grid: true },
    { title: "Bebidas", items: PRODUCTS.filter((p) => p.category === "bebida"), grid: true },
  ];
  const added = addedAt !== undefined && frame >= addedAt;
  return (
    <MobileMain scroll={scroll} pb={112}>
      <header style={{ marginTop: 32 }}>
        <div style={{ color: C.tomato, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", ...TX.xs }}>Retirás en</div>
        <div style={{ marginTop: 4, ...display("3xl", TRACK.widest) }}>{b.name}</div>
        <div style={{ marginTop: 4, color: C.cocoa, fontWeight: 500, ...TX.sm }}>
          {b.address} · {b.hours}
        </div>
      </header>
      {sections.map((s) => (
        <section key={s.title} style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={display("xl", TRACK.wider)}>{s.title}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
            {s.items.map((p, i) => {
              const idx = PRODUCTS.indexOf(p);
              const stock = p.id === "guchicken" && guchickenStock !== undefined ? guchickenStock : STOCK[branch][idx];
              return (
                <ProductCard
                  key={p.id}
                  p={p}
                  index={i}
                  stock={stock}
                  discount={discountFor(p.id, branch)}
                  qty={p.id === "guchicken" && added ? 1 : 0}
                  tapAdd={p.id === "guchicken" ? tapAdd : undefined}
                  enterAt={at}
                />
              );
            })}
          </div>
        </section>
      ))}
    </MobileMain>
  );
};

/** Scroll that brings the Guchicken card (Ciudad, with promo badge and AGREGAR) into the viewport. */
export const MENU_SCROLL_GUCHICKEN = 330;

export const CartBar: React.FC<{ at: number; tap?: number }> = ({ at, tap }) => {
  const frame = useCurrentFrame();
  const p = progress(frame, at, at + 8);
  if (frame < at) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: 16, zIndex: 20, opacity: p, transform: `translateY(${(1 - p) * 24}px)` }}>
      <TapHost
        tap={tap}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: 8,
          background: C.guchi,
          color: "#fff",
          padding: "14px 20px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          boxShadow: SHADOW_XL,
          fontFamily: FONTS.sans,
          ...TX.sm,
        }}
      >
        <span>Ver pedido · 1</span>
        <span style={{ fontFamily: FONTS.display, fontSize: 16, lineHeight: "24px", textTransform: "none", letterSpacing: "0.025em", fontWeight: 400 }}>
          {ars(ORDER.total)}
        </span>
      </TapHost>
    </div>
  );
};

/* ------------------------------------------------------ /pedir/ciudad/carrito */

export const CarritoScreen: React.FC<{ at?: number; tapContinue?: number }> = ({ at = 0, tapContinue }) => (
  <MobileMain>
    <div style={{ marginTop: 32, color: C.cocoa, fontWeight: 600, ...TX.sm }}>← Seguir pidiendo</div>
    <div style={{ marginTop: 12, ...display("3xl", TRACK.widest) }}>Tu pedido</div>
    <div style={{ color: C.cocoa, fontWeight: 500, ...TX.sm }}>Retirás en {ORDER.branchName}</div>

    <div style={{ marginTop: 24 }}>
      <FadeUp at={at}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: 12, background: C.paper, padding: 16, boxShadow: SHADOW_SM }}>
          <div>
            <div style={{ ...display("base", TRACK.wide) }}>Guchicken</div>
            <div style={{ color: C.cocoa, fontWeight: 500, ...TX.sm }}>
              {ars(ORDER.total)} c/u
              <span style={{ marginLeft: 8, borderRadius: 4, background: C.tomato, color: "#fff", padding: "2px 6px", fontSize: 10, lineHeight: "16px", fontWeight: 700, textTransform: "uppercase" }}>
                Promo
              </span>
            </div>
          </div>
          <QtyStepper qty={1} />
        </div>
      </FadeUp>
    </div>

    <Card style={{ marginTop: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", color: C.cocoa, fontWeight: 500, ...TX.sm }}>
        <span>Subtotal</span>
        <span>{ars(ORDER.price)}</span>
      </div>
      <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between", color: C.guchi, fontWeight: 600, ...TX.sm }}>
        <span>Descuentos</span>
        <span>−{ars(ORDER.discount)}</span>
      </div>
      <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${INK_10}`, display: "flex", justifyContent: "space-between", ...display("xl", TRACK.wide), textTransform: "none" }}>
        <span>TOTAL</span>
        <span style={{ color: C.mango }}>{ars(ORDER.total)}</span>
      </div>
    </Card>

    <PrimaryButton tap={tapContinue} style={{ marginTop: 24 }}>
      Continuar al pago
    </PrimaryButton>
  </MobileMain>
);

/* ----------------------------------------------------- /pedir/ciudad/checkout */

/** Index of the pickup chip Martina taps. ASAP keeps her order in the active queue (any delay makes it "programado" in the real app). */
const PICKED_ETA = 0;

const PICKUP = [
  { label: "Lo antes posible", hint: "≈20 min" },

  { label: "En 30 min", hint: "" },
  { label: "En 45 min", hint: "" },
  { label: "En 1 h", hint: "" },
  { label: "En 1:30 h", hint: "" },
];

const Input: React.FC<{ placeholder: string; value: string; focused: boolean }> = ({ placeholder, value, focused }) => {
  const frame = useCurrentFrame();
  const caret = focused && Math.floor(frame / 15) % 2 === 0;
  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        borderRadius: 8,
        border: `1px solid ${focused ? C.sun : INK_15}`,
        boxShadow: focused ? "0 0 0 2px rgba(255,191,51,0.3)" : undefined,
        background: "#fff",
        padding: "12px 14px",
        fontWeight: 500,
        ...TX.sm,
        display: "flex",
        alignItems: "center",
        minHeight: 46,
      }}
    >
      {value ? <span>{value}</span> : <span style={{ color: "rgba(107,91,71,0.6)" }}>{placeholder}</span>}
      <span style={{ width: 1, height: 18, background: caret ? C.ink : "transparent", marginLeft: value ? 1 : -1, position: value ? undefined : "absolute" }} />
    </div>
  );
};

export const CheckoutScreen: React.FC<{
  at?: number;
  scroll?: number;
  typeName: number;
  typePhone: number;
  pickEta: number;
  tapPay: number;
}> = ({ at = 0, scroll = 0, typeName, typePhone, pickEta, tapPay }) => {
  const frame = useCurrentFrame();
  const name = useTyped(ORDER.customer, typeName, 9);
  const phone = useTyped(ORDER.phone, typePhone, 14);
  const eta = PICKED_ETA;
  return (
    <MobileMain scroll={scroll}>
      <div style={{ marginTop: 32, color: C.cocoa, fontWeight: 600, ...TX.sm }}>← Volver al pedido</div>
      <div style={{ marginTop: 12, ...display("3xl", TRACK.widest) }}>Último paso</div>

      <FadeUp at={at}>
        <Card style={{ marginTop: 24 }}>
          <div style={display("lg", TRACK.wide)}>Tus datos</div>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12, position: "relative" }}>
            <Input placeholder="Nombre y apellido" value={name} focused={frame >= typeName && frame < typePhone} />
            <Input placeholder="Celular (para el WhatsApp)" value={phone} focused={frame >= typePhone && frame < pickEta} />
            <Input placeholder="Email (opcional, para el comprobante)" value="" focused={false} />
          </div>
        </Card>
      </FadeUp>

      <Card style={{ marginTop: 16 }}>
        <div style={display("lg", TRACK.wide)}>¿En cuánto llegás?</div>
        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
          {PICKUP.map((o, i) => {
            const sel = i === eta;
            return (
              <TapHost
                key={o.label}
                tap={i === PICKED_ETA ? pickEta : undefined}
                style={{
                  borderRadius: 8,
                  padding: "8px 14px",
                  fontWeight: 600,
                  ...TX.xs,
                  background: sel ? C.guchi : INK_5,
                  color: sel ? "#fff" : C.cocoa,
                  boxShadow: sel ? SHADOW_MD : undefined,
                }}
              >
                {o.label}
                {o.hint ? <span style={{ marginLeft: 4, opacity: 0.7 }}>{o.hint}</span> : null}
              </TapHost>
            );
          })}
        </div>
        <div style={{ marginTop: 10, color: C.cocoa, fontWeight: 500, ...TX.xs }}>
          {eta > 0
            ? "Pedido programado — lo preparamos para que esté listo cuando llegues."
            : "Lo arrancamos en cuanto confirmás el pago."}
        </div>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <div style={{ color: C.cocoa, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", ...TX.xs }}>Resumen</div>
        <div style={{ marginTop: 4, fontWeight: 500, ...TX.sm }}>1 productos · Retiro en {ORDER.branch}</div>
        <div style={{ marginTop: 4, color: C.mango, ...display("2xl", TRACK.wide), textTransform: "none" }}>{ars(ORDER.total)}</div>
      </Card>

      <TapHost
        tap={tapPay}
        style={{
          marginTop: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          background: C.mp,
          color: "#fff",
          padding: "16px 0",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          boxShadow: SHADOW_MD,
          ...TX.sm,
        }}
      >
        Pagar con Mercado Pago
      </TapHost>
      <div style={{ marginTop: 12, textAlign: "center", color: C.cocoa, fontWeight: 500, ...TX.xs }}>
        La orden se confirma solo cuando el pago se aprueba.
      </div>
    </MobileMain>
  );
};

/* ------------------------------------------------------------------- /pago */

export const PaymentScreen: React.FC<{ tapApprove: number; processingAt: number; viewH: number }> = ({
  tapApprove,
  processingAt,
  viewH,
}) => {
  const frame = useCurrentFrame();
  const processing = frame >= processingAt;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: C.cream,
        fontFamily: FONTS.sans,
        color: C.ink,
      }}
    >
      <div style={{ display: "flex", minHeight: viewH * 0.8, alignItems: "center", justifyContent: "center", padding: "0 16px" }}>
        <div style={{ width: "100%", maxWidth: 384, overflow: "hidden", borderRadius: 12, background: "#fff", boxShadow: SHADOW_XL }}>
          <div style={{ background: C.mp, color: "#fff", padding: "16px 20px" }}>
            <div style={display("lg", TRACK.wider)}>Mercado Pago</div>
            <div style={{ fontWeight: 500, opacity: 0.8, ...TX.xs }}>Checkout simulado — demo</div>
          </div>
          <div style={{ padding: 20 }}>
            <div style={{ color: C.cocoa, fontWeight: 500, ...TX.sm }}>Guchini Takeaway</div>
            <div style={{ ...display("3xl", TRACK.wide), textTransform: "none" }}>{ars(ORDER.total)}</div>
            {processing ? (
              <div style={{ marginTop: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "16px 0" }}>
                <Spinner />
                <div style={{ color: C.cocoa, fontWeight: 500, ...TX.sm }}>Procesando pago…</div>
              </div>
            ) : (
              <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 8 }}>
                <TapHost
                  tap={tapApprove}
                  style={{ borderRadius: 8, background: C.mp, color: "#fff", padding: "12px 0", textAlign: "center", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", ...TX.sm }}
                >
                  Simular pago aprobado
                </TapHost>
                <div style={{ borderRadius: 8, border: `1px solid ${INK_15}`, background: "#fff", padding: "12px 0", textAlign: "center", color: C.cocoa, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", ...TX.sm }}>
                  Simular pago rechazado
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------- /confirmacion/[id] */

export const ConfirmacionScreen: React.FC<{ at?: number; scroll?: number; tapStatus?: number }> = ({ at = 0, scroll = 0, tapStatus }) => (
  <MobileMain scroll={scroll}>
    <PopIn at={at} style={{ marginTop: 32 }}>
      <div style={{ borderRadius: 12, background: C.pine, padding: 32, textAlign: "center", color: "#fff", boxShadow: SHADOW_LG }}>
        <div style={{ fontFamily: FONTS.script, fontWeight: 700, color: C.sun, ...TX["3xl"] }}>¡listo, che!</div>
        <div style={{ marginTop: 4, ...display("3xl", TRACK.widest) }}>Pedido confirmado 🥪</div>
        <div style={{ marginTop: 8, color: C.sun, ...display("xl", TRACK.wider), textTransform: "none" }}>{ORDER.id}</div>
      </div>
    </PopIn>

    <Card style={{ marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 500, ...TX.sm }}>
        <span style={{ color: C.cocoa }}>Sucursal</span>
        <span>{ORDER.branchName}</span>
      </div>
      <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between", fontWeight: 500, ...TX.sm }}>
        <span style={{ color: C.cocoa }}>Retiro</span>
        <span>Hoy · ~08:27 p. m.</span>
      </div>
      <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px dashed ${INK_15}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 500, ...TX.sm }}>
          <span>1x Guchicken</span>
          <span>{ars(ORDER.total)}</span>
        </div>
      </div>
      <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${INK_10}`, display: "flex", justifyContent: "space-between", ...display("lg", TRACK.wide), textTransform: "none" }}>
        <span>TOTAL</span>
        <span style={{ color: C.mango }}>{ars(ORDER.total)}</span>
      </div>
    </Card>

    <div style={{ marginTop: 16, textAlign: "center", color: C.guchi, fontWeight: 600, ...TX.sm }}>
      Te avisamos por WhatsApp cuando esté listo.
    </div>

    <div style={{ marginTop: 12 }}>
      <WaBubble number={ORDER.number} branchName={ORDER.branchName} lines={["1x Guchicken"]} total={ars(ORDER.total)} />
    </div>

    <PrimaryButton tap={tapStatus} style={{ marginTop: 24 }}>
      Ver estado de mi pedido
    </PrimaryButton>
  </MobileMain>
);

/* ------------------------------------------------------------ /pedido/[id] */

export const STATUS_LABELS = ["Pagado", "Confirmado", "En preparación", "Listo para retirar", "Retirado"] as const;

export const TrackingScreen: React.FC<{ at?: number; step: number }> = ({ at = 0, step }) => (
  <MobileMain>
    <div style={{ marginTop: 32, ...display("3xl", TRACK.widest) }}>Pedido #{ORDER.number}</div>
    <div style={{ marginTop: 4, color: C.cocoa, fontWeight: 500, ...TX.sm }}>
      {ORDER.branchName} · Retiro estimado 08:27 p. m.
    </div>
    <div style={{ marginTop: 32 }}>
      {STATUS_LABELS.map((label, idx) => {
        const done = idx <= step;
        const current = idx === step;
        return (
          <FadeUp key={label} at={at} i={idx * 3.6}>
            <div style={{ display: "flex", alignItems: "stretch", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    lineHeight: "20px",
                    fontWeight: 700,
                    background: done ? C.guchi : INK_10,
                    color: done ? "#fff" : C.cocoa,
                    boxShadow: [done ? SHADOW_MD : null, current ? "0 0 0 4px rgba(255,191,51,0.5)" : null].filter(Boolean).join(", ") || undefined,
                  }}
                >
                  {done ? "✓" : idx + 1}
                </div>
                {idx < STATUS_LABELS.length - 1 ? <div style={{ width: 2, flex: 1, background: idx < step ? C.guchi : INK_10 }} /> : null}
              </div>
              <div style={{ paddingBottom: 28, paddingTop: 6 }}>
                <div style={{ ...display("lg", TRACK.wide), lineHeight: 1, color: done ? C.ink : "rgba(107,91,71,0.4)" }}>{label}</div>
                {current && idx === 3 ? (
                  <div style={{ marginTop: 6, color: C.guchi, fontWeight: 600, ...TX.sm }}>Ya podés pasar a retirarlo 🏃</div>
                ) : null}
              </div>
            </div>
          </FadeUp>
        );
      })}
    </div>
  </MobileMain>
);
