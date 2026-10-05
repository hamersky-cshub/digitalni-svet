# Digitální svět pod kontrolou

Český průvodce sérií tří workshopů pro dospělé 60+. Vzhled používá typografii, ilustrace a rozvržení modulů z KidCyProject.github.io. Základní text má 20 px, ovládací prvky jsou velké a tlačítko „Větší písmo“ nabízí další zvětšení.

## Odemknutí workshopů

Otevřete soubor **[workshop-access.json](./workshop-access.json)** v kořeni projektu. Každé téma má vlastní přepínač:

```json
{
  "digitalni-stopa": true,
  "digitalni-obrana": false,
  "digitalni-klice": false
}
```

- `true` = téma je otevřené, včetně všech jeho zastávek, úkolů a materiálů.
- `false` = téma je viditelné na úvodní stránce s označením „Dostupné později“, ale nejde otevřít.

**Pro druhý workshop změňte pouze `"digitalni-obrana": false` na `"digitalni-obrana": true`.** U třetího stejným způsobem přepněte `digitalni-klice`. Předchozí otevřená témata můžete ponechat dostupná. Nepřidávejte uvozovky kolem `true` nebo `false`.

Potom spusťte `npm run check && npm run build` a zveřejněte nový obsah složky `dist/`. Pokud upravujete repozitář na GitHubu, stačí změnu uložit do větve `main`: existující GitHub Actions workflow web zkontroluje, sestaví a nasadí na Pages.

Přepínač se používá při sestavení. Nestačí měnit soubor na již nasazeném statickém webu. Obsah zamčených témat zůstává ve zdrojových souborech pro budoucí použití, ale jejich stránky a PDF nejsou součástí výsledného webu. Jsou blokovány i při zadání přímé adresy. Nová konfigurace aktualizuje service worker a jeho offline cache.

## Pro lektory

Stránka **`/pro-lektory/`** (web na ni nikde neodkazuje) shrnuje, jak web používat před workshopem, během něj a po něm. Odkazuje na scénáře `/pro-lektory/<téma>/` s časy, cíli, otázkami do diskuse, tipy a klíčem odpovědí ke každé obrazovce – vznikají z poznámek `lecturer` v souborech zastávek a dají se vytisknout. Scénáře jsou jen pro otevřená témata. Stránky mají `noindex` a offline režim je neukládá; otevírejte je na vlastním zařízení.

## Spuštění

Node.js 24 nebo novější (viz `.nvmrc`).

```sh
npm ci
npm run dev
npm run check
npm run build
npm run preview
```

Lokální adresa: `http://localhost:4321/digitalni-svet/`. Základní cesta a doména pro GitHub Pages jsou v `astro.config.mjs`.

## Offline režim

- Service worker (`public/sw.js`) při první návštěvě uloží základ webu: úvodní stránku, styly, skripty, písma a offline stránku. Každá stránka pak požádá o uložení společných stránek (praktické úkoly, materiály, obrázky) a všech obrazovek tématu, ve kterém právě je.
- Stránky se načítají nejdřív ze sítě. Když síť do 3,5 s neodpoví, zobrazí se uložená kopie. Když stránka uložená není, ukáže se „Jste offline“.
- Seznam souborů a verzi doplní sestavení (`scripts/service-worker.mjs`). Verze se mění s obsahem webu: po každém nasazení si tablety stáhnou novou verzi a staré kopie smažou. **Nasazujte proto mimo probíhající workshop.**
- Před workshopem stačí na každém tabletu otevřít přehled tématu, dokud je Wi-Fi.

## Obsah

- `src/content/workshops/*.yaml`: názvy a popisy tří témat.
- `src/content/stops/<téma>/*.yaml`: očíslované zastávky a krátké obrazovky. `kind: prakticky` zařadí obrazovku i do přehledu praktických úkolů.
- V textech obrazovek lze psát `**tučně**`, `[text odkazu](https://…)` (klikací odkaz, otevře se v novém okně) a `{{adresa.test}}` (neklikací ukázková adresa v simulacích).
- Obrazovka může mít pole `figures` s nejvýš dvěma ilustracemi (`illustration`, `alt`, `caption`). Dostupné ilustrace jsou v `src/components/illustrations/` a jejich seznam v `ILLUSTRATIONS` v `src/content.config.ts`.
- Typy aktivit (pole `activity.type`) a jejich pole popisuje `src/content.config.ts`. Patří mezi ně např. `choices`, `scenarios`, `signals`, `guide`, `passphrase`, `dice` (kostková metoda s virtuálními kostkami a tabulkou 36 slov) a `settings` (proklikání nastavení účtu nanečisto).
- U aktivity `choices` označí `recommended` vhodné možnosti (✓ Vhodná možnost) a `avoid` riskantní (⚠ Pozor, riziko). Ostatní možnosti dostanou „K zamyšlení“.
- Délka workshopu na úvodní stránce a na přehledu modulu se počítá ze součtu časů zastávek (`lecturer.time`, např. „15 minut“). Pevnou hodnotu lze zadat polem `duration` v souboru workshopu.
- `src/content/resources/*.md`: tematické návody, odkazy a materiály ke stažení.
- `public/soubory/<téma>/`: PDF a jiné soubory ke stažení. **Soubory ukládejte pod odpovídající téma**, aby se při zamčení vynechaly ze sestavení.
- `src/lib/presentation.ts`: barvy jednotlivých témat.
- `public/images/`: ilustrace převzaté z referenčního projektu, zmenšené na velikost, ve které se zobrazují (obrázky modulů 640 px, robot 640 a 1040 px).
- `public/fonts/`: písma webu. Nadpisové písmo Rubik je zmenšené jen na latinku; původní soubor je ve `fonts-source/`. Po výměně písma podmnožinu vytvořte znovu (nástroj `pyftsubset` z balíčku fonttools):
  `pyftsubset fonts-source/Rubik-Bold.woff2 --unicodes="U+0020-007E,U+00A0-017F,U+2013-2014,U+2018-201E,U+2022,U+2026,U+2039-203A,U+20AC,U+2190-2193" --layout-features='*' --flavor=woff2 --output-file=public/fonts/Rubik-Bold-latin.woff2`
- `scripts/workshop-access.mjs`: odstranění zamčených souborů z výsledného webu a blokování v místním vývojovém serveru.

Při přidání nového tématu přidejte jeho id i do `workshop-access.json`; téma bez přepínače zůstává zamčené.

Web nemá registraci ani analytiku. Odpovědi a zaškrtnuté kroky se neukládají. Prohlížeč si pamatuje otevřené kroky (zastávka je „Navštíveno“, až jsou otevřené všechny její kroky) a velikost písma. Ukázkové podvodné adresy používají neklikací doménu `.test`.
