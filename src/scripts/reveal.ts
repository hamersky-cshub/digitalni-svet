/**
 * Posune stránku tak, aby byl vidět prvek (nebo úsek od „start“ po „end“) –
 * např. zpětná vazba a tlačítko „Další“ po volbě odpovědi. Začátek má přednost,
 * aby nikdy nezmizel nad horním okrajem. Respektuje nastavení „omezit pohyb“.
 */
export function reveal(start: Element, end: Element = start, margin = 16): void {
  const top = start.getBoundingClientRect().top;
  const bottom = end.getBoundingClientRect().bottom;
  const viewport = window.innerHeight;
  let delta = 0;
  if (top < margin) delta = top - margin;
  else if (bottom > viewport - margin) delta = Math.min(bottom - viewport + margin, top - margin);
  if (delta) {
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollBy({ top: delta, behavior: smooth ? 'smooth' : 'auto' });
  }
}
