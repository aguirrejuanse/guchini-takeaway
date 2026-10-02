import React from "react";
import { useCurrentFrame } from "remotion";
import { Logo, Pill } from "../kit";
import { ars, C, FONTS } from "../theme";

export type Status = "PAGADO" | "CONFIRMADO" | "EN PREPARACIÓN" | "LISTO";

export const STATUS_STYLE: Record<Status, { bg: string; color: string }> = {
  PAGADO: { bg: C.mp, color: C.paper },
  CONFIRMADO: { bg: C.sun, color: C.ink },
  "EN PREPARACIÓN": { bg: C.pinki, color: C.ink },
  LISTO: { bg: C.pine, color: C.paper },
};

export const PanelHeader: React.FC<{ branch: string; address: string; clock: string }> = ({ branch, address, clock }) => {
  const frame = useCurrentFrame();
  const blink = 0.55 + Math.abs(Math.sin(frame / 10)) * 0.45;
  return (
    <div
      style={{
        height: 78,
        background: C.ink,
        color: C.cream,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <Logo height={44} />
        <div style={{ fontFamily: FONTS.display, fontSize: 22, letterSpacing: 3 }}>PANEL DEL LOCAL</div>
        <Pill bg="rgba(242,235,221,0.12)" color={C.cream} size={13}>
          📍 {branch} · {address}
        </Pill>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, fontWeight: 700 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#7be08f" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#3ddc63", opacity: blink }} />
          EN VIVO
        </span>
        <span style={{ fontFamily: FONTS.display, fontSize: 30, letterSpacing: 2 }}>{clock}</span>
      </div>
    </div>
  );
};

export const ColumnTitle: React.FC<{ children: React.ReactNode; count?: number; color?: string }> = ({
  children,
  count,
  color = C.ink,
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
    <div style={{ fontFamily: FONTS.display, fontSize: 22, letterSpacing: 3, color }}>{children}</div>
    {count !== undefined && (
      <span
        style={{
          background: C.ink,
          color: C.cream,
          borderRadius: 999,
          fontSize: 13,
          fontWeight: 700,
          padding: "2px 10px",
        }}
      >
        {count}
      </span>
    )}
    <div style={{ flex: 1, height: 3, background: C.tomato, borderRadius: 2, maxWidth: 44 }} />
  </div>
);

export const OrderCard: React.FC<{
  id: string;
  name: string;
  items: string;
  total: number;
  pickup: string;
  status?: Status;
  /** 0..1 — yellow ring + lift, for the order we want the eye on. */
  glow?: number;
  dim?: boolean;
  footer?: React.ReactNode;
  badge?: React.ReactNode;
  width?: number | string;
  style?: React.CSSProperties;
}> = ({ id, name, items, total, pickup, status, glow = 0, dim, footer, badge, width = "100%", style }) => (
  <div
    style={{
      width,
      background: C.paper,
      borderRadius: 20,
      padding: "16px 20px",
      boxShadow: `0 ${8 + glow * 12}px ${22 + glow * 20}px rgba(44,24,16,${0.08 + glow * 0.1}), 0 0 0 ${glow * 4}px ${C.sun}`,
      opacity: dim ? 0.55 : 1,
      position: "relative",
      ...style,
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <span style={{ fontFamily: FONTS.display, fontSize: 28, letterSpacing: 1.5 }}>{id}</span>
        <span style={{ fontWeight: 700, fontSize: 18 }}>{name}</span>
      </div>
      {status && (
        <Pill bg={STATUS_STYLE[status].bg} color={STATUS_STYLE[status].color} size={13}>
          {status}
        </Pill>
      )}
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 15 }}>
      <span>{items}</span>
      <span style={{ fontWeight: 700 }}>{ars(total)}</span>
    </div>
    <div style={{ marginTop: 6, fontSize: 13, color: C.cocoa, display: "flex", alignItems: "center", gap: 10 }}>
      <span>{pickup}</span>
      {badge}
    </div>
    {footer}
  </div>
);
