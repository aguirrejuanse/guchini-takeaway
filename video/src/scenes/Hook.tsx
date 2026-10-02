import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BG, Copy, Logo, Mark, Mascot, Pill, Pop, POPPY, Script, useLayout, useSpring } from "../kit";
import { C } from "../theme";
import { CUES } from "../timing";

const T = CUES.hook;

export const HOOK_HEADLINE = { lead: "Todo el control", rest: "de tus sucursales", tail: "en una sola web." };
export const HOOK_FEATURES = ["Pedidos", "Stock", "Promociones", "Analíticas", "Take away"];
export const HOOK_SCRIPT = "tu canal propio de pedidos";

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { portrait, width } = useLayout();
  const logo = useSpring(T.logo, POPPY);
  const online = useSpring(T.online, POPPY);
  const run = interpolate(frame, [T.mascot, T.mascot + 75], [-260, width + 60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const hop = Math.abs(Math.sin(frame / 3.2)) * 14;

  return (
    <BG>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: portrait ? 50 : 46,
          padding: portrait ? "0 70px 160px" : "0 120px 60px",
        }}
      >
        <div style={{ position: "relative" }}>
          <div
            style={{
              opacity: Math.min(logo, 1),
              transform: `scale(${0.4 + logo * 0.6}) rotate(${(1 - logo) * -8}deg)`,
              filter: "drop-shadow(0 24px 30px rgba(44,24,16,0.18))",
            }}
          >
            <Logo height={portrait ? 260 : 300} />
          </div>
          <div
            style={{
              position: "absolute",
              right: portrait ? -60 : -110,
              bottom: portrait ? -34 : -26,
              opacity: Math.min(online, 1),
              transform: `scale(${online}) rotate(-6deg)`,
              transformOrigin: "left center",
            }}
          >
            <Script size={portrait ? 80 : 96}>online</Script>
          </div>
        </div>

        <Pop delay={T.headline}>
          <Copy size={portrait ? 66 : 76} align="center">
            <Mark delay={T.headline + 14}>{HOOK_HEADLINE.lead}</Mark>
            {portrait ? <br /> : " "}
            {HOOK_HEADLINE.rest}
            <br />
            {HOOK_HEADLINE.tail}
          </Copy>
        </Pop>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, maxWidth: portrait ? 860 : 1400 }}>
          {HOOK_FEATURES.map((f, i) => (
            <Pop key={f} delay={T.features + i * T.featureStep} y={24} config={POPPY}>
              <Pill bg={i === HOOK_FEATURES.length - 1 ? C.sun : C.pine} color={i === HOOK_FEATURES.length - 1 ? C.ink : C.paper} size={portrait ? 30 : 32}>
                {f}
              </Pill>
            </Pop>
          ))}
        </div>

        <Pop delay={T.script} y={20}>
          <Script size={portrait ? 64 : 70}>{HOOK_SCRIPT}</Script>
        </Pop>
      </AbsoluteFill>

      <Mascot height={130} style={{ position: "absolute", bottom: portrait ? 260 : 40, left: run, transform: `translateY(${-hop}px)` }} />
    </BG>
  );
};
