import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Browser } from "../devices/Devices";
import { BG, Copy, Mark, Pop, SectionTitle, useLayout, useSpring } from "../kit";
import { LocalPage, OrderCard, type OrderCardData } from "../screens/Panel";
import { WebViewport } from "../screens/web";
import { ars, BRANCHES, C, FONTS } from "../theme";
import { CUES } from "../timing";

const T = CUES.diferencial;

/** Demo clock: 20:07 → 20:30 while the scene fast-forwards. Pickup is 20:45, kitchen window 15 min. */
const START_MIN = 7;
const NOW_MIN = 30;
const PICKUP_MIN = 45;

const useClock = () => {
  const frame = useCurrentFrame();
  return Math.round(
    interpolate(frame, [T.clockStart, T.clockEnd], [START_MIN, NOW_MIN], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => t * t * (3 - 2 * t),
    }),
  );
};

const W = 1024;
const uspallata = BRANCHES[2];
/** es-AR time like the real app: "08:45 P. M." */
const fmt = (min: number) => {
  const h24 = 20 + Math.floor(min / 60);
  const mm = String(min % 60).padStart(2, "0");
  return `${String(h24 - 12).padStart(2, "0")}:${mm} P. M.`;
};

const LocalView: React.FC = () => {
  const frame = useCurrentFrame();
  const mm = useClock();
  const left = PICKUP_MIN - mm;
  const promoted = left <= 15 && frame >= T.promote;
  const base = { branch: uspallata.shortName, branchName: uspallata.name };
  const joaquin: OrderCardData = {
    ...base,
    number: "10483",
    elapsed: promoted ? "hace 23 min" : mm - START_MIN < 1 ? "recién" : `hace ${mm - START_MIN} min`,
    customer: "Joaquín",
    status: "PAGADO",
    items: ["2x Guchicken", "1x Boniatos"],
    total: ars(33000),
    scheduledTag: promoted ? undefined : `Programado · retira ${fmt(PICKUP_MIN)} · en ${left} min`,
    tapAction: promoted ? undefined : undefined,
    at: promoted ? T.promote : undefined,
    highlight: promoted ? Math.max(0, 1 - (frame - T.promote) / 70) : 0,
  };
  const vale: OrderCardData = {
    ...base,
    number: "10486",
    elapsed: "recién",
    customer: "Vale",
    status: "PAGADO",
    items: ["1x Crunchini"],
    total: ars(16500),
    scheduledTag: `Programado · retira ${fmt(90)} · en ${90 - mm} min`,
  };
  const caro: OrderCardData = {
    ...base,
    number: "10484",
    elapsed: `hace ${4 + (mm - START_MIN)} min`,
    customer: "Caro",
    status: "CONFIRMADO",
    items: ["1x Mortadela"],
    total: ars(14500),
  };
  const active = promoted ? [<OrderCard key="j" o={joaquin} />, <OrderCard key="c" o={caro} />] : [<OrderCard key="c" o={caro} />];
  const scheduled = promoted ? [<OrderCard key="v" o={vale} />] : [<OrderCard key="j" o={joaquin} />, <OrderCard key="v" o={vale} />];
  const cardIn = frame >= T.scheduledIn;
  return (
    <WebViewport width={W}>
      <LocalPage width={W} cols={2} filter="uspallata" active={active} scheduled={cardIn ? scheduled : []} />
    </WebViewport>
  );
};

/** Little road: the customer's car advances while the clock fast-forwards. */
const Road: React.FC = () => {
  const mm = useClock();
  const p = (mm - START_MIN) / (PICKUP_MIN - START_MIN);
  return (
    <div style={{ width: 560, marginTop: 10 }}>
      <div style={{ position: "relative", height: 54 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 30, height: 6, borderRadius: 3, background: C.ink }} />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 32,
            height: 2,
            backgroundImage: `repeating-linear-gradient(90deg, ${C.sun} 0 18px, transparent 18px 32px)`,
          }}
        />
        <div style={{ position: "absolute", left: `calc(${p * 100}% - 22px)`, top: 0, fontSize: 40, transform: "scaleX(-1)" }}>🚗</div>
        <div style={{ position: "absolute", right: -8, top: 2, fontSize: 34 }}>🥪</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: 600, color: C.cocoa, marginTop: 8 }}>
        <span>Mendoza</span>
        <span style={{ fontFamily: FONTS.display, letterSpacing: 2, color: C.ink }}>RETIRA 20:45</span>
        <span>Uspallata</span>
      </div>
    </div>
  );
};

export const Diferencial: React.FC = () => {
  const { portrait } = useLayout();
  const tabletIn = useSpring(T.panelIn);
  return (
    <BG>
      <AbsoluteFill
        style={{
          flexDirection: portrait ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          gap: portrait ? 70 : 70,
          padding: portrait ? "140px 60px" : "0 60px",
        }}
      >
        <div style={{ width: portrait ? 900 : 640, display: "flex", flexDirection: "column", gap: 34 }}>
          <Pop delay={4}>
            <SectionTitle size={34} delay={4}>
              Pedido programado
            </SectionTitle>
          </Pop>
          <Pop delay={T.scheduledIn}>
            <Copy size={portrait ? 66 : 70}>El que viene por la ruta pide antes.</Copy>
          </Pop>
          <Pop delay={T.copy2}>
            <Copy size={portrait ? 66 : 70}>
              La cocina <Mark delay={T.copy2 + 14}>lo ve antes.</Mark>
            </Copy>
          </Pop>
          <Pop delay={T.clockStart - 10}>
            <Road />
          </Pop>
        </div>
        <div style={{ opacity: tabletIn, transform: `translateX(${(1 - tabletIn) * 160}px)` }}>
          <Browser scale={portrait ? 0.76 : 0.9} url="guchini.com.ar/local">
            <LocalView />
          </Browser>
        </div>
      </AbsoluteFill>
    </BG>
  );
};
