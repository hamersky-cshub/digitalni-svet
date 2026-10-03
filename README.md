# Digitální kompas

Web s materiály a návody k workshopům o bezpečnosti na internetu pro seniory.

🌐 **Adresa webu:** <https://hamersky-cshub.github.io/digitalni-kompas/>

Web je postavený na [Astro](https://astro.build) a na GitHub Pages se zveřejňuje
automaticky pomocí GitHub Actions po každé změně ve větvi `main`.

## Jak přidat nový materiál

Každý materiál je jeden soubor `.md` ve složce `src/content/resources/`.
Název souboru (bez `.md`) se stane adresou stránky, např.
`hesla-tahak.md` → `/materialy/hesla-tahak/`. Používejte malá písmena bez diakritiky
a místo mezer pomlčky.

### 1. Soubor uložený přímo na webu (PDF, prezentace)

1. Soubor nahrajte do složky `public/soubory/<téma>/`, např. `public/soubory/autentizace/hesla.pdf`.
2. Vytvořte `src/content/resources/hesla.md`:

```markdown
---
title: Tahák – jak vytvořit silné heslo
description: Jednostránkový tahák k vytištění.
topic: autentizace
type: pdf
file: soubory/autentizace/hesla.pdf
fileSize: 1,2 MB
source: Digitální kompas
updated: 2026-10-01
---
```

### 2. Odkaz na jiný web (článek, video na YouTube)

```markdown
---
title: Aktuální varování před podvody
description: Přehled nových typů podvodů na webu Policie ČR.
topic: socialni-inzenyrstvi
type: odkaz
url: https://www.policie.gov.cz/
source: Policie ČR
---
```

### 3. Návod přímo na webu

Typ `navod` nepotřebuje soubor ani odkaz – obsahem je text pod hlavičkou:

```markdown
---
title: Jak si zapnout dvoufázové ověření
description: Krok za krokem.
topic: autentizace
type: navod
---

1. Otevřete **Nastavení**.
2. ...
```

Text pod hlavičkou můžete přidat i k ostatním typům – zobrazí se na stránce materiálu.

### Přehled polí

| Pole          | Povinné            | Popis                                                                                   |
| ------------- | ------------------ | --------------------------------------------------------------------------------------- |
| `title`       | ano                | Název materiálu                                                                         |
| `description` | ano                | Krátký popis (1–2 věty)                                                                 |
| `topic`       | ano                | `digitalni-stopa`, `socialni-inzenyrstvi` nebo `autentizace`                            |
| `type`        | ano                | `pdf`, `prezentace`, `video`, `odkaz` nebo `navod`                                      |
| `file`        | buď `file`, nebo `url` | Cesta k souboru ve složce `public/`, musí začínat `soubory/`                        |
| `url`         | buď `file`, nebo `url` | Celá adresa jiného webu (`https://…`)                                               |
| `fileSize`    | ne                 | Velikost souboru zobrazená na tlačítku, např. `1,2 MB`                                  |
| `source`      | ne                 | Autor nebo zdroj, např. `NÚKIB`                                                         |
| `updated`     | ne                 | Datum aktualizace ve tvaru `RRRR-MM-DD`                                                 |

Při sestavení webu se vše automaticky kontroluje. Pokud chybí povinné pole, téma neexistuje
nebo soubor uvedený ve `file` nebyl nalezen, sestavení skončí chybou s popisem problému
(uvidíte ji v záložce **Actions** na GitHubu).

> **Ukázkové materiály:** Materiály, jejichž popis začíná „Ukázkový…“, jsou jen ukázky
> formátu. Nahraďte je skutečnými materiály nebo je smažte (včetně souborů v `public/soubory/`).

## Jak přidat nebo upravit téma

Témata jsou ve složce `src/content/topics/`. Každé téma má hlavičku a úvodní text:

```markdown
---
title: Autentizace
description: Hesla, PIN a dvoufázové ověření – jak dobře zamknout své účty.
order: 3        # pořadí na úvodní stránce
icon: 🔐        # nepovinné
---

Úvodní text tématu…
```

Název souboru je identifikátor tématu, který se používá v poli `topic` u materiálů.

## Úpravy přímo na GitHubu

Pro přidání materiálu nemusíte nic instalovat: na GitHubu otevřete složku
`src/content/resources/`, klikněte na **Add file → Create new file**, vložte šablonu výše
a uložte (**Commit changes**). Soubory PDF nahrajete přes **Add file → Upload files**
do složky `public/soubory/<téma>/`.

## Vývoj na vlastním počítači

Potřebujete [Node.js](https://nodejs.org) verze 22.12 nebo novější (doporučená verze je v `.nvmrc`).

```sh
npm install        # instalace (jen poprvé)
npm run dev        # vývojový server na http://localhost:4321/digitalni-kompas/
npm run check      # kontrola typů a obsahu
npm run build      # sestavení webu do složky dist/
npm run preview    # náhled sestaveného webu
```

## Struktura projektu

```
.github/workflows/deploy.yml   # sestavení a zveřejnění na GitHub Pages
public/soubory/                # soubory ke stažení (PDF, prezentace)
src/content/topics/            # témata
src/content/resources/         # materiály
src/content.config.ts          # pravidla pro obsah (povinná pole, typy)
src/components/                # části stránek (karty, filtr, drobečková navigace)
src/layouts/BaseLayout.astro   # společná hlavička, menu a patička
src/pages/                     # stránky webu
src/styles/global.css          # vzhled (barvy, písmo)
```

## Přístupnost

Web je navržen pro seniory: základní písmo 20 px, kontrast podle WCAG AAA, velké klikací
plochy (min. 48 px), vždy podtržené odkazy, výrazné zvýraznění při ovládání klávesnicí
a jednoduché menu se čtyřmi položkami. Filtr materiálů funguje i bez JavaScriptu
(zobrazí se všechny materiály).

## Jednorázové nastavení GitHub Pages

1. V repozitáři otevřete **Settings → Pages**.
2. V části **Build and deployment** nastavte **Source** na **GitHub Actions**.
3. Web se zveřejňuje z větve `main`. Po sloučení změn do `main` (nebo ručním spuštění
   workflow „Nasazení na GitHub Pages“ v záložce **Actions** nad větví `main`) bude web
   dostupný na adrese výše.

### Vlastní doména (volitelně)

V `astro.config.mjs` změňte `site` na novou adresu a `base` na `'/'`, přidejte soubor
`public/CNAME` s doménou a doménu nastavte v **Settings → Pages → Custom domain**.
