import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { Colors, Shadows } from '../styles';
import { api } from '../services/api';
import RemedyResultCard from '../components/RemedyResultCard';

export default function CaseDetailScreen({ route, navigation }: any) {
  const { caseId } = route.params;
  const [loading, setLoading] = useState(true);
  const [caseData, setCaseData] = useState<any>(null);

  useEffect(() => {
    fetchCaseDetails();
  }, [caseId]);

  async function fetchCaseDetails() {
    try {
      const res = await api.get(`/cases`);
      // Since backend uses in-memory list for demo, we find it in the list
      const found = res.data.find((c: any) => c.id === caseId);
      if (found) {
        setCaseData(found);
      }
    } catch (error) {
      console.error("Error fetching case details:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!caseData) {
    return (
      <View style={styles.center}>
        <Text>Case not found.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.patientName}>{caseData.name}</Text>
          <Text style={styles.caseTime}>{caseData.time} • {caseData.specialty}</Text>
        </View>

        {/* Clinical Summary */}
        {caseData.summary && (
          <View style={[styles.section, Shadows.small]}>
            <Text style={styles.sectionTitle}>CLINICAL INTERPRETATION</Text>
            <Text style={styles.summaryText}>{caseData.summary}</Text>
          </View>
        )}

        {/* Rubrics Confirmation */}
        {caseData.rubrics && caseData.rubrics.length > 0 && (
          <View style={[styles.section, Shadows.small]}>
            <Text style={styles.sectionTitle}>CONFIRMED RUBRICS</Text>
            <View style={styles.tagContainer}>
              {caseData.rubrics.map((path: string, i: number) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{path}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Remedies Results */}
        {caseData.remedies && caseData.remedies.length > 0 && (
          <View style={styles.resultsSection}>
            <Text style={styles.sectionTitle}>SAVED REMEDY SUGGESTIONS</Text>
            {caseData.remedies.map((item: any, index: number) => (
              <RemedyResultCard
                key={index}
                rank={index + 1}
                remedyName={item.remedy}
                score={item.score}
                rationale={item.rationale || "Clinically indicated based on confirmed rubrics."}
                contributions={item.rubrics || []}
              />
            ))}
          </View>
        )}

        <TouchableOpacity 
          style={styles.doneBtn} 
          onPress={() => navigation.navigate('Cases')}
        >
          <Text style={styles.doneBtnText}>Close Case View</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  header: {
    marginBottom: 24,
  },
  patientName: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
  },
  caseTime: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  section: {
    backgroundColor: Colors.lightGray,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1,
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagText: {
    fontSize: 13,
    color: Colors.text,
  },
  resultsSection: {
    marginTop: 10,
    marginBottom: 30,
  },
  doneBtn: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  doneBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  backBtn: {
    marginTop: 20,
    padding: 12,
  },
  backBtnText: {
    color: Colors.primary,
    fontWeight: '600',
  }
});
