import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Phone, PHONE_VIEW } from "../devices/Devices";
import { BG, Copy, Mark, Pop, ScreenAt, SectionTitle, useLayout, useSpring } from "../kit";
import {
  CarritoScreen,
  CartBar,
  CheckoutScreen,
  ConfirmacionScreen,
  MenuScreen,
  MENU_SCROLL_GUCHICKEN,
  PaymentScreen,
  PedirScreen,
} from "../screens/Customer";
import { useScroll } from "../screens/web";
import { C, FONTS } from "../theme";
import { CUES, SCENES } from "../timing";

const T = CUES.cliente;

const STEPS = [
  { from: 0, title: <>Elige <Mark delay={T.pedir + 18}>dónde retira.</Mark></>, sub: "Cada sucursal, con su menú y su stock." },
  { from: T.menu, title: <>Arma su <Mark delay={T.menu + 18}>pedido.</Mark></>, sub: "Toca, agrega, y la promo ya viene aplicada." },
  { from: T.checkout, title: <>Avisa en cuánto <Mark delay={T.checkout + 18}>llega.</Mark></>, sub: "Ya, o programado para cuando llega." },
  { from: T.scrollPay + 20, title: <>Paga con <Mark color="#9fdcf6" delay={T.scrollPay + 38}>Mercado Pago.</Mark></>, sub: "Sin efectivo, sin errores, sin fila." },
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
            <div style={{ fontFamily: FONTS.display, fontSize: 30, letterSpacing: 4, color: C.tomato }}>0{i + 1}</div>
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
            style={{ height: 8, width: i === current ? 56 : 18, borderRadius: 4, background: i <= current ? C.ink : "rgba(44,24,16,0.15)" }}
          />
        ))}
      </div>
    </div>
  );
};

const URLS = (frame: number) =>
  frame < T.menu
    ? "guchini.com.ar/pedir"
    : frame < T.carrito
      ? "guchini.com.ar/pedir/ciudad"
      : frame < T.checkout
        ? "guchini.com.ar/pedir/ciudad/carrito"
        : frame < T.pago
          ? "guchini.com.ar/pedir/ciudad/checkout"
          : frame < T.confirmed
            ? "guchini.com.ar/pago"
            : "guchini.com.ar/confirmacion/10482";

export const Cliente: React.FC = () => {
  const frame = useCurrentFrame();
  const { portrait } = useLayout();
  const enter = useSpring(0);
  const menuScroll = useScroll(T.scrollStart, T.scrollEnd, MENU_SCROLL_GUCHICKEN);
  const checkoutScroll = useScroll(T.scrollPay, T.scrollPay + 30, 150);
  const confirmScroll = useScroll(T.confirmed + 50, T.confirmed + 80, 140);
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
          <Phone scale={portrait ? 1.22 : 1.04} url={URLS(frame)}>
            <ScreenAt from={0} to={T.menu} slide={false}>
              <PedirScreen tapBranch={T.tapBranch} />
            </ScreenAt>
            <ScreenAt from={T.menu} to={T.carrito} slide={false}>
              <MenuScreen branch="ciudad" scroll={menuScroll} at={T.menu} addedAt={T.added} tapAdd={T.tapAdd} />
              <CartBar at={T.added + 6} tap={T.tapCart} />
            </ScreenAt>
            <ScreenAt from={T.carrito} to={T.checkout} slide={false}>
              <CarritoScreen at={T.carrito} tapContinue={T.tapContinue} />
            </ScreenAt>
            <ScreenAt from={T.checkout} to={T.pago} slide={false}>
              <CheckoutScreen
                at={T.checkout}
                scroll={checkoutScroll}
                typeName={T.typeName}
                typePhone={T.typePhone}
                pickEta={T.pickEta}
                tapPay={T.tapPay}
              />
            </ScreenAt>
            <ScreenAt from={T.pago} to={T.confirmed} slide={false}>
              <PaymentScreen tapApprove={T.tapApprove} processingAt={T.processing} viewH={PHONE_VIEW.h} />
            </ScreenAt>
            <ScreenAt from={T.confirmed} slide={false}>
              <ConfirmacionScreen at={T.confirmed} scroll={confirmScroll} />
            </ScreenAt>
          </Phone>
        </div>
      </AbsoluteFill>
    </BG>
  );
};
