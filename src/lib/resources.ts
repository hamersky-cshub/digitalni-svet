import type { CollectionEntry } from 'astro:content';
import type { ResourceType } from '../content.config';
import { withBase } from './url';

export const TYPE_LABELS: Record<ResourceType, string> = {
  pdf: 'Dokument PDF',
  prezentace: 'Prezentace',
  video: 'Video',
  odkaz: 'Odkaz na jiný web',
  navod: 'Návod na tomto webu',
};

export const TYPE_ICONS: Record<ResourceType, string> = {
  pdf: '📄',
  prezentace: '🖥️',
  video: '▶️',
  odkaz: '🔗',
  navod: '📝',
};

export interface ResourceAction {
  href: string;
  label: string;
  external: boolean;
  download: boolean;
}

/** Vrátí hlavní akci materiálu: stažení souboru, otevření odkazu, nebo přečtení návodu. */
export function resourceAction(resource: CollectionEntry<'resources'>): ResourceAction {
  const { file, url, type, fileSize } = resource.data;
  const size = fileSize ? ` (${fileSize})` : '';

  if (file) {
    const verb = type === 'video' ? 'Stáhnout video' : type === 'prezentace' ? 'Stáhnout prezentaci' : 'Stáhnout PDF';
    return { href: withBase(file), label: `${verb}${size}`, external: false, download: true };
  }
  if (url) {
    const label = type === 'video' ? 'Přehrát video na jiném webu' : 'Otevřít na jiném webu';
    return { href: url, label, external: true, download: false };
  }
  return { href: detailHref(resource), label: 'Přečíst návod', external: false, download: false };
}

export function detailHref(resource: CollectionEntry<'resources'>): string {
  return withBase(`materialy/${resource.id}/`);
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
}
