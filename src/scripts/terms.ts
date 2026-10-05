/*
 * Pojmy ze slovníčku v textu obrazovky: bez JavaScriptu odkaz do slovníčku,
 * s ním se z odkazu stane tlačítko a vysvětlení se rozbalí hned pod odstavcem.
 * Vysvětlení vkládá stránka kroku jako JSON (#terms-data).
 */
type Term = { term: string; definition: string };

const source = document.getElementById('terms-data');
const data: Record<string, Term> = source ? JSON.parse(source.textContent ?? '{}') : {};

document.querySelectorAll<HTMLAnchorElement>('a.term[data-term]').forEach((link, i) => {
  const entry = data[link.dataset.term ?? ''];
  if (!entry) return;
  const boxId = `pojem-${i + 1}`;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'term';
  button.textContent = link.textContent;
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', boxId);
  link.replaceWith(button);

  let box: HTMLElement | null = null;
  const close = () => {
    box?.remove();
    box = null;
    button.setAttribute('aria-expanded', 'false');
  };

  button.addEventListener('click', () => {
    if (box) {
      close();
      return;
    }
    box = document.createElement('div');
    box.id = boxId;
    box.className = 'term-box';
    box.setAttribute('role', 'note');
    box.setAttribute('aria-label', `Pojem: ${entry.term}`);
    const title = document.createElement('p');
    title.className = 'term-box__title';
    title.textContent = entry.term;
    const text = document.createElement('p');
    text.innerHTML = entry.definition;
    const actions = document.createElement('p');
    actions.className = 'term-box__actions';
    const all = document.createElement('a');
    all.href = link.href;
    all.textContent = 'Celý slovníček';
    const hide = document.createElement('button');
    hide.type = 'button';
    hide.className = 'button button--secondary';
    hide.textContent = 'Zavřít';
    hide.addEventListener('click', () => {
      close();
      button.focus();
    });
    actions.append(all, hide);
    box.append(title, text, actions);
    // Pod odstavec, v seznamu dovnitř bodu (aby zůstal platný seznam).
    const block = button.closest('p, li, dd');
    if (block?.tagName === 'P' || block?.tagName === 'DD') block.after(box);
    else if (block) block.append(box);
    else button.after(box);
    button.setAttribute('aria-expanded', 'true');
  });
});
