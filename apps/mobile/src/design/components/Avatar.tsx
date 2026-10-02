import { View } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { palette } from '../tokens';
import { Icon } from './Icon';

export type AvatarKind = 'lumi' | 'noa' | 'malo' | 'tobi';

/** Couleurs des personnages : disque extérieur, disque intérieur, personnage, détails. */
const LOOKS: Record<AvatarKind, { outer: string; inner: string; body: string; detail: string }> = {
  lumi: { outer: '#FEF3C7', inner: '#FDE68A', body: '#F59E0B', detail: '#7C2D12' },
  noa: { outer: '#E0E7FF', inner: '#C7D2FE', body: '#818CF8', detail: '#1E1B4B' },
  malo: { outer: '#DCFCE7', inner: '#BBF7D0', body: '#86EFAC', detail: '#14532D' },
  tobi: { outer: '#FCE7F3', inner: '#FBCFE8', body: '#EC4899', detail: '#831843' },
};

function Character({ kind }: { kind: AvatarKind }) {
  const c = LOOKS[kind];
  switch (kind) {
    case 'lumi': // ourson souriant
      return (
        <G>
          <Circle cx={17} cy={17} r={4.5} fill={c.body} />
          <Circle cx={31} cy={17} r={4.5} fill={c.body} />
          <Circle cx={24} cy={26} r={10.5} fill={c.body} />
          <Circle cx={20.2} cy={24} r={1.4} fill={c.detail} />
          <Circle cx={27.8} cy={24} r={1.4} fill={c.detail} />
          <Ellipse cx={24} cy={28.4} rx={2} ry={1.4} fill={c.detail} />
          <Path
            d="M20.5 30.5 Q24 34 27.5 30.5"
            stroke={c.detail}
            strokeWidth={1.5}
            fill="none"
            strokeLinecap="round"
          />
        </G>
      );
    case 'noa': // hibou aux grands yeux
      return (
        <G>
          <Path d="M15 18 L18 13 L21 17 Z M33 18 L30 13 L27 17 Z" fill={c.body} />
          <Rect x={14} y={15} width={20} height={20} rx={10} fill={c.body} />
          <Circle cx={20} cy={24} r={4.2} fill={palette.white} />
          <Circle cx={28} cy={24} r={4.2} fill={palette.white} />
          <Circle cx={20} cy={24} r={2} fill={c.detail} />
          <Circle cx={28} cy={24} r={2} fill={c.detail} />
          <Path d="M22.5 28.5 L24 31 L25.5 28.5 Z" fill="#F59E0B" />
        </G>
      );
    case 'malo': // souris aux oreilles rondes
      return (
        <G>
          <Circle cx={16.5} cy={17.5} r={5} fill="#34D399" />
          <Circle cx={31.5} cy={17.5} r={5} fill="#34D399" />
          <Circle cx={24} cy={26} r={10} fill={c.body} />
          <Circle cx={20.5} cy={24.5} r={1.5} fill={c.detail} />
          <Circle cx={27.5} cy={24.5} r={1.5} fill={c.detail} />
          <Ellipse cx={24} cy={28.6} rx={1.8} ry={1.3} fill={c.detail} />
        </G>
      );
    case 'tobi': // petit robot
      return (
        <G>
          <Path d="M24 12 V17" stroke={c.body} strokeWidth={2} strokeLinecap="round" />
          <Circle cx={24} cy={11.5} r={2} fill={c.body} />
          <Rect x={15.5} y={17} width={17} height={15} rx={4.5} fill={c.body} />
          <Circle cx={20.5} cy={23.5} r={2} fill={palette.white} />
          <Circle cx={27.5} cy={23.5} r={2} fill={palette.white} />
          <Rect x={20} y={27.5} width={8} height={1.8} rx={0.9} fill={c.detail} />
        </G>
      );
  }
}

/** Avatar rond (cercles concentriques), anneau teal + coche quand il est choisi. */
export function Avatar({
  kind,
  size = 58,
  selected = false,
}: {
  kind: AvatarKind;
  size?: number;
  selected?: boolean;
}) {
  const c = LOOKS[kind];
  return (
    <View
      style={{
        width: size + 8,
        height: size + 8,
        borderRadius: (size + 8) / 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: selected ? 3 : 0,
        borderColor: palette.teal600,
        backgroundColor: selected ? palette.teal50 : 'transparent',
      }}
    >
      <Svg width={size} height={size} viewBox="0 0 48 48">
        <Circle cx={24} cy={24} r={24} fill={c.outer} />
        <Circle cx={24} cy={24} r={16} fill={c.inner} />
        <Character kind={kind} />
      </Svg>
      {selected && (
        <View
          style={{
            position: 'absolute',
            right: 0,
            bottom: 2,
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: palette.teal600,
            borderWidth: 2,
            borderColor: palette.white,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="check" size={11} color={palette.white} strokeWidth={3.2} />
        </View>
      )}
    </View>
  );
}
