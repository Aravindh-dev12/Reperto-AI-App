import axios from 'axios';
const BASE = 'http://10.0.2.2:8000'; // change to backend IP when testing on device/emulator

export const api = axios.create({
  baseURL: BASE,
  timeout: 8000
});

export async function login(email,password){
  const res = await api.post('/auth/login',{email,password});
  return res.data;
}

export async function signup(name,email,password){
  const res = await api.post('/auth/signup',{name,email,password});
  return res.data;
}

export async function parseText(text){
  const res = await api.post('/ai/parse-text',{text});
  return res.data;
}
