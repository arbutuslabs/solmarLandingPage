(function () {
  if (window.matchMedia('(hover: none)').matches) return;

  /* ── constants ── */
  const TILE_W    = 18;
  const TILE_H    = 36;
  const ROW_STEP  = 18;
  const STAGGER   = 9;
  const HW        = 7.0;
  const HH        = 14.0;
  const RADIUS    = 80;
  const RADIUS_SQ = RADIUS * RADIUS;
  const DECAY  = 0.90;   // slower fade → longer trail

  const C_REST = 'rgba(191,195,199,0.08)';

  /* ── canvas setup ── */
  const canvas = document.createElement('canvas');
  canvas.id = 'tile-grid';
  canvas.style.cssText = 'position:fixed;inset:0;z-index:3;pointer-events:none;display:block;';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d', { alpha: true });

  const STILL_MS = 80; // ms without a mousemove before tiles start settling

  let tiles        = [];
  let mouseX       = -9999;
  let mouseY       = -9999;
  let rafId        = null;
  let active       = new Set();
  let lastMoveTime = 0;

  /* ── build tile data ── */
  function buildGrid () {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    canvas.width  = vw;
    canvas.height = vh;

    tiles  = [];
    active = new Set();

    const rowStart = -1;
    const numRows  = Math.ceil(vh / ROW_STEP) + 3;
    const numCols  = Math.ceil(vw / TILE_W)  + 3;

    for (let r = rowStart; r < rowStart + numRows; r++) {
      const isOdd = ((r % 2) + 2) % 2 === 1;
      const yMid  = r * ROW_STEP + TILE_H / 2;
      const xBase = isOdd ? STAGGER : 0;
      for (let c = -1; c < numCols; c++) {
        tiles.push({ cx: c * TILE_W + xBase + TILE_W / 2, cy: yMid, val: 0 });
      }
    }

    drawFrame();
  }

  function diamond (cx, cy) {
    ctx.moveTo(cx,      cy - HH);
    ctx.lineTo(cx + HW, cy);
    ctx.lineTo(cx,      cy + HH);
    ctx.lineTo(cx - HW, cy);
    ctx.closePath();
  }

  /* ── render ── */
  function drawFrame () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Pass 1 — all resting tiles in one path + one fill
    ctx.beginPath();
    for (let i = 0, n = tiles.length; i < n; i++) {
      if (tiles[i].val < 0.01) diamond(tiles[i].cx, tiles[i].cy);
    }
    ctx.fillStyle = C_REST;
    ctx.fill();

    // Pass 2 — active tiles, lighter colour scaled by proximity value
    for (const i of active) {
      const t = tiles[i];
      ctx.beginPath();
      diamond(t.cx, t.cy);
      ctx.fillStyle = `rgba(191,195,199,${(0.08 + t.val * 0.22).toFixed(3)})`;
      ctx.fill();
    }
  }

  /* ── animation tick ── */
  function tick () {
    rafId = null;
    const newActive = new Set();

    // Drive tiles on every tick while mouse is still moving
    const driving = (performance.now() - lastMoveTime) < STILL_MS;

    if (driving) {
      for (let i = 0, n = tiles.length; i < n; i++) {
        const t  = tiles[i];
        const dx = t.cx - mouseX;
        const dy = t.cy - mouseY;
        const d2 = dx * dx + dy * dy;
        if (d2 < RADIUS_SQ) {
          const p = 1 - Math.sqrt(d2) / RADIUS;
          t.val   = p * p * (3 - 2 * p); // smoothstep → 0–1
          newActive.add(i);
        }
      }
    }

    // Decay any tile no longer being driven (settling or out of radius)
    for (const i of active) {
      if (!newActive.has(i)) {
        const t = tiles[i];
        t.val *= DECAY;
        if (t.val > 0.01) {
          newActive.add(i);
        } else {
          t.val = 0;
        }
      }
    }

    active = newActive;
    drawFrame();

    if (active.size > 0) rafId = requestAnimationFrame(tick);
  }

  /* ── events ── */
  document.addEventListener('mousemove', e => {
    mouseX       = e.clientX;
    mouseY       = e.clientY;
    lastMoveTime = performance.now();
    if (!rafId) rafId = requestAnimationFrame(tick);
  });

  document.addEventListener('mouseleave', () => {
    mouseX       = -9999;
    mouseY       = -9999;
    lastMoveTime = 0;
    if (!rafId) rafId = requestAnimationFrame(tick);
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildGrid, 150);
  });

  buildGrid();
})();
