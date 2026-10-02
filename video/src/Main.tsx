import React from "react";
import { Audio, interpolate, staticFile, useVideoConfig } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Admin } from "./scenes/Admin";
import { Cierre } from "./scenes/Cierre";
import { Cliente } from "./scenes/Cliente";
import { Diferencial } from "./scenes/Diferencial";
import { Hook } from "./scenes/Hook";
import { Momento } from "./scenes/Momento";
import { MUSIC, SCENES, TRANSITION } from "./timing";

export const SCENE_LIST = [
  { id: "Hook", component: Hook, duration: SCENES.hook },
  { id: "Cliente", component: Cliente, duration: SCENES.cliente },
  { id: "Momento", component: Momento, duration: SCENES.momento },
  { id: "Diferencial", component: Diferencial, duration: SCENES.diferencial },
  { id: "Admin", component: Admin, duration: SCENES.admin },
  { id: "Cierre", component: Cierre, duration: SCENES.cierre },
] as const;

const Music: React.FC<{ src: string }> = ({ src }) => {
  const { durationInFrames, fps } = useVideoConfig();
  return (
    <Audio
      src={staticFile(src)}
      volume={(f) =>
        interpolate(f, [0, fps, durationInFrames - fps * 2, durationInFrames], [0, 0.6, 0.6, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
  );
};

export const Main: React.FC = () => (
  <>
    <TransitionSeries>
      {SCENE_LIST.flatMap(({ id, component: Scene, duration }, i) => [
        ...(i > 0
          ? [
              <TransitionSeries.Transition
                key={`${id}-t`}
                presentation={fade()}
                timing={linearTiming({ durationInFrames: TRANSITION })}
              />,
            ]
          : []),
        <TransitionSeries.Sequence key={id} durationInFrames={duration}>
          <Scene />
        </TransitionSeries.Sequence>,
      ])}
    </TransitionSeries>
    {MUSIC && <Music src={MUSIC} />}
  </>
);
