import type { Activity, TONES } from '../content.config';

type Tone = (typeof TONES)[number];
type ChoicesActivity = Extract<Activity, { type: 'choices' }>;
export type ChoiceItem = ChoicesActivity['items'][number];

/**
 * Tón zpětné vazby pro možnost v aktivitě „choices“:
 * vlastní odpověď → její tón, recommended → ✓ vhodné, avoid → ⚠ riziko, jinak „K zamyšlení“.
 * Používá ji aktivita i stránka pro lektora (klíč odpovědí), aby se nerozcházely.
 */
export function choiceTone(item: ChoiceItem, id: string): Tone {
  const response = item.responses?.[id];
  if (response) return response.tone;
  if (item.recommended?.includes(id)) return 'ok';
  if (item.avoid?.includes(id)) return 'risk';
  return 'info';
}

type SignalsActivity = Extract<Activity, { type: 'signals' }>;

/** Id varovných signálů v pořadí, v jakém se objevují ve zprávě. */
export function signalOrder(activity: Pick<SignalsActivity, 'sender' | 'subject' | 'body' | 'attachment'>): string[] {
  const text = [activity.sender, activity.subject ?? '', ...activity.body, activity.attachment ?? ''].join('\n');
  return [...new Set([...text.matchAll(/\[\[[^|\]]+\|([^\]]+)\]\]/g)].map((m) => m[1]))];
}
