/*
 * Offline režim „Digitální svět pod kontrolou“.
 * - Stránky (HTML): nejdřív síť (nejvýš 3,5 s), pak uložená kopie, pak offline stránka.
 *   Když je připojení, obsah je vždy aktuální; při slabé Wi-Fi se ukáže uložená kopie.
 * - Styly, skripty, písma a obrázky: nejdřív uložená kopie.
 * - Při instalaci se stáhne základ webu. Stránka pak požádá o společné stránky
 *   a o obrazovky modulu, ve kterém právě jste.
 * - VERSION a PRECACHE doplní sestavení (scripts/service-worker.mjs). Verze se mění
 *   s obsahem webu; starší uložené kopie se pak smažou.
 * Neukládají se žádné údaje uživatele, jen veřejné stránky tohoto webu.
 */
const VERSION = 'dev';
const PRECACHE = { core: [], shared: [], modules: {} };

const CACHE = `dspk-${VERSION}`;
const SCOPE = new URL(self.registration.scope).pathname;
const TIMEOUT = 3500;
const OFFLINE_HTML =
  '<!doctype html><html lang="cs"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
  '<title>Jste offline</title><body style="font:1.25rem/1.5 system-ui,sans-serif;margin:2rem;max-width:40rem">' +
  '<h1>Jste offline</h1><p>Tato stránka není v zařízení uložená a připojení k internetu teď nefunguje.</p>' +
  '<p>Zkontrolujte Wi-Fi a zkuste to znovu.</p></body></html>';

const abs = (path) => `${SCOPE}${path}`;
const keyOf = (url) => url.origin + url.pathname;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE.core.map((path) => new Request(abs(path), { cache: 'no-cache' }))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('dspk-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

/* Stránka požádá o uložení společných stránek a modulu, ve kterém právě je. */
let precacheJob = Promise.resolve();
self.addEventListener('message', (event) => {
  if (event.data?.type !== 'precache') return;
  const page = new URL(event.source?.url ?? self.registration.scope);
  const moduleId = page.pathname.startsWith(SCOPE) ? page.pathname.slice(SCOPE.length).split('/')[0] : '';
  const paths = [...PRECACHE.shared, ...(PRECACHE.modules[moduleId] ?? [])];
  precacheJob = precacheJob.then(() => precache(paths)).catch(() => {});
  event.waitUntil(precacheJob);
});

async function precache(paths) {
  const cache = await caches.open(CACHE);
  const queue = [];
  for (const path of paths) {
    if (!(await cache.match(abs(path)))) queue.push(abs(path));
  }
  // Dvě stahování souběžně – šetrné ke sdílené Wi-Fi s mnoha tablety.
  const worker = async () => {
    while (queue.length) {
      const url = queue.shift();
      try {
        const response = await fetch(url, { cache: 'no-cache' });
        if (response.ok && !response.redirected) await cache.put(url, response);
      } catch {
        /* Bez připojení nic nestahujeme. */
      }
    }
  };
  await Promise.all([worker(), worker()]);
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(SCOPE) || url.pathname === abs('sw.js')) return;

  if (request.mode === 'navigate' || request.destination === 'document') {
    navigate(event, url);
  } else if (url.pathname.startsWith(abs('_astro/')) || /\.(woff2|webp|png|svg|ico|webmanifest)$/.test(url.pathname)) {
    event.respondWith(fromCacheFirst(event, url));
  } else if (url.pathname.endsWith('/')) {
    // Stránka načítaná předem (další krok): stačí uložená kopie, jinak síť.
    event.respondWith(caches.open(CACHE).then((cache) => cache.match(keyOf(url))).then((cached) => cached || fetch(request)));
  }
});

async function fromCacheFirst(event, url) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(keyOf(url));
  if (cached) return cached;
  const response = await fetch(event.request);
  if (response.ok && response.type === 'basic') event.waitUntil(cache.put(keyOf(url), response.clone()));
  return response;
}

function navigate(event, url) {
  const key = keyOf(url);
  // Odpověď ze sítě se hned zkopíruje do mezipaměti (i když už mezitím posloužila uložená kopie).
  const attempt = fetch(event.request).then((response) => {
    const html = (response.headers.get('content-type') || '').includes('text/html');
    let stored = Promise.resolve();
    if (response.ok && response.type === 'basic' && !response.redirected && html) {
      const copy = response.clone(); // kopie hned, dřív než stránka začne číst tělo odpovědi
      stored = caches.open(CACHE).then((cache) => cache.put(key, copy));
    }
    return { response, stored };
  });
  event.waitUntil(attempt.then(({ stored }) => stored).catch(() => {}));
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(key);
      try {
        if (!cached) return (await attempt).response;
        const winner = await Promise.race([attempt.then(({ response }) => response), sleep(TIMEOUT).then(() => null)]);
        // Pomalá síť nebo chyba serveru → raději uložená kopie.
        return winner && winner.status < 500 ? winner : cached;
      } catch {
        return (
          cached ??
          (await cache.match(abs('offline/'))) ??
          new Response(OFFLINE_HTML, { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
        );
      }
    })(),
  );
}
