import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Browser, Phone } from "../devices/Devices";
import { BG, Card, Logo, Pill, Pop, POPPY, progress, Tap, useLayout, useSpring } from "../kit";
import { HomeScreen, MENU_SCROLL } from "../screens/Customer";
import { ars, C, FONTS, num } from "../theme";
import { CUES } from "../timing";

const T = CUES.admin;
const DRAIN_STEP = 16;

const PHRASES = [
  { at: T.promoIn, text: "Sus promos, medibles." },
  { at: T.stockIn, text: "Su stock, en vivo." },
  { at: T.funnelIn, text: "Sus datos, de ellos." },
];

const Headline: React.FC<{ portrait: boolean }> = ({ portrait }) => {
  const frame = useCurrentFrame();
  const active = PHRASES.reduce((acc, p, i) => (frame >= p.at ? i : acc), 0);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: portrait ? "column" : "row",
        gap: portrait ? 4 : 26,
        fontWeight: 800,
        fontSize: portrait ? 60 : 54,
        letterSpacing: -1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {PHRASES.map((p, i) => (
        <Pop key={p.text} delay={p.at} y={20}>
          <span style={{ color: i === active ? C.ink : "rgba(44,24,16,0.35)" }}>{p.text}</span>
        </Pop>
      ))}
    </div>
  );
};

const focusStyle = (on: number): React.CSSProperties => ({
  boxShadow: `0 ${10 + on * 14}px ${26 + on * 20}px rgba(44,24,16,${0.08 + on * 0.08}), 0 0 0 ${on * 4}px ${C.sun}`,
  transform: `scale(${1 + on * 0.015})`,
  padding: 24,
});

const useFocus = (from: number, to: number) => {
  const frame = useCurrentFrame();
  return progress(frame, from, from + 10) * (1 - progress(frame, to, to + 10));
};

const PromoCard: React.FC = () => {
  const frame = useCurrentFrame();
  const uses = Math.round(interpolate(frame, [T.promoIn + 10, T.stockIn], [0, 47], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const on = useFocus(T.promoIn, T.stockIn);
  return (
    <Card style={{ ...focusStyle(on), flex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.cocoa, letterSpacing: 1 }}>PROMO</span>
        <Pill bg={C.pinki} color={C.ink} size={12}>
          Activa
        </Pill>
      </div>
      <div style={{ fontFamily: FONTS.display, fontSize: 46, letterSpacing: 1.5, marginTop: 6, lineHeight: 1 }}>
        15% OFF <span style={{ color: C.pine }}>GUCHICKEN</span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 16 }}>
        <span style={{ fontFamily: FONTS.display, fontSize: 64, lineHeight: 1 }}>{uses}</span>
        <span style={{ fontSize: 16, color: C.cocoa, fontWeight: 600 }}>usos de 100</span>
      </div>
      <div style={{ height: 10, borderRadius: 5, background: "#efe8da", marginTop: 12 }}>
        <div style={{ height: "100%", width: `${uses}%`, borderRadius: 5, background: C.sun }} />
      </div>
      <div style={{ fontSize: 15, marginTop: 12, color: C.cocoa }}>
        Vendido con la promo: <b style={{ color: C.ink }}>{ars(uses * 12325)}</b>
      </div>
    </Card>
  );
};

const STOCK = [
  { branch: "Ciudad", qty: 24 },
  { branch: "Chacras", qty: 18 },
  { branch: "Uspallata", qty: 3 },
  { branch: "Nueva Córdoba", qty: 12 },
];

const StockCard: React.FC = () => {
  const frame = useCurrentFrame();
  const drained = Math.min(3, Math.max(0, Math.floor((frame - T.stockDrain) / DRAIN_STEP) + 1));
  const on = useFocus(T.stockIn, T.funnelIn);
  const sold = useSpring(T.soldOut, POPPY);
  return (
    <Card style={{ ...focusStyle(on), flex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.cocoa, letterSpacing: 1 }}>STOCK · GUCHICKEN</span>
        <span style={{ fontSize: 13, color: C.cocoa }}>por sucursal</span>
      </div>
      <div style={{ marginTop: 10 }}>
        {STOCK.map((r) => {
          const isTarget = r.branch === "Uspallata";
          const qty = isTarget ? r.qty - (frame >= T.stockDrain ? drained : 0) : r.qty;
          const out = isTarget && qty === 0;
          return (
            <div
              key={r.branch}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: 46,
                borderBottom: `1px solid ${C.line}`,
                background: isTarget && on > 0 ? `rgba(255,191,51,${0.12 * on})` : "transparent",
                padding: "0 8px",
                borderRadius: 8,
              }}
            >
              <span style={{ fontWeight: 600, fontSize: 17 }}>{r.branch}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {out && (
                  <span style={{ transform: `scale(${sold})`, display: "inline-block" }}>
                    <Pill bg={C.tomato} size={12}>
                      Sold out
                    </Pill>
                  </span>
                )}
                <span style={{ position: "relative", width: 30, height: 30, borderRadius: 8, background: "#efe8da", display: "grid", placeItems: "center", fontWeight: 800 }}>
                  −
                  {isTarget &&
                    [0, 1, 2].map((k) => <Tap key={k} at={T.stockDrain + k * DRAIN_STEP} x={15} y={15} />)}
                </span>
                <span
                  style={{
                    fontFamily: FONTS.display,
                    fontSize: 26,
                    width: 40,
                    textAlign: "center",
                    color: out ? C.tomato : C.ink,
                  }}
                >
                  {qty}
                </span>
                <span style={{ width: 30, height: 30, borderRadius: 8, background: "#efe8da", display: "grid", placeItems: "center", fontWeight: 800 }}>
                  +
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

const FUNNEL = [
  { label: "Visitas", value: 1240 },
  { label: "Vieron el menú", value: 860 },
  { label: "Checkout", value: 312 },
  { label: "Pagos aprobados", value: 268 },
];

const FunnelCard: React.FC = () => {
  const frame = useCurrentFrame();
  const on = useFocus(T.funnelIn, 9999);
  return (
    <Card style={{ ...focusStyle(on) }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.cocoa, letterSpacing: 1 }}>EMBUDO · ÚLTIMOS 7 DÍAS</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.pine }}>Conversión 21,6%</span>
      </div>
      <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
        {FUNNEL.map((f, i) => {
          const grow = progress(frame, T.funnelIn + i * 6, T.funnelIn + i * 6 + 22);
          const pct = f.value / FUNNEL[0].value;
          return (
            <div key={f.label} style={{ flex: 1 }}>
              <div style={{ fontFamily: FONTS.display, fontSize: 30, letterSpacing: 1 }}>
                {num(Math.round(f.value * grow))}
              </div>
              <div style={{ fontSize: 14, color: C.cocoa, fontWeight: 600, marginBottom: 8 }}>{f.label}</div>
              <div style={{ height: 70, display: "flex", alignItems: "flex-end" }}>
                <div
                  style={{
                    width: "100%",
                    height: 70 * pct * grow,
                    borderRadius: 10,
                    background: i === FUNNEL.length - 1 ? C.pine : i === 0 ? C.sun : "#f5d27d",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

const Dashboard: React.FC = () => (
  <div style={{ padding: "22px 28px", height: "100%", display: "flex", flexDirection: "column", gap: 20 }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Logo height={40} />
        <span style={{ fontFamily: FONTS.display, fontSize: 24, letterSpacing: 3 }}>ADMIN</span>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {["Todas las sucursales", "Hoy", "7 días"].map((t, i) => (
          <Pill key={t} bg={i === 2 ? C.ink : C.paper} color={i === 2 ? C.cream : C.ink} size={12}>
            {t}
          </Pill>
        ))}
      </div>
    </div>
    <div style={{ display: "flex", gap: 20 }}>
      <PromoCard />
      <StockCard />
    </div>
    <FunnelCard />
  </div>
);

export const Admin: React.FC = () => {
  const frame = useCurrentFrame();
  const { portrait } = useLayout();
  const enter = useSpring(0);
  const soldOut = useSpring(T.soldOut, POPPY);
  const phoneFocus = progress(frame, T.soldOut - 10, T.soldOut);

  return (
    <BG>
      <AbsoluteFill style={{ alignItems: "center", padding: portrait ? "110px 40px" : "46px 60px 0", gap: portrait ? 40 : 30 }}>
        <Headline portrait={portrait} />
        <div
          style={{
            display: "flex",
            flexDirection: portrait ? "column" : "row",
            alignItems: "center",
            gap: portrait ? 40 : 50,
            opacity: enter,
            transform: `translateY(${(1 - enter) * 40}px)`,
          }}
        >
          <Browser url="guchini.com.ar/admin" scale={portrait ? 0.8 : 0.98}>
            <Dashboard />
          </Browser>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <Pill bg={phoneFocus > 0.5 ? C.tomato : C.ink} color={C.paper} size={14}>
              Menú Uspallata · en vivo
            </Pill>
            <div style={{ transform: `scale(${1 + phoneFocus * 0.03})` }}>
              <Phone scale={portrait ? 0.62 : 0.76}>
                <HomeScreen scroll={MENU_SCROLL} soldOut={soldOut} branch="Uspallata" />
              </Phone>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </BG>
  );
};
