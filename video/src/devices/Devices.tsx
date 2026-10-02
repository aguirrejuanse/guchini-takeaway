import React from "react";
import { C, FONTS, SHADOW } from "../theme";

/**
 * Devices render their screen at a fixed logical size and scale as a whole,
 * so screen components are authored once in "device pixels".
 */
const Scaled: React.FC<{ w: number; h: number; scale: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  w,
  h,
  scale,
  children,
  style,
}) => (
  <div style={{ width: w * scale, height: h * scale, position: "relative", flexShrink: 0, ...style }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, transform: `scale(${scale})`, transformOrigin: "top left" }}>
      {children}
    </div>
  </div>
);

export const PHONE_SCREEN = { w: 390, h: 844 };
const PHONE_BEZEL = 14;

const StatusBar: React.FC<{ time: string; dark?: boolean }> = ({ time, dark }) => {
  const color = dark ? C.paper : C.ink;
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "6px 30px 0 34px",
        fontSize: 16,
        fontWeight: 700,
        color,
        zIndex: 40,
        fontFamily: FONTS.sans,
      }}
    >
      <span>{time}</span>
      <span style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>
        {[6, 9, 12, 15].map((h) => (
          <span key={h} style={{ width: 4, height: h, background: color, borderRadius: 1 }} />
        ))}
        <span style={{ width: 26, height: 13, border: `2px solid ${color}`, borderRadius: 4, marginLeft: 6, padding: 1 }}>
          <span style={{ display: "block", width: "75%", height: "100%", background: color, borderRadius: 1 }} />
        </span>
      </span>
    </div>
  );
};

export const Phone: React.FC<{
  scale?: number;
  time?: string;
  darkStatus?: boolean;
  screenBg?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ scale = 1, time = "20:07", darkStatus, screenBg = C.cream, style, children }) => {
  const w = PHONE_SCREEN.w + PHONE_BEZEL * 2;
  const h = PHONE_SCREEN.h + PHONE_BEZEL * 2;
  return (
    <Scaled w={w} h={h} scale={scale} style={style}>
      <div
        style={{
          width: w,
          height: h,
          borderRadius: 64,
          background: C.coal,
          padding: PHONE_BEZEL,
          boxShadow: `${SHADOW.device}, inset 0 0 0 2px #3a3a3a`,
          position: "relative",
        }}
      >
        <div
          style={{
            width: PHONE_SCREEN.w,
            height: PHONE_SCREEN.h,
            borderRadius: 50,
            overflow: "hidden",
            position: "relative",
            background: screenBg,
            fontFamily: FONTS.sans,
            color: C.ink,
          }}
        >
          {children}
          <StatusBar time={time} dark={darkStatus} />
          {/* notch */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: 170,
              height: 32,
              background: C.coal,
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              zIndex: 45,
            }}
          />
          {/* home indicator */}
          <div
            style={{
              position: "absolute",
              bottom: 8,
              left: "50%",
              transform: "translateX(-50%)",
              width: 134,
              height: 5,
              borderRadius: 3,
              background: "rgba(44,24,16,0.5)",
              zIndex: 45,
            }}
          />
        </div>
      </div>
    </Scaled>
  );
};

export const TABLET_SCREEN = { w: 1180, h: 820 };
const TABLET_BEZEL = 22;

export const Tablet: React.FC<{ scale?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({
  scale = 1,
  style,
  children,
}) => {
  const w = TABLET_SCREEN.w + TABLET_BEZEL * 2;
  const h = TABLET_SCREEN.h + TABLET_BEZEL * 2;
  return (
    <Scaled w={w} h={h} scale={scale} style={style}>
      <div
        style={{
          width: w,
          height: h,
          borderRadius: 44,
          background: C.coal,
          padding: TABLET_BEZEL,
          boxShadow: `${SHADOW.device}, inset 0 0 0 2px #3a3a3a`,
        }}
      >
        <div
          style={{
            width: TABLET_SCREEN.w,
            height: TABLET_SCREEN.h,
            borderRadius: 24,
            overflow: "hidden",
            position: "relative",
            background: "#f7f3ea",
            fontFamily: FONTS.sans,
            color: C.ink,
          }}
        >
          {children}
        </div>
      </div>
    </Scaled>
  );
};

export const BROWSER_SCREEN = { w: 1240, h: 760 };

export const Browser: React.FC<{ scale?: number; url: string; style?: React.CSSProperties; children: React.ReactNode }> = ({
  scale = 1,
  url,
  style,
  children,
}) => (
  <Scaled w={BROWSER_SCREEN.w} h={BROWSER_SCREEN.h + 52} scale={scale} style={style}>
    <div
      style={{
        width: BROWSER_SCREEN.w,
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: SHADOW.device,
        background: "#f7f3ea",
        fontFamily: FONTS.sans,
        color: C.ink,
      }}
    >
      <div
        style={{
          height: 52,
          background: "#e9e1d1",
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 20px",
        }}
      >
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <span key={c} style={{ width: 14, height: 14, borderRadius: "50%", background: c }} />
        ))}
        <div
          style={{
            marginLeft: 24,
            flex: 1,
            maxWidth: 520,
            height: 32,
            borderRadius: 10,
            background: C.paper,
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            fontSize: 15,
            color: C.cocoa,
          }}
        >
          {url}
        </div>
      </div>
      <div style={{ width: BROWSER_SCREEN.w, height: BROWSER_SCREEN.h, position: "relative", overflow: "hidden" }}>
        {children}
      </div>
    </div>
  </Scaled>
);
