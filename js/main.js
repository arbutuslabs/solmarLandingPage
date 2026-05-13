/* ── Mobile nav ── */
const hamburger = document.querySelector('.nav-hamburger');
const mobileNav = document.getElementById('mobile-nav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.remove('open');
    }
  });
}

/* ── Portfolio filter ── */
const filterTabs = document.querySelectorAll('.filter-tab');
const projectCards = document.querySelectorAll('.project-card[data-cat]');

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const filter = tab.dataset.filter;
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    projectCards.forEach(card => {
      card.classList.toggle('hidden', filter !== 'all' && card.dataset.cat !== filter);
    });
  });
});

/* ── Contact / quote tabs ── */
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanes.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(target)?.classList.add('active');
  });
});

/* ── Form submission ── */
// Replace FORM_ENDPOINT with your Google Apps Script web app URL.
// See: https://developers.google.com/apps-script/guides/web
const FORM_ENDPOINT = '';

document.querySelectorAll('form[data-varta]').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const successEl = form.querySelector('.form-success');
    const original = btn.textContent;

    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      if (FORM_ENDPOINT) {
        await fetch(FORM_ENDPOINT, {
          method: 'POST',
          body: new FormData(form),
        });
      }
      form.reset();
      if (successEl) successEl.style.display = 'block';
    } catch {
      alert('Something went wrong. Please email us directly.');
    } finally {
      btn.textContent = original;
      btn.disabled = false;
    }
  });
});
