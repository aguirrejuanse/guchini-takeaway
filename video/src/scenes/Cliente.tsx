import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Phone } from "../devices/Devices";
import { BG, Copy, Mark, Pop, ScreenAt, SectionTitle, Tap, useLayout, useSpring } from "../kit";
import {
  BranchSheet,
  CART_TAP,
  CartBar,
  CheckoutScreen,
  GUCHICKEN_TAP,
  HomeScreen,
  MENU_SCROLL,
  PaymentScreen,
  useScroll,
} from "../screens/Customer";
import { C, FONTS } from "../theme";
import { CUES, SCENES } from "../timing";

const T = CUES.cliente;

const STEPS = [
  { from: 0, title: <>Entra al menú.</>, sub: "Su carta, sus fotos, sus precios." },
  { from: T.sheet, title: <>Elige <Mark delay={T.sheet + 18}>dónde retira.</Mark></>, sub: "Ciudad, Chacras, Uspallata o Nueva Córdoba." },
  { from: T.checkout, title: <>Avisa en cuánto <Mark delay={T.checkout + 18}>llega.</Mark></>, sub: "La cocina sabe cuándo arrancar." },
  { from: T.tapPay, title: <>Paga con <Mark color="#9fdcf6" delay={T.tapPay + 18}>Mercado Pago.</Mark></>, sub: "Sin efectivo, sin errores, sin fila." },
];

const StepCopy: React.FC<{ portrait: boolean }> = ({ portrait }) => {
  const frame = useCurrentFrame();
  const current = STEPS.reduce((acc, st, i) => (frame >= st.from ? i : acc), 0);
  return (
    <div style={{ position: "relative", height: portrait ? 300 : 360, width: portrait ? 920 : 780 }}>
      {STEPS.map((st, i) => {
        const next = STEPS[i + 1]?.from ?? SCENES.cliente + 30;
        return (
          <Pop key={i} delay={st.from + 4} exit={next - 10} style={{ position: "absolute", inset: 0 }}>
            <div style={{ fontFamily: FONTS.display, fontSize: 30, letterSpacing: 4, color: C.tomato }}>
              0{i + 1}
            </div>
            <Copy size={portrait ? 70 : 84} style={{ marginTop: 6 }}>
              {st.title}
            </Copy>
            <div style={{ fontSize: portrait ? 32 : 34, fontWeight: 500, color: C.cocoa, marginTop: 18 }}>{st.sub}</div>
          </Pop>
        );
      })}
      <div style={{ position: "absolute", bottom: 0, left: 0, display: "flex", gap: 10 }}>
        {STEPS.map((_, i) => (
          <div
            key={i}
            style={{
              height: 8,
              width: i === current ? 56 : 18,
              borderRadius: 4,
              background: i <= current ? C.ink : "rgba(44,24,16,0.15)",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export const Cliente: React.FC = () => {
  const frame = useCurrentFrame();
  const { portrait } = useLayout();
  const enter = useSpring(0);
  const scroll = useScroll(30, T.tapProduct - 25, MENU_SCROLL);
  const tileGlow = frame >= T.tapProduct - 4 && frame < T.added ? 1 : 0;
  const float = Math.sin(frame / 40) * 6;

  return (
    <BG>
      <AbsoluteFill
        style={{
          flexDirection: portrait ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          gap: portrait ? 50 : 140,
          padding: portrait ? "150px 80px" : 0,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 46 }}>
          <Pop delay={4}>
            <SectionTitle size={34} delay={4}>
              El cliente
            </SectionTitle>
          </Pop>
          <StepCopy portrait={portrait} />
        </div>

        <div style={{ transform: `translateX(${(1 - enter) * 200}px) translateY(${float}px)`, opacity: enter }}>
          <Phone scale={portrait ? 1.22 : 1.04} darkStatus={frame >= T.paying}>
            <ScreenAt from={0} to={T.checkout}>
              <HomeScreen scroll={scroll} highlight={tileGlow} branch={frame >= T.added ? "Ciudad" : undefined} />
              <Tap at={T.tapProduct} x={GUCHICKEN_TAP.x} y={GUCHICKEN_TAP.y} />
              <BranchSheet at={T.sheet} pick={T.tapBranch} close={T.added} />
              <CartBar at={T.added} />
              <Tap at={T.tapCart} x={CART_TAP.x} y={CART_TAP.y} />
            </ScreenAt>
            <ScreenAt from={T.checkout} to={T.paying}>
              <CheckoutScreen typeName={T.typeName} typePhone={T.typePhone} pickEta={T.pickEta} tapPay={T.tapPay} />
            </ScreenAt>
            <ScreenAt from={T.paying}>
              <PaymentScreen approved={T.approved} />
            </ScreenAt>
          </Phone>
        </div>
      </AbsoluteFill>
    </BG>
  );
};
