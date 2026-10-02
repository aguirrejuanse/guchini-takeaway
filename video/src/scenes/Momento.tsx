import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Browser, BROWSER_SCREEN, Phone } from "../devices/Devices";
import { BG, Copy, Mark, Pop, ScreenAt, useLayout, useSpring } from "../kit";
import { ConfirmacionScreen, TrackingScreen } from "../screens/Customer";
import { LocalPage, OrderCard, type OrderCardData, type StatusKey } from "../screens/Panel";
import { useScroll, WebViewport } from "../screens/web";
import { ars, BRANCHES, ORDER } from "../theme";
import { CUES } from "../timing";

const T = CUES.momento;
const FLOW: StatusKey[] = ["PAGADO", "CONFIRMADO", "EN_PREPARACION", "LISTO"];
const STEP_AT = [T.orderIn, T.confirmed, T.preparing, T.ready];
const TAP_AT = [T.tapConfirm, T.tapPrepare, T.tapReady];
const W = 880;

const stepAt = (frame: number) => STEP_AT.reduce((acc, at, i) => (frame >= at ? i : acc), -1);

const LocalView: React.FC = () => {
  const frame = useCurrentFrame();
  const step = Math.max(stepAt(frame), 0);
  const isIn = frame >= T.orderIn;
  const scroll = useScroll(T.ready + 30, T.ready + 60, 0);
  const city = BRANCHES[0];

  const mine: OrderCardData = {
    number: ORDER.number,
    branch: city.shortName,
    branchName: ORDER.branchName,
    elapsed: step >= 2 ? "hace 3 min" : "recién",
    customer: ORDER.customer,
    status: FLOW[step],
    items: ["1x Guchicken"],
    total: ars(ORDER.total),
    tapAction: step < 3 ? TAP_AT[step] : undefined,
    tapWa: T.tapWa,
    showWaPreview: step === 3,
    waAt: T.ready + 4,
    at: T.orderIn,
    highlight: Math.max(0, 1 - (frame - T.orderIn) / 60),
  };
  const nico: OrderCardData = {
    number: "10481",
    branch: city.shortName,
    branchName: ORDER.branchName,
    elapsed: "hace 6 min",
    customer: "Nico",
    status: "EN_PREPARACION",
    items: ["1x La Patrona"],
    total: ars(14500),
  };
  return (
    <WebViewport width={W} scroll={scroll}>
      <LocalPage width={W} cols={2} filter="todas" active={isIn ? [<OrderCard key="m" o={mine} />, <OrderCard key="n" o={nico} />] : [<OrderCard key="n" o={nico} />]} />
    </WebViewport>
  );
};

export const Momento: React.FC = () => {
  const { portrait } = useLayout();
  const browserIn = useSpring(8);
  const phoneStep = Math.max(stepAt(useCurrentFrame()), 0);
  const url = (f: number) => (f < T.tracking ? "guchini.com.ar/confirmacion/10482" : "guchini.com.ar/pedido/10482");
  const frame = useCurrentFrame();
  const confirmScroll = useScroll(T.orderIn + 10, T.orderIn + 40, 160);

  return (
    <BG>
      <AbsoluteFill style={{ alignItems: "center", padding: portrait ? "120px 40px" : "48px 60px 0" }}>
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
            alignItems: portrait ? "center" : "flex-start",
            gap: portrait ? 36 : 56,
            marginTop: portrait ? 50 : 36,
          }}
        >
          <div style={{ position: "relative", zIndex: 3 }}>
            <Phone scale={portrait ? 0.62 : 0.92} url={url(frame)}>
              <ScreenAt from={0} to={T.tracking} slide={false}>
                <ConfirmacionScreen at={0} scroll={confirmScroll} tapStatus={T.tapTrack} />
              </ScreenAt>
              <ScreenAt from={T.tracking} slide={false}>
                <TrackingScreen at={T.tracking} step={phoneStep} />
              </ScreenAt>
            </Phone>
          </div>
          <div style={{ transform: `translateX(${(1 - browserIn) * 160}px)`, opacity: browserIn }}>
            <Browser scale={portrait ? 0.82 : 1.0} url="guchini.com.ar/local">
              <LocalView />
            </Browser>
          </div>
        </div>
      </AbsoluteFill>
    </BG>
  );
};

void BROWSER_SCREEN;
