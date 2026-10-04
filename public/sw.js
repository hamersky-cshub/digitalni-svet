/*
 * Offline režim „Digitální svět pod kontrolou“.
 * - Stránky (HTML): nejdřív síť, při výpadku uložená kopie → obsah je vždy aktuální, když je připojení.
 * - Styly, skripty a obrázky: nejdřív uložená kopie (jejich názvy se při změně mění).
 * - Přehled workshopu pošle seznam všech obrazovek; ty se stáhnou předem.
 * Neukládají se žádné údaje uživatele, jen veřejné stránky tohoto webu.
 */
// Build injects the settings; changing them also refreshes the offline cache.
const WORKSHOP_ACCESS = {};
const VERSION = 'v3-' + Object.entries(WORKSHOP_ACCESS).map(([id, enabled]) => `${id}-${enabled}`).join('_');
const CACHE = `dspk-${VERSION}`;
const SCOPE = new URL(self.registration.scope).pathname;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll([SCOPE])).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('dspk-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

function isAsset(url) {
  return url.pathname.startsWith(`${SCOPE}_astro/`) || /\.(svg|png|jpg|webp|woff2?)$/.test(url.pathname);
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.startsWith(SCOPE)) return;

  const segments = url.pathname.slice(SCOPE.length).split('/');
  const moduleId = segments[0] === 'soubory' ? segments[1] : segments[0];
  if (Object.hasOwn(WORKSHOP_ACCESS, moduleId) && WORKSHOP_ACCESS[moduleId] !== true) {
    event.respondWith(new Response('Tento modul zatím není dostupný.', { status: 404 }));
    return;
  }

  if (isAsset(url)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) caches.open(CACHE).then((cache) => cache.put(request, response.clone()));
            return response;
          }),
      ),
    );
    return;
  }

  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() =>
          caches.match(request, { ignoreSearch: true }).then(
            (cached) => cached || caches.match(SCOPE) || new Response('Jste offline.', { status: 503 }),
          ),
        ),
    );
  }
});

/* Předem stáhne obrazovky workshopu a soubory, které potřebují (styly, skripty). */
self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || data.type !== 'precache' || !Array.isArray(data.urls)) return;
  const urls = data.urls.filter((u) => typeof u === 'string' && u.startsWith(SCOPE)).slice(0, 200);

  event.waitUntil(
    caches.open(CACHE).then(async (cache) => {
      const assets = new Set(['AtkinsonHyperlegibleNext-Regular', 'AtkinsonHyperlegibleNext-Bold', 'Rubik-Regular', 'Rubik-Medium', 'Rubik-Bold'].map(name => `${SCOPE}fonts/${name}.woff2`));
      for (const url of urls) {
        try {
          const response = await fetch(url, { credentials: 'same-origin' });
          if (!response.ok) continue;
          const html = await response.clone().text();
          await cache.put(url, response);
          for (const match of html.matchAll(/(?:href|src)="([^"]+\/_astro\/[^"]+)"/g)) assets.add(match[1]);
        } catch {
          /* Bez připojení nic nestahujeme. */
        }
      }
      for (const asset of assets) {
        if (await cache.match(asset)) continue;
        try {
          const response = await fetch(asset);
          if (response.ok) await cache.put(asset, response);
        } catch {
          /* viz výše */
        }
      }
    }),
  );
});
