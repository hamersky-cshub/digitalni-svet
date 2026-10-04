/*
 * Jednoduché formátování textů z obsahu (YAML):
 *   **tučně**          → <strong>
 *   {{adresa.test}}    → ukázková neklikací adresa (v simulacích podvodů)
 *   [[text|id]]        → označené místo ve zprávě (aktivita „Najděte varovné signály“)
 *   [text](https://…)  → skutečný odkaz na jiný web (otevře se v novém okně); jen https
 * Vše ostatní se escapuje, takže v obsahu nelze omylem vložit HTML.
 */

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

export function formatText(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\{\{(.+?)\}\}/g, '<span class="fake-link" title="Ukázková adresa – nikam nevede">$1</span>')
    .replace(
      /\[([^[\]]+)\]\((https:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1<span aria-hidden="true"> ↗</span><span class="visually-hidden"> (otevře se jiný web v novém okně)</span></a>',
    );
}

/** Jako formatText, ale navíc převede [[text|id]] na tlačítka varovných signálů. */
export function formatSignals(text: string, labels: Record<string, string>): string {
  return formatText(text).replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, (_, inner: string, id: string) => {
    const label = labels[id] ?? '';
    return `<button type="button" class="signal" data-spot="${id}" aria-pressed="false">${inner}<span class="visually-hidden"> (podezřelé místo: ${escapeHtml(label)})</span></button>`;
  });
}

/** Text bez značek (např. pro title stránky). */
export function plainText(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\{\{(.+?)\}\}/g, '$1')
    .replace(/\[\[([^|\]]+)\|[^\]]+\]\]/g, '$1')
    .replace(/\[([^[\]]+)\]\(https:\/\/[^\s)]+\)/g, '$1');
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
