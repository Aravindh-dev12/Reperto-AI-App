import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = process.env.REACT_NATIVE_API_URL || "http://localhost:8000"; // Local backend

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 8000
});

// attach token automatically
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("access_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function signup(name: string, email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Signup failed');
  return data;
}

export async function login(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Login failed');
  return data;
}

export async function getProfile() {
  const res = await api.get("/auth/me");
  return res.data;
}

export async function getCases() {
  const res = await api.get("/cases");
  return res.data;
}

export async function saveCase(caseData: { 
  name: string; 
  initials: string; 
  specialty: string; 
  time: string;
  summary?: string;
  rubrics?: string[];
  remedies?: any[];
}) {
  const res = await api.post("/cases", caseData);
  return res.data;
}

export async function parseText(text: string) {
  const res = await api.post("/ai/parse-text", { text });
  return res.data;
}

export async function analyzeCDSS(text: string) {
  const res = await api.post("/cdss/analyze", { text });
  return res.data;
}

export async function scoreRubrics(rubricPaths: string[]) {
  const res = await api.post("/cdss/score", { rubrics: rubricPaths });
  return res.data;
}
