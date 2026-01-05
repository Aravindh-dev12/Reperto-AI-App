import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Main: undefined;
  Home: undefined;
  Cases: undefined;
  Patients: undefined;
  Settings: undefined;
  EditCase: { caseId?: string } | undefined;
  Review: { confirmed?: Array<{ path: string; confidence?: number; evidence?: string }> } | undefined;
  RemedyResults: { caseId?: string } | undefined;
  PatientDetails: { patientId: number } | undefined;
  AddPatient: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;