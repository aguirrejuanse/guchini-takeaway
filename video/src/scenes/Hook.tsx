import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BG, Copy, Logo, Mark, Mascot, Pop, POPPY, Script, useLayout, useSpring } from "../kit";
import { CUES } from "../timing";

const T = CUES.hook;

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { portrait, width } = useLayout();
  const logo = useSpring(T.logo, POPPY);
  const run = interpolate(frame, [T.mascot, T.mascot + 75], [-260, width + 60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const hop = Math.abs(Math.sin(frame / 3.2)) * 14;
  const size = portrait ? 78 : 104;

  return (
    <BG>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: portrait ? 80 : 160 }}>
        <Pop delay={T.line1} exit={T.out}>
          <Copy size={size} align="center">
            Las filas son lindas
          </Copy>
        </Pop>
        <Pop delay={T.line2} exit={T.out + 3}>
          <Copy size={size} align="center" style={{ marginTop: 10 }}>
            hasta que te quedás{portrait ? <br /> : " "}
            <Mark color="#ffb3c6" delay={T.line2 + 18}>
              sin stock.
            </Mark>
          </Copy>
        </Pop>
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 34 }}>
        <div
          style={{
            opacity: Math.min(logo, 1),
            transform: `scale(${0.4 + logo * 0.6}) rotate(${(1 - logo) * -8}deg)`,
            filter: "drop-shadow(0 24px 30px rgba(44,24,16,0.18))",
          }}
        >
          <Logo height={portrait ? 300 : 380} />
        </div>
        <Pop delay={T.script} y={20}>
          <Script size={portrait ? 68 : 84}>un canal propio de pedidos</Script>
        </Pop>
      </AbsoluteFill>

      <Mascot height={130} style={{ position: "absolute", bottom: portrait ? 260 : 70, left: run, transform: `translateY(${-hop}px)` }} />
    </BG>
  );
};
