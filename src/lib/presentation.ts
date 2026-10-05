import type { ScreenKind } from '../content.config';
import type { IconName } from './icons';

/** Visual identity shared by the homepage, module overview and activities. */
export const moduleStyles: Record<string, { accent: string; color: string; /** Tmavší odstín pro drobný text (kontrast ≥ 7:1). */ text: string; soft: string; icon: 'privacy' | 'shield' | 'key'; topic: string }> = {
  'digitalni-stopa': { accent: '#d946ef', color: '#a13783', text: '#872e6e', soft: '#f9eefa', icon: 'privacy', topic: 'Vaše soukromí' },
  'digitalni-obrana': { accent: '#14b8a6', color: '#07756c', text: '#065c55', soft: '#e7f5f1', icon: 'shield', topic: 'Vaše jistota' },
  'digitalni-klice': { accent: '#f59e0b', color: '#935b08', text: '#764906', soft: '#fff5dd', icon: 'key', topic: 'Vaše účty' },
};
export const defaultModuleStyle = moduleStyles['digitalni-stopa'];

/** Štítek „co se teď děje“ u obrazovky (ScreenKind.astro) a ve scénáři pro lektora. */
export const SCREEN_KIND_INFO: Record<ScreenKind, { icon: IconName; label: string }> = {
  vyklad: { icon: 'chat', label: 'Povídání' },
  diskuse: { icon: 'people', label: 'Společná diskuse' },
  aktivita: { icon: 'tap', label: 'Aktivita' },
  prakticky: { icon: 'phone', label: 'Na vašem zařízení' },
  reflexe: { icon: 'thought', label: 'K zamyšlení' },
  shrnuti: { icon: 'pin', label: 'Shrnutí' },
};
