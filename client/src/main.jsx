import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import axios from "axios";
import './index.css'
import App from './App.jsx'

/* ================= AXIOS GLOBAL CONFIG ================= */

axios.defaults.baseURL = "http://localhost:5000/api/v1";
axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
