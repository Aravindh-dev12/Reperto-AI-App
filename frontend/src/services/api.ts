import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = process.env.REACT_NATIVE_API_URL || "http://255.255.255.0:8000";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried refreshing
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Remove invalid token
        await AsyncStorage.removeItem("access_token");
        
        // You can add logic to refresh token here if needed
        // For now, we'll just reject and let the UI handle logout
        
        return Promise.reject(error);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth functions
export async function signup(name: string, email: string, password: string) {
  const response = await api.post("/auth/signup", { name, email, password });
  return response.data;
}

export async function login(email: string, password: string) {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get("/auth/me");
  return response.data;
}

// Patient functions
export async function createPatient(patientData: any) {
  const response = await api.post("/patients/", patientData);
  return response.data;
}

export async function getPatients() {
  const response = await api.get("/patients/");
  return response.data;
}

export async function getPatient(id: number) {
  const response = await api.get(`/patients/${id}`);
  return response.data;
}

// Case functions
export async function createCase(caseData: any) {
  const response = await api.post("/cases/", caseData);
  return response.data;
}

export async function getCases() {
  const response = await api.get("/cases/");
  return response.data;
}

export async function getCase(id: number) {
  const response = await api.get(`/cases/${id}`);
  return response.data;
}

export async function analyzeCase(caseId: number, text: string) {
  const response = await api.post(`/cases/${caseId}/analyze`, { text });
  return response.data;
}

// AI functions
export async function parseText(text: string) {
  const response = await api.post("/ai/parse-text", { text });
  return response.data;
}

export async function suggestComplaint(text: string) {
  const response = await api.post("/ai/suggest-complaint", { text });
  return response.data;
}