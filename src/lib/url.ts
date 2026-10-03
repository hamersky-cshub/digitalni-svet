/**
 * Přidá k cestě základní adresu webu (BASE_URL), aby odkazy fungovaly
 * i na adrese https://hamersky-cshub.github.io/digitalni-kompas/.
 *
 * withBase('temata/autentizace/') → '/digitalni-kompas/temata/autentizace/'
 */
export function withBase(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const clean = path.replace(/^\/+/, '');
  return clean ? `${base}/${clean}` : `${base}/`;
}

/** Porovná aktuální cestu s cestou odkazu (pro zvýraznění v menu). */
export function isCurrent(pathname: string, path: string, exact = false): boolean {
  const target = withBase(path);
  const current = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return exact ? current === target : current.startsWith(target);
}
