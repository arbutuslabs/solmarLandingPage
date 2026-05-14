(function () {
  if (sessionStorage.getItem('varta_seen')) return;
  sessionStorage.setItem('varta_seen', '1');

  const el = document.createElement('div');
  el.id = 'site-loader';
  el.innerHTML = '<img class="loader-logo" src="logo.png" alt="Varta Homes">';
  document.body.prepend(el);

  const logo = el.querySelector('.loader-logo');

  // Two rAF ticks ensure the element is painted before the transition fires
  requestAnimationFrame(() => requestAnimationFrame(() => logo.classList.add('reveal')));

  // Wipe takes 0.9s → hold briefly → fade out
  setTimeout(() => el.classList.add('out'), 2400);
  setTimeout(() => el.remove(),             3050);
})();
