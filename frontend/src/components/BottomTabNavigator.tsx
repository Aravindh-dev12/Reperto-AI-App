import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomIcon from './Icon';
import { Colors } from '../styles';

interface Tab {
  name: string;
  label: string;
  iconName: string;
  screen: string;
}

const tabs: Tab[] = [
  { name: 'Home', label: 'Home', iconName: 'home', screen: 'Home' },
  { name: 'Cases', label: 'Cases', iconName: 'file-document-multiple', screen: 'Cases' },
  { name: 'Patients', label: 'Patients', iconName: 'account-multiple', screen: 'Patients' },
  { name: 'Settings', label: 'Settings', iconName: 'cog', screen: 'Settings' },
];

export default function BottomTabNavigator() {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = route.name === tab.name;
        const iconColor = isActive ? Colors.primary : Colors.textSecondary;
        const labelColor = isActive ? Colors.primary : Colors.textSecondary;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => navigation.navigate(tab.screen as never)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
              <CustomIcon 
                name={tab.iconName} 
                size={24} 
                color={iconColor}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingVertical: 12,
    paddingHorizontal: 4,
    elevation: 8,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  activeIconContainer: {
    backgroundColor: Colors.lightPurple,
  },
});