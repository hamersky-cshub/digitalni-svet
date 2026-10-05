/*
 * Sada ikon webu. Jednotný styl: mřížka 24 × 24, obrys tahem 2, kulaté konce a spoje,
 * barva podle textu (currentColor). Ikony jsou vždy dekorativní (aria-hidden) –
 * význam nese text vedle nich.
 *
 * Emoji v obsahu (YAML) se při vykreslení automaticky nahradí ikonou podle EMOJI_ICONS,
 * takže texty není nutné přepisovat. Emoji bez ikony zůstane emoji (např. 🙂 ve zprávě).
 */

/** Tečka (např. oko, puntík kostky) – krátká čára s kulatým koncem. */
const dot = (x: number, y: number, w = 2.6) => `<path d="M${x} ${y}h.01" stroke-width="${w}"/>`;

export const ICONS = {
  // Rozhraní
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7"/>',
  'check-circle': '<circle cx="12" cy="12" r="9"/><path d="m8 12.3 2.8 2.8 5.4-5.6"/>',
  warning: `<path d="M12 3.5 21.5 20h-19L12 3.5Z"/><path d="M12 9.5v5"/>${dot(12, 17.3)}`,
  question: `<circle cx="12" cy="12" r="9"/><path d="M9.4 9.4a2.7 2.7 0 1 1 3.8 2.5c-.8.4-1.2 1-1.2 1.9v.4"/>${dot(12, 17)}`,
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 1 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 1 0 5.7 5.7l1-1"/>',
  file: '<path d="M6 3h8l4 4v14H6V3Z"/><path d="M14 3v4h4M9 12h6M9 15.5h6"/>',
  guide: '<path d="M14 3H6v18h12v-6"/><path d="M9 8h4M9 11.5h3"/><path d="m19.3 6.3-6 6-.8 2.9 2.9-.8 6-6a1.5 1.5 0 1 0-2.1-2.1Z"/>',
  presentation: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M12 16v3M8 21l4-2 4 2M7 12l3-3 2.5 2.5L17 7"/>',
  play: '<circle cx="12" cy="12" r="9"/><path d="m10 8.5 5.5 3.5-5.5 3.5v-7Z"/>',
  paperclip: '<path d="m20 11.5-7.8 7.8a5 5 0 0 1-7.1-7.1l8.5-8.5a3.3 3.3 0 1 1 4.7 4.7l-8.2 8.2a1.7 1.7 0 0 1-2.4-2.4l7.4-7.4"/>',
  pin: '<path d="M9 3.5h6M10 3.5V9l-3 3.5h10L14 9V3.5M12 12.5V21"/>',
  tap: '<path d="M9.5 12V5a1.5 1.5 0 0 1 3 0v5.5l4.4.8a2.2 2.2 0 0 1 1.8 2.6l-.8 4.1a3 3 0 0 1-3 2.5h-3.2a3 3 0 0 1-2.4-1.2l-3.2-4.2a1.5 1.5 0 0 1 2.3-1.9l1.1 1.1V12Z"/>',
  thought: '<path d="M8 15a3.5 3.5 0 0 1-.6-7A4.5 4.5 0 0 1 15.6 6a3.5 3.5 0 0 1 2.9 6.3A3 3 0 0 1 16 15H8Z"/><circle cx="7.5" cy="18.5" r="1.4"/><circle cx="4.8" cy="21" r=".9"/>',
  chat: '<path d="M4 4.5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-9l-5 4v-4H4a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1Z"/><path d="M7.5 9h9M7.5 12.5h6"/>',
  people:
    '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c.6-3.6 3-5.5 6-5.5s5.4 1.9 6 5.5"/><circle cx="17" cy="9" r="2.6"/><path d="M15.6 14.6c2.6.1 4.6 1.8 5.4 4.9"/>',
  person: '<circle cx="12" cy="8" r="3.8"/><path d="M4.5 20.5c.8-4.3 3.7-6.5 7.5-6.5s6.7 2.2 7.5 6.5"/>',

  // Zařízení a komunikace
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.2"/><path d="M11 18.5h2"/>',
  'phone-call':
    '<path d="M6.6 3.5h2.6l1.5 4.2-2 1.3a10.5 10.5 0 0 0 6.3 6.3l1.3-2 4.2 1.5v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z"/>',
  laptop: '<rect x="4.5" y="5" width="15" height="10" rx="1.5"/><path d="M2.5 18.5h19"/>',
  computer: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M9 20h6M12 16v4"/>',
  mail: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m4 7 8 6 8-6"/>',
  bell: '<path d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 2h-15l1.5-2Z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
  camera: '<path d="M4 8h3l1.6-2.5h6.8L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13" r="3.5"/>',
  image: '<rect x="3" y="4.5" width="18" height="15" rx="2"/><circle cx="8.5" cy="9.5" r="1.8"/><path d="m3.5 17.5 5-5 4 4 2.5-2.5 5.5 5.5"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M9 21h6"/>',
  voice: '<rect x="6.5" y="3" width="6" height="11" rx="3"/><path d="M3.5 11a6 6 0 0 0 12 0M9.5 17v4"/><path d="M18 8.5c1 1.2 1 3.8 0 5M20.5 6.5c2 2.5 2 6.5 0 9"/>',
  wifi: `<path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.3a9.5 9.5 0 0 1 13 0M8.6 15.6a5 5 0 0 1 6.8 0"/>${dot(12, 19, 3)}`,
  qr: `<rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1"/><rect x="14" y="3.5" width="6.5" height="6.5" rx="1"/><rect x="3.5" y="14" width="6.5" height="6.5" rx="1"/><path d="M14 14h2.5v2.5M17.5 20.5h3V17"/>${dot(20.5, 14)}${dot(14, 20.5)}`,
  apps: '<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>',
  settings: '<path d="M10.3 5.0 L10.6 2.5 L13.4 2.5 L13.7 5.0 L15.7 5.8 L17.7 4.3 L19.7 6.3 L18.2 8.3 L19.0 10.3 L21.5 10.6 L21.5 13.4 L19.0 13.7 L18.2 15.7 L19.7 17.7 L17.7 19.7 L15.7 18.2 L13.7 19.0 L13.4 21.5 L10.6 21.5 L10.3 19.0 L8.3 18.2 L6.3 19.7 L4.3 17.7 L5.8 15.7 L5.0 13.7 L2.5 13.4 L2.5 10.6 L5.0 10.3 L5.8 8.3 L4.3 6.3 L6.3 4.3 L8.3 5.8 Z"/><circle cx="12" cy="12" r="3"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3Z"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',
  cookie: `<path d="M20.8 12.6a8.8 8.8 0 1 1-9.4-9.4 3 3 0 0 0 3.6 3.6 3 3 0 0 0 3.6 3.6 2.5 2.5 0 0 0 2.2 2.2Z"/>${dot(8.5, 9.5)}${dot(8, 15)}${dot(13, 16.5)}${dot(12.5, 11.5)}`,
  home: '<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5.5h4V20"/>',
  location: '<path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.5"/>',
  trash: '<path d="M4 7h16M9.5 7V4.5h5V7M6 7l1 13h10l1-13M10 11v5.5M14 11v5.5"/>',
  package: '<path d="M12 3 20.5 7.5v9L12 21l-8.5-4.5v-9L12 3Z"/><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9M7.8 5.3l8.5 4.5"/>',
  cart: '<path d="M3 4h2.5l2.2 11h10.6L20.5 7H6.4"/><circle cx="9.5" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>',
  bank: '<path d="M3 9h18L12 4 3 9Z"/><path d="M5.5 9v8.5M10 9v8.5M14 9v8.5M18.5 9v8.5M3 20.5h18"/>',
  list: '<rect x="5" y="4.5" width="14" height="16.5" rx="2"/><path d="M9 3h6v3H9zM8.5 11h7M8.5 14.5h7M8.5 18h4"/>',
  repeat: '<path d="m17 3 3 3-3 3M20 6H7.5A3.5 3.5 0 0 0 4 9.5V11M7 21l-3-3 3-3M4 18h12.5a3.5 3.5 0 0 0 3.5-3.5V13"/>',

  // Bezpečnost
  key: '<circle cx="8" cy="8" r="5"/><path d="m11.5 11.5 9 9M17 17l3-3M14 14l3-3"/>',
  keys: '<circle cx="7.5" cy="7.5" r="4.5"/><path d="m10.7 10.7 9.3 9.3M16.6 16.6l2.6-2.6M13.6 13.6l2.1-2.1"/><path d="M7.5 12v9M7.5 17.5h2.5M7.5 20h2"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5v-3a4 4 0 1 1 8 0v3M12 14.5V17"/>',
  unlock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5v-3a4 4 0 0 1 7.7-1.6M12 14.5V17"/>',
  shield: '<path d="m12 3 7.5 2.8v5.7c0 4.6-3.2 8.2-7.5 9.9-4.3-1.7-7.5-5.3-7.5-9.9V5.8L12 3Z"/><path d="m8.8 12 2.3 2.3 4.3-4.6"/>',
  authority:
    '<path d="m12 3 7 2.5v6c0 4.4-3 7.6-7 9.5-4-1.9-7-5.1-7-9.5v-6L12 3Z"/><path d="m12 8.3 1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.2-2.4 1.2.5-2.6-1.9-1.8 2.6-.4L12 8.3Z"/>',
  fingerprint:
    '<path d="M6.3 7.6A7 7 0 0 1 19 12v1.5M5 11.4V13a11 11 0 0 0 1 4.6M9 18.8A14 14 0 0 1 8.5 15v-3a3.5 3.5 0 0 1 7 0v2.5a17 17 0 0 1-.8 5M12 12v3a12 12 0 0 0 1.4 5.5"/>',
  leak: '<ellipse cx="10" cy="5.5" rx="6.5" ry="2.5"/><path d="M3.5 5.5v10c0 1.4 2.9 2.5 6.5 2.5M16.5 5.5V10M3.5 10.5c0 1.4 2.9 2.5 6.5 2.5"/><path d="M18 13.5s-2.5 2.8-2.5 4.5a2.5 2.5 0 0 0 5 0c0-1.7-2.5-4.5-2.5-4.5Z"/>',
  hook: '<path d="M15 4v9.5a5 5 0 1 1-10 0V12"/><path d="M5 12 2.8 14.3M13 4h4"/>',
  masks: `<path d="M3.5 4h11v6a5.5 5.5 0 0 1-11 0V4Z"/>${dot(6.8, 8)}${dot(11.2, 8)}<path d="M7 12a2.8 2.8 0 0 0 4 0"/><path d="M14.5 8.5h6V14a5.5 5.5 0 0 1-8.2 4.8"/>${dot(17.5, 12)}`,
  flag: '<path d="M5 21V4M5 4.5h11l-2 3.5 2 3.5H5"/>',
  stop: '<path d="M8.3 3h7.4L21 8.3v7.4L15.7 21H8.3L3 15.7V8.3L8.3 3Z"/><path d="M8 12h8"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',

  // Lidé, pocity, věci
  worried: `<circle cx="12" cy="12" r="9"/><path d="M8.5 16.5c1-1.2 2.2-1.8 3.5-1.8s2.5.6 3.5 1.8M7.3 8.7l2.2-1.1M16.7 8.7l-2.2-1.1"/>${dot(9, 11)}${dot(15, 11)}`,
  timer: '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5V9.5M10 2.5h4M18.8 6.2l-1.4 1.4"/>',
  gift: '<rect x="3.5" y="8.5" width="17" height="4" rx="1"/><path d="M5 12.5V20h14v-7.5M12 8.5V20"/><path d="M12 8.5c-1.5-3.5-5.5-3.5-5.5-1 0 1 1.5 1 5.5 1ZM12 8.5c1.5-3.5 5.5-3.5 5.5-1 0 1-1.5 1-5.5 1Z"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10A4.2 4.2 0 0 1 12 7.4 4.2 4.2 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z"/>',
  bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.4 1.1 2.2v.2h5V16c0-.8.4-1.6 1.1-2.2A6 6 0 0 0 12 3Z"/>',
  brain:
    '<path d="M12 5.5C11.2 3.9 9.6 3 8 3.3 6.1 3.6 4.8 5.3 5 7.2c-1.6.6-2.5 2.2-2.2 3.9.2 1.3 1.1 2.3 2.2 2.7-.3 1.9.9 3.7 2.8 4.1 1.5.3 2.9-.3 3.7-1.5M12 5.5c.8-1.6 2.4-2.5 4-2.2 1.9.3 3.2 2 3 3.9 1.6.6 2.5 2.2 2.2 3.9-.2 1.3-1.1 2.3-2.2 2.7.3 1.9-.9 3.7-2.8 4.1-1.5.3-2.9-.3-3.7-1.5M12 5.5V21"/>',
  bolt: '<path d="M13.5 2.5 5 13.5h6l-1 8 8.5-11h-6l1-8Z"/>',
  turtle:
    '<path d="M4 15.5a8 8 0 0 1 16 0H4Z"/><path d="M9 8 12 12l3-4M6.5 12.5h11M20 13.5h1.3a1.5 1.5 0 0 0 0-3H19.6M6.5 15.5l-1 3M17.5 15.5l1 3M2.5 15.5H4"/>',
  glass: '<path d="M6 4h12l-1.6 15.2a1 1 0 0 1-1 .8H8.6a1 1 0 0 1-1-.8L6 4Z"/><path d="M6.6 10h10.8"/>',
  footprints:
    '<path d="M7.5 3c1.8 0 3 1.9 2.8 4.6-.2 2.3-.8 4-2.8 4S4.9 9.9 4.7 7.6C4.5 4.9 5.7 3 7.5 3Z"/><path d="M5.3 14.3h4.4l-.4 1.9a1.9 1.9 0 0 1-3.6 0l-.4-1.9Z"/><path d="M16.5 7.5c1.8 0 3 1.9 2.8 4.6-.2 2.3-.8 4-2.8 4s-2.6-1.7-2.8-4c-.2-2.7 1-4.6 2.8-4.6Z"/><path d="M14.3 18.8h4.4l-.4 1.9a1.9 1.9 0 0 1-3.6 0l-.4-1.9Z"/>',
  share: '<circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="m8.2 10.8 7.6-4.1M8.2 13.2l7.6 4.1"/>',
  bag: '<rect x="4.5" y="7" width="15" height="14" rx="3"/><path d="M9 7V5.5a3 3 0 0 1 6 0V7M4.5 13h15M10.5 13v2.5h3V13"/>',
  dice: `<rect x="4" y="4" width="16" height="16" rx="3"/>${dot(8.5, 8.5, 3)}${dot(15.5, 8.5, 3)}${dot(12, 12, 3)}${dot(8.5, 15.5, 3)}${dot(15.5, 15.5, 3)}`,
  plane: '<path d="M21 4 3 11l7 2.5L12.5 21 21 4ZM10 13.5 21 4"/>',
} as const;

export type IconName = keyof typeof ICONS;
export const ICON_NAMES = Object.keys(ICONS) as IconName[];

/** Emoji z obsahu → ikona sady (bez variačního selektoru U+FE0F). */
export const EMOJI_ICONS: Record<string, IconName> = {
  '⚙': 'settings',
  '🔍': 'search',
  '🔑': 'key',
  '🗝': 'keys',
  '🛡': 'shield',
  '🔒': 'lock',
  '📷': 'camera',
  '📱': 'phone',
  '💻': 'laptop',
  '🖥': 'computer',
  '✉': 'mail',
  '🏦': 'bank',
  '🏛': 'bank',
  '👥': 'people',
  '👤': 'person',
  '😟': 'worried',
  '⏱': 'timer',
  '👮': 'authority',
  '🎁': 'gift',
  '❤': 'heart',
  '📍': 'location',
  '🎤': 'mic',
  '🎙': 'voice',
  '🖼': 'image',
  '🗑': 'trash',
  '🏠': 'home',
  '🍪': 'cookie',
  '👁': 'eye',
  '💡': 'bulb',
  '✅': 'check-circle',
  '🧠': 'brain',
  '🥃': 'glass',
  '🛒': 'cart',
  '🔔': 'bell',
  '🎣': 'hook',
  '📋': 'list',
  '🔁': 'repeat',
  '💬': 'chat',
  '📞': 'phone-call',
  '📶': 'wifi',
  '🔳': 'qr',
  '⚠': 'warning',
  '⚡': 'bolt',
  '🐢': 'turtle',
  '📦': 'package',
  '👣': 'footprints',
  '🌐': 'globe',
  '📎': 'paperclip',
};

/** Ikona sady pro dané emoji (nebo undefined, když ikonu nemá). */
export function iconForEmoji(emoji: string): IconName | undefined {
  return EMOJI_ICONS[emoji.replace(/️/g, '')];
}

/** SVG ikony jako text (pro formatText a skripty). Velikost se řídí CSS (třída "icon"). */
export function iconSvg(name: IconName, className = 'icon'): string {
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`;
}
