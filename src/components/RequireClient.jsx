import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RequireClient({ children }) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user || user.role !== "client") {
      navigate("/login");
    } else {
      setChecking(false);
    }
  }, [navigate]);

  if (checking) return null;

  return children;
}
