import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Shadows } from '../styles';

interface PatientCardProps {
  name: string;
  initials: string;
  specialty?: string;
  time?: string;
  onPress?: () => void;
}

export default function PatientCard({ name, initials, specialty, time, onPress }: PatientCardProps) {
  return (
    <View style={[styles.card, Shadows.small]}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.patientInfo}>
          <Text style={styles.name}>{name}</Text>
          {specialty && <Text style={styles.specialty}>{specialty}</Text>}
        </View>
      </View>
      {time && <Text style={styles.time}>{time}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textWhite,
  },
  patientInfo: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  specialty: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: Colors.textLight,
  },
});