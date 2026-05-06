(function () {
  if (sessionStorage.getItem('solmar_seen')) return;
  sessionStorage.setItem('solmar_seen', '1');

  /*
   * Building in 2-point perspective.
   * All top/bottom edges are lines converging at VP_L ≈ (-184, 203)
   * and VP_R ≈ (584, 203) — so every edge is mathematically correct.
   *
   * Key vertices:
   *   Front top:        (200, 70)
   *   Front bottom:     (200, 220)
   *   Left back top:    ( 90, 108)
   *   Left back bottom: ( 90, 215)
   *   Right back top:   (310, 108)
   *   Right back bottom:(310, 215)
   *
   * Perspective guide lines extend to x = 25 (left) and x = 375 (right).
   */

  const el = document.createElement('div');
  el.id = 'site-loader';
  el.innerHTML = `
    <svg class="loader-svg" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">

      <!-- 1 · front center vertical edge -->
      <path class="lp lp-main" data-delay="0"    data-dur="0.35"
            d="M 200 70 L 200 220"/>

      <!-- 2 · top perspective lines (center → corners → guide extensions) -->
      <path class="lp lp-main" data-delay="0.2"  data-dur="0.45"
            d="M 200 70 L 25 131"/>
      <path class="lp lp-main" data-delay="0.2"  data-dur="0.45"
            d="M 200 70 L 375 131"/>

      <!-- 3 · left and right vertical back edges -->
      <path class="lp lp-main" data-delay="0.5"  data-dur="0.3"
            d="M 90 108 L 90 215"/>
      <path class="lp lp-main" data-delay="0.5"  data-dur="0.3"
            d="M 310 108 L 310 215"/>

      <!-- 4 · bottom perspective lines (center → corners → guide extensions) -->
      <path class="lp lp-main" data-delay="0.65" data-dur="0.4"
            d="M 200 220 L 25 212"/>
      <path class="lp lp-main" data-delay="0.65" data-dur="0.4"
            d="M 200 220 L 375 212"/>

      <!--
        Floor lines computed from VP_L formula: y_back = 0.7135 * y_front + 58.18
        8 floors at front-edge y = 87, 103, 120, 137, 153, 170, 187, 203
        Corresponding back y  =      120, 132, 144, 156, 167, 179, 192, 203
        Lines draw sequentially top→bottom as dashoffset animates.
      -->

      <!-- 5 · left face floor lines -->
      <path class="lp lp-floor" data-delay="0.85" data-dur="0.65"
            d="M 200  87 L  90 120
               M 200 103 L  90 132
               M 200 120 L  90 144
               M 200 137 L  90 156
               M 200 153 L  90 167
               M 200 170 L  90 179
               M 200 187 L  90 192
               M 200 203 L  90 203"/>

      <!-- 6 · right face floor lines -->
      <path class="lp lp-floor" data-delay="0.85" data-dur="0.65"
            d="M 200  87 L 310 120
               M 200 103 L 310 132
               M 200 120 L 310 144
               M 200 137 L 310 156
               M 200 153 L 310 167
               M 200 170 L 310 179
               M 200 187 L 310 192
               M 200 203 L 310 203"/>

    </svg>
    <p class="loader-wordmark">SOLMAR</p>
  `;
  document.body.prepend(el);

  /* ── set dash lengths from live SVG geometry, then start animations ── */
  requestAnimationFrame(() => {
    el.querySelectorAll('.lp').forEach(p => {
      const len = p.getTotalLength();
      p.style.strokeDasharray  = len;
      p.style.strokeDashoffset = len;
      p.style.animation =
        `loader-draw ${p.dataset.dur}s ease ${p.dataset.delay}s forwards`;
    });
  });

  setTimeout(() => el.querySelector('.loader-wordmark').classList.add('visible'), 1600);
  setTimeout(() => el.classList.add('out'), 2300);
  setTimeout(() => el.remove(),             3000);
})();
