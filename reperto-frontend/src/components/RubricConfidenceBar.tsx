import React from 'react';
import { View, StyleSheet, DimensionValue } from 'react-native';
import { Colors } from '../styles';

interface Props {
  confidence: number; // 0 to 1
  height?: number;
}

export default function RubricConfidenceBar({ confidence, height = 4 }: Props) {
  const width: DimensionValue = `${Math.min(Math.max(confidence * 100, 0), 100)}%`;
  
  // Color based on confidence
  let barColor = Colors.info;
  if (confidence > 0.8) barColor = Colors.success;
  else if (confidence < 0.4) barColor = Colors.warning;

  return (
    <View style={[styles.container, { height }]}>
      <View style={[styles.bar, { width, height, backgroundColor: barColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  bar: {
    borderRadius: 2,
  },
});
