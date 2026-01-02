import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../styles';

export default function ReviewScreen({ route, navigation }: any) {
  const confirmed = route.params.confirmed;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirmed Rubrics</Text>
      {confirmed.map((c: any, i: number) => (
        <View key={i} style={styles.row}>
          <Text>{c.path}</Text>
          <Text>{(c.confidence * 100).toFixed(0)}%</Text>
        </View>
      ))}
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={{ color: '#fff' }}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: Colors.background, flex: 1 },
  title: { fontWeight: '700', marginBottom: 10 },
  row: { paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eee' },
  button: {
    marginTop: 20,
    backgroundColor: Colors.purple,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  }
});
