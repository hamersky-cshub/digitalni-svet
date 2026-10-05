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
    const detail = status.querySelector<HTMLElement>('[data-status-detail]')!;
    const count = status.querySelector<HTMLElement>('[data-status-count]')!;
    const controls = this.querySelector<HTMLElement>('[data-controls]');
    const total = explains.length;
    const seen = new Set<string>();

    const update = () => {
      const n = seen.size;
      const forms = this.dataset.forms?.split(',') as [string, string, string] | undefined;
      if (forms) {
        // Obecné tvary, např. data-forms="část,části,částí".
        const all = total < 5 ? `všechny ${total} ${forms[1]}` : `všech ${total} ${forms[2]}`;
        count.textContent = n === total ? `Prohlédli jste ${all}.` : `Prohlédli jste ${n} ${plural(n, forms)} ${zOrZe(total)} ${total}.`;
      } else if (this.dataset.noun === 'signálu') {
        count.textContent =
          n === total
            ? `Prohlédli jste všech ${total} varovných signálů.`
            : `Prohlédli jste ${n} ${plural(n, ['varovný signál', 'varovné signály', 'varovných signálů'])} ${zOrZe(total)} ${total}.`;
      } else {
        count.textContent =
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
            // Čtečka přečte jedno hlášení: vysvětlení místa a počet prohlédnutých.
            const title = el.querySelector('.spot-explain__title, .signal-explain__title')?.textContent?.trim();
            const text = el.textContent?.replace(/\s+/g, ' ').trim() ?? '';
            detail.textContent = title && text.startsWith(title) ? `${title}: ${text.slice(title.length).trim()} ` : `${text} `;
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
      detail.textContent = '';
      explains.forEach((el) => reveal(el.dataset.explain!, false));
      explains.forEach((el) => el.classList.remove('is-current'));
    });
    update();
  }
}

customElements.define('spot-explorer', SpotExplorer);
