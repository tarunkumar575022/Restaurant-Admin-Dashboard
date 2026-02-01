import { useEffect, useState } from "react";
import axios from "axios";

export default function useFetch(url, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNow = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(url);
      setData(res.data);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch: fetchNow };
}
