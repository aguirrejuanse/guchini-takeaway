import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  type SpringConfig,
} from "remotion";
import { C, FONTS, RADIUS } from "./theme";

/* ---------- layout ---------- */

/** Scenes read this to recompose for 9:16 without separate components. */
export const useLayout = () => {
  const { width, height } = useVideoConfig();
  const portrait = height > width;
  return { portrait, width, height };
};

/* ---------- motion ---------- */

export const SOFT: Partial<SpringConfig> = { damping: 18, stiffness: 120 };
export const POPPY: Partial<SpringConfig> = { damping: 11, stiffness: 160 };

export const useSpring = (delay = 0, config: Partial<SpringConfig> = SOFT) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config });
};

/** 0 → 1 over [from, to], clamped. */
export const progress = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** Spring entry; optional fade-out starting at `exit`. */
export const Pop: React.FC<{
  delay?: number;
  exit?: number;
  y?: number;
  config?: Partial<SpringConfig>;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ delay = 0, exit, y = 40, config = SOFT, style, children }) => {
  const frame = useCurrentFrame();
  const s = useSpring(delay, config);
  const out = exit === undefined ? 0 : progress(frame, exit, exit + 12);
  return (
    <div
      style={{
        opacity: Math.min(s, 1) * (1 - out),
        transform: `translateY(${(1 - s) * y - out * 30}px) scale(${0.94 + s * 0.06})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** A screen that slides in at `from` and fades out at `to` (both scene-relative). */
export const ScreenAt: React.FC<{ from: number; to?: number; slide?: boolean; children: React.ReactNode }> = ({
  from,
  to,
  slide = true,
  children,
}) => {
  const frame = useCurrentFrame();
  const enter = useSpring(from, SOFT);
  const leave = to === undefined ? 0 : progress(frame, to, to + 10);
  if (frame < from - 1 || (to !== undefined && frame > to + 12)) return null;
  return (
    <AbsoluteFill
      style={{
        opacity: (from === 0 ? 1 : enter) * (1 - leave),
        transform: slide ? `translateX(${from === 0 ? 0 : (1 - enter) * 60}px) translateX(${-leave * 40}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Finger-tap ripple centered on (x, y) inside the nearest positioned parent. */
export const Tap: React.FC<{ at: number; x: number; y: number }> = ({ at, x, y }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < -8 || t > 22) return null;
  const press = interpolate(t, [-8, 0, 6], [0, 1, 0.85], { extrapolateRight: "clamp" });
  const ring = progress(frame, at, at + 18);
  return (
    <div style={{ position: "absolute", left: x, top: y, pointerEvents: "none", zIndex: 50 }}>
      <div
        style={{
          position: "absolute",
          width: 64,
          height: 64,
          left: -32,
          top: -32,
          borderRadius: "50%",
          background: "rgba(44,24,16,0.35)",
          border: "3px solid rgba(255,255,255,0.9)",
          boxShadow: "0 4px 14px rgba(44,24,16,0.3)",
          transform: `scale(${press})`,
          opacity: 1 - ring * 0.8,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 64,
          height: 64,
          left: -32,
          top: -32,
          borderRadius: "50%",
          border: `4px solid ${C.ink}`,
          transform: `scale(${0.6 + ring * 1.5})`,
          opacity: t >= 0 ? (1 - ring) * 0.7 : 0,
        }}
      />
    </div>
  );
};

/** Types `text` starting at `at`, ~`cps` characters per second. */
export const useTyped = (text: string, at: number, cps = 16) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = Math.max(0, Math.floor(((frame - at) / fps) * cps));
  return text.slice(0, n);
};

/* ---------- surfaces ---------- */

export const BG: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 70) * 24;
  return (
    <AbsoluteFill style={{ background: C.cream, fontFamily: FONTS.sans, color: C.ink, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          right: -260 + drift,
          top: -380,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.sun}33 0%, transparent 65%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          left: -300,
          bottom: -420 - drift,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.pinki}26 0%, transparent 65%)`,
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

export const Card: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div
    style={{
      background: C.paper,
      borderRadius: RADIUS.card,
      boxShadow: "0 8px 24px rgba(44,24,16,0.08)",
      ...style,
    }}
  >
    {children}
  </div>
);

/* ---------- type ---------- */

/** Display title with the thin red rule underneath, like the web app section headers. */
export const SectionTitle: React.FC<{
  children: React.ReactNode;
  size?: number;
  delay?: number;
  align?: "left" | "center";
  color?: string;
}> = ({ children, size = 30, delay = 0, align = "left", color = C.ink }) => {
  const rule = useSpring(delay + 6, SOFT);
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: align === "center" ? "center" : "flex-start" }}>
      <div
        style={{
          fontFamily: FONTS.display,
          fontSize: size,
          letterSpacing: size * 0.12,
          textTransform: "uppercase",
          color,
          lineHeight: 1.1,
        }}
      >
        {children}
      </div>
      <div
        style={{
          height: Math.max(3, size * 0.09),
          width: Math.max(40, size * 1.6) * rule,
          background: C.tomato,
          borderRadius: 4,
          marginTop: size * 0.2,
        }}
      />
    </div>
  );
};

export const Display: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  align?: "left" | "center";
  style?: React.CSSProperties;
}> = ({ children, size = 96, color = C.ink, align = "left", style }) => (
  <div
    style={{
      fontFamily: FONTS.display,
      fontSize: size,
      lineHeight: 1.04,
      letterSpacing: size * 0.02,
      textTransform: "uppercase",
      color,
      textAlign: align,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Caveat slogan. Yellow gets an ink outline so it reads on cream (same treatment as the logo). */
export const Script: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  outline?: boolean;
  style?: React.CSSProperties;
}> = ({ children, size = 64, color = C.sun, outline = true, style }) => (
  <div
    style={{
      fontFamily: FONTS.script,
      fontWeight: 700,
      fontSize: size,
      lineHeight: 1,
      color,
      WebkitTextStroke: outline ? `${Math.max(2, size * 0.045)}px ${C.ink}` : undefined,
      paintOrder: "stroke fill",
      textShadow: outline ? `${size * 0.04}px ${size * 0.05}px 0 ${C.ink}` : undefined,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Narration copy that carries the story in place of voice-over. */
export const Copy: React.FC<{
  children: React.ReactNode;
  size?: number;
  align?: "left" | "center";
  style?: React.CSSProperties;
}> = ({ children, size = 64, align = "left", style }) => (
  <div
    style={{
      fontFamily: FONTS.sans,
      fontWeight: 800,
      fontSize: size,
      lineHeight: 1.12,
      letterSpacing: -size * 0.02,
      color: C.ink,
      textAlign: align,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Yellow marker highlight behind a word. */
export const Mark: React.FC<{ children: React.ReactNode; color?: string; delay?: number }> = ({
  children,
  color = C.sun,
  delay = 0,
}) => {
  const s = useSpring(delay, SOFT);
  return (
    <span style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap" }}>
      <span
        style={{
          position: "absolute",
          left: -8,
          right: -8,
          bottom: "0.06em",
          height: "0.42em",
          background: color,
          borderRadius: 6,
          transform: `scaleX(${s})`,
          transformOrigin: "left",
          zIndex: 0,
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </span>
  );
};

export const Pill: React.FC<{
  children: React.ReactNode;
  bg: string;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, bg, color = C.paper, size = 14, style }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      background: bg,
      color,
      fontSize: size,
      fontWeight: 700,
      letterSpacing: size * 0.06,
      textTransform: "uppercase",
      padding: `${size * 0.35}px ${size * 0.8}px`,
      borderRadius: RADIUS.pill,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </span>
);

/* ---------- brand assets ---------- */

export const Logo: React.FC<{ height: number; style?: React.CSSProperties }> = ({ height, style }) => (
  <Img src={staticFile("logo.png")} style={{ height, width: "auto", ...style }} />
);

/** The running mascot, cropped out of guachini.png (526×227; figure sits at x≈170–355). */
export const Mascot: React.FC<{ height: number; style?: React.CSSProperties }> = ({ height, style }) => {
  const k = height / 227;
  return (
    <div style={{ width: 190 * k, height, overflow: "hidden", position: "relative", ...style }}>
      <Img
        src={staticFile("guachini.png")}
        style={{ position: "absolute", height, width: 526 * k, left: -168 * k, top: 0, maxWidth: "none" }}
      />
    </div>
  );
};

export const Photo: React.FC<{ src: string; style?: React.CSSProperties }> = ({ src, style }) => (
  <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...style }} />
);
