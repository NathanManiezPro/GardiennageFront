// src/pages/admin/Dashboard.jsx
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Dashboard() {
  const [counts, setCounts] = useState({
    users: 0,
    cars: 0,
    ticketsOpen: 0,
    ticketsInProgress: 0,
    ticketsResolved: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        // on récupère tous les utilisateurs
        const usersRes = await api.get("/users");
        // toutes les voitures
        const carsRes = await api.get("/cars");
        // tous les tickets
        const ticketsRes = await api.get("/tickets");

        const allTickets = ticketsRes.data;

        const ticketsOpen = allTickets.filter(t => t.statut === "En attente").length;
        const ticketsInProgress = allTickets.filter(t => t.statut === "En cours de traitement").length;
        // on considère "Résolu" -> statut "Fermé" en base
        const ticketsResolved = allTickets.filter(t => t.statut === "Fermé").length;

        setCounts({
          users: usersRes.data.length,
          cars: carsRes.data.length,
          ticketsOpen,
          ticketsInProgress,
          ticketsResolved,
        });
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les statistiques.");
      }
    }
    fetchData();
  }, []);

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">📊 Dashboard Admin</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Utilisateurs */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">👥 Utilisateurs</h2>
          <p className="text-4xl font-bold">{counts.users}</p>
        </div>

        {/* Voitures */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">🚗 Voitures</h2>
          <p className="text-4xl font-bold">{counts.cars}</p>
        </div>

        {/* Tickets Ouverts */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">🟡 En attente</h2>
          <p className="text-4xl font-bold">{counts.ticketsOpen}</p>
        </div>

        {/* Tickets en cours */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">🛠️ En cours</h2>
          <p className="text-4xl font-bold">{counts.ticketsInProgress}</p>
        </div>

        {/* Tickets résolus */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">✅ Résolus</h2>
          <p className="text-4xl font-bold">{counts.ticketsResolved}</p>
        </div>
      </div>
    </div>
  );
}
