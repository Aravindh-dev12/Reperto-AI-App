import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Landing: undefined;
  Login: { initialTab?: 'login' | 'signup' } | undefined;
  Signup: undefined;
  Cases: undefined;
  EditCase: { caseId?: string } | undefined;
  CaseDetail: { caseId: string };
  Review: { 
    analysisResult: {
      tokens: string[];
      rubrics: Array<{
        rubric: string;
        confidence: number;
        matched: string[];
      }>;
      remedies: any[];
    };
    doctorText: string;
  };
  RemedyResults: {
    remedies: any[];
    confirmedRubrics: string[];
  };
  Settings: undefined;
};

export type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
export type SignupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Signup'>;
export type CaseEditNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditCase'>;
export type ReviewRouteProp = RouteProp<RootStackParamList, 'Review'>;
