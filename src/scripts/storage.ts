/*
 * Jediná místa, kde web něco ukládá – a to jen v prohlížeči tohoto zařízení.
 * Nic se nikam neodesílá. Ukládá se:
 *   - poslední navštívený krok a navštívené zastávky každého workshopu,
 *   - zda je zapnutý režim lektora.
 * Velikost písma ukládá src/scripts/site.ts pod stejným prefixem.
 * Odpovědi z aktivit se neukládají nikdy.
 */

const PREFIX = 'dspk:';

export interface Position {
  href: string;
  label: string;
}

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
  getPosition: (workshop: string) => read<Position>(`${workshop}:position`),
  getVisited: (workshop: string) => read<number[]>(`${workshop}:visited`) ?? [],
  save(workshop: string, stop: number, position: Position) {
    write(`${workshop}:position`, position);
    const visited = new Set(progress.getVisited(workshop));
    visited.add(stop);
    write(`${workshop}:visited`, [...visited].sort((a, b) => a - b));
  },
  reset(workshop: string) {
    remove(`${workshop}:position`);
    remove(`${workshop}:visited`);
  },
};

export const lecturerMode = {
  isOn: () => read<boolean>('lecturer') === true,
  set(on: boolean) {
    if (on) write('lecturer', true);
    else remove('lecturer');
    document.dispatchEvent(new CustomEvent('lecturer-mode', { detail: on }));
  },
};
