import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { saveCase, analyzeCDSS } from '../services/api';
import { Colors, Shadows } from '../styles';
import RubricCard from '../components/RubricCard';
import Badge from '../components/Badge';

export default function CaseEditScreen({ navigation }: any) {
  const [patientName, setPatientName] = useState('');
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [risk, setRisk] = useState('');
  const [rubrics, setRubrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  async function handleSave() {
    if (!patientName.trim()) {
      Alert.alert('Error', 'Please enter patient name before saving');
      return;
    }

    setSaving(true);
    try {
      const initials = patientName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
      await saveCase({
        name: patientName,
        initials: initials,
        specialty: `Risk: ${risk.toUpperCase()} - ${summary.substring(0, 30)}...`,
        time: 'Just now'
      });
      
      Alert.alert(
        'Case Saved! ✅',
        'The patient case has been added to your recent consultations.',
        [{ text: 'View Home', onPress: () => navigation.navigate('Cases') }, { text: 'Stay Here' }]
      );
    } catch (e) {
      Alert.alert('Error', 'Failed to save case. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleAnalyze() {
    if (!text.trim()) {
      Alert.alert('Clinical Input Required', 'Please enter patient symptoms to begin analysis.');
      return;
    }

    setLoading(true);
    try {
      const response = await analyzeCDSS(text);
      
      if (response && response.result) {
        setSummary(response.result.summary || '');
        setAnalyzed(true);
        
        // Auto navigate if summary is received
        navigation.navigate('Review', {
          analysisResult: response.result,
          doctorText: text
        });
      } else {
        throw new Error("Invalid medical engine response");
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Medical Engine Offline', 'The Reperto Core is currently unreachable. Please ensure the backend server is running.');
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
          <Text style={styles.label}>Patient Name</Text>
          <TextInput
            style={[styles.input, { minHeight: 45, marginBottom: 12 }]}
            placeholder="e.g. Rajesh Kumar"
            placeholderTextColor={Colors.textLight}
            value={patientName}
            onChangeText={setPatientName}
            editable={!loading}
          />

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

        {/* Analysis Results - Redirect to Review */}
        {analyzed && (
          <TouchableOpacity
            style={[styles.confirmBtn, Shadows.small]}
            onPress={() => navigation.navigate('Review')}
          >
            <Text style={styles.confirmBtnText}>Continue to Review</Text>
          </TouchableOpacity>
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
  saveBtn: {
    marginTop: 20,
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  saveBtnText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 14,
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
