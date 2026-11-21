// ui.js — HUD text, found-difference markers, and the overlay card.
const $ = (id) => document.getElementById(id);

export function setSceneName(name) {
  $('scene-name').textContent = name;
}

export function setFound(found, total) {
  $('found-count').textContent = `${found} / ${total}`;
}

export function setScore(score) {
  $('score').textContent = String(score);
}

export function setCombo(combo) {
  $('combo').textContent = `×${combo}`;
}

export function setTimer(seconds) {
  const el = $('timer');
  el.textContent = String(Math.max(0, Math.ceil(seconds)));
  el.classList.toggle('low', seconds <= 10 && seconds > 0);
}

export function setHearts(hearts) {
  $('hearts').textContent = '♥'.repeat(Math.max(0, hearts)) + '♡'.repeat(Math.max(0, 3 - hearts));
}

export function setHintsLeft(n) {
  const btn = $('hint-btn');
  btn.textContent = `Hint (H) · ${n} left`;
  btn.disabled = n <= 0;
}

export function setMessage(text) {
  $('message').textContent = text;
}

// Draw a golden ring marker on a canvas at a difference spot.
export function drawMarker(ctx, x, y, r) {
  ctx.save();
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 4;
  ctx.shadowColor = '#ff8c42';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y, r - 4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

// Draw a pulsing hint ring that fades out.
export function drawHintRing(ctx, x, y, r, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#7be495';
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.arc(x, y, r + 6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

export function shakePanels() {
  for (const id of ['panel-left', 'panel-right']) {
    const el = $(id);
    el.classList.remove('shake');
    void el.offsetWidth;
    el.classList.add('shake');
  }
}

export function showOverlay(title, text, statsHtml, buttonLabel) {
  $('overlay-title').textContent = title;
  $('overlay-text').textContent = text;
  $('overlay-stats').innerHTML = statsHtml;
  const btn = $('overlay-btn');
  btn.textContent = buttonLabel;
  $('overlay').classList.remove('hidden');
}

export function hideOverlay() {
  $('overlay').classList.add('hidden');
}

export function onOverlayButton(fn) {
  $('overlay-btn').addEventListener('click', fn);
}

export function onHintButton(fn) {
  $('hint-btn').addEventListener('click', fn);
}

export function onSoundButton(fn) {
  $('sound-btn').addEventListener('click', fn);
}

export function setSoundLabel(on) {
  $('sound-btn').textContent = on ? '♪' : '♪̶';
}
