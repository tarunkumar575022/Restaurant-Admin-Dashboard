import axios from "axios";

const baseURL = (
  process.env.REACT_APP_API_URL ||
  "https://restaurant-admin-dashboard-backend-939a.onrender.com"
)
  .replace(/\/$/, "") + "/api";

const api = axios.create({
  baseURL,
});

export default api;
