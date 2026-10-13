import { Howl, Howler } from "howler";

let beat: Howl | null = null;
let impact: Howl | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;
let muted = false;
const activeImpacts = new Set<number>();
const MAX_SIMULTANEOUS_IMPACTS = 6;

/** À appeler dans un clic utilisateur (déblocage audio du navigateur). */
export function initAudio() {
  if (!beat) {
    beat = new Howl({ src: ["/sounds/heartbeat.wav"], preload: true });
    impact = new Howl({ src: ["/sounds/impact.wav"], preload: true });
  }
  Howler.mute(muted);
}

/** Battement qui accélère et gagne en volume jusqu'à zéro. */
export function startHeartbeat(getRemainingMs: () => number) {
  stopHeartbeat();
  const tick = () => {
    const remaining = getRemainingMs();
    if (remaining <= 0 || !beat) return;
    const p = 1 - Math.min(remaining, 10_000) / 10_000; // 0 -> 1
    const id = beat.play();
    beat.volume(0.35 + 0.65 * p, id);
    beat.rate(1 + 0.25 * p, id);
    timer = setTimeout(tick, 1000 - 550 * p);
  };
  tick();
}

export function stopHeartbeat() {
  if (timer) clearTimeout(timer);
  timer = null;
  beat?.stop();
}

export function playImpact() {
  playImpactWithSettings(1, 1);
}

/** Petites explosions secondaires, limitées pour ne pas saturer le mixage. */
export function playBurst(intensity: number) {
  const safeIntensity = Math.max(0, Math.min(1, intensity));
  playImpactWithSettings(
    1.6 + Math.random() * 0.8,
    0.06 + safeIntensity * 0.12
  );
}

function playImpactWithSettings(rate: number, volume: number) {
  if (!impact || activeImpacts.size >= MAX_SIMULTANEOUS_IMPACTS) return;

  const id = impact.play();
  activeImpacts.add(id);
  impact.rate(rate, id);
  impact.volume(volume, id);

  let released = false;
  const release = () => {
    if (released) return;
    released = true;
    activeImpacts.delete(id);
    impact?.off("end", release, id);
    impact?.off("stop", release, id);
  };
  impact.once("end", release, id);
  impact.once("stop", release, id);
}

export function setMuted(value: boolean) {
  muted = value;
  Howler.mute(value);
}

export function disposeAudio() {
  stopHeartbeat();
  beat?.unload();
  impact?.unload();
  activeImpacts.clear();
  beat = null;
  impact = null;
}
