import access from '../../workshop-access.json';

/** Change true/false in workshop-access.json, then rebuild and publish the site. */
export function isWorkshopUnlocked(id: string): boolean {
  return (access as Record<string, boolean>)[id] === true;
}
