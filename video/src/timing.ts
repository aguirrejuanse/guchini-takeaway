/**
 * All timing lives here. Values are frames at 30fps (s(2) = 2 seconds).
 * Scene cues are relative to the start of their own scene, so changing a
 * scene's length never shifts the beats inside the others.
 */
export const FPS = 30;
export const s = (seconds: number) => Math.round(seconds * FPS);

/** Crossfade between scenes. Overlaps both scenes, so it shortens the total. */
export const TRANSITION = s(0.5);

export const SCENES = {
  hook: s(8.5),
  cliente: s(22.5),
  momento: s(15.5),
  diferencial: s(15.5),
  admin: s(10.5),
  cierre: s(5.5),
} as const;

export const TOTAL =
  Object.values(SCENES).reduce((a, b) => a + b, 0) -
  TRANSITION * (Object.keys(SCENES).length - 1);

export const CUES = {
  hook: {
    logo: s(0.2),
    online: s(0.9),
    headline: s(1.7),
    features: s(3.3),
    featureStep: s(0.3),
    script: s(5.5),
    mascot: s(5.8),
  },
  cliente: {
    home: 0,
    tapProduct: s(4),
    sheet: s(4.6),
    tapBranch: s(7),
    added: s(7.5),
    tapCart: s(9),
    checkout: s(9.5),
    typeName: s(10.3),
    typePhone: s(11.6),
    pickEta: s(13.4),
    tapPay: s(15.4),
    paying: s(16),
    approved: s(18),
  },
  momento: {
    phoneIn: 0,
    orderIn: s(1.4),
    confirmed: s(4.2),
    preparing: s(6.6),
    ready: s(9),
    waButton: s(9.5),
    tapWa: s(10.6),
    waBubble: s(11.1),
  },
  diferencial: {
    panelIn: 0,
    scheduledIn: s(1.2),
    clockStart: s(3),
    clockEnd: s(9),
    promote: s(9.4),
    copy2: s(10.6),
  },
  admin: {
    promoIn: s(0.3),
    stockIn: s(2.8),
    stockDrain: s(3.5),
    soldOut: s(5.4),
    funnelIn: s(6.8),
  },
  cierre: {
    logo: s(0.1),
    tagline: s(1),
    pricing: s(2),
  },
} as const;

/** Optional soundtrack: drop a file in public/ and set its name here (e.g. "music.mp3"). */
export const MUSIC: string | null = null;
