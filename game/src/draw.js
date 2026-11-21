// draw.js — small canvas shape helpers shared by every scene.
export function circle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

export function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

export function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

export function poly(ctx, points, fill) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

export function star(ctx, x, y, r, fill, points = 5) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = (i * Math.PI) / points - Math.PI / 2;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

// A paper lantern: glowing body, top and bottom caps, hanging string.
export function lantern(ctx, x, y, r, body, glow) {
  ctx.strokeStyle = '#3a2a18';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - r - 26);
  ctx.lineTo(x, y - r);
  ctx.stroke();
  if (glow) {
    const g = ctx.createRadialGradient(x, y, r * 0.2, x, y, r * 1.6);
    g.addColorStop(0, 'rgba(255, 190, 80, 0.55)');
    g.addColorStop(1, 'rgba(255, 190, 80, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - r * 1.7, y - r * 1.7, r * 3.4, r * 3.4);
  }
  ellipse(ctx, x, y, r * 0.78, r, body);
  ctx.strokeStyle = 'rgba(120, 30, 30, 0.7)';
  ctx.lineWidth = 1.5;
  for (const dy of [-r * 0.55, 0, r * 0.55]) {
    ctx.beginPath();
    ctx.ellipse(x, y + dy, r * 0.72, r * 0.16, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  rect(ctx, x - r * 0.3, y - r - 4, r * 0.6, 6, '#8a6d3b');
  rect(ctx, x - r * 0.22, y + r - 2, r * 0.44, 8, '#8a6d3b');
}

// A fluffy cloud made of three circles.
export function cloud(ctx, x, y, s, fill) {
  circle(ctx, x, y, s * 0.55, fill);
  circle(ctx, x - s * 0.55, y + s * 0.12, s * 0.42, fill);
  circle(ctx, x + s * 0.55, y + s * 0.12, s * 0.42, fill);
  rect(ctx, x - s * 0.95, y, s * 1.9, s * 0.5, fill);
}

// A simple pine tree.
export function pine(ctx, x, y, h, green) {
  rect(ctx, x - 4, y, 8, 14, '#6b4423');
  poly(ctx, [[x, y - h], [x - h * 0.42, y - h * 0.25], [x + h * 0.42, y - h * 0.25]], green);
  poly(ctx, [[x, y - h * 0.72], [x - h * 0.34, y - h * 0.08], [x + h * 0.34, y - h * 0.08]], green);
}

// A sitting cat silhouette.
export function cat(ctx, x, y, s, fill) {
  ellipse(ctx, x, y, s * 0.62, s * 0.5, fill); // body
  circle(ctx, x + s * 0.28, y - s * 0.52, s * 0.34, fill); // head
  poly(ctx, [[x + s * 0.05, y - s * 0.72], [x + s * 0.12, y - s * 1.05], [x + s * 0.32, y - s * 0.78]], fill);
  poly(ctx, [[x + s * 0.4, y - s * 0.8], [x + s * 0.52, y - s * 1.06], [x + s * 0.6, y - s * 0.74]], fill);
  // tail curling up
  ctx.strokeStyle = fill;
  ctx.lineWidth = s * 0.14;
  ctx.beginPath();
  ctx.arc(x - s * 0.55, y - s * 0.28, s * 0.3, Math.PI * 0.4, Math.PI * 1.6);
  ctx.stroke();
  // eye
  circle(ctx, x + s * 0.38, y - s * 0.55, s * 0.05, '#ffd166');
}

// A small bird in flight (two curved wings).
export function bird(ctx, x, y, s, stroke) {
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x - s * 0.5, y, s * 0.5, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + s * 0.5, y, s * 0.5, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
}
