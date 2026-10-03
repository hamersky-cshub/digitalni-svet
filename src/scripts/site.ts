import { lecturerMode, progress } from './storage';

/* 1) Zapamatování pozice ve workshopu (jen v tomto prohlížeči). */
const { workshop, stop, stepLabel } = document.body.dataset;
if (workshop && stop) {
  progress.save(workshop, Number(stop), { href: location.pathname, label: stepLabel ?? '' });
}

/* 2) Režim lektora: poznámky jsou skryté, dokud je lektor nezapne na stránce Pro lektory. */
function applyLecturerMode(on: boolean) {
  document.querySelectorAll<HTMLElement>('[data-lecturer]').forEach((el) => (el.hidden = !on));
}
applyLecturerMode(lecturerMode.isOn());
document.addEventListener('lecturer-mode', (e) => applyLecturerMode((e as CustomEvent<boolean>).detail));
document.querySelectorAll<HTMLButtonElement>('[data-lecturer-off]').forEach((button) =>
  button.addEventListener('click', () => lecturerMode.set(false)),
);

/* 3) Offline režim: service worker uloží stránky, aby šly otevřít i při výpadku Wi-Fi. */
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  navigator.serviceWorker.register(`${base}sw.js`, { scope: base }).catch(() => {
    /* Bez service workeru web normálně funguje, jen ne offline. */
  });
}
