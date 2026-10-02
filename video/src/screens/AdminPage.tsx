import React from "react";
import { useCurrentFrame } from "remotion";
import { progress, Tap } from "../kit";
import { ars, BRANCHES, C, num, PRODUCTS, STOCK } from "../theme";
import { display, SHADOW_SM, TRACK, TX, WebSectionTitle } from "./web";

/* Recreates /admin (src/app/admin/page.tsx) at a 1024px (lg) viewport. */

export const ADMIN_W = 1024;
/** Approximate page offsets (px) used to aim the scene's scroll. */
export const ADMIN_Y = { top: 0, promos: 515, stock: 1300 };

const INK_5 = "rgba(44,24,16,0.05)";
const INK_10 = "rgba(44,24,16,0.10)";
const INK_15 = "rgba(44,24,16,0.15)";

const NUMBERS = [
  { label: "Pedidos", value: 268, fmt: (n: number) => String(n) },
  { label: "Unidades", value: 361, fmt: (n: number) => String(n) },
  { label: "Ventas", value: 3912400, fmt: ars },
  { label: "Descuentos", value: 432850, fmt: ars },
];

const FUNNEL = [
  { label: "Vieron el menú", value: 860 },
  { label: "Iniciaron checkout", value: 312 },
  { label: "Pagos aprobados", value: 268 },
  { label: "Pedidos listos", value: 241 },
];

const PROMOS = [
  { name: "Happy Guchi", tagline: "15% OFF en Guchicken · 16 a 18hs", uses: 142, active: true },
  { name: "Ruta 7", tagline: "$2.000 OFF en Combo Guchi · solo Uspallata", uses: 61, active: true },
  { name: "10% OFF Efectivo", tagline: "Pagando en efectivo en el local · canal presencial", uses: 18, active: false },
];

export interface AdminProps {
  scroll?: number;
  /** Frame at which the numbers/funnel animate in. */
  countAt: number;
  /** Uspallata Guchicken stock now, and frames of each "−" tap. */
  guchickenUspallata: number;
  tapMinus: number[];
  soldOutAt: number;
}

export const AdminPage: React.FC<AdminProps> = ({ countAt, guchickenUspallata, tapMinus, soldOutAt }) => {
  const frame = useCurrentFrame();
  const grow = progress(frame, countAt, countAt + 30);
  const sold = progress(frame, soldOutAt, soldOutAt + 8);
  void sold;
  return (
    <div style={{ width: ADMIN_W, boxSizing: "border-box", padding: "0 16px 64px", margin: "0 auto", maxWidth: 1024 }}>
      <div style={{ marginTop: 32, ...display("3xl", TRACK.widest) }}>Administración</div>

      <section style={{ marginTop: 32 }}>
        <WebSectionTitle>Hoy en números</WebSectionTitle>
        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 16 }}>
          {NUMBERS.map((n) => (
            <div key={n.label} style={{ borderRadius: 12, background: C.paper, padding: 16, textAlign: "center", boxShadow: SHADOW_SM }}>
              <div style={{ color: C.mango, ...display("2xl", TRACK.wide), textTransform: "none" }}>{n.fmt(Math.round(n.value * grow))}</div>
              <div style={{ marginTop: 4, color: C.cocoa, fontSize: 11, lineHeight: "16px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {n.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 40 }}>
        <WebSectionTitle>Funnel de conversión</WebSectionTitle>
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          {FUNNEL.map((f, i) => {
            const g = progress(frame, countAt + i * 6, countAt + i * 6 + 28);
            return (
              <div key={f.label}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, ...TX.xs }}>
                  <span>{f.label}</span>
                  <span style={{ color: C.cocoa }}>{Math.round(f.value * g)}</span>
                </div>
                <div style={{ marginTop: 4, height: 10, overflow: "hidden", borderRadius: 999, background: INK_10 }}>
                  <div style={{ height: "100%", borderRadius: 999, background: C.guchi, width: `${Math.min(100, Math.round((f.value / FUNNEL[0].value) * 100)) * g}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section style={{ marginTop: 40 }}>
        <WebSectionTitle>Promociones</WebSectionTitle>
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          {PROMOS.map((p) => (
            <div key={p.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: 12, background: C.paper, padding: 16, boxShadow: SHADOW_SM }}>
              <div>
                <div style={{ ...TX.base, fontFamily: display("base").fontFamily, textTransform: "uppercase", letterSpacing: "0.025em" }}>{p.name}</div>
                <div style={{ color: C.cocoa, fontWeight: 500, ...TX.sm }}>{p.tagline}</div>
                <div style={{ marginTop: 2, color: C.guchi, fontWeight: 600, ...TX.xs }}>{p.uses} pedidos la usaron</div>
              </div>
              <span
                style={{
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  boxShadow: SHADOW_SM,
                  background: p.active ? C.guchi : INK_10,
                  color: p.active ? "#fff" : C.cocoa,
                  ...TX.xs,
                }}
              >
                {p.active ? "Activa" : "Pausada"}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 40 }}>
        <WebSectionTitle>Stock por sucursal</WebSectionTitle>
        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 16, alignItems: "start" }}>
          {BRANCHES.map((b) => (
            <div key={b.id} style={{ overflow: "hidden", borderRadius: 12, background: C.paper, boxShadow: SHADOW_SM }}>
              <div style={{ borderBottom: `1px solid ${INK_10}`, background: "rgba(255,191,51,0.2)", padding: "10px 16px", ...display("base", TRACK.wide) }}>{b.name}</div>
              <div>
                {PRODUCTS.map((p, i) => {
                  const isTarget = b.id === "uspallata" && p.id === "guchicken";
                  const qty = isTarget ? guchickenUspallata : STOCK[b.id][i];
                  return (
                    <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px", borderTop: i === 0 ? undefined : `1px solid ${INK_5}`, background: isTarget ? "rgba(255,191,51,0.1)" : undefined }}>
                      <div>
                        <div style={{ fontWeight: 500, ...TX.sm }}>{p.name}</div>
                        {qty === 0 ? (
                          <div style={{ color: C.tomato, fontSize: 10, lineHeight: "16px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.025em" }}>Sold out</div>
                        ) : null}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ position: "relative", width: 28, height: 28, boxSizing: "border-box", borderRadius: "50%", border: `1px solid ${INK_15}`, display: "grid", placeItems: "center", fontWeight: 700, ...TX.sm }}>
                          −
                          {isTarget ? tapMinus.map((t) => <Tap key={t} at={t} x="50%" y="50%" />) : null}
                        </span>
                        <span style={{ width: 28, textAlign: "center", fontWeight: 700, ...TX.sm, color: qty === 0 ? C.tomato : C.ink }}>{qty}</span>
                        <span style={{ width: 28, height: 28, boxSizing: "border-box", borderRadius: "50%", border: `1px solid ${INK_15}`, display: "grid", placeItems: "center", fontWeight: 700, ...TX.sm }}>+</span>
                        <span style={{ marginLeft: 8, borderRadius: 6, background: C.guchi, color: "#fff", padding: "4px 10px", fontSize: 10, lineHeight: "16px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.025em" }}>ON</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

void num;
