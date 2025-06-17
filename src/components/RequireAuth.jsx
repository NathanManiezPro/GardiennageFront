import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RequireAuth({ children }) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      navigate("/login");
    } else {
      setChecking(false); // OK, on peut afficher le contenu
    }
  }, [navigate]);

  if (checking) return null; // ou un <Loading /> si tu préfères

  return children;
}
