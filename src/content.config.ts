import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const RESOURCE_TYPES = ['pdf', 'prezentace', 'video', 'odkaz', 'navod'] as const;
export type ResourceType = (typeof RESOURCE_TYPES)[number];

const topics = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/topics' }),
  schema: z.object({
    title: z.string(),
    /** Jedna srozumitelná věta, zobrazí se na kartě tématu. */
    description: z.string(),
    /** Pořadí na úvodní stránce (nižší číslo = dříve). */
    order: z.number().int(),
    /** Volitelný emoji symbol zobrazený u tématu. */
    icon: z.string().optional(),
  }),
});

const resources = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/resources' }),
  schema: z
    .object({
      title: z.string(),
      description: z.string(),
      topic: reference('topics'),
      type: z.enum(RESOURCE_TYPES),
      /** Soubor uložený v repozitáři, cesta relativně ke složce public/, např. "soubory/autentizace/hesla.pdf". */
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

export const collections = { topics, resources };
