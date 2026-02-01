import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "", // "" uses proxy in CRA
});

export default api;
