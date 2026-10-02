import React from "react";
import { Composition, Folder } from "remotion";
import { Main, SCENE_LIST } from "./Main";
import { FPS, TOTAL } from "./timing";

const LANDSCAPE = { width: 1920, height: 1080 };
const PORTRAIT = { width: 1080, height: 1920 };

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="GuchiniDemo" component={Main} durationInFrames={TOTAL} fps={FPS} {...LANDSCAPE} />
    <Composition id="GuchiniDemoVertical" component={Main} durationInFrames={TOTAL} fps={FPS} {...PORTRAIT} />
    <Folder name="Escenas">
      {SCENE_LIST.map(({ id, component, duration }) => (
        <Composition key={id} id={id} component={component} durationInFrames={duration} fps={FPS} {...LANDSCAPE} />
      ))}
    </Folder>
    <Folder name="Escenas-9x16">
      {SCENE_LIST.map(({ id, component, duration }) => (
        <Composition key={id} id={`${id}-Vertical`} component={component} durationInFrames={duration} fps={FPS} {...PORTRAIT} />
      ))}
    </Folder>
  </>
);
