import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { parseText } from '../services/api';
import { Colors, Shadows } from '../styles';
import RubricCard from '../components/RubricCard';
import Badge from '../components/Badge';

export default function CaseEditScreen({ navigation }: any) {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [risk, setRisk] = useState('');
  const [rubrics, setRubrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  async function handleAnalyze() {
    if (!text.trim()) {
      Alert.alert('Error', 'Please enter patient complaint');
      return;
    }

    setLoading(true);
    try {
      const res = await parseText(text);

      setSummary(res.summary || '');
      setRisk(res.risk || 'unknown');

      setRubrics(
        Array.isArray(res.rubrics)
          ? res.rubrics.map((r: any) => ({
              path: r.path || 'Unknown',
              confidence: r.confidence ?? 0,
              evidence: r.evidence ?? '',
            }))
          : []
      );
      setAnalyzed(true);
    } catch (e) {
      Alert.alert('Error', 'Backend not reachable. Please start the backend server.');
    } finally {
      setLoading(false);
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'high':
        return Colors.danger;
      case 'medium':
        return Colors.warning;
      case 'low':
        return Colors.success;
      default:
        return Colors.textSecondary;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Analyze Case</Text>
          <Text style={styles.headerSubtitle}>Enter patient complaint for AI analysis</Text>
        </View>

        {/* Input Section */}
        <View style={[styles.card, Shadows.small]}>
          <Text style={styles.label}>Patient Complaint</Text>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={6}
            placeholder="Describe the patient's symptoms, medical history, and chief complaint..."
            placeholderTextColor={Colors.textLight}
            value={text}
            onChangeText={setText}
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.analyzeBtn, loading && styles.btnDisabled]}
            onPress={handleAnalyze}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={Colors.textWhite} style={{ marginRight: 8 }} />
            ) : null}
            <Text style={styles.analyzeBtnText}>{loading ? 'Analyzing...' : 'Analyze'}</Text>
          </TouchableOpacity>
        </View>

        {/* Analysis Results */}
        {analyzed && (
          <>
            {/* Summary Section */}
            <View style={[styles.card, Shadows.small, styles.resultCard]}>
              <Text style={styles.resultTitle}>Analysis Summary</Text>
              <Text style={styles.summaryText}>{summary}</Text>
              
              <View style={styles.riskContainer}>
                <Text style={styles.riskLabel}>Risk Level:</Text>
                <View
                  style={[
                    styles.riskBadge,
                    { backgroundColor: getRiskColor(risk) + '20' },
                  ]}
                >
                  <Text style={[styles.riskText, { color: getRiskColor(risk) }]}>
                    {risk.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>

            {/* Suggested Rubrics */}
            {rubrics.length > 0 && (
              <View>
                <View style={styles.rubricsHeader}>
                  <Text style={styles.rubricsTitle}>Suggested Rubrics</Text>
                  <View style={styles.rubricBadge}>
                    <Text style={styles.rubricCount}>{rubrics.length}</Text>
                  </View>
                </View>

                {rubrics.map((rubric, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => navigation.navigate('Review', { confirmed: [rubric] })}
                    activeOpacity={0.7}
                  >
                    <RubricCard
                      path={rubric.path}
                      confidence={rubric.confidence}
                      evidence={rubric.evidence}
                    />
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  style={[styles.confirmBtn, Shadows.small]}
                  onPress={() => navigation.navigate('Review', { confirmed: rubrics })}
                >
                  <Text style={styles.confirmBtnText}>Review All Rubrics</Text>
                </TouchableOpacity>
              </View>
            )}

            {rubrics.length === 0 && !loading && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No rubrics found. Try a different complaint.</Text>
              </View>
            )}
          </>
        )}
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
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 10,
  },
  input: {
    backgroundColor: Colors.lightGray,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    fontSize: 14,
    color: Colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  analyzeBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 14,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  analyzeBtnText: {
    color: Colors.textWhite,
    fontWeight: '700',
    fontSize: 14,
  },
  resultCard: {
    backgroundColor: 'rgba(124, 77, 255, 0.05)',
    borderColor: Colors.primary,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 14,
  },
  riskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  riskLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  riskText: {
    fontSize: 12,
    fontWeight: '700',
  },
  rubricsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  rubricsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  rubricBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  rubricCount: {
    color: Colors.textWhite,
    fontWeight: '700',
    fontSize: 12,
  },
  confirmBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  confirmBtnText: {
    color: Colors.textWhite,
    fontWeight: '700',
    fontSize: 14,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
