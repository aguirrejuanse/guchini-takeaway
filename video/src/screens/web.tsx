import React from "react";
import { useCurrentFrame } from "remotion";
import { BROWSER_SCREEN } from "../devices/Devices";
import { progress, Tap } from "../kit";
import { C, FONTS } from "../theme";

/* Tailwind-equivalent type scale (px / line-height) and tracking, so screens copy the real classes. */
export const TX = {
  xs: { fontSize: 12, lineHeight: "16px" },
  sm: { fontSize: 14, lineHeight: "20px" },
  base: { fontSize: 16, lineHeight: "24px" },
  lg: { fontSize: 18, lineHeight: "28px" },
  xl: { fontSize: 20, lineHeight: "28px" },
  "2xl": { fontSize: 24, lineHeight: "32px" },
  "3xl": { fontSize: 30, lineHeight: "36px" },
} as const;

/** font-display uppercase with Tailwind tracking-* (em). */
export const display = (size: keyof typeof TX, tracking = 0): React.CSSProperties => ({
  ...TX[size],
  fontFamily: FONTS.display,
  fontWeight: 400,
  textTransform: "uppercase",
  letterSpacing: `${tracking}em`,
});

export const TRACK = { wide: 0.025, wider: 0.05, widest: 0.1 } as const;

export const SHADOW_SM = "0 1px 2px 0 rgba(0,0,0,0.05)";
export const SHADOW_MD = "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)";
export const SHADOW_LG = "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)";
export const SHADOW_XL = "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)";

/** `<main className="mx-auto max-w-2xl px-4 pb-16">` inside a 390px-wide mobile viewport. */
export const MobileMain: React.FC<{ scroll?: number; pb?: number; children: React.ReactNode }> = ({
  scroll = 0,
  pb = 64,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: -scroll,
      padding: `0 16px ${pb}px`,
      fontFamily: FONTS.sans,
      color: C.ink,
      background: C.cream,
      minHeight: "100%",
    }}
  >
    {children}
  </div>
);

/** The real <SectionTitle>. */
export const WebSectionTitle: React.FC<{ children: React.ReactNode; centered?: boolean }> = ({ children, centered }) => (
  <div style={{ textAlign: centered ? "center" : undefined }}>
    <div style={display(centered ? "3xl" : "xl", TRACK.widest)}>{children}</div>
    <div
      style={{
        marginTop: centered ? 12 : 8,
        height: 3,
        borderRadius: 999,
        background: C.tomato,
        width: centered ? 56 : 40,
        marginLeft: centered ? "auto" : undefined,
        marginRight: centered ? "auto" : undefined,
      }}
    />
  </div>
);

/** animate-fade-up (0.55s, 20px) on mount at frame `at`, staggered by `i`. */
export const FadeUp: React.FC<{ at: number; i?: number; step?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  at,
  i = 0,
  step = 2,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = progress(frame, at + i * step, at + i * step + 16);
  const e = 1 - Math.pow(1 - p, 2);
  return <div style={{ opacity: e, transform: `translateY(${(1 - e) * 20}px)`, ...style }}>{children}</div>;
};

/** animate-pop-in (0.35s, scale .92 → 1 with overshoot). */
export const PopIn: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, children, style }) => {
  const frame = useCurrentFrame();
  const p = progress(frame, at, at + 10);
  const back = (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  };
  const e = back(p);
  return <div style={{ opacity: Math.min(1, p * 1.6), transform: `scale(${0.92 + 0.08 * e})`, ...style }}>{children}</div>;
};

/** <QtyStepper>. */
export const QtyStepper: React.FC<{ qty: number }> = ({ qty }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 4,
      borderRadius: 999,
      border: "1px solid rgba(44,24,16,0.15)",
      background: "#fff",
      padding: "2px 4px",
      boxShadow: SHADOW_SM,
      ...TX.base,
    }}
  >
    <span style={{ width: 28, height: 28, display: "grid", placeItems: "center", fontWeight: 700 }}>−</span>
    <span style={{ width: 20, textAlign: "center", fontSize: 14, fontWeight: 700 }}>{qty}</span>
    <span style={{ width: 28, height: 28, display: "grid", placeItems: "center", fontWeight: 700 }}>+</span>
  </div>
);

/** A button-shaped element that can host a tap ripple at its center. */
export const TapHost: React.FC<{ tap?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({
  tap,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const pressed = tap !== undefined && frame >= tap && frame < tap + 5;
  return (
    <div style={{ position: "relative", transform: pressed ? "scale(0.97)" : undefined, ...style }}>
      {children}
      {tap !== undefined && <Tap at={tap} x="50%" y="50%" />}
    </div>
  );
};

/**
 * Lays a web page out at a real viewport width and scales it to fill the Browser
 * device. `scroll` is in page pixels (before scaling).
 */
export const WebViewport: React.FC<{ width: number; scroll?: number; children: React.ReactNode }> = ({
  width,
  scroll = 0,
  children,
}) => {
  const k = BROWSER_SCREEN.w / width;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width, height: BROWSER_SCREEN.h / k, transform: `scale(${k})`, transformOrigin: "top left", overflow: "hidden", background: C.cream, fontFamily: FONTS.sans, color: C.ink }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: -scroll }}>{children}</div>
    </div>
  );
};

export const viewportHeight = (width: number) => BROWSER_SCREEN.h / (BROWSER_SCREEN.w / width);

export const Spinner: React.FC<{ size?: number }> = ({ size = 40 }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `4px solid ${C.mp}`,
        borderTopColor: "transparent",
        transform: `rotate(${frame * 12}deg)`,
      }}
    />
  );
};

/** <WaBubble> from src/components/wa-bubble.tsx. */
export const WaBubble: React.FC<{ number: string; branchName: string; lines: string[]; total: string; ready?: boolean }> = ({
  number,
  branchName,
  lines,
  total,
  ready,
}) => (
  <div style={{ borderRadius: 12, background: "#e7ffd8", padding: 12, textAlign: "left" }}>
    <div style={{ marginBottom: 8, fontSize: 10, lineHeight: "16px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: C.cocoa }}>
      WhatsApp · vista previa
    </div>
    <div
      style={{
        maxWidth: 320,
        borderRadius: 8,
        borderTopLeftRadius: 0,
        background: "#fff",
        padding: 12,
        fontSize: 13,
        lineHeight: 1.375,
        boxShadow: SHADOW_SM,
      }}
    >
      <div style={{ fontWeight: 700 }}>🥪 Guchini</div>
      <div style={{ marginTop: 4, fontWeight: 600 }}>
        {ready ? `¡Tu pedido #${number} está listo!` : `¡Tu pedido #${number} fue confirmado!`}
      </div>
      <div style={{ marginTop: 4, color: C.cocoa }}>Sucursal: {branchName}</div>
      <div style={{ marginTop: 4 }}>
        {lines.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
      <div style={{ marginTop: 4, fontWeight: 700 }}>Total: {total}</div>
      <div style={{ marginTop: 4, color: C.cocoa }}>{ready ? "Te esperamos para retirarlo. 🏃" : "Te avisamos cuando esté listo."}</div>
      <div style={{ marginTop: 4, textAlign: "right", fontSize: 10, color: C.cocoa }}>✓✓</div>
    </div>
  </div>
);

/** Eased scroll offset: 0 before `from`, `distance` after `to`. */
export const useScroll = (from: number, to: number, distance: number, startAt = 0) => {
  const frame = useCurrentFrame();
  const p = progress(frame, from, to);
  const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
  return startAt + (distance - startAt) * e;
};
