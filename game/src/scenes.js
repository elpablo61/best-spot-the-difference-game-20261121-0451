// scenes.js — five original hand-drawn scenes. Each scene draws itself on a
// 560x420 canvas. `applied` is a Set of difference ids that are switched on
// for the right-hand panel; the left panel always draws the original.
// Every difference has a hit circle {x, y, r} shared by both panels.
import { circle, ellipse, rect, poly, star, lantern, cloud, pine, cat, bird } from './draw.js';

const W = 560;
const H = 420;

function nightSky(ctx, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

function ground(ctx, y, fill) {
  rect(ctx, 0, y, W, H - y, fill);
}

function stars(ctx, list) {
  for (const [x, y, r] of list) star(ctx, x, y, r, '#fff8d6');
}

// ---------------------------------------------------------------- scene 1
function drawMarket(ctx, applied) {
  nightSky(ctx, '#1b1440', '#4a2a6b');
  stars(ctx, [[40, 40, 4], [120, 26, 3], [200, 52, 4], [300, 30, 3], [380, 44, 4], [470, 28, 3], [520, 60, 4], [80, 84, 3]]);
  if (!applied.has('m-star')) star(ctx, 250, 84, 4, '#fff8d6');
  // moon: full in the original, a crescent when changed
  if (applied.has('m-moon')) {
    circle(ctx, 500, 66, 26, '#ffe9a8');
    circle(ctx, 512, 60, 22, '#4a2a6b');
  } else {
    circle(ctx, 500, 66, 26, '#ffe9a8');
    circle(ctx, 492, 60, 5, '#fff3c4');
    circle(ctx, 508, 74, 4, '#f7dc8f');
  }
  // string lights across the top
  ctx.strokeStyle = '#2c1e4d';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 108);
  ctx.quadraticCurveTo(280, 150, 560, 108);
  ctx.stroke();
  for (let i = 0; i < 9; i++) {
    const x = 30 + i * 62;
    const y = 108 + Math.sin((i / 8) * Math.PI) * 26;
    if (applied.has('m-bulb') && i === 4) continue; // one bulb dark/missing
    circle(ctx, x, y + 8, 6, ['#ff5d5d', '#ffd166', '#7be495'][i % 3]);
  }
  // market stalls
  rect(ctx, 40, 250, 200, 110, '#7a4a2b');
  rect(ctx, 320, 250, 200, 110, '#5d3a6e');
  // awnings: 5 stripes originally, 4 when changed
  const stripes = applied.has('m-awning') ? 4 : 5;
  for (let i = 0; i < stripes; i++) {
    rect(ctx, 32 + i * (216 / stripes), 228, 216 / stripes, 24, i % 2 ? '#f5eeda' : '#e4572e');
    rect(ctx, 312 + i * (216 / stripes), 228, 216 / stripes, 24, i % 2 ? '#f5eeda' : '#2e86ab');
  }
  // goods on the stalls
  circle(ctx, 90, 290, 14, '#ff8c42');
  circle(ctx, 130, 290, 14, '#ff8c42');
  circle(ctx, 170, 290, 14, '#ffd166');
  circle(ctx, 380, 290, 12, '#7be495');
  circle(ctx, 420, 290, 12, '#7be495');
  circle(ctx, 460, 290, 12, '#ff5d5d');
  // lanterns hanging between stalls
  lantern(ctx, 268, 200, 22, '#e4572e', true);
  lantern(ctx, 292, 216, 16, applied.has('m-lantern') ? '#2fa866' : '#e4572e', true);
  lantern(ctx, 120, 180, 18, '#ffd166', true);
  lantern(ctx, 450, 180, 18, '#ffd166', true);
  // balloons
  const balloons = [[520, 150, '#ff5d5d'], [538, 190, '#7be495'], [500, 210, '#2e86ab']];
  if (applied.has('m-balloon')) balloons.push([472, 168, '#ffd166']);
  for (const [x, y, c] of balloons) {
    ellipse(ctx, x, y, 12, 16, c);
    ctx.strokeStyle = '#d8cbb0';
    ctx.beginPath();
    ctx.moveTo(x, y + 16);
    ctx.lineTo(x - 6, y + 44);
    ctx.stroke();
  }
  // cat on the left stall roof
  if (!applied.has('m-cat')) cat(ctx, 130, 226, 20, '#2b2338');
  ground(ctx, 360, '#241a33');
  // cobblestones
  ctx.fillStyle = '#3a2c52';
  for (let i = 0; i < 8; i++) ellipse(ctx, 40 + i * 70, 392, 26, 8, '#3a2c52');
}

// ---------------------------------------------------------------- scene 2
function drawHarbour(ctx, applied) {
  nightSky(ctx, '#2b3a67', '#e8836b');
  // setting sun: smaller when changed
  const sunR = applied.has('h-moon') ? 22 : 34;
  circle(ctx, 470, 120, sunR, '#ffb347');
  circle(ctx, 470, 120, sunR * 0.65, '#ffd166');
  cloud(ctx, 120, 70, 26, 'rgba(245, 238, 218, 0.85)');
  cloud(ctx, 300, 46, 20, 'rgba(245, 238, 218, 0.7)');
  // gulls: 3 originally, 2 when changed
  bird(ctx, 150, 100, 12, '#2b2338');
  bird(ctx, 210, 76, 10, '#2b2338');
  if (!applied.has('h-gull')) bird(ctx, 260, 108, 11, '#2b2338');
  // sea
  rect(ctx, 0, 220, W, 200, '#274b63');
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(20 + i * 30, 250 + i * 26);
    ctx.quadraticCurveTo(120 + i * 60, 244 + i * 26, 260 + i * 50, 250 + i * 26);
    ctx.stroke();
  }
  // lighthouse on the left rocks
  poly(ctx, [[30, 220], [90, 220], [82, 300], [38, 300]], '#8a8f98');
  rect(ctx, 42, 200, 36, 22, '#3a3f4a');
  circle(ctx, 60, 211, 8, applied.has('h-light') ? '#3a3f4a' : '#ffe066');
  if (!applied.has('h-light')) {
    const g = ctx.createRadialGradient(60, 211, 4, 60, 211, 90);
    g.addColorStop(0, 'rgba(255, 224, 102, 0.8)');
    g.addColorStop(1, 'rgba(255, 224, 102, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(-30, 120, 200, 180);
  }
  // boats
  // boat 1: red sail originally, blue when changed
  poly(ctx, [[180, 260], [180, 190], [235, 260]], applied.has('h-sail') ? '#2e86ab' : '#e4572e');
  rect(ctx, 160, 260, 110, 16, '#6b4423');
  rect(ctx, 178, 176, 4, 86, '#4a3220');
  // boat 2
  poly(ctx, [[360, 280], [360, 220], [405, 280]], '#7be495');
  rect(ctx, 340, 280, 90, 14, '#6b4423');
  // flag on boat 2: points right originally, left when changed
  if (applied.has('h-flag')) poly(ctx, [[360, 220], [336, 226], [360, 232]], '#ff5d5d');
  else poly(ctx, [[360, 220], [384, 226], [360, 232]], '#ff5d5d');
  // crates on the dock
  rect(ctx, 430, 300, 34, 34, '#a9803e');
  rect(ctx, 468, 300, 34, 34, '#a9803e');
  if (!applied.has('h-crate')) rect(ctx, 449, 266, 34, 34, '#c49a52');
  // buoy: orange originally, yellow when changed
  circle(ctx, 300, 330, 12, applied.has('h-buoy') ? '#ffd166' : '#ff7b2e');
  rect(ctx, 296, 312, 8, 8, '#2b2338');
  // dock
  rect(ctx, 400, 334, 160, 86, '#5d4632');
  rect(ctx, 400, 334, 160, 8, '#7a5c40');
}

export const SCENES = [
  {
    id: 'market',
    name: 'Lantern Night Market',
    time: 90,
    draw: drawMarket,
    diffs: [
      { id: 'm-moon', x: 500, y: 66, r: 30, label: 'The moon turned into a crescent' },
      { id: 'm-cat', x: 130, y: 214, r: 28, label: 'The cat slipped off the roof' },
      { id: 'm-lantern', x: 292, y: 216, r: 22, label: 'A lantern changed colour' },
      { id: 'm-balloon', x: 472, y: 168, r: 24, label: 'A fourth balloon appeared' },
      { id: 'm-awning', x: 420, y: 240, r: 26, label: 'The awning lost a stripe' },
      { id: 'm-star', x: 250, y: 84, r: 12, label: 'A star went out' },
      { id: 'm-bulb', x: 278, y: 142, r: 14, label: 'A string-light bulb went dark' },
    ],
  },
  {
    id: 'harbour',
    name: 'Harbour at Dusk',
    time: 90,
    draw: drawHarbour,
    diffs: [
      { id: 'h-light', x: 60, y: 211, r: 16, label: 'The lighthouse lamp went dark' },
      { id: 'h-sail', x: 205, y: 225, r: 30, label: 'A sail changed colour' },
      { id: 'h-gull', x: 260, y: 108, r: 16, label: 'A gull flew away' },
      { id: 'h-flag', x: 366, y: 226, r: 16, label: 'The flag flipped direction' },
      { id: 'h-crate', x: 466, y: 283, r: 26, label: 'A crate went missing' },
      { id: 'h-buoy', x: 300, y: 330, r: 18, label: 'The buoy changed colour' },
      { id: 'h-moon', x: 470, y: 120, r: 34, label: 'The sun shrank' },
    ],
  },
];

// ---------------------------------------------------------------- scene 3
function drawGarden(ctx, applied) {
  nightSky(ctx, '#bfe8d4', '#7ec8a9');
  // sun + clouds
  circle(ctx, 90, 70, 30, '#ffd166');
  cloud(ctx, 300, 60, 22, 'rgba(255,255,255,0.9)');
  cloud(ctx, 470, 90, 18, 'rgba(255,255,255,0.8)');
  // tea house
  rect(ctx, 60, 180, 180, 110, '#8a5a3b');
  poly(ctx, [[40, 180], [150, 120], [260, 180]], '#b03a2e');
  rect(ctx, 130, 230, 40, 60, '#3a2a18');
  // window: lit warm originally, dark when changed
  rect(ctx, 82, 210, 34, 30, applied.has('g-window') ? '#3a2a18' : '#ffe9a8');
  rect(ctx, 184, 210, 34, 30, '#ffe9a8');
  // bonsai
  rect(ctx, 300, 250, 10, 40, '#6b4423');
  circle(ctx, 305, 228, 26, '#2f7d4f');
  circle(ctx, 285, 244, 18, '#37925c');
  if (!applied.has('g-bonsai')) circle(ctx, 328, 240, 16, '#37925c');
  // stone lantern: lit originally, unlit when changed
  rect(ctx, 420, 240, 16, 50, '#8d8d8d');
  rect(ctx, 410, 226, 36, 14, '#6e6e6e');
  poly(ctx, [[406, 226], [428, 206], [450, 226]], '#6e6e6e');
  if (!applied.has('g-stone')) circle(ctx, 428, 233, 6, '#ffd166');
  // pond
  ellipse(ctx, 280, 350, 260, 52, '#3d8fae');
  ellipse(ctx, 280, 350, 240, 42, '#4aa8c4');
  // koi: 3 originally, 2 when changed
  ellipse(ctx, 180, 345, 22, 9, '#ff8c42');
  ellipse(ctx, 330, 360, 22, 9, '#ffffff');
  if (!applied.has('g-koi')) ellipse(ctx, 430, 340, 22, 9, '#ff5d5d');
  // bridge over the pond
  ctx.strokeStyle = '#7a4a2b';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(210, 396);
  ctx.quadraticCurveTo(280, 330, 350, 396);
  ctx.stroke();
  // teapot on a mat, steam when original
  ellipse(ctx, 480, 300, 26, 10, '#e4572e');
  circle(ctx, 480, 282, 14, '#e4572e');
  if (!applied.has('g-steam')) {
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(480, 266);
    ctx.quadraticCurveTo(472, 250, 480, 238);
    ctx.stroke();
  }
  // butterflies: pink originally, blue when changed
  const bf = applied.has('g-butterfly') ? '#2e86ab' : '#ff7eb9';
  ellipse(ctx, 350, 130, 10, 7, bf);
  ellipse(ctx, 366, 130, 10, 7, bf);
  ellipse(ctx, 380, 150, 8, 6, '#ffd166');
  ellipse(ctx, 392, 150, 8, 6, '#ffd166');
  // flowers along the bottom
  for (let i = 0; i < 6; i++) {
    const fx = 30 + i * 24;
    circle(ctx, fx, 404, 5, i === 2 && applied.has('g-flower') ? '#7be495' : '#ff5d7a');
  }
}

// ---------------------------------------------------------------- scene 4
function drawCabin(ctx, applied) {
  nightSky(ctx, '#dfeef7', '#a9c8de');
  // snowy hills
  ellipse(ctx, 120, 430, 260, 90, '#f4f8fb');
  ellipse(ctx, 460, 440, 280, 100, '#e8f1f8');
  // pines: 3 originally, 2 when changed
  pine(ctx, 60, 330, 90, '#2f6b4f');
  pine(ctx, 500, 320, 100, '#2f6b4f');
  if (!applied.has('c-pine')) pine(ctx, 420, 350, 70, '#2f6b4f');
  // cabin
  rect(ctx, 190, 220, 180, 110, '#7a4a2b');
  poly(ctx, [[170, 220], [280, 150], [390, 220]], '#f4f8fb');
  rect(ctx, 262, 260, 36, 70, '#4a3220');
  // window: warm light originally, dark when changed
  rect(ctx, 210, 250, 36, 30, applied.has('c-window') ? '#4a3220' : '#ffd166');
  rect(ctx, 314, 250, 36, 30, '#ffd166');
  // chimney + smoke (smoke missing when changed)
  rect(ctx, 330, 160, 22, 60, '#8d8d8d');
  if (!applied.has('c-smoke')) {
    circle(ctx, 345, 140, 12, 'rgba(255,255,255,0.85)');
    circle(ctx, 358, 118, 16, 'rgba(255,255,255,0.7)');
    circle(ctx, 374, 94, 20, 'rgba(255,255,255,0.55)');
  }
  // snowman
  circle(ctx, 120, 360, 26, '#ffffff');
  circle(ctx, 120, 318, 20, '#ffffff');
  circle(ctx, 120, 286, 15, '#ffffff');
  // hat: black originally, red when changed
  rect(ctx, 106, 266, 28, 8, applied.has('c-hat') ? '#e4572e' : '#2b2338');
  rect(ctx, 112, 248, 16, 18, applied.has('c-hat') ? '#e4572e' : '#2b2338');
  // carrot nose
  poly(ctx, [[134, 286], [152, 290], [134, 294]], '#ff8c42');
  circle(ctx, 114, 282, 2, '#2b2338');
  circle(ctx, 126, 282, 2, '#2b2338');
  // scarf: red originally, green when changed
  rect(ctx, 100, 300, 40, 8, applied.has('c-scarf') ? '#2f7d4f' : '#e4572e');
  // skis leaning on the cabin
  if (!applied.has('c-skis')) {
    ctx.strokeStyle = '#e4572e';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(392, 330);
    ctx.lineTo(420, 250);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(400, 330);
    ctx.lineTo(428, 250);
    ctx.stroke();
  }
  // birds: 2 originally, 1 when changed
  bird(ctx, 90, 80, 12, '#2b2338');
  if (!applied.has('c-bird')) bird(ctx, 170, 60, 10, '#2b2338');
  // icicles under the roof: 3 originally, 2 when changed
  poly(ctx, [[220, 220], [226, 220], [223, 240]], '#bfe3f2');
  poly(ctx, [[280, 220], [286, 220], [283, 246]], '#bfe3f2');
  if (!applied.has('c-icicle')) poly(ctx, [[340, 220], [346, 220], [343, 236]], '#bfe3f2');
}

// ---------------------------------------------------------------- scene 5
function drawSpace(ctx, applied) {
  nightSky(ctx, '#0b0620', '#2a1a5e');
  // stars
  stars(ctx, [[40, 40, 3], [120, 90, 4], [200, 40, 3], [300, 70, 4], [380, 30, 3], [470, 80, 4], [520, 40, 3], [90, 150, 3], [250, 120, 3]]);
  if (!applied.has('s-star')) star(ctx, 500, 160, 4, '#fff8d6');
  // big ringed planet: the ring is there originally, gone when changed
  circle(ctx, 430, 110, 42, '#c96f4a');
  if (!applied.has('s-ring')) {
    ctx.strokeStyle = '#e8c07a';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(430, 110, 66, 16, -0.35, 0, Math.PI * 2);
    ctx.stroke();
  }
  // moon with craters
  circle(ctx, 110, 100, 30, '#d8d8d8');
  circle(ctx, 100, 92, 6, '#b0b0b0');
  circle(ctx, 122, 108, 5, '#b0b0b0');
  if (!applied.has('s-crater')) circle(ctx, 112, 112, 4, '#b0b0b0');
  // observatory dome
  ellipse(ctx, 280, 330, 120, 70, '#8d8d8d');
  rect(ctx, 160, 330, 240, 60, '#6e6e6e');
  // telescope: silver originally, gold when changed
  ctx.strokeStyle = applied.has('s-scope') ? '#ffd166' : '#cfd8dc';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(280, 280);
  ctx.lineTo(330, 220);
  ctx.stroke();
  circle(ctx, 280, 286, 12, '#4a4a4a');
  // rocket on the pad
  poly(ctx, [[90, 300], [110, 240], [130, 300]], '#f5f5f5');
  circle(ctx, 110, 282, 7, '#2e86ab');
  poly(ctx, [[90, 300], [74, 322], [92, 312]], '#e4572e');
  poly(ctx, [[130, 300], [146, 322], [128, 312]], '#e4572e');
  // flame: orange originally, blue when changed
  poly(ctx, [[100, 322], [110, 360], [120, 322]], applied.has('s-flame') ? '#4aa8ff' : '#ff8c42');
  // astronaut floating: higher originally, lower when changed
  const ay = applied.has('s-astro') ? 210 : 170;
  circle(ctx, 470, ay, 14, '#ffffff');
  ellipse(ctx, 470, ay + 26, 16, 20, '#ffffff');
  rect(ctx, 462, ay - 4, 16, 8, '#2e86ab');
  // satellite
  rect(ctx, 200, 130, 34, 16, '#b0bec5');
  rect(ctx, 176, 134, 20, 8, '#2e86ab');
  rect(ctx, 238, 134, 20, 8, '#2e86ab');
  // dish: up originally, down when changed
  ctx.strokeStyle = '#eceff1';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(217, 130);
  if (applied.has('s-dish')) ctx.lineTo(206, 146);
  else ctx.lineTo(228, 112);
  ctx.stroke();
  // ground
  ground(ctx, 390, '#3a2a5e');
}

SCENES.push(
  {
    id: 'garden',
    name: 'Garden Tea House',
    time: 90,
    draw: drawGarden,
    diffs: [
      { id: 'g-koi', x: 430, y: 340, r: 26, label: 'A koi swam away' },
      { id: 'g-window', x: 99, y: 225, r: 22, label: 'A tea-house window went dark' },
      { id: 'g-bonsai', x: 328, y: 240, r: 20, label: 'The bonsai lost a branch' },
      { id: 'g-stone', x: 428, y: 233, r: 14, label: 'The stone lantern went out' },
      { id: 'g-steam', x: 480, y: 252, r: 16, label: 'The teapot stopped steaming' },
      { id: 'g-butterfly', x: 358, y: 130, r: 18, label: 'A butterfly changed colour' },
      { id: 'g-flower', x: 78, y: 404, r: 12, label: 'A flower changed colour' },
    ],
  },
  {
    id: 'cabin',
    name: 'Mountain Cabin Winter',
    time: 90,
    draw: drawCabin,
    diffs: [
      { id: 'c-smoke', x: 360, y: 120, r: 26, label: 'The chimney smoke vanished' },
      { id: 'c-hat', x: 120, y: 258, r: 20, label: 'The snowman changed hats' },
      { id: 'c-window', x: 228, y: 265, r: 22, label: 'A cabin window went dark' },
      { id: 'c-skis', x: 408, y: 292, r: 18, label: 'The skis disappeared' },
      { id: 'c-pine', x: 420, y: 338, r: 20, label: 'A pine tree vanished' },
      { id: 'c-bird', x: 170, y: 60, r: 14, label: 'A bird flew away' },
      { id: 'c-icicle', x: 343, y: 228, r: 12, label: 'An icicle melted' },
    ],
  },
  {
    id: 'space',
    name: 'Space Observatory',
    time: 90,
    draw: drawSpace,
    diffs: [
      { id: 's-ring', x: 430, y: 110, r: 46, label: "The planet lost its ring" },
      { id: 's-crater', x: 112, y: 112, r: 10, label: 'A moon crater vanished' },
      { id: 's-scope', x: 305, y: 250, r: 24, label: 'The telescope changed colour' },
      { id: 's-flame', x: 110, y: 340, r: 20, label: 'The rocket flame turned blue' },
      { id: 's-astro', x: 470, y: 190, r: 26, label: 'The astronaut drifted down' },
      { id: 's-dish', x: 216, y: 128, r: 16, label: 'The satellite dish tilted down' },
      { id: 's-star', x: 500, y: 160, r: 12, label: 'A star went out' },
    ],
  },
);
