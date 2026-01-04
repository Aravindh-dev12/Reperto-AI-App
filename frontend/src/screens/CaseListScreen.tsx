import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, StatusBar } from 'react-native';
import { Colors, Shadows } from '../styles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import PatientCard from '../components/PatientCard';

type CasesNav = NativeStackNavigationProp<RootStackParamList, 'Cases'>;

type Props = {
  navigation: CasesNav;
};

const recentCases = [
  { id: '1', name: 'Rajesh Kumar', initials: 'RK', specialty: 'Male, 65 - Food & Chills', time: 'TODAY 10:30 AM' },
  { id: '2', name: 'Anita Desai', initials: 'AD', specialty: 'Female, 32 - Migraine', time: 'Yesterday' },
];

export default function CaseListScreen({ navigation }: Props) {
  const [search, setSearch] = useState('');

  const filteredCases = recentCases.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.doctorName}>Dr. Sharma</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search patient name, ID, or phone"
          placeholderTextColor={Colors.textLight}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Mode Indicator */}
      <View style={[styles.modeIndicator, Shadows.small]}>
        <Text style={styles.modeLabel}>📱 Offline Mode: Data Local</Text>
      </View>

      {/* Start Consultation Card */}
      <View style={[styles.consultationCard, Shadows.medium]}>
        <Text style={styles.consultationTitle}>Start Consultation</Text>
        <Text style={styles.consultationText}>Begin a new case or chronic case intake.</Text>
        
        <View style={styles.consultationButtons}>
          <TouchableOpacity
            style={[styles.consultationBtn, styles.newCaseBtn]}
            onPress={() => navigation.navigate('EditCase')}
          >
            <Text style={styles.btnText}>New Case</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.consultationBtn, styles.acuteBtn]} onPress={() => {}}>
            <Text style={[styles.btnText, { color: Colors.text }]}>Acute</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Cases Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Cases</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Cases List */}
      <FlatList
        data={filteredCases}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('EditCase', { caseId: item.id })}>
            <PatientCard
              name={item.name}
              initials={item.initials}
              specialty={item.specialty}
              time={item.time}
            />
          </TouchableOpacity>
        )}
        scrollEnabled={false}
        contentContainerStyle={styles.casesList}
      />

      {/* New Case FAB */}
      <TouchableOpacity
        style={[styles.fab, Shadows.large]}
        onPress={() => navigation.navigate('EditCase')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  doctorName: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: Colors.lightGray,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
  },
  modeIndicator: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  modeLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  consultationCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    padding: 18,
    overflow: 'hidden',
  },
  consultationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textWhite,
    marginBottom: 6,
  },
  consultationText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
  },
  consultationButtons: {
    flexDirection: 'row',
  },
  consultationBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  newCaseBtn: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  acuteBtn: {
    backgroundColor: Colors.background,
  },
  btnText: {
    fontWeight: '700',
    fontSize: 14,
    color: Colors.textWhite,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  viewAll: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  casesList: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabIcon: {
    fontSize: 28,
    color: Colors.textWhite,
    fontWeight: '700',
  },
});