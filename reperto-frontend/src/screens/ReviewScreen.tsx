import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Colors, Shadows } from '../styles';
import Badge from '../components/Badge';

interface Rubric {
  path: string;
  confidence: number;
  evidence: string;
}

export default function ReviewScreen({ route, navigation }: any) {
  const confirmed = route.params?.confirmed || [];
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Group rubrics by category (first part of path)
  const groupedRubrics: { [key: string]: Rubric[] } = {};
  confirmed.forEach((rubric: Rubric) => {
    const category = rubric.path.split('>')[0].trim().toUpperCase();
    if (!groupedRubrics[category]) {
      groupedRubrics[category] = [];
    }
    groupedRubrics[category].push(rubric);
  });

  const categories = Object.keys(groupedRubrics);

  const getCategoryColor = (category: string): 'green' | 'orange' | 'purple' | 'yellow' => {
    const index = categories.indexOf(category);
    const colors: Array<'green' | 'orange' | 'purple' | 'yellow'> = ['purple', 'green', 'orange', 'yellow'];
    return colors[index % colors.length];
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Review Symptoms</Text>
          <Text style={styles.patientInfo}>Physician in doctor-controlled</Text>
        </View>

        {/* Patient Card */}
        <View style={[styles.patientCard, Shadows.small]}>
          <Text style={styles.patientName}>Rajesh Kumar</Text>
          <View style={styles.patientDetails}>
            <Text style={styles.patientDetail}>ID: 542309</Text>
            <Text style={styles.patientDetail}>Male, 65 Years</Text>
          </View>
        </View>

        {/* Symptoms by Category */}
        {categories.map((category) => (
          <View key={category} style={styles.categorySection}>
            <TouchableOpacity
              style={[styles.categoryHeader, Shadows.small]}
              onPress={() => setExpandedCategory(expandedCategory === category ? null : category)}
            >
              <View style={styles.categoryTitleContainer}>
                <Badge label={category} type={getCategoryColor(category)} />
                <Text style={styles.categoryTitle}>{category}</Text>
              </View>
              <Text style={styles.expandIcon}>
                {expandedCategory === category ? '▼' : '▶'}
              </Text>
            </TouchableOpacity>

            {expandedCategory === category && (
              <View style={styles.categoryContent}>
                {groupedRubrics[category].map((rubric, idx) => (
                  <View key={idx} style={[styles.symptomItem, idx !== groupedRubrics[category].length - 1 && styles.symptomBorder]}>
                    <View style={styles.symptomHeader}>
                      <Text style={styles.symptomPath}>{rubric.path}</Text>
                      <View style={styles.confidencePill}>
                        <Text style={styles.confidenceValue}>{Math.round(rubric.confidence * 100)}%</Text>
                      </View>
                    </View>
                    <Text style={styles.symptomEvidence}>{rubric.evidence}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* Add Another Rubric */}
        <TouchableOpacity style={styles.addBtn}>
          <Text style={styles.addBtnText}>+ Add another rubric</Text>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.authorizeBtnContainer]}
            onPress={() => navigation.navigate('Review')}
          >
            <Text style={styles.authorizeBtn}>Authorize Symptomization</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.secondaryBtnContainer]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryBtn}>Back</Text>
          </TouchableOpacity>
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
  patientInfo: {
    fontSize: 13,
    color: Colors.warning,
    fontWeight: '500',
    marginTop: 4,
  },
  patientCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  patientDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  patientDetail: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  categorySection: {
    marginBottom: 12,
  },
  categoryHeader: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  expandIcon: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  categoryContent: {
    backgroundColor: 'rgba(124, 77, 255, 0.03)',
    borderRadius: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: Colors.border,
  },
  symptomItem: {
    paddingVertical: 10,
  },
  symptomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  symptomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  symptomPath: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  confidencePill: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 45,
    alignItems: 'center',
  },
  confidenceValue: {
    color: Colors.textWhite,
    fontWeight: '700',
    fontSize: 11,
  },
  symptomEvidence: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginTop: 2,
  },
  addBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginVertical: 16,
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  actionButtons: {
    gap: 12,
    marginTop: 12,
  },
  actionBtn: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  authorizeBtnContainer: {
    backgroundColor: Colors.primary,
  },
  authorizeBtn: {
    color: Colors.textWhite,
    fontWeight: '700',
    fontSize: 14,
  },
  secondaryBtnContainer: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  secondaryBtn: {
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
});
