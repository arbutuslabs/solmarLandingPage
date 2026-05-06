(function () {
  if (sessionStorage.getItem('solmar_seen')) return;
  sessionStorage.setItem('solmar_seen', '1');

  /* ── overlay ── */
  const el = document.createElement('div');
  el.id = 'site-loader';
  el.innerHTML = `
    <svg class="loader-svg" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">

      <!-- main building outline -->
      <path class="lp" data-delay="0"    data-dur="0.8"
            d="M 90 90 L 310 90 L 310 220 L 90 220 Z"/>

      <!-- roof / penthouse box (3 sides — bottom shared with building top) -->
      <path class="lp" data-delay="0.45" data-dur="0.35"
            d="M 240 90 L 240 70 L 160 70 L 160 90"/>

      <!-- floor lines -->
      <path class="lp" data-delay="0.65" data-dur="0.3"
            d="M 90 133 L 310 133"/>
      <path class="lp" data-delay="0.8"  data-dur="0.3"
            d="M 90 177 L 310 177"/>

      <!-- column lines -->
      <path class="lp" data-delay="0.9"  data-dur="0.25"
            d="M 163 90 L 163 220"/>
      <path class="lp" data-delay="1.0"  data-dur="0.25"
            d="M 237 90 L 237 220"/>

      <!-- corner registration marks -->
      <path class="lp" data-delay="1.05" data-dur="0.2"
            d="M 68 90 L 90 90 L 90 68"/>
      <path class="lp" data-delay="1.1"  data-dur="0.2"
            d="M 332 90 L 310 90 L 310 68"/>
      <path class="lp" data-delay="1.15" data-dur="0.2"
            d="M 68 220 L 90 220 L 90 242"/>
      <path class="lp" data-delay="1.2"  data-dur="0.2"
            d="M 332 220 L 310 220 L 310 242"/>

    </svg>
    <p class="loader-wordmark">SOLMAR</p>
  `;
  document.body.prepend(el);

  /* ── animate paths — lengths calculated from live SVG ── */
  requestAnimationFrame(() => {
    el.querySelectorAll('.lp').forEach(p => {
      const len = p.getTotalLength();
      p.style.strokeDasharray  = len;
      p.style.strokeDashoffset = len;
      p.style.animation =
        `loader-draw ${p.dataset.dur}s ease ${p.dataset.delay}s forwards`;
    });
  });

  /* ── wordmark fades in when drawing completes ── */
  setTimeout(() => el.querySelector('.loader-wordmark').classList.add('visible'), 1500);

  /* ── overlay fades out, then is removed ── */
  setTimeout(() => el.classList.add('out'), 2200);
  setTimeout(() => el.remove(),             2900);
})();
