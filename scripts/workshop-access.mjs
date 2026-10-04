import { readFileSync } from 'node:fs';
import { readdir, rm, writeFile } from 'node:fs/promises';

const settingsUrl = new URL('../workshop-access.json', import.meta.url);

export function readAccess() {
  const access = JSON.parse(readFileSync(settingsUrl, 'utf8'));
  if (!access || typeof access !== 'object' || Array.isArray(access)) throw new Error('workshop-access.json musí obsahovat objekt s názvy modulů.');
  for (const [id, enabled] of Object.entries(access)) {
    if (!/^[a-z0-9-]+$/.test(id) || typeof enabled !== 'boolean') throw new Error(`Neplatné nastavení modulu ${id}: použijte true nebo false.`);
  }
  return access;
}

/** Omit locked downloads from the published site and refresh offline access. */
/** @returns {import('astro').AstroIntegration} */
export default function workshopAccess() {
  return {
    name: 'workshop-access',
    hooks: {
      'astro:config:setup': () => { readAccess(); },
      'astro:build:done': async ({ dir }) => {
        const access = readAccess();
        const downloads = new URL('soubory/', dir);
        const entries = await readdir(downloads, { withFileTypes: true }).catch(error => {
          if (error.code === 'ENOENT') return [];
          throw error;
        });
        for (const entry of entries) {
          if (entry.isDirectory() && access[entry.name] !== true) {
            await rm(new URL(`${entry.name}/`, downloads), { recursive: true, force: true });
          }
        }
        const worker = readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8');
        await writeFile(new URL('sw.js', dir), worker.replace('const WORKSHOP_ACCESS = {};', `const WORKSHOP_ACCESS = ${JSON.stringify(access)};`));
      },
    },
  };
}

/** Also block public PDFs in the local development server. */
/** @returns {import('vite').Plugin} */
export function workshopAccessDev() {
  return {
    name: 'workshop-access-dev',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
        const match = pathname.match(/\/soubory\/([a-z0-9-]+)(?:\/|$)/);
        if (match && readAccess()[match[1]] !== true) {
          response.statusCode = 404;
          response.end('Tento modul zatím není dostupný.');
          return;
        }
        next();
      });
    },
  };
}
