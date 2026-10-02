import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, View } from 'react-native';
import { palette } from '../tokens';

const PIECES = [
  { x: 0.08, delay: 0, color: palette.amber500, size: 7 },
  { x: 0.22, delay: 180, color: palette.teal600, size: 6 },
  { x: 0.38, delay: 60, color: palette.violet500, size: 5 },
  { x: 0.55, delay: 260, color: palette.indigo300, size: 7 },
  { x: 0.7, delay: 120, color: palette.amber500, size: 5 },
  { x: 0.84, delay: 220, color: palette.violet500, size: 7 },
  { x: 0.94, delay: 40, color: palette.teal600, size: 5 },
] as const;

/**
 * Confettis doux : une seule chute lente à l'arrivée, puis quelques points restent
 * posés. Désactivés si l'appareil demande moins d'animations.
 */
export function Confetti({ height = 320 }: { height?: number }) {
  const progress = useRef(new Animated.Value(0)).current;
  const [width, setWidth] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((r) => {
      if (cancelled) return;
      setReduced(r);
      if (r) {
        progress.setValue(1);
        return;
      }
      Animated.timing(progress, {
        toValue: 1,
        duration: 2400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });
    return () => {
      cancelled = true;
    };
  }, [progress]);

  return (
    <View
      pointerEvents="none"
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={{ position: 'absolute', left: 0, right: 0, top: 0, height }}
    >
      {width > 0 &&
        PIECES.map((p, i) => {
          const rest = 30 + ((i * 47) % (height - 60)); // position finale, dispersée
          const translateY = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [-40 - p.delay / 6, rest],
          });
          const rotate = progress.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', `${i % 2 ? 200 : -160}deg`],
          });
          const opacity = reduced
            ? 0.7
            : progress.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 0.9, 0.7] });
          return (
            <Animated.View
              key={i}
              style={{
                position: 'absolute',
                left: p.x * width,
                width: p.size,
                height: p.size,
                borderRadius: i % 3 === 0 ? 1.5 : p.size / 2,
                backgroundColor: p.color,
                opacity,
                transform: [{ translateY }, { rotate }],
              }}
            />
          );
        })}
    </View>
  );
}
