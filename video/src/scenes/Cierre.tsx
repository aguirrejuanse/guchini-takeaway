import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BG, Display, Logo, Mascot, Pill, Pop, POPPY, Script, useLayout, useSpring } from "../kit";
import { BRANCHES, C } from "../theme";
import { CUES } from "../timing";

const T = CUES.cierre;

export const Cierre: React.FC = () => {
  const frame = useCurrentFrame();
  const { portrait } = useLayout();
  const logo = useSpring(T.logo, POPPY);
  const breathe = 1 + Math.sin(frame / 14) * 0.012;

  return (
    <BG>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 26, padding: 60 }}>
        <div style={{ transform: `scale(${(0.5 + logo * 0.5) * breathe})`, opacity: Math.min(logo, 1) }}>
          <Logo height={portrait ? 300 : 330} style={{ filter: "drop-shadow(0 24px 30px rgba(44,24,16,0.18))" }} />
        </div>
        <Pop delay={T.tagline}>
          <div style={{ display: "flex", flexDirection: portrait ? "column" : "row", alignItems: "center", gap: portrait ? 8 : 26 }}>
            <Display size={portrait ? 84 : 92} style={{ letterSpacing: 6 }}>
              Guchini Takeaway
            </Display>
            <Script size={portrait ? 80 : 86}>su canal propio.</Script>
          </div>
        </Pop>
        <Pop delay={T.pricing} y={20}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 14 }}>
            {BRANCHES.map((b, i) => (
              <Pop key={b.id} delay={T.pricing + 4 + i * 4} y={14}>
                <Pill bg={C.pine} size={20}>
                  {b.name}
                </Pill>
              </Pop>
            ))}
            <Pop delay={T.pricing + 24} y={14}>
              <Pill bg="transparent" color={C.pine} size={20} style={{ border: `2px dashed ${C.pine}` }}>
                + tu próximo local
              </Pill>
            </Pop>
          </div>
        </Pop>
        <Pop delay={T.pricing + 10} y={16}>
          <div style={{ fontSize: portrait ? 34 : 36, fontWeight: 600, color: C.cocoa, textAlign: "center", marginTop: 6 }}>
            Setup + fee mensual por sucursal. <b style={{ color: C.ink }}>Crece con cada local.</b>
          </div>
        </Pop>
      </AbsoluteFill>
      <Mascot height={110} style={{ position: "absolute", right: 70, bottom: 50, opacity: Math.min(logo, 1) }} />
    </BG>
  );
};
