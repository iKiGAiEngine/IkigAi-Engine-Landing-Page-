/* Shared scroll-film engine for the cinema variants.
   Each page calls boot(config) with:
     forms:    [name, name, name, name, 'word']   five formation names
     palettes: [[r,g,b] x5]                        0..1 floats per formation
     word:     'IKIGAI'                            finale word
     light:    false                               light mode (normal blending, dark dots)
     count:    {desktop, mobile}                   particle counts
     size:     base point size (default 2.5)
   The rest (copy, acts, rail) lives in the page's HTML.               */

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
    for (let i = 0; i < N; i++) {
      a[i*3] = R() * w; a[i*3+1] = R() * 6; a[i*3+2] = R() * 5;
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
      const t = Math.random();                       // 0 top -> 1 tip
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
      if (t < .45) { r = 3.4; }                                        // rim
      else if (t < .7) {                                               // teeth
        const k = Math.floor(th / (Math.PI * 2) * 14);
        th = (k + .5) / 14 * Math.PI * 2 + (Math.random() - .5) * .18;
        r = 3.4 + Math.random() * .8;
      }
      else if (t < .85) { r = 1.1 + Math.random() * .15; }             // hub
      else {                                                           // spokes
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
      const x = R() * w / 2;
      const t = Math.random();
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
      const x = (t - .5) * w;
      a[i*3] = x;
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
      const rung = Math.random() < .12;
      if (rung) {
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
    for (let i = 0; i < N; i++) {
      a[i*3] = R() * w / 2; a[i*3+1] = R() * 5.4; a[i*3+2] = R() * .6;
    }
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

function wordForm(N, m, word, fontCSS) {
  const a = new Float32Array(N * 3);
  const c2 = document.createElement('canvas');
  const W = 640, H = 160; c2.width = W; c2.height = H;
  const x2 = c2.getContext('2d');
  x2.fillStyle = '#000'; x2.fillRect(0, 0, W, H);
  x2.fillStyle = '#fff';
  x2.font = fontCSS || '700 118px system-ui, sans-serif';
  x2.textAlign = 'center'; x2.textBaseline = 'middle';
  x2.fillText(word, W / 2, H / 2 + 6);
  const d = x2.getImageData(0, 0, W, H).data, pts = [];
  for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) if (d[(y * W + x) * 4] > 120) pts.push([x, y]);
  const ww = m ? 6.6 : 13.5, wh = ww / 4, wy = m ? -2.4 : -3.5;
  for (let i = 0; i < N; i++) {
    const p = pts[(Math.random() * pts.length) | 0] || [W / 2, H / 2];
    a[i*3] = (p[0] / W - .5) * ww;
    a[i*3+1] = (.5 - p[1] / H) * wh + wy;
    a[i*3+2] = R() * .25;
  }
  return a;
}

/* ---------- UI wiring shared by all variants ---------- */
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

  const canvas = document.getElementById('stage');
  let gl = null;
  try { gl = canvas.getContext('webgl2') || canvas.getContext('webgl'); } catch (e) {}
  if (!gl || reduce) { canvas.remove(); return; }

  const THREE = await import('../../cinema/vendor/three.module.min.js');
  const isMobile = matchMedia('(max-width:760px)').matches;
  const N = isMobile ? (cfg.count?.mobile ?? 7000) : (cfg.count?.desktop ?? 15000);
  const light = !!cfg.light;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, isMobile ? 2 : 1.5));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, .1, 100);

  const forms = cfg.forms.map(name =>
    name === 'word' ? wordForm(N, isMobile, cfg.word || 'IKIGAI', cfg.wordFont)
                    : LIB[name](N, isMobile));

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(forms[0].slice(), 3));
  ['aP0','aP1','aP2','aP3','aP4'].forEach((n, i) => geo.setAttribute(n, new THREE.BufferAttribute(forms[i], 3)));
  const seeds = new Float32Array(N);
  for (let i = 0; i < N; i++) seeds[i] = Math.random();
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

  const pal = cfg.palettes.map(c => new THREE.Vector3(...c));
  const baseAlpha = light ? .82 : .75;

  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    blending: light ? THREE.NormalBlending : THREE.AdditiveBlending,
    uniforms: {
      uSeg: { value: 0 }, uTime: { value: 0 },
      uSize: { value: (cfg.size ?? (isMobile ? 2.1 : 2.5)) * renderer.getPixelRatio() },
      uAlpha: { value: baseAlpha },
      uC0: { value: pal[0] }, uC1: { value: pal[1] }, uC2: { value: pal[2] }, uC3: { value: pal[3] }, uC4: { value: pal[4] },
    },
    vertexShader: `
      attribute vec3 aP0,aP1,aP2,aP3,aP4;
      attribute float aSeed;
      uniform float uSeg,uTime,uSize;
      uniform vec3 uC0,uC1,uC2,uC3,uC4;
      varying vec3 vColor;
      varying float vFade;
      vec3 pick(float s){ if(s<.5) return aP0; if(s<1.5) return aP1; if(s<2.5) return aP2; if(s<3.5) return aP3; return aP4; }
      vec3 col(float s){ if(s<.5) return uC0; if(s<1.5) return uC1; if(s<2.5) return uC2; if(s<3.5) return uC3; return uC4; }
      void main(){
        float f = floor(uSeg), t = fract(uSeg);
        float tt = clamp(t*1.35 - aSeed*.35, 0., 1.);
        tt = tt*tt*(3.-2.*tt);
        vec3 p = mix(pick(f), pick(min(f+1.,4.)), tt);
        float n = aSeed*6.2831;
        p += vec3(sin(uTime*.5+n)*.06, cos(uTime*.4+n*1.7)*.06, sin(uTime*.3+n*2.3)*.06);
        vColor = mix(col(f), col(min(f+1.,4.)), tt);
        vec4 mv = modelViewMatrix * vec4(p,1.);
        gl_Position = projectionMatrix * mv;
        float ps = uSize * (1. + aSeed*.9) * (10. / -mv.z);
        gl_PointSize = clamp(ps, 1., 9.);
        vFade = smoothstep(-24., -6., mv.z);
      }`,
    fragmentShader: `
      precision mediump float;
      uniform float uAlpha;
      varying vec3 vColor;
      varying float vFade;
      void main(){
        vec2 uv = gl_PointCoord - .5;
        float a = smoothstep(.5,.08,length(uv));
        gl_FragColor = vec4(vColor, a*uAlpha*vFade);
      }`
  });
  scene.add(new THREE.Points(geo, mat));
  const points = scene.children[scene.children.length - 1];

  const acts = ['section.hero', '#act1', '#act2', '#act3', '#act4', '#finale'].map(s => document.querySelector(s));
  const formOf = [0, 0, 1, 2, 3, 4];
  let centers = [];
  const measure = () => { centers = acts.map(el => el.offsetTop + el.offsetHeight * .5); };
  function segTarget() {
    const y = scrollY + innerHeight * .5;
    if (y <= centers[0]) return formOf[0];
    for (let k = 0; k < centers.length - 1; k++) {
      if (y < centers[k + 1]) {
        const t = (y - centers[k]) / (centers[k + 1] - centers[k]);
        return formOf[k] + (formOf[k + 1] - formOf[k]) * Math.min(1, Math.max(0, t));
      }
    }
    return 4;
  }

  let cur = 0, mx = 0, my = 0, tmx = 0, tmy = 0;
  addEventListener('mousemove', e => { tmx = e.clientX / innerWidth - .5; tmy = e.clientY / innerHeight - .5; }, { passive: true });

  const camZ = () => (isMobile ? 16.5 : 13);
  function resize() {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
    measure();
  }
  resize(); addEventListener('resize', resize); addEventListener('load', measure);

  let running = true;
  document.addEventListener('visibilitychange', () => { running = !document.hidden; if (running) tick(); });

  const spin = cfg.spin ?? .05;
  const t0 = performance.now();
  function tick() {
    if (!running) return;
    requestAnimationFrame(tick);
    const t = (performance.now() - t0) / 1000;
    cur += (segTarget() - cur) * .085;
    mx += (tmx - mx) * .04; my += (tmy - my) * .04;
    mat.uniforms.uSeg.value = cur;
    mat.uniforms.uTime.value = t;
    points.rotation.y = Math.sin(t * spin) * .12 + mx * .25;
    points.rotation.x = my * .15;
    camera.position.z = camZ() - cur * .35;
    renderer.render(scene, camera);
  }
  tick();
}
