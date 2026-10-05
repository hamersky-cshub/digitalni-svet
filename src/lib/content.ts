import { getCollection, type CollectionEntry } from 'astro:content';
import type { Screen } from '../content.config';
import { isWorkshopUnlocked } from './access';
import { plural } from './text';
import { stepHref, workshopHref } from './url';

/** Adresy, které nesmí být použity jako id workshopu (kolidovaly by s jinými stránkami). */
const RESERVED_IDS = ['prakticke-ukoly', 'materialy', 'soubory', 'pro-lektory', 'o-projektu', '_astro', '404'];

export type Workshop = CollectionEntry<'workshops'>;
export type Stop = CollectionEntry<'stops'>;

export async function getWorkshops(): Promise<Workshop[]> {
  const workshops = await getCollection('workshops');
  for (const w of workshops) {
    if (RESERVED_IDS.includes(w.id)) {
      throw new Error(`Workshop nesmí mít název souboru "${w.id}.yaml" – tato adresa je vyhrazená. Přejmenujte soubor.`);
    }
  }
  return workshops.sort((a, b) => a.data.order - b.data.order);
}

/** Only these modules generate public pages, activities and resources. */
export async function getAvailableWorkshops(): Promise<Workshop[]> {
  return (await getWorkshops()).filter(workshop => isWorkshopUnlocked(workshop.id));
}

/** Zastávky workshopu seřazené podle pořadí. */
export async function getStops(workshopId: string): Promise<Stop[]> {
  const stops = await getCollection('stops', (s) => s.data.workshop.id === workshopId);
  return stops.sort((a, b) => a.data.order - b.data.order);
}

/** Počet minut z textu jako "15 minut" (bez čísla → 0). */
export function parseMinutes(time?: string): number {
  const match = time?.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

/** Délka workshopu: hodnota "duration" z obsahu, jinak součet doporučených časů zastávek. */
export function workshopDuration(workshop: Workshop, stops: Stop[]): string | undefined {
  if (workshop.data.duration) return workshop.data.duration;
  const minutes = stops.reduce((sum, stop) => sum + parseMinutes(stop.data.lecturer?.time), 0);
  return minutes > 0 ? `přibližně ${minutes} ${plural(minutes, ['minuta', 'minuty', 'minut'])}` : undefined;
}

export interface StepLink {
  href: string;
  label: string;
}

/** Jedna obrazovka workshopu se vším, co potřebuje šablona. */
export interface StepContext {
  workshop: Workshop;
  stop: Stop;
  screen: Screen;
  stopNumber: number;
  stopCount: number;
  stepNumber: number;
  stepCount: number;
  href: string;
  prev: StepLink;
  next: StepLink;
}

/** Projde všechny obrazovky workshopu za sebou a ke každé spočítá předchozí a další krok. */
export function buildSteps(workshop: Workshop, stops: Stop[]): StepContext[] {
  const flat = stops.flatMap((stop, si) =>
    stop.data.screens.map((screen, ki) => ({
      workshop,
      stop,
      screen,
      stopNumber: si + 1,
      stopCount: stops.length,
      stepNumber: ki + 1,
      stepCount: stop.data.screens.length,
      href: stepHref(workshop.id, si + 1, ki + 1),
    })),
  );
  const overview = workshopHref(workshop.id);

  return flat.map((step, i) => {
    const before = flat[i - 1];
    const after = flat[i + 1];
    const prev: StepLink = before
      ? { href: before.href, label: 'Zpět' }
      : { href: overview, label: 'Zpět na přehled workshopu' };
    let next: StepLink;
    if (!after) {
      next = { href: overview, label: 'Dokončit workshop' };
    } else if (after.stopNumber !== step.stopNumber) {
      next = { href: after.href, label: `Pokračovat na zastávku ${after.stopNumber}` };
    } else {
      next = { href: after.href, label: 'Pokračovat' };
    }
    return { ...step, prev, next };
  });
}
