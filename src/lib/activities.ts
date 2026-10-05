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
