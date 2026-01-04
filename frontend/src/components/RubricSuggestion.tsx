import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../styles';

type Props = {
  item: { path: string; confidence?: number; evidence?: string };
  onPress?: (item: Props['item']) => void;
};

export default function RubricSuggestion({ item, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress && onPress(item)}>
      <Text style={styles.path}>{item.path}</Text>
      <Text style={styles.conf}>{(item.confidence ?? 0).toFixed(2)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, marginBottom: 8 },
  path: { fontWeight: '600', color: Colors.text },
  conf: { color: '#666', marginTop: 4 }
});
