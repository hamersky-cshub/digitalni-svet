/*
 * Jediná místa, kde web něco ukládá – a to jen v prohlížeči tohoto zařízení.
 * Nic se nikam neodesílá. Ukládá se:
 *   - které kroky workshopu účastník otevřel (podle toho se u zastávky ukáže „Navštíveno“).
 * Velikost písma ukládá src/scripts/site.ts pod stejným prefixem.
 * Odpovědi z aktivit se neukládají nikdy.
 */

const PREFIX = 'dspk:';

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* Úložiště může být zakázané (anonymní okno) – web funguje i bez něj. */
  }
}

function remove(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    /* viz výše */
  }
}

export const progress = {
  /** Otevřené kroky workshopu ve tvaru „zastávka-krok“, např. „2-3“. */
  getSeenSteps: (workshop: string) => read<string[]>(`${workshop}:seen`) ?? [],
  markStep(workshop: string, stop: number, step: number) {
    const seen = new Set(progress.getSeenSteps(workshop));
    seen.add(`${stop}-${step}`);
    write(`${workshop}:seen`, [...seen]);
  },
  /** Zastávka je prošlá, až účastník otevřel všechny její kroky. */
  isStopDone(workshop: string, stop: number, stepCount: number) {
    const seen = new Set(progress.getSeenSteps(workshop));
    return Array.from({ length: stepCount }, (_, i) => `${stop}-${i + 1}`).every((key) => seen.has(key));
  },
  reset(workshop: string) {
    remove(`${workshop}:seen`);
    // Starší verze webu ukládaly pozici a otevřené zastávky – smažeme je také.
    remove(`${workshop}:position`);
    remove(`${workshop}:visited`);
  },
};
