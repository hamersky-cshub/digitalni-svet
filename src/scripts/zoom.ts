/*
 * „Zvětšit obrázek“ – ilustraci otevře přes celou obrazovku v nativním <dialog>.
 * Obrázek je široký aspoň 1200 px, takže drobné údaje jsou čitelné i na telefonu (posouvá se prstem).
 * Bez podpory <dialog> tlačítko zůstane skryté a obrázek se dá zvětšit gestem prohlížeče.
 */
let counter = 0;

class ImageZoom extends HTMLElement {
  connectedCallback() {
    const button = this.querySelector<HTMLButtonElement>('[data-zoom-open]');
    if (!button || typeof HTMLDialogElement !== 'function' || !('showModal' in HTMLDialogElement.prototype)) return;
    button.hidden = false;
    button.addEventListener('click', () => this.open(button));
  }

  open(button: HTMLButtonElement) {
    const svg = this.querySelector('svg');
    if (!svg) return;
    const titleId = `zoom-title-${++counter}`;
    const dialog = document.createElement('dialog');
    dialog.className = 'zoom-dialog';
    dialog.setAttribute('aria-labelledby', titleId);
    dialog.innerHTML = `
      <div class="zoom-dialog__bar">
        <p class="zoom-dialog__title" id="${titleId}">Zvětšený obrázek</p>
        <button type="button" class="button" data-zoom-close autofocus>Zavřít</button>
      </div>
      <p class="zoom-dialog__hint">Obrázek můžete posouvat prstem.</p>
      <div class="zoom-dialog__image" role="img" tabindex="0"></div>`;
    const image = dialog.querySelector<HTMLElement>('.zoom-dialog__image')!;
    image.setAttribute('aria-label', this.dataset.label ?? '');

    // Kopie obrázku s přejmenovanými id (přechody, stíny), aby se nebily s originálem.
    const clone = svg.cloneNode(true) as SVGSVGElement;
    const renamed = new Map<string, string>();
    clone.querySelectorAll('[id]').forEach((el) => {
      renamed.set(el.id, `${el.id}-z${counter}`);
      el.id = `${el.id}-z${counter}`;
    });
    clone.querySelectorAll('*').forEach((el) => {
      for (const attr of ['fill', 'stroke', 'filter', 'clip-path', 'mask', 'href']) {
        const value = el.getAttribute(attr);
        if (value?.includes('#')) el.setAttribute(attr, value.replace(/#([\w-]+)/g, (match, id) => (renamed.has(id) ? `#${renamed.get(id)}` : match)));
      }
    });
    image.append(clone);

    dialog.querySelector('[data-zoom-close]')!.addEventListener('click', () => dialog.close());
    // Klepnutí vedle obrázku (na pozadí dialogu) ho zavře; Esc zavírá dialog sám.
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', () => {
      dialog.remove();
      button.focus();
    });
    document.body.append(dialog);
    dialog.showModal();
  }
}

customElements.define('image-zoom', ImageZoom);
