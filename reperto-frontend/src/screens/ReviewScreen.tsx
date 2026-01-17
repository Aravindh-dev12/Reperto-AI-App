import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Colors, Shadows } from '../styles';
import RubricSuggestionCard from '../components/RubricSuggestionCard';
import { scoreRubrics } from '../services/api';

export default function ReviewScreen({ route, navigation }: any) {
  const { analysisResult, doctorText } = route.params || {};
  
  const [rubrics, setRubrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (analysisResult?.rubrics) {
      setRubrics(analysisResult.rubrics.map((r: any) => ({
        ...r,
        selected: true
      })));
    }
  }, [analysisResult]);

  const toggleRubric = (index: number) => {
    const newRubrics = [...rubrics];
    newRubrics[index].selected = !newRubrics[index].selected;
    setRubrics(newRubrics);
  };

  const removeRubric = (index: number) => {
    const newRubrics = rubrics.filter((_, i) => i !== index);
    setRubrics(newRubrics);
  };

  const handleProceed = async () => {
    const confirmed = rubrics.filter(r => r.selected).map(r => r.rubric);
    
    if (confirmed.length === 0) {
      Alert.alert("Selection Required", "Please confirm at least one rubric to proceed to decision support.");
      return;
    }

    setLoading(true);
    try {
      const response = await scoreRubrics(confirmed);
      navigation.navigate('RemedyResults', {
        remedies: response.remedies,
        confirmedRubrics: confirmed,
        analysisSummary: analysisResult?.summary
      });
    } catch (err) {
      console.error(err);
      Alert.alert("Scoring Error", "Failed to calculate remedy scores. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Review System Understanding</Text>
          <Text style={styles.headerSubtitle}>Phase 2: Confirm or adjust identified rubrics</Text>
        </View>

        {/* AI Clinical Summary */}
        {analysisResult?.summary && (
          <View style={[styles.summaryCard, Shadows.small]}>
            <Text style={styles.summaryTitle}>Clinical Interpretation:</Text>
            <Text style={styles.summaryText}>{analysisResult.summary}</Text>
          </View>
        )}

        {/* Doctor Context */}
        <View style={[styles.contextCard, Shadows.small]}>
          <Text style={styles.contextLabel}>Original Notes:</Text>
          <Text style={styles.contextText} numberOfLines={3}>"{doctorText}"</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>IDENTIFIED RUBRICS</Text>
          <Text style={styles.sectionBadge}>{rubrics.length}</Text>
        </View>

        {/* Suggested Rubrics List */}
        {rubrics.map((item, index) => (
          <RubricSuggestionCard
            key={index}
            rubric={item.rubric}
            confidence={item.confidence}
            matchedTokens={item.matched}
            rationale={item.rationale}
            selected={item.selected}
            onToggle={() => toggleRubric(index)}
            onRemove={() => removeRubric(index)}
          />
        ))}

        {rubrics.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No rubrics identified. Go back to edit notes.</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.proceedBtn, loading && styles.btnDisabled]}
            onPress={handleProceed}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.proceedBtnText}>Proceed to CDSS Results</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.backBtn]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backBtnText}>Edit Case Notes</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This is a Decision Support System. The physician maintains final clinical authority over all selections.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginTop: 4,
  },
  contextCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 4,
    borderLeftColor: Colors.textSecondary,
  },
  summaryCard: {
    backgroundColor: Colors.lightPurple,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  summaryText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
    fontWeight: '500',
  },
  contextLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  contextText: {
    fontSize: 14,
    color: Colors.text,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textLight,
    letterSpacing: 1,
    marginRight: 8,
  },
  sectionBadge: {
    backgroundColor: Colors.border,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    overflow: 'hidden',
  },
  actionButtons: {
    marginTop: 24,
    gap: 12,
  },
  actionBtn: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  proceedBtn: {
    backgroundColor: Colors.primary,
  },
  proceedBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  backBtn: {
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  backBtnText: {
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    color: Colors.textLight,
    textAlign: 'center',
  },
  footer: {
    marginTop: 32,
    paddingHorizontal: 10,
  },
  footerText: {
    fontSize: 11,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 16,
  },
});
