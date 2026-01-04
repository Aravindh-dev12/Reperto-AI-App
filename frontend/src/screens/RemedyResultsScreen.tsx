import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Colors, Shadows } from '../styles';

interface Remedy {
  name: string;
  percentage: number;
  matchedRubrics: string[];
  gradeLevel?: number;
  details?: string;
}

const remedyResults: Remedy[] = [
  {
    name: 'Nux Vomica',
    percentage: 98,
    matchedRubrics: ['Mind-Irritable, Impatient', 'Stomach: Nausea morning', 'Sleep: Sleeplessness from heartburn'],
    gradeLevel: 3,
  },
  {
    name: 'Arsenicum Album',
    percentage: 98,
    matchedRubrics: ['4 Rubrics Matched'],
  },
  {
    name: 'Sulphur',
    percentage: 82,
    matchedRubrics: ['3 Rubrics Matched'],
  },
  {
    name: 'Pulsatilla',
    percentage: 75,
    matchedRubrics: ['2 Rubrics Matched'],
  },
  {
    name: 'Lycopodium',
    percentage: 70,
    matchedRubrics: ['3 Rubrics Matched'],
  },
];

export default function RemedyResultsScreen({ navigation }: any) {
  const getPercentageColor = (percentage: number) => {
    if (percentage >= 90) return Colors.success;
    if (percentage >= 75) return Colors.warning;
    return Colors.info;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Remedy Results</Text>
          <Text style={styles.headerSubtitle}>Reperto AI - Powered by OpenAI</Text>
        </View>

        {/* Patient Info Card */}
        <View style={[styles.patientCard, Shadows.small]}>
          <View>
            <Text style={styles.patientName}>Rahul Gupta</Text>
            <View style={styles.patientMeta}>
              <Text style={styles.metaText}>ID: 012345</Text>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.metaText}>Male</Text>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.metaText}>34 Years</Text>
            </View>
          </View>
          <Text style={styles.warningEmoji}>⚠️</Text>
        </View>

        {/* Decision Support Notice */}
        <View style={[styles.noticeCard, Shadows.small]}>
          <Text style={styles.noticeTitle}>Decision Support Only</Text>
          <Text style={styles.noticeText}>
            Clinical consultation requires no automatic prescription action taken.
          </Text>
        </View>

        {/* Remedies List */}
        <View style={styles.remediesSection}>
          <Text style={styles.sectionTitle}>Top Matched Remedies</Text>

          {remedyResults.map((remedy, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.remedyCard, Shadows.small]}
              activeOpacity={0.7}
            >
              <View style={styles.remedyHeader}>
                <View style={styles.remedyInfo}>
                  <Text style={styles.remedyName}>{remedy.name}</Text>
                  <Text style={styles.matchedCount}>{remedy.matchedRubrics.length} rubrics matched</Text>
                </View>
                <View style={styles.percentageContainer}>
                  <View
                    style={[
                      styles.percentageCircle,
                      { borderColor: getPercentageColor(remedy.percentage) },
                    ]}
                  >
                    <Text style={[styles.percentage, { color: getPercentageColor(remedy.percentage) }]}>
                      {remedy.percentage}%
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.rubricsContainer}>
                {remedy.matchedRubrics.map((rubric, idx) => (
                  <View key={idx} style={styles.rubricTag}>
                    <Text style={styles.rubricTagText}>{rubric}</Text>
                  </View>
                ))}
              </View>

              {remedy.gradeLevel && (
                <View style={styles.gradeContainer}>
                  <Text style={styles.gradeLabel}>Grade: {remedy.gradeLevel}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer Note */}
        <View style={styles.footerNote}>
          <Text style={styles.footerNoteText}>
            Showing top 5 results based on reportation logic.
          </Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.saveBtn, Shadows.medium]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.saveBtnText}>Save Selection to Record</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backBtnText}>Back</Text>
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
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  patientCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
  },
  patientMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  metaDot: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  warningEmoji: {
    fontSize: 20,
  },
  noticeCard: {
    backgroundColor: Colors.yellowBadge,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.yellowText,
    marginBottom: 4,
  },
  noticeText: {
    fontSize: 12,
    color: Colors.yellowText,
    lineHeight: 16,
  },
  remediesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  remedyCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  remedyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  remedyInfo: {
    flex: 1,
  },
  remedyName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  matchedCount: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  percentageContainer: {
    marginLeft: 12,
  },
  percentageCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentage: {
    fontSize: 16,
    fontWeight: '700',
  },
  rubricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  rubricTag: {
    backgroundColor: Colors.lightPurple,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 6,
  },
  rubricTagText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '500',
  },
  gradeContainer: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  gradeLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  footerNote: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 16,
  },
  footerNoteText: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveBtnText: {
    color: Colors.textWhite,
    fontWeight: '700',
    fontSize: 14,
  },
  backBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtnText: {
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
});