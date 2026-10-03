# Digitální svět pod kontrolou

Interaktivní průvodce sérií tří prezenčních workshopů o kybernetické bezpečnosti pro seniory.
Účastníci web používají hlavně na tabletech a postupují v něm podle pokynů lektora.
Nejde o e-learning: obrazovky jsou krátké a podporují práci lektora, nenahrazují ho.

🌐 **Adresa webu:** <https://hamersky-cshub.github.io/digitalni-svet/>

| Workshop | Adresa | Zastávky |
| --- | --- | --- |
| 👣 Digitální stopa – Co vše o nás internet ví | `/digitalni-stopa/` | 5 |
| 🛡️ Digitální obrana – Jak se nenechat nachytat | `/digitalni-obrana/` | 6 |
| 🔑 Digitální klíče – Jak ochránit své účty | `/digitalni-klice/` | 5 |

## Hlavní principy

- **Jedna obrazovka = jedna věc.** Má jeden nadpis, pár vět a nejvýš jednu aktivitu. Každá obrazovka má vlastní adresu,
  například `/digitalni-stopa/zastavka-2/krok-3/`.
- **Žádné hodnocení.** Volby nejsou „správně/špatně“, ale ✓ *Vhodná možnost*, i *K zamyšlení* a ⚠ *Pozor, riziko*.
  Ikonu vždy doprovází text.
- **Soukromí:** web nepoužívá registraci, formuláře, analytiku, reklamu ani externí služby. Odpovědi se nikam neodesílají.
  Do `localStorage` se ukládá jen poslední pozice ve workshopu a příznak lektorského režimu. Tlačítko
  „Začít workshop znovu“ pozici smaže.
- **Přístupnost:** základní písmo 20 px, kontrast podle WCAG AAA, dotykové plochy alespoň 44 px (většinou 56–64 px)
  a výrazný focus. Web jde plně ovládat klávesnicí a respektuje `prefers-reduced-motion`. Neběží žádné automatické animace.
- **Progressive enhancement:** bez JavaScriptu se zobrazí všechny situace a vysvětlení v rozbalovacích částech
  a navigace funguje dál.
- **Offline:** malý service worker (`public/sw.js`). Při otevření přehledu workshopu si stáhne všechny jeho obrazovky,
  takže krátký výpadek Wi-Fi workshop nepřeruší. HTML se načítá nejdřív ze sítě, aby byl obsah vždy aktuální.
- **Bezpečné simulace:** všechny podvodné zprávy jsou smyšlené. Adresy v nich nejsou odkazy a používají rezervovanou
  doménu `.test`, která nikam nevede. Telefonní čísla jsou fiktivní (např. `+44 7700 900 123` z rezervované řady).

## Použitá technologie

- [Astro](https://astro.build) 7 – generuje čistě statické HTML, bez backendu a databáze.
- TypeScript a vanilla JS (custom elements) pro interaktivní aktivity. Web nepoužívá žádný UI framework ani externí knihovnu.
- Obsah je v souborech YAML a Markdown (Astro Content Collections). Pravidla v `src/content.config.ts` ho při sestavení
  zkontrolují.
- Systémová písma, bez externích fontů. Ilustrace jsou inline SVG.

## Spuštění a sestavení

Potřebujete [Node.js](https://nodejs.org) 22.12 nebo novější (doporučená verze je v `.nvmrc`).

```sh
npm install        # instalace (jen poprvé)
npm run dev        # vývojový server: http://localhost:4321/digitalni-svet/
npm run check      # kontrola typů a obsahu
npm run build      # sestavení do složky dist/
npm run preview    # náhled sestaveného webu (včetně service workeru)
```

## Nasazení na GitHub Pages

Workflow `.github/workflows/deploy.yml`:

- U **pull requestu** web jen zkontroluje a sestaví (`npm run check && npm run build`).
- Po **pushi do `main`** web sestaví a zveřejní na GitHub Pages. Spustit ho lze i ručně v záložce **Actions**
  (workflow „Nasazení na GitHub Pages“ nad větví `main`).

Jednorázové nastavení: v repozitáři otevřete **Settings → Pages** a jako **Source** zvolte **GitHub Actions**.

Adresa webu vychází z názvu repozitáře. Pokud repozitář přejmenujete, změňte `base` v `astro.config.mjs`.
Při přechodu na vlastní doménu nastavte `site` na novou adresu, `base` na `'/'` a přidejte soubor `public/CNAME`.

## Struktura projektu

```
.github/workflows/deploy.yml        sestavení a nasazení
public/
  sw.js                             offline režim (service worker)
  soubory/<workshop>/               PDF a další soubory ke stažení
src/
  content.config.ts                 pravidla obsahu (pole, typy aktivit, kontroly)
  content/
    workshops/<workshop>.yaml       název, podtitulek, anotace workshopu
    stops/<workshop>/NN-nazev.yaml  zastávky a jejich obrazovky (kroky)
    resources/*.md                  materiály ke stažení / odkazy / návody
  components/
    activities/                     interaktivní aktivity (viz níže)
    Progress.astro                  „Zastávka 2 z 5“, „Krok 1 ze 3“
    StepNav.astro                   Zpět / Pokračovat / Přehled / Úvod
    LecturerNote.astro              poznámka pro lektora (skrytá)
    ToneLabel.astro, ScreenKind.astro
  pages/
    index.astro                     úvodní stránka série
    [workshop]/index.astro          přehled workshopu (očíslované zastávky)
    [workshop]/[stop]/[...step].astro  jedna obrazovka
    pro-lektory.astro               návod pro lektory + zapnutí poznámek
    o-projektu.astro                o projektu a soukromí
    materialy/[id].astro            detail materiálu
  scripts/                          uložení pozice, lektorský režim, registrace SW
  styles/global.css                 design systém (barvy, písmo, tlačítka)
```

## Úprava obsahu workshopů

Obsah upravujete v YAML souborech ve složce `src/content/`. Lze to dělat přímo na GitHubu: otevřete soubor, klikněte
na tužku (Edit) a uložte tlačítkem **Commit changes**. Pokud v souboru bude chyba, sestavení v záložce **Actions**
skončí s českým popisem problému a stávající web zůstane beze změny.

### Zastávka a obrazovky

Každý soubor ve `src/content/stops/<workshop>/` je jedna zastávka. Pořadí zastávek určuje `order` a číslo v názvu
souboru slouží jen pro přehlednost.

```yaml
workshop: digitalni-obrana        # název souboru workshopu bez .yaml
order: 4                          # pořadí zastávky
title: Telefonát z banky
summary: Jedna věta na kartu zastávky.
lecturer:                         # poznámka pro lektora (vše nepovinné)
  time: 15 minut
  goal: Cíl zastávky.
  discussion: Otázka do diskuse.
  transition: Jak přejít k dalšímu tématu.
  tips:
    - Další tip.
screens:                          # obrazovky v pořadí, jak jdou za sebou
  - kind: vyklad                  # vyklad | diskuse | aktivita | prakticky | reflexe | shrnuti
    title: Zvoní telefon
    text:
      - Krátký odstavec. **Tučně** zvýrazněný text.
    points:                       # nepovinný seznam s odrážkami
      - Bod seznamu.
    activity: …                   # nepovinná aktivita (viz níže)
    lecturer: …                   # nepovinná poznámka jen k tomuto kroku
```

Pořadí obrazovek změníte přesunutím položek v `screens`, pořadí zastávek změnou `order`.

V textech lze použít `**tučně**` a `{{adresa.test/neco}}`. Druhá značka zobrazí neklikací ukázkovou adresu
pro simulace podvodů. Text začínající `*`, `{`, `[` nebo obsahující `: ` dejte do uvozovek `'…'`.

### Typy aktivit

Každá aktivita má pole `type`. Kompletní pravidla jsou v `src/content.config.ts` a příklady najdete v existujících
zastávkách.

| `type` | Co dělá | Příklad v obsahu |
| --- | --- | --- |
| `choices` | Řada situací se stejnými možnostmi (ANO / NE / NEJSEM SI JISTÝ/Á). U situace: `recommended` (vhodné možnosti), `explanation`, volitelně `responses` pro konkrétní volbu. | `digitalni-stopa/01-…`, `02-…` |
| `scenarios` | Modelové situace, každá s vlastními možnostmi (`label`, `tone`, `feedback`) a volitelným `lesson`. Volitelně `message` = simulovaná zpráva (`sms`, `email`, `chat`, `call`, `notification`). | `digitalni-obrana/02-…`, `04-…` |
| `signals` | Zpráva, ve které se hledají varovné signály. Podezřelé místo označte `[[text\|id]]` a vysvětlení napište do `signals.id`. | `digitalni-obrana/03-…` |
| `hotspots` | Ilustrace s čísly, na která lze klepnout (`x`, `y` v procentech). Dostupná scéna: `dovolena`. | `digitalni-stopa/04-…` |
| `device` | Výběr Android / iPad, iPhone / Nejsem si jistý/á a návod krok za krokem (`steps` s volitelnou `question`). | `digitalni-stopa/03-…` |
| `reflection` | Otázka k zamyšlení, volitelně `ideas` za tlačítkem „Ukázat inspiraci“. Nic se nezapisuje. | v každém workshopu |
| `rules` | Shrnutí – pravidla k zapamatování (volitelné `key`, např. písmena STOP). | `digitalni-obrana/06-stop.yaml` |
| `passphrase` | Skládání modelové heslové fráze z náhodných slov (`words`, `count`, `warning`). | `digitalni-klice/02-…` |
| `keyReuse` | „Jeden klíč ke všem dveřím“ – co se stane při úniku hesla. | `digitalni-klice/03-…` |
| `login` | Simulace přihlášení s potvrzením v telefonu. | `digitalni-klice/04-…` |

### Materiály ke stažení

Materiály se zobrazují dole na přehledu workshopu. Každý materiál je jeden soubor `.md` v `src/content/resources/`:

```markdown
---
title: Tahák – jak vytvořit silné heslo
description: Jednostránkový tahák k vytištění.
workshop: digitalni-klice
type: pdf                       # pdf | prezentace | video | odkaz | navod
file: soubory/digitalni-klice/silne-heslo-tahak.pdf   # nebo url: https://…
fileSize: 36 kB
source: Digitální svět pod kontrolou
---
```

Soubor nahrajte do `public/soubory/<workshop>/`. Typ `navod` nepotřebuje soubor ani odkaz, jeho obsahem je text pod
hlavičkou. Materiály s popisem „Ukázkový…“ jsou zatím jen ukázky formátu, nahraďte je skutečnými.

## Přidání nové interaktivní aktivity

1. Vytvořte komponentu v `src/components/activities/`, například `MojeAktivita.astro`. Interaktivitu napište jako
   custom element ve značce `<script>`, podle vzoru `KeyReuse.astro`. Bez JavaScriptu musí být obsah čitelný:
   co JS zapíná, označte atributem `hidden` a JS ho zobrazí.
2. Do `src/content.config.ts` přidejte schéma, například `z.object({ type: z.literal('mojeAktivita'), … })`, a zařaďte
   ho do `z.discriminatedUnion('type', [...])`.
3. V `src/components/activities/ActivityBlock.astro` přidejte řádek, který typ vykreslí.
4. Použijte ji v obsahu jako `activity: { type: mojeAktivita, … }`.

Pro jednoduché otázky s volbou ale většinou stačí stávající `choices` nebo `scenarios`, jen s novým obsahem.

## Přidání dalšího workshopu

1. Vytvořte `src/content/workshops/novy-workshop.yaml` (podle vzoru existujících; `order: 4`). Název souboru
   se stane adresou: `/novy-workshop/`. Nesmí to být `materialy`, `soubory`, `pro-lektory` ani `o-projektu`.
2. Vytvořte složku `src/content/stops/novy-workshop/` a do ní soubory zastávek (`01-uvod.yaml`, `02-….yaml`, …)
   s `workshop: novy-workshop`.
3. Hotovo. Karta na úvodní stránce, přehled workshopu, navigace, počítadla i offline režim vzniknou automaticky.
   Obsah ověříte příkazem `npm run check` nebo v náhledu `npm run dev`.

## Režim pro lektora

Na stránce **Pro lektory** (`/pro-lektory/`) lze zapnout poznámky pro lektora: čas, cíl, otázku do diskuse
a přechod dál. Zobrazí se pak u každé zastávky. Nastavení platí jen pro daný prohlížeč, takže účastníci poznámky nevidí.
Stránka obsahuje také přehled struktury všech workshopů s doporučenými časy.
