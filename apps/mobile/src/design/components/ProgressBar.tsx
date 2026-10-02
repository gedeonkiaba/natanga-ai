import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { palette, radius } from '../tokens';

/** Barre de progression (dégradé violet → indigo sur piste crème). */
export function ProgressBar({ value, label }: { value: number; label: string }) {
  const pct = `${Math.round(Math.min(1, Math.max(0, value)) * 100)}%` as const;
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}
      style={{
        height: 6,
        borderRadius: radius.pill,
        backgroundColor: palette.track,
        overflow: 'hidden',
      }}
    >
      <LinearGradient
        colors={[palette.violet500, palette.indigo500]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ width: pct, height: '100%', borderRadius: radius.pill }}
      />
    </View>
  );
}
