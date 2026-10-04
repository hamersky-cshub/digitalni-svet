import { progress } from './storage';

/* 1) Zapamatování pozice ve workshopu (jen v tomto prohlížeči). */
const { workshop, stop, stepLabel } = document.body.dataset;
if (workshop && stop) {
  progress.save(workshop, Number(stop), { href: location.pathname, label: stepLabel ?? '' });
}

/* 3) Offline režim: service worker uloží stránky, aby šly otevřít i při výpadku Wi-Fi. */
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  navigator.serviceWorker.register(`${base}sw.js`, { scope: base }).catch(() => {
    /* Bez service workeru web normálně funguje, jen ne offline. */
  });
}

/* Čitelnější písmo: nastavení se pamatuje jen v tomto prohlížeči. */
const textSize = document.querySelector<HTMLButtonElement>('[data-text-size]');
function renderTextSize() {
  if (!textSize) return;
  const large = document.documentElement.hasAttribute('data-large-text');
  textSize.setAttribute('aria-pressed', String(large));
  textSize.querySelector('[data-text-size-label]')!.textContent = large ? 'Běžné písmo' : 'Větší písmo';
}
if (textSize) {
  textSize.hidden = false;
  renderTextSize();
  textSize.addEventListener('click', () => {
    const large = document.documentElement.toggleAttribute('data-large-text');
    try { localStorage.setItem('dspk:large-text', String(large)); } catch {}
    renderTextSize();
  });
}
