import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Shadows } from '../styles';

interface BadgeProps {
  label: string;
  type?: 'green' | 'orange' | 'yellow' | 'purple' | 'default';
}

export default function Badge({ label, type = 'default' }: BadgeProps) {
  const getColors = () => {
    switch (type) {
      case 'green':
        return { bg: Colors.greenBadge, text: Colors.greenText };
      case 'orange':
        return { bg: Colors.orangeBadge, text: Colors.orangeText };
      case 'yellow':
        return { bg: Colors.yellowBadge, text: Colors.yellowText };
      case 'purple':
        return { bg: Colors.purpleBadge, text: Colors.purpleText };
      default:
        return { bg: Colors.lightGray, text: Colors.textSecondary };
    }
  };

  const colors = getColors();

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.badgeText, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginRight: 6,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
