import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../services/api";

export default function Success() {
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session_id = params.get("session_id");

    const verify = async () => {
      try {
        await API.post("/payments/verify-payment/", { session_id });
      } catch {
        alert("Verification failed");
      }
      setLoading(false);
    };

    verify();
  }, []);

  return (
    <div>
      {loading ? <h2>Processing payment...</h2> : <h1>Booking Confirmed 🎉</h1>}
    </div>
  );
}