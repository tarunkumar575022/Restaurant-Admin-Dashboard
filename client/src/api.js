import axios from "axios";

const baseURL =
  (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");

const api = axios.create({
  baseURL,
  // credentials: true, // enable only if you use cookies/auth sessions
});

export default api;
