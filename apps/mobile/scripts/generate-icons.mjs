/**
 * Extrait les icônes utilisées par les apps mobiles depuis les jeux Iconify (paquets npm) vers
 * `src/design/icons.generated.ts` (Expo) et `../mobile-flutter/lib/design/icons.g.dart`
 * (Flutter) : SVG embarqués, aucune requête réseau à l'exécution, une seule source.
 * Lucide = icônes de l'interface ; Fluent Emoji Flat = pictogrammes illustrés.
 *
 *   node scripts/generate-icons.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const LUCIDE = [
  'arrow-left',
  'arrow-right',
  'audio-lines',
  'award',
  'book',
  'book-open',
  'book-open-check',
  'chart-line',
  'chevron-right',
  'circle-check',
  'circle-play',
  'clock',
  'house',
  'library',
  'pause',
  'play',
  'pointer',
  'shield',
  'shield-check',
  'sliders-horizontal',
  'sliders-vertical',
  'sparkle',
  'sparkles',
  'star',
  'timer',
  'type',
  'user',
  'volume-1',
  'volume-2',
  'wand-sparkles',
  'zap',
  'check',
  'lock',
  'rotate-ccw',
  'x',
];
const FLUENT = [
  'paw-prints',
  'rocket',
  'compass',
  'sparkles',
  'soccer-ball',
  'house-with-garden',
  'gem-stone',
  'fox',
  'glowing-star',
  'star',
  'fire',
  'herb',
  'locked',
];

function extract(set, names, prefix) {
  const data = require(`@iconify-json/${set}/icons.json`);
  const out = {};
  for (const name of names) {
    let icon = data.icons[name];
    if (!icon && data.aliases?.[name]) icon = data.icons[data.aliases[name].parent];
    if (!icon) throw new Error(`icône introuvable : ${set}:${name}`);
    const w = icon.width ?? data.width ?? 24;
    const h = icon.height ?? data.height ?? 24;
    out[`${prefix}${name}`] =
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${icon.body}</svg>`;
  }
  return out;
}

const icons = {
  ...extract('lucide', LUCIDE, ''),
  ...extract('fluent-emoji-flat', FLUENT, 'emoji:'),
};
const lines = Object.entries(icons).map(
  ([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`,
);
const header = `/* Fichier généré par scripts/generate-icons.mjs — ne pas modifier à la main.
 * Sources : Lucide (ISC) et Fluent Emoji Flat (MIT, Microsoft) via Iconify. */\n`;
writeFileSync(
  new URL('../src/design/icons.generated.ts', import.meta.url),
  `${header}export const ICONS = {\n${lines.join('\n')}\n} as const;\n\nexport type IconName = keyof typeof ICONS;\n`,
);
// Même jeu d'icônes pour l'app Flutter (chaînes Dart brutes).
const dart = Object.entries(icons).map(([k, v]) => `  '${k}': r'''${v}''',`);
writeFileSync(
  new URL('../../mobile-flutter/lib/design/icons.g.dart', import.meta.url),
  `// Fichier généré par apps/mobile/scripts/generate-icons.mjs — ne pas modifier à la main.
// Sources : Lucide (ISC) et Fluent Emoji Flat (MIT, Microsoft) via Iconify.

const Map<String, String> kIcons = {
${dart.join('\n')}
};
`,
);

// eslint-disable-next-line no-console -- sortie de script CLI
console.log(`${Object.keys(icons).length} icônes générées`);
