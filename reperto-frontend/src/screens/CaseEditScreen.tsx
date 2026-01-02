import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { parseText } from '../services/api';
import { Colors } from '../styles';

export default function CaseEditScreen({ navigation }: any) {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [risk, setRisk] = useState('');
  const [rubrics, setRubrics] = useState<any[]>([]);

  async function handleSuggest() {
    try {
      const res = await parseText(text);

      setSummary(res.summary);
      setRisk(res.risk);

      setRubrics(
        Array.isArray(res.rubrics)
          ? res.rubrics.map((r: any) => ({
              path: r.path,
              confidence: r.confidence ?? 0,
              evidence: r.evidence ?? ''
            }))
          : []
      );
    } catch {
      Alert.alert('Error', 'Backend not reachable');
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Patient complaint</Text>
      <TextInput
        style={styles.input}
        multiline
        value={text}
        onChangeText={setText}
      />

      <TouchableOpacity style={styles.button} onPress={handleSuggest}>
        <Text style={styles.buttonText}>Analyze</Text>
      </TouchableOpacity>

      {summary !== '' && (
        <View style={styles.card}>
          <Text style={styles.title}>Summary</Text>
          <Text>{summary}</Text>
          <Text style={{ marginTop: 6, color: Colors.purple }}>
            Risk: {risk}
          </Text>
        </View>
      )}

      {rubrics.map((r, i) => (
        <TouchableOpacity
          key={i}
          style={styles.card}
          onPress={() => navigation.navigate('Review', { confirmed: [r] })}
        >
          <Text style={{ fontWeight: '600' }}>{r.path}</Text>
          <Text style={{ color: '#666' }}>
            {(r.confidence * 100).toFixed(0)}% — {r.evidence}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, backgroundColor: Colors.background },
  label: { fontWeight: '700', marginBottom: 6 },
  input: {
    minHeight: 100,
    backgroundColor: Colors.lightPurple,
    borderRadius: 8,
    padding: 10
  },
  button: {
    marginTop: 10,
    backgroundColor: Colors.purple,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: { color: '#fff', fontWeight: '700' },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginTop: 10
  },
  title: { fontWeight: '700', marginBottom: 4 }
});
