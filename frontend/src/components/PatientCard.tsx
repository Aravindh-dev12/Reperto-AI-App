import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Shadows } from '../styles';
import CustomIcon from './Icon';

interface PatientCardProps {
  name: string;
  initials: string;
  specialty?: string;
  time?: string;
  onPress?: () => void;
}

export default function PatientCard({ name, initials, specialty, time, onPress }: PatientCardProps) {
  return (
    <TouchableOpacity style={[styles.card, Shadows.small]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardContent}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.patientInfo}>
            <Text style={styles.name} numberOfLines={1}>{name}</Text>
            {specialty && (
              <Text style={styles.specialty} numberOfLines={2}>{specialty}</Text>
            )}
          </View>
        </View>
        
        <View style={styles.rightSection}>
          {time && (
            <View style={styles.timeContainer}>
              <CustomIcon name="clock-outline" size={12} color={Colors.textLight} />
              <Text style={styles.time}>{time}</Text>
            </View>
          )}
          <CustomIcon name="chevron-right" size={20} color={Colors.textSecondary} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
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
    marginBottom: 4,
  },
  specialty: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  time: {
    fontSize: 11,
    color: Colors.textLight,
    marginLeft: 4,
  },
});