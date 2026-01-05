import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Colors, Shadows } from '../styles';
import { api, analyzeCase, suggestComplaint } from '../services/api';
import RubricCard from '../components/RubricCard';
import Badge from '../components/Badge';

export default function CaseEditScreen({ navigation, route }: any) {
  const caseId = route.params?.caseId;
  const [loading, setLoading] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [complaint, setComplaint] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [caseData, setCaseData] = useState<any>(null);

  useEffect(() => {
    if (caseId) {
      loadCase();
    }
  }, [caseId]);

  const loadCase = async () => {
    try {
      const response = await api.get(`/cases/${caseId}`);
      setCaseData(response.data.case);
      if (response.data.rubrics?.length > 0) {
        setAnalysis({
          rubrics: response.data.rubrics,
          remedies: response.data.remedies,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load case');
    }
  };

  const handleAnalyze = async () => {
    if (!complaint.trim()) {
      Alert.alert('Error', 'Please enter patient complaint');
      return;
    }

    if (!caseData && !caseId) {
      Alert.alert('Error', 'Please select or create a case first');
      return;
    }

    setLoading(true);
    try {
      const result = await analyzeCase(caseId || caseData.id, complaint);
      setAnalysis(result);
      Alert.alert('Success', 'Analysis completed');
    } catch (error) {
      Alert.alert('Error', 'Failed to analyze case');
    } finally {
      setLoading(false);
    }
  };

  const handleGetSuggestion = async () => {
    if (!complaint.trim()) {
      Alert.alert('Error', 'Please enter some text first');
      return;
    }

    setSuggesting(true);
    try {
      const result = await suggestComplaint(complaint);
      setSuggestion(result.suggestion);
    } catch (error) {
      Alert.alert('Error', 'Failed to get suggestion');
    } finally {
      setSuggesting(false);
    }
  };

  const applySuggestion = () => {
    if (suggestion) {
      setComplaint(suggestion);
      setSuggestion('');
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
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
          <Text style={styles.headerTitle}>
            {caseId ? 'Edit Case' : 'New Case Analysis'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {caseData?.patient_name || 'No patient selected'}
          </Text>
        </View>

        {/* Complaint Input */}
        <View style={[styles.card, Shadows.small]}>
          <Text style={styles.label}>Patient Complaint</Text>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={6}
            placeholder="Describe symptoms, history, duration..."
            placeholderTextColor={Colors.textLight}
            value={complaint}
            onChangeText={setComplaint}
            editable={!loading}
          />

          {/* AI Suggestion */}
          {suggestion && (
            <View style={styles.suggestionCard}>
              <Text style={styles.suggestionTitle}>AI Suggestion:</Text>
              <Text style={styles.suggestionText}>{suggestion}</Text>
              <TouchableOpacity
                style={styles.applySuggestionBtn}
                onPress={applySuggestion}
              >
                <Text style={styles.applySuggestionText}>Apply Suggestion</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.suggestionBtn, suggesting && styles.btnDisabled]}
              onPress={handleGetSuggestion}
              disabled={suggesting || loading}
            >
              {suggesting ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Text style={styles.suggestionBtnText}>Get AI Suggestion</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.analyzeBtn, loading && styles.btnDisabled]}
              onPress={handleAnalyze}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={Colors.textWhite} />
              ) : (
                <Text style={styles.analyzeBtnText}>Analyze</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Analysis Results */}
        {analysis && (
          <>
            {/* Rubrics */}
            {analysis.rubrics?.length > 0 && (
              <View style={styles.resultsSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Suggested Rubrics</Text>
                  <Badge label={`${analysis.rubrics.length} found`} type="purple" />
                </View>

                {analysis.rubrics.map((rubric: any, index: number) => (
                  <RubricCard
                    key={index}
                    path={rubric.path}
                    confidence={rubric.confidence}
                    evidence={rubric.evidence}
                    category={rubric.category}
                  />
                ))}

                <TouchableOpacity
                  style={[styles.actionBtn, Shadows.small]}
                  onPress={() =>
                    navigation.navigate('Review', {
                      confirmed: analysis.rubrics,
                    })
                  }
                >
                  <Text style={styles.actionBtnText}>Review All Rubrics</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Remedies */}
            {analysis.remedies?.length > 0 && (
              <View style={styles.resultsSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Suggested Remedies</Text>
                  <Badge label={`${analysis.remedies.length} found`} type="green" />
                </View>

                {analysis.remedies.slice(0, 3).map((remedy: any, index: number) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.remedyCard, Shadows.small]}
                    onPress={() =>
                      navigation.navigate('RemedyResults', {
                        caseId: caseId || caseData?.id,
                      })
                    }
                  >
                    <View style={styles.remedyHeader}>
                      <Text style={styles.remedyName}>{remedy.name}</Text>
                      <View style={styles.percentageBadge}>
                        <Text style={styles.percentageText}>
                          {Math.round(remedy.percentage)}%
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.remedyDetails}>
                      {remedy.details || 'No details available'}
                    </Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  style={[styles.actionBtn, Shadows.small]}
                  onPress={() =>
                    navigation.navigate('RemedyResults', {
                      caseId: caseId || caseData?.id,
                    })
                  }
                >
                  <Text style={styles.actionBtnText}>View All Remedies</Text>
                </TouchableOpacity>
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
    fontSize: 14,
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
    minHeight: 120,
    textAlignVertical: 'top',
  },
  suggestionCard: {
    backgroundColor: Colors.lightPurple,
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  suggestionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 6,
  },
  suggestionText: {
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
    marginBottom: 10,
  },
  applySuggestionBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  applySuggestionText: {
    color: Colors.textWhite,
    fontSize: 12,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  suggestionBtn: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  suggestionBtnText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  analyzeBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  analyzeBtnText: {
    color: Colors.textWhite,
    fontWeight: '700',
    fontSize: 14,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  resultsSection: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  actionBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  actionBtnText: {
    color: Colors.textWhite,
    fontWeight: '700',
    fontSize: 14,
  },
  remedyCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  remedyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  remedyName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  percentageBadge: {
    backgroundColor: Colors.lightPurple,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  percentageText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  remedyDetails: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});