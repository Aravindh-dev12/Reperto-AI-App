import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Shadows } from '../styles';
import RubricConfidenceBar from './RubricConfidenceBar';

interface Props {
  rubric: string;
  confidence: number;
  matchedTokens: string[];
  rationale?: string;
  selected: boolean;
  onToggle: () => void;
  onRemove: () => void;
}

export default function RubricSuggestionCard({
  rubric,
  confidence,
  matchedTokens,
  rationale,
  selected,
  onToggle,
  onRemove,
}: Props) {
  return (
    <View style={[styles.card, Shadows.small, !selected && styles.cardInactive]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.content} onPress={onToggle}>
          <Text style={[styles.rubricText, !selected && styles.textInactive]}>{rubric}</Text>
          <View style={styles.meta}>
            <View style={styles.confidenceWrapper}>
              <Text style={styles.confidenceLabel}>Confidence: {(confidence * 100).toFixed(0)}%</Text>
              <RubricConfidenceBar confidence={confidence} />
            </View>
          </View>
          {matchedTokens.length > 0 && (
            <View style={styles.tokenContainer}>
              {matchedTokens.map((token, i) => (
                <View key={i} style={styles.tokenBadge}>
                  <Text style={styles.tokenText}>{token}</Text>
                </View>
              ))}
            </View>
          )}
          {rationale && (
            <View style={styles.rationaleContainer}>
              <Text style={styles.rationaleText}>{rationale}</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.checkbox, selected ? styles.checkboxSelected : styles.checkboxUnselected]} 
            onPress={onToggle}
          >
            {selected && <View style={styles.checkmark} />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
             <Text style={styles.removeText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardInactive: {
    backgroundColor: Colors.lightGray,
    borderColor: 'transparent',
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
  },
  content: {
    flex: 1,
  },
  rubricText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  textInactive: {
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  meta: {
    marginBottom: 10,
  },
  confidenceWrapper: {
    width: '60%',
  },
  confidenceLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  tokenContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  tokenBadge: {
    backgroundColor: Colors.lightPurple,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  tokenText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '500',
  },
  rationaleContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  rationaleText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  actions: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxUnselected: {
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  checkmark: {
    width: 10,
    height: 10,
    backgroundColor: Colors.background,
    borderRadius: 2,
  },
  removeBtn: {
    marginTop: 20,
    padding: 4,
  },
  removeText: {
    fontSize: 18,
    color: Colors.textLight,
  },
});
