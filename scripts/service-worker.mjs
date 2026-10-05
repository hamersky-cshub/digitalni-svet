import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Soubory, které offline režim nikdy neukládá předem. */
const EXCLUDED_TOP = new Set(['pro-lektory', 'soubory']);
const EXCLUDED_FILES = new Set(['sw.js', '404.html']);

/** Cesta souboru v dist → adresa relativně k webu ('' = úvodní stránka, 'x/' = x/index.html). */
function toUrl(file) {
  if (file === 'index.html') return '';
  if (file.endsWith('/index.html')) return file.slice(0, -'index.html'.length);
  return file;
}

/**
 * Doplní do dist/sw.js seznam souborů pro offline režim a verzi odvozenou z jejich obsahu.
 * Stejný obsah dá stejnou verzi, takže tablety stahují znovu jen po skutečné změně webu.
 * @param {URL} distUrl složka sestaveného webu
 * @param {Record<string, boolean>} access nastavení z workshop-access.json
 */
export async function writeServiceWorker(distUrl, access) {
  const dist = fileURLToPath(distUrl);
  const swPath = join(dist, 'sw.js');
  const template = await readFile(swPath, 'utf8');
  const modules = Object.keys(access).filter((id) => access[id] === true);

  const files = (await readdir(dist, { recursive: true, withFileTypes: true }))
    .filter((entry) => entry.isFile())
    .map((entry) => relative(dist, join(entry.parentPath, entry.name)).split(sep).join('/'))
    .sort();

  /** @type {{ core: string[], shared: string[], modules: Record<string, string[]> }} */
  const precache = { core: [], shared: [], modules: Object.fromEntries(modules.map((id) => [id, []])) };
  const hash = createHash('sha256').update(template).update(JSON.stringify(access));
  let bytes = 0;

  for (const file of files) {
    const top = file.split('/')[0];
    if (EXCLUDED_FILES.has(file) || EXCLUDED_TOP.has(top)) continue;
    const content = await readFile(join(dist, file));
    hash.update(file).update(content);
    bytes += content.length;
    const url = toUrl(file);
    if (file === 'index.html' || ['offline', '_astro', 'fonts'].includes(top) || file === 'favicon.svg') {
      precache.core.push(url);
    } else if (modules.includes(top)) {
      precache.modules[top].push(url);
    } else {
      precache.shared.push(url);
    }
  }

  const version = hash.digest('hex').slice(0, 12);
  const replacements = [
    ["const VERSION = 'dev';", `const VERSION = '${version}';`],
    ['const PRECACHE = { core: [], shared: [], modules: {} };', `const PRECACHE = ${JSON.stringify(precache)};`],
  ];
  let worker = template;
  for (const [placeholder, value] of replacements) {
    if (!worker.includes(placeholder)) throw new Error(`Šablona public/sw.js neobsahuje „${placeholder}“ – offline režim by nefungoval.`);
    worker = worker.replace(placeholder, value);
  }
  await writeFile(swPath, worker);

  const count = precache.core.length + precache.shared.length + Object.values(precache.modules).flat().length;
  return { version, count, kilobytes: Math.round(bytes / 1024) };
}
