/**
 * Postavy, které v obsahu vystupují jménem (pole `persona` u situace nebo obrazovky).
 * Avatar je jen ilustrační – jméno vždy nese text vedle něj.
 */
export const PERSONAS = ['marie', 'josef', 'vera', 'jana'] as const;
export type PersonaName = (typeof PERSONAS)[number];
