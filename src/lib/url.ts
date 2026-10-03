/**
 * Přidá k cestě základní adresu webu (BASE_URL), aby odkazy fungovaly
 * i na adrese https://hamersky-cshub.github.io/digitalni-svet/.
 *
 * withBase('digitalni-stopa/') → '/digitalni-svet/digitalni-stopa/'
 */
export function withBase(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const clean = path.replace(/^\/+/, '');
  return clean ? `${base}/${clean}` : `${base}/`;
}

/** Adresa přehledu workshopu. */
export function workshopHref(workshopId: string): string {
  return withBase(`${workshopId}/`);
}

/** Adresa kroku: 1. krok zastávky je přímo na adrese zastávky. Čísla začínají od 1. */
export function stepHref(workshopId: string, stopNumber: number, stepNumber = 1): string {
  const stop = `${workshopId}/zastavka-${stopNumber}/`;
  return withBase(stepNumber === 1 ? stop : `${stop}krok-${stepNumber}/`);
}
