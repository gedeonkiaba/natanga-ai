import { SvgXml } from 'react-native-svg';
import { ICONS, type IconName } from '../icons.generated';

/** Icône vectorielle embarquée (Lucide pour l'interface, `emoji:*` pour les pictogrammes). */
export function Icon({
  name,
  size = 20,
  color,
  strokeWidth,
  filled,
}: {
  name: IconName;
  size?: number;
  color?: string;
  /** Épaisseur du trait Lucide (2 par défaut). */
  strokeWidth?: number;
  /** Icône Lucide remplie de sa couleur (étoile, éclair…). */
  filled?: boolean;
}) {
  let xml: string = ICONS[name];
  if (filled) xml = xml.replace('fill="none"', 'fill="currentColor"');
  if (strokeWidth !== undefined)
    xml = xml.replace(/stroke-width="2"/g, `stroke-width="${strokeWidth}"`);
  return <SvgXml xml={xml} width={size} height={size} color={color} />;
}
