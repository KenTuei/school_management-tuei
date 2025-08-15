import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export default axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" },
});
