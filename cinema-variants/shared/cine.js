/* Shared scroll-film engine for the cinema films.
   boot(config):
     forms:    eight formation names, last one 'logo' (alias 'word')
     palettes: [[r,g,b] x8]
     light:    false            light mode (normal blending, dark dots)
     count:    {desktop,mobile} particle counts
     size:     base point size
     spin:     idle spin speed

   Formations morph continuously against overall scroll progress, so the
   choreography is always in motion. Formations can be parametric point
   clouds (LIB) or recognizable silhouettes sampled from 2D canvas
   drawings (SHAPES). The film ends in three phases: particles gather
   into the Ikigai Engine lockup, sharpen (noise dies, points shrink),
   then fade out entirely while the clean brush-drawn logo resolves,
   full screen, at the very end.                                        */

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* brand */
const BRAND = { cream: '#F2EFE9', gold: '#C9A23F', ink: '#1B1915' };

/* seeded rng so the brush enso renders identically every load */
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/* ---------- parametric formation library ---------- */
const R = () => Math.random() * 2 - 1;

const LIB = {
  chaos(N, m) {
    const a = new Float32Array(N * 3), cs = [];
    for (let c = 0; c < 7; c++) cs.push([R() * (m ? 3.4 : 6.5), R() * 3.6, R() * 4]);
    for (let i = 0; i < N; i++) {
      const c = cs[i % 7], r = Math.pow(Math.random(), .5) * 2.6;
      const th = Math.random() * Math.PI * 2, ph = Math.acos(R());
      a[i*3] = c[0] + r * Math.sin(ph) * Math.cos(th);
      a[i*3+1] = c[1] + r * Math.sin(ph) * Math.sin(th) * .75;
      a[i*3+2] = c[2] + r * Math.cos(ph);
    }
    return a;
  },
  starfield(N, m) {
    const a = new Float32Array(N * 3), w = m ? 4 : 9;
    for (let i = 0; i < N; i++) { a[i*3] = R() * w; a[i*3+1] = R() * 6; a[i*3+2] = R() * 5; }
    return a;
  },
  swirl(N, m) {
    const a = new Float32Array(N * 3), s = m ? .62 : 1;
    for (let i = 0; i < N; i++) {
      const arm = i % 3, t = Math.random();
      const r = Math.pow(t, .7) * 5.2 * s + .15;
      const th = arm * (Math.PI * 2 / 3) + r * 1.05 + (Math.random() - .5) * .35;
      a[i*3] = Math.cos(th) * r; a[i*3+1] = Math.sin(th) * r * .72; a[i*3+2] = R() * (0.9 - r * .1);
    }
    return a;
  },
  orbits(N, m) {
    const a = new Float32Array(N * 3), s = m ? .62 : 1;
    const rings = [[2.2, .0, .0], [3.4, .5, .3], [4.6, -.4, .6], [5.6, .25, -.5]];
    for (let i = 0; i < N; i++) {
      const [r, tx, tz] = rings[i % rings.length];
      const th = Math.random() * Math.PI * 2;
      let x = Math.cos(th) * r * s, y = Math.sin(th) * r * .96 * s, z = R() * .05;
      let y1 = y * Math.cos(tx) - z * Math.sin(tx), z1 = y * Math.sin(tx) + z * Math.cos(tx);
      a[i*3] = x * Math.cos(tz) - y1 * Math.sin(tz);
      a[i*3+1] = x * Math.sin(tz) + y1 * Math.cos(tz);
      a[i*3+2] = z1;
    }
    return a;
  },
  streams(N, m) {
    const a = new Float32Array(N * 3), lanes = 5, w = m ? 9 : 16;
    for (let i = 0; i < N; i++) {
      const lane = i % lanes, t = Math.random() * Math.PI * 4;
      a[i*3] = (t / (Math.PI * 4)) * w - w / 2 + R() * .08;
      a[i*3+1] = Math.sin(t + lane * 1.3) * 1.7 + (lane - 2) * .85 + R() * .08;
      a[i*3+2] = Math.cos(t * .7 + lane) * 1.2 + R() * .08;
    }
    return a;
  },
  vortex(N, m) {
    const a = new Float32Array(N * 3), s = m ? .68 : 1;
    for (let i = 0; i < N; i++) {
      const t = Math.random();
      const r = (.35 + (1 - t) * 3.6) * s, th = t * 22 + Math.random() * .6;
      a[i*3] = Math.cos(th) * r + R() * .1;
      a[i*3+1] = 4.4 - t * 8.2;
      a[i*3+2] = Math.sin(th) * r + R() * .1;
    }
    return a;
  },
  gear(N, m) {
    const a = new Float32Array(N * 3), s = m ? .68 : 1;
    for (let i = 0; i < N; i++) {
      const t = Math.random(); let r, th = Math.random() * Math.PI * 2;
      if (t < .45) r = 3.4;
      else if (t < .7) {
        const k = Math.floor(th / (Math.PI * 2) * 14);
        th = (k + .5) / 14 * Math.PI * 2 + (Math.random() - .5) * .18;
        r = 3.4 + Math.random() * .8;
      }
      else if (t < .85) r = 1.1 + Math.random() * .15;
      else {
        th = Math.floor(Math.random() * 5) / 5 * Math.PI * 2 + (Math.random() - .5) * .05;
        r = 1.2 + Math.random() * 2.1;
      }
      a[i*3] = Math.cos(th) * r * s; a[i*3+1] = Math.sin(th) * r * s; a[i*3+2] = R() * .3;
    }
    return a;
  },
  waves(N, m) {
    const a = new Float32Array(N * 3), w = m ? 8 : 15;
    const cols = Math.ceil(Math.sqrt(N * (m ? 1.4 : 2.4))), rows = Math.ceil(N / cols);
    for (let i = 0; i < N; i++) {
      const x = ((i % cols) / (cols - 1) - .5) * w;
      const z = ((((i / cols) | 0)) / (rows - 1) - .5) * 7;
      a[i*3] = x;
      a[i*3+1] = Math.sin(x * .9 + z * .7) * 1.15 + Math.sin(z * 1.6) * .5;
      a[i*3+2] = z;
    }
    return a;
  },
  whirlpool(N, m) {
    const a = new Float32Array(N * 3), s = m ? .66 : 1;
    for (let i = 0; i < N; i++) {
      const t = Math.random();
      const r = (Math.pow(t, .65) * 5 + .15) * s;
      const th = t * 15 + (i % 3) * (Math.PI * 2 / 3) + Math.random() * .25;
      a[i*3] = Math.cos(th) * r; a[i*3+1] = Math.sin(th) * r * .9; a[i*3+2] = (1 - t) * -1.6 + R() * .15;
    }
    return a;
  },
  laminar(N, m) {
    const a = new Float32Array(N * 3), w = m ? 9 : 16, lanes = 9;
    for (let i = 0; i < N; i++) {
      a[i*3] = R() * w / 2;
      a[i*3+1] = ((i % lanes) - (lanes - 1) / 2) * .95 + R() * .06;
      a[i*3+2] = R() * .8;
    }
    return a;
  },
  curtains(N, m) {
    const a = new Float32Array(N * 3), w = m ? 7.4 : 13;
    for (let i = 0; i < N; i++) {
      const x = R() * w / 2, t = Math.random();
      a[i*3] = x + Math.sin(t * 6 + x) * .3;
      a[i*3+1] = 4.4 - t * 8.4 + Math.sin(x * 1.4) * .5;
      a[i*3+2] = Math.sin(x * .8 + t * 3) * 1.4;
    }
    return a;
  },
  ribbon(N, m) {
    const a = new Float32Array(N * 3), w = m ? 8.5 : 15;
    for (let i = 0; i < N; i++) {
      const t = Math.random(), band = Math.random();
      a[i*3] = (t - .5) * w;
      a[i*3+1] = Math.sin(t * Math.PI * 2.2) * 2.1 + (band - .5) * 1.5;
      a[i*3+2] = Math.cos(t * Math.PI * 1.6) * 1.1 + (band - .5) * .4;
    }
    return a;
  },
  helix(N, m) {
    const a = new Float32Array(N * 3), s = m ? .7 : 1;
    for (let i = 0; i < N; i++) {
      const strand = i % 2, t = Math.random();
      const y = (t - .5) * 8.6, th = t * Math.PI * 5 + strand * Math.PI;
      if (Math.random() < .12) {
        const k = Math.random();
        a[i*3] = Math.cos(th) * 2.1 * s * (1 - k) + Math.cos(th + Math.PI) * 2.1 * s * k;
        a[i*3+1] = y;
        a[i*3+2] = Math.sin(th) * 2.1 * s * (1 - k) + Math.sin(th + Math.PI) * 2.1 * s * k;
      } else {
        a[i*3] = Math.cos(th) * 2.1 * s + R() * .07;
        a[i*3+1] = y;
        a[i*3+2] = Math.sin(th) * 2.1 * s + R() * .07;
      }
    }
    return a;
  },
  torus(N, m) {
    const a = new Float32Array(N * 3), s = m ? .62 : 1, Rr = 3.4 * s, rr = 1.15 * s;
    for (let i = 0; i < N; i++) {
      const u = Math.random() * Math.PI * 2, v = Math.random() * Math.PI * 2;
      a[i*3] = (Rr + rr * Math.cos(v)) * Math.cos(u);
      a[i*3+1] = (Rr + rr * Math.cos(v)) * Math.sin(u) * .85;
      a[i*3+2] = rr * Math.sin(v);
    }
    return a;
  },
  statics(N, m) {
    const a = new Float32Array(N * 3), w = m ? 6.6 : 14;
    for (let i = 0; i < N; i++) { a[i*3] = R() * w / 2; a[i*3+1] = R() * 5.4; a[i*3+2] = R() * .6; }
    return a;
  },
  conveyor(N, m) {
    const a = new Float32Array(N * 3), w = m ? 8.5 : 16, lanes = 7;
    for (let i = 0; i < N; i++) {
      const t = Math.random(), x = (t - .5) * w;
      a[i*3] = x;
      a[i*3+1] = x * .28 + ((i % lanes) - 3) * 1.35 + R() * .05;
      a[i*3+2] = R() * .5;
    }
    return a;
  },
  target(N, m) {
    const a = new Float32Array(N * 3), s = m ? .66 : 1;
    for (let i = 0; i < N; i++) {
      const t = Math.random();
      const r = t < .1 ? Math.sqrt(Math.random()) * .35 : (1 + Math.floor(Math.random() * 5)) * .95 + (Math.random() - .5) * .07;
      const th = Math.random() * Math.PI * 2;
      a[i*3] = Math.cos(th) * r * s; a[i*3+1] = Math.sin(th) * r * s; a[i*3+2] = R() * .2;
    }
    return a;
  },
  lattice(N, m) {
    const a = new Float32Array(N * 3);
    const w = m ? 7.4 : 13, h = m ? 9.5 : 6.4;
    const cols = Math.ceil(Math.sqrt(N / 3) * 1.6), rows = Math.ceil(N / 3 / cols);
    for (let i = 0; i < N; i++) {
      const layer = i % 3, idx = (i / 3) | 0;
      a[i*3] = ((idx % cols) / (cols - 1) - .5) * w;
      a[i*3+1] = (((idx / cols) | 0) / (rows - 1) - .5) * h;
      a[i*3+2] = (layer - 1) * 1.15;
    }
    return a;
  },
};

/* ---------- recognizable silhouettes, drawn on canvas & sampled ---------- */
const SHAPES = {
  clock(x) {
    x.lineWidth = 16;
    x.beginPath(); x.arc(200, 200, 150, 0, Math.PI * 2); x.stroke();
    x.lineWidth = 7;
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * Math.PI * 2;
      x.beginPath();
      x.moveTo(200 + Math.cos(a) * 128, 200 + Math.sin(a) * 128);
      x.lineTo(200 + Math.cos(a) * 146, 200 + Math.sin(a) * 146);
      x.stroke();
    }
    x.lineWidth = 15; x.lineCap = 'round';
    x.beginPath(); x.moveTo(200, 200); x.lineTo(200, 105); x.stroke();
    x.beginPath(); x.moveTo(200, 200); x.lineTo(268, 236); x.stroke();
    x.beginPath(); x.arc(200, 200, 12, 0, Math.PI * 2); x.fill();
  },
  eye(x) {
    x.lineWidth = 14; x.lineCap = 'round';
    x.beginPath(); x.moveTo(30, 200); x.quadraticCurveTo(200, 40, 370, 200); x.stroke();
    x.beginPath(); x.moveTo(30, 200); x.quadraticCurveTo(200, 360, 370, 200); x.stroke();
    x.lineWidth = 12;
    x.beginPath(); x.arc(200, 200, 72, 0, Math.PI * 2); x.stroke();
    x.beginPath(); x.arc(200, 200, 32, 0, Math.PI * 2); x.fill();
  },
  chart(x) {
    x.lineWidth = 12; x.lineCap = 'round';
    x.beginPath(); x.moveTo(70, 46); x.lineTo(70, 344); x.lineTo(374, 344); x.stroke();
    x.fillRect(104, 252, 52, 82);
    x.fillRect(184, 194, 52, 140);
    x.fillRect(264, 130, 52, 204);
    x.lineWidth = 11;
    x.beginPath(); x.moveTo(96, 226); x.lineTo(176, 158); x.lineTo(244, 186); x.lineTo(348, 74); x.stroke();
    x.beginPath(); x.moveTo(300, 74); x.lineTo(350, 72); x.lineTo(338, 120); x.stroke();
  },
  lightbulb(x) {
    x.lineWidth = 14; x.lineCap = 'round';
    x.beginPath(); x.arc(200, 160, 96, 0, Math.PI * 2); x.stroke();
    x.lineWidth = 10;
    x.beginPath(); x.moveTo(162, 268); x.lineTo(238, 268); x.stroke();
    x.beginPath(); x.moveTo(168, 294); x.lineTo(232, 294); x.stroke();
    x.beginPath(); x.moveTo(180, 320); x.lineTo(220, 320); x.stroke();
    x.lineWidth = 8;
    x.beginPath(); x.moveTo(168, 160); x.quadraticCurveTo(184, 190, 200, 160); x.quadraticCurveTo(216, 130, 232, 160); x.stroke();
    for (const [a1, a2] of [[-.5, -.5], [-1.05, -1.05], [-1.6, -1.6], [-2.15, -2.15], [-2.65, -2.65]]) {
      x.beginPath();
      x.moveTo(200 + Math.cos(a1) * 118, 160 + Math.sin(a1) * 118);
      x.lineTo(200 + Math.cos(a2) * 152, 160 + Math.sin(a2) * 152);
      x.stroke();
    }
  },
  doc(x) {
    x.lineWidth = 12; x.lineJoin = 'round';
    x.beginPath();
    x.moveTo(110, 48); x.lineTo(242, 48); x.lineTo(292, 98); x.lineTo(292, 352); x.lineTo(110, 352);
    x.closePath(); x.stroke();
    x.lineWidth = 9;
    x.beginPath(); x.moveTo(242, 48); x.lineTo(242, 98); x.lineTo(292, 98); x.stroke();
    x.beginPath(); x.moveTo(142, 160); x.lineTo(260, 160); x.stroke();
    x.beginPath(); x.moveTo(142, 205); x.lineTo(260, 205); x.stroke();
    x.beginPath(); x.moveTo(142, 250); x.lineTo(260, 250); x.stroke();
    x.beginPath(); x.moveTo(142, 295); x.lineTo(216, 295); x.stroke();
  },
  check(x) {
    x.lineWidth = 36; x.lineCap = 'round'; x.lineJoin = 'round';
    x.beginPath(); x.moveTo(84, 214); x.lineTo(170, 300); x.lineTo(322, 104); x.stroke();
  },
  star(x) {
    x.lineWidth = 15; x.lineJoin = 'round';
    x.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5;
      const r = i % 2 ? 62 : 152;
      const px = 200 + Math.cos(a) * r, py = 205 + Math.sin(a) * r;
      i ? x.lineTo(px, py) : x.moveTo(px, py);
    }
    x.closePath(); x.stroke();
  },
  anvil(x) {
    x.beginPath();
    x.moveTo(64, 128); x.lineTo(336, 128); x.lineTo(336, 172);
    x.quadraticCurveTo(268, 172, 252, 208); x.lineTo(252, 236) ; x.lineTo(148, 236);
    x.lineTo(148, 196); x.quadraticCurveTo(120, 176, 64, 172);
    x.closePath(); x.fill();
    x.fillRect(132, 248, 136, 30);
    x.fillRect(100, 290, 200, 30);
  },
  fish(x) {
    x.lineWidth = 13; x.lineJoin = 'round';
    x.beginPath();
    x.moveTo(56, 200);
    x.quadraticCurveTo(150, 92, 268, 152);
    x.quadraticCurveTo(316, 178, 330, 200);
    x.quadraticCurveTo(316, 222, 268, 248);
    x.quadraticCurveTo(150, 308, 56, 200);
    x.closePath(); x.stroke();
    x.beginPath(); x.moveTo(330, 200); x.lineTo(384, 150); x.lineTo(384, 250); x.closePath(); x.stroke();
    x.beginPath(); x.arc(120, 186, 11, 0, Math.PI * 2); x.fill();
  },
  mountain(x) {
    x.lineWidth = 15; x.lineJoin = 'round';
    x.beginPath();
    x.moveTo(24, 330); x.lineTo(148, 116); x.lineTo(208, 216); x.lineTo(278, 88); x.lineTo(382, 330);
    x.closePath(); x.stroke();
    x.lineWidth = 9;
    x.beginPath(); x.moveTo(129, 148); x.lineTo(148, 168); x.lineTo(168, 150); x.stroke();
    x.beginPath(); x.moveTo(259, 122); x.lineTo(278, 142); x.lineTo(298, 124); x.stroke();
  },
  envelope(x) {
    x.lineWidth = 13; x.lineJoin = 'round';
    x.strokeRect(56, 108, 288, 188);
    x.beginPath(); x.moveTo(60, 112); x.lineTo(200, 232); x.lineTo(340, 112); x.stroke();
  },
};

/* brush-stroke enso, shared by the mark formation and the logo lockup */
function drawEnso(x, cx, cy, r, scale) {
  const rng = mulberry32(7);
  const start = -Math.PI * 1.22;             // begin upper-left
  const sweep = Math.PI * 1.86;              // opening at the lower-right
  const steps = 64;
  x.lineCap = 'round';
  let px, py;
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const a = start + sweep * t;
    const taper = Math.sin(Math.min(1, t * 1.25) * Math.PI);   // thick middle, tapered ends
    const w = (r * .16) * (0.35 + 0.75 * taper) * scale;
    const rr = r + (rng() - .5) * r * .015;
    const nx = cx + Math.cos(a) * rr, ny = cy + Math.sin(a) * rr;
    if (i) {
      x.lineWidth = Math.max(1.5, w);
      x.beginPath(); x.moveTo(px, py); x.lineTo(nx, ny); x.stroke();
    }
    px = nx; py = ny;
  }
  // dry-brush streaks near the tail
  for (let k = 0; k < 5; k++) {
    const off = (rng() - .5) * r * .22;
    const a0 = start + sweep * (.55 + rng() * .3);
    const a1 = a0 + (.25 + rng() * .3);
    x.lineWidth = 2 + rng() * 3;
    x.beginPath(); x.arc(cx, cy, r + off, a0, Math.min(a1, start + sweep + .08)); x.stroke();
  }
}

/* the full lockup: enso + gold dot + IkigAi + — engine — */
const LOCK_W = 560, LOCK_H = 720;
function drawLockup(x, colors) {
  const { stroke, gold } = colors;
  // enso
  x.strokeStyle = stroke; x.fillStyle = stroke;
  drawEnso(x, 280, 240, 168, 1);
  // gold dot, low-center inside the circle
  x.fillStyle = gold;
  x.beginPath(); x.arc(298, 338, 52, 0, Math.PI * 2); x.fill();
  // wordmark: Ikig (cream) + Ai (gold)
  const fam = "'Fraunces', Georgia, serif";
  x.font = `600 104px ${fam}`;
  x.textBaseline = 'alphabetic';
  const w1 = x.measureText('Ikig').width, w2 = x.measureText('Ai').width;
  const tx = 280 - (w1 + w2) / 2, ty = 566;
  x.fillStyle = stroke; x.fillText('Ikig', tx, ty);
  x.fillStyle = gold; x.fillText('Ai', tx + w1, ty);
  // — engine —
  x.font = `500 44px ${fam}`;
  const word = 'engine', ls = 14;
  let ew = 0;
  for (const ch of word) ew += x.measureText(ch).width + ls;
  ew -= ls;
  const ey = 652;
  let exx = 280 - ew / 2;
  x.fillStyle = gold;
  for (const ch of word) { x.fillText(ch, exx, ey); exx += x.measureText(ch).width + ls; }
  x.lineWidth = 4; x.strokeStyle = gold; x.lineCap = 'round';
  x.beginPath(); x.moveTo(280 - ew / 2 - 96, ey - 14); x.lineTo(280 - ew / 2 - 30, ey - 14); x.stroke();
  x.beginPath(); x.moveTo(280 + ew / 2 + 30, ey - 14); x.lineTo(280 + ew / 2 + 96, ey - 14); x.stroke();
}

function samplePts(canvas, step) {
  const w = canvas.width, h = canvas.height;
  const d = canvas.getContext('2d').getImageData(0, 0, w, h).data;
  const pts = [];
  for (let y = 0; y < h; y += step) for (let xx = 0; xx < w; xx += step)
    if (d[(y * w + xx) * 4] > 110) pts.push([xx, y]);
  return pts;
}

function buildLockup(light) {
  // particle sampling target (white on black)
  const sc = document.createElement('canvas'); sc.width = LOCK_W; sc.height = LOCK_H;
  const sx = sc.getContext('2d');
  sx.fillStyle = '#000'; sx.fillRect(0, 0, LOCK_W, LOCK_H);
  drawLockup(sx, { stroke: '#fff', gold: '#fff' });
  const pts = samplePts(sc, 2);

  // crisp overlay in brand colors (2x for retina)
  const S = 2;
  const oc = document.createElement('canvas'); oc.width = LOCK_W * S; oc.height = LOCK_H * S;
  const ox = oc.getContext('2d'); ox.scale(S, S);
  drawLockup(ox, { stroke: light ? BRAND.ink : BRAND.cream, gold: BRAND.gold });

  return { pts, W: LOCK_W, H: LOCK_H, dataURL: oc.toDataURL('image/png') };
}

function shapeForm(name, N, m) {
  const S = 400;
  const c = document.createElement('canvas'); c.width = S; c.height = S;
  const x = c.getContext('2d');
  x.fillStyle = '#000'; x.fillRect(0, 0, S, S);
  x.strokeStyle = '#fff'; x.fillStyle = '#fff';
  if (name === 'enso') {
    x.strokeStyle = '#fff'; x.fillStyle = '#fff';
    drawEnso(x, 200, 196, 138, .9);
    x.beginPath(); x.arc(214, 276, 42, 0, Math.PI * 2); x.fill();
  } else {
    SHAPES[name](x);
  }
  const pts = samplePts(c, 2);
  const size = m ? 5.6 : 7.4;                    // world height/width of the shape
  const a = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const p = pts[(Math.random() * pts.length) | 0] || [S / 2, S / 2];
    a[i*3] = (p[0] / S - .5) * size;
    a[i*3+1] = (.5 - p[1] / S) * size;
    a[i*3+2] = R() * .3;
  }
  return a;
}

function lockForm(N, m, lock) {
  // fills the final empty viewport ("logo stage"), centered
  const wh = m ? 7.2 : 6.8;
  const ww = wh * (lock.W / lock.H);
  const a = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const p = lock.pts[(Math.random() * lock.pts.length) | 0] || [lock.W / 2, lock.H / 2];
    a[i*3] = (p[0] / lock.W - .5) * ww;
    a[i*3+1] = (.5 - p[1] / lock.H) * wh + .2;
    a[i*3+2] = R() * .2;
  }
  return { a, ww, wh, wy: .2 };
}

/* ---------- UI wiring shared by all films ---------- */
function wireUI() {
  const yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));
  if (reduce) document.querySelectorAll('.rv').forEach(el => el.classList.add('in'));

  requestAnimationFrame(() => setTimeout(() => document.body.classList.add('lit'), 150));

  const hdr = document.querySelector('header');
  addEventListener('scroll', () => hdr.classList.toggle('scrolled', scrollY > 40), { passive: true });

  const railLinks = [...document.querySelectorAll('.rail a')];
  const actEls = ['section.hero', '#act1', '#act2', '#act3', '#act4', '#finale'].map(s => document.querySelector(s));
  const rio = new IntersectionObserver(es => {
    es.forEach(e => {
      if (e.isIntersecting) {
        const idx = actEls.indexOf(e.target);
        if (idx >= 0) railLinks.forEach((a, i) => a.classList.toggle('on', i === idx));
      }
    });
  }, { threshold: .4 });
  actEls.forEach(el => el && rio.observe(el));
}

/* ---------- engine ---------- */
export async function boot(cfg) {
  wireUI();

  // make sure Fraunces is actually loaded before the lockup is measured/drawn
  try {
    await Promise.race([
      Promise.all([
        document.fonts.load("600 104px Fraunces"),
        document.fonts.load("500 44px Fraunces"),
      ]),
      new Promise(r => setTimeout(r, 1800)),
    ]);
  } catch (e) {}

  const light = !!cfg.light;
  const lock = buildLockup(light);

  const canvas = document.getElementById('stage');
  let gl = null;
  try { gl = canvas.getContext('webgl2') || canvas.getContext('webgl'); } catch (e) {}
  if (!gl || reduce) {
    canvas.remove();
    const stage = document.querySelector('.logo-stage') || document.querySelector('#finale .inner');
    if (stage) {
      const img = new Image();
      img.src = lock.dataURL; img.alt = 'Ikigai Engine';
      img.style.cssText = 'display:block;margin:6vh auto;width:min(340px,72%);height:auto';
      stage.appendChild(img);
    }
    return;
  }

  const THREE = await import('../../cinema/vendor/three.module.min.js');
  const isMobile = matchMedia('(max-width:760px)').matches;
  const N = isMobile ? (cfg.count?.mobile ?? 7000) : (cfg.count?.desktop ?? 15000);
  const F = cfg.forms.length;
  const LAST = F - 1;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, isMobile ? 2 : 1.5));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, .1, 100);

  const lockData = lockForm(N, isMobile, lock);
  const forms = cfg.forms.map(name => {
    if (name === 'logo' || name === 'word') return lockData.a;
    if (LIB[name]) return LIB[name](N, isMobile);
    return shapeForm(name, N, isMobile);
  });

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(forms[0].slice(), 3));
  forms.forEach((f, i) => geo.setAttribute('aP' + i, new THREE.BufferAttribute(f, 3)));
  const seeds = new Float32Array(N);
  for (let i = 0; i < N; i++) seeds[i] = Math.random();
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

  const pal = cfg.palettes.map(c => new THREE.Vector3(...c));
  while (pal.length < F) pal.push(pal[pal.length - 1]);

  const uniforms = {
    uSeg: { value: 0 }, uTime: { value: 0 }, uDim: { value: 1 },
    uNoise: { value: 1 }, uShrink: { value: 1 },
    uSize: { value: (cfg.size ?? (isMobile ? 2.1 : 2.5)) * renderer.getPixelRatio() },
    uAlpha: { value: light ? .82 : .75 },
  };
  for (let i = 0; i < F; i++) uniforms['uC' + i] = { value: pal[i] };

  const attrDecl = forms.map((_, i) => `attribute vec3 aP${i};`).join('\n');
  const colDecl = forms.map((_, i) => `uniform vec3 uC${i};`).join('\n');
  const pickBody = forms.map((_, i) => i < LAST ? `if(s<${i}.5) return aP${i};` : `return aP${i};`).join(' ');
  const colBody = forms.map((_, i) => i < LAST ? `if(s<${i}.5) return uC${i};` : `return uC${i};`).join(' ');

  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    blending: light ? THREE.NormalBlending : THREE.AdditiveBlending,
    uniforms,
    vertexShader: `
      ${attrDecl}
      attribute float aSeed;
      uniform float uSeg,uTime,uSize,uNoise,uShrink;
      ${colDecl}
      varying vec3 vColor;
      varying float vFade;
      vec3 pick(float s){ ${pickBody} }
      vec3 col(float s){ ${colBody} }
      void main(){
        float f = floor(uSeg), t = fract(uSeg);
        float tt = clamp(t*1.35 - aSeed*.35, 0., 1.);
        tt = tt*tt*(3.-2.*tt);
        vec3 p = mix(pick(f), pick(min(f+1., ${LAST}.0)), tt);
        float n = aSeed*6.2831;
        p += vec3(sin(uTime*.5+n)*.06, cos(uTime*.4+n*1.7)*.06, sin(uTime*.3+n*2.3)*.06) * uNoise;
        vColor = mix(col(f), col(min(f+1., ${LAST}.0)), tt);
        vec4 mv = modelViewMatrix * vec4(p,1.);
        gl_Position = projectionMatrix * mv;
        float ps = uSize * (1. + aSeed*.9) * (10. / -mv.z) * uShrink;
        gl_PointSize = clamp(ps, 1., 9.);
        vFade = smoothstep(-24., -6., mv.z);
      }`,
    fragmentShader: `
      precision mediump float;
      uniform float uAlpha,uDim;
      varying vec3 vColor;
      varying float vFade;
      void main(){
        vec2 uv = gl_PointCoord - .5;
        float a = smoothstep(.5,.08,length(uv));
        gl_FragColor = vec4(vColor, a*uAlpha*vFade*uDim);
      }`
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  /* crisp logo overlay */
  const lockEl = document.createElement('img');
  lockEl.src = lock.dataURL; lockEl.alt = ''; lockEl.setAttribute('aria-hidden', 'true');
  lockEl.style.cssText = 'position:fixed;left:0;top:0;z-index:3;pointer-events:none;opacity:0;will-change:opacity,transform';
  document.body.appendChild(lockEl);
  const wordVec = new THREE.Vector3();

  function segTarget() {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    return p * LAST;
  }

  let cur = 0, mx = 0, my = 0, tmx = 0, tmy = 0;
  addEventListener('mousemove', e => { tmx = e.clientX / innerWidth - .5; tmy = e.clientY / innerHeight - .5; }, { passive: true });

  const camZ = () => (isMobile ? 16.5 : 13);
  function resize() {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  }
  resize(); addEventListener('resize', resize);

  let running = true;
  document.addEventListener('visibilitychange', () => { running = !document.hidden; if (running) tick(); });

  const spin = cfg.spin ?? .05;
  const smooth = (v) => v * v * (3 - 2 * v);
  const t0 = performance.now();
  function tick() {
    if (!running) return;
    requestAnimationFrame(tick);
    const t = (performance.now() - t0) / 1000;
    cur += (segTarget() - cur) * .11;
    mx += (tmx - mx) * .04; my += (tmy - my) * .04;

    /* ---- the gradual ending, spread over the whole final segment ----
       lockT 0→1 while the particles travel from the enso mark to the
       full lockup on the empty logo stage:
         0→.55  gather (normal morph, noise easing off)
         .55→.9 sharpen (points shrink, rotation flattens)
         .7→1   resolve (solid logo in, particles out — to zero)      */
    const lockT = Math.min(1, Math.max(0, cur - (LAST - 1)));
    const noiseK = 1 - smooth(Math.min(1, lockT / .7));
    const solid = smooth(Math.min(1, Math.max(0, (lockT - .7) / .3)));
    uniforms.uNoise.value = noiseK;
    uniforms.uShrink.value = 1 - smooth(Math.min(1, Math.max(0, (lockT - .5) / .5))) * .4;
    uniforms.uDim.value = 1 - solid;
    uniforms.uSeg.value = cur;
    uniforms.uTime.value = t;

    const p = LAST > 0 ? cur / LAST : 0;
    // legibility: rotation is gentle everywhere shapes need to read,
    // and flattens completely across the finale
    const flat = 1 - smooth(Math.min(1, lockT / .6));
    points.rotation.y = (Math.sin(t * spin) * .1 + mx * .2 + Math.sin(p * Math.PI * 2) * .18) * flat;
    points.rotation.x = (my * .12 + Math.sin(p * Math.PI * 1.5) * .07) * flat;
    camera.position.z = camZ() - p * 1.4;
    renderer.render(scene, camera);

    if (lockT > .55) {
      wordVec.set(0, lockData.wy, 0).project(camera);
      const sx = (wordVec.x * .5 + .5) * innerWidth;
      const sy = (-wordVec.y * .5 + .5) * innerHeight;
      const edge = new THREE.Vector3(lockData.ww / 2, lockData.wy, 0).project(camera);
      const wpx = Math.abs(((edge.x * .5 + .5) * innerWidth) - sx) * 2;
      lockEl.style.width = wpx + 'px';
      lockEl.style.transform = `translate(${sx - wpx / 2}px, ${sy - (wpx * lock.H / lock.W) / 2}px) scale(${.975 + solid * .025})`;
      lockEl.style.opacity = solid;
    } else if (lockEl.style.opacity !== '0') {
      lockEl.style.opacity = 0;
    }
  }
  tick();
}
