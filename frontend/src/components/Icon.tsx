import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../styles';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

export default function CustomIcon({ name, size = 24, color = Colors.text, style }: IconProps) {
  return (
    <Icon 
      name={name} 
      size={size} 
      color={color} 
      style={style}
    />
  );
}