import React from "react";
import { C } from "../theme";
import { display, PopIn, SHADOW_MD, SHADOW_SM, TapHost, TRACK, TX, WaBubble } from "./web";

/* Recreates /local (src/app/local/page.tsx). */

export type StatusKey = "PAGADO" | "CONFIRMADO" | "EN_PREPARACION" | "LISTO";

export const STATUS_LABEL: Record<StatusKey, string> = {
  PAGADO: "Pagado",
  CONFIRMADO: "Confirmado",
  EN_PREPARACION: "En preparación",
  LISTO: "Listo para retirar",
};

const STATUS_COLOR: Record<StatusKey, { bg: string; color: string }> = {
  PAGADO: { bg: "rgba(255,191,51,0.25)", color: C.ink },
  CONFIRMADO: { bg: "rgba(255,140,204,0.3)", color: C.ink },
  EN_PREPARACION: { bg: C.sun, color: C.ink },
  LISTO: { bg: C.guchi, color: "#fff" },
};

export const NEXT_ACTION: Partial<Record<StatusKey, string>> = {
  PAGADO: "Confirmar",
  CONFIRMADO: "Preparar",
  EN_PREPARACION: "Marcar listo",
  LISTO: "Entregar",
};

export interface OrderCardData {
  number: string;
  branch: string;
  branchName: string;
  elapsed: string;
  customer: string;
  status: StatusKey;
  scheduledTag?: string;
  items: string[];
  total: string;
  /** Frame at which the primary action button is tapped. */
  tapAction?: number;
  /** Frame at which the WhatsApp button is tapped. */
  tapWa?: number;
  /** Show the WhatsApp ready preview bubble (real UI shows it for 6s after "Marcar listo"). */
  showWaPreview?: boolean;
  waAt?: number;
  totalRaw?: string;
  /** Pop-in frame. */
  at?: number;
  highlight?: number;
}

export const OrderCard: React.FC<{ o: OrderCardData }> = ({ o }) => {
  const action = NEXT_ACTION[o.status];
  const sc = STATUS_COLOR[o.status];
  const card = (
    <article
      style={{
        borderRadius: 12,
        background: C.paper,
        padding: 16,
        boxShadow: o.highlight ? `0 0 0 3px rgba(255,191,51,${0.55 * o.highlight}), ${SHADOW_SM}` : SHADOW_SM,
        textAlign: "left",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={display("xl", TRACK.wide)}>#{o.number}</div>
        <span
          style={{
            borderRadius: 999,
            background: sc.bg,
            color: sc.color,
            padding: "4px 10px",
            fontSize: 11,
            lineHeight: "16px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.025em",
            whiteSpace: "nowrap",
          }}
        >
          {STATUS_LABEL[o.status]}
        </span>
      </div>
      <div style={{ marginTop: 2, color: C.cocoa, fontWeight: 500, ...TX.xs }}>{o.branch}</div>
      <div style={{ color: C.cocoa, fontWeight: 500, ...TX.xs }}>
        {o.elapsed} · {o.customer}
      </div>
      {o.scheduledTag ? (
        <div
          style={{
            marginTop: 4,
            display: "inline-block",
            borderRadius: 4,
            background: "rgba(255,191,51,0.25)",
            padding: "2px 6px",
            fontSize: 10,
            lineHeight: "16px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.025em",
          }}
        >
          {o.scheduledTag}
        </div>
      ) : null}
      <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px dashed rgba(44,24,16,0.15)" }}>
        {o.items.map((i) => (
          <div key={i} style={{ fontWeight: 500, ...TX.sm }}>
            {i}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: C.mango, ...display("lg", TRACK.wide), textTransform: "none" }}>{o.total}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ borderRadius: 8, padding: "6px 12px", color: C.tomato, fontWeight: 600, ...TX.xs }}>Cancelar</span>
          {action ? (
            <TapHost
              tap={o.tapAction}
              style={{
                borderRadius: 8,
                background: C.guchi,
                color: "#fff",
                padding: "6px 16px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                boxShadow: SHADOW_MD,
                whiteSpace: "nowrap",
                ...TX.xs,
              }}
            >
              {action}
            </TapHost>
          ) : null}
        </div>
      </div>
      {o.status === "LISTO" ? (
        <TapHost
          tap={o.tapWa}
          style={{
            marginTop: 10,
            borderRadius: 8,
            background: C.whatsapp,
            color: "#fff",
            padding: "8px 12px",
            textAlign: "center",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            boxShadow: SHADOW_SM,
            ...TX.xs,
          }}
        >
          Enviar WhatsApp al cliente
        </TapHost>
      ) : null}
      {o.showWaPreview ? (
        <PopIn at={o.waAt ?? 0} style={{ marginTop: 12 }}>
          <WaBubble number={o.number} branchName={o.branchName} lines={o.items} total={o.total} ready />
        </PopIn>
      ) : null}
    </article>
  );
  return o.at !== undefined ? <PopIn at={o.at}>{card}</PopIn> : card;
};

export const FILTERS = ["todas", "ciudad", "chacras", "uspallata", "cordoba"] as const;

/** The whole /local page. `cols` mimics the sm/lg breakpoints; `width` is the viewport width. */
export const LocalPage: React.FC<{
  width: number;
  cols: 2 | 3;
  filter: (typeof FILTERS)[number];
  active: React.ReactNode[];
  scheduled?: React.ReactNode[];
}> = ({ width, cols, filter, active, scheduled = [] }) => {
  const grid: React.CSSProperties = { display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: 16, alignItems: "start" };
  return (
    <div style={{ width, boxSizing: "border-box", padding: "0 16px 64px", margin: "0 auto", maxWidth: 1024 }}>
      <div style={{ marginTop: 32, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <div style={display("3xl", TRACK.widest)}>Pedidos</div>
          <div style={{ marginTop: 4, color: C.cocoa, fontWeight: 500, ...TX.sm }}>Solo entran pedidos pagados y confirmados.</div>
        </div>
        <div style={{ display: "flex", gap: 4, borderRadius: 999, background: "#fff", padding: 4, boxShadow: SHADOW_SM }}>
          {FILTERS.map((f) => (
            <span
              key={f}
              style={{
                borderRadius: 999,
                padding: "6px 12px",
                fontWeight: 600,
                textTransform: "capitalize",
                background: f === filter ? C.coal : undefined,
                color: f === filter ? "#fff" : C.cocoa,
                ...TX.xs,
              }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 24, ...grid }}>{active}</div>
      {scheduled.length > 0 ? (
        <>
          <div style={{ marginTop: 40, color: C.cocoa, ...display("lg", TRACK.wider) }}>Programados</div>
          <div style={{ marginTop: 4, color: C.cocoa, fontWeight: 500, ...TX.xs }}>Entran a la cola 15 min antes del retiro.</div>
          <div style={{ marginTop: 12, opacity: 0.75, ...grid }}>{scheduled}</div>
        </>
      ) : null}
    </div>
  );
};
