import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Tablet } from "../devices/Devices";
import { BG, Copy, Mark, Pill, Pop, SectionTitle, useLayout, useSpring } from "../kit";
import { ColumnTitle, OrderCard, PanelHeader } from "../screens/Panel";
import { C, FONTS } from "../theme";
import { CUES } from "../timing";

const T = CUES.diferencial;

/** Demo clock: 20:07 → 20:30 while the scene fast-forwards. Pickup is 20:45, kitchen window 15 min. */
const START_MIN = 7;
const NOW_MIN = 30;
const PICKUP_MIN = 45;

const COL_W = 549;
const GAP = 26;
const SLOT = 146;
const TOP = 52;

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

const Countdown: React.FC<{ minutesLeft: number; inKitchen: boolean }> = ({ minutesLeft, inKitchen }) =>
  inKitchen ? (
    <Pill bg={C.tomato} size={12}>
      🔥 Entra a cocina
    </Pill>
  ) : (
    <Pill bg={C.cream} color={C.ink} size={12}>
      ⏱ en {minutesLeft} min
    </Pill>
  );

const SchedulingPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const mm = useClock();
  const left = PICKUP_MIN - mm;
  const promoted = frame >= T.promote;
  const move = useSpring(T.promote, { damping: 16, stiffness: 90 });
  const cardIn = useSpring(T.scheduledIn);
  const ticking = frame >= T.clockStart && frame < T.clockEnd;
  const lift = Math.sin(Math.PI * Math.min(move, 1));

  return (
    <>
      <PanelHeader branch="Uspallata" address="Ruta N7 km 1151" clock={`20:${String(mm).padStart(2, "0")}`} />
      <div style={{ position: "relative", margin: "26px 28px", height: 640 }}>
        <div style={{ position: "absolute", left: 0, width: COL_W }}>
          <ColumnTitle count={promoted ? 1 : 2} color={C.pine}>
            Programados
          </ColumnTitle>
        </div>
        <div style={{ position: "absolute", left: COL_W + GAP, width: COL_W }}>
          <ColumnTitle count={promoted ? 3 : 2}>Cola activa</ColumnTitle>
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            width: COL_W,
            top: TOP + SLOT * 2 + 10,
            fontSize: 14,
            color: C.cocoa,
            borderTop: `2px dashed ${C.line}`,
            paddingTop: 12,
          }}
        >
          Pasan solos a la cola 15 min antes del retiro.
        </div>

        {/* existing active queue — shifts down when the scheduled order arrives */}
        {[
          { id: "#10481", name: "Nico", items: "1× La Patrona", total: 14500, pickup: "Llega en 10 min", status: "EN PREPARACIÓN" as const },
          { id: "#10484", name: "Caro", items: "1× Mortadela", total: 14500, pickup: "Lo antes posible", status: "CONFIRMADO" as const },
        ].map((o, i) => (
          <div
            key={o.id}
            style={{ position: "absolute", left: COL_W + GAP, width: COL_W, top: TOP + SLOT * (i + move) }}
          >
            <OrderCard {...o} />
          </div>
        ))}

        {/* the other scheduled order slides up into the free slot */}
        <div style={{ position: "absolute", left: 0, width: COL_W, top: TOP + SLOT * (1 - move), opacity: cardIn }}>
          <OrderCard
            id="#10486"
            name="Vale"
            items="1× Crunchini"
            total={16500}
            pickup="Retira 21:30"
            badge={<Countdown minutesLeft={90 - mm} inKitchen={false} />}
          />
        </div>

        {/* the hero order travels Programados → Cola activa */}
        <div
          style={{
            position: "absolute",
            width: COL_W,
            left: (COL_W + GAP) * move,
            top: TOP - lift * 30,
            opacity: cardIn,
            transform: `translateY(${(1 - cardIn) * 30}px) scale(${1 + lift * 0.04})`,
            zIndex: 5,
          }}
        >
          <OrderCard
            id="#10483"
            name="Joaquín"
            items="2× Guchicken + Boniatos"
            total={33000}
            pickup={`Retira 20:45 · viene por Ruta 7`}
            status={promoted ? "CONFIRMADO" : undefined}
            glow={ticking || promoted ? 1 : 0.4}
            badge={<Countdown minutesLeft={left} inKitchen={promoted} />}
          />
        </div>
      </div>
    </>
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
          <Tablet scale={portrait ? 0.74 : 0.86}>
            <SchedulingPanel />
          </Tablet>
        </div>
      </AbsoluteFill>
    </BG>
  );
};
