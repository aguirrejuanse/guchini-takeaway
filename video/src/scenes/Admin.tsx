import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Browser, Phone } from "../devices/Devices";
import { BG, Pill, Pop, progress, ScreenAt, useLayout, useSpring } from "../kit";
import { AdminPage, ADMIN_W, ADMIN_Y } from "../screens/AdminPage";
import { MenuScreen, MENU_SCROLL_GUCHICKEN } from "../screens/Customer";
import { useScroll, WebViewport } from "../screens/web";
import { C } from "../theme";
import { CUES } from "../timing";

const T = CUES.admin;
const DRAIN_STEP = 16;

const PHRASES = [
  { at: T.promoIn, text: "Sus promos, medibles." },
  { at: T.stockIn, text: "Su stock, en vivo." },
  { at: T.funnelIn, text: "Sus datos, de ellos." },
];

const Headline: React.FC<{ portrait: boolean }> = ({ portrait }) => {
  const frame = useCurrentFrame();
  const active = PHRASES.reduce((acc, p, i) => (frame >= p.at ? i : acc), 0);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: portrait ? "column" : "row",
        gap: portrait ? 4 : 26,
        fontWeight: 800,
        fontSize: portrait ? 60 : 54,
        letterSpacing: -1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {PHRASES.map((p, i) => (
        <Pop key={p.text} delay={p.at} y={20}>
          <span style={{ color: i === active ? C.ink : "rgba(44,24,16,0.35)" }}>{p.text}</span>
        </Pop>
      ))}
    </div>
  );
};

const DRAIN_AT = [T.stockDrain, T.stockDrain + DRAIN_STEP, T.stockDrain + DRAIN_STEP * 2];

const AdminView: React.FC = () => {
  const frame = useCurrentFrame();
  const drained = DRAIN_AT.filter((t) => frame >= t + 3).length;
  const toStock = useScroll(T.stockIn - 14, T.stockIn + 24, ADMIN_Y.stock, ADMIN_Y.promos);
  const q = progress(frame, T.funnelIn - 6, T.funnelIn + 30);
  const scroll = frame < T.funnelIn - 6 ? toStock : ADMIN_Y.stock * (1 - q * q * (3 - 2 * q));
  return (
    <WebViewport width={ADMIN_W} scroll={scroll}>
      <AdminPage countAt={T.funnelIn} guchickenUspallata={3 - drained} tapMinus={DRAIN_AT} soldOutAt={T.soldOut} />
    </WebViewport>
  );
};

export const Admin: React.FC = () => {
  const frame = useCurrentFrame();
  const { portrait } = useLayout();
  const enter = useSpring(0);
  const drained = DRAIN_AT.filter((t) => frame >= t + 3).length;
  const phoneFocus = progress(frame, T.soldOut - 10, T.soldOut);

  return (
    <BG>
      <AbsoluteFill style={{ alignItems: "center", padding: portrait ? "110px 40px" : "46px 60px 0", gap: portrait ? 40 : 30 }}>
        <Headline portrait={portrait} />
        <div
          style={{
            display: "flex",
            flexDirection: portrait ? "column" : "row",
            alignItems: "center",
            gap: portrait ? 40 : 50,
            opacity: enter,
            transform: `translateY(${(1 - enter) * 40}px)`,
          }}
        >
          <Browser url="guchini.com.ar/admin" scale={portrait ? 0.8 : 0.98}>
            <AdminView />
          </Browser>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <Pill bg={phoneFocus > 0.5 ? C.tomato : C.ink} color={C.paper} size={14}>
              Menú Uspallata · en vivo
            </Pill>
            <div style={{ transform: `scale(${1 + phoneFocus * 0.03})` }}>
              <Phone scale={portrait ? 0.62 : 0.76} url="guchini.com.ar/pedir/uspallata">
                <ScreenAt from={0} slide={false}>
                  <MenuScreen branch="uspallata" scroll={MENU_SCROLL_GUCHICKEN} at={-100} guchickenStock={3 - drained} />
                </ScreenAt>
              </Phone>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </BG>
  );
};
