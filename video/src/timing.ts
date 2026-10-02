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
    pedir: 0,
    tapBranch: s(3),
    menu: s(3.3),
    scrollStart: s(3.9),
    scrollEnd: s(6),
    tapAdd: s(6.4),
    added: s(6.5),
    tapCart: s(8.4),
    carrito: s(8.7),
    tapContinue: s(10.2),
    checkout: s(10.5),
    typeName: s(11),
    typePhone: s(12.2),
    pickEta: s(13.8),
    scrollPay: s(14.2),
    tapPay: s(16),
    pago: s(16.3),
    tapApprove: s(17.5),
    processing: s(17.6),
    confirmed: s(19),
  },
  momento: {
    phoneIn: 0,
    orderIn: s(1.4),
    tapTrack: s(2.4),
    tracking: s(2.7),
    tapConfirm: s(3.9),
    confirmed: s(4.2),
    tapPrepare: s(6.3),
    preparing: s(6.6),
    tapReady: s(8.7),
    ready: s(9),
    tapWa: s(11),
    waBubble: s(11.3),
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
