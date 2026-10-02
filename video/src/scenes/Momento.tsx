import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Phone, Tablet } from "../devices/Devices";
import { BG, Copy, Mark, Pop, POPPY, progress, Tap, useLayout, useSpring } from "../kit";
import { ConfirmedScreen } from "../screens/Customer";
import { ColumnTitle, OrderCard, PanelHeader, type Status } from "../screens/Panel";
import { ars, C, FONTS, ORDER } from "../theme";
import { CUES } from "../timing";

const T = CUES.momento;
const FLOW: Status[] = ["PAGADO", "CONFIRMADO", "EN PREPARACIÓN", "LISTO"];
const STEP_AT = [T.orderIn, T.confirmed, T.preparing, T.ready];
const CARD_H = 168;

const Kpi: React.FC<{ label: string; value: string; bump?: number }> = ({ label, value, bump = 0 }) => (
  <div style={{ background: C.paper, borderRadius: 18, padding: "16px 18px", marginBottom: 14 }}>
    <div style={{ fontSize: 13, color: C.cocoa, fontWeight: 600 }}>{label}</div>
    <div
      style={{
        fontFamily: FONTS.display,
        fontSize: 34,
        letterSpacing: 1,
        marginTop: 2,
        color: bump > 0.05 ? C.pine : C.ink,
        transform: `scale(${1 + bump * 0.08})`,
        transformOrigin: "left center",
      }}
    >
      {value}
    </div>
  </div>
);

const ActionButton: React.FC<{ label: string; bg: string; color: string; tapAt?: number; enter?: number }> = ({
  label,
  bg,
  color,
  tapAt,
  enter = 1,
}) => (
  <div
    style={{
      position: "relative",
      height: 46,
      padding: "0 22px",
      borderRadius: 14,
      background: bg,
      color,
      fontWeight: 700,
      fontSize: 16,
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      transform: `scale(${enter})`,
      transformOrigin: "left center",
    }}
  >
    {label}
    {tapAt !== undefined && <Tap at={tapAt} x={70} y={23} />}
  </div>
);

const LivePanel: React.FC = () => {
  const frame = useCurrentFrame();
  const step = STEP_AT.reduce((acc, at, i) => (frame >= at ? i : acc), -1);
  const drop = useSpring(T.orderIn, POPPY);
  const glow = step < 0 ? 0 : Math.max(0, 1 - progress(frame, T.orderIn + 30, T.orderIn + 70)) + (step === 3 ? 1 : 0);
  const wa = useSpring(T.waButton, POPPY);
  const bump = 1 - progress(frame, T.orderIn, T.orderIn + 25);
  const isIn = frame >= T.orderIn;
  const nextTap = STEP_AT.find((at, i) => i > 0 && at > frame - 22 && frame >= at - 20);

  return (
    <>
      <PanelHeader branch="Ciudad" address={ORDER.address} clock="20:07" />
      <div style={{ display: "flex", gap: 26, padding: "26px 28px" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <ColumnTitle count={isIn ? 3 : 2}>Cola activa</ColumnTitle>
          <div style={{ position: "relative" }}>
            {isIn && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  transform: `translateY(${(1 - drop) * -40}px) scale(${0.85 + drop * 0.15})`,
                  opacity: Math.min(drop * 1.4, 1),
                  zIndex: 2,
                }}
              >
                <OrderCard
                  id={ORDER.id}
                  name={ORDER.customer}
                  items={`1× ${ORDER.product}`}
                  total={ORDER.price}
                  pickup="Llega en 30 min · Pagado con Mercado Pago"
                  status={FLOW[Math.max(step, 0)]}
                  glow={Math.min(glow, 1)}
                  footer={
                    <div style={{ marginTop: 14, display: "flex", gap: 12 }}>
                      {step < 3 ? (
                        <ActionButton
                          label="Avanzar estado →"
                          bg={C.ink}
                          color={C.cream}
                          tapAt={nextTap}
                        />
                      ) : (
                        <ActionButton label="💬 Enviar WhatsApp" bg={C.whatsapp} color={C.paper} tapAt={T.tapWa} enter={wa} />
                      )}
                    </div>
                  }
                />
              </div>
            )}
            <div style={{ transform: `translateY(${drop * (CARD_H + 16)}px)` }}>
              <OrderCard
                id="#10480"
                name="Sofi"
                items="1× Combo Guchi"
                total={20000}
                pickup="Llega en 15 min"
                status="EN PREPARACIÓN"
                style={{ marginBottom: 16 }}
              />
              <OrderCard id="#10479" name="Lucas" items="2× Crudo" total={29000} pickup="Lo antes posible" status="LISTO" dim />
            </div>
          </div>
        </div>
        <div style={{ width: 300 }}>
          <ColumnTitle>Hoy</ColumnTitle>
          <Kpi label="Pedidos pagados" value={isIn ? "38" : "37"} bump={isIn ? bump : 0} />
          <Kpi label="Facturado online" value={ars(isIn ? 512500 : 498000)} bump={isIn ? bump : 0} />
          <Kpi label="Pedidos sin pagar en cola" value="0" />
        </div>
      </div>
    </>
  );
};

const WhatsAppBubble: React.FC = () => {
  const s = useSpring(T.waBubble, POPPY);
  return (
    <div
      style={{
        width: 420,
        transform: `scale(${s}) translateY(${(1 - s) * 30}px)`,
        transformOrigin: "bottom left",
        opacity: Math.min(s, 1),
        background: C.paper,
        borderRadius: 26,
        boxShadow: "0 30px 60px rgba(44,24,16,0.25)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          background: "#075e54",
          color: C.paper,
          padding: "14px 20px",
          fontWeight: 700,
          fontSize: 20,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ width: 36, height: 36, borderRadius: "50%", background: C.cream, display: "grid", placeItems: "center", fontSize: 20 }}>
          🥪
        </span>
        Guchini Ciudad
      </div>
      <div style={{ padding: 18, background: "#ece5dd" }}>
        <div
          style={{
            background: C.waBubble,
            borderRadius: "18px 18px 4px 18px",
            padding: "14px 18px",
            fontSize: 22,
            lineHeight: 1.35,
            marginLeft: 30,
          }}
        >
          <b>¡Tu pedido está listo!</b> 🙌
          <br />
          {ORDER.id} · Retiralo en {ORDER.address}.
          <div style={{ textAlign: "right", fontSize: 14, color: C.cocoa, marginTop: 4 }}>20:31 ✓✓</div>
        </div>
      </div>
    </div>
  );
};

export const Momento: React.FC = () => {
  const frame = useCurrentFrame();
  const { portrait } = useLayout();
  const step = STEP_AT.reduce((acc, at, i) => (frame >= at ? i : acc), 0);
  const tabletIn = useSpring(8);

  return (
    <BG>
      <AbsoluteFill style={{ alignItems: "center", padding: portrait ? "120px 60px" : "56px 80px 0" }}>
        <Pop delay={T.orderIn - 10}>
          <Copy size={portrait ? 58 : 62} align="center">
            El pedido cae en el local.{portrait ? <br /> : " "}
            <Mark delay={T.orderIn + 16}>Solo si está pagado.</Mark>
          </Copy>
        </Pop>
        <div
          style={{
            display: "flex",
            flexDirection: portrait ? "column" : "row",
            alignItems: "center",
            gap: portrait ? 50 : 80,
            marginTop: portrait ? 60 : 44,
          }}
        >
          <div style={{ position: "relative", zIndex: 3 }}>
            <Phone scale={portrait ? 0.78 : 0.8} time="20:07">
              <ConfirmedScreen step={step} />
            </Phone>
            <div style={{ position: "absolute", left: portrait ? 220 : 210, top: portrait ? 40 : 60, zIndex: 5 }}>
              {frame >= T.waBubble - 2 && <WhatsAppBubble />}
            </div>
          </div>
          <div style={{ transform: `translateX(${(1 - tabletIn) * 160}px)`, opacity: tabletIn }}>
            <Tablet scale={portrait ? 0.74 : 0.68}>
              <LivePanel />
            </Tablet>
          </div>
        </div>
      </AbsoluteFill>
    </BG>
  );
};
