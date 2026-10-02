import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Logo, Mascot, Photo, POPPY, progress, SectionTitle, Tap, useSpring, useTyped } from "../kit";
import { ars, BRANCHES, C, FONTS, MENU, ORDER } from "../theme";

/* All coordinates are in phone-screen pixels (390×844). */

const AppHeader: React.FC<{ branch?: string }> = ({ branch }) => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 108,
      paddingTop: 50,
      background: C.cream,
      boxShadow: "0 6px 14px -10px rgba(44,24,16,0.35)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      paddingLeft: 18,
      paddingRight: 18,
      zIndex: 5,
    }}
  >
    <Logo height={36} />
    <div
      style={{
        fontSize: 12,
        fontWeight: 700,
        background: C.paper,
        borderRadius: 999,
        padding: "6px 12px",
        boxShadow: "0 2px 8px rgba(44,24,16,0.08)",
      }}
    >
      📍 {branch ?? "Elegí sucursal"}
    </div>
  </div>
);

const ProductTile: React.FC<{
  name: string;
  price: number;
  img: string;
  soldOut?: number;
  highlight?: number;
}> = ({ name, price, img, soldOut = 0, highlight = 0 }) => (
  <div
    style={{
      background: C.paper,
      borderRadius: 18,
      overflow: "hidden",
      boxShadow: `0 6px 18px rgba(44,24,16,0.08), 0 0 0 ${highlight * 3}px ${C.sun}`,
      position: "relative",
    }}
  >
    <div style={{ height: 124, position: "relative", filter: `grayscale(${soldOut})` }}>
      <Photo src={img} />
    </div>
    <div style={{ padding: "10px 12px 12px", opacity: 1 - soldOut * 0.4 }}>
      <div style={{ fontFamily: FONTS.display, fontSize: 19, letterSpacing: 1, textTransform: "uppercase" }}>{name}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
        <span style={{ fontWeight: 700, fontSize: 15 }}>{ars(price)}</span>
        <span
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: soldOut > 0.5 ? "#ddd" : C.sun,
            display: "grid",
            placeItems: "center",
            fontWeight: 800,
            fontSize: 20,
          }}
        >
          +
        </span>
      </div>
    </div>
    {soldOut > 0 && (
      <div
        style={{
          position: "absolute",
          top: 44,
          left: "50%",
          transform: `translateX(-50%) rotate(-8deg) scale(${0.6 + soldOut * 0.4})`,
          opacity: soldOut,
          background: C.tomato,
          color: C.paper,
          fontFamily: FONTS.display,
          fontSize: 24,
          letterSpacing: 2,
          padding: "4px 14px",
          borderRadius: 8,
          border: `3px solid ${C.paper}`,
          whiteSpace: "nowrap",
          boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
        }}
      >
        SOLD OUT
      </div>
    )}
  </div>
);

/** Home: hero + grid. `scroll` in px; `soldOut` 0..1 stamps the Guchicken tile. */
export const HomeScreen: React.FC<{ scroll?: number; soldOut?: number; highlight?: number; branch?: string }> = ({
  scroll = 0,
  soldOut = 0,
  highlight = 0,
  branch,
}) => (
  <AbsoluteFill style={{ background: C.cream }}>
    <AppHeader branch={branch} />
    <div style={{ position: "absolute", top: 112 - scroll, left: 14, right: 14 }}>
      <div
        style={{
          height: 200,
          borderRadius: 24,
          background: C.pine,
          padding: "26px 22px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ fontFamily: FONTS.display, color: C.cream, fontSize: 46, lineHeight: 1, letterSpacing: 2 }}>
          UN MANSO
          <br />
          SANGUCHE
        </div>
        <div style={{ fontFamily: FONTS.script, fontWeight: 700, color: C.sun, fontSize: 30, marginTop: 10 }}>
          pedí y retirá sin fila
        </div>
        <Mascot height={120} style={{ position: "absolute", right: -6, bottom: 4, filter: "brightness(0) invert(1)", opacity: 0.9 }} />
      </div>
      <div style={{ margin: "22px 4px 14px" }}>
        <SectionTitle size={20}>Sanguches</SectionTitle>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {MENU.map((p) => (
          <ProductTile
            key={p.id}
            name={p.name}
            price={p.price}
            img={p.img}
            soldOut={p.id === "guchicken" ? soldOut : 0}
            highlight={p.id === "guchicken" ? highlight : 0}
          />
        ))}
      </div>
    </div>
  </AbsoluteFill>
);

/** Guchicken tile center once the home has scrolled by `MENU_SCROLL`. */
export const MENU_SCROLL = 130;
export const GUCHICKEN_TAP = { x: 101, y: 112 - MENU_SCROLL + 268 + 90 };

const SHEET_TOP = 330;
const ROW_TOP = SHEET_TOP + 128;
const ROW_H = 74;

/** Bottom sheet: pick a branch. Rises at `at`, selects Ciudad at `pick`, dismisses at `close`. */
export const BranchSheet: React.FC<{ at: number; pick: number; close: number }> = ({ at, pick, close }) => {
  const frame = useCurrentFrame();
  const rise = useSpring(at);
  const fall = progress(frame, close, close + 12);
  const shown = rise * (1 - fall);
  const picked = frame >= pick;
  if (frame < at - 1 || frame > close + 14) return null;
  return (
    <AbsoluteFill style={{ zIndex: 20 }}>
      <AbsoluteFill style={{ background: `rgba(44,24,16,${0.4 * shown})` }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: SHEET_TOP,
          bottom: 0,
          background: C.paper,
          borderRadius: "28px 28px 0 0",
          transform: `translateY(${(1 - shown) * 520}px)`,
          padding: "14px 18px",
        }}
      >
        <div style={{ width: 44, height: 5, borderRadius: 3, background: "#ddd", margin: "0 auto 16px" }} />
        <SectionTitle size={22}>¿Dónde retirás?</SectionTitle>
        <div style={{ fontSize: 13, color: C.cocoa, marginTop: 10 }}>Guchicken · {ars(ORDER.price)}</div>
        {BRANCHES.map((b, i) => {
          const active = picked && b.id === "ciudad";
          return (
            <div
              key={b.id}
              style={{
                position: "absolute",
                left: 18,
                right: 18,
                top: ROW_TOP - SHEET_TOP + i * ROW_H,
                height: ROW_H - 10,
                borderRadius: 16,
                border: `2px solid ${active ? C.pine : C.line}`,
                background: active ? "#eaf4ec" : C.paper,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 16px",
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{b.name}</div>
                <div style={{ fontSize: 12, color: C.cocoa }}>{b.address}</div>
              </div>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  border: `2px solid ${active ? C.pine : "#ccc"}`,
                  background: active ? C.pine : "transparent",
                  color: C.paper,
                  fontSize: 14,
                  fontWeight: 800,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                {active ? "✓" : ""}
              </div>
            </div>
          );
        })}
        <Tap at={pick} x={190} y={ROW_TOP - SHEET_TOP + (ROW_H - 10) / 2 + 14} />
      </div>
    </AbsoluteFill>
  );
};

export const CART_TAP = { x: 195, y: 772 };

/** "Agregado" toast + floating cart bar. */
export const CartBar: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const s = useSpring(at, POPPY);
  const toast = useSpring(at + 2);
  const toastOut = progress(frame, at + 40, at + 52);
  if (frame < at - 1) return null;
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 120,
          left: "50%",
          transform: `translate(-50%, ${(1 - toast) * -30}px)`,
          opacity: toast * (1 - toastOut),
          background: C.ink,
          color: C.cream,
          fontSize: 14,
          fontWeight: 600,
          padding: "10px 18px",
          borderRadius: 999,
          zIndex: 30,
          whiteSpace: "nowrap",
        }}
      >
        ✓ Guchicken agregado · Ciudad
      </div>
      <div
        style={{
          position: "absolute",
          left: 16,
          right: 16,
          top: CART_TAP.y - 30,
          height: 60,
          borderRadius: 18,
          background: C.sun,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          fontWeight: 700,
          fontSize: 16,
          transform: `translateY(${(1 - s) * 120}px)`,
          boxShadow: "0 10px 24px rgba(240,165,0,0.35)",
          zIndex: 25,
        }}
      >
        <span>1 · {ars(ORDER.price)}</span>
        <span>Ver pedido →</span>
      </div>
    </>
  );
};

const ETAS = ["Lo antes posible", "30 min", "45 min", "60 min", "90 min"];
export const ETA_30_TAP = { x: 252, y: 428 };
export const PAY_TAP = { x: 195, y: 762 };

const Field: React.FC<{ label: string; value: string; focused: boolean }> = ({ label, value, focused }) => {
  const frame = useCurrentFrame();
  const caret = focused && Math.floor(frame / 15) % 2 === 0;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: C.cocoa, marginBottom: 5 }}>{label}</div>
      <div
        style={{
          height: 46,
          borderRadius: 12,
          background: C.paper,
          border: `2px solid ${focused ? C.pine : C.line}`,
          display: "flex",
          alignItems: "center",
          padding: "0 14px",
          fontSize: 16,
          fontWeight: 500,
        }}
      >
        {value}
        <span style={{ width: 2, height: 20, background: caret ? C.ink : "transparent", marginLeft: 1 }} />
      </div>
    </div>
  );
};

export const CheckoutScreen: React.FC<{ typeName: number; typePhone: number; pickEta: number; tapPay: number }> = ({
  typeName,
  typePhone,
  pickEta,
  tapPay,
}) => {
  const frame = useCurrentFrame();
  const name = useTyped(ORDER.customer, typeName, 9);
  const phone = useTyped(ORDER.phone, typePhone, 14);
  const eta = frame >= pickEta ? 1 : 0;
  const press = frame >= tapPay && frame < tapPay + 6 ? 0.96 : 1;
  return (
    <AbsoluteFill style={{ background: C.cream, padding: "62px 18px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, height: 44 }}>
        <span style={{ fontSize: 22 }}>←</span>
        <SectionTitle size={22}>Tu pedido</SectionTitle>
      </div>
      <div
        style={{
          marginTop: 12,
          background: C.paper,
          borderRadius: 18,
          padding: 12,
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}
      >
        <div style={{ width: 58, height: 58, borderRadius: 12, overflow: "hidden" }}>
          <Photo src="guchicken.jpg" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONTS.display, fontSize: 18, letterSpacing: 1 }}>1× GUCHICKEN</div>
          <div style={{ fontSize: 12, color: C.cocoa }}>Retirás en Ciudad · {ORDER.address}</div>
        </div>
        <div style={{ fontWeight: 700 }}>{ars(ORDER.price)}</div>
      </div>
      <div style={{ marginTop: 16 }}>
        <Field label="Nombre" value={name} focused={frame >= typeName && frame < typePhone} />
        <Field label="Celular" value={phone} focused={frame >= typePhone && frame < pickEta} />
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, margin: "4px 0 8px" }}>¿En cuánto llegás?</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {ETAS.map((e, i) => {
          const active = i === eta;
          return (
            <div
              key={e}
              style={{
                height: 40,
                padding: "0 14px",
                borderRadius: 999,
                display: "grid",
                placeItems: "center",
                fontSize: 14,
                fontWeight: 600,
                background: active ? C.pine : C.paper,
                color: active ? C.paper : C.ink,
                border: `2px solid ${active ? C.pine : C.line}`,
                minWidth: i === 0 ? 180 : 92,
              }}
            >
              {e}
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 18,
          background: "#eaf4ec",
          border: `2px dashed ${C.pine}`,
          borderRadius: 16,
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 26 }}>🕒</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Te esperamos a las {eta ? "20:37" : "20:22"}</div>
          <div style={{ fontSize: 12, color: C.cocoa }}>Guchini Ciudad · {ORDER.address}</div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 18,
          right: 18,
          top: 680,
          display: "flex",
          justifyContent: "space-between",
          fontWeight: 700,
          fontSize: 18,
        }}
      >
        <span>Total</span>
        <span>{ars(ORDER.price)}</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 18,
          right: 18,
          top: PAY_TAP.y - 30,
          height: 60,
          borderRadius: 16,
          background: C.mp,
          color: C.paper,
          fontWeight: 700,
          fontSize: 17,
          display: "grid",
          placeItems: "center",
          transform: `scale(${press})`,
          boxShadow: "0 10px 24px rgba(0,158,227,0.35)",
        }}
      >
        Pagar con Mercado Pago
      </div>
      <Tap at={pickEta} x={ETA_30_TAP.x} y={ETA_30_TAP.y} />
      <Tap at={tapPay} x={PAY_TAP.x} y={PAY_TAP.y} />
    </AbsoluteFill>
  );
};

export const PaymentScreen: React.FC<{ approved: number }> = ({ approved }) => {
  const frame = useCurrentFrame();
  const ok = useSpring(approved, POPPY);
  const spinOut = progress(frame, approved - 6, approved);
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <div
        style={{
          height: 130,
          background: C.mp,
          color: C.paper,
          display: "flex",
          alignItems: "flex-end",
          padding: "0 22px 18px",
          fontWeight: 800,
          fontSize: 20,
        }}
      >
        Mercado Pago
      </div>
      <AbsoluteFill style={{ top: 130, alignItems: "center", justifyContent: "center", gap: 20, display: "flex", flexDirection: "column" }}>
        <div style={{ position: "relative", width: 96, height: 96 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: `8px solid #e6f5fc`,
              borderTopColor: C.mp,
              transform: `rotate(${frame * 14}deg)`,
              opacity: 1 - spinOut,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: "#00a650",
              color: C.paper,
              fontSize: 54,
              fontWeight: 800,
              display: "grid",
              placeItems: "center",
              transform: `scale(${ok})`,
            }}
          >
            ✓
          </div>
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, textAlign: "center", height: 64 }}>
          {frame < approved ? (
            <span style={{ color: C.cocoa, fontWeight: 500, fontSize: 18 }}>Procesando pago…</span>
          ) : (
            <span style={{ opacity: ok }}>
              ¡Pago aprobado!
              <div style={{ fontSize: 30, marginTop: 4 }}>{ars(ORDER.price)}</div>
            </span>
          )}
        </div>
        <div style={{ fontSize: 14, color: C.cocoa, opacity: ok }}>Guchini · {ORDER.branch}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const STATUSES = ["Pagado", "Confirmado", "En preparación", "Listo"] as const;

/** Customer's confirmation + live tracker. `step` is the index into STATUSES. */
export const ConfirmedScreen: React.FC<{ step: number }> = ({ step }) => {
  const frame = useCurrentFrame();
  const head = useSpring(0, POPPY);
  return (
    <AbsoluteFill style={{ background: C.cream, padding: "70px 22px 0" }}>
      <div style={{ textAlign: "center", transform: `scale(${0.8 + head * 0.2})`, opacity: head }}>
        <div style={{ fontSize: 44 }}>🎉</div>
        <div style={{ fontFamily: FONTS.display, fontSize: 34, letterSpacing: 1.5, lineHeight: 1.05, marginTop: 6 }}>
          ¡PEDIDO
          <br />
          CONFIRMADO!
        </div>
        <div
          style={{
            display: "inline-block",
            marginTop: 14,
            background: C.ink,
            color: C.sun,
            fontFamily: FONTS.display,
            fontSize: 30,
            letterSpacing: 2,
            padding: "6px 18px",
            borderRadius: 12,
          }}
        >
          {ORDER.id}
        </div>
      </div>
      <div style={{ marginTop: 22, background: C.paper, borderRadius: 18, padding: "14px 16px", fontSize: 14 }}>
        <div style={{ fontWeight: 700 }}>Retirás en {ORDER.address}</div>
        <div style={{ color: C.cocoa }}>Guchini Ciudad · llegás en 30 min</div>
      </div>
      <div style={{ marginTop: 18, background: C.paper, borderRadius: 18, padding: "18px 18px 8px" }}>
        {STATUSES.map((st, i) => {
          const done = i <= step;
          const current = i === step;
          const pulse = current ? 1 + Math.sin(frame / 5) * 0.12 : 1;
          return (
            <div key={st} style={{ display: "flex", gap: 14, alignItems: "flex-start", minHeight: 54 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: done ? (i === 3 ? C.pine : C.sun) : "#e7e0d2",
                    border: `3px solid ${done ? C.ink : "#e7e0d2"}`,
                    transform: `scale(${pulse})`,
                  }}
                />
                {i < STATUSES.length - 1 && (
                  <div style={{ width: 3, height: 30, background: i < step ? C.ink : "#e7e0d2" }} />
                )}
              </div>
              <div
                style={{
                  fontWeight: current ? 800 : 600,
                  fontSize: current ? 17 : 15,
                  color: done ? C.ink : "#b9ad99",
                  marginTop: 1,
                }}
              >
                {st}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Little helper so scenes can compute a smooth scroll position. */
export const useScroll = (from: number, to: number, distance: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [from, to], [0, distance], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
};
