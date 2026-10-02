import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { computeTreeState, nodeOrder, LEVEL1_NODES, type SkillNode } from '@natanga/core';
import { Button, ProgressBar, Text } from '@natanga/ui';
import { colors, spacing } from '@natanga/ui/tokens';

export interface SkillTreeScreenProps {
  onSelectNode: (node: SkillNode) => void;
}

/**
 * Écran arbre de compétences (US-05) : liste des nœuds avec leur statut de déblocage.
 */
export function SkillTreeScreen({ onSelectNode }: SkillTreeScreenProps) {
  // Progression simulée (socle UI) — sera reliée au profil/Persistance.
  const [mastered] = useState<string[]>(['n-letters-a']);
  const progress = mastered.map((nodeId) => ({
    childId: 'demo',
    nodeId,
    status: 'mastered' as const,
    masteredScore: 1,
  }));
  const tree = computeTreeState(LEVEL1_NODES, progress);

  const nodes = nodeOrder(LEVEL1_NODES);
  const statusOf = (nodeId: string) => tree.find((t) => t.nodeId === nodeId)?.status ?? 'locked';

  return (
    <ScrollView style={styles.container}>
      <Text variant="title" accessibilityRole="header">
        Mon parcours
      </Text>

      {nodes.map((node) => {
        const status = statusOf(node.id);
        const statusLabel = {
          locked: 'Verrouillé',
          available: 'Disponible',
          in_progress: 'En cours',
          mastered: 'Terminé',
        }[status];

        return (
          <View
            key={node.id}
            style={[styles.node, status === 'locked' && styles.locked]}
            accessibilityRole="button"
            accessibilityLabel={`${node.title} — ${statusLabel}`}
          >
            <Text variant="body">{node.title}</Text>
            <Text variant="caption" muted>
              {statusLabel}
            </Text>
            {status !== 'locked' ? (
              <Button
                variant={status === 'mastered' ? 'ghost' : 'primary'}
                onPress={() => onSelectNode(node)}
                accessibilityLabel={`Ouvrir ${node.title}`}
              >
                {status === 'mastered' ? 'Revoir' : 'Commencer'}
              </Button>
            ) : null}
          </View>
        );
      })}

      <View style={styles.progressRow}>
        <Text variant="caption" muted>
          Progression globale
        </Text>
        <ProgressBar value={mastered.length / LEVEL1_NODES.length} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, gap: spacing.md },
  node: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.sm,
  },
  locked: { opacity: 0.55 },
  progressRow: { marginTop: spacing.lg, gap: spacing.sm },
});
