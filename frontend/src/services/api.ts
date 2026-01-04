import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = process.env.REACT_NATIVE_API_URL || "http://10.70.118.67:8000"; // IP Address

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
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}
export async function parseText(text: string) {
  const res = await api.post("/ai/parse-text", { text });
  return res.data;
}
