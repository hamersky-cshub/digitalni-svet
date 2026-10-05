import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { ICON_NAMES, type IconName } from './lib/icons';
import { PERSONAS } from './lib/personas';

/*
 * Pravidla pro obsah webu. Při sestavení se každý soubor zkontroluje;
 * když něco chybí nebo je napsané špatně, sestavení skončí srozumitelnou chybou.
 *
 * V textech lze používat:
 *   **tučně**             → zvýrazněný text
 *   {{adresa.test/x}}     → ukázková (neklikací) internetová adresa v simulacích
 */

// ---------------------------------------------------------------------------
// Společné části
// ---------------------------------------------------------------------------

/** Tón zpětné vazby: ✓ vhodná možnost, i k zamyšlení, ⚠ riziko. Vždy se zobrazí i textem. */
export const TONES = ['ok', 'info', 'risk'] as const;
const tone = z.enum(TONES);

const lecturerNote = z.object({
  /** Doporučený čas, např. "15 minut" (z časů zastávek se počítá délka workshopu). */
  time: z
    .string()
    .regex(/^\d+\s*minut/, 'Čas zapište jako „15 minut“.')
    .optional(),
  /** Cíl aktivity / zastávky. */
  goal: z.string().optional(),
  /** Otázka do společné diskuse. */
  discussion: z.string().optional(),
  /** Jak přejít k dalšímu tématu. */
  transition: z.string().optional(),
  /** Cokoli dalšího. */
  tips: z.array(z.string()).optional(),
});

/** Simulovaná zpráva (SMS, e-mail, chat, telefonát, oznámení v telefonu, vyskakovací okno na webu). */
export const MEDIA = ['sms', 'email', 'chat', 'call', 'notification', 'popup'] as const;
const message = z.object({
  medium: z.enum(MEDIA),
  sender: z.string(),
  subject: z.string().optional(),
  time: z.string().optional(),
  lines: z.array(z.string()).min(1),
});

const optionId = z.string().regex(/^[a-z0-9-]+$/, 'Id možnosti smí obsahovat jen malá písmena bez diakritiky, číslice a pomlčky.');

// ---------------------------------------------------------------------------
// Aktivity
// ---------------------------------------------------------------------------

/** Několik situací se stejnými možnostmi (např. Ano / Ne / Nejsem si jistý/á). */
const choicesActivity = z
  .object({
    type: z.literal('choices'),
    /** Otázka zobrazená u každé situace. */
    question: z.string(),
    /** Jak se jmenuje jedna položka v počítadle: "Situace 2 z 6". */
    itemLabel: z.string().default('Situace'),
    options: z.array(z.object({ id: optionId, label: z.string() })).min(2).max(6),
    items: z
      .array(
        z.object({
          text: z.string().optional(),
          message: message.optional(),
          /** Postava ze situace (avatar vedle textu), např. marie. */
          persona: z.enum(PERSONAS).optional(),
          /** Možnosti, které jsou vhodné (zobrazí se ✓). Ostatní dostanou „K zamyšlení“. */
          recommended: z.array(optionId).optional(),
          /** Možnosti, které jsou riskantní (zobrazí se „Pozor, riziko“), např. podvod označený jako „V pořádku“. */
          avoid: z.array(optionId).optional(),
          /** Vysvětlení zobrazené po jakékoli volbě. */
          explanation: z.string(),
          /** Volitelná odpověď na konkrétní volbu (zobrazí se před vysvětlením). */
          responses: z.record(optionId, z.object({ tone, text: z.string() })).optional(),
        }),
      )
      .min(1),
  })
  .superRefine((a, ctx) => {
    const ids = new Set(a.options.map((o) => o.id));
    a.items.forEach((item, i) => {
      if (!item.text && !item.message) {
        ctx.addIssue({ code: 'custom', path: ['items', i], message: 'Situace musí mít "text" nebo "message".' });
      }
      for (const id of [...(item.recommended ?? []), ...(item.avoid ?? []), ...Object.keys(item.responses ?? {})]) {
        if (!ids.has(id)) {
          ctx.addIssue({ code: 'custom', path: ['items', i], message: `Možnost "${id}" není uvedena v "options".` });
        }
      }
      for (const id of item.avoid ?? []) {
        if (item.recommended?.includes(id)) {
          ctx.addIssue({ code: 'custom', path: ['items', i, 'avoid'], message: `Možnost "${id}" nemůže být zároveň v "recommended" i v "avoid".` });
        }
      }
    });
  });

/** Modelové situace, každá s vlastními možnostmi a zpětnou vazbou. */
const scenariosActivity = z.object({
  type: z.literal('scenarios'),
  itemLabel: z.string().default('Situace'),
  items: z
    .array(
      z
        .object({
          text: z.string().optional(),
          message: message.optional(),
          /** Postava ze situace (avatar vedle textu), např. marie. */
          persona: z.enum(PERSONAS).optional(),
          question: z.string(),
          options: z.array(z.object({ label: z.string(), tone, feedback: z.string() })).min(2).max(5),
          /** Shrnutí zobrazené po jakékoli volbě. */
          lesson: z.string().optional(),
        })
        .refine((s) => s.text || s.message, { message: 'Situace musí mít "text" nebo "message".' }),
    )
    .min(1),
});

/** Ilustrace s místy, na která lze klepnout. */
export const SCENES = ['dovolena'] as const;
const hotspotsActivity = z.object({
  type: z.literal('hotspots'),
  scene: z.enum(SCENES),
  instruction: z.string(),
  /** Popis obrázku pro čtečky obrazovky. */
  alt: z.string(),
  spots: z
    .array(
      z.object({
        /** Poloha v procentech šířky a výšky obrázku. */
        x: z.number().min(0).max(100),
        y: z.number().min(0).max(100),
        label: z.string(),
        text: z.string(),
      }),
    )
    .min(1),
});

/** Zpráva, ve které se hledají varovné signály. V textu se označí [[text|id]]. */
const signalsActivity = z
  .object({
    type: z.literal('signals'),
    instruction: z.string(),
    medium: z.enum(['sms', 'email', 'chat']),
    /** Odesílatel; může obsahovat [[…|id]]. */
    sender: z.string(),
    subject: z.string().optional(),
    time: z.string().optional(),
    /** Odstavce zprávy; podezřelá místa se označí [[text|id]]. */
    body: z.array(z.string()).min(1),
    attachment: z.string().optional(),
    signals: z.record(optionId, z.object({ label: z.string(), text: z.string() })),
    /** Poznámka zobrazená pod zprávou. */
    note: z.string().optional(),
  })
  .superRefine((a, ctx) => {
    const all = [a.sender, a.subject ?? '', a.attachment ?? '', ...a.body].join('\n');
    const used = new Set([...all.matchAll(/\[\[[^|\]]+\|([^\]]+)\]\]/g)].map((m) => m[1]));
    for (const id of used) {
      if (!a.signals[id]) ctx.addIssue({ code: 'custom', path: ['signals'], message: `Signál "${id}" je v textu, ale chybí v "signals".` });
    }
    for (const id of Object.keys(a.signals)) {
      if (!used.has(id)) ctx.addIssue({ code: 'custom', path: ['signals', id], message: `Signál "${id}" není nikde v textu označen [[…|${id}]].` });
    }
  });

const guide = z.object({
  intro: z.string().optional(),
  steps: z.array(z.object({ text: z.string(), question: z.string().optional() })).min(1),
  outro: z.string().optional(),
});

/** Výběr zařízení (Android / Apple / nejsem si jistý) a návod krok za krokem. */
const deviceActivity = z.object({
  type: z.literal('device'),
  question: z.string(),
  android: guide,
  apple: guide,
  unsure: guide,
});

/** Návod krok za krokem (praktický úkol na vlastním zařízení), bez výběru zařízení. */
const guideActivity = z.object({
  type: z.literal('guide'),
  intro: z.string().optional(),
  steps: z.array(z.object({ text: z.string(), question: z.string().optional() })).min(1),
  outro: z.string().optional(),
});

/** Otázka k zamyšlení. Nic se nikam nezapisuje ani neodesílá. */
const reflectionActivity = z.object({
  type: z.literal('reflection'),
  question: z.string(),
  hint: z.string().optional(),
  ideas: z.array(z.string()).optional(),
});

/** Skládání modelové heslové fráze z náhodných slov (jen v prohlížeči). */
const passphraseActivity = z.object({
  type: z.literal('passphrase'),
  warning: z.string(),
  words: z.array(z.string()).min(12),
  count: z.number().int().min(3).max(6).default(4),
  explanation: z.string(),
});

/** Kostková metoda s virtuálními kostkami: dvě kostky vyberou slovo z ukázkové tabulky 6 × 6. */
const diceActivity = z.object({
  type: z.literal('dice'),
  warning: z.string(),
  /** Přesně 36 slov v pořadí 1-1, 1-2 … 1-6, 2-1 … 6-6. */
  words: z.array(z.string()).length(36),
  count: z.number().int().min(3).max(6).default(4),
  explanation: z.string(),
});

/** Proklikání nastavení účtu nanečisto (např. kde najít dvoufázové ověření). */
const settingsActivity = z.object({
  type: z.literal('settings'),
  /** Úkol, např. „Najděte, kde se zapíná dvoufázové ověření.“ */
  task: z.string(),
  screens: z
    .array(
      z
        .object({
          title: z.string(),
          items: z.array(z.string()).min(2).max(6),
          /** Položka, na kterou se má klepnout (musí být v "items"). */
          correct: z.string(),
          /** Nápověda po klepnutí na jinou položku. */
          hint: z.string(),
        })
        .refine((s) => s.items.includes(s.correct), { message: '"correct" musí být jedna z položek v "items".' }),
    )
    .min(1),
  final: z.object({ title: z.string(), label: z.string(), status: z.string(), action: z.string(), text: z.string() }),
});

/** Ukázka, co se stane, když je jedno heslo všude. */
const keyReuseActivity = z
  .object({
    type: z.literal('keyReuse'),
    services: z.array(z.object({ name: z.string(), icon: z.string() })).min(3).max(6),
    /** Pořadí (od 0) služby, ze které heslo unikne. */
    leaked: z.number().int().min(0),
    question: z.string(),
    sameKey: z.object({ label: z.string(), result: z.string() }),
    uniqueKeys: z.object({ label: z.string(), result: z.string() }),
  })
  .refine((a) => a.leaked < a.services.length, { message: '"leaked" musí ukazovat na existující službu.' });

/** Simulace přihlášení s druhým ověřením v telefonu. */
const loginActivity = z.object({
  type: z.literal('login'),
  service: z.string(),
  password: z.string(),
  request: z.string(),
  done: z.string(),
  denied: z.string(),
});

/** Shrnutí – pravidla k zapamatování. */
const rulesActivity = z.object({
  type: z.literal('rules'),
  title: z.string().optional(),
  items: z.array(z.object({ key: z.string().optional(), title: z.string(), text: z.string().optional() })).min(1),
});

const activity = z.discriminatedUnion('type', [
  choicesActivity,
  scenariosActivity,
  hotspotsActivity,
  signalsActivity,
  deviceActivity,
  guideActivity,
  reflectionActivity,
  passphraseActivity,
  diceActivity,
  settingsActivity,
  keyReuseActivity,
  loginActivity,
  rulesActivity,
]);
export type Activity = z.infer<typeof activity>;

// ---------------------------------------------------------------------------
// Kolekce
// ---------------------------------------------------------------------------

/** Druh obrazovky – říká účastníkovi, co se teď děje. */
export const SCREEN_KINDS = ['vyklad', 'diskuse', 'aktivita', 'prakticky', 'reflexe', 'shrnuti'] as const;
export type ScreenKind = (typeof SCREEN_KINDS)[number];

/** Ilustrace, které lze vložit k obrazovce (src/components/illustrations/). */
export const ILLUSTRATIONS = [
  'lista-cookies',
  'svitilna-poloha',
  'foto-bezpecna',
  'foto-prozrazujici',
  'qr-nalepka',
  'wifi-site',
  'stopy-ve-snehu',
  'sledovani-na-webu',
  'komu-to-rikam',
  'hromadne-zpravy',
  'za-koho-se-vydavaji',
  'rychle-pomale',
  'hesla-v-case',
  'kradez-hesel',
  'jeden-klic',
  'spravce-hesel',
  'dva-zamky',
  'pristupovy-klic',
] as const;
export type IllustrationName = (typeof ILLUSTRATIONS)[number];

const figure = z.object({
  illustration: z.enum(ILLUSTRATIONS),
  /** Popis obrázku pro čtečky obrazovky. */
  alt: z.string(),
  /** Popisek pod obrázkem (může obsahovat **tučně**). */
  caption: z.string().optional(),
});

const screen = z.object({
  kind: z.enum(SCREEN_KINDS).default('vyklad'),
  title: z.string(),
  text: z.array(z.string()).default([]),
  /** Postava, o které text obrazovky mluví (avatar vedle textu), např. jana. */
  persona: z.enum(PERSONAS).optional(),
  points: z.array(z.string()).optional(),
  /** Nejvýš dva obrázky; zobrazí se pod textem, v plné šířce pod sebou. */
  figures: z.array(figure).max(2).optional(),
  activity: activity.optional(),
  lecturer: lecturerNote.optional(),
});
export type Screen = z.infer<typeof screen>;

const workshops = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/workshops' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    /** Krátký text na kartě na úvodní stránce. */
    cardText: z.string(),
    /** Anotace workshopu (odstavce). */
    annotation: z.array(z.string()).min(1),
    order: z.number().int(),
    icon: z.string().optional(),
    /** Délka workshopu, např. "přibližně 90 minut". Když chybí, sečtou se časy zastávek (lecturer.time). */
    duration: z.string().optional(),
    /** Tahák na doma (/<téma>/tahak/): řádky a políčka k vyplnění rukou. Pravidla se doplní z aktivit „rules“. */
    takeaway: z
      .object({
        /** Nadpis části k vyplnění, např. „Moje důležitá čísla“. */
        title: z.string(),
        /** Řádky: popisek a pevná hodnota, nebo prázdné místo k dopsání rukou. */
        numbers: z.array(z.object({ label: z.string(), value: z.string().optional() })).optional(),
        /** Políčka k odškrtnutí. */
        checklist: z.array(z.string()).optional(),
        /** Upozornění pod částí k vyplnění (zvýrazněné). */
        warning: z.string().optional(),
      })
      .optional(),
  }),
});

const stops = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/stops' }),
  schema: z.object({
    workshop: reference('workshops'),
    /** Pořadí zastávky ve workshopu (nižší číslo = dříve). */
    order: z.number().int(),
    title: z.string(),
    /** Jedna věta na kartu zastávky. */
    summary: z.string(),
    /** Ikona na kartě zastávky (název ze sady v src/lib/icons.ts, např. camera). */
    icon: z.enum(ICON_NAMES as [IconName, ...IconName[]]).optional(),
    lecturer: lecturerNote.optional(),
    screens: z.array(screen).min(1),
  }),
});

export const RESOURCE_TYPES = ['pdf', 'prezentace', 'video', 'odkaz', 'navod'] as const;
export type ResourceType = (typeof RESOURCE_TYPES)[number];

const resources = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/resources' }),
  schema: z
    .object({
      title: z.string(),
      description: z.string(),
      workshop: reference('workshops'),
      type: z.enum(RESOURCE_TYPES),
      /** Soubor uložený v repozitáři, cesta relativně ke složce public/, např. "soubory/digitalni-klice/hesla.pdf". */
      file: z
        .string()
        .regex(/^soubory\//, 'Soubor musí ležet ve složce public/soubory/')
        .refine((file) => existsSync(join(process.cwd(), 'public', file)), {
          message: 'Soubor nebyl nalezen. Zkontrolujte, že leží ve složce public/ a že cesta je správně napsaná.',
        })
        .optional(),
      /** Odkaz na materiál na jiném webu. */
      url: z.url().optional(),
      /** Velikost souboru pro zobrazení u tlačítka, např. "1,2 MB". */
      fileSize: z.string().optional(),
      /** Kdo materiál vytvořil, např. "NÚKIB" nebo "Policie ČR". */
      source: z.string().optional(),
      /** Datum poslední aktualizace materiálu. */
      updated: z.coerce.date().optional(),
    })
    .refine((r) => !(r.file && r.url), {
      message: 'Materiál může mít buď "file", nebo "url", ne obojí.',
    })
    .refine((r) => r.type === 'navod' || Boolean(r.file || r.url), {
      message: 'Materiál musí mít "file" nebo "url" (výjimkou je typ "navod", jehož obsahem je text souboru).',
    }),
});

/** Slovníček pojmů (src/content/glossary.yaml, klíčem je id pojmu). */
const glossary = defineCollection({
  loader: file('src/content/glossary.yaml'),
  schema: z.object({
    term: z.string(),
    /** 1–2 věty bez žargonu (může obsahovat **tučně**). */
    definition: z.string(),
    /** Téma, kde se pojem poprvé vysvětluje. */
    workshop: reference('workshops'),
  }),
});

export const collections = { workshops, stops, resources, glossary };
