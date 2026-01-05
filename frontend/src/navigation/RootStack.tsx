import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import CasesScreen from '../screens/CaseListScreen';
import PatientsScreen from '../screens/PatientsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CaseEditScreen from '../screens/CaseEditScreen';
import ReviewScreen from '../screens/ReviewScreen';
import RemedyResultsScreen from '../screens/RemedyResultsScreen';

// Import components
import BottomTabNavigator from '../components/BottomTabNavigator';
import { RootStackParamList } from './types';
import { Colors } from '../styles';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Main Tabs Component
const MainTabs = () => (
  <>
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.background,
        },
        headerTintColor: Colors.primary,
        headerTitleStyle: {
          fontWeight: '700' as const,
          fontSize: 16,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Cases" 
        component={CasesScreen} 
        options={{ title: 'Cases' }}
      />
      <Stack.Screen 
        name="Patients" 
        component={PatientsScreen} 
        options={{ title: 'Patients' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'Settings' }}
      />
      <Stack.Screen 
        name="EditCase" 
        component={CaseEditScreen} 
        options={{ title: 'Analyze Case' }}
      />
      <Stack.Screen 
        name="Review" 
        component={ReviewScreen} 
        options={{ title: 'Review Symptoms' }}
      />
      <Stack.Screen 
        name="RemedyResults" 
        component={RemedyResultsScreen} 
        options={{ title: 'Remedy Results' }}
      />
    </Stack.Navigator>
    <BottomTabNavigator />
  </>
);

// Loading Component
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
    <ActivityIndicator size="large" color={Colors.primary} />
  </View>
);

export default function RootStack() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      setIsLoggedIn(!!token);
    } catch (error) {
      console.error('Error checking login status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          // Auth Screens
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : (
          // Main App
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}