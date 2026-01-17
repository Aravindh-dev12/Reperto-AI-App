import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Colors, Shadows } from '../styles';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Contribution {
  rubric: string;
  grades: number[];
  total: number;
}

interface Props {
  rank: number;
  remedyName: string;
  score: number;
  rationale?: string;
  contributions: Contribution[];
}

export default function RemedyResultCard({ rank, remedyName, score, rationale, contributions }: Props) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={[styles.card, Shadows.medium]}>
      <TouchableOpacity style={styles.mainContent} onPress={toggleExpand} activeOpacity={0.7}>
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>{rank}</Text>
        </View>
        
        <View style={styles.remedyInfo}>
          <Text style={styles.remedyName}>{remedyName}</Text>
          <Text style={styles.scoreLabel}>Total Score: <Text style={styles.scoreValue}>{score}</Text></Text>
        </View>

        <View style={styles.expandIcon}>
          <Text style={styles.arrowText}>{expanded ? '▲' : '▼'}</Text>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.details}>
          <View style={styles.divider} />
          {rationale && (
            <View style={styles.rationaleWrapper}>
              <Text style={styles.rationaleTitle}>CLINICAL INSIGHT:</Text>
              <Text style={styles.rationaleText}>{rationale}</Text>
            </View>
          )}
          <Text style={styles.explanationHeader}>Clinical Contributions:</Text>
          
          {contributions.map((c, i) => (
            <View key={i} style={styles.contributionRow}>
              <View style={styles.rubricInfo}>
                <Text style={styles.rubricPath}>{c.rubric}</Text>
                <Text style={styles.gradeInfo}>
                  Grades: {c.grades.join(', ')} | Subtotal: {c.total}
                </Text>
              </View>
              <View style={styles.gradeBadge}>
                <Text style={styles.gradeBadgeText}>+{c.total}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.lightPurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  remedyInfo: {
    flex: 1,
  },
  remedyName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  scoreLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  scoreValue: {
    fontWeight: '700',
    color: Colors.success,
  },
  expandIcon: {
    padding: 4,
  },
  arrowText: {
    fontSize: 12,
    color: Colors.textLight,
  },
  details: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: '#FAFAFA',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginBottom: 12,
  },
  explanationHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  rationaleWrapper: {
    backgroundColor: Colors.lightPurple,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  rationaleTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  rationaleText: {
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  contributionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    backgroundColor: Colors.background,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rubricInfo: {
    flex: 1,
    marginRight: 10,
  },
  rubricPath: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
    marginBottom: 2,
  },
  gradeInfo: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  gradeBadge: {
    backgroundColor: Colors.greenBadge,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  gradeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.greenText,
  },
});
