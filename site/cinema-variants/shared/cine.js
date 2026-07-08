/* Shared scroll-film engine for the cinema films.
   Each page calls boot(config) with:
     forms:    eight formation names, last one 'word'
     palettes: [[r,g,b] x8]  0..1 floats per formation
     word:     'IKIGAI ENGINE'      finale lockup text
     lockFont: { family:'Outfit, sans-serif', weight:'700' }
     lockColors: { mark:'#E8B34B', text:'#EDF1F7' }   solid finale logo
     light:    false               light mode (normal blending, dark dots)
     count:    {desktop, mobile}   particle counts
     size:     base point size
     spin:     idle spin speed

   Formations are morphed continuously against overall scroll progress,
   so something is always in motion while the page scrolls; the film ends
   by condensing the particles into the logo lockup and crossfading to a
   crisp solid version of it.                                            */

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- formation library ---------- */
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
      a[i*3] = Math.cos(th) * r;
      a[i*3+1] = Math.sin(th) * r * .72;
      a[i*3+2] = R() * (0.9 - r * .1);
    }
    return a;
  },
  shell(N, m) {
    const a = new Float32Array(N * 3), r0 = m ? 3 : 4.2;
    for (let i = 0; i < N; i++) {
      const th = Math.random() * Math.PI * 2, ph = Math.acos(R());
      const r = r0 + R() * .12;
      a[i*3] = r * Math.sin(ph) * Math.cos(th);
      a[i*3+1] = r * Math.cos(ph);
      a[i*3+2] = r * Math.sin(ph) * Math.sin(th);
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
      let x2 = x * Math.cos(tz) - y1 * Math.sin(tz), y2 = x * Math.sin(tz) + y1 * Math.cos(tz);
      a[i*3] = x2; a[i*3+1] = y2; a[i*3+2] = z1;
    }
    return a;
  },
  iris(N, m) {
    const a = new Float32Array(N * 3), s = m ? .7 : 1;
    for (let i = 0; i < N; i++) {
      const t = Math.random(); let r, th = Math.random() * Math.PI * 2;
      if (t < .62) { r = (1 + Math.floor(Math.random() * 4)) * 1.05 + (Math.random() - .5) * .1; }
      else if (t < .82) { r = Math.sqrt(Math.random()) * .62; }
      else { th = Math.floor(Math.random() * 12) / 12 * Math.PI * 2 + (Math.random() - .5) * .02; r = .8 + Math.random() * 3.5; }
      a[i*3] = Math.cos(th) * r * s; a[i*3+1] = Math.sin(th) * r * s; a[i*3+2] = R() * .25;
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
      const y = 4.4 - t * 8.2;
      const r = (.35 + (1 - t) * 3.6) * s;
      const th = t * 22 + Math.random() * .6;
      a[i*3] = Math.cos(th) * r + R() * .1;
      a[i*3+1] = y;
      a[i*3+2] = Math.sin(th) * r + R() * .1;
    }
    return a;
  },
  gear(N, m) {
    const a = new Float32Array(N * 3), s = m ? .68 : 1;
    for (let i = 0; i < N; i++) {
      const t = Math.random(); let r, th = Math.random() * Math.PI * 2;
      if (t < .45) { r = 3.4; }
      else if (t < .7) {
        const k = Math.floor(th / (Math.PI * 2) * 14);
        th = (k + .5) / 14 * Math.PI * 2 + (Math.random() - .5) * .18;
        r = 3.4 + Math.random() * .8;
      }
      else if (t < .85) { r = 1.1 + Math.random() * .15; }
      else {
        const k = Math.floor(Math.random() * 5);
        th = k / 5 * Math.PI * 2 + (Math.random() - .5) * .05;
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
      const cx = i % cols, cy = (i / cols) | 0;
      const x = (cx / (cols - 1) - .5) * w;
      const z = (cy / (rows - 1) - .5) * 7;
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
      a[i*3] = Math.cos(th) * r;
      a[i*3+1] = Math.sin(th) * r * .9;
      a[i*3+2] = (1 - t) * -1.6 + R() * .15;
    }
    return a;
  },
  laminar(N, m) {
    const a = new Float32Array(N * 3), w = m ? 9 : 16, lanes = 9;
    for (let i = 0; i < N; i++) {
      const lane = i % lanes;
      a[i*3] = R() * w / 2;
      a[i*3+1] = (lane - (lanes - 1) / 2) * .95 + R() * .06;
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
      const y = (t - .5) * 8.6;
      const th = t * Math.PI * 5 + strand * Math.PI;
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
      const lane = i % lanes, t = Math.random();
      const x = (t - .5) * w;
      a[i*3] = x;
      a[i*3+1] = x * .28 + (lane - 3) * 1.35 + R() * .05;
      a[i*3+2] = R() * .5;
    }
    return a;
  },
  target(N, m) {
    const a = new Float32Array(N * 3), s = m ? .66 : 1;
    for (let i = 0; i < N; i++) {
      const t = Math.random(); let r;
      if (t < .1) r = Math.sqrt(Math.random()) * .35;
      else r = (1 + Math.floor(Math.random() * 5)) * .95 + (Math.random() - .5) * .07;
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

/* ---------- logo lockup: ring mark + wordmark, one geometry for both the
   particle target and the crisp overlay, so the crossfade is seamless --- */
function buildLockup(word, font) {
  const W = 800, H = 160;
  const fam = font?.family || 'system-ui, sans-serif';
  const weight = font?.weight || '700';
  const probe = document.createElement('canvas').getContext('2d');
  let size = 80;
  probe.font = `${weight} ${size}px ${fam}`;
  const markD = 96, gap = 34, maxText = W - markD - gap - 24;
  const tw0 = probe.measureText(word).width;
  if (tw0 > maxText) size = Math.max(40, Math.floor(size * maxText / tw0));
  probe.font = `${weight} ${size}px ${fam}`;
  const tw = probe.measureText(word).width;
  const contentW = markD + gap + tw;
  const x0 = (W - contentW) / 2;               // left edge of mark
  const cx = x0 + markD / 2, cy = H / 2;
  const tx = x0 + markD + gap;                 // text start (left-aligned)

  function draw(ctx, markC, textC) {
    ctx.lineWidth = 8; ctx.strokeStyle = markC;
    ctx.beginPath(); ctx.arc(cx, cy, markD / 2 - 6, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = markC;
    ctx.beginPath(); ctx.arc(cx, cy, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = textC;
    ctx.font = `${weight} ${size}px ${fam}`;
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(word, tx, cy + 4);
  }

  // particle sampling target (white on black)
  const sc = document.createElement('canvas'); sc.width = W; sc.height = H;
  const sx = sc.getContext('2d');
  sx.fillStyle = '#000'; sx.fillRect(0, 0, W, H);
  draw(sx, '#fff', '#fff');
  const d = sx.getImageData(0, 0, W, H).data, pts = [];
  for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) if (d[(y * W + x) * 4] > 120) pts.push([x, y]);

  // crisp overlay (colored on transparent, 2x for retina)
  const S = 2;
  const oc = document.createElement('canvas'); oc.width = W * S; oc.height = H * S;
  const ox = oc.getContext('2d'); ox.scale(S, S);
  draw(ox, font?.markColor || '#E8B34B', font?.textColor || '#fff');

  return { pts, W, H, dataURL: oc.toDataURL('image/png') };
}

function wordFormFromPts(N, m, lock) {
  const a = new Float32Array(N * 3);
  const ww = m ? 6.0 : 14.5, wh = ww * (lock.H / lock.W), wy = m ? -2.4 : -3.5;
  for (let i = 0; i < N; i++) {
    const p = lock.pts[(Math.random() * lock.pts.length) | 0] || [lock.W / 2, lock.H / 2];
    a[i*3] = (p[0] / lock.W - .5) * ww;
    a[i*3+1] = (.5 - p[1] / lock.H) * wh + wy;
    a[i*3+2] = R() * .2;
  }
  return { a, ww, wh, wy };
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

  // wait briefly for webfonts so the logo lockup samples the real face
  await Promise.race([document.fonts?.ready, new Promise(r => setTimeout(r, 1500))]);

  const lock = buildLockup(cfg.word || 'IKIGAI ENGINE', {
    family: cfg.lockFont?.family, weight: cfg.lockFont?.weight,
    markColor: cfg.lockColors?.mark, textColor: cfg.lockColors?.text,
  });

  const canvas = document.getElementById('stage');
  let gl = null;
  try { gl = canvas.getContext('webgl2') || canvas.getContext('webgl'); } catch (e) {}
  if (!gl || reduce) {
    // static fallback: show the solid logo in the finale
    canvas.remove();
    const inner = document.querySelector('#finale .inner');
    if (inner) {
      const img = new Image();
      img.src = lock.dataURL;
      img.alt = 'Ikigai Engine';
      img.style.cssText = 'display:block;margin:40px auto 0;width:min(420px,80%);height:auto';
      inner.appendChild(img);
    }
    return;
  }

  const THREE = await import('../../cinema/vendor/three.module.min.js');
  const isMobile = matchMedia('(max-width:760px)').matches;
  const N = isMobile ? (cfg.count?.mobile ?? 7000) : (cfg.count?.desktop ?? 15000);
  const light = !!cfg.light;
  const F = cfg.forms.length;                 // number of formations (8)
  const LAST = F - 1;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, isMobile ? 2 : 1.5));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, .1, 100);

  const wordData = wordFormFromPts(N, isMobile, lock);
  const forms = cfg.forms.map(name => name === 'word' ? wordData.a : LIB[name](N, isMobile));

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(forms[0].slice(), 3));
  forms.forEach((f, i) => geo.setAttribute('aP' + i, new THREE.BufferAttribute(f, 3)));
  const seeds = new Float32Array(N);
  for (let i = 0; i < N; i++) seeds[i] = Math.random();
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

  const pal = cfg.palettes.map(c => new THREE.Vector3(...c));
  while (pal.length < F) pal.push(pal[pal.length - 1]);
  const baseAlpha = light ? .82 : .75;

  const uniforms = {
    uSeg: { value: 0 }, uTime: { value: 0 }, uDim: { value: 1 },
    uSize: { value: (cfg.size ?? (isMobile ? 2.1 : 2.5)) * renderer.getPixelRatio() },
    uAlpha: { value: baseAlpha },
  };
  for (let i = 0; i < F; i++) uniforms['uC' + i] = { value: pal[i] };

  const attrDecl = forms.map((_, i) => `attribute vec3 aP${i};`).join('\n');
  const colDecl = forms.map((_, i) => `uniform vec3 uC${i};`).join('\n');
  const pickBody = forms.map((_, i) => i < F - 1 ? `if(s<${i}.5) return aP${i};` : `return aP${i};`).join(' ');
  const colBody = forms.map((_, i) => i < F - 1 ? `if(s<${i}.5) return uC${i};` : `return uC${i};`).join(' ');

  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    blending: light ? THREE.NormalBlending : THREE.AdditiveBlending,
    uniforms,
    vertexShader: `
      ${attrDecl}
      attribute float aSeed;
      uniform float uSeg,uTime,uSize;
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
        p += vec3(sin(uTime*.5+n)*.06, cos(uTime*.4+n*1.7)*.06, sin(uTime*.3+n*2.3)*.06);
        vColor = mix(col(f), col(min(f+1., ${LAST}.0)), tt);
        vec4 mv = modelViewMatrix * vec4(p,1.);
        gl_Position = projectionMatrix * mv;
        float ps = uSize * (1. + aSeed*.9) * (10. / -mv.z);
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

  /* ---- crisp logo overlay, crossfaded in as the particles condense ---- */
  const lockEl = document.createElement('img');
  lockEl.src = lock.dataURL;
  lockEl.alt = '';
  lockEl.setAttribute('aria-hidden', 'true');
  lockEl.style.cssText = 'position:fixed;left:0;top:0;z-index:3;pointer-events:none;opacity:0;transform-origin:center;will-change:opacity,transform';
  document.body.appendChild(lockEl);
  const wordVec = new THREE.Vector3();

  /* ---- continuous scroll mapping: morph is always in flight ---- */
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
  const t0 = performance.now();
  function tick() {
    if (!running) return;
    requestAnimationFrame(tick);
    const t = (performance.now() - t0) / 1000;
    cur += (segTarget() - cur) * .11;
    mx += (tmx - mx) * .04; my += (tmy - my) * .04;

    // finale crossfade: particles condense, solid logo fades in
    const lockT = Math.min(1, Math.max(0, (cur - (LAST - .45)) / .45));
    const eased = lockT * lockT * (3 - 2 * lockT);
    uniforms.uDim.value = 1 - eased * .9;

    uniforms.uSeg.value = cur;
    uniforms.uTime.value = t;

    // scroll-coupled rotation so the scene always answers the scroll —
    // suppressed near the finale so the logo faces the camera squarely
    const p = LAST > 0 ? cur / LAST : 0;
    const flat = 1 - eased;
    points.rotation.y = (Math.sin(t * spin) * .12 + mx * .25 + Math.sin(p * Math.PI * 2) * .34) * flat;
    points.rotation.x = (my * .15 + Math.sin(p * Math.PI * 1.5) * .1) * flat;
    camera.position.z = camZ() - p * 1.4;
    renderer.render(scene, camera);

    // place the crisp overlay exactly where the particle lockup sits
    if (eased > 0) {
      wordVec.set(0, wordData.wy, 0).project(camera);
      const sx = (wordVec.x * .5 + .5) * innerWidth;
      const sy = (-wordVec.y * .5 + .5) * innerHeight;
      const edge = new THREE.Vector3(wordData.ww / 2, wordData.wy, 0).project(camera);
      const wpx = Math.abs(((edge.x * .5 + .5) * innerWidth) - sx) * 2;
      lockEl.style.width = wpx + 'px';
      lockEl.style.transform = `translate(${sx - wpx / 2}px, ${sy - (wpx * lock.H / lock.W) / 2}px) scale(${.965 + eased * .035})`;
      lockEl.style.opacity = eased;
    } else if (lockEl.style.opacity !== '0') {
      lockEl.style.opacity = 0;
    }
  }
  tick();
}
