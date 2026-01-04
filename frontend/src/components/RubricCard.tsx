import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Shadows } from '../styles';

interface RubricCardProps {
  path: string;
  confidence: number;
  evidence: string;
  category?: string;
  onPress?: () => void;
}

export default function RubricCard({ path, confidence, evidence, category, onPress }: RubricCardProps) {
  const confidencePercent = Math.round(confidence * 100);

  return (
    <TouchableOpacity style={[styles.card, Shadows.small]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.path}>{path}</Text>
        <View style={styles.confidenceBadge}>
          <Text style={styles.confidenceText}>{confidencePercent}%</Text>
        </View>
      </View>
      <Text style={styles.evidence}>{evidence}</Text>
      {category && <Text style={styles.category}>{category}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  path: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  confidenceBadge: {
    backgroundColor: Colors.lightPurple,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 45,
    alignItems: 'center',
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  evidence: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  category: {
    fontSize: 11,
    color: Colors.textLight,
    marginTop: 6,
    fontStyle: 'italic',
  },
});