import { View } from 'react-native';
import { palette } from '../tokens';
import { Icon } from './Icon';

/** Case à cocher visuelle (l'état accessible est porté par le parent pressable). */
export function Checkbox({ checked }: { checked: boolean }) {
  return (
    <View
      style={{
        width: 22,
        height: 22,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: checked ? palette.teal600 : palette.white,
        borderWidth: checked ? 0 : 1.5,
        borderColor: palette.borderSlate,
      }}
    >
      {checked && <Icon name="check" size={14} color={palette.white} strokeWidth={3} />}
    </View>
  );
}
