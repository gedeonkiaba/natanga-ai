/**
 * Composants accessibles de base — Natanga design system.
 *
 * Choix a11y :
 * - Chaque composant accepte `accessibilityLabel` pour les lecteurs d'écran.
 * - Cibles tactiles ≥ 44px.
 * - `variant="warning"` = orange doux (jamais de rouge agressif).
 * - Typographie OpenDyslexic/Lexend.
 */
export { Button, type ButtonProps, type ButtonVariant } from './Button';
export { Text, type TextProps, type TextVariant } from './Text';
export { ProgressBar, type ProgressBarProps } from './ProgressBar';
export { Badge, type BadgeProps, type BadgeKind } from './Badge';
export { TTSButton, type TTSButtonProps } from './TTSButton';
export { speak, setSpeakFunction, type SpeakFn } from '../speech';
