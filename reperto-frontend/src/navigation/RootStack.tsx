import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import CaseListScreen from '../screens/CaseListScreen';
import CaseEditScreen from '../screens/CaseEditScreen';
import ReviewScreen from '../screens/ReviewScreen';

const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{headerShown:false}} />
      <Stack.Screen name="Cases" component={CaseListScreen} options={{title:'Cases'}} />
      <Stack.Screen name="EditCase" component={CaseEditScreen} options={{title:'Take Case'}} />
      <Stack.Screen name="Review" component={ReviewScreen} options={{title:'Review Rubrics'}} />
    </Stack.Navigator>
  );
}
