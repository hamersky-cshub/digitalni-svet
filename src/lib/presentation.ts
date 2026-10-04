/** Visual identity shared by the homepage, module overview and activities. */
export const moduleStyles: Record<string, { accent: string; color: string; soft: string; icon: 'privacy' | 'shield' | 'key'; topic: string; outcome: string }> = {
  'digitalni-stopa': { accent: '#d946ef', color: '#a13783', soft: '#f9eefa', icon: 'privacy', topic: 'Vaše soukromí', outcome: 'Zkontrolujete oprávnění aplikací a promyslíte, co sdílíte.' },
  'digitalni-obrana': { accent: '#14b8a6', color: '#087f75', soft: '#e7f5f1', icon: 'shield', topic: 'Vaše jistota', outcome: 'Rozpoznáte podezřelou zprávu a nacvičíte bezpečnou reakci.' },
  'digitalni-klice': { accent: '#f59e0b', color: '#935b08', soft: '#fff5dd', icon: 'key', topic: 'Vaše účty', outcome: 'Vyzkoušíte si silnou heslovou frázi a druhé ověření.' },
};
export const defaultModuleStyle = moduleStyles['digitalni-stopa'];
