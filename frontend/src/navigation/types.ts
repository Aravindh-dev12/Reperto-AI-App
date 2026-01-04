import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Cases: undefined;
  EditCase: { caseId?: string } | undefined;
  Review: { confirmed?: Array<{ path: string; confidence?: number; evidence?: string }> } | undefined;
  RemedyResults: undefined;
};

export type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
export type SignupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Signup'>;
export type CaseEditNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditCase'>;
export type ReviewRouteProp = RouteProp<RootStackParamList, 'Review'>;