// audio.js — tiny synthesized sound effects, no audio files, WebAudio only.
let ctx = null;
let enabled = true;

export function setSoundEnabled(on) {
  enabled = on;
}

export function isSoundEnabled() {
  return enabled;
}

function audioCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(freq, startAt, dur, type, vol) {
  if (!enabled) return;
  const ac = audioCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime + startAt);
  gain.gain.setValueAtTime(0.0001, ac.currentTime + startAt);
  gain.gain.exponentialRampToValueAtTime(vol, ac.currentTime + startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + startAt + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(ac.currentTime + startAt);
  osc.stop(ac.currentTime + startAt + dur + 0.05);
}

// A bright two-note chime when a difference is found.
export function playFound() {
  tone(880, 0, 0.18, 'sine', 0.22);
  tone(1318.5, 0.09, 0.28, 'sine', 0.2);
}

// A dull low thud for a wrong click.
export function playMiss() {
  tone(140, 0, 0.22, 'triangle', 0.25);
  tone(98, 0.05, 0.2, 'triangle', 0.18);
}

// A soft rising arpeggio when a level is cleared.
export function playLevelClear() {
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.11, 0.3, 'sine', 0.2));
}

// A gentle hint shimmer.
export function playHint() {
  tone(1567.98, 0, 0.15, 'sine', 0.12);
  tone(2093, 0.08, 0.22, 'sine', 0.1);
}

// A short tick when the timer drops under ten seconds.
export function playTick() {
  tone(1200, 0, 0.06, 'square', 0.06);
}
