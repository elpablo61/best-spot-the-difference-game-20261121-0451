// main.js — Twin Lanterns game controller: state, input, timer, scoring.
// Two side-by-side canvases show the same scene; the right one has the
// differences switched on. Click a difference on either panel to mark it.
import { SCENES } from './scenes.js';
import * as audio from './audio.js';
import * as ui from './ui.js';

const W = 560;
const H = 420;
const DIFFS_PER_LEVEL = 7;

const leftCanvas = document.getElementById('canvas-left');
const rightCanvas = document.getElementById('canvas-right');
const leftCtx = leftCanvas.getContext('2d');
const rightCtx = rightCanvas.getContext('2d');

// Demo mode for screenshots: ?demo=<level 1-5> starts that level with some
// differences already found, the timer frozen, so the frame shows markers,
// unfound differences and the counter — exactly what a player sees mid-game.
const params = new URLSearchParams(window.location.search);
const demoRaw = parseInt(params.get('demo') || '0', 10) || 0;
const demoLevel = demoRaw === 0 ? 0 : Math.min(SCENES.length, Math.max(1, demoRaw));
const DEMO_FOUND = [0, 3, 2, 4, 3, 5][demoLevel] || 0;

const state = {
  screen: 'title', // title | playing | levelClear | gameOver | complete
  level: 0,
  found: new Set(),
  score: 0,
  combo: 1,
  bestCombo: 1,
  hearts: 3,
  hintsLeft: 3,
  timeLeft: 90,
  lastTick: 0,
  hint: null, // {diff, until}
  demo: demoLevel > 0,
  totalFound: 0,
};

function currentScene() {
  return SCENES[state.level];
}

function allDiffIds() {
  return new Set(currentScene().diffs.map((d) => d.id));
}

function startLevel(index) {
  state.level = index;
  state.found = new Set();
  state.combo = 1;
  state.hearts = 3;
  state.hintsLeft = 3;
  state.timeLeft = currentScene().time;
  state.hint = null;
  state.screen = 'playing';
  state.lastTick = performance.now();
  ui.hideOverlay();
  ui.setSceneName(currentScene().name);
  ui.setFound(0, DIFFS_PER_LEVEL);
  ui.setCombo(1);
  ui.setHearts(3);
  ui.setHintsLeft(3);
  ui.setTimer(state.timeLeft);
  ui.setMessage(`Scene ${index + 1} of ${SCENES.length} — find ${DIFFS_PER_LEVEL} differences!`);
  if (state.demo) {
    // Pre-mark a few differences so the frame reads as a game in progress.
    const ids = currentScene().diffs.slice(0, DEMO_FOUND).map((d) => d.id);
    state.found = new Set(ids);
    state.score += ids.length * 100;
    state.totalFound += ids.length;
    ui.setFound(state.found.size, DIFFS_PER_LEVEL);
    ui.setScore(state.score);
    ui.setMessage(`${state.found.size} found, ${DIFFS_PER_LEVEL - state.found.size} still hidden — click a difference!`);
  }
}

function render() {
  const scene = currentScene();
  scene.draw(leftCtx, new Set());
  scene.draw(rightCtx, allDiffIds());
  for (const diff of scene.diffs) {
    if (state.found.has(diff.id)) {
      ui.drawMarker(leftCtx, diff.x, diff.y, diff.r);
      ui.drawMarker(rightCtx, diff.x, diff.y, diff.r);
    }
  }
  if (state.hint && performance.now() < state.hint.until) {
    const pulse = 0.45 + 0.4 * Math.sin(performance.now() / 150);
    ui.drawHintRing(leftCtx, state.hint.diff.x, state.hint.diff.y, state.hint.diff.r, pulse);
    ui.drawHintRing(rightCtx, state.hint.diff.x, state.hint.diff.y, state.hint.diff.r, pulse);
  }
}

function loop(now) {
  if (state.screen === 'playing' && !state.demo) {
    const dt = (now - state.lastTick) / 1000;
    state.lastTick = now;
    state.timeLeft -= dt;
    if (state.timeLeft <= 10.5 && state.timeLeft > 0 && Math.ceil(state.timeLeft) !== Math.ceil(state.timeLeft + dt)) {
      audio.playTick();
    }
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      ui.setTimer(0);
      return gameOver('Time ran out!');
    }
    ui.setTimer(state.timeLeft);
  }
  render();
  requestAnimationFrame(loop);
}

function canvasPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * W,
    y: ((event.clientY - rect.top) / rect.height) * H,
  };
}

function onPick(event) {
  if (state.screen !== 'playing') return;
  const point = canvasPoint(event.currentTarget, event);
  const scene = currentScene();
  for (const diff of scene.diffs) {
    if (state.found.has(diff.id)) continue;
    const dx = point.x - diff.x;
    const dy = point.y - diff.y;
    if (dx * dx + dy * dy <= (diff.r + 8) * (diff.r + 8)) {
      state.found.add(diff.id);
      state.totalFound += 1;
      const gained = 100 * state.combo;
      state.score += gained;
      state.bestCombo = Math.max(state.bestCombo, state.combo);
      state.combo = Math.min(5, state.combo + 1);
      audio.playFound();
      ui.setScore(state.score);
      ui.setCombo(state.combo);
      ui.setFound(state.found.size, DIFFS_PER_LEVEL);
      ui.setMessage(`Found it — ${diff.label}! +${gained} points.`);
      if (state.found.size === DIFFS_PER_LEVEL) levelClear();
      return;
    }
  }
  // Wrong spot: lose a heart, break the combo, small point penalty.
  state.hearts -= 1;
  state.combo = 1;
  state.score = Math.max(0, state.score - 25);
  audio.playMiss();
  ui.setHearts(state.hearts);
  ui.setCombo(1);
  ui.setScore(state.score);
  ui.setMessage('Not a difference — a heart lost. Look closer!');
  ui.shakePanels();
  if (state.hearts <= 0) gameOver('Out of hearts!');
}

function levelClear() {
  const bonus = Math.ceil(state.timeLeft) * 10;
  state.score += bonus;
  ui.setScore(state.score);
  audio.playLevelClear();
  state.screen = 'levelClear';
  const last = state.level === SCENES.length - 1;
  if (last) {
    state.screen = 'complete';
    ui.showOverlay(
      'You found them all!',
      'Every difference across all five scenes — the lanterns shine for you.',
      `Final score: <b>${state.score}</b><br>Differences found: <b>${state.totalFound}</b> · Best combo: <b>×${state.bestCombo}</b>`,
      'Play again',
    );
  } else {
    ui.showOverlay(
      `Scene ${state.level + 1} complete!`,
      `${currentScene().name} — all ${DIFFS_PER_LEVEL} differences found.`,
      `Time bonus: <b>+${bonus}</b><br>Score: <b>${state.score}</b>`,
      'Next scene (N)',
    );
  }
}

function gameOver(reason) {
  state.screen = 'gameOver';
  ui.showOverlay(
    'Game over',
    `${reason} ${currentScene().name} still hides ${DIFFS_PER_LEVEL - state.found.size} difference${DIFFS_PER_LEVEL - state.found.size === 1 ? '' : 's'}.`,
    `Score: <b>${state.score}</b> · Scene ${state.level + 1} of ${SCENES.length}`,
    'Retry scene (R)',
  );
}

function useHint() {
  if (state.screen !== 'playing' || state.hintsLeft <= 0) return;
  const remaining = currentScene().diffs.filter((d) => !state.found.has(d.id));
  if (!remaining.length) return;
  const diff = remaining[Math.floor(Math.random() * remaining.length)];
  state.hintsLeft -= 1;
  state.score = Math.max(0, state.score - 50);
  state.hint = { diff, until: performance.now() + 2500 };
  audio.playHint();
  ui.setHintsLeft(state.hintsLeft);
  ui.setScore(state.score);
  ui.setMessage('Hint: look inside the green dashed ring… (−50 points)');
}

function nextStep() {
  if (state.screen === 'levelClear') startLevel(state.level + 1);
  else if (state.screen === 'gameOver') startLevel(state.level);
  else if (state.screen === 'complete' || state.screen === 'title') {
    state.score = 0;
    state.totalFound = 0;
    state.bestCombo = 1;
    ui.setScore(0);
    startLevel(0);
  }
}

leftCanvas.addEventListener('click', onPick);
rightCanvas.addEventListener('click', onPick);
ui.onHintButton(useHint);
ui.onSoundButton(() => {
  audio.setSoundEnabled(!audio.isSoundEnabled());
  ui.setSoundLabel(audio.isSoundEnabled());
});
ui.onOverlayButton(nextStep);

document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (key === 'h') useHint();
  else if (key === 'n' && (state.screen === 'levelClear')) nextStep();
  else if (key === 'r' && (state.screen === 'gameOver' || state.screen === 'playing')) startLevel(state.level);
  else if (key === 'm') {
    audio.setSoundEnabled(!audio.isSoundEnabled());
    ui.setSoundLabel(audio.isSoundEnabled());
  } else if (key === 'enter' && state.screen !== 'playing') nextStep();
});

// Boot: title overlay first; demo mode jumps straight into a mid-game frame.
ui.setScore(0);
ui.setSoundLabel(true);
if (state.demo) {
  startLevel(demoLevel - 1);
} else {
  ui.showOverlay(
    'Twin Lanterns',
    'Two pictures hang side by side — but the right one hides 7 differences. ' +
      'Click every difference before the lanterns burn down. Five scenes, ' +
      '35 differences, hints if you get stuck. Wrong clicks cost hearts!',
    `Scenes: <b>${SCENES.length}</b> · Differences per scene: <b>${DIFFS_PER_LEVEL}</b> · Time per scene: <b>90s</b>`,
    'Start playing',
  );
  state.level = 0;
  ui.setSceneName(SCENES[0].name);
  ui.setTimer(SCENES[0].time);
}
requestAnimationFrame(loop);
