/*
 * Společná logika pro HotspotImage a MessageSignals:
 * klepnutím na místo se zobrazí jeho vysvětlení, počítadlo ukáže, kolik míst jste prohlédli.
 */
import { plural, zOrZe } from '../../lib/text';

class SpotExplorer extends HTMLElement {
  connectedCallback() {
    const buttons = Array.from(this.querySelectorAll<HTMLButtonElement>('[data-spot]'));
    const explains = Array.from(this.querySelectorAll<HTMLElement>('[data-explain]'));
    const status = this.querySelector<HTMLElement>('[data-status]')!;
    const controls = this.querySelector<HTMLElement>('[data-controls]');
    const total = explains.length;
    const seen = new Set<string>();
    // Pro čtečky obrazovky: přečte vysvětlení právě zvoleného místa.
    const announce = document.createElement('p');
    announce.className = 'visually-hidden';
    announce.setAttribute('aria-live', 'polite');
    this.append(announce);

    const update = () => {
      const n = seen.size;
      if (this.dataset.noun === 'signálu') {
        status.textContent =
          n === total
            ? `Prohlédli jste všech ${total} varovných signálů.`
            : `Prohlédli jste ${n} ${plural(n, ['varovný signál', 'varovné signály', 'varovných signálů'])} ${zOrZe(total)} ${total}.`;
      } else {
        status.textContent =
          n === total ? `Prohlédli jste všech ${total} míst.` : `Prohlédli jste ${n} ${plural(n, ['místo', 'místa', 'míst'])} ${zOrZe(total)} ${total}.`;
      }
    };

    const reveal = (id: string, only: boolean) => {
      seen.add(id);
      buttons.filter((b) => b.dataset.spot === id).forEach((b) => b.setAttribute('aria-pressed', 'true'));
      explains.forEach((el) => {
        if (el.dataset.explain === id) {
          el.hidden = false;
          el.classList.add('is-current');
          if (only) {
            announce.textContent = el.textContent?.replace(/\s+/g, ' ').trim() ?? '';
            el.scrollIntoView({ block: 'nearest' });
          }
        } else {
          el.classList.remove('is-current');
          if (only) el.hidden = !seen.has(el.dataset.explain!);
        }
      });
      update();
    };

    buttons.forEach((button) => {
      button.addEventListener('click', () => reveal(button.dataset.spot!, true));
    });
    explains.forEach((el) => (el.hidden = true));
    status.hidden = false;
    if (controls) controls.hidden = false;
    this.querySelector('[data-show-all]')?.addEventListener('click', () => {
      explains.forEach((el) => reveal(el.dataset.explain!, false));
      explains.forEach((el) => el.classList.remove('is-current'));
    });
    update();
  }
}

customElements.define('spot-explorer', SpotExplorer);
