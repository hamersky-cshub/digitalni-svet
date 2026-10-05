/*
 * Jednoduché formátování textů z obsahu (YAML):
 *   **tučně**          → <strong>
 *   {{adresa.test}}    → ukázková neklikací adresa (v simulacích podvodů)
 *   [[text|id]]        → označené místo ve zprávě (aktivita „Najděte varovné signály“)
 *   [text](https://…)  → skutečný odkaz na jiný web (otevře se v novém okně); jen https
 *   ((pojem|id))       → pojem ze slovníčku (src/content/glossary.yaml); bez „|id“ se id odvodí z textu
 * Vše ostatní se escapuje, takže v obsahu nelze omylem vložit HTML.
 */

import { iconForEmoji, iconSvg } from './icons';
import { withBase } from './url';

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Emoji (i se spojovníky a variantami). Čtečky obrazovky by je četly nahlas, proto se skrývají. */
const EMOJI = /\p{Extended_Pictographic}(?:\uFE0F|\p{Emoji_Modifier}|\u200D\p{Extended_Pictographic}\uFE0F?)*/gu;

/** Začíná text emoji? (Body seznamu s emoji nemají navíc odrážku.) */
export function startsWithEmoji(text: string): boolean {
  return /^\s*\p{Extended_Pictographic}/u.test(text);
}

/** Pojem ze slovníčku: ((cookies)) nebo ((dvoufázové ověření|dvoufazove-overeni)). */
const TERM = /\(\(([^()|]+?)(?:\|([a-z0-9-]+))?\)\)/g;

/** Id z textu: „Otisk prohlížeče“ → „otisk-prohlizece“. */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Id všech pojmů ze slovníčku použitých v textu (nebo v JSON celé obrazovky). */
export function termIds(text: string): string[] {
  return [...new Set([...text.matchAll(TERM)].map((m) => m[2] ?? slugify(m[1])))];
}

export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

export function formatText(text: string): string {
  return escapeHtml(text)
    .replace(EMOJI, (emoji) => {
      // Emoji se sadovou ikonou se vykreslí jako ikona (stejně na všech zařízeních), ostatní zůstanou.
      const icon = iconForEmoji(emoji);
      return icon ? `<span class="emoji emoji--icon" aria-hidden="true">${iconSvg(icon)}</span>` : `<span class="emoji" aria-hidden="true">${emoji}</span>`;
    })
    .replace(TERM, (_, inner: string, id?: string) => {
      // Bez JavaScriptu odkaz do slovníčku, s ním se vysvětlení rozbalí přímo v textu (src/scripts/terms.ts).
      const key = id ?? slugify(inner);
      return `<a class="term" href="${withBase('slovnicek/')}#${key}" data-term="${key}">${inner}</a>`;
    })
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\{\{(.+?)\}\}/g, '<span class="fake-link">$1<span class="visually-hidden"> (ukázková adresa, nikam nevede)</span></span>')
    .replace(
      /\[([^[\]]+)\]\((https:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1<span aria-hidden="true"> ↗</span><span class="visually-hidden"> (otevře se jiný web v novém okně)</span></a>',
    );
}

/** Jako formatText, ale navíc převede [[text|id]] na tlačítka varovných signálů (popisek neprozradí odpověď). */
export function formatSignals(text: string): string {
  return formatText(text).replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, (_, inner: string, id: string) => {
    return `<button type="button" class="signal" data-spot="${id}" aria-pressed="false">${inner}<span class="visually-hidden"> (označené místo)</span></button>`;
  });
}

/** Text bez značek (např. pro title stránky). */
export function plainText(text: string): string {
  return text
    .replace(TERM, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\{\{(.+?)\}\}/g, '$1')
    .replace(/\[\[([^|\]]+)\|[^\]]+\]\]/g, '$1')
    .replace(/\[([^[\]]+)\]\(https:\/\/[^\s)]+\)/g, '$1')
    .replace(EMOJI, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/** Česká množná čísla: plural(3, ['zastávka', 'zastávky', 'zastávek']) → 'zastávky'. */
export function plural(n: number, forms: [string, string, string]): string {
  if (n === 1) return forms[0];
  if (n >= 2 && n <= 4) return forms[1];
  return forms[2];
}

const ORDINALS = ['První', 'Druhý', 'Třetí', 'Čtvrtý', 'Pátý', 'Šestý', 'Sedmý', 'Osmý', 'Devátý', 'Desátý'];

/** Řadová číslovka slovem v mužském rodě: ordinalWord(2) → 'Druhý' (nad 10 číslicí: '11.'). */
export function ordinalWord(n: number): string {
  return ORDINALS[n - 1] ?? `${n}.`;
}

/** Předložka před číslovkou: „ze 3“, „z 5“ (ze dvou, tří, čtyř, šesti, sedmi). */
export function zOrZe(n: number): 'z' | 'ze' {
  return [2, 3, 4, 6, 7].includes(n) ? 'ze' : 'z';
}
