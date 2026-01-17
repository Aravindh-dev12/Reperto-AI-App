import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import CaseListScreen from '../screens/CaseListScreen';
import CaseEditScreen from '../screens/CaseEditScreen';
import CaseDetailScreen from '../screens/CaseDetailScreen';
import ReviewScreen from '../screens/ReviewScreen';
import RemedyResultsScreen from '../screens/RemedyResultsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { RootStackParamList } from './types';
import { Colors } from '../styles';

const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions = {
  headerStyle: {
    backgroundColor: Colors.background,
  },
  headerTintColor: Colors.primary,
  headerTitleStyle: {
    fontWeight: '700' as const,
    fontSize: 16,
  },
  headerShadowVisible: false,
  cardStyle: { backgroundColor: Colors.background },
};

export default function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Landing" screenOptions={screenOptions as any}>
      <Stack.Screen name="Landing" component={LandingScreen} options={{headerShown:false}} />
      <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{headerShown:false}} />
      <Stack.Screen name="Cases" component={CaseListScreen} options={{title:'Home'}} />
      <Stack.Screen name="EditCase" component={CaseEditScreen} options={{title:'Analyze Case'}} />
      <Stack.Screen name="CaseDetail" component={CaseDetailScreen} options={{title:'View Case'}} />
      <Stack.Screen name="Review" component={ReviewScreen} options={{title:'Review Symptoms'}} />
      <Stack.Screen name="RemedyResults" component={RemedyResultsScreen} options={{ title: 'Remedy Results' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Stack.Navigator>
  );
}
