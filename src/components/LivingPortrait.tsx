import React, { useEffect, useRef } from 'react';
import { FadeIn } from './FadeIn';

const PORTRAIT_SRC = `${import.meta.env.BASE_URL}jayed-portrait.png`;

export const LivingPortrait: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLImageElement>(null);
  const flyRef = useRef<SVGSVGElement>(null);
  const handRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const fallback = fallbackRef.current;
    const fly = flyRef.current;
    const hand = handRef.current;
    if (!wrap || !canvas || !fallback || !fly || !hand) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
    });
    if (!gl) return;

    let disposed = false;
    let rafId = 0;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const OVER = 1.7;
    const N = 72;
    const M = N + 1;
    const SPAN = OVER / N;
    const ORIGIN = 0.5 - OVER / 2;
    const WOBBLE = 2.3 * 2 * Math.PI;
    const REACH = 0.085 / SPAN;
    const C = REACH * WOBBLE;
    const GAMMA = 2 * 0.14 * WOBBLE;
    const NU = 0.2 * C;

    const VS = `attribute vec2 a, d; attribute float s; varying vec2 vUv; varying float vS;
      uniform vec2 lean; uniform float overS;
      void main(){ vUv = a; vS = s; vec2 p = a + d + lean; gl_Position = vec4(vec2(p.x-.5, .5-p.y)*2./overS, 0., 1.); }`;
    const FS = `precision highp float; varying vec2 vUv; varying float vS;
      uniform sampler2D faceA;
      uniform float boost;
      void main(){
        if(vUv.x<0.||vUv.y<0.||vUv.x>1.||vUv.y>1.){ gl_FragColor = vec4(0.); return; }
        vec4 c = texture2D(faceA, vUv);
        if(c.a<.004){ gl_FragColor = vec4(0.); return; }
        gl_FragColor = vec4(c.rgb * vS * boost, c.a);
      }`;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
      }
      return shader;
    };

    const vs = compileShader(gl.VERTEX_SHADER, VS);
    const fs = compileShader(gl.FRAGMENT_SHADER, FS);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const uOver = gl.getUniformLocation(program, 'overS');
    const uLean = gl.getUniformLocation(program, 'lean');
    const uFaceA = gl.getUniformLocation(program, 'faceA');
    const uBoost = gl.getUniformLocation(program, 'boost');

    gl.uniform1f(uOver, OVER);
    gl.uniform1i(uFaceA, 0);
    gl.uniform1f(uBoost, 1.0);

    // ---- Soft stretchy sheet: damped wave equation on node displacements ----
    const count = M * M;
    const ux = new Float32Array(count);
    const uy = new Float32Array(count);
    const vx = new Float32Array(count);
    const vy = new Float32Array(count);
    const rest = new Float32Array(count * 2);
    const dyn = new Float32Array(count * 3);
    const sx = new Float32Array(count);
    const sy = new Float32Array(count);

    for (let j = 0, k = 0; j < M; j++) {
      for (let i = 0; i < M; i++) {
        rest[k++] = ORIGIN + i * SPAN;
        rest[k++] = ORIGIN + j * SPAN;
      }
    }

    const idx = new Uint16Array(N * N * 6);
    for (let j = 0, k = 0; j < N; j++) {
      for (let i = 0; i < N; i++) {
        const a = j * M + i;
        const b = a + 1;
        const c = a + M;
        const d = c + 1;
        idx[k++] = a;
        idx[k++] = c;
        idx[k++] = b;
        idx[k++] = b;
        idx[k++] = c;
        idx[k++] = d;
      }
    }

    const restBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, restBuf);
    gl.bufferData(gl.ARRAY_BUFFER, rest, gl.STATIC_DRAW);
    const aa = gl.getAttribLocation(program, 'a');
    gl.enableVertexAttribArray(aa);
    gl.vertexAttribPointer(aa, 2, gl.FLOAT, false, 0, 0);

    const dynBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, dynBuf);
    gl.bufferData(gl.ARRAY_BUFFER, dyn, gl.DYNAMIC_DRAW);
    const ad = gl.getAttribLocation(program, 'd');
    const as = gl.getAttribLocation(program, 's');
    gl.enableVertexAttribArray(ad);
    gl.vertexAttribPointer(ad, 2, gl.FLOAT, false, 12, 0);
    gl.enableVertexAttribArray(as);
    gl.vertexAttribPointer(as, 1, gl.FLOAT, false, 12, 8);

    const idxBuf = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    // Grab brush
    type Brush = {
      u: number;
      v: number;
      list: Array<[number, number, number, number]>;
      px: number;
      py: number;
    };
    let brush: Brush | null = null;

    function takeHold(u: number, v: number, radius = 0.22) {
      const list: Array<[number, number, number, number]> = [];
      for (let k = 0; k < count; k++) {
        const dx = rest[k * 2] + ux[k] - u;
        const dy = rest[k * 2 + 1] + uy[k] - v;
        const w = Math.exp(-(dx * dx + dy * dy) / (radius * radius));
        if (w > 0.02) list.push([k, w, ux[k], uy[k]]);
      }
      brush = { u, v, list, px: 0, py: 0 };
    }

    // Untangle: keep rows and columns strictly ordered so triangles never fold
    const GAP = SPAN * 0.34;
    const lineA = new Float32Array(M);
    const lineB = new Float32Array(M);
    const lineP = new Float32Array(M);

    function order(
      start: number,
      stride: number,
      field: Float32Array,
      base: Float32Array
    ) {
      for (let i = 0; i < M; i++) {
        const k = start + i * stride;
        lineP[i] = base[k] + field[k];
      }
      lineA[0] = lineP[0];
      for (let i = 1; i < M; i++) {
        lineA[i] = Math.max(lineP[i], lineA[i - 1] + GAP);
      }
      lineB[N] = lineP[N];
      for (let i = N - 1; i >= 0; i--) {
        lineB[i] = Math.min(lineP[i], lineB[i + 1] - GAP);
      }
      for (let i = 0; i < M; i++) {
        const k = start + i * stride;
        field[k] = (lineA[i] + lineB[i]) / 2 - base[k];
      }
    }

    const restX = new Float32Array(count);
    const restY = new Float32Array(count);
    for (let k = 0; k < count; k++) {
      restX[k] = rest[k * 2];
      restY[k] = rest[k * 2 + 1];
    }

    function untangle() {
      for (let pass = 0; pass < 2; pass++) {
        for (let j = 0; j < M; j++) order(j * M, 1, sx, restX);
        for (let i = 0; i < M; i++) order(i, M, sy, restY);
      }
    }

    const H = 1 / 240;
    let simLeft = 0;

    function step(dt: number) {
      const c2 = C * C;
      const wo2 = WOBBLE * WOBBLE;
      for (let j = 1; j < N; j++) {
        for (let i = 1; i < N; i++) {
          const k = j * M + i;
          const l = k - 1;
          const r = k + 1;
          const t = k - M;
          const b = k + M;
          const lx = ux[l] + ux[r] + ux[t] + ux[b] - 4 * ux[k];
          const ly = uy[l] + uy[r] + uy[t] + uy[b] - 4 * uy[k];
          const lvx = vx[l] + vx[r] + vx[t] + vx[b] - 4 * vx[k];
          const lvy = vy[l] + vy[r] + vy[t] + vy[b] - 4 * vy[k];
          vx[k] += (c2 * lx - wo2 * ux[k] - GAMMA * vx[k] + NU * lvx) * dt;
          vy[k] += (c2 * ly - wo2 * uy[k] - GAMMA * vy[k] + NU * lvy) * dt;
        }
      }
      if (brush) {
        for (const [k, w, u0, v0] of brush.list) {
          const K = 3000 * w;
          const D = 90 * w;
          vx[k] += ((u0 + brush.px * w - ux[k]) * K - vx[k] * D) * dt;
          vy[k] += ((v0 + brush.py * w - uy[k]) * K - vy[k] * D) * dt;
        }
      }
      for (let k = 0; k < count; k++) {
        ux[k] += vx[k] * dt;
        uy[k] += vy[k] * dt;
      }
    }

    function poke(u: number, v: number, dx: number, dy: number, radius = 0.09) {
      for (let k = 0; k < count; k++) {
        const ax = rest[k * 2] - u;
        const ay = rest[k * 2 + 1] - v;
        const w = Math.exp(-(ax * ax + ay * ay) / (radius * radius));
        vx[k] += dx * w;
        vy[k] += dy * w;
      }
    }

    // ---- Texture & alpha hit-map ----
    let portraitTex: WebGLTexture | null = null;
    let alphaMap: Uint8ClampedArray | null = null;
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

    function uploadTexture(img: HTMLImageElement) {
      const t = gl!.createTexture();
      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, t);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, img);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
      portraitTex = t;
    }

    function buildHitMap(img: HTMLImageElement) {
      const c = document.createElement('canvas');
      c.width = 128;
      c.height = 128;
      const ctx = c.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, 128, 128);
      alphaMap = ctx.getImageData(0, 0, 128, 128).data;
    }

    // ---- Idle acts (fly buzz & ghost-hand cheek tug) after 30-45s idle ----
    type ActStep = {
      hold: number;
      jolt?: [number, number, number, number, number];
      lean?: [number, number];
      call?: (now: number) => void;
    };

    let act: ActStep[] | null = null;
    let actI = 0;
    let actT = 0;
    let nextIdle = 30000 + Math.random() * 15000;
    let idleFlip = 0;

    let handHeld = false;
    let handGrip: false | 'on' | 'pull' | 'off' = false;
    let handFrom: [number, number] = [1.4, 0.9];
    let handTo: [number, number] = [1.4, 0.9];
    let flyFrom: [number, number] = [1.4, 0];
    let flyTo: [number, number] = [1.4, 0];
    let moveT = 0;
    let moveMs = 1;
    let wantLean: [number, number] = [0, 0];

    const place = (el: SVGSVGElement, u: number, v: number) => {
      el.style.left = `${(u - 0.5) * 100 + 50}%`;
      el.style.top = `${(v - 0.5) * 100 + 50}%`;
    };

    const moveHand = (u: number, v: number, ms: number) => (now: number) => {
      handFrom = handTo;
      handTo = [u, v];
      moveT = now;
      moveMs = ms;
    };

    const moveFly = (u: number, v: number, ms: number) => (now: number) => {
      flyFrom = flyTo;
      flyTo = [u, v];
      moveT = now;
      moveMs = ms;
    };

    function endAct() {
      act = null;
      fly!.style.opacity = '0';
      hand!.style.opacity = '0';
      wantLean = [0, 0];
      if (handHeld) {
        handHeld = false;
        handGrip = false;
        brush = null;
        hand!.classList.remove('shut');
      }
    }

    function advance(now: number) {
      actI++;
      if (!act || actI >= act.length) {
        endAct();
        return;
      }
      const stepItem = act[actI];
      actT = now;
      if (stepItem.jolt) poke(...stepItem.jolt);
      wantLean = stepItem.lean ?? [0, 0];
      if (stepItem.call) stepItem.call(now);
    }

    function startIdleAct(now: number) {
      endAct();
      if (idleFlip % 2 === 0) {
        // Ghost hand cheek tug
        handTo = [1.3, 0.86];
        hand!.style.opacity = '1';
        hand!.classList.remove('shut');
        const g = (
          u: number,
          v: number,
          ms: number,
          grip: false | 'on' | 'pull' | 'off'
        ): ActStep => ({
          hold: ms,
          call: (t) => {
            moveHand(u, v, ms * 0.8)(t);
            handGrip = grip;
          },
        });
        act = [
          g(0.62, 0.52, 760, false),
          g(0.62, 0.52, 240, 'on'),
          g(0.86, 0.48, 620, 'pull'),
          g(0.79, 0.53, 240, 'pull'),
          g(0.88, 0.46, 240, 'pull'),
          g(0.81, 0.5, 260, 'pull'),
          g(1.4, 0.22, 900, 'off'),
        ];
      } else {
        // Curious fly landing on glasses/nose and shooed away
        flyTo = [1.35, 0.02];
        fly!.style.opacity = '1';
        const hop = (u: number, v: number, ms: number): ActStep => ({
          hold: ms,
          call: moveFly(u, v, ms * 0.9),
        });
        act = [
          hop(0.86, 0.22, 620),
          hop(0.14, 0.34, 680),
          hop(0.84, 0.62, 640),
          hop(0.5, 0.48, 520),
          { hold: 820, jolt: [0.5, 0.48, 0, 0.28, 0.06] },
          { hold: 620, call: moveFly(1.45, -0.3, 580), jolt: [0.5, 0.48, 0.35, -0.45, 0.14] },
        ];
      }
      idleFlip++;
      actI = -1;
      actT = now;
      advance(now);
    }

    // ---- Interaction state ----
    let ready = false;
    let tStart = 0;
    let last = performance.now();
    let pu = 0.5;
    let pv = 0.5;
    let onHead = false;
    let awake = false;
    let pressed = false;
    let downAt = 0;
    let downU = 0;
    let downV = 0;
    let lastX = 0;
    let lastY = 0;
    let speed = 0;
    let lastInput = -1e9;
    let leanX = 0;
    let leanY = 0;
    let lvX = 0;
    let lvY = 0;
    let hoverContact = false;
    let boostVal = 1.0;

    const toUv = (x: number, y: number): [number, number] => {
      const r = canvas!.getBoundingClientRect();
      return [
        ((x - r.left) / r.width - 0.5) * OVER + 0.5,
        ((y - r.top) / r.height - 0.5) * OVER + 0.5,
      ];
    };

    const solid = (u: number, v: number) =>
      Boolean(
        alphaMap &&
          u >= 0 &&
          v >= 0 &&
          u < 1 &&
          v < 1 &&
          alphaMap[(((v * 128) | 0) * 128 + ((u * 128) | 0)) * 4 + 3] > 30
      );

    const wake = (now: number) => {
      lastInput = now;
      awake = true;
      nextIdle = 30000 + Math.random() * 15000;
    };

    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      [pu, pv] = toUv(e.clientX, e.clientY);
      speed += Math.hypot(dx, dy) * 0.004;
      wake(now);
      if (act && !pressed) endAct();

      onHead = solid(pu, pv);
      wrap!.style.cursor = pressed ? 'grabbing' : onHead ? 'grab' : '';

      // Subtle rub ripple across portrait when moving over it
      if (onHead && !pressed) {
        poke(pu, pv, dx * 0.00038, dy * 0.00038, 0.075);
      }

      // Fast cursor shake creates a playful wind gust across the sheet
      if (speed > 1.8 && !pressed) {
        poke(0.5, 0.42, Math.sign(dx || 1) * 0.09, -0.02, 0.28);
      }

      if (pressed && brush) {
        let px = pu - brush.u;
        let py = pv - brush.v;
        const L = Math.hypot(px, py);
        const lim = 0.24;
        if (L > 0) {
          const k = (lim * (1 - Math.exp(-L / lim))) / L;
          px *= k;
          py *= k;
        }
        brush.px = px;
        brush.py = py;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      const now = performance.now();
      const [u, v] = toUv(e.clientX, e.clientY);
      if (!solid(u, v)) return;
      wake(now);
      endAct();
      pressed = true;
      downAt = now;
      downU = u;
      downV = v;
      takeHold(u, v);
      wrap!.style.cursor = 'grabbing';
      try {
        wrap!.setPointerCapture(e.pointerId);
      } catch {
        // ignore synthetic events
      }
      e.preventDefault();
    };

    const release = () => {
      if (!pressed || !brush) return;
      const now = performance.now();
      const L = Math.hypot(brush.px, brush.py);
      const held = now - downAt;
      pressed = false;
      brush = null;
      wrap!.style.cursor = onHead ? 'grab' : '';
      if (L < 0.03 && held < 380) {
        // Quick tap gives a tactile elastic bounce
        poke(downU, downV, 0, 0.55, 0.09);
      }
    };

    const onScroll = () => {
      wake(performance.now());
    };

    window.addEventListener('pointermove', onPointerMove);
    wrap.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    window.addEventListener('scroll', onScroll, { passive: true });

    // Subtle reaction when hovering any Contact Me button
    const onContactEnter = () => {
      hoverContact = true;
      poke(0.5, 0.45, 0, -0.22, 0.22);
    };
    const onContactLeave = () => {
      hoverContact = false;
    };
    const contactBtns = Array.from(document.querySelectorAll('.contact-btn'));
    contactBtns.forEach((b) => {
      b.addEventListener('pointerenter', onContactEnter);
      b.addEventListener('pointerleave', onContactLeave);
    });

    let visible = true;
    const io = new IntersectionObserver(
      (es) => {
        visible = es[0]?.isIntersecting ?? true;
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const b = canvas!.getBoundingClientRect();
      if (b.width > 0 && b.height > 0) {
        canvas!.width = Math.round(b.width * dpr);
        canvas!.height = Math.round(b.height * dpr);
        gl!.viewport(0, 0, canvas!.width, canvas!.height);
      }
    };
    const ro = new ResizeObserver(resizeCanvas);
    ro.observe(canvas);
    resizeCanvas();

    function frame(now: number) {
      if (disposed) return;
      rafId = requestAnimationFrame(frame);
      const dt = Math.min(0.04, (now - last) / 1000);
      last = now;
      if (!ready || !visible || !portraitTex) return;

      speed *= Math.exp(-dt * 6);

      // Idle acts when untouched for 30-45s
      if (act) {
        if (now - actT > act[actI].hold) advance(now);
      } else if (
        !reduced &&
        !pressed &&
        tStart &&
        now - Math.max(lastInput, tStart) > nextIdle
      ) {
        startIdleAct(now);
        lastInput = now;
        nextIdle = 30000 + Math.random() * 15000;
      }

      // Moving props
      const mk = Math.min(1, (now - moveT) / moveMs);
      const me = mk * mk * (3 - 2 * mk);
      const flyPos: [number, number] = [
        flyFrom[0] +
          (flyTo[0] - flyFrom[0]) * me +
          Math.sin(now * 0.02) * 0.012 * (1 - (mk >= 1 ? 0.85 : 0)),
        flyFrom[1] +
          (flyTo[1] - flyFrom[1]) * me +
          Math.cos(now * 0.027) * 0.012 * (1 - (mk >= 1 ? 0.85 : 0)),
      ];
      place(fly!, flyPos[0], flyPos[1]);

      const hp: [number, number] = [
        handFrom[0] + (handTo[0] - handFrom[0]) * me,
        handFrom[1] + (handTo[1] - handFrom[1]) * me,
      ];
      place(hand!, hp[0], hp[1]);

      if (handGrip === 'on' && !handHeld) {
        takeHold(hp[0], hp[1], 0.22);
        handHeld = true;
        hand!.classList.add('shut');
        handGrip = 'pull';
      }
      if (handHeld && brush) {
        brush.px = hp[0] - brush.u;
        brush.py = hp[1] - brush.v;
      }
      if (handGrip === 'off' && handHeld) {
        handHeld = false;
        brush = null;
        hand!.classList.remove('shut');
        handGrip = false;
      }

      // Springy head lean toward cursor, pull, or contact hover
      const clampedPu = Math.max(-0.6, Math.min(1.6, pu));
      const clampedPv = Math.max(-0.6, Math.min(1.6, pv));
      const tx =
        (pressed || handHeld
          ? brush
            ? brush.px * 0.16
            : 0
          : awake
          ? (clampedPu - 0.5) * 0.014
          : 0) +
        wantLean[0] +
        (hoverContact ? 0.008 : 0) +
        Math.sin(now * 0.0009) * 0.0018;
      const ty =
        (pressed || handHeld
          ? brush
            ? brush.py * 0.16
            : 0
          : awake
          ? (clampedPv - 0.46) * 0.01
          : 0) +
        wantLean[1] +
        (hoverContact ? 0.006 : 0) +
        Math.sin(now * 0.0013) * 0.0024;

      lvX += ((tx - leanX) * 70 - lvX * 8) * dt;
      lvY += ((ty - leanY) * 70 - lvY * 8) * dt;
      leanX += lvX * dt;
      leanY += lvY * dt;

      const targetBoost = hoverContact ? 1.07 : 1.0;
      boostVal += (targetBoost - boostVal) * Math.min(1, dt * 8);

      // Fixed 1/240s physics step
      simLeft += dt;
      let steps = 0;
      while (simLeft >= H && steps < 9) {
        step(H);
        simLeft -= H;
        steps++;
      }
      if (steps === 9) simLeft = 0;

      for (let j = 0; j < M; j++) {
        for (let i = 0; i < M; i++) {
          const k = j * M + i;
          const edge = i === 0 || j === 0 || i === N || j === N;
          sx[k] = edge
            ? ux[k]
            : (ux[k] * 4 + ux[k - 1] + ux[k + 1] + ux[k - M] + ux[k + M]) / 8;
          sy[k] = edge
            ? uy[k]
            : (uy[k] * 4 + uy[k - 1] + uy[k + 1] + uy[k - M] + uy[k + M]) / 8;
        }
      }
      untangle();

      for (let k = 0, o = 0; k < count; k++) {
        dyn[o++] = sx[k];
        dyn[o++] = sy[k];
        const r = k % M;
        const c = (k / M) | 0;
        let sh = 1;
        if (r > 0 && r < N && c > 0 && c < N) {
          sh = Math.max(
            0.86,
            Math.min(
              1.16,
              1 - (sx[k + 1] - sx[k - 1] + (sy[k + M] - sy[k - M])) * 1.8
            )
          );
        }
        dyn[o++] = sh;
      }

      gl!.bindBuffer(gl!.ARRAY_BUFFER, dynBuf);
      gl!.bufferSubData(gl!.ARRAY_BUFFER, 0, dyn);

      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, portraitTex);
      gl!.uniform2f(uLean, leanX, leanY);
      gl!.uniform1f(uBoost, boostVal);
      gl!.drawElements(gl!.TRIANGLES, idx.length, gl!.UNSIGNED_SHORT, 0);
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (disposed) return;
      uploadTexture(img);
      buildHitMap(img);
      fallback.style.visibility = 'hidden';
      resizeCanvas();
      ready = true;
      tStart = performance.now();
      rafId = requestAnimationFrame(frame);
    };
    img.src = PORTRAIT_SRC;

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      wrap.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
      window.removeEventListener('scroll', onScroll);
      contactBtns.forEach((b) => {
        b.removeEventListener('pointerenter', onContactEnter);
        b.removeEventListener('pointerleave', onContactLeave);
      });
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <div className="hero-portrait-wrap" id="magnetWrap" ref={wrapRef}>
      <FadeIn delay={0.6} y={30} className="hero-portrait-inner" style={{ position: 'relative' }}>
        <img
          ref={fallbackRef}
          id="faceFallback"
          src={PORTRAIT_SRC}
          alt="Jayed Jaman Seen Portrait"
          width={1024}
          height={1024}
          fetchPriority="high"
          decoding="async"
          draggable={false}
        />
        <canvas ref={canvasRef} id="faceGl" aria-hidden="true" />
        <div id="faceProps" aria-hidden="true">
          <svg ref={flyRef} id="faceFly" viewBox="0 0 32 32">
            <path
              className="wing"
              d="M15 15C12 9.500 4.500 8.500 2 13c2.500 4.500 10 4.500 13 2z"
            />
            <path
              className="wing r"
              d="M17 15c3-5.500 10.500-6.500 13-2-2.500 4.500-10 4.500-13 2z"
            />
            <ellipse cx="16" cy="19.500" rx="4" ry="6.500" />
            <circle cx="16" cy="11.500" r="3.300" />
          </svg>
          <svg ref={handRef} id="faceHand" viewBox="0 0 32 32">
            <path
              className="open"
              d="M10.500 16.500V8.200a1.800 1.800 0 0 1 3.600 0V14v-8a1.800 1.800 0 0 1 3.600 0V14 7a1.800 1.800 0 0 1 3.600 0v8-5a1.800 1.800 0 0 1 3.600 0v10.500c0 5-3.400 8.500-8.400 8.500-3.600 0-5.700-1.600-7.600-4.600l-3.500-5.600c-.6-1 .1-2.200 1.200-2.400 1-.2 1.900.2 2.600 1z"
            />
            <path
              className="grab"
              d="M10.500 17v-3.300a1.800 1.800 0 0 1 3.600 0V14v-1.800a1.800 1.800 0 0 1 3.600 0V14v-1.300a1.800 1.800 0 0 1 3.600 0V14v-.3a1.800 1.800 0 0 1 3.600 0v6.800c0 5-3.400 8.500-8.400 8.500-3.600 0-5.700-1.600-7.600-4.600l-2.300-3.700c-.6-1 .1-2.200 1.200-2.400 1-.2 1.900.2 2.700 1z"
            />
          </svg>
        </div>
      </FadeIn>
    </div>
  );
};
