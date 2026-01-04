import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SignupScreenNavigationProp } from '../navigation/types';
import { signup } from '../services/api';
import { Colors, Shadows } from '../styles';

type Props = {
  navigation: SignupScreenNavigationProp;
};

export default function SignupScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!name || !email || !password) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await signup(name, email, password);
      if (res?.status === 'ok') {
        Alert.alert('Success', 'Account created! Please log in.', [
          { text: 'OK', onPress: () => navigation.replace('Login') }
        ]);
      } else {
        throw new Error('Signup failed');
      }
    } catch (e) {
      Alert.alert('Signup failed', 'Could not create account. Try a different email.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.logo}>Reperto AI</Text>
          <Text style={styles.subtitle}>Medical Case Review & Analysis</Text>
        </View>

        <View style={[styles.card, Shadows.medium]}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.description}>Join our medical analysis platform</Text>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={[styles.input, { borderColor: name ? Colors.primary : Colors.border }]}
                placeholder="Enter your full name"
                placeholderTextColor={Colors.textLight}
                value={name}
                onChangeText={setName}
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, { borderColor: email ? Colors.primary : Colors.border }]}
                placeholder="Enter your email"
                placeholderTextColor={Colors.textLight}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[styles.input, { borderColor: password ? Colors.primary : Colors.border }]}
                placeholder="At least 6 characters"
                placeholderTextColor={Colors.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSignup}
              disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? 'Creating account...' : 'Sign Up'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={loading}>
              <Text style={styles.footerLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.disclaimer}>By signing up, you agree to our terms and conditions.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  formContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: 12,
    borderRadius: 10,
    backgroundColor: Colors.lightGray,
    fontSize: 14,
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.textWhite,
    fontWeight: '700',
    fontSize: 15,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  footerLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '700',
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 20,
  },
});