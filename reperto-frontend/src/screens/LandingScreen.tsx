import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Dimensions, Platform } from 'react-native';
import { Colors, Shadows } from '../styles';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const HERO_SIZE = isWeb ? Math.min(width * 0.25, 200) : width * 0.6;

export default function LandingScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Branding Section */}
        <View style={styles.brandWrapper}>
          <Text style={styles.brandTitle}>Reperto AI</Text>
          <View style={styles.brandUnderline} />
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={[styles.heroImageWrapper, Shadows.medium]}>
             {/* Styled placeholder for medical logo/image */}
             <View style={styles.logoCircle}>
                <Text style={styles.logoIcon}>🩺</Text>
             </View>
             <View style={styles.aiPulse} />
          </View>
          
          <Text style={styles.heroTitle}>Smart Clinical Decision Support</Text>
          <Text style={styles.heroSubtitle}>
            Empowering homeopathic practitioners with high-precision rubric mapping and clinical intelligence.
          </Text>
        </View>

        {/* Action Section */}
        <View style={styles.actionWrapper}>
          <TouchableOpacity 
            style={[styles.getStartedBtn, Shadows.medium]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
          
          <Text style={styles.footerText}>
            Advanced Proforma System • Secure & Authoritative
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center', // Center everything for web/mobile
    paddingVertical: 40,
  },
  brandWrapper: {
    alignItems: 'center',
    marginBottom: 40, // Add margin
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1,
  },
  brandUnderline: {
    width: 40,
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    marginTop: 4,
  },
  heroSection: {
    alignItems: 'center',
  },
  heroImageWrapper: {
    width: HERO_SIZE,
    height: HERO_SIZE,
    backgroundColor: Colors.lightPurple,
    borderRadius: HERO_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  logoCircle: {
    width: '75%',
    height: '75%',
    backgroundColor: Colors.background,
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  logoIcon: {
    fontSize: 60,
  },
  aiPulse: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 1000,
    borderWidth: 2,
    borderColor: Colors.primary,
    opacity: 0.2,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  actionWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  getStartedBtn: {
    backgroundColor: Colors.primary,
    width: '100%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  getStartedText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  footerText: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
