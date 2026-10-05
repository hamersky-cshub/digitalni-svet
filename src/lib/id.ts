/**
 * Stabilní ID odvozené z obsahu (FNV-1a). Na rozdíl od Math.random() dává
 * stejný obsah při každém sestavení stejné HTML – stránky se pak lépe ukládají
 * do mezipaměti a offline režim nemusí zbytečně stahovat beze změny.
 */
export function stableId(prefix: string, value: unknown): string {
  const text = JSON.stringify(value) ?? '';
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `${prefix}-${hash.toString(36)}`;
}
